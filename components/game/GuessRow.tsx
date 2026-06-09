'use client'
import { useEffect, useState } from 'react'
import { AttributeResult } from '@/types'
import { AttributeCell } from './AttributeCell'
import { BOOK_SHORT } from '@/lib/game-logic'

interface Props {
  label: string
  image: string | null
  results: AttributeResult[]
  index: number
}

export function GuessRow({ label, image, results, index }: Props) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 50)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className={`guess-row ${show ? 'show' : ''}`}
      style={{ '--row-index': index } as React.CSSProperties}
      role="listitem"
    >
      {/* Name + avatar */}
      <div className="char-cell">
        {image ? (
          <img src={image} alt={label} className="char-avatar" />
        ) : (
          <div className="char-avatar-placeholder">{label.charAt(0)}</div>
        )}
        <span className="char-name">{label}</span>
      </div>

      {/* Attributes */}
      {results.map((r, j) => (
        <AttributeCell
          key={j}
          value={r.value}
          match={r.match}
          delay={j * 120 + 200}
          label={r.label}
        />
      ))}
    </div>
  )
}
