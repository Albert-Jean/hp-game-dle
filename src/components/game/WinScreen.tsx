'use client'
import { useTranslations } from 'next-intl'
import { VictoryParticles } from '@/components/ui/VictoryParticles'

interface Props {
  label: string
  image: string | null
  guessCount: number
  onReset: () => void
}

export function WinScreen({ label, image, guessCount, onReset }: Props) {
  const t = useTranslations('win')

  const subtitle = guessCount === 1
    ? t('subtitle_one', { count: guessCount })
    : t('subtitle_other', { count: guessCount })

  return (
    <div className="overlay-screen win-screen">
      <VictoryParticles />
      <div className="overlay-card">
        <span className="win-icon">⚡</span>
        <h2 className="overlay-title">{t('title')}</h2>
        <p className="overlay-subtitle">{subtitle}</p>
        {image && (
          <div className="target-reveal">
            <img src={image} alt={label} className="target-img" />
            <div className="target-glow" aria-hidden="true" />
          </div>
        )}
        <p className="target-name">{label}</p>
        <div className="overlay-actions">
          <button className="btn-primary" onClick={onReset}>{t('button')}</button>
        </div>
      </div>
    </div>
  )
}
