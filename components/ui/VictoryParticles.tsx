'use client'
import { useEffect, useState } from 'react'

export function VictoryParticles() {
  const [particles, setParticles] = useState<{
    x: string; delay: string; duration: string; size: string; color: string
  }[]>([])

  useEffect(() => {
    const colors = ['#FFD700', '#ae0001', '#1a472a', '#ecb939', '#a8b8e8']
    setParticles(Array.from({ length: 40 }, () => ({
      x: `${Math.random() * 100}vw`,
      delay: `${Math.random() * 2}s`,
      duration: `${2 + Math.random() * 3}s`,
      size: `${4 + Math.random() * 8}px`,
      color: colors[Math.floor(Math.random() * colors.length)],
    })))
  }, [])

  return (
    <div className="victory-particles" aria-hidden="true">
      {particles.map((p, i) => (
        <div key={i} className="particle" style={{
          '--x': p.x, '--delay': p.delay, '--duration': p.duration,
          '--size': p.size, '--color': p.color,
        } as React.CSSProperties} />
      ))}
    </div>
  )
}
