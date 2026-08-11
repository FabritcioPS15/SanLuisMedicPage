'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Mail, MapPin, Menu, Phone, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { SiGooglemaps } from 'react-icons/si'
import { TopHeader } from '@/components/top-header'

const NAV_ITEMS = [
  { id: 'inicio', label: 'Inicio', href: '/' },
  { id: 'nosotros', label: 'Nosotros', href: '/nosotros' },
  { id: 'servicios', label: 'Servicios', href: '/servicios' },
  { id: 'sedes', label: 'Sedes', href: '/sedes' },
]

const SERVICES_DROPDOWN = [
  { label: 'Licencia Particular (A1)', href: '/servicios/licencia-particular' },
  { label: 'Revalidación', href: '/servicios/revalidacion' },
  { label: 'Recategorización', href: '/servicios/recategorizacion' },
  { label: 'Licencia de Moto (B2C)', href: '/servicios/licencia-moto' },
]

interface NavbarProps {
  active?: string
  home?: boolean
  dark?: boolean
}

export function Navbar({ active, home = false, dark = false }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      {dark ? (
        <div className="bg-[#0f172a] text-white text-[11px] py-2.5 px-4 hidden md:block">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-6 font-medium">
              <a href="tel:016429971" className="flex items-center gap-2 hover:text-[#a3c435] transition-colors">
                <Phone size={14} className="text-[#a3c435]" /> (01) 642-9971
              </a>
              <a href="https://wa.me/51999888777" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#a3c435] transition-colors">
                <FaWhatsapp size={14} className="text-[#a3c435]" /> +51 999 888 777
              </a>
              <a href="mailto:info@sanluismedic.pe" className="flex items-center gap-2 hover:text-[#a3c435] transition-colors">
                <Mail size={14} className="text-[#a3c435]" /> info@sanluismedic.pe
              </a>
            </div>
            <div className="flex items-center gap-4 border-l border-white/10 pl-4">
              <a href="#" className="hover:text-[#a3c435] transition-colors"><FaFacebookF size={14} /></a>
              <a href="#" className="hover:text-[#a3c435] transition-colors"><FaInstagram size={14} /></a>
              <a href="#" className="hover:text-[#a3c435] transition-colors"><SiGooglemaps size={14} /></a>
            </div>
          </div>
        </div>
      ) : (
        <TopHeader />
      )}

      {/* Navigation Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <Image src="/Slmlogo.webp" alt="San Luis Medic Logo" width={220} height={70} className="h-12 w-auto" sizes="220px" priority />
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-12">
            <nav className="flex gap-8 text-[13px] font-black text-slate-800 uppercase tracking-wider">
              {NAV_ITEMS.map((item) => (
                <div key={item.id} className="relative group/nav">
                  <Link
                    href={item.href}
                    className={`relative py-1 transition-colors duration-300 ${active === item.id ? 'text-[#158cca]' : 'hover:text-[#158cca]'}`}
                  >
                    {item.label}
                    {active === item.id && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#158cca]"
                        initial={false}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                  {home && item.id === 'servicios' && (
                    <div className="absolute top-full left-0 mt-4 w-64 bg-[#0f172a] border border-white/10 shadow-2xl opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-300 translate-y-2 group-hover/nav:translate-y-0 z-50">
                      <div className="py-2">
                        {SERVICES_DROPDOWN.map((sub, sIdx) => (
                          <Link
                            key={sIdx}
                            href={sub.href}
                            className="block px-6 py-3 text-[10px] font-black text-white/70 hover:text-white hover:bg-white/5 transition-colors uppercase tracking-widest border-b border-white/5 last:border-0"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <Link href="/contacto">
              <Button className="bg-[#158cca] hover:bg-[#0f172a] text-white font-black text-xs uppercase tracking-widest h-12 px-8 rounded-none transition-all">
                Reserva Ahora
              </Button>
            </Link>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden flex items-center justify-center w-12 h-12 bg-slate-50 text-[#0f172a] hover:bg-slate-100 transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu Fullscreen */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-[#0f172a] md:hidden"
        >
          <div className="relative w-full h-full flex flex-col">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <Image src="/Slmlogo.webp" alt="San Luis Medic Logo" width={240} height={70} className="h-10 w-auto" sizes="240px" loading="lazy" />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center w-12 h-12 bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Mobile Menu Navigation */}
            <nav className="flex flex-col items-center justify-center px-6 py-12 space-y-6">
              {[
                { href: "/", text: "Inicio" },
                { href: "/nosotros", text: "Nosotros" },
                { href: home ? "/#precios" : "/servicios", text: "Servicios" },
                { href: "/sedes", text: "Sedes" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl font-black text-white hover:text-[#a3c435] transition-colors text-center uppercase tracking-tighter"
                  >
                    {item.text}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="pt-4"
              >
                <Link href="/contacto" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="bg-[#158cca] hover:bg-[#0f172a] text-white font-black text-sm uppercase tracking-widest h-14 px-10 rounded-none transition-all shadow-lg">
                    Contáctanos
                  </Button>
                </Link>
              </motion.div>
            </nav>

            {/* Mobile Menu Footer */}
            <div className="p-6 border-t border-slate-700 mt-auto">
              <div className="flex flex-col items-center space-y-3 text-slate-300 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>Av. Carlos Izaguirre 108, Independencia</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  <span>(01) 642-9971</span>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <a href="https://wa.me/51999888777" target="_blank" rel="noreferrer" className="text-white hover:text-[#25D366] transition-colors">
                    <FaWhatsapp size={20} />
                  </a>
                  <a href="#" className="text-white hover:text-[#1877f2] transition-colors">
                    <FaFacebookF size={18} />
                  </a>
                  <a href="#" className="text-white hover:text-[#E4405F] transition-colors">
                    <FaInstagram size={18} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  )
}
