'use client'

import Image from "next/image"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { compareCharacters, Character, AttributeResult } from '../lib/game-logic'

const MAX_GUESSES = 6

export default function CharactersPage() {
  const [allCharacters, setAllCharacters] = useState<Character[]>([])
  const [target, setTarget] = useState<Character | null>(null)
  const [search, setSearch] = useState('')
  const [suggestions, setSuggestions] = useState<Character[]>([])
  const [guesses, setGuesses] = useState<{ char: Character; results: AttributeResult[] }[]>([])
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing')
  const [loading, setLoading] = useState(true)

  // Charger tous les personnages au démarrage
  useEffect(() => {
    async function load() {
      const response = await supabase
        .from('characters')
        .select('*')
        .not('name', 'is', null)
        .order('name')

      const data = response.data as Character[] | null
      if (data && data.length > 0) {
        setAllCharacters(data)
        // Choisir un perso aléatoire comme cible
        const random = data[Math.floor(Math.random() * data.length)]
        setTarget(random)
      }
      setLoading(false)
    }
    load()
  }, [])

  // Filtrer les suggestions selon la recherche
  useEffect(() => {
    if (search.length < 2) {
      setSuggestions([])
      return
    }
    const alreadyGuessed = guesses.map(g => g.char.id)
    const filtered = allCharacters
      .filter(c =>
        c.name &&
        c.name.toLowerCase().includes(search.toLowerCase()) &&
        !alreadyGuessed.includes(c.id)
      )
      .slice(0, 6)
    setSuggestions(filtered)
  }, [search, allCharacters, guesses])

  function handleGuess(char: Character) {
    if (!target || status !== 'playing') return

    const results = compareCharacters(char, target)
    const newGuesses = [...guesses, { char, results }]
    setGuesses(newGuesses)
    setSearch('')
    setSuggestions([])

    const won = char.id === target.id
    if (won) {
      setStatus('won')
    } else if (newGuesses.length >= MAX_GUESSES) {
      setStatus('lost')
    }
  }

  function reset() {
    const random = allCharacters[Math.floor(Math.random() * allCharacters.length)]
    setTarget(random)
    setGuesses([])
    setSearch('')
    setStatus('playing')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-amber-400 text-xl animate-pulse">Chargement des personnages...</p>
      </div>
    )
  }

  const COLUMNS = ['Maison', 'Espèce', 'Genre', 'Bois baguette', 'Cœur baguette', 'Patronus', 'Étudiant']

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-400 mb-2">⚡ HP Gamedle</h1>
          <p className="text-gray-400">Trouve le personnage Harry Potter en {MAX_GUESSES} essais</p>
          <p className="text-gray-500 text-sm mt-1">
            {MAX_GUESSES - guesses.length} essai(s) restant(s)
          </p>
        </div>

        {/* Message victoire / défaite */}
        {status === 'won' && (
          <div className="bg-green-900 border border-green-500 rounded-lg p-4 text-center mb-6">
            <p className="text-green-300 text-xl font-bold">
              Félicitations ! C'était {target?.name} !
            </p>
            <button onClick={reset} className="mt-3 bg-green-600 hover:bg-green-500 px-6 py-2 rounded-lg text-white">
              Rejouer
            </button>
          </div>
        )}

        {status === 'lost' && (
          <div className="bg-red-900 border border-red-500 rounded-lg p-4 text-center mb-6">
            <p className="text-red-300 text-xl font-bold">
              Perdu ! C'était {target?.name}
            </p>
            {target?.image_url && (
              <img src={target.image_url ?? undefined} alt={target.name ?? ''}
                className="w-24 h-24 object-cover rounded-full mx-auto mt-3" />
            )}
            <button onClick={reset} className="mt-3 bg-red-600 hover:bg-red-500 px-6 py-2 rounded-lg text-white">
              Rejouer
            </button>
          </div>
        )}

        {/* Barre de recherche */}
        {status === 'playing' && (
          <div className="relative mb-8">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tape un nom de personnage..."
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
            />
            {suggestions.length > 0 && (
              <div className="absolute z-10 w-full bg-gray-800 border border-gray-600 rounded-lg mt-1 overflow-hidden">
                {suggestions.map(char => (
                  <button
                    key={char.id}
                    onClick={() => handleGuess(char)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-700 flex items-center gap-3 border-b border-gray-700 last:border-0"
                  >
                    {char.image_url && (
                      <img src={char.image_url ?? undefined} alt={char.name ?? ''}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                    )}
                    <span>{char.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* En-têtes colonnes */}
        {guesses.length > 0 && (
          <div className="mb-2">
            <div className="grid gap-1" style={{ gridTemplateColumns: '180px repeat(7, 1fr)' }}>
              <div />
              {COLUMNS.map(col => (
                <div key={col} className="text-center text-xs text-gray-500 font-medium px-1">
                  {col}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lignes de résultats */}
        <div className="flex flex-col gap-2">
          {guesses.map((g, i) => (
            <div key={i} className="grid gap-1 items-center"
              style={{ gridTemplateColumns: '180px repeat(7, 1fr)' }}>

              {/* Nom + photo */}
              <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2">
                {g.char.image_url && (
                  <img src={g.char.image_url ?? undefined} alt={g.char.name ?? ''}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                )}
                <span className="text-sm font-medium truncate">{g.char.name}</span>
              </div>

              {/* Attributs colorés */}
              {g.results.map((r, j) => (
                <div key={j}
                  className={`rounded-lg py-2 px-1 text-center text-xs font-medium
                    ${r.match === 'correct'
                      ? 'bg-green-700 text-green-100'
                      : 'bg-gray-700 text-gray-300'
                    }`}>
                  {r.value}
                </div>
              ))}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}