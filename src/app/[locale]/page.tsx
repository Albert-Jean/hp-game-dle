'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { MagicalBackground } from '@/components/ui/MagicalBackground'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { ALL_MODES } from '@/config/modes'

export default function HomePage() {
  const t = useTranslations()
  const locale = useLocale()

  return (
    <main className="home-root">
      <MagicalBackground />

      <div className="header-top">
        <LanguageSwitcher />
      </div>

      <span className="home-crest" aria-hidden="true">⚡</span>
      <h1 className="home-title">{t('home.title')}</h1>
      <p className="home-subtitle">{t('home.subtitle')}</p>
      <div className="home-divider" aria-hidden="true" />

      <div className="modes-grid">
        {ALL_MODES.map(mode => (
          <Link key={mode.id} href={`/${locale}/play/${mode.id}`} className="mode-card">
            <span className="mode-icon" aria-hidden="true">{mode.icon}</span>
            <div className="mode-label">{t(`modes.${mode.id}.label`)}</div>
            <div className="mode-desc">{t(`modes.${mode.id}.description`)}</div>
          </Link>
        ))}
      </div>

      <p className="home-footer">{t('home.footer')}</p>
    </main>
  )
}
