import './globals.css'

import clsx from 'clsx'
import { Kanit, Ubuntu, Ubuntu_Mono } from 'next/font/google'

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
  icons: ['favicon.svg'],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={clsx(kanit.variable, ubuntu.variable, ubuntuMono.variable)}>{children}</body>
    </html>
  )
}
