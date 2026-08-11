import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Revalidación de Licencia de Conducir | Examen Médico MTC | San Luis Medic',
  description: 'Renueva tu brevete vencido con nuestro examen médico autorizado por el MTC. Proceso rápido, sin colas y certificado en el día.',
  alternates: {
    canonical: 'https://sanluismedic.pe/servicios/revalidacion',
  },
  openGraph: {
    title: 'Revalidación de Brevete | Examen Médico MTC | San Luis Medic',
    description: 'Renueva tu licencia de conducir con un examen médico MTC rápido y sin complicaciones.',
    url: 'https://sanluismedic.pe/servicios/revalidacion',
    locale: 'es_PE',
    type: 'website',
  },
}

export default function RevalidacionLayout({ children }: { children: React.ReactNode }) {
  return children
}
