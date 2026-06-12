'use client'
import { useEffect, useState } from 'react'

export function MagicalBackground() {
  const [stars, setStars] = useState<{ x: string; y: string; delay: string; size: string }[]>([])

  useEffect(() => {
    setStars(Array.from({ length: 60 }, () => ({
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      delay: `${Math.random() * 4}s`,
      size: `${1 + Math.random() * 2}px`,
    })))
  }, [])

  return (
    <div className="magical-bg" aria-hidden="true">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="stars">
        {stars.map((s, i) => (
          <div key={i} className="star" style={{
            '--x': s.x, '--y': s.y, '--delay': s.delay, '--size': s.size,
          } as React.CSSProperties} />
        ))}
      </div>
    </div>
  )
}
