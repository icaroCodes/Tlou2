import { useEffect, useState, type ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap, LenisContext, ScrollTrigger } from '../lib/scroll'

/** Scroll suave com Lenis sincronizado ao ticker do GSAP/ScrollTrigger. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    const html = document.documentElement
    const lerp = () =>
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      html.dataset.motion === 'reduced' ||
      html.dataset.perf === 'low'
        ? 1
        : 0.09
    const instance = new Lenis({ lerp: lerp(), wheelMultiplier: 0.9 })
    // opção "Movimento" do menu (html[data-motion]) e modo leve detectado no loading (html[data-perf])
    const observer = new MutationObserver(() => (instance.options.lerp = lerp()))
    observer.observe(html, { attributes: true, attributeFilter: ['data-motion', 'data-perf'] })
    instance.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    // a instância só existe depois de montar (precisa do window), por isso vai pelo contexto
    // oxlint-disable-next-line react/set-state-in-effect
    setLenis(instance)
    return () => {
      observer.disconnect()
      gsap.ticker.remove(tick)
      instance.destroy()
    }
  }, [])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
