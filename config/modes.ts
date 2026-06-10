import { ModeConfig, Character, Spell } from '@/types'
import { compareCharacters, compareSpells } from '@/lib/game-logic'
import { todayKey } from '@/lib/storage'

export const CHARACTERS_MODE: ModeConfig<Character> = {
  id: 'characters',
  label: 'Personnages',
  description: 'Trouve le personnage HP du jour',
  icon: '⚡',
  table: 'characters',
  maxGuesses: 6,
  columns: ['Maison', 'Espèce', 'Genre', 'Statut du sang', 'Premier livre', 'Patronus', 'Étudiant'],
  compare: compareCharacters,
  getLabel: (c) => c.name,
  getImage: (c) => c.image_url,
  storageKey: () => todayKey('characters'),
}

export const SPELLS_MODE: ModeConfig<Spell> = {
  id: 'spells',
  label: 'Sorts',
  description: 'Trouve le sort HP du jour',
  icon: '🪄',
  table: 'spells',
  maxGuesses: 6,
  columns: ['Incantation', 'Catégorie', 'Lumière', 'Impardonnable'],
  compare: compareSpells,
  getLabel: (s) => s.name,
  getImage: () => null,
  storageKey: () => todayKey('spells'),
}
