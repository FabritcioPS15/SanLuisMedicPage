import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Examen Médico para Licencia de Conducir Particular A1 | San Luis Medic',
  description: 'Obtén tu certificado médico MTC para brevete nuevo en 45-60 minutos. Atención rápida en Lima, Andahuaylas y Ayacucho. ¡Reserva hoy!',
  alternates: {
    canonical: 'https://sanluismedic.pe/servicios/licencia-particular',
  },
  openGraph: {
    title: 'Examen Médico para Licencia Particular A1 | San Luis Medic',
    description: 'Certificado médico MTC para tu primera licencia de conducir. Resultado en el día.',
    url: 'https://sanluismedic.pe/servicios/licencia-particular',
    locale: 'es_PE',
    type: 'website',
  },
}

export default function LicenciaParticularLayout({ children }: { children: React.ReactNode }) {
  return children
}
