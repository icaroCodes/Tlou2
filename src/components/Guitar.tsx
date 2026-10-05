import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { img, responsive } from '../lib/assets'
import { CHORDS, Guitar as GuitarSynth } from '../lib/guitar'

const STRINGS = ['E', 'A', 'D', 'G', 'B', 'e']

export function Guitar() {
  const synth = useRef<GuitarSynth | null>(null)
  const [chord, setChord] = useState(0)
  const [hits, setHits] = useState<number[]>(() => STRINGS.map(() => 0))
  const [touched, setTouched] = useState(false)
  const lastString = useRef<number | null>(null)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const px = useSpring(mx, { stiffness: 60, damping: 18 })
  const py = useSpring(my, { stiffness: 60, damping: 18 })
  const bgX = useTransform(px, (v) => v * -24)
  const bgY = useTransform(py, (v) => v * -24)
  const cardX = useTransform(px, (v) => v * 36)
  const cardY = useTransform(py, (v) => v * 36)

  const getSynth = () => (synth.current ??= new GuitarSynth())

  const vibrate = (s: number) => setHits((h) => h.map((v, i) => (i === s ? v + 1 : v)))

  const pluck = (s: number) => {
    setTouched(true)
    if (getSynth().pluck(CHORDS[chord], s)) vibrate(s)
  }

  const strum = (down = true) => {
    setTouched(true)
    getSynth().strum(CHORDS[chord], down)
    CHORDS[chord].frets.forEach((f, s) => f >= 0 && setTimeout(() => vibrate(s), (down ? s : 5 - s) * 18))
  }

  // teclas 1-8 e espaço, mas só com a seção na tela (senão o espaço deixa de rolar a página)
  const section = useRef<HTMLElement>(null)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const r = section.current?.getBoundingClientRect()
      if (!r || r.bottom < 0 || r.top > window.innerHeight * 0.6) return
      const n = Number(e.key)
      if (n >= 1 && n <= CHORDS.length) setChord(n - 1)
      else if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'BUTTON') {
        e.preventDefault()
        strum()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  // num movimento rápido o ponteiro pula cordas entre dois eventos, então toca todas no caminho
  const onStrings = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const y = e.clientY - r.top
    const s = Math.max(0, Math.min(STRINGS.length - 1, Math.floor((y / r.height) * STRINGS.length)))
    const prev = lastString.current
    if (prev === null) {
      lastString.current = s
      return
    }
    if (s !== prev) {
      const step = s > prev ? 1 : -1
      for (let k = prev + step; k !== s + step; k += step) pluck(STRINGS.length - 1 - k)
      lastString.current = s
    }
  }

  const onMove = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  return (
    <section ref={section} id="guitarra" className="guitar" onPointerMove={onMove} aria-labelledby="guitar-title">
      <motion.img className="guitar__bg" {...responsive(img('guitar/joel'))} alt="" loading="lazy" style={{ x: bgX, y: bgY }} />
      <div className="guitar__veil" />
      <div className="container guitar__inner">
        <div className="guitar__copy">
          <h2 id="guitar-title" className="display guitar__title">Guitarra Livre</h2>
          <p className="lead">
            No PS5 dá para pegar o violão da Ellie, o do Joel ou um banjo e tocar em qualquer lugar do jogo. Aqui tem uma
            versão de bolso: escolha um acorde e passe o mouse pelas cordas.
          </p>
          <motion.figure className="guitar__card" style={{ x: cardX, y: cardY }} aria-hidden>
            <img {...responsive(img('guitar/ellie'), '360px')} alt="" loading="lazy" />
          </motion.figure>
        </div>

        <div className="guitar__play">
          <div className="wheel" role="radiogroup" aria-label="Acordes">
            {CHORDS.map((c, i) => {
              // distribuídos num anel, a 34% do centro (entre o botão central e a borda)
              const angle = (i / CHORDS.length) * Math.PI * 2 - Math.PI / 2
              return (
                <button
                  key={c.name}
                  role="radio"
                  aria-checked={chord === i}
                  className={`wheel__chord ${chord === i ? 'is-active' : ''}`}
                  style={{ left: `${50 + Math.cos(angle) * 34}%`, top: `${50 + Math.sin(angle) * 34}%` }}
                  onClick={() => {
                    setChord(i)
                    getSynth().strum(CHORDS[i])
                    setTouched(true)
                  }}
                >
                  <span>{c.name}</span>
                  <small>{i + 1}</small>
                </button>
              )
            })}
            <motion.button
              className="wheel__center"
              onClick={() => strum()}
              whileTap={{ scale: 0.92 }}
              aria-label={`Dedilhar ${CHORDS[chord].name}`}
            >
              <motion.span key={chord} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="display">
                {CHORDS[chord].name}
              </motion.span>
              <small>Dedilhar</small>
            </motion.button>
          </div>

          <div
            className="strings"
            onPointerMove={onStrings}
            onPointerLeave={() => (lastString.current = null)}
            onPointerDown={(e) => {
              lastString.current = null
              onStrings(e)
            }}
            role="group"
            aria-label="Cordas: passe o ponteiro por cima para tocar"
          >
            {/* mizinha em cima, como quem olha o próprio violão */}
            {[...STRINGS].reverse().map((name, k) => {
              const s = STRINGS.length - 1 - k
              const muted = CHORDS[chord].frets[s] < 0
              return (
                <div key={name + k} className={`string ${muted ? 'is-muted' : ''}`} style={{ ['--w' as string]: `${1 + s * 0.5}px` }}>
                  <span className="string__name">{name}</span>
                  <motion.i
                    key={hits[s]}
                    initial={hits[s] ? { scaleY: 4, opacity: 1 } : false}
                    animate={{ scaleY: 1, opacity: muted ? 0.25 : 0.85 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              )
            })}
          </div>
          <p className="guitar__hint">
            {touched ? 'Tenta G, D, Em, C. No teclado: 1 a 8 e espaço.' : 'Ligue o som.'}
          </p>
        </div>
      </div>
    </section>
  )
}
