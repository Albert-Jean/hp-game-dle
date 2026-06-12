'use client'

interface Suggestion {
  id: string
  label: string
  image: string | null
  sublabel?: string
}

interface Props {
  value: string
  onChange: (value: string) => void
  onSelect: (id: string) => void
  suggestions: Suggestion[]
  placeholder?: string
  shake?: boolean
}

export function SearchInput({
  value,
  onChange,
  onSelect,
  suggestions,
  placeholder = 'Rechercher...',
  shake = false,
}: Props) {
  return (
    <div className="search-container">
      <div className={`search-wrap ${shake ? 'shake' : ''}`}>
        <span className="search-icon" aria-hidden="true">🔍</span>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="search-input"
          aria-label={placeholder}
          aria-autocomplete="list"
          aria-expanded={suggestions.length > 0}
          autoComplete="off"
        />
      </div>

      {suggestions.length > 0 && (
        <div className="suggestions" role="listbox">
          {suggestions.map(s => (
            <button
              key={s.id}
              role="option"
              className="suggestion-item"
              onClick={() => onSelect(s.id)}
            >
              {s.image ? (
                <img src={s.image} alt="" className="suggestion-avatar" aria-hidden="true" />
              ) : (
                <div className="suggestion-placeholder" aria-hidden="true">
                  {s.label.charAt(0)}
                </div>
              )}
              <span>{s.label}</span>
              {s.sublabel && (
                <span className="suggestion-house">{s.sublabel}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
