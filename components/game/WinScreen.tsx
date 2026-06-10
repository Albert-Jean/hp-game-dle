import { VictoryParticles } from '@/components/ui/VictoryParticles'

interface Props {
  label: string
  image: string | null
  guessCount: number
  onReset: () => void
}

export function WinScreen({ label, image, guessCount, onReset }: Props) {
  return (
    <div className="overlay-screen win-screen">
      <VictoryParticles />
      <div className="overlay-card">
        <span className="win-icon">⚡</span>
        <h2 className="overlay-title">Accio Victory!</h2>
        <p className="overlay-subtitle">
          Tu as trouvé en <strong>{guessCount}</strong> essai{guessCount > 1 ? 's' : ''} !
        </p>
        {image && (
          <div className="target-reveal">
            <img src={image} alt={label} className="target-img" />
            <div className="target-glow" aria-hidden="true" />
          </div>
        )}
        <p className="target-name">{label}</p>
        <div className="overlay-actions">
          <button className="btn-primary" onClick={onReset}>Nouvelle partie</button>
        </div>
      </div>
    </div>
  )
}
