import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Examen Médico para Licencia de Moto (B-II) | San Luis Medic',
  description: 'Certificado médico MTC para licencia de moto en el día. Evaluación visual, psicológica y médica con atención rápida y sin colas.',
  alternates: {
    canonical: 'https://sanluismedic.pe/servicios/licencia-moto',
  },
  openGraph: {
    title: 'Examen Médico para Licencia de Moto (B-II) | San Luis Medic',
    description: 'Obtén tu certificado médico MTC para conducir moto con una evaluación rápida y especializada.',
    url: 'https://sanluismedic.pe/servicios/licencia-moto',
    locale: 'es_PE',
    type: 'website',
  },
}

export default function LicenciaMotoLayout({ children }: { children: React.ReactNode }) {
  return children
}
