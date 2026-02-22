import type { Metadata } from "next"
import { DM_Sans, Cormorant } from "next/font/google"
import Script from "next/script"
import "./globals.css"

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || process.env.META_PIXEL_ID

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const cormorant = Cormorant({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
})

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.svg",
  },
  title: "Kizento - Bentos Isothermes Premium",
  description:
    "Des bentos isothermes qui gardent vos repas chauds pendant 5h. Rejoignez la liste d'attente pour un accès prioritaire.",
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
      "Des bentos isothermes qui gardent vos repas chauds pendant 5h. Rejoignez la liste d'attente.",
    type: "website",
    locale: "fr_FR",
    siteName: "Kizento",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kizento - Bentos Isothermes Premium",
    description:
      "Des bentos isothermes qui gardent vos repas chauds pendant 5h. Rejoignez la liste d'attente.",
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
      <body className={`${dmSans.variable} ${cormorant.variable} font-sans`}>
        {META_PIXEL_ID && (
          <Script
            id="meta-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${META_PIXEL_ID}');
                fbq('track', 'PageView');
              `,
            }}
          />
        )}
        {children}
      </body>
    </html>
  )
}
