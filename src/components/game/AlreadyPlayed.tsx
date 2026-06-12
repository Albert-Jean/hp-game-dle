'use client'
import { useTranslations } from 'next-intl'
import { GameStatus, GuessEntry } from '@/types'

interface Props<T> {
  status: GameStatus
  guesses: GuessEntry<T>[]
  getImage: (entity: T) => string | null
  getLabel: (entity: T) => string
}

export function AlreadyPlayed<T>({ status, guesses, getImage, getLabel }: Props<T>) {
  const t = useTranslations('already_played')

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  const hoursLeft = Math.ceil((tomorrow.getTime() - Date.now()) / 1000 / 3600)

  return (
    <div style={{
      textAlign: 'center', marginTop: '3rem',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(201,168,76,0.2)',
      borderRadius: '16px', padding: '2.5rem 2rem',
      maxWidth: '400px', width: '90%',
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        {status === 'won' ? '⚡' : '💀'}
      </div>
      <h2 style={{
        fontFamily: 'Cinzel, serif', fontSize: '1.3rem',
        color: status === 'won' ? '#c9a84c' : '#ff6b6b',
        marginBottom: '0.75rem',
      }}>
        {status === 'won' ? t('won') : t('lost')}
      </h2>
      <p style={{ color: '#9080b0', fontSize: '1rem', marginBottom: '0.5rem' }}>
        {t('message')}
      </p>
      <p style={{ color: '#6b5420', fontSize: '0.85rem', fontFamily: 'Cinzel, serif' }}>
        {t('next', { hours: hoursLeft })}
      </p>

      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {guesses.map((g, i) => {
          const img = getImage(g.entity)
          const lbl = getLabel(g.entity)
          return (
            <div key={i} style={{
              width: '36px', height: '36px', borderRadius: '50%',
              border: '1.5px solid rgba(201,168,76,0.3)', overflow: 'hidden',
            }}>
              {img
                ? <img src={img} alt={lbl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{
                    width: '100%', height: '100%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', background: 'rgba(201,168,76,0.1)',
                    color: '#c9a84c', fontFamily: 'Cinzel, serif', fontSize: '0.75rem',
                  }}>{lbl.charAt(0)}</div>
              }
            </div>
          )
        })}
      </div>
    </div>
  )
}
