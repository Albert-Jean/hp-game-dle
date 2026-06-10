'use client'

import Link from 'next/link'
import { MagicalBackground } from '@/components/ui/MagicalBackground'

const MODES = [
  {
    href: '/play/characters',
    icon: '⚡',
    label: 'Personnages',
    description: 'Devine le personnage HP du jour',
    color: '#c9a84c',
  },
  {
    href: '/play/spells',
    icon: '🪄',
    label: 'Sorts',
    description: 'Devine le sort magique du jour',
    color: '#a8b8e8',
  },
]

export default function HomePage() {
  return (
    <>
      <MagicalBackground />

      <main className="home-root">
        <span className="home-crest" aria-hidden="true">⚡</span>
        <h1 className="home-title">HP Gamedle</h1>
        <p className="home-subtitle">Choisis ton défi</p>
        <div className="home-divider" aria-hidden="true" />

        <div className="modes-grid">
          {MODES.map(mode => (
            <Link key={mode.href} href={mode.href} className="mode-card">
              <span className="mode-icon" aria-hidden="true">{mode.icon}</span>
              <div className="mode-label">{mode.label}</div>
              <div className="mode-desc">{mode.description}</div>
            </Link>
          ))}
        </div>

        <p className="home-footer">Un nouveau défi chaque jour</p>
      </main>
    </>
  )
}
