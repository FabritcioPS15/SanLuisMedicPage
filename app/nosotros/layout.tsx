import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nosotros | San Luis Medic — Exámenes Médicos Autorizados MTC',
  description: 'Conoce a San Luis Medic: más de 15 años realizando exámenes médicos para brevete con certificación MTC a nivel nacional.',
  alternates: {
    canonical: 'https://sanluismedic.pe/nosotros',
  },
  openGraph: {
    title: 'Nosotros | San Luis Medic',
    description: 'Corporación líder en evaluaciones médicas certificadas por el MTC para licencias de conducir.',
    url: 'https://sanluismedic.pe/nosotros',
    locale: 'es_PE',
    type: 'website',
  },
}

export default function NosotrosLayout({ children }: { children: React.ReactNode }) {
  return children
}
