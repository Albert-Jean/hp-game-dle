import { readFileSync } from 'fs'
import { resolve } from 'path'

// Charger .env
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

// Lire le fichier JSON local
const raw = readFileSync(resolve(process.cwd(), 'public/hp_characters.json'), 'utf8')
const characters = JSON.parse(raw).map((c, i) => ({
  id: `hp-${i}-${c.name.toLowerCase().replace(/[\s']/g, '-')}`,
  name: c.name,
  house: c.house !== 'None' ? c.house : null,
  species: c.species || 'Human',
  gender: c.gender || null,
  blood_status: c.blood_status !== 'None' ? c.blood_status : null,
  patronus: c.patronus !== 'None' ? c.patronus : null,
  is_student: c.is_student ?? false,
  image_url: c.image_url || null,
}))

console.log(`📦 ${characters.length} personnages à importer...`)

// Vider et réimporter
await supabase.from('characters').delete().neq('id', 'placeholder')
const { error } = await supabase.from('characters').insert(characters)

if (error) {
  console.error('❌ Erreur:', error.message)
} else {
  console.log(`✅ ${characters.length} personnages importés !`)
  characters.forEach(c =>
    console.log(`  - ${c.name} (${c.house ?? 'Aucune maison'}) — ${c.blood_status ?? '?'}`)
  )
}