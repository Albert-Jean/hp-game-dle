import { readFileSync } from 'fs'
import { resolve } from 'path'

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

// 1. Récupérer les URLs d'images ACTUELLES depuis l'API live
console.log('📡 Récupération des URLs actuelles depuis HP-API...')
const res = await fetch('https://hp-api.onrender.com/api/characters')
const liveData = await res.json()

// Map nom → image_url actuelle
const liveImages = new Map()
for (const c of liveData) {
  if (c.image) liveImages.set(c.name.toLowerCase().trim(), c.image)
}
console.log(`✅ ${liveImages.size} images trouvées sur l'API live`)

// 2. Récupérer les persos de la DB
const { data: characters, error } = await supabase.from('characters').select('id, name, image_url')
if (error) { console.error('Erreur DB:', error.message); process.exit(1) }

let migrated = 0, notFound = 0, failed = 0

for (const char of characters) {
  const liveUrl = liveImages.get(char.name.toLowerCase().trim())

  if (!liveUrl) {
    notFound++
    console.log(`⚪ ${char.name}: pas d'image sur l'API`)
    continue
  }

  try {
    const imgRes = await fetch(liveUrl)
    if (!imgRes.ok) {
      console.log(`⚠️ ${char.name}: HTTP ${imgRes.status} sur ${liveUrl}`)
      failed++
      continue
    }

    const buffer = await imgRes.arrayBuffer()
    const ext = liveUrl.split('.').pop()?.split('?')[0] || 'jpg'
    const path = `characters/${char.id}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('hp-images')
      .upload(path, Buffer.from(buffer), { contentType: `image/${ext}`, upsert: true })

    if (uploadError) {
      console.log(`❌ ${char.name}: ${uploadError.message}`)
      failed++
      continue
    }

    const { data: { publicUrl } } = supabase.storage.from('hp-images').getPublicUrl(path)
    await supabase.from('characters').update({ image_url: publicUrl }).eq('id', char.id)
    console.log(`✅ ${char.name}`)
    migrated++

  } catch (e) {
    console.log(`❌ ${char.name}: ${e.message}`)
    failed++
  }
}

console.log(`\n📊 Résumé : ${migrated} migrées, ${notFound} sans image API, ${failed} échecs`)