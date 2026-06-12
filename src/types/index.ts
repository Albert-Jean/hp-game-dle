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

/**
 * `label` is now a translation KEY (e.g. "house", "first_appearance"),
 * resolved via t(`columns.${label}`) in the UI — not a display string.
 *
 * `value` can be:
 *  - a raw string from the DB (e.g. "Gryffindor")
 *  - a special token "__YES__" / "__NO__" / "__UNKNOWN__" for booleans/nulls,
 *    resolved via t(`common.yes`) etc. in the UI.
 */
export interface AttributeResult {
  label: string
  value: string
  match: MatchResult
  hint?: 'higher' | 'lower'
}

export interface GuessEntry<T> {
  entity: T
  results: AttributeResult[]
}

// ─── Mode config ──────────────────────────────────────────────────────────────

export interface ModeConfig<T> {
  id: GameMode
  /** translation key suffix, e.g. modes.characters.label */
  icon: string
  table: string
  maxGuesses: number
  /** translation keys, resolved via t(`columns.${key}`) */
  columns: string[]
  compare: (guess: T, target: T) => AttributeResult[]
  getLabel: (entity: T) => string
  getImage: (entity: T) => string | null
  storageKey: () => string
}
