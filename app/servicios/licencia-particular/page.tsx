'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Check, Car, ChevronDown, ChevronRight, MapPin } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { FaWhatsapp } from 'react-icons/fa'
import { SiGooglemaps, SiWaze } from 'react-icons/si'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

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
      <Navbar dark />

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
              SERVICIO ESPECIALIZADO
              <span className="w-8 h-px bg-[#a3c435]"></span>
            </div>
            <div className="flex items-center justify-center gap-2 mb-4 text-[10px] font-black uppercase tracking-widest text-white/40">
              <Link href="/" className="hover:text-[#a3c435] transition-colors">Inicio</Link>
              <ChevronRight size={10} />
              <Link href="/servicios" className="hover:text-[#a3c435] transition-colors">Servicios</Link>
              <ChevronRight size={10} />
              <span className="text-[#a3c435]">Licencia Particular</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-6 leading-tight">
              Sacar Brevete Nuevo <br /> <span className="text-[#158cca]">Licencia de Conducir A1</span>
            </h1>
            <p className="hidden md:block text-white/60 text-lg max-w-2xl mx-auto font-medium">
              Obtén tu primera licencia de conducir con el respaldo médico más confiable y rápido del país.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-20 relative">
        {/* MTC Watermark */}
        <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-end opacity-[0.04] overflow-hidden">
          <Image src="/MTC.webp" alt="MTC marca de agua" width={520} height={520} className="object-contain" />
        </div>
        <div className="grid lg:grid-cols-2 gap-16 relative z-10">
          {/* Left Column: Requirements and Info */}
          <div>
            <h2 className="text-3xl font-black text-[#0f172a] uppercase tracking-tighter mb-8 leading-none">
              Inicia tu <br /> <span className="text-[#158cca]">Camino al Volante</span>
            </h2>
            <div className="space-y-8">
              <div className="p-6 bg-slate-50 border-l-4 border-[#158cca]">
                <h3 className="font-black text-[#0f172a] uppercase tracking-widest text-xs mb-4">Requisitos Principales</h3>
                <ul className="space-y-3">
                  {[
                    "DNI vigente (físico o electrónico)",
                    "Ser mayor de 18 años",
                    "No tener antecedentes penales de tránsito",
                    "Contar con una cita previa"
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
                    <Car size={28} />
                  </div>
                  <div>
                    <h4 className="font-black text-[#0f172a] uppercase tracking-widest text-[10px] mb-1">Categoría del Servicio</h4>
                    <p className="text-sm font-bold text-slate-600 italic">Licencia Particular A-I</p>
                    <p className="text-[11px] text-slate-400 font-medium mt-1">Certificación Oficial MTC</p>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-slate-50 rounded-full z-0 group-hover:scale-150 transition-transform duration-500"></div>
              </Card>

              <div className="pt-8 mt-8 border-t border-slate-100">
                <h3 className="text-xl font-black text-[#0f172a] uppercase tracking-tighter mb-6 flex items-center gap-3">
                  <div className="w-8 h-px bg-[#158cca]"></div>
                  Proceso de Evaluación
                </h3>
                <div className="space-y-6">
                  {[
                    { title: "Examen Psicológico", desc: "Evaluación de capacidad de reacción, coordinación y perfil psicológico." },
                    { title: "Examen Visual y Auditivo", desc: "Pruebas de agudeza visual, campimetría y audiometría." },
                    { title: "Medicina General", desc: "Evaluación de presión arterial, grupo sanguíneo y estado físico general." },
                    { title: "Registro y Certificación", desc: "Firma biométrica y carga inmediata de resultados al sistema del MTC." }
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
                <Image src="/MTC.webp" alt="MTC Watermark" fill className="object-contain" />
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
                  href={getWhatsAppUrl(`Hola San Luis Medic, quiero mi examen para Licencia Particular en la sede ${selectedSede.name}`, selectedSede.whatsapp)}
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

      <Footer />
    </div>
  );
}

export default function LicenciaParticular() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ServiceContent />
    </Suspense>
  );
}
