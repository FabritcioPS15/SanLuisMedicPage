'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Check, Clock, FileText, Shield, ArrowRight, Phone, MapPin, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

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
    { name: 'Lima - Izaguirre', whatsapp: '51999888777', phone: '(01) 642-9971', address: 'Av. Carlos Izaguirre 108, Independencia' },
    { name: 'Andahuaylas', whatsapp: '944777666', phone: '(054) 234-567', address: 'Jr. Alfonso Ugarte N.º. 354 frente ex Ugel Andahuaylas' },
    { name: 'Ayacucho', whatsapp: '944666555', phone: '(044) 345-678', address: 'Jr. José Santos Chocano N°410, Jesús Nazareno-Huamanga-Ayacucho' }
  ];

  const [selectedSede, setSelectedSede] = useState(sedes[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const LRef = useRef<any>(null);

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

      // Clear existing markers if any
      mapRef.current.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) mapRef.current.removeLayer(layer);
      });

      const pinIcon = L.divIcon({
        className: 'custom-pin-marker',
        html: `<div class="pin-container relative w-[32px] h-[40px]">
                <svg width="32" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="absolute inset-0">
                  <path d="M12 0C7.58 0 4 3.58 4 8C4 13.54 12 22 12 22C12 22 20 13.54 20 8C20 3.58 16.42 0 12 0Z" fill="#158cca"/>
                  <circle cx="12" cy="8" r="6" fill="white"/>
                </svg>
                <div class="absolute top-[3px] left-[7px] w-[18px] h-[18px] flex items-center justify-center overflow-hidden rounded-full">
                  <img src="/PinSLM.png" class="w-[80%] h-auto object-contain" alt="SLM" />
                </div>
               </div>`,
        iconSize: [32, 40],
        iconAnchor: [16, 40]
      });

      L.marker(coords, { icon: pinIcon }).addTo(mapRef.current)
        .bindTooltip(selectedSede.name, { 
          permanent: true, 
          direction: 'top',
          className: 'map-marker-label',
          offset: [0, -40]
        })
        .openTooltip();
    } catch (e) {
      console.warn("Map not ready for flyTo", e);
      mapRef.current.setView(coords, 15);
    }
  };

  const handleSedeSelect = (sede: typeof sedes[0]) => {
    setSelectedSede(sede);
    setIsDropdownOpen(false);
  };

  const getWhatsAppUrl = (message: string) => {
    return `https://wa.me/${selectedSede.whatsapp}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-white">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50/50 -skew-x-12 translate-x-1/4 z-0 hidden lg:block" />
        <div className="absolute top-20 -left-20 w-64 h-64 bg-[#158cca]/5 rounded-full blur-3xl z-0" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-3 mb-12 text-slate-400">
            <Link href="/" className="hover:text-[#158cca] transition-colors flex items-center gap-1.5">
              <span className="w-4 h-4 bg-slate-100 rounded-full flex items-center justify-center text-[10px] text-slate-500">1</span>
              Inicio
            </Link>
            <ChevronDown size={12} className="-rotate-90" />
            <span className="hover:text-slate-600 cursor-default">Servicios</span>
            <ChevronDown size={12} className="-rotate-90" />
            <span className="text-[#158cca] font-bold">Nuevo A I</span>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid lg:grid-cols-2 gap-20 items-center"
          >
            <div>
              <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#a3c435]/10 text-[#a3c435] text-[10px] font-bold mb-6 tracking-widest uppercase border border-[#a3c435]/20">
                Categoría A-I
              </motion.div>
              
              <motion.h1 variants={fadeIn} className="text-5xl lg:text-7xl font-extrabold text-[#0f172a] mb-8 leading-[1.1] tracking-tight">
                Tu primera <br />
                <span className="text-[#158cca] relative inline-block">
                  licencia.
                  <svg className="absolute -bottom-2 left-0 w-full h-2 text-[#a3c435]/40" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
                  </svg>
                </span>
              </motion.h1>

              <motion.p variants={fadeIn} className="text-lg text-slate-600 mb-10 leading-relaxed max-w-lg font-medium">
                Inicia tu vida al volante con el pie derecho. Evaluación médica integral y certificada por el MTC para tu primera licencia.
              </motion.p>

              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <Button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="bg-[#158cca] hover:bg-[#1176ab] text-white font-bold h-14 px-10 rounded-full text-base shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-1 flex items-center gap-3 w-full sm:w-auto"
                  >
                    <span>Reservar Ahora</span>
                    <ChevronDown size={20} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </Button>

                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 mt-3 w-72 bg-white border border-slate-100 rounded-2xl shadow-2xl z-[100] p-2 overflow-hidden"
                    >
                      {sedes.map((sede, index) => (
                        <a
                          key={index}
                          href={getWhatsAppUrl(`Hola San Luis Medic, quiero información sobre mi primera licencia Nuevo A I en la sede ${sede.name}`)}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-xl transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#158cca] group-hover:bg-[#158cca] group-hover:text-white transition-colors">
                            <MapPin size={18} />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{sede.name}</div>
                            <div className="text-xs text-slate-500">Agendar vía WhatsApp</div>
                          </div>
                        </a>
                      ))}
                    </motion.div>
                  )}
                </div>
                
                <a href="#proceso">
                  <Button variant="outline" className="h-14 px-8 rounded-full border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all text-base w-full sm:w-auto">
                    Ver Proceso
                  </Button>
                </a>
              </motion.div>
            </div>

            <motion.div variants={fadeIn} className="relative">
              <div className="relative h-[550px] rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] border-8 border-white group">
                <Image
                  src="https://images.unsplash.com/photo-1580281657527-47f249e8f4df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=90"
                  alt="Primera licencia de conducir"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#158cca]/30 to-transparent" />
                
                {/* Floating Info */}
                <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#a3c435] rounded-xl flex items-center justify-center text-white">
                      <Shield size={24} />
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-900 uppercase tracking-tight">Garantía San Luis Medic</div>
                      <div className="text-xs text-slate-500">Evaluación integral por especialistas certificados</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#0f172a] mb-4">Proceso de Evaluación</h2>
            <p className="text-xl text-slate-600">Completa tu evaluación en 4 simples pasos</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-4 gap-6"
          >
            {[
              { step: "01", title: "Reserva", desc: "Agenda tu cita online o presencial", icon: <Clock size={24} /> },
              { step: "02", title: "Evaluación", desc: "Exámenes médicos completos", icon: <Shield size={24} /> },
              { step: "03", title: "Resultados", desc: "Recibe tu certificado médico", icon: <FileText size={24} /> },
              { step: "04", title: "MTC", desc: "Carga al sistema del MTC", icon: <Check size={24} /> }
            ].map((item, idx) => (
              <motion.div key={idx} variants={fadeIn} className="text-center">
                <div className="w-16 h-16 bg-[#158cca] rounded-full flex items-center justify-center text-white mb-6 mx-auto">
                  {item.icon}
                </div>
                <div className="text-3xl font-black text-[#a3c435] mb-3">{item.step}</div>
                <h3 className="text-lg font-bold text-[#0f172a] mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Included */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#0f172a] mb-4">Servicios Incluidos</h2>
            <p className="text-xl text-slate-600">Evaluación médica completa y certificada</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              "Examen Psicológico",
              "Examen Visual y Auditivo", 
              "Examen Médico General",
              "Registro Biométrico MTC"
            ].map((service, idx) => (
              <motion.div key={idx} variants={fadeIn}>
                <Card className="p-6 bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#a3c435]/10 rounded-full flex items-center justify-center">
                      <Check size={20} className="text-[#a3c435]" />
                    </div>
                    <span className="font-medium text-slate-700">{service}</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#0f172a] mb-4">Requisitos</h2>
            <p className="text-xl text-slate-600">Todo lo que necesitas para tu evaluación</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-8"
          >
            <Card className="p-8 border border-slate-100">
              <h3 className="text-xl font-bold text-[#0f172a] mb-6">Documentos Requeridos</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-[#a3c435] flex-shrink-0 mt-1" />
                  <span className="text-slate-700">DNI original (físico o electrónico)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-[#a3c435] flex-shrink-0 mt-1" />
                  <span className="text-slate-700">Certificado de estudios (si es menor de 18 años)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-[#a3c435] flex-shrink-0 mt-1" />
                  <span className="text-slate-700">Pago por derecho de trámite MTC</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 border border-slate-100">
              <h3 className="text-xl font-bold text-[#0f172a] mb-6">Consideraciones</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-[#a3c435] flex-shrink-0 mt-1" />
                  <span className="text-slate-700">Edad mínima: 18 años para categoría A-I</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-[#a3c435] flex-shrink-0 mt-1" />
                  <span className="text-slate-700">No consumir alcohol 24h antes</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check size={20} className="text-[#a3c435] flex-shrink-0 mt-1" />
                  <span className="text-slate-700">Descansar 8 horas antes del examen</span>
                </li>
              </ul>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-[#0f172a]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              ¿Listo para obtener tu licencia?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Reserva tu evaluación médica hoy y comienza tu proceso para obtener tu licencia de conducir
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href={getWhatsAppUrl("Hola San Luis Medic, quiero reservar mi evaluación Nuevo A I")}
                target="_blank"
                rel="noreferrer"
              >
                <Button className="bg-[#a3c435] hover:bg-[#8fae2a] text-[#0f172a] font-bold h-14 px-8 rounded-none text-base">
                  Reservar Ahora
                </Button>
              </a>
              <a 
                href={getWhatsAppUrl("Hola San Luis Medic, tengo una consulta sobre el trámite de Nuevo A I")}
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="outline" className="border-white text-black hover:bg-white/10 h-14 px-8 rounded-none text-base">
                  Consultar por WhatsApp
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Minimap Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
              >
                <span className="text-[#a3c435] text-xs font-bold uppercase tracking-widest">Nuestra Ubicación</span>
                <h2 className="text-4xl font-black text-[#0f172a] mt-2 mb-6">Visítanos en {selectedSede.name}</h2>
                <p className="text-lg text-slate-600 mb-8">
                  Estamos listos para atenderte. Acércate a nuestra sede para tu evaluación médica y obtén tu licencia de forma rápida y segura.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-white shadow-sm border border-slate-100">
                    <div className="w-12 h-12 bg-[#158cca]/10 flex items-center justify-center text-[#158cca]">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">Dirección</div>
                      <div className="font-bold text-slate-900">
                        {selectedSede.address}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white shadow-sm border border-slate-100">
                    <div className="w-12 h-12 bg-[#a3c435]/10 flex items-center justify-center text-[#a3c435]">
                      <Phone size={24} />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">Teléfono</div>
                      <div className="font-bold text-slate-900">{selectedSede.phone}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="relative">
              <div className="h-[400px] bg-slate-200 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                <div ref={mapContainerRef} className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default function NuevoAIPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Cargando...</div>}>
      <ServiceContent />
    </Suspense>
  )
}
