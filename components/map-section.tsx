'use client'

import { useEffect, useRef, useState } from 'react'
import { MapPin, Phone } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { SiGooglemaps, SiWaze } from 'react-icons/si'
import { motion } from 'framer-motion'

const sedesCoords: [number, number][] = [
  [-11.988863, -77.057482],
  [-13.651203637235811, -73.36337728787365],
  [-13.156021376519789, -74.21794367539681]
]

const sedesData = [
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
]

export default function MapSection() {
  const [selectedSede, setSelectedSede] = useState(0)
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const L = useRef<any>(null)
  const markersLayer = useRef<any>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainer.current) return

    const initMap = async () => {
      // Dynamically import leaflet AND its CSS
      const [leaflet] = await Promise.all([
        import('leaflet'),
        import('leaflet/dist/leaflet.css')
      ])
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
      updateMarkers(0)
    }

    initMap()

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  const updateMarkers = (activeIdx: number) => {
    if (!map.current || !L.current || !markersLayer.current) return

    markersLayer.current.clearLayers()

    sedesCoords.forEach((coords, index) => {
      const isActive = index === activeIdx

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
          .bindTooltip(["LIMA", "ANDAHUAYLAS", "AYACUCHO"][index], {
            permanent: true,
            direction: 'right',
            className: 'map-marker-label',
            offset: [15, -20]
          })
      } else {
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
      updateMarkers(selectedSede)
      map.current.flyTo(sedesCoords[selectedSede], 16, {
        animate: true,
        duration: 1.5
      })
    }
  }, [selectedSede])

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Left: Map Column */}
      <div className="lg:col-span-2 h-[500px] border border-slate-100 shadow-xl relative group overflow-hidden">
        <div ref={mapContainer} className="w-full h-full z-0" />
      </div>

      {/* Right: Info Column */}
      <div className="flex flex-col gap-4">
        {sedesData.map((sede, idx) => (
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
  )
}
