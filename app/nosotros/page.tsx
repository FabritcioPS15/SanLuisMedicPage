'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function Nosotros() {
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
      <Navbar active="nosotros" />

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

      <Footer />
    </div>
  )
}
