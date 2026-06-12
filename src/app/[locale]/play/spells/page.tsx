'use client'

import { GameBoard } from '@/components/game/GameBoard'
import { SPELLS_MODE } from '@/config/modes'

export const runtime = 'edge'
export default function SpellsPage() {
  return <GameBoard mode={SPELLS_MODE} />
}
