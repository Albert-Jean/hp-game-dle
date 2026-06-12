'use client'
<<<<<<<< HEAD:app/play/characters/page.tsx
========

>>>>>>>> develop:src/app/[locale]/play/characters/page.tsx
import { GameBoard } from '@/components/game/GameBoard'
import { CHARACTERS_MODE } from '@/config/modes'

export default function CharactersPage() {
  return <GameBoard mode={CHARACTERS_MODE} />
}
