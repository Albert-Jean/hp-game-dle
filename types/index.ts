// ─── Entities ────────────────────────────────────────────────────────────────

export interface Character {
  id: string
  name: string
  house: string | null
  species: string | null
  gender: string | null
  blood_status: string | null
  patronus: string | null
  is_student: boolean | null
  first_appearance: string | null
  image_url: string | null
}

export interface Spell {
  id: string
  name: string
  incantation: string | null
  effect: string | null
  category: string | null
  light: string | null
  is_unforgivable: boolean
}

// ─── Game ─────────────────────────────────────────────────────────────────────

export type MatchResult = 'correct' | 'wrong'
export type GameStatus = 'playing' | 'won' | 'lost'
export type GameMode = 'characters' | 'spells'

export interface AttributeResult {
  label: string
  value: string
  match: MatchResult
}

export interface GuessEntry<T> {
  entity: T
  results: AttributeResult[]
}

// ─── Mode config ──────────────────────────────────────────────────────────────

export interface ModeConfig<T> {
  id: GameMode
  label: string
  description: string
  icon: string
  table: string
  maxGuesses: number
  columns: string[]
  compare: (guess: T, target: T) => AttributeResult[]
  getLabel: (entity: T) => string
  getImage: (entity: T) => string | null
  storageKey: () => string
}
