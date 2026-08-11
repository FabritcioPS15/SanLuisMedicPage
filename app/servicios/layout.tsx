import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Servicios de Examen Médico para Brevete | San Luis Medic MTC',
  description: 'Exámenes médicos certificados por el MTC para licencia de conducir: licencia nueva (A1), revalidación, recategorización y licencia de moto. Resultados en el día.',
  alternates: {
    canonical: 'https://sanluismedic.pe/servicios',
  },
  openGraph: {
    title: 'Servicios de Examen Médico para Brevete | San Luis Medic',
    description: 'Exámenes médicos certificados por el MTC: licencia nueva, revalidación, recategorización y licencia de moto.',
    url: 'https://sanluismedic.pe/servicios',
    locale: 'es_PE',
    type: 'website',
  },
}

export default function ServiciosLayout({ children }: { children: React.ReactNode }) {
  return children
}
