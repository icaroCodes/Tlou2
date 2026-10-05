import { useRef } from 'react'
import { CAST } from '../lib/content'
import { img, responsive } from '../lib/assets'
import { gsap, useGSAP } from '../lib/scroll'

export function Cast() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const track = root.current!.querySelector<HTMLElement>('.cast__track')!
      const distance = () => track.scrollWidth - window.innerWidth

      const scroll = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })

      gsap.to('.cast__progress i', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${distance()}`, scrub: true },
      })

      gsap.utils.toArray<HTMLElement>('.cast__panel').forEach((panel) => {
        const st = { trigger: panel, containerAnimation: scroll, start: 'left right', end: 'right left', scrub: true }
        gsap.fromTo(panel.querySelector('.cast__bg'), { xPercent: -8, scale: 1.08 }, { xPercent: 8, scale: 1, ease: 'none', scrollTrigger: st })
        gsap.fromTo(panel.querySelector('.cast__photo'), { yPercent: 25, rotate: 8 }, { yPercent: -25, rotate: -5, ease: 'none', scrollTrigger: st })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="elenco" className="cast" aria-label="Pessoas e facções">
      <div className="cast__track">
        <div className="cast__intro">
          <h2 className="display">Quem sobrou</h2>
          <p className="lead">Gente de Jackson, gente de Seattle e duas facções que não se suportam.</p>
        </div>

        {CAST.map((m) => (
          <article key={m.id} className="cast__panel" style={{ ['--tone' as string]: m.color }}>
            <img className="cast__bg" {...responsive(img(`cast/${m.id}-bg`), '(max-width: 960px) 130vw, 100vw')} alt="" loading="lazy" />
            <div className="cast__tint" />
            <div className="cast__copy">
              <h3 className="display cast__name">{m.name}</h3>
              <p className="cast__tagline">{m.tagline}</p>
              <p className="cast__bio">{m.bio}</p>
              <blockquote>“{m.quote}”</blockquote>
              <span className="cast__place">{m.place}</span>
            </div>
            <figure className="cast__photo">
              <span className="cast__tape" aria-hidden />
              <img {...responsive(img(`cast/${m.id}`), '320px')} alt={m.name} loading="lazy" />
              <figcaption>{m.name}</figcaption>
            </figure>
          </article>
        ))}
      </div>
      <div className="cast__progress" aria-hidden>
        <i />
      </div>
    </section>
  )
}
