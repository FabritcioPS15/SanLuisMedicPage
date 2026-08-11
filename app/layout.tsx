import type { Metadata } from 'next'
import { Arimo, Exo_2, IBM_Plex_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const arimo = Arimo({ 
  subsets: ["latin"],
  variable: '--font-arimo',
});
const exo2 = Exo_2({ 
  subsets: ["latin"],
  variable: '--font-exo2',
});
const ibmPlex = IBM_Plex_Sans({ 
  subsets: ["latin"],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  variable: '--font-ibm-plex',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://sanluismedic.pe'),
  title: 'San Luis Medic | Examen Médico para Brevete en un día - Autorizado MTC',
  description: 'Saca tu brevete nuevo o revalida tu licencia de conducir A1 en un día. Examen médico rápido para brevetes, certificado MTC inmediato. ¡Atención rápida!',
  keywords: ['examen medico brevete', 'medico brevetes', 'licencia de conducir', 'sacar brevete nuevo', 'brevetes en un dia', 'licencia de conducir a1', 'brevete carro', 'mtc examen medico'],
  authors: [{ name: 'San Luis Medic' }],
  openGraph: {
    title: 'San Luis Medic | Exámenes Médicos para Licencia de Conducir',
    description: 'Centro de exámenes médicos autorizado por MTC. Servicio rápido y confiable para tu licencia de conducir en Perú.',
    url: 'https://sanluismedic.pe',
    siteName: 'San Luis Medic',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'San Luis Medic - Examen Médico para Brevete',
      },
    ],
    locale: 'es_PE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'San Luis Medic | Examen Médico para Brevete',
    description: 'Obtén tu certificado médico para brevete en tiempo récord. Autorizado por MTC.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://sanluismedic.pe',
  },
  icons: {
    icon: '/slmfavicon.webp',
    shortcut: '/slmfavicon.webp',
    apple: '/slmfavicon.webp',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${arimo.variable} ${exo2.variable} ${ibmPlex.variable} scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalClinic",
              "name": "San Luis Medic",
              "image": "https://sanluismedic.pe/Slmlogo.webp",
              "@id": "https://sanluismedic.pe",
              "url": "https://sanluismedic.pe",
              "telephone": "+51016429971",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Av. Carlos Izaguirre 108",
                "addressLocality": "Independencia",
                "addressRegion": "Lima",
                "postalCode": "15311",
                "addressCountry": "PE"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": -11.988863,
                "longitude": -77.057482
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday"
                ],
                "opens": "08:00",
                "closes": "18:00"
              },
              "sameAs": [
                "https://www.facebook.com/sanluismedic",
                "https://www.instagram.com/sanluismedic"
              ]
            })
          }}
        />
      </body>
    </html>
  )
}
