import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contacto | Reserva tu Examen Médico para Brevete | San Luis Medic',
  description: 'Reserva tu cita para examen médico de brevete por WhatsApp o teléfono. Atención al cliente San Luis Medic en Lima, Andahuaylas y Ayacucho.',
  alternates: {
    canonical: 'https://sanluismedic.pe/contacto',
  },
  openGraph: {
    title: 'Contacto | San Luis Medic',
    description: 'Agenda tu examen médico para brevete con San Luis Medic, autorizado por el MTC.',
    url: 'https://sanluismedic.pe/contacto',
    locale: 'es_PE',
    type: 'website',
  },
}

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return children
}
