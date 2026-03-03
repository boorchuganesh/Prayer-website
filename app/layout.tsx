import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Navigation } from '@/components/navigation'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Faithybites - Prayer Community',
  description: 'Faithybites is a digital prayer altar connecting people in need of prayer with believers willing to pray. Submit prayer requests and join our faith community.',
  icons: {
    icon: '/favicon.svg',
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <Navigation />
        {children}
      </body>
    </html>
  )
}
