import citiesCsv from '../database/cities.csv?raw'

export function normalize(str:string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function isNumber(value: string): boolean {
  if (typeof value != "string") return false  
  return !isNaN(value as any) && !isNaN(parseFloat(value))
}

export type City = {
  state: string
  stateCode: string
  cityCode: string
  name: string
  population: number
  imageUrl?: string
}

async function getWikipediaImageUrl(title: string): Promise<string | undefined> {
  try {
    const url = `https://en.wikipedia.org/w/api.php?origin=*&action=query&format=json&prop=pageimages&piprop=original&titles=${encodeURIComponent(title)}`
    const res = await fetch(url)
    if (!res.ok) return undefined
    const data = await res.json()
    const pages = data?.query?.pages
    if (!pages) return undefined
    const firstPage = pages[Object.keys(pages)[0]]
    return firstPage?.original?.source
  } catch {
    return undefined
  }
}

export async function getCitiesInfo(): Promise<City[]> {
  const txt = citiesCsv
  const lines = txt.split(/\r?\n/).map(l => l.trim())
  let cities: City[] = []
  const titles = lines[0].split(';').map(c => c.trim())
  let current = {} as any
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

    const city = current as City
    cities.push(city)
    console.log(current)
  }
  cities = cities.filter(c => c.population > 50000)
  cities = sliceCities(cities, 100)
  let count = 0
  for(const city of cities) {
    city.imageUrl = await getWikipediaImageUrl(city.name)
    if(city.imageUrl !== undefined){
      count += 1
    }
    if(count >= 30){
      break
    }
  }
  cities = cities.filter(c => c.imageUrl !== undefined) as City[]
  console.log(cities.length)
  return cities
}

export function sliceCities(cities: City[], number: number): City[] {
  const shuffled = [...cities]; 
  for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, number);
}
