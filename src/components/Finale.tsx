import { useEffect, useMemo, useRef, useState } from 'react'
import { frameSet, usePerf } from '../lib/perf'
import { useFrameSequence } from '../lib/frames'
import { RELEASE_DATE } from '../lib/content'
import { gsap, useGSAP, useScrollTo } from '../lib/scroll'
import { Ps5Logo } from './BrandIcons'
import { Spores } from './Spores'

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const diff = Math.max(0, target.getTime() - now)
  const pad = (n: number) => String(n).padStart(2, '0')
  return {
    days: Math.floor(diff / 86_400_000),
    clock: `${pad(Math.floor(diff / 3_600_000) % 24)}:${pad(Math.floor(diff / 60_000) % 60)}:${pad(Math.floor(diff / 1000) % 60)}`,
  }
}

// Últimos 4 segundos do trailer de lançamento (briga na luz vermelha, corte para o logo), frame a frame.
export function Finale() {
  const root = useRef<HTMLElement>(null)
  const tier = usePerf()
  const frames = useMemo(() => frameSet('logo-reveal', 66, tier), [tier])
  const { canvasRef, draw } = useFrameSequence(frames, 'contain')
  const countdown = useCountdown(RELEASE_DATE)
  const scrollTo = useScrollTo()

  useGSAP(
    () => {
      const state = { frame: 0 }
      draw(0, true)
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root.current, start: 'top top', end: '+=260%', pin: true, scrub: 0.6 },
      })
      tl.fromTo('.finale__canvas', { scale: 1.12 }, { scale: 1, duration: 6 }, 0)
        .to(state, { frame: frames.length - 1, duration: 6, onUpdate: () => draw(state.frame) }, 0)
        .to('.finale__canvas', { yPercent: -22, scale: 0.7, duration: 2, ease: 'power2.inOut' }, 6)
        .from('.finale__content > *', { autoAlpha: 0, y: 50, stagger: 0.25, duration: 1.2, ease: 'power3.out' }, 6.6)
        .to({}, { duration: 1 })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="pre-venda" className="finale" aria-label="Pré-venda">
      <canvas ref={canvasRef} className="finale__canvas" aria-label="The Last of Us Part II Remastered, 19 de fevereiro de 2027" />
      <Spores className="finale__spores" color="255, 140, 90" density={0.8} />
      <div className="finale__content">
        <p className="finale__date">19 de fevereiro de 2027, só no PS5</p>
        <p className="cd" role="timer" aria-label="Tempo até o lançamento">
          Faltam <b className="display cd__days">{countdown.days}</b> dias
          <span className="cd__clock">{countdown.clock}</span>
        </p>
        <div className="finale__ctas">
          <button className="btn btn--primary btn--lg" onClick={() => scrollTo('edicoes')}>
            Fazer pré-venda
          </button>
          <button className="btn btn--ghost btn--lg" onClick={() => scrollTo('trailers')}>
            Rever trailers
          </button>
        </div>
        <div className="platforms" aria-label="Plataforma">
          <Ps5Logo className="platforms__ps5" />
        </div>
      </div>
    </section>
  )
}
