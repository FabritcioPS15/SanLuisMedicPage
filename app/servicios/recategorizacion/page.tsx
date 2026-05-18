'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Check, Clock, FileText, Shield, ArrowRight, Phone, MapPin, Truck, ChevronDown, Menu, Mail, X, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { FaWhatsapp, FaFacebookF, FaInstagram } from 'react-icons/fa'
import { SiGooglemaps, SiWaze } from 'react-icons/si'

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const sedesCoords: [number, number][] = [
  [-11.988863, -77.057482], // Lima Izaguirre
  [-13.651203637235811, -73.36337728787365], // Andahuaylas
  [-13.156021376519789, -74.21794367539681]  // Ayacucho
];

function ServiceContent() {
  const searchParams = useSearchParams();
  const sedeParam = searchParams.get('sede');

  const sedes = [
    { name: 'Sede Lima (Izaguirre)', whatsapp: '999888777', phone: '(01) 642-9971', address: 'Av. Carlos Izaguirre 108, Independencia' },
    { name: 'Sede Andahuaylas', whatsapp: '944777666', phone: '(054) 234-567', address: 'Jr. Alfonso Ugarte N.º. 354' },
    { name: 'Sede Ayacucho', whatsapp: '944666555', phone: '(044) 345-678', address: 'Jr. José Santos Chocano N°410' }
  ];

  const [selectedSede, setSelectedSede] = useState(sedes[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const dropdownBtnRef = useRef<HTMLButtonElement>(null);
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const LRef = useRef<any>(null);

  const updateDropdownPos = () => {
    if (dropdownBtnRef.current) {
      const rect = dropdownBtnRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }
  };

  const toggleDropdown = () => {
    if (!isDropdownOpen) updateDropdownPos();
    setIsDropdownOpen(prev => !prev);
  };

  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleScroll = () => updateDropdownPos();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    if (sedeParam !== null) {
      const idx = parseInt(sedeParam);
      if (!isNaN(idx) && sedes[idx]) {
        setSelectedSede(sedes[idx]);
      }
    }
  }, [sedeParam]);

  useEffect(() => {
    if (typeof window !== 'undefined' && !LRef.current) {
      import('leaflet').then((L) => {
        LRef.current = L;
        import('leaflet/dist/leaflet.css');
        initMap();
      });
    } else if (LRef.current) {
      updateMap();
    }
  }, [selectedSede]);

  const initMap = () => {
    if (!mapContainerRef.current || !LRef.current || mapRef.current) return;

    const L = LRef.current;
    const idx = sedes.findIndex(s => s.name === selectedSede.name);
    const coords = sedesCoords[idx] || sedesCoords[0];

    mapRef.current = L.map(mapContainerRef.current, {
      scrollWheelZoom: false,
      zoomControl: false,
      attributionControl: false
    }).setView(coords, 15);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(mapRef.current);

    L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);

    updateMap();
  };

  const updateMap = () => {
    if (!mapRef.current || !LRef.current) return;
    const L = LRef.current;
    const idx = sedes.findIndex(s => s.name === selectedSede.name);
    const coords = sedesCoords[idx] || sedesCoords[0];

    try {
      mapRef.current.flyTo(coords, 15, { duration: 1.5 });

      L.marker(coords, {
        icon: L.divIcon({
          className: 'custom-div-icon',
          html: `<div style='background-color:#158cca; width:12px; height:12px; border-radius:50%; border:2px solid white;'></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6]
        })
      }).addTo(mapRef.current);
    } catch (e) {
      console.error(e);
    }
  };

  const getWhatsAppUrl = (message: string, whatsapp: string) => {
    return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Top Bar */}
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
                  className={`relative py-1 transition-colors duration-300 hover:text-[#158cca]`}
                >
                  {item.label}
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

      {/* Hero Banner Section */}
      <section className="bg-[#0f172a] py-10 md:py-16 px-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-[#158cca]/10 -skew-x-12 translate-x-1/2" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="hidden md:flex text-xs text-[#a3c435] font-bold mb-4 uppercase tracking-[0.3em] items-center gap-2 justify-center">
              <span className="w-8 h-px bg-[#a3c435]"></span>
              SERVICIO PROFESIONAL
              <span className="w-8 h-px bg-[#a3c435]"></span>
            </div>
            <div className="flex items-center justify-center gap-2 mb-4 text-[10px] font-black uppercase tracking-widest text-white/40">
              <Link href="/" className="hover:text-[#a3c435] transition-colors">Inicio</Link>
              <ChevronRight size={10} />
              <Link href="/servicios" className="hover:text-[#a3c435] transition-colors">Servicios</Link>
              <ChevronRight size={10} />
              <span className="text-[#a3c435]">Recategorización</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-6 leading-tight">
              Examen Médico <br /> <span className="text-[#158cca]">Recategorización</span>
            </h1>
            <p className="hidden md:block text-white/60 text-lg max-w-2xl mx-auto font-medium">
              Sube de categoría y amplía tus oportunidades profesionales con nuestra evaluación médica integral y certificada.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-20 relative">
        {/* MTC Watermark */}
        <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-end opacity-[0.04] overflow-hidden">
          <Image src="/MTC.png" alt="MTC marca de agua" width={520} height={520} className="object-contain" />
        </div>
        <div className="grid lg:grid-cols-2 gap-16 relative z-10">
          {/* Left Column: Requirements and Info */}
          <div>
            <h2 className="text-3xl font-black text-[#0f172a] uppercase tracking-tighter mb-8 leading-none">
              Impulsa tu <br /> <span className="text-[#158cca]">Carrera Profesional</span>
            </h2>
            <div className="space-y-8">
              <div className="p-6 bg-slate-50 border-l-4 border-[#158cca]">
                <h3 className="font-black text-[#0f172a] uppercase tracking-widest text-xs mb-4">Requisitos de Recategorización</h3>
                <ul className="space-y-3">
                  {[
                    "DNI vigente (físico o electrónico)",
                    "Licencia de conducir vigente",
                    "No tener sanciones o multas pendientes",
                    "Cumplir con la antigüedad requerida para la categoría"
                  ].map((req, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                      <Check className="text-[#a3c435]" size={16} /> {req}
                    </li>
                  ))}
                </ul>
              </div>

              <Card className="p-5 border-slate-100 shadow-sm rounded-none relative overflow-hidden group hover:border-[#158cca] transition-colors">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-[#158cca]/10 text-[#158cca] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                    <Truck size={28} />
                  </div>
                  <div>
                    <h4 className="font-black text-[#0f172a] uppercase tracking-widest text-[10px] mb-1">Categorías Disponibles</h4>
                    <p className="text-sm font-bold text-slate-600 italic">A-IIa, A-IIb, A-IIIa, A-IIIb, A-IIIc</p>
                    <p className="text-[11px] text-slate-400 font-medium mt-1">Certificación Oficial MTC</p>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-slate-50 rounded-full z-0 group-hover:scale-150 transition-transform duration-500"></div>
              </Card>

              <div className="pt-8 mt-8 border-t border-slate-100">
                <h3 className="text-xl font-black text-[#0f172a] uppercase tracking-tighter mb-6 flex items-center gap-3">
                  <div className="w-8 h-px bg-[#158cca]"></div>
                  Proceso de Evaluación Avanzada
                </h3>
                <div className="space-y-6">
                  {[
                    { title: "Examen Psicológico Completo", desc: "Evaluación exhaustiva de perfil psicológico para categorías superiores." },
                    { title: "Psicotécnico y Reacción", desc: "Pruebas avanzadas de coordinación visomotora y reflejos." },
                    { title: "Examen Visual, Auditivo y Médico", desc: "Evaluaciones clínicas detalladas según exigencias de nueva categoría." },
                    { title: "Registro en Sistema", desc: "Emisión y carga del certificado oficial para la recategorización." }
                  ].map((step, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-10 h-10 bg-[#0f172a] text-white flex items-center justify-center font-black shrink-0">
                        0{idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#0f172a] text-sm uppercase tracking-widest mb-1">{step.title}</h4>
                        <p className="hidden md:block text-slate-600 text-[13px] font-medium leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Appointment and Map */}
          <div className="space-y-8">
            <div className="bg-[#0f172a] p-6 md:p-10 text-white relative">
              <div className="absolute -top-10 -right-10 w-64 h-64 opacity-[0.03] pointer-events-none">
                <Image src="/MTC.png" alt="MTC Watermark" fill className="object-contain" />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-6">Agendar mi Examen</h3>
                <div className="space-y-4 mb-8">
                  <div className="relative">
                    <button
                      ref={dropdownBtnRef}
                      onClick={toggleDropdown}
                      className="w-full bg-white/10 hover:bg-white/20 border border-white/20 h-14 px-6 flex items-center justify-between text-sm font-bold transition-all"
                    >
                      <span className="flex items-center gap-3"><MapPin size={18} className="text-[#a3c435]" /> {selectedSede.name}</span>
                      <ChevronDown size={18} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-[998]" onClick={() => setIsDropdownOpen(false)} />
                        <div
                          className="fixed bg-white text-slate-900 border border-slate-200 shadow-2xl z-[999] rounded-sm"
                          style={{ top: dropdownPos.top, left: dropdownPos.left, width: dropdownPos.width }}
                        >
                          {sedes.map((s, i) => (
                            <div
                              key={i}
                              onClick={() => { setSelectedSede(s); setIsDropdownOpen(false); }}
                              className="p-4 hover:bg-slate-50 cursor-pointer font-bold text-sm border-b border-slate-100 last:border-0"
                            >
                              {s.name}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <a
                  href={getWhatsAppUrl(`Hola San Luis Medic, quiero recategorizar mi licencia en la sede ${selectedSede.name}`, selectedSede.whatsapp)}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-[#158cca] hover:bg-white hover:text-[#158cca] text-white h-14 flex items-center justify-center gap-3 font-black uppercase text-xs tracking-widest transition-all"
                >
                  <FaWhatsapp size={20} /> Agendar vía WhatsApp
                </a>
              </div>
            </div>

            <div className="h-[300px] w-full border border-slate-100 shadow-lg relative overflow-hidden">
              <div ref={mapContainerRef} className="w-full h-full z-0" />
              <div className="absolute bottom-4 left-4 z-[1000] flex gap-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${sedesCoords[sedes.findIndex(s => s.name === selectedSede.name)][0]},${sedesCoords[sedes.findIndex(s => s.name === selectedSede.name)][1]}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white p-3 shadow-lg hover:bg-slate-50 transition-colors"
                >
                  <SiGooglemaps size={18} className="text-[#158cca]" />
                </a>
                <a
                  href={`https://waze.com/ul?ll=${sedesCoords[sedes.findIndex(s => s.name === selectedSede.name)][0]},${sedesCoords[sedes.findIndex(s => s.name === selectedSede.name)][1]}&navigate=yes`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white p-3 shadow-lg hover:bg-slate-50 transition-colors"
                >
                  <SiWaze size={18} className="text-[#33ccff]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

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
  );
}

export default function Recategorizacion() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ServiceContent />
    </Suspense>
  );
}
