# HP Gamedle — Mise à jour i18n (FR/EN)

Ce zip contient tous les fichiers mis à jour pour ajouter le support
multilingue (français / anglais) avec next-intl.

## 1. Installer la dépendance

```bash
pnpm add next-intl
```

## 2. Où placer les fichiers

Copie chaque dossier/fichier dans ton projet en respectant exactement
cette arborescence (écrase les fichiers existants) :

```
ton-projet/
├── messages/
│   ├── fr.json
│   └── en.json
├── next.config.js              ← remplace l'ancien
└── src/
    ├── i18n.ts                  ← nouveau
    ├── middleware.ts            ← nouveau
    ├── app/
    │   ├── layout.tsx           ← remplace l'ancien (root layout minimal)
    │   ├── page.tsx             ← remplace l'ancien (redirect vers /fr)
    │   ├── globals.css          ← remplace l'ancien
    │   └── [locale]/
    │       ├── layout.tsx       ← nouveau
    │       ├── page.tsx         ← page d'accueil (déplace l'ancienne logique ici)
    │       └── play/
    │           ├── characters/page.tsx
    │           └── spells/page.tsx
    ├── components/
    │   ├── game/
    │   │   ├── GameBoard.tsx
    │   │   ├── GuessRow.tsx
    │   │   ├── AttributeCell.tsx
    │   │   ├── SearchInput.tsx
    │   │   ├── WinScreen.tsx
    │   │   ├── LoseScreen.tsx
    │   │   └── AlreadyPlayed.tsx
    │   └── ui/
    │       ├── MagicalBackground.tsx
    │       ├── VictoryParticles.tsx
    │       └── LanguageSwitcher.tsx
    ├── config/
    │   └── modes.ts
    ├── lib/
    │   ├── game-logic.ts
    │   ├── storage.ts
    │   └── supabase.ts
    └── types/
        └── index.ts
```

## 3. Supprime les anciens dossiers/fichiers devenus inutiles

- `src/app/play/` (ancien, remplacé par `src/app/[locale]/play/`)
- Toute ancienne version de `src/app/page.tsx` qui contenait
  la logique de la page d'accueil (déplacée vers `src/app/[locale]/page.tsx`)

## 4. Tester en local

```bash
pnpm dev
```

- `http://localhost:3000` → redirige vers `/fr`
- `http://localhost:3000/fr/play/characters`
- `http://localhost:3000/en/play/characters`
- Le sélecteur 🇫🇷 / 🇬🇧 en haut à droite bascule la langue

## 5. Notes importantes

- Les **données en base** (maisons, patronus, statut du sang...) restent
  en anglais — seuls les **textes d'interface** sont traduits.
- `game-logic.ts` retourne désormais des **clés de traduction**
  (`"house"`, `"first_appearance"`...) résolues via `t('columns.xxx')`,
  et non plus du texte français en dur.
- Les valeurs `null` / booléens utilisent les tokens internes
  `__YES__` / `__NO__` / `__UNKNOWN__`, traduits dans `AttributeCell.tsx`.
- Pense à vérifier que `tsconfig.json` a bien l'alias `@/*` → `src/*`.

## 6. Build & déploiement

```bash
pnpm build
```

Push sur GitHub comme d'habitude — Vercel redéploiera automatiquement
avec le support des deux langues.
