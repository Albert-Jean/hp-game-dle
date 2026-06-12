'use client'
<<<<<<<< HEAD:app/play/spells/page.tsx
========

>>>>>>>> develop:src/app/[locale]/play/spells/page.tsx
import { GameBoard } from '@/components/game/GameBoard'
import { SPELLS_MODE } from '@/config/modes'

export default function SpellsPage() {
  return <GameBoard mode={SPELLS_MODE} />
}
