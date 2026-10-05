// Baixa os trailers usados como fonte de frames/clipes para assets-src/video.
// - Steam (PC): HLS 1080p, lido direto pelo ffmpeg
// - YouTube (PS5, PT-BR): via yt-dlp, se estiver instalado (YTDLP=caminho/yt-dlp.exe)
// Uso: node scripts/fetch-videos.mjs
import { spawnSync } from 'node:child_process'
import { mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import ffmpeg from 'ffmpeg-static'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'assets-src', 'video')
mkdirSync(out, { recursive: true })

const STEAM_HLS = {
  'steam-launch': 'https://video.akamai.steamstatic.com/store_trailers/2531310/861867/c3dedb932f9954828dc34ded348a15bcdbe22d79/1750816628/hls_264_0_video.m3u8',
  'steam-announce': 'https://video.akamai.steamstatic.com/store_trailers/2531310/800007/f4247443e3dd24f8397b6cc66da0e2d453000ced/1750816617/hls_264_0_video.m3u8',
}

const YOUTUBE = {
  launch: 'cMj9mzTgYRQ', // Trailer de Lançamento (PS5)
  announce: 'DRf0IGOrf34', // Trailer de Anúncio
  'no-return': 'O5xlXOKgJDA', // Trailer do Modo Sem Volta
  features: 'b-UzhXDMmEs', // Trailer de Novos Recursos
}

for (const [name, url] of Object.entries(STEAM_HLS)) {
  const dest = join(out, `${name}.mp4`)
  if (existsSync(dest)) continue
  const r = spawnSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', '-i', url, '-c', 'copy', dest], { stdio: 'inherit' })
  console.log(r.status === 0 ? `video/${name}.mp4` : `falhou: ${name}`)
}

const ytdlp = process.env.YTDLP || 'yt-dlp'
for (const [name, id] of Object.entries(YOUTUBE)) {
  const dest = join(out, `${name}.mp4`)
  if (existsSync(dest)) continue
  const r = spawnSync(
    ytdlp,
    ['-q', '--no-warnings', '-f', 'bv*[height<=1080][ext=mp4]/bv*[height<=1080]', '-o', dest, `https://www.youtube.com/watch?v=${id}`],
    { stdio: 'inherit' },
  )
  if (r.error) {
    console.warn(`yt-dlp não encontrado. Baixe ${id} manualmente para ${dest}`)
    break
  }
  console.log(r.status === 0 ? `video/${name}.mp4` : `falhou: ${name}`)
}
