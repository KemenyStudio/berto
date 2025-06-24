import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Berto - AI Terminal Assistant',
  description: 'Terminal for humans. No commands, just vibes. AI-powered terminal that understands natural language.',
  generator: 'Berto AI Terminal',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
