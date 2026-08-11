'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Check, ChevronRight, MapPin, Star, Clock, Stethoscope, AlertCircle, ChevronDown } from 'lucide-react'
import { motion, Variants } from 'framer-motion'
import Image from 'next/image'
import { FaWhatsapp, FaFlask, FaBrain, FaEye, FaStethoscope, FaFileMedical } from 'react-icons/fa'
import dynamic from 'next/dynamic'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

// Lazy load the map section - removes ~200KB of Leaflet from initial bundle
const MapSection = dynamic(() => import('@/components/map-section'), {
  ssr: false,
  loading: () => (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 h-[500px] border border-slate-100 shadow-xl bg-slate-100 animate-pulse flex items-center justify-center">
        <div className="text-slate-400 text-sm font-medium">Cargando mapa...</div>
      </div>
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-100 animate-pulse border border-slate-100" />)}
      </div>
    </div>
  )
})


export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [counters, setCounters] = useState({ years: 0, clients: 0, branches: 0 })
  const [countersStarted, setCountersStarted] = useState(false)
  const [isHeroDropdownOpen, setIsHeroDropdownOpen] = useState(false)
  const [isPricingDropdownOpen, setIsPricingDropdownOpen] = useState(false)
  const [pricingSede, setPricingSede] = useState(0)
  const [activeSection, setActiveSection] = useState('inicio')
  const [activeCard, setActiveCard] = useState<number | null>(null)

  const sedes = [
    { name: 'Sede Lima (Izaguirre)', whatsapp: '999888777', phone: '(01) 642-9971', address: 'Av. Carlos Izaguirre 108, Independencia' },
    { name: 'Sede Andahuaylas', whatsapp: '944777666', phone: '(054) 234-567', address: 'Jr. Alfonso Ugarte N.º. 354' },
    { name: 'Sede Ayacucho', whatsapp: '944666555', phone: '(044) 345-678', address: 'Jr. José Santos Chocano N°410' }
  ];

  const getWhatsAppUrl = (message: string, whatsapp: string) => {
    return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
  };

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Counter animation effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !countersStarted) {
            setCountersStarted(true)
            animateCounters()
          }
        })
      },
      { threshold: 0.5 }
    )

    const statsSection = document.getElementById('stats-section')
    if (statsSection) {
      observer.observe(statsSection)
    }

    return () => {
      if (statsSection) {
        observer.unobserve(statsSection)
      }
    }
  }, [countersStarted])

  const animateCounters = () => {
    const duration = 2000 // 2 seconds
    const steps = 60
    const stepDuration = duration / steps

    let currentStep = 0

    const interval = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      const easeProgress = 1 - Math.pow(1 - progress, 3) // Ease out cubic

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
  }

  const fadeIn: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="w-full bg-slate-50 font-sans text-slate-900 selection:bg-[#158cca] selection:text-white">
      {/* Floating WhatsApp Button */}
      <motion.a
        href="https://wa.me/51999999999"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl shadow-green-500/30 flex items-center justify-center hover:bg-[#20bd5a] transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <FaWhatsapp size={32} />
      </motion.a>

      <Navbar active={activeSection} home />

      {/* Section 1: Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-white">
        {/* Blurred Medical Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=40"
            alt="Centro Médico Background"
            fill
            sizes="100vw"
            className="object-cover opacity-10 blur-sm"
          />
          <div className="absolute inset-0 bg-white/60" />
        </div>
        {/* MTC Watermark Background */}
        <div className="absolute left-1/3 -bottom-20 w-[900px] h-[600px] opacity-[0.03] pointer-events-none z-0">
          <Image
            src="/MTC.webp"
            alt="MTC Watermark"
            fill
            sizes="900px"
            className="object-contain"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 w-full relative z-10 pt-12 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="w-10 h-0.5 bg-[#a3c435]"></span>
                <span className="text-slate-600 text-sm font-bold tracking-wide italic">¡Reserva Ahora tu Cita para el Examen Médico!</span>
              </div>

              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0f172a] leading-tight mb-6">
                Examen Médico <br />
                <span className="text-[#158cca]">para Brevete - MTC</span>
              </h1>

              <h2 className="text-xl md:text-2xl font-bold text-[#0f172a] mb-6 leading-relaxed">
                ¿Necesitas sacar tu brevete nuevo o revalidar? <br />
                <span className="text-[#158cca]">¡Obtén tu Licencia de Conducir en un día!</span>
              </h2>

              <p className="text-slate-600 mb-10 text-base leading-relaxed max-w-2xl font-medium">
                Reserva tu Cita el día y la hora que mejor se adapte para que asistas a nuestro Centro Médico Autorizado. En San Luis Medic contamos con un Staff Médico preparado para agilizar el Examen Médico para Brevete. Además estamos Avalados por el MTC y la Super-Intendencia de Salud para Emitir Certificados Médicos para Brevete Legales.
              </p>

              <h3 className="text-lg font-black text-[#0f172a] uppercase tracking-tighter mb-4">
                Examen Médico para Brevete en Lima
              </h3>
              <ul className="space-y-3 mb-10">
                {[
                  "Elige la Fecha y Hora del Examen",
                  "Obtén tu Certificado en tan solo ¡2 horas y media!",
                  "Te asistimos con los Trámites del MTC",
                  "Paga con Tarjeta de Débito o Crédito"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-700 font-bold italic text-[13px] leading-tight">
                    <div className="w-1.5 h-1.5 bg-[#158cca] rounded-full shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                  <Button
                    onClick={() => setIsHeroDropdownOpen(!isHeroDropdownOpen)}
                    className="bg-[#158cca] hover:bg-[#0f172a] text-white font-black px-10 h-14 rounded-none text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all flex items-center gap-3 w-full sm:w-auto"
                  >
                    <span>Reservar Cita Ahora</span>
                    <ChevronDown size={20} className={`transition-transform duration-300 ${isHeroDropdownOpen ? 'rotate-180' : ''}`} />
                  </Button>

                  {isHeroDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 mt-3 w-72 bg-white border border-slate-100 shadow-2xl z-[100] p-2"
                    >
                      {sedes.map((sede, index) => (
                        <a
                          key={index}
                          href={getWhatsAppUrl(`Hola San Luis Medic, quiero reservar una cita en la sede ${sede.name}`, sede.whatsapp)}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-none bg-slate-100 flex items-center justify-center text-[#158cca] group-hover:bg-[#158cca] group-hover:text-white transition-colors">
                            <MapPin size={18} />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm uppercase tracking-tighter">{sede.name}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Agendar vía WhatsApp</div>
                          </div>
                        </a>
                      ))}
                    </motion.div>
                  )}
                </div>

                <div className="flex flex-col items-start opacity-40 hover:opacity-100 transition-opacity duration-500">
                  <div className="relative w-32 h-10">
                    <Image
                      src="/MTC.webp"
                      alt="Autorizado por MTC"
                      fill
                      sizes="128px"
                      className="object-contain object-left"
                    />
                  </div>

                </div>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative hidden lg:block h-[700px]"
            >
              <div className="relative h-full w-full flex items-end">
                {/* Decorative Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#158cca]/5 rounded-full blur-[100px] -z-10" />
                <div className="absolute top-1/4 right-0 w-32 h-32 bg-[#a3c435]/10 rounded-full blur-[50px] -z-10" />

                <Image
                  src="/Doctor SLM.webp"
                  alt="Doctora Profesional San Luis Medic"
                  fill
                  sizes="(max-width: 1024px) 0px, 50vw"
                  className="object-contain object-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
                  priority
                />

                {/* Floating Feedback Tag */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-20 -left-10 bg-white p-5 shadow-2xl border border-slate-50 z-20 hidden xl:block"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#a3c435] flex items-center justify-center text-white">
                      <Clock size={24} />
                    </div>
                    <div>
                      <div className="text-xl font-black text-[#0f172a]">2.5 Horas</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resultados Garantizados</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2: Acerca de Nosotros */}
      <section id="nosotros" className="py-24 px-4 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <div className="text-xs text-[#a3c435] font-bold mb-3 uppercase tracking-widest flex items-center gap-2 justify-center">
              <span className="w-6 h-px bg-[#a3c435]"></span>
              CONÓCENOS
              <span className="w-6 h-px bg-[#a3c435]"></span>
            </div>
            <h2 className="font-heading text-4xl font-extrabold text-[#0f172a] mb-6">Corporación San Luis Medic</h2>
            <p className="text-slate-600 text-lg">Más de 15 años liderando evaluaciones médicas para conductores en el Perú, con cobertura nacional y compromiso con la seguridad vial.</p>
          </motion.div>

          <div id="stats-section" className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#158cca] mb-2">
                {counters.years}+
              </div>
              <p className="text-sm text-slate-600">Años de experiencia</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#158cca] mb-2">
                {counters.clients}K+
              </div>
              <p className="text-sm text-slate-600">Conductores certificados</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#158cca] mb-2">
                {counters.branches}
              </div>
              <p className="text-sm text-slate-600">Sedes a nivel nacional</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-[#0f172a] mb-6">Líderes en Evaluaciones Médicas</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Como Corporación San Luis Medic, nos enorgullece ser la red más grande de centros médicos especializados en evaluaciones para licencias de conducir, con presencia estratégica en Lima y provincias.
              </p>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Nuestro compromiso va más allá de las evaluaciones: promovemos una cultura de seguridad vial a través de servicios médicos de excelencia y tecnología de punta.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#a3c435] rounded-full"></div>
                  <span className="text-slate-700">Cobertura nacional</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#a3c435] rounded-full"></div>
                  <span className="text-slate-700">Tecnología médica avanzada</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#a3c435] rounded-full"></div>
                  <span className="text-slate-700">Personal altamente calificado</span>
                </li>
              </ul>
            </div>
            <div className="relative h-96 bg-slate-100 overflow-hidden border-l-4 border-[#158cca]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#158cca]/10 to-[#a3c435]/10 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-white flex items-center justify-center mx-auto mb-4 shadow-xl border border-slate-100">
                    <Stethoscope size={48} className="text-[#158cca]" />
                  </div>
                  <p className="text-slate-900 font-black uppercase tracking-widest text-sm">Excelencia Nacional</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Proceso de Evaluación MTC */}
      <section id="proceso" className="py-24 px-4 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="mb-16"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-0.5 bg-[#a3c435]"></span>
              <span className="text-[#a3c435] text-xs font-bold uppercase tracking-widest">EXAMEN MÉDICO DE APTITUD</span>
            </div>
            <h3 className="font-heading text-4xl font-extrabold text-[#0f172a] mb-6">Proceso de Evaluación MTC</h3>
            <p className="text-slate-500 text-base max-w-3xl leading-relaxed">
              Nuestras evaluaciones cumplen estrictamente con la Directiva N° 001-2023-MTC/18, garantizando un perfil de conductor apto y seguro.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 border border-slate-100 rounded-none overflow-hidden shadow-sm mb-12"
          >
            {[
              {
                icon: <FaFlask size={20} className="text-[#158cca]" />,
                title: 'LABORATORIO',
                details: ['Glucosa', 'Hemoglobina', 'Grupo Sanguíneo']
              },
              {
                icon: <FaBrain size={20} className="text-[#158cca]" />,
                title: 'PSICOLÓGICA',
                details: ['Coordinación', 'Reacción', 'Atención']
              },
              {
                icon: <FaFileMedical size={20} className="text-[#158cca]" />,
                title: 'AUDITIVA',
                details: ['Percepción sonidos', 'Audiometría básica', 'Orientación']
              },
              {
                icon: <FaEye size={20} className="text-[#158cca]" />,
                title: 'VISUAL',
                details: ['Agudeza visual', 'Campo visual', 'Test de colores']
              },
              {
                icon: <FaStethoscope size={20} className="text-[#158cca]" />,
                title: 'MÉDICA GRAL.',
                details: ['Presión arterial', 'Peso / Talla', 'Salud general']
              }
            ].map((step, idx) => (
              <div
                key={idx}
                className={`bg-white p-8 flex flex-col items-start text-left border-slate-100 ${idx !== 4 ? 'lg:border-r' : ''} ${idx < 3 ? 'md:border-r' : ''} border-b lg:border-b-0`}
              >
                <div className="w-10 h-10 bg-blue-50 rounded-none flex items-center justify-center mb-6">
                  {step.icon}
                </div>
                <h4 className="text-sm font-black text-[#0f172a] mb-6">
                  {idx + 1}. {step.title}
                </h4>
                <ul className="space-y-3">
                  {step.details.map((detail, dIdx) => (
                    <li key={dIdx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[#a3c435] rounded-full flex-shrink-0"></div>
                      <span className="text-sm text-slate-500 font-medium">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Aprobado Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#0f172a] p-10 rounded-none flex items-center gap-8 shadow-xl"
            >
              <div className="w-14 h-14 bg-[#a3c435] rounded-none flex items-center justify-center flex-shrink-0">
                <Check size={28} className="text-[#0f172a]" strokeWidth={3} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-3">Resultado: Aprobado</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Se emite el Certificado Médico Digital inmediatamente después de la firma biométrica, habilitando su carga al sistema nacional del MTC.
                </p>
              </div>
            </motion.div>

            {/* Observado Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-none border border-slate-100 flex items-center gap-8 shadow-sm"
            >
              <div className="w-14 h-14 bg-blue-50 rounded-none flex items-center justify-center flex-shrink-0">
                <AlertCircle size={24} className="text-[#158cca]" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-[#0f172a] mb-3">Resultado: Observado</h4>
                <p className="text-slate-500 text-sm leading-relaxed">
                  El postulante recibirá indicaciones médicas específicas para subsanar la observación (ej. uso de lentes, tratamiento especializado) antes de continuar.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 4: Precios */}
      <section id="precios" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <div className="text-xs text-[#a3c435] font-bold mb-3 uppercase tracking-widest flex items-center gap-2 justify-center">
              <span className="w-6 h-px bg-[#a3c435]"></span>
              Tarifario Claro
              <span className="w-6 h-px bg-[#a3c435]"></span>
            </div>
            <h3 className="font-heading text-4xl font-extrabold text-[#0f172a] mb-6">Elige el servicio que necesitas</h3>
            <p className="text-slate-600 text-lg">Precios transparentes sin costos ocultos. Incluyen todo lo necesario para tu trámite en el MTC.</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="flex justify-center mb-12"
          >
            <div className="relative w-full max-w-md">
              <button
                onClick={() => setIsPricingDropdownOpen(!isPricingDropdownOpen)}
                className="w-full px-8 py-4 font-bold transition-all duration-300 border-2 bg-white border-slate-100 text-slate-700 hover:border-[#158cca]/30 flex items-center justify-between"
              >
                <span>{pricingSede === null ? 'Selecciona tu sede' : sedes[pricingSede].name}</span>
                <ChevronDown size={20} className={`transition-transform duration-300 ${isPricingDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isPricingDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 mt-2 w-full bg-white border border-slate-100 shadow-2xl z-50"
                >
                  {sedes.map((sede, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setPricingSede(idx)
                        setIsPricingDropdownOpen(false)
                      }}
                      className={`w-full px-8 py-4 font-bold transition-all duration-300 text-left hover:bg-slate-50 ${pricingSede === idx ? 'bg-[#158cca]/10 text-[#158cca]' : 'text-slate-700'}`}
                    >
                      {sede.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-0 border border-slate-100"
          >
            {[
              {
                title: "Nuevo A I",
                subtitle: "Primera licencia",
                image: "https://images.unsplash.com/photo-1580281657527-47f249e8f4df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                features: ["Examen Psicológico", "Examen Visual y Auditivo", "Médico General", "Registro Biométrico"],
                prices: [
                  { regular: 180, web: 150 }, // Lima
                  { regular: 160, web: 130 }, // Andahuaylas
                  { regular: 170, web: 140 }  // Ayacucho
                ]
              },
              {
                title: "Revalidación",
                subtitle: "Renueva tu licencia",
                image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                features: ["Actualización MTC", "Evaluación Visual", "Médica Breve", "Firma Biométrica"],
                prices: [
                  { regular: 180, web: 150 }, // Lima
                  { regular: 160, web: 130 }, // Andahuaylas
                  { regular: 170, web: 140 }  // Ayacucho
                ]
              },
              {
                title: "Recategorización",
                subtitle: "Sube de categoría",
                image: "https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                features: ["Evaluación completa", "Pruebas avanzadas", "Psicotécnico", "Certificación MTC"],
                prices: [
                  { regular: 220, web: 180 }, // Lima
                  { regular: 200, web: 160 }, // Andahuaylas
                  { regular: 210, web: 170 }  // Ayacucho
                ]
              },
              {
                title: "Licencia Moto",
                subtitle: "Categoría B-II",
                image: "https://images.unsplash.com/photo-1558981403-c5f91cbba527?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                features: ["Examen Médico Moto", "Evaluación Visual", "Psicológico Básico", "Carga al Sistema"],
                prices: [
                  { regular: 150, web: 120 }, // Lima
                  { regular: 130, web: 100 }, // Andahuaylas
                  { regular: 140, web: 110 }  // Ayacucho
                ]
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeIn}
                onClick={() => setActiveCard(activeCard === idx ? null : idx)}
                className="relative h-[500px] overflow-hidden group cursor-pointer border-r border-slate-100 last:border-r-0"
              >
                {/* Initial View: Title */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center bg-white z-10 transition-all duration-500 ${activeCard === idx ? 'translate-y-[-100%]' : 'group-hover:translate-y-[-100%]'}`}>
                  <h3 className="text-2xl font-black text-[#0f172a] uppercase tracking-tighter">{item.title}</h3>
                  <div className="mt-4 flex flex-col items-center">
                    <span className="text-xs text-slate-400 line-through">S/ {item.prices[pricingSede].regular}.00</span>
                    <span className="text-xl font-black text-[#158cca]">S/ {item.prices[pricingSede].web}.00</span>
                    <span className="text-[10px] font-bold text-[#a3c435] uppercase tracking-wider mt-1">Precio Web</span>
                  </div>
                  <div className={`w-12 h-1 bg-[#158cca] mt-6 transition-all duration-500 ${activeCard === idx ? 'w-24' : 'group-hover:w-24'}`}></div>
                </div>

                {/* Hover View: Content & Image */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className={`object-cover transition-transform duration-700 ${activeCard === idx ? 'scale-110' : 'group-hover:scale-110'}`}
                  />
                  <div className="absolute inset-0 bg-[#0f172a]/80"></div>
                </div>

                {/* Content Overlay */}
                <div className={`absolute inset-0 p-10 flex flex-col justify-between z-20 transition-all duration-500 delay-100 ${activeCard === idx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 group-hover:opacity-100 group-hover:translate-y-0'}`}>
                  <div>
                    <span className="text-[#a3c435] text-xs font-bold uppercase tracking-widest">{item.subtitle}</span>
                    <h3 className="text-3xl font-black text-white mt-2 uppercase tracking-tighter">{item.title}</h3>
                  </div>

                  <div>
                    <div className="mb-6">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-white/40 text-sm line-through">S/ {item.prices[pricingSede].regular}.00</span>
                        <span className="text-white/60 text-xs uppercase font-bold tracking-widest">Precio Regular</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-[#a3c435]">S/ {item.prices[pricingSede].web}<span className="text-lg">.00</span></span>
                        <span className="text-[#a3c435] text-xs font-bold uppercase tracking-widest bg-[#a3c435]/10 px-2 py-0.5">Especial Web</span>
                      </div>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {item.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2 text-white/80 text-sm">
                          <Check size={14} className="text-[#a3c435]" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-col gap-3">
                      <a
                        href={`https://wa.me/51${sedes[pricingSede].whatsapp.replace(/\s/g, '')}?text=Hola%20San%20Luis%20Medic%20sede%20${sedes[pricingSede].name},%20quiero%20información%20sobre%20el%20precio%20web%20de%20${item.title.replace(' ', '%20')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full"
                      >
                        <Button className="w-full bg-[#158cca] hover:bg-[#1176ab] text-white font-bold h-12 rounded-none uppercase tracking-widest text-xs">
                          Inscríbete ahora
                        </Button>
                      </a>
                      <Link href={`${["/servicios/licencia-particular", "/servicios/revalidacion", "/servicios/recategorizacion", "/servicios/licencia-moto"][idx]}?sede=${pricingSede}`} className="text-center text-white/60 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-colors">
                        Conoce más sobre este trámite →
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Decorative Growing Bar */}
                <div className={`absolute bottom-0 left-0 w-full bg-[#a3c435] transition-all duration-500 opacity-50 ${activeCard === idx ? 'h-2' : 'h-0 group-hover:h-2'}`}></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section 7: Nuestras Sedes */}
      <section id="sedes" className="py-24 px-4 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center max-w-2xl mx-auto mb-20"
          >
            <div className="text-xs text-[#a3c435] font-bold mb-3 uppercase tracking-widest flex items-center gap-2 justify-center">
              <span className="w-6 h-px bg-[#a3c435]"></span>
              UBICACIONES
              <span className="w-6 h-px bg-[#a3c435]"></span>
            </div>
            <h2 className="font-heading text-4xl font-extrabold text-[#0f172a] mb-6">Nuestras Sedes</h2>
            <p className="text-slate-600 text-lg">Atendemos en múltiples ubicaciones estratégicas para tu comodidad</p>
          </motion.div>

          <MapSection />
        </div>
      </section>

      {/* Section 8: Unidades de Negocio */}
      <section className="py-24 bg-white border-t border-slate-100 overflow-hidden">
        <div className="w-full">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeIn}
            >
              <div className="text-xs text-[#a3c435] font-bold mb-2 uppercase tracking-widest flex items-center gap-2">
                <span className="w-6 h-px bg-[#a3c435]"></span>
                GRUPO SAN LUIS
              </div>
              <h2 className="font-heading text-4xl font-extrabold text-[#0f172a] mb-12">Unidades de Negocio</h2>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-0">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -10 }}
              className="relative h-[500px] overflow-hidden group cursor-pointer"
              onClick={() => window.open('https://revisiones-tecnicas.com', '_blank')}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src="https://www.apeseg.org.pe/wp-content/uploads/2019/11/REVISION-WEB.png"
                  alt="Revisiones Técnicas"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
                  className="object-cover transition-all duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-500 group-hover:from-black/60 group-hover:via-black/20"></div>
              </div>

              {/* Content - Initially Hidden, Shown on Hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <div className="text-center px-8">
                  <h3 className="text-3xl md:text-4xl font-black text-white mb-4">Revisiones Técnicas</h3>
                  <p className="text-white/90 text-sm mb-6 max-w-md">Inspección vehicular completa para garantizar la seguridad y cumplimiento de normativas.</p>
                  <div className="flex flex-col space-y-2 text-white/80 text-sm">
                    <div className="flex items-center justify-center gap-2"><Check size={16} className="text-green-400" /> Certificación MTC</div>
                    <div className="flex items-center justify-center gap-2"><Check size={16} className="text-green-400" /> Inspección 360°</div>
                    <div className="flex items-center justify-center gap-2"><Check size={16} className="text-green-400" /> Resultados inmediatos</div>
                  </div>
                  <div className="mt-6">
                    <Button className="bg-white text-black hover:bg-gray-100 px-8 py-3 rounded-none text-xs font-black uppercase tracking-widest">
                      Visitar sitio →
                    </Button>
                  </div>
                </div>
              </div>

              {/* Title - Initially Visible, Hidden on Hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-500">
                <div className="text-center">
                  <span className="text-5xl md:text-6xl font-black text-white/90 uppercase tracking-tighter text-center leading-none">REVISIONES<br />TÉCNICAS</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -10 }}
              className="relative h-[500px] overflow-hidden group cursor-pointer"
              onClick={() => window.open('https://escuela-conductores.com', '_blank')}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src="https://tecdrive.es/wp-content/uploads/2023/08/cursos_porque_cursos.jpg"
                  alt="Escuela de Conductores"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
                  className="object-cover transition-all duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-500 group-hover:from-black/60 group-hover:via-black/20"></div>
              </div>

              {/* Content - Initially Hidden, Shown on Hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <div className="text-center px-8">
                  <h3 className="text-3xl md:text-4xl font-black text-white mb-4">Escuela de Conductores</h3>
                  <p className="text-white/90 text-sm mb-6 max-w-md">Formación integral para conductores responsables y seguros en las vías.</p>
                  <div className="flex flex-col space-y-2 text-white/80 text-sm">
                    <div className="flex items-center justify-center gap-2"><Check size={16} className="text-green-400" /> Clases teóricas y prácticas</div>
                    <div className="flex items-center justify-center gap-2"><Check size={16} className="text-green-400" /> Simuladores de conducción</div>
                    <div className="flex items-center justify-center gap-2"><Check size={16} className="text-green-400" /> Examen final garantizado</div>
                  </div>
                  <div className="mt-6">
                    <Button className="bg-white text-black hover:bg-gray-100 px-8 py-3 rounded-none text-xs font-black uppercase tracking-widest">
                      Visitar sitio →
                    </Button>
                  </div>
                </div>
              </div>

              {/* Title - Initially Visible, Hidden on Hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-500">
                <div className="text-center">
                  <span className="text-5xl md:text-6xl font-black text-white/90 uppercase tracking-tighter text-center leading-none">ESCUELA DE<br />CONDUCTORES</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 9: Testimonios */}
      <section id="testimonios" className="py-24 px-4 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center max-w-2xl mx-auto mb-20"
          >
            <div className="text-xs text-[#a3c435] font-bold mb-3 uppercase tracking-widest flex items-center gap-2 justify-center">
              <span className="w-6 h-px bg-[#a3c435]"></span>
              EXPERIENCIAS
              <span className="w-6 h-px bg-[#a3c435]"></span>
            </div>
            <h2 className="font-heading text-4xl font-extrabold text-[#0f172a] mb-6">Opiniones de Conductores</h2>
            <p className="text-slate-600 text-lg">Cientos de conductores confían en nosotros cada mes</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Carlos Rivera", text: "Excelente atención, el proceso fue muy rápido y ordenado. Cumplen con todo lo que prometen.", rating: 5 },
              { name: "Ana María Soto", text: "Muy profesionales. Me explicaron cada paso del examen y el personal fue muy amable.", rating: 5 },
              { name: "Jorge Luis Paico", text: "La mejor opción para renovar el brevete. Sin colas innecesarias y todo digital.", rating: 5 }
            ].map((testimony, idx) => (
              <div key={idx} className="bg-white p-8 border border-slate-100 shadow-sm relative">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimony.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-600 italic mb-6 leading-relaxed">"{testimony.text}"</p>
                <p className="font-bold text-[#0f172a] uppercase tracking-wider text-xs">— {testimony.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 10: FAQ */}
      <section id="faq" className="py-24 px-4 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <div className="text-xs text-[#a3c435] font-bold mb-3 uppercase tracking-widest flex items-center gap-2 justify-center">
              <span className="w-6 h-px bg-[#a3c435]"></span>
              DUDAS
              <span className="w-6 h-px bg-[#a3c435]"></span>
            </div>
            <h2 className="font-heading text-4xl font-extrabold text-[#0f172a] mb-6">Preguntas Frecuentes</h2>
          </motion.div>

          <Accordion type="single" collapsible className="w-full">
            {[
              { q: "¿Cuánto tiempo demora el examen médico?", a: "El proceso completo suele tomar entre 45 a 60 minutos, dependiendo de la categoría." },
              { q: "¿Qué documentos debo llevar?", a: "Solo necesitas tu DNI vigente (físico o electrónico) y tu licencia anterior si es revalidación." },
              { q: "¿Tienen convenio con el MTC?", a: "Sí, somos un centro médico autorizado y homologado por el MTC con código vigente." }
            ].map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="border-slate-200">
                <AccordionTrigger className="text-left font-bold text-slate-800 hover:text-[#158cca] hover:no-underline py-6">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 leading-relaxed pb-6">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <Footer />
    </div>
  )
}
