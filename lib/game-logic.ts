import { AttributeResult, Character, Spell } from '@/types'

const val = (v: string | null) => v ?? '?'
const fmt = (v: boolean | null) => v ? 'Oui' : 'Non'
const exact = (a: unknown, b: unknown): 'correct' | 'wrong' =>
  String(a ?? '').toLowerCase() === String(b ?? '').toLowerCase() ? 'correct' : 'wrong'

// ─── Book helpers ─────────────────────────────────────────────────────────────

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

// ─── Character compare ────────────────────────────────────────────────────────

export function compareCharacters(guess: Character, target: Character): AttributeResult[] {
  return [
    { label: 'Maison',         value: val(guess.house),            match: exact(guess.house, target.house) },
    { label: 'Espèce',         value: val(guess.species),          match: exact(guess.species, target.species) },
    { label: 'Genre',          value: val(guess.gender),           match: exact(guess.gender, target.gender) },
    { label: 'Statut du sang', value: val(guess.blood_status),     match: exact(guess.blood_status, target.blood_status) },
    { label: 'Premier livre',  value: val(guess.first_appearance), match: exact(guess.first_appearance, target.first_appearance) },
    { label: 'Patronus',       value: val(guess.patronus),         match: exact(guess.patronus, target.patronus) },
    { label: 'Étudiant',       value: fmt(guess.is_student),       match: exact(guess.is_student, target.is_student) },
  ]
}

// ─── Spell compare ────────────────────────────────────────────────────────────

export function compareSpells(guess: Spell, target: Spell): AttributeResult[] {
  return [
    { label: 'Incantation',    value: val(guess.incantation),      match: exact(guess.incantation, target.incantation) },
    { label: 'Catégorie',      value: val(guess.category),         match: exact(guess.category, target.category) },
    { label: 'Lumière',        value: val(guess.light),            match: exact(guess.light, target.light) },
    { label: 'Impardonnable',  value: guess.is_unforgivable ? 'Oui' : 'Non', match: guess.is_unforgivable === target.is_unforgivable ? 'correct' : 'wrong' },
  ]
}
