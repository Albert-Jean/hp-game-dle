import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HP Gamedle',
  description: 'Devine le personnage Harry Potter du jour !',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
