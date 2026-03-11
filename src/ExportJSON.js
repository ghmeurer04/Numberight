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
  }
  if (!isNaN(value) && !isNaN(parseFloat(value))){
    return parseFloat(value)
  }
  return value
}

async function getImageUrl(searchTerm) {
  console.log("Searching image for: " + searchTerm);
  searchTerm = encodeURIComponent(searchTerm);
  const response = await fetch("https://pixabay.com/api/?key=54646120-363c40cbdce3c3d6daefe0fd0&q="+searchTerm+"&per_page=3")
  .then(res => res.json())
  .then(data => {
    if (data.totalHits === 0) {
      console.log("No image found for: " + searchTerm);
      return undefined;
    }
    return data.hits[0]?.webformatURL || undefined;
  });
  return response
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
  let src = {}
  for(const item of list) {
    try{
        if (src[item.Name]) {
          item.NameImage = src[item.Name]
        } else {
          item.NameImage = await getImageUrl(item.Name.replace(/@/g, '') + " flag")
          await new Promise(r => setTimeout(r, 500));
          src[item.Name] = item.NameImage
        }
        if (src[item.Description]) {
          item.DescriptionImage = src[item.Description]
        } else {
          item.DescriptionImage = await getImageUrl(item.Description.replace(/ in| of|Number|Players|Sales|Yearly|(Liters)/g, '').replace(/Monthly Visits|Users|Monthly Listeners|Followers|Consumption/g, ' logo'))
          await new Promise(r => setTimeout(r, 500));
          src[item.Description] = item.DescriptionImage
        }
        } catch (e) {
          console.error("Error fetching image for: " + item.Name + " or " + item.Description, e)
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
