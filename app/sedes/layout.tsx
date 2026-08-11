import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nuestras Sedes | Examen Médico Brevete en Lima, Andahuaylas y Ayacucho',
  description: 'Encuentra la sede más cercana de San Luis Medic para tu examen médico de brevete: Lima (Independencia), Andahuaylas y Ayacucho. Autorizados por el MTC.',
  alternates: {
    canonical: 'https://sanluismedic.pe/sedes',
  },
  openGraph: {
    title: 'Nuestras Sedes | San Luis Medic',
    description: 'Sedes de San Luis Medic en Lima, Andahuaylas y Ayacucho para tu examen médico de brevete.',
    url: 'https://sanluismedic.pe/sedes',
    locale: 'es_PE',
    type: 'website',
  },
}

export default function SedesLayout({ children }: { children: React.ReactNode }) {
  return children
}
