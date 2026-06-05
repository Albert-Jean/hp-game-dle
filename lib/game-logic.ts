export type MatchResult = 'correct' | 'wrong'

export interface Character {
  id: string
  name: string
  house: string | null
  species: string | null
  gender: string | null
  blood_status: string | null        // ← vérifie que c'est bien là
  patronus: string | null
  is_student: boolean | null
  first_appearance: string | null    // ← vérifie que c'est bien là
  image_url: string | null
}

export interface AttributeResult {
  label: string
  value: string
  match: MatchResult
}

export function compareCharacters(
  guess: Character,
  target: Character
): AttributeResult[] {
  const fmt = (v: boolean | null) => v ? 'Oui' : 'Non'
  const val = (v: string | null) => v ?? '?'

  return [
  { label: 'Maison',          value: val(guess.house),            match: guess.house === target.house ? 'correct' : 'wrong' },
  { label: 'Espèce',          value: val(guess.species),          match: guess.species === target.species ? 'correct' : 'wrong' },
  { label: 'Genre',           value: val(guess.gender),           match: guess.gender === target.gender ? 'correct' : 'wrong' },
  { label: 'Statut du sang',  value: val(guess.blood_status),     match: guess.blood_status === target.blood_status ? 'correct' : 'wrong' },
  { label: 'Premier livre',   value: val(guess.first_appearance), match: guess.first_appearance === target.first_appearance ? 'correct' : 'wrong' },
  { label: 'Patronus',        value: val(guess.patronus),         match: guess.patronus === target.patronus ? 'correct' : 'wrong' },
  { label: 'Étudiant',        value: fmt(guess.is_student),       match: guess.is_student === target.is_student ? 'correct' : 'wrong' },
]
}
