// Gera as variantes leves usadas nos modos "médio" e "leve" (detectados no loading)
// a partir dos arquivos já extraídos, sem internet.
// Uso: node scripts/derive-light.mjs   (rode depois de extract-media.mjs)
import { spawnSync } from 'node:child_process'
import { mkdirSync, readdirSync, rmSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import ffmpeg from 'ffmpeg-static'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const media = join(root, 'public', 'media')

function run(args) {
  const r = spawnSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' })
  if (r.status !== 0) throw new Error('ffmpeg falhou: ' + args.join(' '))
}

/** Sequência de frames reduzida (mesma contagem, resolução e qualidade menores). */
function smallFrames(name, width, quality) {
  const src = join(media, 'frames', name)
  const dest = join(media, 'frames', `${name}-sm`)
  if (existsSync(dest)) rmSync(dest, { recursive: true })
  mkdirSync(dest, { recursive: true })
  for (const f of readdirSync(src)) {
    run(['-i', join(src, f), '-vf', `scale=${width}:-2:flags=lanczos`, '-c:v', 'libwebp', '-quality', String(quality), join(dest, f)])
  }
  console.log(`frames/${name}-sm: ${readdirSync(dest).length} frames`)
}

/** Imagem estática de um vídeo (substitui o vídeo no modo leve). */
function poster(name, time, width) {
  run(['-ss', String(time), '-i', join(media, 'video', `${name}.mp4`), '-frames:v', '1', '-vf', `scale=${width}:-2`, '-c:v', 'libwebp', '-quality', '78', join(media, 'video', `${name}.webp`)])
  console.log(`video/${name}.webp`)
}

smallFrames('jackson', 900, 62)
smallFrames('logo-reveal', 720, 66)
poster('jornada', 1.4, 1280)
poster('trailers-loop', 1.2, 1280)
poster('ellie', 0.6, 960)
poster('abby', 0.5, 960)
poster('sem-volta', 2.0, 1280)
