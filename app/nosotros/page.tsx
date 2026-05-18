'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Phone, Mail, MapPin, Clock, Menu, X, Check, Stethoscope, Star, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { FaWhatsapp, FaFacebookF, FaInstagram } from 'react-icons/fa'
import { SiGooglemaps } from 'react-icons/si'
import { TopHeader } from '@/components/top-header'

export default function Nosotros() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [counters, setCounters] = useState({ years: 0, clients: 0, branches: 0 })

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const stepDuration = duration / steps
    let currentStep = 0

    const interval = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      const easeProgress = 1 - Math.pow(1 - progress, 3)

      setCounters({
        years: Math.floor(15 * easeProgress),
        clients: Math.floor(50 * easeProgress),
        branches: Math.floor(3 * easeProgress)
      })

      if (currentStep >= steps) {
        clearInterval(interval)
        setCounters({ years: 15, clients: 50, branches: 3 })
      }
    }, stepDuration)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full bg-white font-sans text-slate-900">
      <TopHeader />

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
              <Image src="/Slmlogo.png" alt="San Luis Medic Logo" width={220} height={70} className="h-12 w-auto" priority />
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-12">
            <nav className="flex gap-8 text-[13px] font-black text-slate-800 uppercase tracking-wider">
              {[
                { id: 'inicio', label: 'Inicio', href: '/' },
                { id: 'nosotros', label: 'Nosotros', href: '/nosotros' },
                { id: 'servicios', label: 'Servicios', href: '/servicios' },
                { id: 'sedes', label: 'Sedes', href: '/sedes' }
              ].map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`relative py-1 transition-colors duration-300 ${item.id === 'nosotros' ? 'text-[#158cca]' : 'hover:text-[#158cca]'}`}
                >
                  {item.label}
                  {item.id === 'nosotros' && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#158cca]"
                      initial={false}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
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
              <Image src="/Slmlogo.png" alt="San Luis Medic Logo" width={240} height={70} className="h-10 w-auto" priority />
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
                { href: "/servicios", text: "Servicios" },
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

      {/* Hero Section */}
      <section className="bg-[#0f172a] py-16 px-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-[#158cca]/10 -skew-x-12 translate-x-1/2" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-xs text-[#a3c435] font-bold mb-4 uppercase tracking-[0.3em] flex items-center gap-2 justify-center">
              <span className="w-8 h-px bg-[#a3c435]"></span>
              CONÓCENOS
              <span className="w-8 h-px bg-[#a3c435]"></span>
            </div>
            <div className="flex items-center justify-center gap-2 mb-6 text-[10px] font-black uppercase tracking-widest text-white/40">
              <Link href="/" className="hover:text-[#a3c435] transition-colors">Inicio</Link>
              <ChevronRight size={10} />
              <span className="text-[#a3c435]">Nosotros</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8 leading-none">
              Quiénes <span className="text-[#158cca]">Somos</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto font-medium">
              Líderes en evaluaciones médicas certificadas por el MTC, garantizando seguridad y confianza en cada trámite vial.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="p-10 bg-slate-50 border border-slate-100">
              <div className="text-5xl font-black text-[#158cca] mb-2">{counters.years}+</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Años de Trayectoria</div>
            </div>
            <div className="p-10 bg-[#158cca] text-white">
              <div className="text-5xl font-black mb-2">{counters.clients}K+</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Conductores Certificados</div>
            </div>
            <div className="p-10 bg-slate-50 border border-slate-100">
              <div className="text-5xl font-black text-[#158cca] mb-2">{counters.branches}</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Sedes Estratégicas</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-black text-[#0f172a] mb-8 uppercase tracking-tighter leading-none">
                Liderazgo y <br /> <span className="text-[#158cca]">Excelencia Médica</span>
              </h2>
              <div className="space-y-6 text-slate-600 text-base leading-relaxed">
                <p>
                  Corporación San Luis Medic nació con la visión de profesionalizar el proceso de obtención de licencias de conducir en el Perú. Entendemos que cada evaluación médica es un paso crítico para salvaguardar vidas en nuestras carreteras.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 pt-4">
                  {[
                    "Certificación MTC Vigente",
                    "Tecnología Biométrica",
                    "Infraestructura Moderna",
                    "Atención Personalizada",
                    "Ética Profesional",
                    "Compromiso Vial"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#a3c435] rounded-full" />
                      <span className="text-sm font-bold text-slate-800">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative h-[500px] w-full bg-slate-100 border-l-8 border-[#158cca] overflow-hidden group">
                <Image
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Instalaciones San Luis Medic"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[#0f172a]/20" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer Premium */}
      <footer className="bg-[#0f172a] py-20 px-4 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#158cca]/5 -skew-x-12 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-64 h-64 bg-[#a3c435]/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-[#158cca]/10 rounded-full blur-[60px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-4 gap-12 lg:gap-16 mb-16 border-b border-white/10 pb-16">
            <div className="md:col-span-2 pr-0 md:pr-12">
              <div className="bg-white/5 inline-block p-4 rounded-none mb-8 border border-white/10 relative group">
                <div className="absolute inset-0 bg-[#158cca]/20 translate-x-2 translate-y-2 -z-10 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
                <Image src="/Slmlogo.png" alt="San Luis Medic Logo" width={200} height={50} className="h-10 w-auto brightness-0 invert" />
              </div>
              <p className="text-sm text-slate-400 mb-8 leading-relaxed max-w-md font-medium">
                Corporación líder en evaluaciones médicas certificadas por el MTC para licencias de conducir. Brindamos confianza, rapidez y seguridad vial a nivel nacional con más de 15 años de experiencia.
              </p>
              <div className="flex gap-4">
                <a href="https://wa.me/51999888777" target="_blank" rel="noreferrer" className="w-12 h-12 bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-[#25D366] hover:border-[#25D366] transition-all duration-300 hover:-translate-y-1">
                  <FaWhatsapp size={20} />
                </a>
                <a href="#" className="w-12 h-12 bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-[#1877f2] hover:border-[#1877f2] transition-all duration-300 hover:-translate-y-1">
                  <FaFacebookF size={18} />
                </a>
                <a href="#" className="w-12 h-12 bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-[#E4405F] hover:border-[#E4405F] transition-all duration-300 hover:-translate-y-1">
                  <FaInstagram size={18} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-black text-white text-sm uppercase tracking-widest mb-8 flex items-center gap-3">
                <span className="w-4 h-0.5 bg-[#a3c435]"></span>
                Navegación
              </h4>
              <ul className="space-y-4 text-sm font-bold text-slate-400">
                <li><Link href="/" className="hover:text-[#a3c435] hover:translate-x-1 transition-transform flex items-center gap-2"><ChevronRight size={14} className="text-[#158cca]" /> Inicio</Link></li>
                <li><Link href="/nosotros" className="hover:text-[#a3c435] hover:translate-x-1 transition-transform flex items-center gap-2"><ChevronRight size={14} className="text-[#158cca]" /> Nosotros</Link></li>
                <li><Link href="/servicios" className="hover:text-[#a3c435] hover:translate-x-1 transition-transform flex items-center gap-2"><ChevronRight size={14} className="text-[#158cca]" /> Servicios</Link></li>
                <li><Link href="/sedes" className="hover:text-[#a3c435] hover:translate-x-1 transition-transform flex items-center gap-2"><ChevronRight size={14} className="text-[#158cca]" /> Nuestras Sedes</Link></li>
                <li><Link href="/contacto" className="hover:text-[#a3c435] hover:translate-x-1 transition-transform flex items-center gap-2"><ChevronRight size={14} className="text-[#158cca]" /> Contacto</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-white text-sm uppercase tracking-widest mb-8 flex items-center gap-3">
                <span className="w-4 h-0.5 bg-[#158cca]"></span>
                Contacto Central
              </h4>
              <ul className="space-y-5 text-sm text-slate-400 font-medium">
                <li className="flex items-start gap-4 group">
                  <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#a3c435]/10 transition-colors">
                    <MapPin size={18} className="text-[#a3c435]" />
                  </div>
                  <span className="mt-2 leading-relaxed">Av. Carlos Izaguirre 108, Independencia, Lima</span>
                </li>
                <li className="flex items-center gap-4 group">
                  <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#158cca]/10 transition-colors">
                    <Phone size={18} className="text-[#158cca]" />
                  </div>
                  <span>(01) 642-9971</span>
                </li>
                <li className="flex items-center gap-4 group">
                  <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#a3c435]/10 transition-colors">
                    <Mail size={18} className="text-[#a3c435]" />
                  </div>
                  <span>info@sanluismedic.pe</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              © {new Date().getFullYear()} CORPORACIÓN SAN LUIS MEDIC S.A.C.
            </p>
            <Link 
              href="https://sparktreestudio.com/" 
              target="_blank" 
              className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
            >
              desarrollado por: Sparktree Studio
            </Link>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
