'use client'
import { GameBoard } from '@/components/game/GameBoard'
import { CHARACTERS_MODE } from '@/config/modes'

export const runtime = 'edge'
export default function CharactersPage() {
  return <GameBoard mode={CHARACTERS_MODE} />
}
