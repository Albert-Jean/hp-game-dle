# ⚡ HP Gamedle

Un jeu de devinettes quotidien dans l'univers Harry Potter, inspiré de [Gamedle](https://www.gamedle.wtf). Chaque jour, un nouveau personnage (ou sort) à deviner en 6 essais grâce aux indices colorés.

[HP Gamedle](https://hp-game-dle.pages.dev/fr)

---

## 🎮 Modes de jeu

| Mode | Description |
|---|---|
| ⚡ **Personnages** | Devine le personnage HP du jour grâce à sa maison, espèce, statut du sang, patronus... |
| 🪄 **Sorts** | Devine le sort du jour grâce à son incantation, catégorie, couleur de lumière... |

---

## ✨ Fonctionnalités

- 🗓 **Jeu du jour** — un nouveau personnage chaque jour à minuit, identique pour tous les joueurs
- 🔒 **Une partie par jour** — impossible de rejouer après avoir terminé, progression sauvegardée en localStorage
- 🌍 **Multilingue** — français 🇫🇷 et anglais 🇬🇧, noms traduits officiellement (Rogue, Malefoy, Londubat...)
- 📱 **Responsive** — grille scrollable horizontalement sur mobile
- ✅ **Feedback coloré** — cases vertes (correct) et violettes (incorrect) avec animation de retournement
- 📖 **Indicateur de tome** — flèche ↑/↓ pour le premier livre si ce n'est pas le bon
- 🏆 **Animations** — confettis aux couleurs des maisons à la victoire, écran Avada Kedavra à la défaite
- 🎨 **UI magique** — typographie Harry P, étoiles animées, orbes colorées en fond

---

## 🛠 Stack technique

| Couche | Technologie |
|---|---|
| **Frontend** | Next.js 16 (App Router) + TypeScript |
| **Styles** | CSS vanilla (dans `globals.css`) |
| **i18n** | next-intl v4 |
| **Base de données** | Supabase (PostgreSQL) |
| **Auth / API** | Supabase REST auto-générée |
| **Stockage images** | Supabase Storage |
| **Déploiement** | Vercel (auto-deploy sur push) |
| **CI/CD** | GitHub Actions |

---

## 📁 Structure du projet

```
hp-gamedle/
├── messages/
│   ├── fr.json               # Traductions françaises
│   └── en.json               # Traductions anglaises
├── public/
│   └── fonts/
│       └── HarryP.ttf        # Police Harry Potter
├── scripts/
│   ├── import-hp-data.mjs    # Import des personnages depuis hp_characters.json
│   └── migrate-image.mjs     # Migration des images vers Supabase Storage
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx    # Layout avec NextIntlClientProvider
│   │   │   ├── page.tsx      # Page d'accueil (choix du mode)
│   │   │   └── play/
│   │   │       ├── characters/page.tsx
│   │   │       └── spells/page.tsx
│   │   ├── globals.css       # Tous les styles
│   │   ├── layout.tsx        # Root layout (redirect)
│   │   └── page.tsx          # Redirect → /fr
│   ├── components/
│   │   ├── game/
│   │   │   ├── GameBoard.tsx       # Moteur générique du jeu
│   │   │   ├── GuessRow.tsx        # Ligne de résultat
│   │   │   ├── AttributeCell.tsx   # Case colorée avec animations
│   │   │   ├── SearchInput.tsx     # Barre de recherche + autocomplete
│   │   │   ├── WinScreen.tsx       # Écran victoire + confettis
│   │   │   ├── LoseScreen.tsx      # Écran défaite
│   │   │   └── AlreadyPlayed.tsx   # Écran "déjà joué aujourd'hui"
│   │   └── ui/
│   │       ├── MagicalBackground.tsx  # Fond animé (étoiles, orbes)
│   │       ├── VictoryParticles.tsx   # Confettis de victoire
│   │       ├── LanguageSwitcher.tsx   # Sélecteur 🇫🇷/🇬🇧
│   │       └── Avatar.tsx             # Image perso avec fallback initiale
│   ├── config/
│   │   └── modes.ts          # Configuration de chaque mode de jeu
│   ├── lib/
│   │   ├── game-logic.ts     # Fonctions de comparaison des attributs
│   │   ├── storage.ts        # Helpers localStorage (save/load)
│   │   └── supabase.ts       # Client Supabase browser
│   ├── types/
│   │   └── index.ts          # Tous les types TypeScript
│   ├── i18n.ts               # Config next-intl
│   └── middleware.ts         # Routing des locales (fr/en)
├── next.config.js
├── tsconfig.json
└── package.json
```

---

## 🗄 Schéma de base de données

```sql
-- Personnages (103 persos principaux HP)
characters (
  id text primary key,
  name text,
  name_fr text,              -- Nom français officiel (Rogue, Malefoy...)
  house text,                -- Gryffindor | Slytherin | Ravenclaw | Hufflepuff
  species text,
  gender text,
  blood_status text,         -- half-blood | pure-blood | muggleborn | squib
  patronus text,
  is_student boolean,
  first_appearance text,     -- "The Philosopher's Stone" ... "The Deathly Hallows"
  image_url text             -- URL Supabase Storage
)

-- Sorts
spells (
  id text primary key,
  name text,
  name_fr text,
  incantation text,
  effect text,
  category text,
  light text,
  is_unforgivable boolean
)

-- Jeu du jour
daily_games (
  id serial primary key,
  game_date date not null,
  mode text not null,        -- 'characters' | 'spells'
  entity_id text not null,
  unique(game_date, mode)
)
```

---

## 🚀 Installation

### Prérequis

| Outil | Version | Vérification |
|---|---|---|
| Node.js | 20+ LTS | `node -v` |
| pnpm | 8+ | `pnpm -v` |
| Git | any | `git --version` |

### 1. Cloner le repo

```bash
git clone https://github.com/PouletJuteux/hp-game-dle.git
cd hp-game-dle
```

### 2. Installer les dépendances

```bash
pnpm install
```

### 3. Variables d'environnement

Crée `.env.local` à la racine :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

Crée `.env` (pour les scripts d'import) :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

> Les clés sont disponibles dans **Supabase → Settings → API**.

### 4. Lancer en développement

```bash
pnpm dev
```

Ouvre [http://localhost:3000](http://localhost:3000) — redirige automatiquement vers `/fr`.

---

## 📦 Scripts utiles

```bash
# Développement
pnpm dev

# Build de production
pnpm build

# Importer les personnages dans Supabase
node scripts/import-hp-data.mjs

# Migrer les images vers Supabase Storage
node scripts/migrate-image.mjs
```

---

## 🗓 Cron job — Jeu du jour

Le personnage du jour est sélectionné automatiquement à minuit UTC via une **Supabase Edge Function**.

**Déployer la fonction :**
```bash
supabase functions deploy pick-daily-game
```

**Configurer le cron dans Supabase → Database → Cron Jobs :**
```
0 0 * * *  →  appelle la Edge Function pick-daily-game
```

**Changer manuellement le personnage du jour :**
```sql
update daily_games
set entity_id = 'hp-0-harry-potter'
where game_date = current_date and mode = 'characters';
```

---

## 🌍 Déploiement

Le projet est déployé sur **Vercel** avec déploiement automatique à chaque push sur `main`.

### Variables d'env sur Vercel

Dans **Vercel → ton projet → Settings → Environment Variables** :

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### URLs de production

```
https://hp-game-dle.vercel.app/          → redirige vers /fr
https://hp-game-dle.vercel.app/fr        → accueil français
https://hp-game-dle.vercel.app/en        → accueil anglais
https://hp-game-dle.vercel.app/fr/play/characters
https://hp-game-dle.vercel.app/en/play/characters
```

---

## ➕ Ajouter un nouveau mode de jeu

L'architecture est conçue pour être extensible. Pour ajouter un mode **Potions** :

**1.** Ajouter la table Supabase :
```sql
create table potions (
  id text primary key,
  name text,
  name_fr text,
  effect text,
  difficulty text,
  ingredients text[]
);
```

**2.** Ajouter le type dans `src/types/index.ts` :
```typescript
export interface Potion {
  id: string
  name: string
  name_fr: string | null
  effect: string | null
  difficulty: string | null
}
```

**3.** Ajouter la fonction de comparaison dans `src/lib/game-logic.ts` :
```typescript
export function comparePotions(guess: Potion, target: Potion): AttributeResult[] {
  return [
    { label: 'effect', value: val(guess.effect), match: exact(guess.effect, target.effect) },
    { label: 'difficulty', value: val(guess.difficulty), match: exact(guess.difficulty, target.difficulty) },
  ]
}
```

**4.** Ajouter la config dans `src/config/modes.ts` :
```typescript
export const POTIONS_MODE: ModeConfig<Potion> = {
  id: 'potions',
  icon: '🧪',
  table: 'potions',
  maxGuesses: 6,
  columns: ['effect', 'difficulty'],
  compare: comparePotions,
  getLabel: (p, locale) => (locale === 'fr' ? (p.name_fr ?? p.name) : p.name),
  getImage: () => null,
  storageKey: () => todayKey('potions'),
}
```

**5.** Créer la page `src/app/[locale]/play/potions/page.tsx` :
```typescript
'use client'
import { GameBoard } from '@/components/game/GameBoard'
import { POTIONS_MODE } from '@/config/modes'

export default function PotionsPage() {
  return <GameBoard mode={POTIONS_MODE} />
}
```

**C'est tout** — le `GameBoard` générique gère automatiquement tout le reste.

---

## 💰 Coût d'hébergement

| Service | Plan | Coût |
|---|---|---|
| Vercel | Free | 0$ |
| Supabase | Free (500MB DB, 1GB Storage) | 0$ |
| **Total** | | **0$/mois** ✅ |

---

## 📜 Licence

Projet fan non commercial. Harry Potter et tous les personnages associés sont la propriété de J.K. Rowling et Warner Bros.
