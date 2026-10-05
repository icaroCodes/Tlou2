// Baixa as artes oficiais (Steam, PlayStation.com e capas do YouTube) para assets-src/tlou
// Uso: node scripts/fetch-assets.mjs
import { mkdirSync, existsSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'assets-src', 'tlou')
mkdirSync(outDir, { recursive: true })

const STEAM = 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2531310'
const GMEDIA = 'https://gmedia.playstation.com/is/image/SIEPDC'

// screenshots 1920x1080 da página da Steam (ordem da API appdetails)
const SCREENSHOTS = [
  '0597b93e5e3d50cf6bd64bc8814386cd65f03410', // 00 Ellie e Joel (varanda)
  'aa4fa649806500d3403afb0612f03ec1a6283463', // 01 Abby aponta a arma
  'ebd2126cf786cea9a0c245fe386b7343e368be53', // 02 museu, capacete de astronauta
  '96a6281cea2e9b76b56af8a13e7cb2b59efd8b5c', // 03 Ellie ferida
  '4f29482b4c1875b66d3832b499a290bfeafe35bb', // 04 patrulha na floresta
  'd0138412577f8f37d885d9cfa6753951111040dc', // 05 WLF arrasta Joel para dentro
  '11bc1522e4f82f15972012c8a59cde785c260c89', // 06 Ellie x Abby, faca
  '383de718c5ed47d396bc5e3896e1401aca24b29b', // 07 lança-chamas (Sem Volta)
  '0549d5b3b556abfea5ea02e2a8937fc986e4eba0', // 08 Rat King
  '05a44fda9f63327b76ec59a561b375ef64d9f7d3', // 09 ilha dos Serafitas em chamas
  '9b4bd495de40ad942c91cc7302f81d6e9ca4a459', // 10 skyline de Seattle
  '7e084e3f8f5a3d8dd8858516bf4cd2da6b8a6f02', // 11 Jesse e Ellie
  '8e8eb55fe955e6b69f3afa84cd53100b324c5def', // 12 Joel
  '5a3126fba9745256f09a7176e1ce88d237121402', // 13 Serafita com machado
]

const files = {
  'steam-logo.png': `${STEAM}/logo_2x.png`,
  'steam-hero.jpg': `${STEAM}/library_hero_2x.jpg`,
  'steam-capsule.jpg': `${STEAM}/library_600x900_2x.jpg`,
  'steam-bg.jpg': `${STEAM}/page_bg_raw.jpg`,
  ...Object.fromEntries(SCREENSHOTS.map((h, i) => [`ss${String(i).padStart(2, '0')}.jpg`, `${STEAM}/${h}/ss_${h}.1920x1080.jpg`])),
  'ps-keyart-wide.jpg': `${GMEDIA}/the-last-of-us-part-ii-upgrader-background-desktop-01-en-31oct23?$native$`,
  'ps-keyart-mobile.jpg': `${GMEDIA}/The-last-of-us-part-ii-remastered-hero-banner-mobile-02-en-16mar23?$native$`,
  'ps-keyart-banner.jpg': `${GMEDIA}/The-last-of-us-part-ii-remastered-hero-banner-desktop-02-en-16mar23?$native$`,
  'ps-joel-guitar.jpg': `${GMEDIA}/The-last-of-us-part-ii-remastered-announce-screenshot-16-en-20nov23?$native$`,
  'ps-jackson-snow.jpg': `${GMEDIA}/The-last-of-us-part-ii-remastered-gameplay-screenshot-08-en-20nov23?$native$`,
  'ps-seattle.jpg': `${GMEDIA}/the-last-of-us-part-ii-remastered-gameplay-screenshot-03-en-13oct23?$native$`,
  'ps-noreturn-hunted.jpg': `${GMEDIA}/the-last-of-us-part-ii-remastered-wm-screenshot-01-en-21nov23?$native$`,
  'ps-rat-king.jpg': `${GMEDIA}/the-last-of-us-part-ii-remastered-wm-screenshot-05-en-21nov23?$native$`,
  'ps-dina-ellie.jpg': `${GMEDIA}/the-last-of-us-part-ii-remastered-wm-screenshot-10-en-21nov23?$native$`,
  'ps-ellie-jesse-snow.jpg': `${GMEDIA}/the-last-of-us-part-ii-remastered-wm-screenshot-14-en-21nov23?$native$`,
  'ps-horse-seattle.jpg': `${GMEDIA}/the-last-of-us-part-ii-remastered-wm-screenshot-16-en-21nov23?$native$`,
  'ps-abby-alley.jpg': `${GMEDIA}/the-last-of-us-part-ii-remastered-wm-screenshot-22-en-21nov23?$native$`,
  'ps-noreturn-logo.jpg': `${GMEDIA}/the-last-of-us-part-ii-upgrader-image-block-02-en-31oct23?$native$`,
  'ps-hbo.jpg': `${GMEDIA}/HBO-Original-The-Last-of-Us-Season-02-hero-desktop-01-en-07apr25?$native$`,
  // capas dos trailers PT-BR no YouTube
  'yt-launch.jpg': 'https://i.ytimg.com/vi/cMj9mzTgYRQ/maxresdefault.jpg',
  'yt-announce.jpg': 'https://i.ytimg.com/vi/DRf0IGOrf34/maxresdefault.jpg',
  'yt-no-return.jpg': 'https://i.ytimg.com/vi/O5xlXOKgJDA/maxresdefault.jpg',
  'yt-features.jpg': 'https://i.ytimg.com/vi/b-UzhXDMmEs/maxresdefault.jpg',
}

const queue = Object.entries(files)
let ok = 0
async function worker() {
  while (queue.length) {
    const [name, url] = queue.shift()
    const dest = join(outDir, name)
    if (existsSync(dest)) {
      ok++
      continue
    }
    try {
      const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } })
      if (!res.ok) throw new Error(res.status)
      writeFileSync(dest, Buffer.from(await res.arrayBuffer()))
      ok++
    } catch (e) {
      console.warn('falhou', name, e.message)
    }
  }
}
await Promise.all(Array.from({ length: 6 }, worker))
console.log(`${ok}/${Object.keys(files).length} assets em assets-src/tlou`)
