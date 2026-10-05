import { useRef } from 'react'
import { img, responsive, video, videoPoster } from '../lib/assets'
import { gsap, useGSAP } from '../lib/scroll'
import { usePerf } from '../lib/perf'

const SHOTS = [
  { src: 'sem-volta/board', cls: 'v1', speed: 0.5, label: 'Hardware Store, caçada' },
  { src: 'sem-volta/rat-king', cls: 'v2', speed: 1.2, label: 'Rei dos Ratos' },
  { src: 'sem-volta/forest', cls: 'v3', speed: 0.8, label: 'Floresta' },
  { src: 'sem-volta/shambler', cls: 'v4', speed: 1.6, label: 'Shambler' },
  { src: 'sem-volta/crossbow', cls: 'v5', speed: 1, label: 'Jackson' },
  { src: 'sem-volta/bloater', cls: 'v6', speed: 0.6, label: 'Bloater' },
]

const ROSTER = ['Ellie', 'Abby', 'Dina', 'Jesse', 'Tommy', 'Lev', 'Yara', 'Manny', 'Mel', 'Joel']

export function SemVolta() {
  const root = useRef<HTMLElement>(null)
  const lite = usePerf() === 'low'

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 961px)', () => {
        if (lite) return
        gsap.utils.toArray<HTMLElement>('.semvolta__shot', root.current).forEach((el) => {
          const speed = Number(el.dataset.speed)
          gsap.fromTo(
            el,
            { y: 140 * speed, rotate: -4 * speed },
            { y: -140 * speed, rotate: 3 * speed, ease: 'none', scrollTrigger: { trigger: root.current, scrub: true } },
          )
        })
      })
      gsap.fromTo('.semvolta__bg', { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: root.current, scrub: true } })
      return () => mm.revert()
    },
    { scope: root, dependencies: [lite] },
  )

  return (
    <section ref={root} id="sem-volta" className="semvolta" aria-labelledby="semvolta-title">
      {lite ? (
        <img className="semvolta__bg" {...responsive(img('sem-volta/bg'))} alt="" loading="lazy" />
      ) : (
        <video className="semvolta__bg" src={video('sem-volta')} poster={videoPoster('sem-volta')} autoPlay muted loop playsInline preload="metadata" />
      )}
      <div className="semvolta__inner container">
        <div className="semvolta__copy">
          <h2 id="semvolta-title" className="display semvolta__title">
            Sem
            <br />
            Volta
          </h2>
          <p className="lead">
            O modo roguelike novo. Você escolhe um sobrevivente, monta o arsenal no esconderijo e encara uma sequência de
            encontros sorteados até o chefe. Se morrer, começa tudo de novo.
          </p>
          <p className="semvolta__roster-title">Dá pra jogar com</p>
          <ul className="semvolta__roster">
            {ROSTER.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
        <div className="semvolta__collage">
          {SHOTS.map((s) => (
            <figure key={s.cls} className={`semvolta__shot ${s.cls}`} data-speed={s.speed}>
              <img {...responsive(img(s.src), '(max-width: 960px) 50vw, 30vw')} alt="" loading="lazy" />
              <figcaption>{s.label}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
