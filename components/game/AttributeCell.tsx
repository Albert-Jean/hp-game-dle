'use client'
import { useEffect, useState } from 'react'
import { BOOK_SHORT, BOOK_COVERS } from '@/lib/game-logic'

interface Props {
  value: string
  match: string
  delay: number
  label?: string
}

export function AttributeCell({ value, match, delay, label }: Props) {
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
          <span className="attr-value" style={{ fontSize: '0.55rem' }}>{displayValue}</span>
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
