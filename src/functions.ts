import listJson from '../database/list.json?raw'

export function normalize(str:string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function summarizeNumber(num: number): string {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(1) + 'B';
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + 'M';
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + 'K';
  } else {
    return num.toString();
  }
}

export function isNumber(value: string): boolean {
  if (typeof value != "string") return false  
  return !isNaN(value as any) && !isNaN(parseFloat(value))
}

export type Item = {
  Description: string
  Name: string
  Number: number
  Source: string
  NameImage: string
  DescriptionImage: string
}

export async function getJSONInfo(): Promise<Item[]> {
  const txt = listJson
  const item = JSON.parse(txt) as Item[]
  console.log(item)
  return item as Item[]
}

export function sliceCities(list: Item[], number: number): Item[] {
  list = list.filter(item => typeof item.Number === "number" && !isNaN(item.Number))
  const randomIndex = Math.floor(Math.random() * list.length);
  const first = list[randomIndex];
  const filtered = list.filter(item => item.Number !== first.Number && item.Description !== first.Description && (item.Number > first.Number * 0.3) && (item.Number < first.Number * 2.5));
  const index = Math.floor(Math.random() * filtered.length);
  if (filtered.length === 0) {
    return sliceCities(list, number);
  }
  const second = filtered[index];
  const pair = [first, second];
  return pair.slice(0, number);
}


export function saveHighscore(score: number) {
  localStorage.setItem("highscore", score.toString())
}

export function getHighscore(): number {
  return Number(localStorage.getItem("highscore") ?? 0)
}
