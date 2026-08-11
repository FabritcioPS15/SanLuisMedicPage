import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = resolve(__dirname, '../out')

const cssCache = new Map()

function loadCss(href) {
  if (cssCache.has(href)) return cssCache.get(href)
  let css = ''
  const filePath = join(outDir, href.replace(/^\//, ''))
  if (existsSync(filePath)) {
    css = readFileSync(filePath, 'utf8')
  }
  cssCache.set(href, css)
  return css
}

function collectHtmlFiles(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      collectHtmlFiles(full, files)
    } else if (entry.endsWith('.html')) {
      files.push(full)
    }
  }
  return files
}

const linkRe = /<link[^>]*rel=["']stylesheet["'][^>]*href=["'](\/_next\/[^"']+\.css)["'][^>]*>/g

const htmlFiles = collectHtmlFiles(outDir)
let replaced = 0

for (const file of htmlFiles) {
  let html = readFileSync(file, 'utf8')
  const matches = [...html.matchAll(linkRe)]
  if (matches.length === 0) continue

  for (const match of matches) {
    const href = match[1]
    const css = loadCss(href)
    if (!css) continue
    const styleTag = `<style data-next-inlined-css>${css}</style>`
    html = html.replace(match[0], styleTag)
    replaced++
  }

  writeFileSync(file, html)
}

console.log(`[inline-css] Inlined ${replaced} stylesheet link(s) across ${htmlFiles.length} HTML file(s).`)
