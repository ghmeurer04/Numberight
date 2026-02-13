import fs from 'fs'
import fsp from 'fs/promises'
import path, { parse } from 'path'
import { fileURLToPath } from 'url'

if (process.env.NODE_TLS_REJECT_UNAUTHORIZED === "0") {
  const { Agent, setGlobalDispatcher } = await import("undici")
  setGlobalDispatcher(new Agent({ connect: { rejectUnauthorized: false } }))
}

function convertNumber(value) {
  value = value.replaceAll(/"/g, '')
  if (value.endsWith('M')) {
    value = value.slice(0, -1) * 1000000
  } else if (value.endsWith('K')) {
    value = value.slice(0, -1) * 1000
  } else if (value.endsWith('B')) {
    value = (value.slice(0, -1) * 1000000000)
  } else if (value.endsWith('T')) {
    value = (value.slice(0, -1) * 1000000000000)
  } else {
    value = value.replace(/,/g, '')
    value = parseFloat(value)
  }
  if (!isNaN(value) && !isNaN(parseFloat(value))){
    return parseFloat(value)
  }
  return value
}

async function getWikimediaImageUrl(searchTerm) {
  const apiBase = "https://commons.wikimedia.org/w/api.php"
  const searchParams = new URLSearchParams({
    action: "query",
    list: "search",
    srsearch: searchTerm,
    srnamespace: "6",
    srlimit: "5",
    format: "json"
  })
  const searchUrl = `${apiBase}?${searchParams.toString()}`

  try {
    const searchResponse = await fetch(searchUrl)
    if (!searchResponse.ok) return undefined
    const searchData = await searchResponse.json()
    const titles = (searchData?.query?.search ?? [])
      .map(item => item?.title)
      .filter(Boolean)
    if (titles.length === 0) return undefined

    const infoParams = new URLSearchParams({
      action: "query",
      prop: "imageinfo",
      titles: titles.join("|"),
      iiprop: "url|size",
      format: "json"
    })
    const infoUrl = `${apiBase}?${infoParams.toString()}`
    const infoResponse = await fetch(infoUrl)
    if (!infoResponse.ok) return undefined
    const infoData = await infoResponse.json()

    const pages = infoData?.query?.pages ?? {}
    const images = Object.values(pages)
      .map(page => page?.imageinfo?.[0])
      .filter(info => info?.url && info?.width && info?.height)

    if (images.length === 0) return undefined
    //const best = images.sort((a, b) => (b.width * b.height) - (a.width * a.height))[0]
    //console.log(searchTerm + ": " +images[0]?.url)
    return images[0]?.url
  } catch(e) {
    console.log(e)
    return undefined
  }
}

export async function exportCitiesJSON() {
  const currentFilePath = fileURLToPath(import.meta.url)
  const currentDirPath = path.dirname(currentFilePath)
  const dirPath = path.resolve(currentDirPath, '../database/Data Scrape')
  var entries = await fsp.readdir(dirPath, { withFileTypes: true })
  entries = entries.filter(entry => entry.isFile())
    .map(entry => path.join(dirPath, entry.name))
  let list = []

  for (const filePath of entries) {
    if (!filePath.endsWith('.csv')) continue
    const txt = fs.readFileSync(filePath, 'utf-8')
    const lines = txt.split(/\r?\n/).map(l => l.trim())
    const titles = lines[0].split(',').map(c => c.trim())
    let current = {}
    lines.shift()

    for (const line of lines) {
      const cols = line.split(',').map(c => c.trim())
      current = {}

      for (const i in titles) {
          if(convertNumber(cols[i]) != cols[i]){
              current[titles[i]] = convertNumber(cols[i])
          } else if(titles[i] != ""){
              current[titles[i]] = cols[i]
          }
      }
      list.push(current)
    }
  }
  let srcWikimedia = {}
  for(const item of list) {
    if (srcWikimedia[item.Name]) {
      item.NameImage = srcWikimedia[item.Name]
    } else {
      item.NameImage = await getWikimediaImageUrl(item.Name)
      srcWikimedia[item.Name] = item.NameImage
    }
    if (srcWikimedia[item.Description]) {
      item.DescriptionImage = srcWikimedia[item.Description]
    } else {
      item.DescriptionImage = await getWikimediaImageUrl(item.Description.replace(/ in| of|Number|Players|Sales/g, '').replace(/Monthly Visits|Users/g, ' logo'))
      srcWikimedia[item.Description] = item.DescriptionImage
    }
  }
  list = list.filter(c => c.NameImage !== undefined && c.DescriptionImage !== undefined)
  const outputPath = path.resolve(process.cwd(), "database", "list.json")
  fs.writeFileSync(outputPath, JSON.stringify(list, null, 2), "utf-8")

  console.log(list)
  return list
}

await exportCitiesJSON();
console.log("Export completed.")
