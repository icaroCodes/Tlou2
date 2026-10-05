// Extrai dos trailers (assets-src/video, ver fetch-videos.mjs):
// - sequências de frames (canvas controlado pelo scroll)
// - clipes curtos para scrub/loop (com montagem de vários trechos)
// - quadros parados (still-*.jpg) que vão para assets-src/tlou e depois passam por optimize-images.mjs
// Uso: node scripts/extract-media.mjs
import { spawnSync } from 'node:child_process'
import { mkdirSync, readdirSync, rmSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import ffmpeg from 'ffmpeg-static'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const pub = join(root, 'public', 'media')
const src = (name) => join(root, 'assets-src', 'video', `${name}.mp4`)
const stillsDir = join(root, 'assets-src', 'tlou')

// os trailers da PlayStation têm um aviso legal no rodapé; 10% de corte some com ele em todos
const NO_FOOTER = 'crop=iw:ih*0.9:0:0'

function run(args) {
  const r = spawnSync(ffmpeg, ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' })
  if (r.status !== 0) throw new Error('ffmpeg falhou: ' + args.join(' '))
}

function frames(name, video, start, duration, fps, width, { crop = NO_FOOTER } = {}) {
  const dir = join(pub, 'frames', name)
  if (existsSync(dir)) rmSync(dir, { recursive: true })
  mkdirSync(dir, { recursive: true })
  run([
    '-ss', String(start), '-i', src(video), '-t', String(duration),
    '-vf', `${crop ? crop + ',' : ''}fps=${fps},scale=${width}:-2:flags=lanczos`,
    '-c:v', 'libwebp', '-quality', '72', '-compression_level', '5',
    '-start_number', '0', join(dir, '%03d.webp'),
  ])
  console.log(`frames/${name}: ${readdirSync(dir).length} frames`)
}

/**
 * Clipe mudo a partir de um ou mais trechos [video, início, fim] (concatenados).
 * `scrub` = keyframes a cada 4 frames, para o scroll controlar currentTime sem travar.
 */
function clip(name, parts, width, { scrub = false, crop = NO_FOOTER } = {}) {
  mkdirSync(join(pub, 'video'), { recursive: true })
  const inputs = parts.flatMap(([video, start, end]) => ['-ss', String(start), '-t', String(end - start), '-i', src(video)])
  const chains = parts.map((_, i) => `[${i}:v]${crop ? crop + ',' : ''}scale=${width}:-2:flags=lanczos,fps=30,setsar=1,format=yuv420p[v${i}]`)
  const filter = `${chains.join(';')};${parts.map((_, i) => `[v${i}]`).join('')}concat=n=${parts.length}:v=1:a=0[out]`
  run([
    ...inputs, '-filter_complex', filter, '-map', '[out]', '-an',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', scrub ? '24' : '27',
    ...(scrub ? ['-g', '4', '-keyint_min', '4', '-sc_threshold', '0'] : []),
    '-movflags', '+faststart', join(pub, 'video', `${name}.mp4`),
  ])
  console.log(`video/${name}.mp4`)
}

function still(name, video, time, { crop = NO_FOOTER } = {}) {
  run(['-ss', String(time), '-i', src(video), '-frames:v', '1', ...(crop ? ['-vf', crop] : []), '-q:v', '2', join(stillsDir, `still-${name}.jpg`)])
}

// ── Sequências de frames ──
// lançamento 0:15: cavalgada diante das montanhas (hero)
frames('jackson', 'launch', 15.45, 2.75, 30, 1600)
// lançamento 1:33: corte da briga para o logo (final)
frames('logo-reveal', 'launch', 93.2, 4.4, 15, 1280, { crop: '' })

// ── Clipes ──
// Montagem da jornada, controlada pelo scroll: Jackson → Seattle → Hillcrest → Ilha dos Serafitas
clip(
  'jornada',
  [
    ['no-return', 9.3, 10.6],
    ['launch', 80.4, 81.4],
    ['launch', 81.5, 82.4],
    ['launch', 82.45, 83.2],
  ],
  1600,
  { scrub: true },
)
// fundo dos trailers: Joel na floresta
clip('trailers-loop', [['launch', 20.1, 23.9]], 1280)
// Clipes curtos das protagonistas
clip('ellie', [['launch', 18.45, 19.95], ['launch', 24.0, 26.2]], 1280)
clip('abby', [['launch', 30.05, 32.0], ['launch', 36.0, 37.9]], 1280)
// Sem Volta: Jackson na neve e o Lev com o arco
clip('sem-volta', [['no-return', 11.8, 13.4], ['no-return', 14.3, 16.0], ['no-return', 25.0, 26.2]], 1280)

// ── Stills (quadros dos trailers) ──
const SELECT = 'crop=1000:800:460:0' // tela de seleção do Sem Volta: só o retrato central
const STILLS = [
  ['horses-vista', 'launch', 16.5],
  ['ellie-guitar', 'launch', 19.5],
  ['joel-forest', 'launch', 21],
  ['ellie-climb', 'launch', 25],
  ['abby-water', 'launch', 31],
  ['abby-owen', 'launch', 34.5],
  ['owen', 'launch', 35.3, { crop: 'crop=900:1000:1000:0' }],
  ['ellie-jesse', 'launch', 62],
  ['abby-dark', 'launch', 66.5],
  ['ellie-gun', 'launch', 69],
  ['abby-infected', 'launch', 76],
  ['jesse-ellie', 'launch', 77],
  ['ellie-face', 'launch', 78],
  ['seattle-overgrown', 'launch', 80.7],
  ['hillcrest', 'launch', 81.7],
  ['island-fire', 'launch', 82.7],
  ['abby-fight', 'launch', 85.8],
  ['abby-face', 'launch', 90.3],
  ['joel-ellie-young', 'announce', 13.5],
  ['hospital', 'announce', 16],
  ['ellie-hospital', 'announce', 20],
  ['joel-close', 'announce', 26.5],
  ['jackson-street', 'no-return', 12.0],
  ['noreturn-street', 'no-return', 14.9],
  ['lev-bow', 'no-return', 25.6],
  ['dina', 'no-return', 29.1, { crop: SELECT }],
  ['jesse', 'no-return', 29.7, { crop: SELECT }],
  ['yara-lev', 'no-return', 30.3, { crop: SELECT }],
  ['manny', 'no-return', 30.9, { crop: SELECT }],
  ['santa-barbara', 'no-return', 36],
  ['board-hunted', 'no-return', 40.5],
  ['rat-king', 'no-return', 56],
  ['nr-forest', 'no-return', 60],
  ['nr-bloater', 'no-return', 66],
  ['nr-shambler', 'no-return', 76],
  ['nr-snow', 'no-return', 86],
  ['nr-crossbow', 'no-return', 88],
]
for (const [name, video, time, opts] of STILLS) still(name, video, time, opts)
console.log(`${STILLS.length} stills em assets-src/tlou`)
