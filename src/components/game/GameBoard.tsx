'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { supabase } from '@/lib/supabase'
import { saveGame, loadGame } from '@/lib/storage'
import { ModeConfig, GameStatus, GuessEntry, AttributeResult } from '@/types'
import { GuessRow } from './GuessRow'
import { WinScreen } from './WinScreen'
import { LoseScreen } from './LoseScreen'
import { AlreadyPlayed } from './AlreadyPlayed'
import { SearchInput } from './SearchInput'
import { MagicalBackground } from '@/components/ui/MagicalBackground'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'

interface Props<T extends { id: string }> {
  mode: ModeConfig<T>
}

export function GameBoard<T extends { id: string }>({ mode }: Props<T>) {
  const t = useTranslations()
  const locale = useLocale()
  const [allEntities, setAllEntities] = useState<T[]>([])
  const [target, setTarget] = useState<T | null>(null)
  const [search, setSearch] = useState('')
  const [suggestions, setSuggestions] = useState<T[]>([])
  const [guesses, setGuesses] = useState<GuessEntry<T>[]>([])
  const [status, setStatus] = useState<GameStatus>('playing')
  const [loading, setLoading] = useState(true)
  const [alreadyPlayed, setAlreadyPlayed] = useState(false)
  const [shakeInput, setShakeInput] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const boardRef = useRef<HTMLDivElement>(null)

  // ── Fetch data + saved game (single effect, correct order) ─────────────────
  useEffect(() => {
    async function load() {
      try {
        const { data, error: fetchError } = await supabase
          .from(mode.table)
          .select('*')
          .order('name' as any)

        if (fetchError) {
          setError(`Erreur fetch (${mode.table}): ${fetchError.message}`)
          setLoading(false)
          return
        }

        if (!data?.length) {
          setError(`Table "${mode.table}" vide ou introuvable`)
          setLoading(false)
          return
        }

        setAllEntities(data as T[])

        const today = new Date().toISOString().split('T')[0]
        const { data: daily } = await supabase
          .from('daily_games')
          .select('entity_id')
          .eq('game_date', today)
          .eq('mode', mode.id)
          .maybeSingle()

        const found = daily
          ? (data as T[]).find(e => e.id === daily.entity_id)
          : null
        setTarget(found ?? (data as T[])[Math.floor(Math.random() * data.length)])

        // Load localStorage AFTER data is ready
        const saved = loadGame<T>(mode.storageKey())
        if (saved && saved.guesses.length > 0) {
          setGuesses(saved.guesses)
          setStatus(saved.status)
          setAlreadyPlayed(true)
        }

        setLoading(false)
      } catch (err: any) {
        setError(`Erreur inattendue: ${err.message}`)
        setLoading(false)
      }
    }
    load()
  }, [mode])

  // ── Save on every guess ────────────────────────────────────────────────────
  useEffect(() => {
    if (guesses.length > 0) saveGame(mode.storageKey(), guesses, status)
  }, [guesses, status, mode])

  // ── Suggestions ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (search.length < 2) { setSuggestions([]); return }
    const guessed = guesses.map(g => g.entity.id)
    setSuggestions(
      allEntities
        .filter(e =>
          mode.getLabel(e,locale).toLowerCase().includes(search.toLowerCase()) &&
          !guessed.includes(e.id)
        )
        .slice(0, 6)
    )
  }, [search, allEntities, guesses, mode])

  // ── Handle guess ──────────────────────────────────────────────────────────
  function handleGuess(entity: T) {
    if (!target || status !== 'playing') return

    const results: AttributeResult[] = mode.compare(entity, target)
    const newGuesses = [...guesses, { entity, results }]
    setGuesses(newGuesses)
    setSearch('')
    setSuggestions([])

    if (entity.id === target.id) {
      setTimeout(() => setStatus('won'), 800)
    } else if (newGuesses.length >= mode.maxGuesses) {
      setTimeout(() => setStatus('lost'), 800)
    } else {
      setShakeInput(true)
      setTimeout(() => setShakeInput(false), 500)
    }

    setTimeout(() =>
      boardRef.current?.scrollTo({ top: boardRef.current.scrollHeight, behavior: 'smooth' }), 100
    )
  }

  function reset() {
    const random = allEntities[Math.floor(Math.random() * allEntities.length)]
    setTarget(random)
    setGuesses([])
    setSearch('')
    setStatus('playing')
    setAlreadyPlayed(false)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const remaining = mode.maxGuesses - guesses.length
  const modeLabel = t(`modes.${mode.id}.label`)
  const modeDescription = t(`modes.${mode.id}.description`)

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="loading-screen">
      <MagicalBackground />
      <div className="loading-content">
        <span className="loading-wand" aria-hidden="true">🪄</span>
        <p className="loading-text">{t('game.loading')}</p>
        <div className="loading-dots" aria-label="Loading">
          <span /><span /><span />
        </div>
      </div>
    </div>
  )

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) return (
    <div style={{
      minHeight: '100vh', background: '#05040a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: '1rem', padding: '2rem',
    }}>
      <div style={{ fontSize: '2rem' }}>💀</div>
      <p style={{
        color: '#ff6b6b', fontFamily: 'monospace',
        fontSize: '0.9rem', textAlign: 'center',
        background: 'rgba(255,0,0,0.1)', padding: '1rem',
        borderRadius: '8px', maxWidth: '500px',
      }}>
        {error}
      </p>
    </div>
  )

  // ── Already played ─────────────────────────────────────────────────────────
  if (alreadyPlayed && status !== 'playing') return (
    <div className="game-root">
      <MagicalBackground />
      <header className="game-header">
        <div className="header-top">
          <LanguageSwitcher />
        </div>
        <span className="header-crest" aria-hidden="true">{mode.icon}</span>
        <h1 className="game-title">{t('home.title')}</h1>
        <p className="game-subtitle">{modeDescription}</p>
        <div className="header-divider" aria-hidden="true" />
      </header>
      <AlreadyPlayed
        status={status}
        guesses={guesses}
        getImage={mode.getImage}
        getLabel={(entity: T) => mode.getLabel(entity, locale)}
      />
    </div>
  )

  // ── Main game ──────────────────────────────────────────────────────────────
  return (
    <>
      <MagicalBackground />
      <div className="game-root">

        <header className="game-header">
          <div className="header-top">
            <LanguageSwitcher />
          </div>
          <span className="header-crest" aria-hidden="true">{mode.icon}</span>
          <h1 className="game-title">{t('home.title')}</h1>
          <p className="game-subtitle">{t('game.subtitle')}</p>
          <div className="header-divider" aria-hidden="true" />
        </header>

        {/* Attempts dots */}
        <div className="attempts-row" role="status" aria-label={t('game.attempts_left', { count: remaining })}>
          {Array.from({ length: mode.maxGuesses }).map((_, i) => (
            <div key={i} className={`attempt-dot ${
              i < guesses.length ? (i === mode.maxGuesses - 1 ? 'last' : 'used') : ''
            }`} />
          ))}
        </div>

        {/* Search */}
        {status === 'playing' && (
          <SearchInput
            value={search}
            onChange={setSearch}
            onSelect={id => {
              const entity = allEntities.find(e => e.id === id)
              if (entity) handleGuess(entity)
            }}
            suggestions={suggestions.map(e => ({
              id: e.id,
              label: mode.getLabel(e,locale),
              image: mode.getImage(e),
            }))}
            placeholder={t('game.search_placeholder', { mode: modeLabel.toLowerCase() })}
            shake={shakeInput}
          />
        )}

        {/* Hint */}
        {status === 'playing' && guesses.length > 0 && (
          <p className={`hint-message ${remaining <= 1 ? 'danger' : remaining <= 2 ? 'warning' : 'normal'}`}>
            {remaining <= 1 ? t('game.last_attempt') : t('game.attempts_left', { count: remaining })}
          </p>
        )}

        {/* Grid — headers + rows scroll together */}
        <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' as any }}>
          <div style={{ width: 'max-content', minWidth: '100%' }}>

            {guesses.length > 0 && (
              <div className="col-headers" aria-hidden="true">
                <div />
                {mode.columns.map(col => (
                  <div key={col} className="col-header">{t(`columns.${col}`)}</div>
                ))}
              </div>
            )}

            <div className="guess-board" ref={boardRef} role="list" aria-label="Guesses">
              {guesses.map((g, i) => (
                <GuessRow
                  key={i}
                  label={mode.getLabel(g.entity,locale)}
                  image={mode.getImage(g.entity)}
                  results={g.results}
                  index={i}
                />
              ))}
            </div>

          </div>
        </div>

        {/* Legend */}
        <div className="legend" aria-label="Legend">
          <div className="legend-item">
            <div className="legend-dot correct" aria-hidden="true" />{t('game.correct')}
          </div>
          <div className="legend-item">
            <div className="legend-dot wrong" aria-hidden="true" />{t('game.incorrect')}
          </div>
        </div>

      </div>

      {status === 'won' && target && (
        <WinScreen
          label={mode.getLabel(target,locale)}
          image={mode.getImage(target)}
          guessCount={guesses.length}
          onReset={reset}
        />
      )}
      {status === 'lost' && target && (
        <LoseScreen
          label={mode.getLabel(target,locale)}
          image={mode.getImage(target)}
          onReset={reset}
        />
      )}
    </>
  )
}
