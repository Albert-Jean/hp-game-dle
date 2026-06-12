import { AttributeResult, Character, Spell } from '@/types'

// Special tokens resolved in the UI via t('common.xxx')
const YES = '__YES__'
const NO = '__NO__'
const UNKNOWN = '__UNKNOWN__'

const val = (v: string | null) => v ?? UNKNOWN
const fmt = (v: boolean | null) => (v ? YES : NO)
const exact = (a: unknown, b: unknown): 'correct' | 'wrong' =>
  String(a ?? '').toLowerCase() === String(b ?? '').toLowerCase() ? 'correct' : 'wrong'

// ─── Book helpers ─────────────────────────────────────────────────────────────
// Raw DB values stay in English — only used as lookup keys, never displayed directly.

export const BOOK_SHORT: Record<string, string> = {
  "The Philosopher's Stone": 'T1',
  "The Chamber of Secrets":  'T2',
  "The Prisoner of Azkaban": 'T3',
  "The Goblet of Fire":      'T4',
  "The Order of the Phoenix":'T5',
  "The Half-Blood Prince":   'T6',
  "The Deathly Hallows":     'T7',
}

export const BOOK_COVERS: Record<string, string> = {
  "The Philosopher's Stone": 'https://upload.wikimedia.org/wikipedia/en/6/6b/Harry_Potter_and_the_Philosopher%27s_Stone_Book_Cover.jpg',
  "The Chamber of Secrets":  'https://upload.wikimedia.org/wikipedia/en/5/5c/Harry_Potter_and_the_Chamber_of_Secrets.jpg',
  "The Prisoner of Azkaban": 'https://upload.wikimedia.org/wikipedia/en/a/a0/Harry_Potter_and_the_Prisoner_of_Azkaban.jpg',
  "The Goblet of Fire":      'https://upload.wikimedia.org/wikipedia/en/b/b6/Harry_Potter_and_the_Goblet_of_Fire_cover.png',
  "The Order of the Phoenix":'https://upload.wikimedia.org/wikipedia/en/7/70/Harry_Potter_and_the_Order_of_the_Phoenix.jpg',
  "The Half-Blood Prince":   'https://upload.wikimedia.org/wikipedia/en/b/b5/Harry_Potter_and_the_Half-Blood_Prince_cover.jpg',
  "The Deathly Hallows":     'https://upload.wikimedia.org/wikipedia/en/a/a9/Harry_Potter_and_the_Deathly_Hallows.jpg',
}

const BOOK_ORDER: Record<string, number> = {
  "The Philosopher's Stone": 1,
  "The Chamber of Secrets":  2,
  "The Prisoner of Azkaban": 3,
  "The Goblet of Fire":      4,
  "The Order of the Phoenix":5,
  "The Half-Blood Prince":   6,
  "The Deathly Hallows":     7,
}

function bookHint(guessBook: string | null, targetBook: string | null): 'higher' | 'lower' | undefined {
  const g = BOOK_ORDER[guessBook ?? '']
  const t = BOOK_ORDER[targetBook ?? '']
  if (!g || !t || g === t) return undefined
  return g < t ? 'higher' : 'lower'
}

// ─── Character compare ────────────────────────────────────────────────────────
// `label` values below are translation KEYS — see messages/*.json "columns".

export function compareCharacters(guess: Character, target: Character): AttributeResult[] {
  return [
    { label: 'house',            value: val(guess.house),            match: exact(guess.house, target.house) },
    { label: 'species',          value: val(guess.species),          match: exact(guess.species, target.species) },
    { label: 'gender',           value: val(guess.gender),           match: exact(guess.gender, target.gender) },
    { label: 'blood_status',     value: val(guess.blood_status),     match: exact(guess.blood_status, target.blood_status) },
    {
      label: 'first_appearance',
      value: val(guess.first_appearance),
      match: exact(guess.first_appearance, target.first_appearance),
      hint: bookHint(guess.first_appearance, target.first_appearance),
    },
    { label: 'patronus',         value: val(guess.patronus),         match: exact(guess.patronus, target.patronus) },
    { label: 'is_student',       value: fmt(guess.is_student),       match: exact(guess.is_student, target.is_student) },
  ]
}

// ─── Spell compare ────────────────────────────────────────────────────────────

export function compareSpells(guess: Spell, target: Spell): AttributeResult[] {
  return [
    { label: 'incantation',     value: val(guess.incantation), match: exact(guess.incantation, target.incantation) },
    { label: 'category',        value: val(guess.category),    match: exact(guess.category, target.category) },
    { label: 'light',           value: val(guess.light),       match: exact(guess.light, target.light) },
    { label: 'is_unforgivable', value: fmt(guess.is_unforgivable), match: guess.is_unforgivable === target.is_unforgivable ? 'correct' : 'wrong' },
  ]
}

export { YES, NO, UNKNOWN }
