const BASE = import.meta.env.BASE_URL

export const img = (name: string) => `${BASE}img/${name}.webp`

export const video = (name: string) => `${BASE}media/video/${name}.mp4`

// pôster gerado por derive-light.mjs, usado no lugar do vídeo no modo leve
export const videoPoster = (name: string) => `${BASE}media/video/${name}.webp`

export const frameUrls = (name: string, count: number) =>
  Array.from({ length: count }, (_, i) => `${BASE}media/frames/${name}/${String(i).padStart(3, '0')}.webp`)

/**
 * Props de <img> com srcset: a variante -sm (800px) existe para toda imagem
 * otimizada a partir de 1280px (ver scripts/optimize-images.mjs).
 */
export const responsive = (url: string, sizes = '100vw') => ({
  src: url,
  srcSet: `${url.replace(/\.webp$/, '-sm.webp')} 800w, ${url} 1920w`,
  sizes,
})

/** Logo oficial recortado (brand/logo.webp): 1246x476, "THE LAST OF US / PART II REMASTERED". */
export const LOGO_SIZE: [number, number] = [1246, 476]
/** As duas barras do "II" de "PART II", [x, y, w, h] em pixels do logo. Medidas no canal alfa do PNG. */
export const LOGO_II: [number, number, number, number][] = [
  [343, 296, 32, 180],
  [383, 296, 31, 180],
]

/** Caixa do "REMASTERED" no logo, [x, y, w, h]. */
export const LOGO_REM: [number, number, number, number] = [485, 282, 761, 194]

/**
 * Máscaras em coordenadas do logo para separá-lo em camadas:
 * - title: "THE LAST OF US / PART" (tudo menos o "II" e o "REMASTERED")
 * - ii: só as duas barras do "II"
 * - rem: só o "REMASTERED"
 */
export function logoMask(part: 'title' | 'ii' | 'rem') {
  const [W, H] = LOGO_SIZE
  const pad = 3
  const rect = ([x, y, w, h]: number[], p = 0) => `M${x - p} ${y - p}h${w + p * 2}v${h + p * 2}h${-(w + p * 2)}z`
  const ii = LOGO_II.map((r) => rect(r, pad)).join('')
  const d = part === 'ii' ? ii : part === 'rem' ? rect(LOGO_REM) : `M0 0H${W}V${H}H0z${ii}${rect(LOGO_REM)}`
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${W} ${H}' preserveAspectRatio='none'><path fill-rule='evenodd' d='${d}'/></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

/**
 * Capa em camadas: a key art oficial ocupa o palco inteiro e o logo fica por cima, em `logo` = [x, y, largura]
 * (pixels do palco). Os estilhaços são gerados por crackShards a partir do centro do logo.
 */
export type HeroLayout = {
  width: number
  height: number
  dir: 'hero' | 'hero-m'
  logo: [number, number, number]
}

export const HERO_DESKTOP: HeroLayout = { width: 2560, height: 1440, dir: 'hero', logo: [230, 700, 890] }
export const HERO_MOBILE: HeroLayout = { width: 1200, height: 1672, dir: 'hero-m', logo: [240, 1250, 720] }

export function logoBox({ logo: [x, y, w] }: HeroLayout): [number, number, number, number] {
  return [x, y, w, (w * LOGO_SIZE[1]) / LOGO_SIZE[0]]
}

/** Centro do logo (de onde a capa "estilhaça") e ponto dentro do segundo "I" (foco do zoom da máscara). */
export function heroPoints(layout: HeroLayout) {
  const [x, y, w, h] = logoBox(layout)
  const k = w / LOGO_SIZE[0]
  const [ix, iy, iw, ih] = LOGO_II[1]
  return {
    logoCenter: [x + w / 2, y + h / 2] as [number, number],
    maskFocus: [x + (ix + iw / 2) * k, y + (iy + ih * 0.55) * k] as [number, number],
  }
}

/** Máscara em SVG (nítida em qualquer zoom) com as duas barras do "II" na posição exata do palco. */
export function iiMaskUrl(layout: HeroLayout) {
  const [x, y, w] = logoBox(layout)
  const k = w / LOGO_SIZE[0]
  const rects = LOGO_II.map(
    ([ix, iy, iw, ih]) => `<rect x='${x + ix * k}' y='${y + iy * k}' width='${iw * k}' height='${ih * k}'/>`,
  ).join('')
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${layout.width} ${layout.height}'>${rects}</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

export type Shard = {
  /** polígono em % do palco (para clip-path) */
  points: [number, number][]
  /** centróide em px do palco */
  center: [number, number]
}

/** Gerador pseudoaleatório determinístico (o vidro quebra sempre igual). */
function random(seed: number) {
  let s = seed
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

/**
 * Rachaduras radiais saindo do centro do logo, como vidro atingido: `rays` linhas até a borda
 * do palco, cortadas por dois anéis irregulares. Dá triângulos no meio e trapézios em volta.
 */
export function crackShards(layout: HeroLayout, rays = 7, seed = 11): { shards: Shard[]; cracks: [number, number][][] } {
  const { width: W, height: H } = layout
  const [cx, cy] = heroPoints(layout).logoCenter
  const r = random(seed)
  const perimeter = 2 * (W + H)
  const angles = Array.from({ length: rays }, (_, i) => ((i + 0.2 + r() * 0.6) / rays) * Math.PI * 2)
  const minSide = Math.min(W, H)

  // ponto da borda atingido pelo raio e sua posição no perímetro (sentido horário a partir do canto superior esquerdo)
  const edge = angles.map((a) => {
    const dx = Math.cos(a)
    const dy = Math.sin(a)
    const ts = [dx > 0 ? (W - cx) / dx : dx < 0 ? -cx / dx : Infinity, dy > 0 ? (H - cy) / dy : dy < 0 ? -cy / dy : Infinity]
    const t = Math.min(...ts)
    const px = Math.min(W, Math.max(0, cx + dx * t))
    const py = Math.min(H, Math.max(0, cy + dy * t))
    const p = py <= 0.5 ? px : px >= W - 0.5 ? W + py : py >= H - 0.5 ? W + H + (W - px) : 2 * W + H + (H - py)
    return { pt: [px, py] as [number, number], p }
  })
  const ring = (scale: number) =>
    angles.map((a, i) => {
      const max = Math.hypot(edge[i].pt[0] - cx, edge[i].pt[1] - cy)
      const d = Math.min(max * 0.8, minSide * scale * (0.78 + r() * 0.44))
      return [cx + Math.cos(a) * d, cy + Math.sin(a) * d] as [number, number]
    })
  const inner = ring(0.2)
  const middle = ring(0.48)
  const corners: { pt: [number, number]; p: number }[] = [
    { pt: [W, 0], p: W },
    { pt: [W, H], p: W + H },
    { pt: [0, H], p: 2 * W + H },
    { pt: [0, 0], p: perimeter },
  ]

  const shards: [number, number][][] = []
  for (let i = 0; i < rays; i++) {
    const j = (i + 1) % rays
    shards.push([[cx, cy], inner[i], inner[j]])
    shards.push([inner[i], middle[i], middle[j], inner[j]])
    // trecho do perímetro entre os dois raios (com os cantos no caminho)
    const p0 = edge[i].p
    let p1 = edge[j].p
    if (p1 <= p0) p1 += perimeter
    const between = [...corners, ...corners.map((c) => ({ pt: c.pt, p: c.p + perimeter }))]
      .filter((c) => c.p > p0 && c.p < p1)
      .sort((a, b) => a.p - b.p)
      .map((c) => c.pt)
    shards.push([middle[i], edge[i].pt, ...between, edge[j].pt, middle[j]])
  }

  // linhas visíveis da rachadura: só as fissuras internas (raios + anéis), nunca a borda do palco
  const cracks: [number, number][][] = [
    ...angles.map((_, i) => [[cx, cy], inner[i], middle[i], edge[i].pt] as [number, number][]),
    [...inner, inner[0]],
    [...middle, middle[0]],
  ]

  return {
    shards: shards.map((poly) => ({
      points: poly.map(([x, y]) => [(x / W) * 100, (y / H) * 100] as [number, number]),
      center: [poly.reduce((s, p) => s + p[0], 0) / poly.length, poly.reduce((s, p) => s + p[1], 0) / poly.length],
    })),
    cracks,
  }
}
