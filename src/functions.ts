import citiesJson from '../database/cities.json?raw'

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

export async function getCitiesInfo(): Promise<City[]> {
  const txt = citiesJson
  const cities = JSON.parse(txt) as City[]
  return cities.filter(c => c.imageUrl !== undefined) as City[]
}

export function sliceCities(cities: City[], number: number): City[] {
  const shuffled = [...cities]; 
  for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, number);
}


export function saveHighscore(score: number) {
  localStorage.setItem("highscore", score.toString())
}

export function getHighscore(): number {
  return Number(localStorage.getItem("highscore") ?? 0)
}
