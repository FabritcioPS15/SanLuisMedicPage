'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check, ArrowRight, Car, Bike, Truck, RefreshCw, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function Servicios() {
  const services = [
    {
      title: "Licencia Particular (A1)",
      description: "Examen médico completo para obtener tu primera licencia de conducir particular.",
      icon: <Car className="w-8 h-8" />,
      link: "/servicios/licencia-particular",
      price: "S/ 150"
    },
    {
      title: "Revalidación",
      description: "Renueva tu licencia vencida de forma rápida y sin complicaciones.",
      icon: <RefreshCw className="w-8 h-8" />,
      link: "/servicios/revalidacion",
      price: "S/ 120"
    },
    {
      title: "Recategorización",
      description: "Sube de categoría para conducir vehículos de mayor tonelaje o transporte público.",
      icon: <Truck className="w-8 h-8" />,
      link: "/servicios/recategorizacion",
      price: "S/ 180"
    },
    {
      title: "Licencia de Moto (B2C)",
      description: "Evaluación médica especializada para conductores de vehículos menores.",
      icon: <Bike className="w-8 h-8" />,
      link: "/servicios/licencia-moto",
      price: "S/ 100"
    }
  ]

  return (
    <div className="w-full bg-white font-sans text-slate-900">
      <Navbar active="servicios" />

      {/* Hero Banner Section */}
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
              LO QUE HACEMOS
              <span className="w-8 h-px bg-[#a3c435]"></span>
            </div>
            <div className="flex items-center justify-center gap-2 mb-6 text-[10px] font-black uppercase tracking-widest text-white/40">
              <Link href="/" className="hover:text-[#a3c435] transition-colors">Inicio</Link>
              <ChevronRight size={10} />
              <span className="text-[#a3c435]">Servicios</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8 leading-none">
              Exámenes Médicos <br /> <span className="text-[#158cca]">para Brevetes</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto font-medium">
              Evaluaciones médicas integrales con certificación inmediata ante el MTC para todo tipo de licencias de conducir.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-slate-50 border border-slate-100 p-8 flex flex-col h-full group"
              >
                <div className="w-16 h-16 bg-[#158cca] text-white flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110">
                  {service.icon}
                </div>
                <h3 className="text-xl font-black text-[#0f172a] uppercase tracking-tighter mb-4 leading-tight">
                  {service.title}
                </h3>
                <p className="text-slate-600 text-sm mb-8 flex-grow leading-relaxed font-medium">
                  {service.description}
                </p>
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-200">
                  <span className="text-[#158cca] font-black text-lg">{service.price}</span>
                  <Link href={service.link} className="w-10 h-10 bg-[#0f172a] text-white flex items-center justify-center hover:bg-[#158cca] transition-colors">
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Link / Trust Section */}
      <section className="py-24 px-4 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-black text-[#0f172a] uppercase tracking-tighter mb-6">¿Por qué elegirnos?</h2>
              <div className="space-y-4">
                {[
                  "Resultados en tiempo real con el MTC",
                  "Staff médico altamente calificado",
                  "Equipos médicos de última generación",
                  "Atención sin colas y con previa cita",
                  "Ubicaciones céntricas y seguras"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-[#a3c435] text-white flex items-center justify-center text-[10px]">
                      <Check size={12} strokeWidth={4} />
                    </div>
                    <span className="text-slate-700 font-bold text-sm uppercase tracking-tight">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-[300px] bg-[#158cca] overflow-hidden flex items-center justify-center p-12 text-center">
              <div className="relative z-10">
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-6">¿Tienes dudas adicionales?</h3>
                <Link href="/contacto">
                  <Button className="bg-white text-[#158cca] hover:bg-[#0f172a] hover:text-white font-black px-8 h-12 rounded-none transition-all uppercase text-xs tracking-widest">
                    Consulta con un asesor
                  </Button>
                </Link>
              </div>
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <Image src="/MTC.webp" alt="Watermark" fill className="object-contain" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
