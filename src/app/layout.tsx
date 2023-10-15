import './globals.css'

import clsx from 'clsx'
import { Kanit, Ubuntu, Ubuntu_Mono } from 'next/font/google'

import faviconPng from './favicon.png'
import faviconSvg from './favicon.svg'

import type { Metadata } from 'next'
const kanit = Kanit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-kanit',
  weight: ['200', '400', '700'],
})

const ubuntu = Ubuntu({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-ubuntu',
  weight: ['400', '700'],
})

const ubuntuMono = Ubuntu_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-ubuntu-mono',
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: 'Dicengineers',
  description:
    'Uniting tech enthusiasts, from software engineers to designers, with a shared love for tabletop games. Dive into boardgames, ttrpgs, wargames, and more. Whether you’re new to tech or a seasoned pro, our community welcomes you.',
  icons: [
    { url: faviconSvg, type: 'image/svg+xml', rel: 'icon' },
    { url: faviconPng, type: 'image/png', rel: 'icon' },
  ],
  viewport: { width: 'device-width', initialScale: 1 },
  metadataBase: new URL('https://dicengineers.com'),
  openGraph: {
    title: 'Dicengineers',
    description:
      'Uniting tech enthusiasts, from software engineers to designers, with a shared love for tabletop games. Dive into boardgames, ttrpgs, wargames, and more. Whether you’re new to tech or a seasoned pro, our community welcomes you.',
    siteName: 'Dicengineers.com',
    locale: 'en',
    images: [
      { url: '/ogimg.webp', width: 512, height: 512, alt: 'Dicengineers.com' },
      { url: '/ogimg.png', width: 512, height: 512, alt: 'Dicengineers.com' },
    ],
    url: 'https://dicengineers.com',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={clsx(kanit.variable, ubuntu.variable, ubuntuMono.variable)}>{children}</body>
    </html>
  )
}
