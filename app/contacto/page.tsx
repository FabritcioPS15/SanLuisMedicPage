'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, ChevronRight, CalendarIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function Contacto() {
  const [selectedSede, setSelectedSede] = useState<number | null>(null)
  const [isSedeSelectorExpanded, setIsSedeSelectorExpanded] = useState(true)

  const sedes = [
    {
      name: 'Sede Lima (Izaguirre)',
      whatsapp: '51999888777',
      phone: '(01) 642-9971',
      mobile: '+51 999 888 777',
      email: 'info@sanluismedic.pe',
      altEmail: 'atencion@corporacionsanluismedic.pe',
      schedule: 'Lunes a Sábado',
      hours: '08:00 AM - 06:00 PM'
    },
    {
      name: 'Sede Andahuaylas',
      whatsapp: '51944777666',
      phone: '(083) 421-543',
      mobile: '+51 944 777 666',
      email: 'andahuaylas@sanluismedic.pe',
      altEmail: 'consultas@sanluismedic.pe',
      schedule: 'Lunes a Sábado',
      hours: '08:00 AM - 06:00 PM'
    },
    {
      name: 'Sede Ayacucho',
      whatsapp: '51944666555',
      phone: '(066) 312-987',
      mobile: '+51 944 666 555',
      email: 'ayacucho@sanluismedic.pe',
      altEmail: 'recepcion@sanluismedic.pe',
      schedule: 'Lunes a Sábado',
      hours: '08:00 AM - 06:00 PM'
    }
  ]

  const currentSede = selectedSede !== null ? sedes[selectedSede] : null

  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    correo: '',
    mensaje: ''
  })
  const [fecha, setFecha] = useState<Date>()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentSede) return
    
    const { nombre, telefono, correo, mensaje } = formData
    const fechaStr = fecha ? format(fecha, "PPP", { locale: es }) : 'No especificada'
    
    const text = `Hola San Luis Medic, quiero agendar una cita en la ${currentSede.name}.
*Mis Datos:*
- *Nombre completo:* ${nombre}
- *Teléfono/WhatsApp:* ${telefono}
- *Correo electrónico:* ${correo || 'No especificado'}
- *Sede de interés:* ${currentSede.name}
- *Fecha deseada:* ${fechaStr}
${mensaje ? `- *Mensaje:* ${mensaje}` : ''}`
    
    const encodedText = encodeURIComponent(text)
    window.open(`https://wa.me/${currentSede.whatsapp}?text=${encodedText}`, '_blank')
  }

  const handleSedeSelect = (idx: number) => {
    setSelectedSede(idx)
    setIsSedeSelectorExpanded(false)
  }

  return (
    <div className="w-full bg-white font-sans text-slate-900">
      <Navbar active="contacto" />

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
              ESTAMOS PARA AYUDARTE
              <span className="w-8 h-px bg-[#a3c435]"></span>
            </div>
            <div className="flex items-center justify-center gap-2 mb-6 text-[10px] font-black uppercase tracking-widest text-white/40">
              <Link href="/" className="hover:text-[#a3c435] transition-colors">Inicio</Link>
              <ChevronRight size={10} />
              <span className="text-[#a3c435]">Contacto</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8 leading-none">
              Citas para <br /> <span className="text-[#158cca]">Médico Brevete</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto font-medium">
              Resuelve tus dudas o agenda tu cita directamente con nuestro equipo de atención al cliente.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 min-h-[500px]">
            <div className="space-y-10">
              <motion.div 
                layout
                className="bg-slate-50 p-8 border border-slate-100 overflow-hidden"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xs text-[#158cca] font-black uppercase tracking-[0.3em]">Selecciona tu sede de preferencia</h2>
                  {selectedSede !== null && !isSedeSelectorExpanded && (
                    <button 
                      onClick={() => setIsSedeSelectorExpanded(true)}
                      className="text-[10px] font-black text-[#158cca] uppercase tracking-widest hover:underline"
                    >
                      Cambiar Sede
                    </button>
                  )}
                </div>

                <motion.div
                  animate={{ height: isSedeSelectorExpanded ? 'auto' : 0, opacity: isSedeSelectorExpanded ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className={!isSedeSelectorExpanded ? 'pointer-events-none' : ''}
                >
                  <div className="flex flex-wrap gap-3 pb-2">
                    {sedes.map((sede, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSedeSelect(idx)}
                        className={`px-6 h-12 font-black uppercase text-[10px] tracking-widest transition-all duration-300 border-2 ${selectedSede === idx
                          ? 'bg-[#158cca] border-[#158cca] text-white shadow-lg shadow-blue-500/20'
                          : 'bg-white border-slate-200 text-slate-500 hover:border-[#158cca]/30 hover:bg-white'}`}
                      >
                        {sede.name}
                      </button>
                    ))}
                  </div>
                </motion.div>

                {selectedSede !== null && !isSedeSelectorExpanded && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-3 text-slate-800 font-bold uppercase tracking-wider text-[11px]"
                  >
                    <div className="w-2 h-2 bg-[#a3c435] rounded-full" />
                    Sede actual: <span className="text-[#158cca]">{currentSede?.name}</span>
                  </motion.div>
                )}
              </motion.div>

              {selectedSede !== null && currentSede ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-12"
                >
                  <div>
                    <h2 className="text-2xl font-black text-[#0f172a] uppercase tracking-tighter mb-8 flex items-center gap-3">
                      <span className="w-8 h-1 bg-[#158cca]"></span>
                      Datos de {currentSede.name}
                    </h2>
                    <div className="space-y-8">
                      <div className="flex gap-6 group">
                        <div className="w-14 h-14 bg-slate-50 border border-slate-100 flex items-center justify-center text-[#158cca] shrink-0 group-hover:bg-[#158cca] group-hover:text-white transition-all">
                          <Phone size={24} />
                        </div>
                        <div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Llámanos</div>
                          <div className="text-xl font-bold text-slate-900">{currentSede.mobile}</div>
                          <div className="text-sm text-slate-500 font-medium">{currentSede.phone}</div>
                        </div>
                      </div>
                      <div className="flex gap-6 group">
                        <div className="w-14 h-14 bg-slate-50 border border-slate-100 flex items-center justify-center text-[#158cca] shrink-0 group-hover:bg-[#158cca] group-hover:text-white transition-all">
                          <Mail size={24} />
                        </div>
                        <div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Escríbenos</div>
                          <div className="text-xl font-bold text-slate-900">{currentSede.email}</div>
                          <div className="text-sm text-slate-500 font-medium">{currentSede.altEmail}</div>
                        </div>
                      </div>
                      <div className="flex gap-6 group">
                        <div className="w-14 h-14 bg-slate-50 border border-slate-100 flex items-center justify-center text-[#158cca] shrink-0 group-hover:bg-[#158cca] group-hover:text-white transition-all">
                          <Clock size={24} />
                        </div>
                        <div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Horario de Atención</div>
                          <div className="text-xl font-bold text-slate-900">{currentSede.schedule}</div>
                          <div className="text-sm text-slate-500 font-medium">{currentSede.hours}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="p-8 bg-[#158cca] text-white relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -rotate-45 translate-x-10 -translate-y-10 group-hover:bg-white/10 transition-colors" />
                    <div className="flex items-center gap-4 mb-6 relative z-10">
                      <MessageSquare size={32} />
                      <h3 className="text-xl font-black uppercase tracking-tighter">Atención Inmediata</h3>
                    </div>
                    <p className="text-white/80 text-sm mb-8 font-medium leading-relaxed relative z-10">
                      ¿Necesitas agendar ahora mismo en la <strong>{currentSede.name}</strong>? Nuestro canal de WhatsApp está activo para darte respuesta en menos de 5 minutos.
                    </p>
                    <a
                      href={`https://wa.me/${currentSede.whatsapp}?text=${encodeURIComponent(`Hola San Luis Medic, quiero agendar una cita en la ${currentSede.name}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="relative z-10 inline-flex items-center gap-3 bg-white text-[#158cca] font-black px-8 h-12 text-xs uppercase tracking-widest hover:bg-[#0f172a] hover:text-white transition-all shadow-lg"
                    >
                      <FaWhatsapp size={18} /> Chat de WhatsApp
                    </a>
                  </motion.div>
                </motion.div>
              ) : (
                <div className="p-12 border-2 border-dashed border-slate-100 text-center flex flex-col items-center justify-center min-h-[300px]">
                  <div className="w-16 h-16 bg-slate-50 flex items-center justify-center mb-6 text-slate-300">
                    <MapPin size={32} />
                  </div>
                  <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] max-w-[200px]">Elige una sede arriba para mostrar la información de contacto</p>
                </div>
              )}
            </div>



            {/* Contact Form */}
            <div className="relative">
              <div className={`bg-slate-50 p-12 border border-slate-100 shadow-sm transition-all duration-500 ${selectedSede === null ? 'opacity-40 pointer-events-none grayscale' : 'opacity-100'}`}>
                <h3 className="text-2xl font-black text-[#0f172a] uppercase tracking-tighter mb-8">Envíanos un Mensaje</h3>
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre Completo</label>
                      <input name="nombre" value={formData.nombre} onChange={handleInputChange} required type="text" disabled={selectedSede === null} className="w-full bg-white border border-slate-200 h-12 px-4 text-sm font-bold focus:outline-none focus:border-[#158cca] transition-colors disabled:cursor-not-allowed" placeholder="Ej. Juan Pérez" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Teléfono / WhatsApp</label>
                      <input name="telefono" value={formData.telefono} onChange={handleInputChange} required type="text" disabled={selectedSede === null} className="w-full bg-white border border-slate-200 h-12 px-4 text-sm font-bold focus:outline-none focus:border-[#158cca] transition-colors disabled:cursor-not-allowed" placeholder="999 888 777" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Correo Electrónico</label>
                      <input name="correo" value={formData.correo} onChange={handleInputChange} type="email" disabled={selectedSede === null} className="w-full bg-white border border-slate-200 h-12 px-4 text-sm font-bold focus:outline-none focus:border-[#158cca] transition-colors disabled:cursor-not-allowed" placeholder="juan.perez@email.com" />
                    </div>
                    <div className="space-y-2 flex flex-col">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Fecha Deseada</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            disabled={selectedSede === null}
                            variant={"outline"}
                            className={cn(
                              "w-full bg-white border border-slate-200 h-12 px-4 text-sm font-bold justify-start text-left focus:outline-none focus:border-[#158cca] transition-colors disabled:cursor-not-allowed hover:bg-slate-50 rounded-none",
                              !fecha && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {fecha ? format(fecha, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={fecha}
                            onSelect={setFecha}
                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sede de Interés</label>
                    <select 
                      disabled={selectedSede === null} 
                      value={selectedSede !== null ? sedes[selectedSede].name : ""}
                      onChange={(e) => {
                        const idx = sedes.findIndex(s => s.name === e.target.value);
                        if (idx !== -1) setSelectedSede(idx);
                      }}
                      className="w-full bg-white border border-slate-200 h-12 px-4 text-sm font-bold focus:outline-none focus:border-[#158cca] transition-colors disabled:cursor-not-allowed"
                    >
                      <option value="" disabled>Selecciona una sede</option>
                      {sedes.map((sede, idx) => (
                        <option key={idx} value={sede.name}>{sede.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mensaje (Opcional)</label>
                    <textarea name="mensaje" value={formData.mensaje} onChange={handleInputChange} disabled={selectedSede === null} className="w-full bg-white border border-slate-200 p-4 text-sm font-bold focus:outline-none focus:border-[#158cca] transition-colors h-32 resize-none disabled:cursor-not-allowed" placeholder="¿Cómo podemos ayudarte?"></textarea>
                  </div>
                  <Button type="submit" disabled={selectedSede === null || !fecha} className="w-full bg-[#25D366] hover:bg-[#1DA851] text-white font-black h-14 rounded-none transition-all uppercase text-xs tracking-widest flex items-center justify-center gap-3 disabled:opacity-50">
                    Enviar por WhatsApp <FaWhatsapp size={20} />
                  </Button>
                </form>
              </div>

              {selectedSede === null && (
                <div className="absolute inset-0 z-20 flex items-center justify-center p-6 text-center">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/90 backdrop-blur-sm p-8 border border-[#158cca]/20 shadow-2xl"
                  >
                    <div className="w-12 h-12 bg-[#158cca]/10 flex items-center justify-center mx-auto mb-4 text-[#158cca]">
                      <Send size={24} />
                    </div>
                    <p className="text-[#0f172a] font-black uppercase tracking-widest text-[10px] mb-2">Formulario Bloqueado</p>
                    <p className="text-slate-500 text-xs font-medium">Por favor elige una sede para habilitar el envío de mensajes.</p>
                  </motion.div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
