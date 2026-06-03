// src/components/GuessRow.tsx
const COLORS = {
  correct: 'bg-green-700 text-green-100',   // Serpentard vert ✅
  partial: 'bg-yellow-600 text-yellow-100',  // Avertissement 🟡
  wrong:   'bg-stone-700 text-stone-300',    // Raté ⬛
}

type GuessResult = {
  match: 'correct' | 'partial' | 'wrong'
  value: string
}

type GuessRowProps = {
  guess: { name: string }
  results: Array<GuessResult | undefined>
}

export function GuessRow({ guess, results }: GuessRowProps) {
  const attrs = ['house', 'species', 'gender', 'wand_wood', 'wand_core', 'patronus', 'is_student']

  return (
    <div className="grid grid-cols-8 gap-1 my-1">
      {/* Nom du perso */}
      <div className="col-span-2 bg-stone-800 rounded p-2 text-sm text-center">
        {guess.name}
      </div>
      {/* Attributs */}
      {attrs.map((attr, i) => (
        <div key={attr}
          className={`rounded p-1 text-xs text-center flex items-center justify-center
                      transition-all duration-300 ${COLORS[results[i]?.match ?? 'wrong']}`}
          style={{ animationDelay: `${i * 100}ms` }}>
          {results[i]?.value ?? '—'}
        </div>
      ))}
    </div>
  )
}