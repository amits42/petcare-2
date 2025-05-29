import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navigation from "@/components/navigation"
import MobileNavigation from "@/components/mobile-navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PetCare - Professional Pet Care Services",
  description: "Book trusted pet care services for your beloved pets",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main className="pb-16 md:pb-0">{children}</main>
        <MobileNavigation />
      </body>
    </html>
  )
}
