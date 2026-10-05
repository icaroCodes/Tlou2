import { useEffect, useRef } from 'react'
import { usePerf } from '../lib/perf'

type Spore = { x: number; y: number; r: number; vx: number; vy: number; a: number; phase: number }

// o requestAnimationFrame continua rodando, mas não desenha nada fora da tela
export function Spores({ className = '', density = 1, color = '236, 214, 170' }: { className?: string; density?: number; color?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const tier = usePerf()

  useEffect(() => {
    const canvas = ref.current!
    const html = document.documentElement
    const reduced = () => html.dataset.motion === 'reduced' || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (tier === 'low') return
    const ctx = canvas.getContext('2d')!
    let spores: Spore[] = []
    let raf = 0
    let visible = false
    let w = 0
    let h = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round(((w * h) / 26000) * density * (tier === 'medium' ? 0.5 : 1))
      spores = Array.from({ length: Math.min(count, 140) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 2.2,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -0.05 - Math.random() * 0.22,
        a: 0.15 + Math.random() * 0.55,
        phase: Math.random() * Math.PI * 2,
      }))
    }

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick)
      if (!visible || reduced()) return
      ctx.clearRect(0, 0, w, h)
      for (const s of spores) {
        s.x += s.vx + Math.sin(t / 2400 + s.phase) * 0.18
        s.y += s.vy
        if (s.y < -6) {
          s.y = h + 6
          s.x = Math.random() * w
        }
        if (s.x < -6) s.x = w + 6
        if (s.x > w + 6) s.x = -6
        const flicker = 0.65 + Math.sin(t / 700 + s.phase) * 0.35
        ctx.beginPath()
        ctx.fillStyle = `rgba(${color}, ${s.a * flicker})`
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(canvas)
    resize()
    window.addEventListener('resize', resize)
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [tier, density, color])

  return <canvas ref={ref} className={`spores ${className}`} aria-hidden />
}
