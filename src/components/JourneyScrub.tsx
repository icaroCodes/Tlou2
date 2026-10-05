import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { JOURNEY } from '../lib/content'
import { video, videoPoster } from '../lib/assets'
import { usePerf } from '../lib/perf'
import { gsap, useGSAP } from '../lib/scroll'
import { SplitWords } from './SplitWords'

// O scroll controla o currentTime. Cada trecho do MP4 dura o mesmo que um item da lista, e o arquivo
// tem keyframe a cada 4 frames (extract-media.mjs), senão o seek trava.

export function JourneyScrub() {
  const root = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [active, setActive] = useState(0)
  const lite = usePerf() === 'low'

  // blob em memória: com range requests o seek fica engasgando no Chrome
  useEffect(() => {
    if (lite) return
    const v = videoRef.current!
    let url = ''
    let cancelled = false
    fetch(video('jornada'))
      .then((r) => r.blob())
      .then((blob) => {
        if (cancelled) return
        url = URL.createObjectURL(blob)
        v.src = url
        // iOS só permite seek depois de um play()
        v.play().then(() => v.pause()).catch(() => {})
      })
      .catch(() => {
        v.src = video('jornada')
      })
    return () => {
      cancelled = true
      if (url) URL.revokeObjectURL(url)
    }
  }, [lite])

  useGSAP(
    () => {
      const v = videoRef.current
      const state = { p: 0 }
      let last = -1

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root.current, start: 'top top', end: '+=360%', pin: true, scrub: 0.6 },
      })

      tl.to(
        state,
        {
          p: 1,
          duration: 10,
          onUpdate: () => {
            if (v?.duration) {
              const t = state.p * (v.duration - 0.04)
              if (Math.abs(t - v.currentTime) > 0.01) v.currentTime = t
            }
            const idx = Math.min(JOURNEY.length - 1, Math.floor(state.p * JOURNEY.length))
            if (idx !== last) {
              last = idx
              setActive(idx)
            }
          },
        },
        0,
      )
      if (lite) tl.fromTo('.jscrub__video', { scale: 1.2 }, { scale: 1, duration: 10 }, 0)
      tl.from('.jscrub__title .w', { yPercent: 120, opacity: 0, stagger: 0.15, duration: 1.2, ease: 'power3.out' }, 0)
        .from('.jscrub__places', { autoAlpha: 0, x: -30, duration: 1 }, 0.8)
        .to('.jscrub__bar i', { scaleX: 1, duration: 10 }, 0)
        .to('.jscrub__title', { autoAlpha: 0, y: -40, duration: 1 }, 7.5)
        .from('.jscrub__outro', { autoAlpha: 0, y: 40, duration: 1.2 }, 8.2)
    },
    { scope: root, dependencies: [lite] },
  )

  return (
    <section ref={root} id="jornada" className="jscrub">
      {lite ? (
        <img className="jscrub__video" src={videoPoster('jornada')} alt="" />
      ) : (
        <video ref={videoRef} className="jscrub__video" muted playsInline preload="auto" aria-hidden />
      )}
      <div className="jscrub__veil" />

      <h2 className="jscrub__title display">
        <SplitWords text="A" />
        <br />
        <SplitWords text="Jornada" />
      </h2>

      <div className="jscrub__places">
        <ol>
          {JOURNEY.map((p, i) => (
            <li key={p.id} className={i === active ? 'is-active' : ''}>
              <span>{String(i + 1).padStart(2, '0')}</span> {p.name}
            </li>
          ))}
        </ol>
        <div className="jscrub__blurb">
          <AnimatePresence mode="wait">
            <motion.p
              key={active}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35 }}
            >
              {JOURNEY[active].blurb}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="jscrub__bar">
          <i />
        </div>
      </div>

      <p className="jscrub__outro display">
        Até onde você iria?
      </p>
    </section>
  )
}
