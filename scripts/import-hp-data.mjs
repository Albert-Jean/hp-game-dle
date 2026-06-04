import { readFileSync } from 'fs'
import { resolve } from 'path'

// Charger les variables d'environnement
const envFile = readFileSync(resolve(process.cwd(), '.env'), 'utf8')
envFile.split('\n').forEach(line => {
  const [key, value] = line.split('=')
  if (key && value) process.env[key.trim()] = value.trim()
})

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function importCharacters() {
  console.log('📡 Récupération depuis HP-API...')

  const res = await fetch('https://hp-api.onrender.com/api/characters')
  const data = await res.json()

  console.log(`📦 ${data.length} personnages récupérés depuis l'API`)

  // Filtrer uniquement les persos avec des données complètes
  const filtered = data.filter(c =>
    c.name &&
    c.house &&          // doit avoir une maison
    c.patronus      // doit avoir un patronus  
  )

  console.log(`✅ ${filtered.length} personnages avec données complètes`)

  const characters = filtered.map((c, index) => ({
    id: `hp-${index}-${c.name.toLowerCase().replace(/\s+/g, '-')}`,
    name: c.name,
    house: c.house || null,
    species: c.species || 'Human',
    gender: c.gender || null,
    wand_wood: c.wand?.wood || null,
    wand_core: c.wand?.core || null,
    patronus: c.patronus || null,
    is_student: c.hogwartsStudent ?? false,
    image_url: c.image || null,
  }))

  // Vider la table puis réimporter
  await supabase.from('characters').delete().neq('id', 'placeholder')

  const { error } = await supabase.from('characters').insert(characters)

  if (error) {
    console.error('❌ Erreur import:', error.message)
  } else {
    console.log(`🎉 ${characters.length} personnages importés dans Supabase !`)
    console.log('\nListe des personnages importés :')
    characters.forEach(c => console.log(`  - ${c.name} (${c.house})`))
  }
}

await importCharacters()