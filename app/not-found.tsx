'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, MapPin, Stethoscope } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { TopHeader } from '@/components/top-header'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden selection:bg-[#158cca] selection:text-white">
      <TopHeader />

      {/* Background Watermark 404 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-[40vw] font-black text-[#158cca]/5 leading-none select-none tracking-tighter"
        >
          404
        </motion.div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#158cca]/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-[#a3c435]/5 rounded-full blur-[80px] -z-10" />

      {/* Simple Header for 404 */}
      <header className="bg-white border-b border-slate-100 shadow-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/">
            <Image src="/Slmlogo.webp" alt="San Luis Medic Logo" width={180} height={60} className="h-10 w-auto" />
          </Link>
          <Link href="/" className="text-slate-600 hover:text-[#158cca] transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
            <Home size={18} />
            <span className="hidden sm:inline">Volver al Inicio</span>
          </Link>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4 py-20 relative z-10">
        <div className="max-w-4xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-black text-[#0f172a] mb-6 leading-tight uppercase tracking-tighter">
              ¡Ups! Página <span className="text-[#158cca]">no encontrada</span>
            </h1>

            <p className="text-slate-600 text-lg md:text-xl mb-12 leading-relaxed font-medium max-w-2xl mx-auto">
              Lo sentimos, la página que buscas no existe o ha sido movida. Pero no te preocupes, ¡podemos ayudarte a retomar tu trámite!
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-12 max-w-2xl mx-auto">
              <Link href="/sedes" className="group p-6 bg-white border border-slate-100 hover:border-[#a3c435] transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="flex items-center gap-4 text-slate-800 group-hover:text-[#a3c435]">
                  <div className="w-12 h-12 bg-[#a3c435]/10 flex items-center justify-center group-hover:bg-[#a3c435] group-hover:text-white transition-colors">
                    <MapPin size={24} />
                  </div>
                  <span className="font-bold text-sm uppercase tracking-wider">Nuestras sedes</span>
                </div>
              </Link>
              <Link href="/servicios" className="group p-6 bg-white border border-slate-100 hover:border-[#158cca] transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="flex items-center gap-4 text-slate-800 group-hover:text-[#158cca]">
                  <div className="w-12 h-12 bg-[#158cca]/10 flex items-center justify-center group-hover:bg-[#158cca] group-hover:text-white transition-colors">
                    <Stethoscope size={24} />
                  </div>
                  <span className="font-bold text-sm uppercase tracking-wider">Nuestros servicios</span>
                </div>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/" className="w-full sm:w-auto">
                <Button className="w-full bg-[#158cca] hover:bg-[#0f172a] text-white font-black px-12 h-16 rounded-none text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20">
                  <Home size={18} />
                  Ir al inicio
                </Button>
              </Link>
              <button
                onClick={() => window.history.back()}
                className="w-full sm:w-auto flex items-center justify-center gap-2 text-slate-500 hover:text-[#0f172a] font-bold text-sm uppercase tracking-widest transition-colors h-16 px-10 border border-transparent hover:border-slate-200"
              >
                <ArrowLeft size={18} />
                Regresar
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Simplified Footer for 404 */}
      <footer className="bg-white border-t border-slate-100 py-10 px-4 relative z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
            <span className="text-[#158cca]">San Luis Medic</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full" />
            <span>Autorizado por MTC</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">
            © {new Date().getFullYear()} CORPORACIÓN SAN LUIS MEDIC S.A.C. TODOS LOS DERECHOS RESERVADOS.
          </p>
        </div>
      </footer>
    </div>
  )
}
