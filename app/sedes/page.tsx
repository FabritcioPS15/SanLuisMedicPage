'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check, Map as MapIcon, ChevronRight, Clock, MapPin, Phone } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { FaWhatsapp } from 'react-icons/fa'
import { SiGooglemaps, SiWaze } from 'react-icons/si'
import 'leaflet/dist/leaflet.css'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function Sedes() {
  const [selectedSede, setSelectedSede] = useState(0)
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const L = useRef<any>(null)
  const markersLayer = useRef<any>(null)

  const sedes = [
    { 
      name: "Sede Lima (Izaguirre)", 
      address: "Av. Carlos Izaguirre 108, Independencia 15311",
      phone: "(01) 642-9971",
      whatsapp: "999 888 777",
      hours: "Lun-Sáb: 8am - 6pm",
      services: ["Evaluaciones completas", "Certificados MTC", "Atención prioritaria"]
    },
    { 
      name: "Sede Andahuaylas", 
      address: "Jr. Alfonso Ugarte N.º. 354 frente ex Ugel Andahuaylas",
      phone: "(054) 234-567",
      whatsapp: "944 777 666",
      hours: "Lun-Sáb: 9am - 6pm",
      services: ["Evaluaciones completas", "Zona sur", "Atención especializada"]
    },
    { 
      name: "Sede Ayacucho", 
      address: "Jr. José Santos Chocano N°410, Jesús Nazareno-Huamanga-Ayacucho",
      phone: "(044) 345-678",
      whatsapp: "944 666 555",
      hours: "Lun-Vie: 8am - 5pm",
      services: ["Evaluaciones básicas", "Zona norte", "Fácil acceso"]
    }
  ]

  const sedesCoords: [number, number][] = [
    [-11.988863, -77.057482],
    [-13.651203637235811, -73.36337728787365],
    [-13.156021376519789, -74.21794367539681]
  ]

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainer.current) return

    const initMap = async () => {
      const leaflet = await import('leaflet')
      L.current = leaflet

      if (map.current) return

      map.current = leaflet.map(mapContainer.current!, {
        attributionControl: false,
        zoomControl: false
      }).setView(sedesCoords[0], 14)

      leaflet.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(map.current)

      leaflet.control.zoom({ position: 'bottomright' }).addTo(map.current)

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
        const pinIcon = L.current.divIcon({
          className: 'custom-pin-marker',
          html: `<div class="pin-container relative w-[42px] h-[54px]">
                  <svg width="42" height="54" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="absolute inset-0">
                    <path d="M12 0C7.58 0 4 3.58 4 8C4 13.54 12 22 12 22C12 22 20 13.54 20 8C20 3.58 16.42 0 12 0Z" fill="#158cca"/>
                    <circle cx="12" cy="8" r="6" fill="white"/>
                  </svg>
                  <div class="absolute top-[4px] left-[10px] w-[22px] h-[22px] flex items-center justify-center overflow-hidden rounded-full">
                    <img src="/PinSLM.webp" class="w-[80%] h-auto object-contain" alt="SLM" />
                  </div>
                 </div>`,
          iconSize: [42, 54],
          iconAnchor: [21, 54]
        })

        L.current.marker(coords, { icon: pinIcon })
          .addTo(markersLayer.current)
          .bindTooltip(sedes[index].name, {
            permanent: true,
            direction: 'right',
            className: 'map-marker-label',
            offset: [15, -20]
          })
      } else {
        L.current.circleMarker(coords, {
          radius: 8,
          fillColor: "#a3c435",
          color: "#fff",
          weight: 2,
          opacity: 1,
          fillOpacity: 1
        }).addTo(markersLayer.current).on('click', () => setSelectedSede(index))
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

  return (
    <div className="w-full bg-white font-sans text-slate-900">
      <Navbar active="sedes" />

      {/* Hero Section */}
      <section className="bg-[#0f172a] py-12 md:py-16 px-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/4 h-full bg-[#158cca]/10 -skew-x-12 translate-x-1/2" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="text-[10px] md:text-xs text-[#a3c435] font-bold mb-4 uppercase tracking-[0.3em] flex items-center gap-2 justify-center">
              <span className="w-6 md:w-8 h-px bg-[#a3c435]"></span>
              ENCUÉNTRANOS
              <span className="w-6 md:w-8 h-px bg-[#a3c435]"></span>
            </div>
            <div className="flex items-center justify-center gap-2 mb-6 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white/40">
              <Link href="/" className="hover:text-[#a3c435] transition-colors">Inicio</Link>
              <ChevronRight size={10} />
              <span className="text-[#a3c435]">Sedes</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6 md:mb-8 leading-[1.1] md:leading-none">
              Examen Médico <br /> <span className="text-[#158cca]">Cerca de Ti</span>
            </h1>
            <p className="text-white/60 text-sm md:text-lg max-w-2xl mx-auto font-medium px-4 md:px-0">
              Contamos con ubicaciones estratégicas equipadas con la mejor tecnología médica para brindarte una atención rápida y de calidad.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Map & List Section */}
      <section className="py-12 md:py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid lg:grid-cols-3 gap-8 md:gap-12"
          >
            {/* Map Column */}
            <div className="lg:col-span-2 h-[350px] md:h-[500px] lg:h-[600px] bg-slate-50 border border-slate-100 shadow-2xl relative overflow-hidden order-1 lg:order-1">
              <div ref={mapContainer} className="w-full h-full z-0" />
              <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10 bg-white/90 backdrop-blur-md p-3 md:p-4 shadow-xl border border-slate-100 max-w-[200px] md:max-w-none">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-[#158cca] flex items-center justify-center text-white shrink-0">
                    <MapIcon size={16} />
                  </div>
                  <div>
                    <div className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Sede Seleccionada</div>
                    <div className="text-[11px] md:text-sm font-black text-[#0f172a] uppercase tracking-tighter truncate">{sedes[selectedSede].name}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* List Column */}
            <div className="space-y-4 h-[400px] lg:h-[600px] overflow-y-auto pr-2 custom-scrollbar order-2 lg:order-2">
              {sedes.map((sede, idx) => (
                <motion.div
                  key={idx}
                  onClick={() => setSelectedSede(idx)}
                  className={`p-4 md:p-6 cursor-pointer border transition-all duration-500 ${
                    selectedSede === idx 
                    ? 'bg-[#0f172a] border-[#0f172a] text-white shadow-2xl lg:translate-x-2' 
                    : 'bg-white border-slate-100 hover:border-[#158cca]/30 text-slate-900'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className={`text-base md:text-lg font-black uppercase tracking-tighter ${selectedSede === idx ? 'text-[#a3c435]' : 'text-[#0f172a]'}`}>
                      {sede.name}
                    </h3>
                    {selectedSede === idx && <div className="w-2.5 h-2.5 bg-[#a3c435] rounded-full" />}
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3 opacity-80">
                      <MapPin size={16} className="shrink-0 mt-1 text-[#158cca]" />
                      <span className="text-xs md:text-sm font-bold leading-tight">{sede.address}</span>
                    </div>
                    <div className="flex items-center gap-3 opacity-80">
                      <Phone size={16} className="shrink-0 text-[#158cca]" />
                      <span className="text-xs md:text-sm font-bold">{sede.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 opacity-80">
                      <Clock size={16} className="shrink-0 text-[#158cca]" />
                      <span className="text-xs md:text-sm font-bold">{sede.hours}</span>
                    </div>
                  </div>

                  {selectedSede === idx && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6 pt-4 border-t border-white/10"
                    >
                      <div className="grid grid-cols-3 gap-2">
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${sedesCoords[idx][0]},${sedesCoords[idx][1]}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-white/10 hover:bg-white/20 h-12 flex items-center justify-center border border-white/10 transition-colors"
                        >
                          <SiGooglemaps size={18} />
                        </a>
                        <a 
                          href={`https://waze.com/ul?ll=${sedesCoords[idx][0]},${sedesCoords[idx][1]}&navigate=yes`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-[#33ccff]/20 hover:bg-[#33ccff]/40 h-12 flex items-center justify-center border border-[#33ccff]/30 transition-colors"
                        >
                          <SiWaze size={18} />
                        </a>
                        <a 
                          href={`https://wa.me/51${sede.whatsapp.replace(/\s/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-[#25D366]/20 hover:bg-[#25D366]/40 h-12 flex items-center justify-center border border-[#25D366]/30 transition-colors"
                        >
                          <FaWhatsapp size={18} />
                        </a>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services in Sedes */}
      <section className="py-24 px-4 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-[#0f172a] uppercase tracking-tighter mb-4">Servicios Disponibles</h2>
              <p className="text-slate-600 font-medium">Todas nuestras sedes están autorizadas y cuentan con:</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { title: "Medicina General", icon: <Check className="text-[#a3c435]" /> },
              { title: "Psicometría", icon: <Check className="text-[#a3c435]" /> },
              { title: "Oftalmología", icon: <Check className="text-[#a3c435]" /> },
              { title: "Audiometría", icon: <Check className="text-[#a3c435]" /> }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 border border-slate-200 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-slate-50 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h4 className="font-black text-slate-800 uppercase tracking-tighter">{item.title}</h4>
              </div>
            ))}
          </div>
        </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
