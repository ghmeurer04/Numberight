export type Item = {
  Description: string
  Name: string
  Number: number
  Source: string
  NameImage: string
  DescriptionImage: string
}


export function normalize(str:string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}


export async function getRounds(mode: 'regular' | 'hard'): Promise<Item[][]> {
  const response = await fetch(`/api/rounds?mode=${encodeURIComponent(mode)}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch rounds (${response.status})`)
  }
  return response.json() as Promise<Item[][]>
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

export function saveHighscore(score: number) {
  localStorage.setItem("highscore", score.toString())
}

export function getHighscore(): number {
  return Number(localStorage.getItem("highscore") ?? 0)
}
