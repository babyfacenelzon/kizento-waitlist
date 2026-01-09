import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Kizento - Bentos Isothermes Premium",
  description:
    "Bentos isothermes premium, design japonais. Rejoignez la liste d'attente pour un accès prioritaire et des avantages exclusifs.",
  keywords: [
    "bento",
    "bento isotherme",
    "lunch box",
    "design japonais",
    "premium",
    "Kizento",
  ],
  authors: [{ name: "Kizento" }],
  openGraph: {
    title: "Kizento - L'art du bento, réinventé",
    description:
      "Bentos isothermes premium, design japonais. Bientôt disponible.",
    type: "website",
    locale: "fr_FR",
    siteName: "Kizento",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kizento - Bentos Isothermes Premium",
    description:
      "Bentos isothermes premium, design japonais. Rejoignez la liste d'attente.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>): React.ReactElement {
  return (
    <html lang="fr">
      <body className={`${playfair.variable} ${inter.variable} font-sans`}>
        {children}
      </body>
    </html>
  )
}
