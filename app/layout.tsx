import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Berto - AI Terminal Assistant',
  description: 'Berto a vibe terminal built by https://kemeny.studio',
  generator: 'Berto AI Terminal',
  keywords: ['terminal', 'AI', 'assistant', 'command line', 'CLI', 'natural language'],
  authors: [{ name: 'Kemeny Studio', url: 'https://kemeny.studio' }],
  creator: 'Kemeny Studio',
  publisher: 'Kemeny Studio',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  themeColor: '#4f46e5',
  colorScheme: 'dark light',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#4f46e5" />
      </head>
      <body>{children}</body>
    </html>
  )
}
