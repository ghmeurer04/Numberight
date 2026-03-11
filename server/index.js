import express from 'express'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = Number(process.env.PORT || 3001)
const DATA_DIR = path.resolve(__dirname, '..', 'database')
const LIST_PATH = path.join(DATA_DIR, 'list.json')

let cachedList = null

async function loadList() {
  if (cachedList) return cachedList
  const txt = await fs.readFile(LIST_PATH, 'utf-8')
  cachedList = JSON.parse(txt)
  return cachedList
}

function todayKey(date = new Date()) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}-${month}-${day}`
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

function sliceList(list, number, mode) {
  const upperLimit = mode === 'hard' ? 1.25 : 2.5
  const lowerLimit = mode === 'hard' ? 0.8 : 0.4

  const clean = list.filter(item => typeof item.Number === 'number' && !Number.isNaN(item.Number))
  if (clean.length === 0) return []

  const randomIndex = Math.floor(Math.random() * clean.length)
  const first = clean[randomIndex]
  const filtered = clean.filter(item =>
    item.Number !== first.Number &&
    item.Description !== first.Description &&
    item.Number > first.Number * lowerLimit &&
    item.Number < first.Number * upperLimit
  )

  if (filtered.length === 0) {
    return sliceList(clean, number, mode)
  }

  const second = filtered[Math.floor(Math.random() * filtered.length)]
  return [first, second].slice(0, number)
}

async function getRounds(mode) {
  const list = await loadList()
  const dateKey = todayKey()
  const filePath = path.join(DATA_DIR + '/rounds', `${mode}-${dateKey}.json`)

  if (await fileExists(filePath)) {
    const txt = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(txt)
  }

  const rounds = []
  for (let i = 0; i < 10; i++) {
    rounds.push(sliceList(list, 2, mode))
  }

  await fs.writeFile(filePath, JSON.stringify(rounds), 'utf-8')
  return rounds
}

const app = express()

app.get('/api/rounds', async (req, res) => {
  const mode = req.query.mode === 'hard' ? 'hard' : 'regular'
  try {
    const rounds = await getRounds(mode)
    res.json(rounds)
  } catch (err) {
    console.error('Failed to generate rounds', err)
    res.status(500).json({ error: 'Failed to generate rounds' })
  }
})

app.listen(PORT, () => {
  console.log(`Rounds API listening on http://localhost:${PORT}`)
})
