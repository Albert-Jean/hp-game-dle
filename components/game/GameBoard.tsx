'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { saveGame, loadGame } from '@/lib/storage'
import { ModeConfig, GameStatus, GuessEntry, AttributeResult } from '@/types'
import { GuessRow } from './GuessRow'
import { WinScreen } from './WinScreen'
import { LoseScreen } from './LoseScreen'
import { AlreadyPlayed } from './AlreadyPlayed'
import { MagicalBackground } from '@/components/ui/MagicalBackground'

interface Props<T extends { id: string }> {
  mode: ModeConfig<T>
}

export function GameBoard<T extends { id: string }>({ mode }: Props<T>) {
  const [allEntities, setAllEntities] = useState<T[]>([])
  const [target, setTarget] = useState<T | null>(null)
  const [search, setSearch] = useState('')
  const [suggestions, setSuggestions] = useState<T[]>([])
  const [guesses, setGuesses] = useState<GuessEntry<T>[]>([])
  const [status, setStatus] = useState<GameStatus>('playing')
  const [loading, setLoading] = useState(true)
  const [alreadyPlayed, setAlreadyPlayed] = useState(false)
  const [shakeInput, setShakeInput] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const boardRef = useRef<HTMLDivElement>(null)
  const [error,setError]=useState<string|null>(null)

  // ── Save on every guess ────────────────────────────────────────────────────
  useEffect(() => {
    if (guesses.length > 0) saveGame(mode.storageKey(), guesses, status)
  }, [guesses, status, mode])
  // ── Load saved game + fetch data en même temps ─────────────────────────────
useEffect(() => {
  async function load() {
    try {
      // 1. Charger les données Supabase
      const { data, error: fetchError } = await supabase
        .from(mode.table)
        .select('*')
        .order('name' as any)

      if (fetchError) {
        setError(`Erreur fetch: ${fetchError.message}`)
        setLoading(false)
        return
      }

      if (!data?.length) {
        setError(`Table ${mode.table} vide ou introuvable`)
        setLoading(false)
        return
      }

      setAllEntities(data as T[])

      // 2. Charger le jeu du jour
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

      // 3. Charger localStorage APRÈS les données
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



  // ── Suggestions ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (search.length < 2) { setSuggestions([]); return }
    const guessed = guesses.map(g => g.entity.id)
    setSuggestions(
      allEntities
        .filter(e =>
          mode.getLabel(e).toLowerCase().includes(search.toLowerCase()) &&
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

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="loading-screen">
      <MagicalBackground />
      <div className="loading-content">
        <span className="loading-wand" aria-hidden="true">🪄</span>
        <p className="loading-text">Ouverture du livre des sorts...</p>
        <div className="loading-dots" aria-label="Chargement">
          <span /><span /><span />
        </div>
      </div>
    </div>
  )

  // ── Already played ─────────────────────────────────────────────────────────
  if (alreadyPlayed && status !== 'playing') return (
    <div className="game-root">
      <MagicalBackground />
      <header className="game-header">
        <span className="header-crest" aria-hidden="true">{mode.icon}</span>
        <h1 className="game-title">HP Gamedle</h1>
        <p className="game-subtitle">{mode.description}</p>
        <div className="header-divider" aria-hidden="true" />
      </header>
      <AlreadyPlayed
        status={status}
        guesses={guesses}
        getImage={mode.getImage}
        getLabel={mode.getLabel}
      />
    </div>
  )

  // ── Main game ──────────────────────────────────────────────────────────────
  return (
    <>
      <MagicalBackground />
      <div className="game-root">

        <header className="game-header">
          <span className="header-crest" aria-hidden="true">{mode.icon}</span>
          <h1 className="game-title">HP Gamedle</h1>
          <p className="game-subtitle">{mode.description}</p>
          <div className="header-divider" aria-hidden="true" />
        </header>

        {/* Attempts dots */}
        <div className="attempts-row" role="status" aria-label={`${remaining} essais restants`}>
          {Array.from({ length: mode.maxGuesses }).map((_, i) => (
            <div key={i} className={`attempt-dot ${
              i < guesses.length ? (i === mode.maxGuesses - 1 ? 'last' : 'used') : ''
            }`} />
          ))}
        </div>

        {/* Search */}
        {status === 'playing' && (
          <div className="search-container">
            <div className={`search-wrap ${shakeInput ? 'shake' : ''}`}>
              <span className="search-icon" aria-hidden="true">🔍</span>
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={`Nomme un ${mode.label.toLowerCase()}...`}
                className="search-input"
                aria-label={`Chercher un ${mode.label}`}
                aria-autocomplete="list"
                autoComplete="off"
              />
            </div>
            {suggestions.length > 0 && (
              <div className="suggestions" role="listbox">
                {suggestions.map(entity => (
                  <button
                    key={entity.id}
                    role="option"
                    className="suggestion-item"
                    onClick={() => handleGuess(entity)}
                  >
                    {mode.getImage(entity)
                      ? <img src={mode.getImage(entity)!} alt="" className="suggestion-avatar" aria-hidden="true" />
                      : <div className="suggestion-placeholder" aria-hidden="true">
                          {mode.getLabel(entity).charAt(0)}
                        </div>
                    }
                    <span>{mode.getLabel(entity)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Hint */}
        {status === 'playing' && guesses.length > 0 && (
          <p className={`hint-message ${remaining <= 1 ? 'danger' : remaining <= 2 ? 'warning' : 'normal'}`}>
            {remaining <= 1
              ? '⚠️ Dernier essai !'
              : `${remaining} essais restants`}
          </p>
        )}

        {/* Grid — headers + rows scroll together */}
        <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' as any }}>
          <div style={{ width: 'max-content', minWidth: '100%' }}>

            {guesses.length > 0 && (
              <div className="col-headers" aria-hidden="true">
                <div />
                {mode.columns.map(col => (
                  <div key={col} className="col-header">{col}</div>
                ))}
              </div>
            )}

            <div className="guess-board" ref={boardRef} role="list" aria-label="Tentatives">
              {guesses.map((g, i) => (
                <GuessRow
                  key={i}
                  label={mode.getLabel(g.entity)}
                  image={mode.getImage(g.entity)}
                  results={g.results}
                  index={i}
                />
              ))}
            </div>

          </div>
        </div>

        {/* Legend */}
        <div className="legend" aria-label="Légende">
          <div className="legend-item">
            <div className="legend-dot correct" aria-hidden="true" />Correct
          </div>
          <div className="legend-item">
            <div className="legend-dot wrong" aria-hidden="true" />Incorrect
          </div>
        </div>

      </div>

      {status === 'won' && target && (
        <WinScreen
          label={mode.getLabel(target)}
          image={mode.getImage(target)}
          guessCount={guesses.length}
          onReset={reset}
        />
      )}
      {status === 'lost' && target && (
        <LoseScreen
          label={mode.getLabel(target)}
          image={mode.getImage(target)}
          onReset={reset}
        />
      )}
    </>
  )
}
