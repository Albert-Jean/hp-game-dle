'use client'

import { useEffect, useState } from 'react'
import { BOOK_SHORT, BOOK_COVERS } from '@/lib/game-logic'

interface Props {
  value: string
  match: string
  delay: number
  label?: string
  hint?: 'higher' | 'lower'
}

export function AttributeCell({ value, match, delay, label, hint }: Props) {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  const isBook = label === 'Premier livre'
  const bookCover = isBook ? BOOK_COVERS[value] : null
  const displayValue = isBook ? (BOOK_SHORT[value] ?? value) : value

  return (
    <div
      className={`attr-cell ${match} ${revealed ? 'revealed' : ''}`}
      title={value}
      data-label={label}
    >
      {bookCover ? (
        <>
          <img
            src={bookCover}
            alt={value}
            style={{
              width: '32px', height: '44px', objectFit: 'cover',
              borderRadius: '3px',
              border: match === 'correct'
                ? '1.5px solid var(--correct-border)'
                : '1.5px solid var(--wrong-border)',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
            <span className="attr-value" style={{ fontSize: '0.55rem' }}>
              {displayValue}
            </span>           
            <span style={{ fontSize: '0.9rem', color: '#ffd93d', lineHeight: 1 }}>
              {hint ? (hint === 'higher' ? '↑' : '↓') : '' }
            </span>
          </div>
        </>
      ) : (
        <>
          <span className="attr-value">{displayValue}</span>
          {match === 'correct' && revealed && (
            <span className="checkmark" aria-hidden="true">✦</span>
          )}
        </>
      )}
    </div>
  )
}