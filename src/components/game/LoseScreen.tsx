'use client'
import { useTranslations } from 'next-intl'

interface Props {
  label: string
  image: string | null
  onReset: () => void
}

export function LoseScreen({ label, image, onReset }: Props) {
  const t = useTranslations('lose')

  return (
    <div className="overlay-screen lose-screen">
      <div className="overlay-card">
        <span className="lose-icon">💀</span>
        <h2 className="overlay-title">{t('title')}</h2>
        <p className="overlay-subtitle">{t('subtitle')}</p>
        {image && (
          <div className="target-reveal">
            <img src={image} alt={label} className="target-img" />
            <div className="target-glow-red" aria-hidden="true" />
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
