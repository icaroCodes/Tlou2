import { createContext, useContext } from 'react'
import { frameUrls } from './assets'

/**
 * Níveis de desempenho decididos no loading:
 * - high:   experiência completa (todos os frames, vídeo no scroll, scroll suave)
 * - medium: metade dos frames nas sequências, sem desfoque de fundo
 * - low:    modo leve: 1/3 dos frames, imagens no lugar de vídeos, sem scroll suave
 *           e sem animações em loop
 */
export type PerfTier = 'high' | 'medium' | 'low'

export type PerfReport = {
  tier: PerfTier
  fps: number
  reasons: string[]
  manual?: boolean
}

export const PerfContext = createContext<PerfTier>('high')
export const usePerf = () => useContext(PerfContext)

const TIERS: PerfTier[] = ['high', 'medium', 'low']
const STORAGE_KEY = 'perf-override'

/** Escolha manual (menu) ou ?perf=low|medium|high na URL, que tem prioridade sobre a detecção. */
export function readOverride(): PerfTier | null {
  const fromUrl = new URLSearchParams(window.location.search).get('perf')
  if (fromUrl && TIERS.includes(fromUrl as PerfTier)) return fromUrl as PerfTier
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved && TIERS.includes(saved as PerfTier) ? (saved as PerfTier) : null
  } catch {
    return null
  }
}

export function saveOverride(tier: PerfTier | null) {
  try {
    if (tier) localStorage.setItem(STORAGE_KEY, tier)
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* armazenamento indisponível */
  }
}

/** Mede o FPS real com requestAnimationFrame (a animação do loading roda ao mesmo tempo). */
function measureFps(duration = 1000): Promise<number> {
  return new Promise((resolve) => {
    const deltas: number[] = []
    let last = performance.now()
    let frames = 0
    const start = last
    const tick = (now: number) => {
      if (frames++ > 3) deltas.push(now - last) // ignora os primeiros frames (aquecimento)
      last = now
      if (now - start < duration) requestAnimationFrame(tick)
      else finish()
    }
    const finish = () => {
      if (deltas.length < 10) return resolve(60) // aba em segundo plano: não penaliza
      deltas.sort((a, b) => a - b)
      const median = deltas[Math.floor(deltas.length / 2)]
      const p90 = deltas[Math.floor(deltas.length * 0.9)]
      resolve(Math.round(1000 / ((median + p90) / 2)))
    }
    requestAnimationFrame(tick)
    setTimeout(() => frames < 10 && finish(), duration + 800)
  })
}

function gpuInfo() {
  try {
    const canvas = document.createElement('canvas')
    const gl = (canvas.getContext('webgl2') || canvas.getContext('webgl')) as WebGLRenderingContext | null
    if (!gl) return { webgl: false, software: true, renderer: '' }
    const ext = gl.getExtension('WEBGL_debug_renderer_info')
    const renderer = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : ''
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return { webgl: true, software: /swiftshader|llvmpipe|software|basic render/i.test(renderer), renderer }
  } catch {
    return { webgl: false, software: true, renderer: '' }
  }
}

type NavigatorExtras = Navigator & {
  deviceMemory?: number
  connection?: { saveData?: boolean; effectiveType?: string }
}

export async function detectPerf(): Promise<PerfReport> {
  const nav = navigator as NavigatorExtras
  const reasons: string[] = []
  let penalty = 0

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    penalty += 2
    reasons.push('movimento reduzido no sistema')
  }
  const conn = nav.connection
  if (conn?.saveData) {
    penalty += 2
    reasons.push('economia de dados ativa')
  } else if (conn?.effectiveType && /(^|-)2g$/.test(conn.effectiveType)) {
    penalty += 2
    reasons.push('conexão lenta')
  } else if (conn?.effectiveType === '3g') {
    penalty += 1
    reasons.push('conexão 3G')
  }
  const cores = nav.hardwareConcurrency || 4
  if (cores <= 2) {
    penalty += 2
    reasons.push(`${cores} núcleos de CPU`)
  } else if (cores <= 4) penalty += 0.5
  const memory = nav.deviceMemory
  if (memory && memory <= 2) {
    penalty += 2
    reasons.push(`${memory} GB de memória`)
  } else if (memory && memory <= 4) penalty += 0.5
  const gpu = gpuInfo()
  if (!gpu.webgl || gpu.software) {
    penalty += 2
    reasons.push('sem aceleração de vídeo (GPU)')
  }

  const fps = await measureFps()
  if (fps < 35) {
    penalty += 2
    reasons.push(`${fps} FPS no teste`)
  } else if (fps < 50) {
    penalty += 1
    reasons.push(`${fps} FPS no teste`)
  }

  const tier: PerfTier = penalty >= 2 ? 'low' : penalty >= 1 ? 'medium' : 'high'
  return { tier, fps, reasons }
}

/**
 * Sequência de frames adequada ao aparelho: resolução pelo tamanho da tela
 * (variante -sm abaixo de 900px) e densidade pelo nível de desempenho.
 */
export function frameSet(name: string, count: number, tier: PerfTier) {
  const small = Math.min(window.innerWidth, window.innerHeight * 1.78) < 900
  const step = tier === 'high' ? 1 : tier === 'medium' ? 2 : 3
  return frameUrls(small ? `${name}-sm` : name, count).filter((_, i) => i % step === 0 || i === count - 1)
}
