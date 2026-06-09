'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { compareCharacters, Character, AttributeResult } from '@/lib/game-logic'

const TODAY = new Date().toISOString().split('T')[0]
const STORAGE_KEY = `hp-gamedle-characters-${TODAY}`

const MAX_GUESSES = 6

const BOOK_SHORT: Record<string, string> = {
  "The Philosopher's Stone": 'T1',
  "The Chamber of Secrets": 'T2',
  "The Prisoner of Azkaban": 'T3',
  "The Goblet of Fire": 'T4',
  "The Order of the Phoenix": 'T5',
  "The Half-Blood Prince": 'T6',
  "The Deathly Hallows": 'T7',
}

const HOUSE_COLORS: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  Gryffindor:   { bg: 'rgba(116,0,1,0.25)',    border: '#ae0001', text: '#e8b4b8', glow: '0 0 20px rgba(174,0,1,0.4)' },
  Slytherin:    { bg: 'rgba(26,71,42,0.25)',   border: '#1a472a', text: '#aacfb5', glow: '0 0 20px rgba(26,71,42,0.5)' },
  Ravenclaw:    { bg: 'rgba(14,26,82,0.25)',   border: '#0e1a52', text: '#a8b8e8', glow: '0 0 20px rgba(14,26,82,0.5)' },
  Hufflepuff:   { bg: 'rgba(236,185,57,0.15)', border: '#ecb939', text: '#f5dA8a', glow: '0 0 20px rgba(236,185,57,0.3)' },
}

// Particle system for victory
function VictoryParticles() {
  const [particles, setParticles] = useState<{ x: string; delay: string; duration: string; size: string; color: string }[]>([])

  useEffect(() => {
    const colors = ['#FFD700','#ae0001','#1a472a','#ecb939','#a8b8e8']
    setParticles(Array.from({ length: 40 }, () => ({
      x: `${Math.random() * 100}vw`,
      delay: `${Math.random() * 2}s`,
      duration: `${2 + Math.random() * 3}s`,
      size: `${4 + Math.random() * 8}px`,
      color: colors[Math.floor(Math.random() * colors.length)],
    })))
  }, [])

  return (
    <div className="victory-particles" aria-hidden="true">
      {particles.map((p, i) => (
        <div key={i} className="particle" style={{
          '--x': p.x, '--delay': p.delay, '--duration': p.duration,
          '--size': p.size, '--color': p.color,
        } as React.CSSProperties} />
      ))}
    </div>
  )
}

// Magical floating orbs background
function MagicalBackground() {
  const [stars, setStars] = useState<{ x: string; y: string; delay: string; size: string }[]>([])

  useEffect(() => {
    setStars(Array.from({ length: 60 }, () => ({
      x: `${Math.random() * 100}%`,
      y: `${Math.random() * 100}%`,
      delay: `${Math.random() * 4}s`,
      size: `${1 + Math.random() * 2}px`,
    })))
  }, [])

  return (
    <div className="magical-bg" aria-hidden="true">
      <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
      <div className="stars">
        {stars.map((s, i) => (
          <div key={i} className="star" style={{
            '--x': s.x, '--y': s.y, '--delay': s.delay, '--size': s.size
          } as React.CSSProperties} />
        ))}
      </div>
    </div>
  )
}

function AttributeCell({ value, match, delay }: { value: string; match: string; delay: number }) {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <div
      className={`attr-cell ${match} ${revealed ? 'revealed' : ''}`}
      title={value}
    >
      <span className="attr-value">{value}</span>
      {match === 'correct' && revealed && (
        <span className="checkmark" aria-hidden="true">✦</span>
      )}
    </div>
  )
}

function GuessRow({ guess, results, index }: {
  guess: Character
  results: AttributeResult[]
  index: number
}) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 50)
    return () => clearTimeout(t)
  }, [])

  const houseStyle = guess.house && HOUSE_COLORS[guess.house]
    ? { borderColor: HOUSE_COLORS[guess.house].border }
    : {}

  return (
    <div className={`guess-row ${show ? 'show' : ''}`} style={{ '--row-index': index } as React.CSSProperties}>
      {/* Character name cell */}
      <div className="char-cell" style={houseStyle}>
        {guess.image_url ? (
          <img src={guess.image_url} alt={guess.name} className="char-avatar" />
        ) : (
          <div className="char-avatar-placeholder" style={
            guess.house && HOUSE_COLORS[guess.house]
              ? { background: HOUSE_COLORS[guess.house].bg, color: HOUSE_COLORS[guess.house].text }
              : {}
          }>
            {guess.name.charAt(0)}
          </div>
        )}
        <span className="char-name">{guess.name}</span>
      </div>

      {/* Attribute cells */}
      {results.map((r, j) => (
        <AttributeCell
          key={j}
          value={r.label === 'Premier livre' ? (BOOK_SHORT[r.value] ?? r.value) : r.value}
          match={r.match}
          delay={j * 120 + 200}
        />
      ))}
    </div>
  )
}

function WinScreen({ target, guesses, onReset }: { target: Character; guesses: number; onReset: () => void }) {
  return (
    <div className="overlay-screen win-screen">
      <VictoryParticles />
      <div className="overlay-card">
        <div className="win-icon">⚡</div>
        <h2 className="overlay-title">Accio Victory!</h2>
        <p className="overlay-subtitle">
          Tu as trouvé en <strong>{guesses}</strong> essai{guesses > 1 ? 's' : ''} !
        </p>
        {target.image_url && (
          <div className="target-reveal">
            <img src={target.image_url} alt={target.name} className="target-img" />
            <div className="target-glow" aria-hidden="true" />
          </div>
        )}
        <p className="target-name">{target.name}</p>
        <div className="overlay-actions">
          <button className="btn-primary" onClick={onReset}>
            Nouvelle partie
          </button>
        </div>
      </div>
    </div>
  )
}

function LoseScreen({ target, onReset }: { target: Character; onReset: () => void }) {
  return (
    <div className="overlay-screen lose-screen">
      <div className="overlay-card">
        <div className="lose-icon">💀</div>
        <h2 className="overlay-title">Avada Kedavra...</h2>
        <p className="overlay-subtitle">Tu n'as pas trouvé le personnage mystère.</p>
        {target.image_url && (
          <div className="target-reveal">
            <img src={target.image_url} alt={target.name} className="target-img" />
            <div className="target-glow-red" aria-hidden="true" />
          </div>
        )}
        <p className="target-name">{target.name}</p>
        <div className="overlay-actions">
          <button className="btn-primary" onClick={onReset}>
            Réessayer
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CharactersPage() {
const [allCharacters, setAllCharacters] = useState<Character[]>([])
const [target, setTarget] = useState<Character | null>(null)
const [search, setSearch] = useState('')
const [suggestions, setSuggestions] = useState<Character[]>([])
const [guesses, setGuesses] = useState<{ char: Character; results: AttributeResult[] }[]>([])
const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing')
const [loading, setLoading] = useState(true)
const [shakeInput, setShakeInput] = useState(false)
const [alreadyPlayed, setAlreadyPlayed] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const boardRef = useRef<HTMLDivElement>(null)

// Charger depuis localStorage au démarrage
useEffect(() => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    const parsed = JSON.parse(saved)
    setGuesses(parsed.guesses)
    setStatus(parsed.status)
    setAlreadyPlayed(true)
  }
}, [])

// Sauvegarder dans localStorage à chaque guess
useEffect(() => {
  if (guesses.length > 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ guesses, status }))
  }
}, [guesses, status])

useEffect(() => {
  async function load() {
    const { data: allChars } = await supabase
      .from('characters')
      .select('*')
      .order('name')

    if (allChars) setAllCharacters(allChars)

    const today = new Date().toISOString().split('T')[0]
    const { data: daily } = await supabase
      .from('daily_games')
      .select('entity_id')
      .eq('game_date', today)
      .eq('mode', 'characters')
      .maybeSingle()

    if (daily && allChars) {
      const found = allChars.find(c => c.id === daily.entity_id)
      setTarget(found ?? allChars[Math.floor(Math.random() * allChars.length)])
    } else if (allChars) {
      setTarget(allChars[Math.floor(Math.random() * allChars.length)])
    }

    setLoading(false)
  }
  load()
}, [])

  useEffect(() => {
    if (search.length < 2) { setSuggestions([]); return }
    const guessed = guesses.map(g => g.char.id)
    setSuggestions(
      allCharacters
        .filter(c => c.name.toLowerCase().includes(search.toLowerCase()) && !guessed.includes(c.id))
        .slice(0, 6)
    )
  }, [search, allCharacters, guesses])

  function handleGuess(char: Character) {
    if (!target || status !== 'playing') return
    const results = compareCharacters(char, target)
    const newGuesses = [...guesses, { char, results }]
    setGuesses(newGuesses)
    setSearch('')
    setSuggestions([])

    if (char.id === target.id) {
      setTimeout(() => setStatus('won'), 800)
    } else if (newGuesses.length >= MAX_GUESSES) {
      setTimeout(() => setStatus('lost'), 800)
    } else {
      setShakeInput(true)
      setTimeout(() => setShakeInput(false), 500)
    }

    setTimeout(() => boardRef.current?.scrollTo({ top: boardRef.current.scrollHeight, behavior: 'smooth' }), 100)
  }

  function reset() {
    const random = allCharacters[Math.floor(Math.random() * allCharacters.length)]
    setTarget(random)
    setGuesses([])
    setSearch('')
    setStatus('playing')
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const COLUMNS = ['Maison', 'Espèce', 'Genre', 'Statut du sang','Premier livre','Patronus', 'Étudiant']
  const remaining = MAX_GUESSES - guesses.length
// Déjà joué aujourd'hui
if (!loading && alreadyPlayed && status !== 'playing') {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  const hoursLeft = Math.ceil((tomorrow.getTime() - Date.now()) / 1000 / 3600)

  return (
    <>
      <style>{`/* ... ton style existant ... */`}</style>
      <MagicalBackground />
      <div className="game-root">
        <header className="game-header">
          <span className="header-crest" aria-hidden="true">⚡</span>
          <h1 className="game-title">HP Gamedle</h1>
          <p className="game-subtitle">Qui suis-je ?</p>
          <div className="header-divider" aria-hidden="true" />
        </header>

        <div style={{
          textAlign: 'center', marginTop: '3rem',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(201,168,76,0.2)',
          borderRadius: '16px', padding: '2.5rem 2rem',
          maxWidth: '400px', width: '90%'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            {status === 'won' ? '⚡' : '💀'}
          </div>
          <h2 style={{
            fontFamily: 'Cinzel, serif', fontSize: '1.3rem',
            color: status === 'won' ? '#c9a84c' : '#ff6b6b',
            marginBottom: '0.75rem'
          }}>
            {status === 'won' ? 'Bien joué !' : 'Pas de chance !'}
          </h2>
          <p style={{ color: '#9080b0', fontSize: '1rem', marginBottom: '0.5rem' }}>
            Tu as déjà joué aujourd'hui.
          </p>
          <p style={{ color: '#6b5420', fontSize: '0.85rem', fontFamily: 'Cinzel, serif' }}>
            Prochain personnage dans <strong style={{ color: '#c9a84c' }}>{hoursLeft}h</strong>
          </p>

          {/* Résumé de la partie */}
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {guesses.map((g, i) => (
              <div key={i} style={{
                width: '32px', height: '32px', borderRadius: '50%',
                border: '1.5px solid rgba(201,168,76,0.3)',
                overflow: 'hidden', flexShrink: 0
              }}>
                {g.char.image_url
                  ? <img src={g.char.image_url} alt={g.char.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '100%', background: 'rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#c9a84c', fontFamily: 'Cinzel, serif' }}>
                      {g.char.name.charAt(0)}
                    </div>
                }
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
  if (loading) {
    return (
      <div className="loading-screen">
        <MagicalBackground />
        <div className="loading-content">
          <div className="loading-wand" aria-hidden="true">🪄</div>
          <p className="loading-text">Ouverture du livre des sorts...</p>
          <div className="loading-dots" aria-label="Chargement">
            <span /><span /><span />
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --gold: #c9a84c;
          --gold-light: #e8c97a;
          --gold-dim: #6b5420;
          --parchment: #f0e6c8;
          --ink: #1a0a00;
          --bg-deep: #05040a;
          --bg-mid: #0d0a1a;
          --correct: #1a5c2a;
          --correct-border: #2d9944;
          --correct-text: #a8f0b8;
          --wrong: #1a1025;
          --wrong-border: #3d2d50;
          --wrong-text: #8070a0;
          --font-display: 'Cinzel', serif;
          --font-body: 'Crimson Pro', serif;
        }

        body { background: var(--bg-deep); }

        /* ── Magical Background ── */
        .magical-bg {
          position: fixed; inset: 0; z-index: 0; overflow: hidden; pointer-events: none;
        }
        .orb {
          position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.15;
          animation: orb-drift 20s ease-in-out infinite alternate;
        }
        .orb-1 { width: 600px; height: 600px; background: #4a0080; top: -200px; left: -200px; animation-delay: 0s; }
        .orb-2 { width: 500px; height: 500px; background: #003060; bottom: -150px; right: -150px; animation-delay: -7s; }
        .orb-3 { width: 400px; height: 400px; background: #800020; top: 40%; left: 30%; animation-delay: -14s; }
        @keyframes orb-drift {
          from { transform: translate(0, 0) scale(1); }
          to { transform: translate(40px, 30px) scale(1.1); }
        }

        .stars { position: absolute; inset: 0; }
        .star {
          position: absolute;
          left: var(--x); top: var(--y);
          width: var(--size); height: var(--size);
          background: white; border-radius: 50%;
          animation: twinkle var(--delay, 2s) ease-in-out infinite alternate;
          animation-delay: var(--delay);
        }
        @keyframes twinkle {
          from { opacity: 0.1; transform: scale(0.8); }
          to { opacity: 0.8; transform: scale(1.2); }
        }

        /* ── Layout ── */
        .game-root {
          position: relative; z-index: 1;
          min-height: 100vh;
          font-family: var(--font-body);
          color: var(--parchment);
          display: flex; flex-direction: column; align-items: center;
          padding: 0 1rem 4rem;
        }

        /* ── Header ── */
        .game-header {
          width: 100%; max-width: 900px;
          text-align: center;
          padding: 2.5rem 0 1.5rem;
          position: relative;
        }
        .header-crest {
          font-size: 2.5rem; margin-bottom: 0.5rem;
          animation: float 4s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .game-title {
          font-family: var(--font-display);
          font-size: clamp(1.8rem, 5vw, 3rem);
          font-weight: 900;
          letter-spacing: 0.08em;
          background: linear-gradient(135deg, #c9a84c 0%, #e8c97a 40%, #c9a84c 60%, #a07830 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: none;
          margin-bottom: 0.25rem;
        }
        .game-subtitle {
          font-size: 1rem; color: #9080b0; letter-spacing: 0.15em;
          text-transform: uppercase; font-family: var(--font-display); font-weight: 400;
        }
        .header-divider {
          width: 200px; height: 1px; margin: 1rem auto 0;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
        }

        /* ── Attempts counter ── */
        .attempts-row {
          display: flex; gap: 8px; justify-content: center; margin: 1.25rem 0;
        }
        .attempt-dot {
          width: 10px; height: 10px; border-radius: 50%;
          border: 1.5px solid var(--gold-dim);
          background: transparent;
          transition: all 0.3s ease;
        }
        .attempt-dot.used { background: var(--gold-dim); border-color: var(--gold); }
        .attempt-dot.last { background: #8b0000; border-color: #ff4444; box-shadow: 0 0 8px rgba(255,68,68,0.5); }

        /* ── Search ── */
        .search-container {
          width: 100%; max-width: 560px;
          position: relative; margin-bottom: 1.5rem;
        }
        .search-wrap {
          position: relative;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(201,168,76,0.3);
          border-radius: 12px;
          overflow: visible;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search-wrap:focus-within {
          border-color: var(--gold);
          box-shadow: 0 0 0 3px rgba(201,168,76,0.15), 0 0 30px rgba(201,168,76,0.1);
        }
        .search-wrap.shake {
          animation: shake 0.4s ease;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
        .search-icon {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          font-size: 1rem; opacity: 0.5; pointer-events: none;
        }
        .search-input {
          width: 100%; background: transparent; border: none; outline: none;
          color: var(--parchment); font-family: var(--font-body);
          font-size: 1.05rem; padding: 14px 14px 14px 42px;
          letter-spacing: 0.02em;
        }
        .search-input::placeholder { color: rgba(240,230,200,0.3); }

        /* ── Suggestions ── */
        .suggestions {
          position: absolute; top: calc(100% + 6px); left: 0; right: 0; z-index: 50;
          background: #110d1f;
          border: 1px solid rgba(201,168,76,0.25);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0,0,0,0.7);
          animation: suggest-in 0.15s ease;
        }
        @keyframes suggest-in {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .suggestion-item {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 16px; cursor: pointer;
          transition: background 0.15s;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          background: transparent; border-left: none; border-right: none; border-top: none;
          width: 100%; text-align: left; color: var(--parchment);
          font-family: var(--font-body); font-size: 1rem;
        }
        .suggestion-item:last-child { border-bottom: none; }
        .suggestion-item:hover { background: rgba(201,168,76,0.08); }
        .suggestion-avatar {
          width: 32px; height: 32px; border-radius: 50%; object-fit: cover;
          border: 1.5px solid rgba(201,168,76,0.3); flex-shrink: 0;
        }
        .suggestion-placeholder {
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(201,168,76,0.1); border: 1.5px solid rgba(201,168,76,0.3);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.8rem; color: var(--gold); flex-shrink: 0;
          font-family: var(--font-display);
        }
        .suggestion-house {
          font-size: 0.75rem; color: var(--gold-dim);
          font-family: var(--font-display); margin-left: auto; flex-shrink: 0;
        }

        /* ── Column headers ── */
        .col-headers {
          width: 100%; max-width: 900px; margin-bottom: 6px;
          display: grid;
          grid-template-columns: 180px repeat(7, 1fr);
          gap: 4px;
        }
        .col-header {
          font-family: var(--font-display);
          font-size: 0.6rem; letter-spacing: 0.12em;
          text-transform: uppercase; color: var(--gold-dim);
          text-align: center; padding: 4px 2px;
        }

        /* ── Guess board ── */
        .guess-board {
          width: 100%; max-width: 900px;
          display: flex; flex-direction: column; gap: 4px;
        }

        /* ── Guess Row ── */
        .guess-row {
          display: grid;
          grid-template-columns: 180px repeat(7, 1fr);
          gap: 4px;
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.4s ease, transform 0.4s ease;
          transition-delay: calc(var(--row-index, 0) * 0.05s);
        }
        .guess-row.show { opacity: 1; transform: translateY(0); }

        .char-cell {
          display: flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(201,168,76,0.2);
          border-radius: 8px; padding: 6px 10px;
          min-width: 0;
        }
        .char-avatar {
          width: 32px; height: 32px; border-radius: 50%; object-fit: cover;
          border: 1.5px solid rgba(201,168,76,0.4); flex-shrink: 0;
        }
        .char-avatar-placeholder {
          width: 32px; height: 32px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-display); font-size: 0.9rem; font-weight: 700;
          flex-shrink: 0; border: 1.5px solid rgba(201,168,76,0.3);
        }
        .char-name {
          font-size: 0.78rem; font-family: var(--font-display);
          color: var(--parchment); white-space: nowrap;
          overflow: hidden; text-overflow: ellipsis;
        }

        /* ── Attribute Cell ── */
        .attr-cell {
          border-radius: 8px; padding: 6px 4px;
          display: flex; align-items: center; justify-content: center;
          flex-direction: column; gap: 2px;
          border: 1px solid transparent;
          opacity: 0; transform: rotateY(90deg) scale(0.8);
          transition: opacity 0.35s ease, transform 0.35s ease, background 0.3s;
          position: relative; overflow: hidden;
          min-height: 44px;
        }
        .attr-cell.revealed { opacity: 1; transform: rotateY(0) scale(1); }

        .attr-cell.correct {
          background: var(--correct);
          border-color: var(--correct-border);
          box-shadow: 0 0 12px rgba(45,153,68,0.2), inset 0 1px 0 rgba(255,255,255,0.05);
        }
        .attr-cell.wrong {
          background: var(--wrong);
          border-color: var(--wrong-border);
        }
        .attr-cell.correct::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 60%);
          pointer-events: none;
        }

        .attr-value {
          font-size: 0.68rem; text-align: center; line-height: 1.2;
          font-family: var(--font-display); letter-spacing: 0.03em;
          color: var(--correct-text);
          word-break: break-word;
        }
        .attr-cell.wrong .attr-value { color: var(--wrong-text); }

        .checkmark {
          font-size: 0.7rem; color: var(--correct-border);
          animation: pop 0.3s ease;
        }
        @keyframes pop {
          0% { transform: scale(0); }
          60% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }

        /* ── Hint message ── */
        .hint-message {
          text-align: center; margin: 1.25rem 0 0.5rem;
          font-family: var(--font-display); font-size: 0.75rem;
          letter-spacing: 0.1em; text-transform: uppercase;
        }
        .hint-message.danger { color: #ff6b6b; }
        .hint-message.warning { color: #ffd93d; }
        .hint-message.normal { color: var(--gold-dim); }

        /* ── Legend ── */
        .legend {
          display: flex; gap: 16px; justify-content: center;
          margin-top: 1.5rem; flex-wrap: wrap;
        }
        .legend-item {
          display: flex; align-items: center; gap: 6px;
          font-size: 0.75rem; color: #7060a0;
          font-family: var(--font-display); letter-spacing: 0.06em;
        }
        .legend-dot {
          width: 10px; height: 10px; border-radius: 3px;
        }
        .legend-dot.correct { background: var(--correct-border); }
        .legend-dot.wrong { background: var(--wrong-border); }

        /* ── Overlay screens ── */
        .overlay-screen {
          position: fixed; inset: 0; z-index: 100;
          display: flex; align-items: center; justify-content: center;
          background: rgba(5, 4, 10, 0.85);
          backdrop-filter: blur(12px);
          animation: overlay-in 0.4s ease;
        }
        @keyframes overlay-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .overlay-card {
          background: linear-gradient(160deg, #0d0a1a 0%, #14102a 100%);
          border: 1px solid rgba(201,168,76,0.3);
          border-radius: 20px;
          padding: 2.5rem 2rem;
          text-align: center;
          max-width: 380px; width: 90%;
          box-shadow: 0 40px 80px rgba(0,0,0,0.8), 0 0 60px rgba(201,168,76,0.05);
          animation: card-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative; z-index: 1;
        }
        @keyframes card-in {
          from { transform: scale(0.7) translateY(40px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }

        .win-icon, .lose-icon {
          font-size: 3.5rem; margin-bottom: 1rem;
          display: block;
        }
        .win-icon { animation: bounce-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both; }
        .lose-icon { animation: shake-in 0.5s ease 0.2s both; }
        @keyframes bounce-in {
          from { transform: scale(0) rotate(-20deg); opacity: 0; }
          to { transform: scale(1) rotate(0); opacity: 1; }
        }
        @keyframes shake-in {
          0%, 100% { transform: rotate(0); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }

        .overlay-title {
          font-family: var(--font-display);
          font-size: 1.6rem; font-weight: 900;
          letter-spacing: 0.06em; margin-bottom: 0.5rem;
        }
        .win-screen .overlay-title {
          background: linear-gradient(135deg, #c9a84c, #e8c97a, #c9a84c);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .lose-screen .overlay-title { color: #ff6b6b; }

        .overlay-subtitle {
          font-size: 1rem; color: #9080b0; margin-bottom: 1.5rem;
          font-family: var(--font-body);
        }
        .overlay-subtitle strong { color: var(--gold); }

        .target-reveal {
          position: relative; display: inline-block;
          margin-bottom: 0.75rem;
        }
        .target-img {
          width: 90px; height: 90px; border-radius: 50%; object-fit: cover;
          border: 2px solid var(--gold);
          animation: reveal-img 0.5s ease 0.4s both;
        }
        @keyframes reveal-img {
          from { transform: scale(0); filter: blur(10px); }
          to { transform: scale(1); filter: blur(0); }
        }
        .target-glow {
          position: absolute; inset: -10px; border-radius: 50%;
          background: radial-gradient(circle, rgba(201,168,76,0.3) 0%, transparent 70%);
          animation: glow-pulse 2s ease infinite;
        }
        .target-glow-red {
          position: absolute; inset: -10px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,50,50,0.3) 0%, transparent 70%);
          animation: glow-pulse 2s ease infinite;
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }

        .target-name {
          font-family: var(--font-display);
          font-size: 1.2rem; color: var(--gold);
          letter-spacing: 0.06em; margin-bottom: 1.5rem;
        }

        .overlay-actions { display: flex; gap: 10px; justify-content: center; }

        .btn-primary {
          background: linear-gradient(135deg, #6b4c00, #c9a84c, #6b4c00);
          background-size: 200% 100%; background-position: right;
          border: 1px solid var(--gold); border-radius: 10px;
          color: var(--ink); font-family: var(--font-display);
          font-size: 0.85rem; font-weight: 700; letter-spacing: 0.1em;
          padding: 12px 28px; cursor: pointer;
          transition: background-position 0.3s, box-shadow 0.3s, transform 0.15s;
          text-transform: uppercase;
        }
        .btn-primary:hover {
          background-position: left;
          box-shadow: 0 0 20px rgba(201,168,76,0.4);
          transform: translateY(-2px);
        }
        .btn-primary:active { transform: translateY(0); }

        /* ── Victory particles ── */
        .victory-particles { position: fixed; inset: 0; pointer-events: none; z-index: 99; overflow: hidden; }
        .particle {
          position: absolute;
          left: var(--x); top: -20px;
          width: var(--size); height: var(--size);
          background: var(--color);
          border-radius: 2px;
          animation: fall var(--duration) ease-in var(--delay) infinite;
        }
        @keyframes fall {
          0% { transform: translateY(0) rotate(0) scale(1); opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg) scale(0.3); opacity: 0; }
        }

        /* ── Loading ── */
        .loading-screen {
          position: fixed; inset: 0;
          display: flex; align-items: center; justify-content: center;
          background: var(--bg-deep);
        }
        .loading-content { text-align: center; z-index: 1; }
        .loading-wand {
          font-size: 3rem; display: block; margin-bottom: 1rem;
          animation: wand-wave 1.5s ease-in-out infinite;
        }
        @keyframes wand-wave {
          0%, 100% { transform: rotate(-20deg); }
          50% { transform: rotate(20deg); }
        }
        .loading-text {
          font-family: var(--font-display); font-size: 1rem;
          color: var(--gold-dim); letter-spacing: 0.1em;
          text-transform: uppercase; margin-bottom: 1.5rem;
        }
        .loading-dots { display: flex; gap: 8px; justify-content: center; }
        .loading-dots span {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--gold-dim);
          animation: dot-pulse 1.2s ease infinite;
        }
        .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes dot-pulse {
          0%, 100% { transform: scale(0.6); opacity: 0.3; }
          50% { transform: scale(1.2); opacity: 1; }
        }

        /* ── Responsive ── */
        @media (max-width: 700px) {
          .col-headers, .guess-row {
            grid-template-columns: 130px repeat(7, 1fr);
          }
          .char-name { font-size: 0.65rem; }
          .attr-value { font-size: 0.58rem; }
          .col-header { font-size: 0.5rem; }
        }
        @media (max-width: 500px) {
          .col-headers, .guess-row {
            grid-template-columns: 100px repeat(7, 1fr);
            gap: 2px;
          }
          .char-cell { padding: 4px 6px; gap: 4px; }
          .char-avatar, .char-avatar-placeholder { width: 24px; height: 24px; }
        }
      `}</style>

      <MagicalBackground />

      <div className="game-root">

        {/* Header */}
        <header className="game-header">
          <div className="header-crest" aria-hidden="true">⚡</div>
          <h1 className="game-title">HP Gamedle</h1>
          <p className="game-subtitle">Qui suis-je ?</p>
          <div className="header-divider" aria-hidden="true" />
        </header>

        {/* Attempts dots */}
        <div className="attempts-row" role="status" aria-label={`${remaining} essais restants`}>
          {Array.from({ length: MAX_GUESSES }).map((_, i) => (
            <div key={i} className={`attempt-dot ${
              i < guesses.length
                ? (i === MAX_GUESSES - 1 ? 'last' : 'used')
                : ''
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
                placeholder="Nomme un personnage..."
                className="search-input"
                aria-label="Chercher un personnage Harry Potter"
                aria-autocomplete="list"
                autoComplete="off"
              />
            </div>
            {suggestions.length > 0 && (
              <div className="suggestions" role="listbox">
                {suggestions.map(char => (
                  <button
                    key={char.id}
                    role="option"
                    className="suggestion-item"
                    onClick={() => handleGuess(char)}
                  >
                    {char.image_url
                      ? <img src={char.image_url} alt="" className="suggestion-avatar" aria-hidden="true" />
                      : <div className="suggestion-placeholder" aria-hidden="true">{char.name.charAt(0)}</div>
                    }
                    <span>{char.name}</span>
                    {char.house && <span className="suggestion-house">{char.house}</span>}
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
              : remaining <= 2
              ? `${remaining} essais restants — réfléchis bien`
              : `${remaining} essais restants`}
          </p>
        )}

       {/* Conteneur scrollable — headers + rows bougent ensemble */}
      <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {guesses.length > 0 && (
          <div className="col-headers" aria-hidden="true">
        <div />
          {['Maison','Espèce','Genre','Statut du sang','Premier livre','Patronus','Étudiant'].map(col => (
        <div key={col} className="col-header">{col}</div>
          ))}
        </div>
        )}

  <div className="guess-board" ref={boardRef} role="list" aria-label="Tentatives">
    {guesses.map((g, i) => (
      <GuessRow key={i} guess={g.char} results={g.results} index={i} />
    ))}
  </div>
</div>


        {/* Legend */}
        <div className="legend" aria-label="Légende">
          <div className="legend-item">
            <div className="legend-dot correct" aria-hidden="true" />
            Correct
          </div>
          <div className="legend-item">
            <div className="legend-dot wrong" aria-hidden="true" />
            Incorrect
          </div>
        </div>

      </div>

      {/* Overlays */}
      {status === 'won' && target && (
        <WinScreen target={target} guesses={guesses.length} onReset={reset} />
      )}
      {status === 'lost' && target && (
        <LoseScreen target={target} onReset={reset} />
      )}
    </>
  )
}
