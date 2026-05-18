'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Check, ChevronRight, MapPin, Phone, Mail, FileText, ArrowRight, Star, Clock, ShieldCheck, HeartPulse, Stethoscope, MessageCircle, X, Menu, AlertCircle, ChevronDown } from 'lucide-react'
import { motion, Variants } from 'framer-motion'
import Image from 'next/image'
import { FaWhatsapp, FaFacebookF, FaInstagram, FaFlask, FaBrain, FaEye, FaStethoscope, FaFileMedical } from 'react-icons/fa'
import { SiGooglemaps, SiWaze } from 'react-icons/si'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'
import { TopHeader } from '@/components/top-header'

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [counters, setCounters] = useState({ years: 0, clients: 0, branches: 0 })
  const [countersStarted, setCountersStarted] = useState(false)
  const [selectedSede, setSelectedSede] = useState(0)
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const L = useRef<any>(null)
  const markersLayer = useRef<any>(null)
  const [isHeaderDropdownOpen, setIsHeaderDropdownOpen] = useState(false)
  const [isHeroDropdownOpen, setIsHeroDropdownOpen] = useState(false)
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

  const sedesCoords: [number, number][] = [
    [-11.988863, -77.057482], // Lima Izaguirre (Precise)
    [-13.651203637235811, -73.36337728787365], // Andahuaylas (Precise)
    [-13.156021376519789, -74.21794367539681]   // Ayacucho (Jesús Nazareno)
  ]

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainer.current) return

    const initMap = async () => {
      const leaflet = await import('leaflet')
      L.current = leaflet

      if (map.current) return

      map.current = leaflet.map(mapContainer.current!, {
        attributionControl: false
      }).setView(sedesCoords[0], 14)

      leaflet.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map.current)

      markersLayer.current = leaflet.layerGroup().addTo(map.current)
      updateMarkers()
    }

    initMap()

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  const updateMarkers = () => {
    if (!map.current || !L.current || !markersLayer.current) return

    markersLayer.current.clearLayers()

    sedesCoords.forEach((coords, index) => {
      const isActive = index === selectedSede

      if (isActive) {
        // Pin Icon with Custom Logo for Active Sede
        const pinIcon = L.current.divIcon({
          className: 'custom-pin-marker',
          html: `<div class="pin-container relative w-[42px] h-[54px]">
                  <svg width="42" height="54" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="absolute inset-0">
                    <path d="M12 0C7.58 0 4 3.58 4 8C4 13.54 12 22 12 22C12 22 20 13.54 20 8C20 3.58 16.42 0 12 0Z" fill="#158cca"/>
                    <circle cx="12" cy="8" r="6" fill="white"/>
                  </svg>
                  <div class="absolute top-[4px] left-[10px] w-[22px] h-[22px] flex items-center justify-center overflow-hidden rounded-full">
                    <img src="/PinSLM.png" class="w-[80%] h-auto object-contain" alt="SLM" />
                  </div>
                 </div>`,
          iconSize: [42, 54],
          iconAnchor: [21, 54]
        })

        L.current.marker(coords, { icon: pinIcon })
          .addTo(markersLayer.current)
          .bindTooltip(["LIMA", "ANDAHUAYLAS", "AYACUCHO"][index], {
            permanent: true,
            direction: 'right',
            className: 'map-marker-label',
            offset: [15, -20]
          })
      } else {
        // Standard Marker for Inactive Sedes
        L.current.circleMarker(coords, {
          radius: 6,
          fillColor: "#a3c435",
          color: "#fff",
          weight: 1,
          opacity: 0.5,
          fillOpacity: 0.4
        }).addTo(markersLayer.current)
      }
    })
  }

  useEffect(() => {
    if (map.current) {
      updateMarkers()
      map.current.flyTo(sedesCoords[selectedSede], 16, {
        animate: true,
        duration: 1.5
      })
    }
  }, [selectedSede])

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
            {/* Desktop Navigation */}
            <nav className="flex gap-8 text-[13px] font-black text-slate-800 uppercase tracking-wider">
              {[
                {id: 'inicio', label: 'Inicio', href: '/'},
                {id: 'nosotros', label: 'Nosotros', href: '/nosotros'},
                {
                  id: 'servicios', 
                  label: 'Servicios', 
                  href: '/servicios',
                  dropdown: [
                    { label: 'Licencia Particular (A1)', href: '/servicios/licencia-particular' },
                    { label: 'Revalidación', href: '/servicios/revalidacion' },
                    { label: 'Recategorización', href: '/servicios/recategorizacion' },
                    { label: 'Licencia de Moto (B2C)', href: '/servicios/licencia-moto' }
                  ]
                },
                {id: 'sedes', label: 'Sedes', href: '/sedes'}
              ].map((item) => (
              <div key={item.id} className="relative group/nav">
                <Link
                  href={item.href}
                  className={`relative py-1 transition-colors duration-300 ${activeSection === item.id ? 'text-[#158cca]' : 'hover:text-[#158cca]'}`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#158cca]"
                      initial={false}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
                {item.dropdown && (
                  <div className="absolute top-full left-0 mt-4 w-64 bg-[#0f172a] border border-white/10 shadow-2xl opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-300 translate-y-2 group-hover/nav:translate-y-0 z-50">
                    <div className="py-2">
                      {item.dropdown.map((sub, sIdx) => (
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

            {/* Contact Button */}
            <Link href="/contacto">
              <Button className="bg-[#158cca] hover:bg-[#0f172a] text-white font-black text-xs uppercase tracking-widest h-12 px-8 rounded-none transition-all">
                Reserva Ahora
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
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
                { href: "/#precios", text: "Servicios" },
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
            <div className="p-6 border-t border-slate-700">
              <div className="flex flex-col items-center space-y-3 text-slate-300 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>Av. Los Héroes 451, San Juan de Miraflores</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  <span>(01) 642-9971</span>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <a href="https://wa.me/51999999999" target="_blank" rel="noreferrer" className="text-white hover:text-[#25D366] transition-colors">
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

      {/* Section 1: Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-white">
        {/* Blurred Medical Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Centro Médico Background"
            fill
            className="object-cover opacity-10 blur-sm"
          />
          <div className="absolute inset-0 bg-white/60" />
        </div>
        {/* MTC Watermark Background */}
        <div className="absolute left-1/3 -bottom-20 w-[900px] h-[600px] opacity-[0.03] pointer-events-none z-0">
          <Image
            src="/MTC.png"
            alt="MTC Watermark"
            fill
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
                      src="/MTC.png"
                      alt="Autorizado por MTC"
                      fill
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
                  src="/Doctor SLM.png"
                  alt="Doctora Profesional San Luis Medic"
                  fill
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
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {sedes.map((sede, idx) => (
              <button
                key={idx}
                onClick={() => setPricingSede(idx)}
                className={`px-8 py-3 font-bold transition-all duration-300 border-2 ${pricingSede === idx
                  ? 'bg-[#158cca] border-[#158cca] text-white shadow-lg shadow-blue-500/30 translate-y-[-2px]'
                  : 'bg-white border-slate-100 text-slate-500 hover:border-[#158cca]/30'}`}
              >
                {sede.name}
              </button>
            ))}
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

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Map Column */}
            <div className="lg:col-span-2 h-[500px] border border-slate-100 shadow-xl relative group overflow-hidden">
              <div ref={mapContainer} className="w-full h-full z-0" />
            </div>

            {/* Right: Info Column */}
            <div className="flex flex-col gap-4">
              {[
                {
                  name: "Sede Lima (Izaguirre)",
                  address: "Av. Carlos Izaguirre 108, Independencia 15311",
                  phone: "(01) 642-9971",
                  whatsapp: "999 888 777",
                  hours: "Lun-Sáb: 8am - 6pm",
                  services: ["Evaluaciones completas", "Certificados MTC", "Atención prioritaria"],
                  mapQuery: "Av. Carlos Izaguirre 108, Independencia"
                },
                {
                  name: "Sede Andahuaylas",
                  address: "Jr. Alfonso Ugarte N.º. 354 frente ex Ugel Andahuaylas",
                  phone: "(054) 234-567",
                  whatsapp: "944 777 666",
                  hours: "Lun-Sáb: 9am - 6pm",
                  services: ["Evaluaciones completas", "Zona sur", "Atención especializada"],
                  mapQuery: "Jr. Alfonso Ugarte N.º. 354 frente ex Ugel Andahuaylas"
                },
                {
                  name: "Sede Ayacucho",
                  address: "Jr. José Santos Chocano N°410, Jesús Nazareno-Huamanga-Ayacucho",
                  phone: "(044) 345-678",
                  whatsapp: "944 666 555",
                  hours: "Lun-Vie: 8am - 5pm",
                  services: ["Evaluaciones básicas", "Zona norte", "Fácil acceso"],
                  mapQuery: "Jr. José Santos Chocano N°410, Jesús Nazareno-Huamanga-Ayacucho"
                }
              ].map((sede, idx) => (
                <motion.div
                  key={idx}
                  onClick={() => setSelectedSede(idx)}
                  className={`p-4 md:p-5 cursor-pointer border transition-all duration-300 ${selectedSede === idx
                    ? 'bg-[#0f172a] border-[#0f172a] text-white shadow-lg translate-x-2'
                    : 'bg-white border-slate-100 text-slate-600 hover:border-[#158cca]/30'
                    }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-bold uppercase tracking-widest text-[11px] ${selectedSede === idx ? 'text-[#a3c435]' : 'text-slate-900'}`}>
                      {sede.name}
                    </h3>
                    {selectedSede === idx && <div className="w-2 h-2 bg-[#a3c435] rounded-full"></div>}
                  </div>

                  {selectedSede === idx ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3 mt-3"
                    >
                      <div className="text-xs opacity-80 flex gap-2">
                        <MapPin size={14} className="shrink-0 mt-0.5" />
                        <span>{sede.address}</span>
                      </div>
                      <div className="text-xs opacity-80 flex gap-2">
                        <Phone size={14} className="shrink-0 mt-0.5" />
                        <span>{sede.phone} | {sede.whatsapp}</span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${sedesCoords[idx][0]},${sedesCoords[idx][1]}`}
                          target="_blank"
                          rel="noreferrer"
                          title="Abrir en Google Maps"
                          className="flex-1 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center py-2.5 border border-white/20 transition-colors"
                        >
                          <SiGooglemaps size={16} />
                        </a>
                        <a
                          href={`https://waze.com/ul?ll=${sedesCoords[idx][0]},${sedesCoords[idx][1]}&navigate=yes`}
                          target="_blank"
                          rel="noreferrer"
                          title="Abrir en Waze"
                          className="flex-1 bg-[#33ccff]/20 hover:bg-[#33ccff]/40 text-white flex items-center justify-center py-2.5 border border-[#33ccff]/30 transition-colors"
                        >
                          <SiWaze size={16} />
                        </a>
                        <a
                          href={`https://wa.me/51${sede.whatsapp.replace(/\s/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          title="Contactar por WhatsApp"
                          className="flex-1 bg-[#25D366]/20 hover:bg-[#25D366]/40 text-white flex items-center justify-center py-2.5 border border-[#25D366]/30 transition-colors"
                        >
                          <FaWhatsapp size={16} />
                        </a>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="text-[9px] uppercase font-bold tracking-tight opacity-50">
                      Ver detalles y ubicación
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
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
