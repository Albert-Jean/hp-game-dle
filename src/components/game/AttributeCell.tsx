'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { BOOK_SHORT, BOOK_COVERS, YES, NO, UNKNOWN } from '@/lib/game-logic'

interface Props {
  /** raw value from compare() — may be a DB value or a __TOKEN__ */
  value: string
  match: string
  delay: number
  /** translation key, e.g. "first_appearance", "house"... */
  labelKey?: string
  hint?: 'higher' | 'lower'
}

export function AttributeCell({ value, match, delay, labelKey, hint }: Props) {
  const t = useTranslations()
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  const isBook = labelKey === 'first_appearance'
  const bookCover = isBook ? BOOK_COVERS[value] : null

  // Resolve special tokens (Yes/No/Unknown) and book short codes to localized text
  let displayValue = value
  if (value === YES) displayValue = t('common.yes')
  else if (value === NO) displayValue = t('common.no')
  else if (value === UNKNOWN) displayValue = t('common.unknown')
  else if (isBook) displayValue = BOOK_SHORT[value] ?? value

  const columnLabel = labelKey ? t(`columns.${labelKey}`) : undefined

  return (
    <div
      className={`attr-cell ${match} ${revealed ? 'revealed' : ''}`}
      title={value === UNKNOWN ? t('common.unknown') : displayValue}
      data-label={columnLabel}
    >
      {bookCover ? (
        <>
          <img
            src={bookCover}
            alt={displayValue}
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
            {hint && match !== 'correct' && (
              <span style={{ fontSize: '0.9rem', color: '#ffd93d', lineHeight: 1 }} aria-hidden="true">
                {hint === 'higher' ? '↑' : '↓'}
              </span>
            )}
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
