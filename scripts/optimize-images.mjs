// Converte os originais (assets-src/tlou) em WebP otimizados em public/img
// Uso: node scripts/optimize-images.mjs   (rode depois de fetch-assets.mjs e extract-media.mjs)
import { spawnSync } from 'node:child_process'
import { mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import ffmpeg from 'ffmpeg-static'
import { assetMap } from './asset-map.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, 'assets-src', 'tlou')
const out = join(root, 'public', 'img')

/** Bounding box do conteúdo não transparente (para recortar PNGs com muita margem). */
function alphaBox(input) {
  const r = spawnSync(ffmpeg, [
    '-hide_banner', '-loop', '1', '-i', input, '-frames:v', '3',
    '-vf', 'format=rgba,alphaextract,format=yuv420p,cropdetect=limit=24:round=2:reset=0:skip=0',
    '-f', 'null', '-',
  ])
  const m = [...r.stderr.toString().matchAll(/crop=(\d+:\d+:\d+:\d+)/g)].pop()
  return m ? m[1] : null
}

let done = 0
for (const [name, [file, maxWidth, opts = {}]] of Object.entries(assetMap)) {
  const input = join(src, file)
  const dest = join(out, `${name}.webp`)
  if (!existsSync(input)) {
    console.warn('faltando:', file)
    continue
  }
  mkdirSync(dirname(dest), { recursive: true })
  const crop = opts.trim ? alphaBox(input) : opts.crop
  const r = spawnSync(ffmpeg, [
    '-hide_banner', '-loglevel', 'error', '-y', '-i', input,
    '-vf', `${crop ? `crop=${crop},` : ''}scale='min(${maxWidth},iw)':-2:flags=lanczos`,
    '-c:v', 'libwebp', '-quality', '80', '-compression_level', '6', dest,
  ])
  if (r.status !== 0) {
    console.warn('falhou:', name, r.stderr?.toString())
    continue
  }
  done++
  // variante de 800px para telas pequenas (srcset); camadas do hero precisam da resolução cheia
  if (maxWidth >= 1280 && !name.startsWith('hero')) {
    spawnSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', '-i', dest, '-vf', 'scale=800:-2:flags=lanczos', '-c:v', 'libwebp', '-quality', '76', dest.replace(/\.webp$/, '-sm.webp')])
  }
}
console.log(`${done} imagens em public/img`)
