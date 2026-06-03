import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // clé secrète, pas la anon key !
)

async function importCharacters() {
  let page = 1
  let hasMore = true

  while (hasMore) {
    const res = await fetch(
      `https://api.potterdb.com/v1/characters?page[number]=${page}&page[size]=100`
    )
    const { data, meta } = await res.json()

    const characters = data.map(c => ({
      id: c.id,
      name: c.attributes.name,
      house: c.attributes.house,
      species: c.attributes.species,
      gender: c.attributes.gender,
      birth_date: c.attributes.born,
      eye_colour: c.attributes.eye_colour,
      hair_colour: c.attributes.hair_colour,
      wand_wood: c.attributes.wand?.wood,
      wand_core: c.attributes.wand?.core,
      patronus: c.attributes.patronus,
      is_student: c.attributes.hogwarts_student,
      is_staff: c.attributes.hogwarts_staff,
      image_url: c.attributes.image,
    }))

    await supabase.from('characters').upsert(characters)
    console.log(`Page ${page} importée (${characters.length} persos)`)

    hasMore = page < meta.pagination.last
    page++
  }
}

async function importSpells() {
  const res = await fetch('https://api.potterdb.com/v1/spells?page[size]=500')
  const { data } = await res.json()

  const spells = data.map(s => ({
    id: s.id,
    name: s.attributes.name,
    incantation: s.attributes.incantation,
    effect: s.attributes.effect,
    category: s.attributes.category,
    light: s.attributes.light,
    is_unforgivable: s.attributes.name?.includes('Cruciatus') ||
                     s.attributes.name?.includes('Imperius') ||
                     s.attributes.name?.includes('Avada')
  }))

  await supabase.from('spells').upsert(spells)
  console.log(`${spells.length} sorts importés`)
}

await importCharacters()
await importSpells()
console.log('✅ Import terminé !')