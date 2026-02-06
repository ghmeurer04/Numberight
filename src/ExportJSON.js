import fs from 'fs'
import path from 'path'
import { isNumber } from './functions.ts'

// Optional: allow corporate MITM certs by disabling TLS verification.
// Use only for local/offline generation.
if (process.env.NODE_TLS_REJECT_UNAUTHORIZED === "0") {
  const { Agent, setGlobalDispatcher } = await import("undici")
  setGlobalDispatcher(new Agent({ connect: { rejectUnauthorized: false } }))
}


async function getWikipediaImageUrl(title){
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&prop=pageimages&piprop=original|thumbnail&pithumbsize=1200&redirects=1&titles=${encodeURIComponent(title)}`
    const res = await fetch(url)
    const data = await res.json()
    const page = data?.query?.pages?.[0]
    if (!page || page.missing) return undefined
    return page.original?.source ?? page.thumbnail?.source
  } catch (error) {
    return undefined
  }
}

export async function exportCitiesJSON() {
  const filePath = path.join(process.cwd(), 'database', 'cities.csv')
  const txt = fs.readFileSync(filePath, 'utf-8')
  const lines = txt.split(/\r?\n/).map(l => l.trim())
  let cities = []
  const titles = lines[0].split(';').map(c => c.trim())
  let current = {}
  lines.shift()

  for (const line of lines) {
    const cols = line.split(';').map(c => c.trim())
    current = {}
    if (cols.length < 4) continue

    for (const i in titles) {
        if(isNumber(cols[i].replaceAll('.',''))){
            current[titles[i]] = parseInt(cols[i].replaceAll('.',''))
        } else if(titles[i] != ""){
            current[titles[i]] = cols[i]
        }
    }

    const city = current
    cities.push(city)
  }
  cities = cities.filter(c => c.population > 50000)
  for(const city of cities) {
    city.imageUrl = await getWikipediaImageUrl(city.name)
  }
  cities = cities.filter(c => c.imageUrl !== undefined)
  const outputPath = path.resolve(process.cwd(), "database", "cities.json")
  fs.writeFileSync(outputPath, JSON.stringify(cities, null, 2), "utf-8")

  return cities
}

await exportCitiesJSON();
console.log("Export completed.")
