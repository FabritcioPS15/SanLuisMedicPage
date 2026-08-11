import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Recategorización de Licencia de Conducir | Examen Médico MTC | San Luis Medic',
  description: 'Sube de categoría para vehículos mayores o transporte público con tu examen médico MTC. Evaluación completa y certificado en el día.',
  alternates: {
    canonical: 'https://sanluismedic.pe/servicios/recategorizacion',
  },
  openGraph: {
    title: 'Recategorización de Brevete | Examen Médico MTC | San Luis Medic',
    description: 'Recategoriza tu licencia con la evaluación médica autorizada por el MTC. Resultado inmediato.',
    url: 'https://sanluismedic.pe/servicios/recategorizacion',
    locale: 'es_PE',
    type: 'website',
  },
}

export default function RecategorizacionLayout({ children }: { children: React.ReactNode }) {
  return children
}
