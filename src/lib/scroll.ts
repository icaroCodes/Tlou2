import { createContext, useContext } from 'react'
import type Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export const LenisContext = createContext<Lenis | null>(null)

export const useLenis = () => useContext(LenisContext)

/** Rola até uma seção pelo id usando o Lenis (ou nativo como fallback). */
export function useScrollTo() {
  const lenis = useLenis()
  return (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    if (lenis) lenis.scrollTo(el, { duration: 1.6 })
    else el.scrollIntoView({ behavior: 'smooth' })
  }
}

export { gsap, ScrollTrigger, useGSAP }
