interface Props {
  label: string
  image: string | null
  onReset: () => void
}

export function LoseScreen({ label, image, onReset }: Props) {
  return (
    <div className="overlay-screen lose-screen">
      <div className="overlay-card">
        <span className="lose-icon">💀</span>
        <h2 className="overlay-title">Avada Kedavra...</h2>
        <p className="overlay-subtitle">Tu n'as pas trouvé le personnage mystère.</p>
        {image && (
          <div className="target-reveal">
            <img src={image} alt={label} className="target-img" />
            <div className="target-glow-red" aria-hidden="true" />
          </div>
        )}
        <p className="target-name">{label}</p>
        <div className="overlay-actions">
          <button className="btn-primary" onClick={onReset}>Réessayer</button>
        </div>
      </div>
    </div>
  )
}
