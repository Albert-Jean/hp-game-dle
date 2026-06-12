import { ModeConfig, Character, Spell } from '@/types'
import { compareCharacters, compareSpells } from '@/lib/game-logic'
import { todayKey } from '@/lib/storage'

// NOTE: `label`/`description` are no longer hardcoded here.
// In the UI, use t(`modes.${mode.id}.label`) and t(`modes.${mode.id}.description`).

export const CHARACTERS_MODE: ModeConfig<Character> = {
  id: 'characters',
  icon: '⚡',
  table: 'characters',
  maxGuesses: 6,
  columns: ['house', 'species', 'gender', 'blood_status', 'first_appearance', 'patronus', 'is_student'],
  compare: compareCharacters,
  getLabel: (c) => c.name,
  getImage: (c) => c.image_url,
  storageKey: () => todayKey('characters'),
}

export const SPELLS_MODE: ModeConfig<Spell> = {
  id: 'spells',
  icon: '🪄',
  table: 'spells',
  maxGuesses: 6,
  columns: ['incantation', 'category', 'light', 'is_unforgivable'],
  compare: compareSpells,
  getLabel: (s) => s.name,
  getImage: () => null,
  storageKey: () => todayKey('spells'),
}

export const ALL_MODES = [CHARACTERS_MODE, SPELLS_MODE]
