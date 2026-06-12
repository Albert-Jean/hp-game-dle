import { GameStatus, GuessEntry } from '@/types'

interface SavedGame<T> {
  guesses: GuessEntry<T>[]
  status: GameStatus
}

export function saveGame<T>(key: string, guesses: GuessEntry<T>[], status: GameStatus) {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify({ guesses, status }))
}

export function loadGame<T>(key: string): SavedGame<T> | null {
  if (typeof window === 'undefined') return null
  const saved = localStorage.getItem(key)
  if (!saved) return null
  try {
    return JSON.parse(saved) as SavedGame<T>
  } catch {
    return null
  }
}

export function clearGame(key: string) {
  if (typeof window === 'undefined') return
  localStorage.removeItem(key)
}

export function todayKey(mode: string) {
  const today = new Date().toISOString().split('T')[0]
  return `hp-gamedle-${mode}-${today}`
}
