export type MatchResult = 'correct' | 'wrong'

export interface Character {
  id: string
  name: string
  house: string | null
  species: string | null
  gender: string | null
  wand_wood: string | null
  wand_core: string | null
  patronus: string | null
  is_student: boolean | null
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
    {
      label: 'Maison',
      value: val(guess.house),
      match: guess.house === target.house ? 'correct' : 'wrong'
    },
    {
      label: 'Espèce',
      value: val(guess.species),
      match: guess.species === target.species ? 'correct' : 'wrong'
    },
    {
      label: 'Genre',
      value: val(guess.gender),
      match: guess.gender === target.gender ? 'correct' : 'wrong'
    },
    {
      label: 'Bois baguette',
      value: val(guess.wand_wood),
      match: guess.wand_wood === target.wand_wood ? 'correct' : 'wrong'
    },
    {
      label: 'Cœur baguette',
      value: val(guess.wand_core),
      match: guess.wand_core === target.wand_core ? 'correct' : 'wrong'
    },
    {
      label: 'Patronus',
      value: val(guess.patronus),
      match: guess.patronus === target.patronus ? 'correct' : 'wrong'
    },
    {
      label: 'Étudiant',
      value: fmt(guess.is_student),
      match: guess.is_student === target.is_student ? 'correct' : 'wrong'
    },
  ]
}
