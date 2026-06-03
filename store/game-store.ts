import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Character = string

type AttributeResult = {
  match: 'correct' | 'present' | 'absent'
}

interface GameState {
  guesses: Character[]
  gameStatus: 'playing' | 'won' | 'lost'
  target: Character | null
  addGuess: (char: Character, result: AttributeResult[]) => void
  setTarget: (char: Character) => void
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      guesses: [],
      gameStatus: 'playing',
      target: null,
      setTarget: (target) => set({ target }),
      addGuess: (char, result) => {
        const guesses = [...get().guesses, char]
        const won = result.every(r => r.match === 'correct')
        const lost = guesses.length >= 6 && !won
        set({
          guesses,
          gameStatus: won ? 'won' : lost ? 'lost' : 'playing'
        })
      }
    }),
    { name: `hp-gamedle-${new Date().toISOString().split('T')[0]}` }
    // Clé qui change chaque jour = reset automatique !
  )
)