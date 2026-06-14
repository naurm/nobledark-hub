import type { Metadata } from "next"
import "./globals.css"
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants"

export const metadata: Metadata = {
  title: { default: SITE_NAME, template: `%s — ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: SITE_NAME, description: SITE_DESCRIPTION },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-stone-950 text-stone-100 antialiased">
        {children}
      </body>
    </html>
  )
}