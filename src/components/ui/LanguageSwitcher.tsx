'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useLocale } from 'next-intl'

const LOCALES: { code: string; flag: string; label: string }[] = [
  { code: 'fr', flag: '🇫🇷', label: 'Français' },
  { code: 'en', flag: '🇬🇧', label: 'English' },
]

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function switchLocale(newLocale: string) {
    if (newLocale === locale) return
    // pathname includes the current locale prefix, e.g. /fr/play/characters
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/') || '/')
  }

  return (
    <div className="lang-switcher" role="group" aria-label="Langue / Language">
      {LOCALES.map(l => (
        <button
          key={l.code}
          onClick={() => switchLocale(l.code)}
          className={`lang-btn ${locale === l.code ? 'active' : ''}`}
          aria-pressed={locale === l.code}
          aria-label={l.label}
          title={l.label}
        >
          {l.flag}
        </button>
      ))}
    </div>
  )
}
