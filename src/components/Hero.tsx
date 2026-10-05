import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap, useGSAP, useScrollTo } from '../lib/scroll'
import {
  HERO_DESKTOP,
  HERO_MOBILE,
  crackShards,
  heroPoints,
  iiMaskUrl,
  img,
  logoBox,
  logoMask,
  type HeroLayout,
} from '../lib/assets'
import { frameSet, usePerf } from '../lib/perf'
import { useFrameSequence } from '../lib/frames'
import { STORY } from '../lib/content'
import { SplitWords } from './SplitWords'
import { ReleaseBar } from './ReleaseBar'
import { Spores } from './Spores'

const pickLayout = () => (window.innerWidth / window.innerHeight < 0.85 ? HERO_MOBILE : HERO_DESKTOP)

/** Zoom máximo da máscara do "II" antes de removê-la. */
const MASK_ZOOM = 120

const LOGO_PARTS = ['title', 'ii', 'rem'] as const

// Três atos presos ao scroll: a capa racha a partir do logo, o "II" vira janela para Jackson
// e a câmera entra nela, depois os frames do trailer tocam com a sinopse por cima.
export function Hero({ intro }: { intro: boolean }) {
  const root = useRef<HTMLElement>(null)
  const reveal = useRef<HTMLDivElement>(null)
  const [layout, setLayout] = useState<HeroLayout>(pickLayout)
  const tier = usePerf()
  const frames = useMemo(() => frameSet('jackson', 82, tier), [tier])
  const { shards, cracks } = useMemo(() => crackShards(layout, tier === 'low' ? 5 : 7), [layout, tier])
  const { canvasRef, draw } = useFrameSequence(frames)
  const scrollTo = useScrollTo()

  useEffect(() => {
    const onResize = () => setLayout((prev) => (pickLayout() === prev ? prev : pickLayout()))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useGSAP(
    () => {
      const { width: lw, height: lh } = layout
      const { logoCenter, maskFocus } = heroPoints(layout)
      const q = gsap.utils.selector(root)
      const maskEl = reveal.current!
      const maskUrl = iiMaskUrl(layout)
      const state = { zoom: 0, center: 0 }
      const seq = { frame: 0 }

      // A máscara precisa bater pixel a pixel com o logo, que está num palco com object-fit: cover.
      // Zoom exponencial porque linear parece parar no fim.
      const applyMask = () => {
        const W = root.current!.clientWidth
        const H = root.current!.clientHeight
        const s = Math.max(W / lw, H / lh)
        const k = Math.pow(MASK_ZOOM, state.zoom)
        if (state.zoom >= 0.999) {
          maskEl.style.setProperty('mask-image', 'none')
          maskEl.style.setProperty('-webkit-mask-image', 'none')
          return
        }
        maskEl.style.setProperty('mask-image', maskUrl)
        maskEl.style.setProperty('-webkit-mask-image', maskUrl)
        const fx0 = (W - lw * s) / 2 + maskFocus[0] * s
        const fy0 = (H - lh * s) / 2 + maskFocus[1] * s
        const fx = fx0 + (W / 2 - fx0) * state.center
        const fy = fy0 + (H / 2 - fy0) * state.center
        const size = `${lw * s * k}px ${lh * s * k}px`
        const pos = `${fx - maskFocus[0] * s * k}px ${fy - maskFocus[1] * s * k}px`
        maskEl.style.setProperty('mask-size', size)
        maskEl.style.setProperty('-webkit-mask-size', size)
        maskEl.style.setProperty('mask-position', pos)
        maskEl.style.setProperty('-webkit-mask-position', pos)
      }
      applyMask()
      draw(0, true)

      // tamanho inicial vem do .hero__frame no CSS, que muda no mobile
      const framed = () => {
        const W = root.current!.clientWidth
        const H = root.current!.clientHeight
        const frame = q('.hero__frame')[0].getBoundingClientRect()
        const top = root.current!.getBoundingClientRect().top
        const coverW = Math.max(W, (H * lw) / lh)
        return { scale: frame.width / coverW, y: frame.top - top + frame.height / 2 - H / 2 }
      }
      gsap.set(q('.hero__stage'), { xPercent: -50, yPercent: -50, x: 0 })
      gsap.set(maskEl, { autoAlpha: 0 })
      gsap.set(q('.hero__crack'), { strokeDashoffset: 1 })
      gsap.set(q('.hero__story-title .w, .hero__story-body .w'), { yPercent: 110, opacity: 0 })

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=520%',
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onRefresh: applyMask,
        },
      })

      tl.to(q('.hero__bar'), { y: 60, autoAlpha: 0, duration: 0.7, ease: 'power1.in' }, 0)
        .to(q('.hero__chev'), { autoAlpha: 0, duration: 0.3 }, 0)
        .fromTo(
          q('.hero__stage'),
          { scale: () => framed().scale, y: () => framed().y },
          { scale: 1, y: 0, duration: 1.7, ease: 'power2.inOut', immediateRender: true },
          0,
        )
        .to(q('.hero__crack'), { strokeDashoffset: 0, duration: 0.8, stagger: 0.02, ease: 'power2.out' }, 0.5)
        .to(q('.hero__cracks'), { autoAlpha: 0, duration: 0.4 }, 1.3)
        .to(q('.hero__backing'), { autoAlpha: 0, duration: 1 }, 1.2)

      q('.hero__shard').forEach((el, i) => {
        const [cx, cy] = shards[i].center
        const dx = ((cx - logoCenter[0]) / lw) * 100
        const dy = ((cy - logoCenter[1]) / lh) * 100
        const dist = Math.hypot(dx, dy)
        gsap.set(el, { transformOrigin: `${(cx / lw) * 100}% ${(cy / lh) * 100}%` })
        tl.to(
          el,
          {
            xPercent: dx * 1.6,
            yPercent: dy * 1.6,
            scale: 1.3 + (i % 3) * 0.14,
            rotation: (i % 2 ? 1 : -1) * (5 + (i % 4) * 4),
            autoAlpha: 0,
            duration: 1.7,
            ease: 'power2.in',
          },
          0.95 + (60 - Math.min(dist, 60)) * 0.006,
        )
      })

      tl.to(maskEl, { autoAlpha: 1, duration: 0.8 }, 2.4)
        .to(q('.hero__logo--ii, .hero__logo--rem'), { autoAlpha: 0, duration: 0.8 }, 2.4)
        .to(q('.hero__logo--title'), { autoAlpha: 0, scale: 1.12, duration: 0.8, ease: 'power1.in' }, 3.4)
        .to(state, { zoom: 1, duration: 2.6, ease: 'power2.in', onUpdate: applyMask }, 3.3)
        .to(state, { center: 1, duration: 2.2, ease: 'power1.inOut', onUpdate: applyMask }, 3.3)

      tl.to(seq, { frame: frames.length - 1, duration: 4.6, onUpdate: () => draw(seq.frame) }, 5.4)
        .to(q('.hero__shade'), { autoAlpha: 1, duration: 1 }, 6)
        .to(q('.hero__story-title .w'), { yPercent: 0, opacity: 1, stagger: 0.12, duration: 0.6, ease: 'power3.out' }, 6.3)
        .to(q('.hero__story-body .w'), { yPercent: 0, opacity: 1, stagger: 0.012, duration: 0.5, ease: 'power2.out' }, 7.2)
        .to({}, { duration: 0.8 })

      const onResize = () => applyMask()
      window.addEventListener('resize', onResize)
      return () => window.removeEventListener('resize', onResize)
    },
    { scope: root, dependencies: [layout, frames, shards], revertOnUpdate: true },
  )

  // Entrada depois do loading. "REMASTERED" acende por último, igual ao fim do trailer.
  const introPlayed = useRef(false)
  useGSAP(
    () => {
      if (introPlayed.current) return
      const q = gsap.utils.selector(root)
      const { width: lw, height: lh } = layout
      const { logoCenter } = heroPoints(layout)
      const html = document.documentElement
      const pieces = q('.hero__piece--shard')
      const barParts = q('.rbar__date, .btn-reserve, .rbar__platforms')
      const reduced =
        html.dataset.motion === 'reduced' || window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (!intro) {
        html.classList.add('hero-intro')
        gsap.set(q('.hero__intro'), { scale: reduced ? 1 : 2.3, autoAlpha: reduced ? 0 : 0.3 })
        gsap.set(q('.hero__backing'), { autoAlpha: 0 })
        gsap.set(q('.hero__logo--title, .hero__logo--ii'), { autoAlpha: 0, scale: 1.06, filter: 'blur(10px)' })
        gsap.set(q('.hero__logo--rem'), { autoAlpha: 0, '--heat': 0 })
        gsap.set(barParts, { y: 34, autoAlpha: 0 })
        gsap.set(q('.hero__chev svg'), { autoAlpha: 0 })
        pieces.forEach((el, i) => {
          const [cx, cy] = shards[i].center
          gsap.set(el, {
            transformOrigin: `${(cx / lw) * 100}% ${(cy / lh) * 100}%`,
            xPercent: reduced ? 0 : ((cx - logoCenter[0]) / lw) * 100 * 0.28,
            yPercent: reduced ? 0 : ((cy - logoCenter[1]) / lh) * 100 * 0.28,
            rotation: reduced ? 0 : (i % 2 ? 1 : -1) * (2 + (i % 3)),
            autoAlpha: reduced ? 1 : 0.2,
          })
        })
        return
      }

      introPlayed.current = true
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: reduced ? 0 : 0.35 })

      if (reduced) {
        tl.to(q('.hero__intro'), { autoAlpha: 1, duration: 0.6 })
          .set(q('.hero__backing'), { autoAlpha: 1 }, 0)
          .set(q('.hero__logo--title, .hero__logo--ii'), { autoAlpha: 1, scale: 1, filter: 'blur(0px)' }, 0)
          .set(q('.hero__logo--rem'), { autoAlpha: 1, '--heat': 1 }, 0)
          .to(barParts, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.06 }, 0.2)
          .to(q('.hero__chev svg'), { autoAlpha: 1, duration: 0.4 }, 0.4)
          .add(() => html.classList.remove('hero-intro'), 0.2)
        return
      }

      tl.to(q('.hero__intro'), { scale: 1, duration: 1.1, ease: 'expo.out' }, 0)
        .to(q('.hero__intro'), { autoAlpha: 1, duration: 0.5, ease: 'power1.out' }, 0)
        .to(
          pieces,
          { xPercent: 0, yPercent: 0, rotation: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out', stagger: { each: 0.02, from: 'center' } },
          0.05,
        )
        .to(q('.hero__backing'), { autoAlpha: 1, duration: 0.4, ease: 'power1.out' }, 0.6)
        .to(q('.hero__logo--title, .hero__logo--ii'), { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.7 }, 0.55)
        .to(q('.hero__logo--rem'), { autoAlpha: 1, duration: 0.35, ease: 'none' }, 1.15)
        .to(q('.hero__logo--rem'), { '--heat': 1, duration: 0.6, ease: 'power1.inOut' }, 1.15)
        .to(barParts, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.08 }, 1.35)
        .to(q('.hero__chev svg'), { autoAlpha: 1, duration: 0.5 }, 1.6)
        .add(() => html.classList.remove('hero-intro'), 1.45)
    },
    { scope: root, dependencies: [intro, layout, shards] },
  )

  const ar = layout.width / layout.height
  const [lx, ly, lwidth, lheight] = logoBox(layout)
  const logoStyle = {
    left: `${(lx / layout.width) * 100}%`,
    top: `${(ly / layout.height) * 100}%`,
    width: `${(lwidth / layout.width) * 100}%`,
    height: `${(lheight / layout.height) * 100}%`,
  }
  const cover = img(`${layout.dir}/cover`)

  return (
    <section ref={root} className="hero" id="inicio" aria-label="The Last of Us Part II Remastered" style={{ ['--ar' as string]: ar }}>
      <div className="hero__reveal" ref={reveal}>
        <canvas ref={canvasRef} className="hero__canvas" />
        <div className="hero__shade" />
      </div>
      <Spores className="hero__spores" />

      {/* a entrada anima .hero__intro/.hero__piece e o scroll anima as imagens, para um não sobrescrever o outro */}
      <div className="hero__stage">
        <div className="hero__intro">
          <div className="hero__piece hero__backing" />
          {shards.map((s, i) => (
            <div key={i} className="hero__piece hero__piece--shard">
              <img
                className="hero__shard"
                src={cover}
                alt=""
                fetchPriority={i === 0 ? 'high' : undefined}
                style={{ clipPath: `polygon(${s.points.map(([x, y]) => `${x}% ${y}%`).join(', ')})` }}
              />
            </div>
          ))}
          <svg className="hero__cracks" viewBox={`0 0 ${layout.width} ${layout.height}`} preserveAspectRatio="none" aria-hidden>
            {cracks.map((line, i) => (
              <polyline key={i} className="hero__crack" pathLength={1} points={line.map(([x, y]) => `${x},${y}`).join(' ')} />
            ))}
          </svg>
          {LOGO_PARTS.map((part) => (
            <img
              key={part}
              className={`hero__logo hero__logo--${part}`}
              src={img('brand/logo')}
              alt={part === 'title' ? 'The Last of Us Part II Remastered' : ''}
              style={{ ...logoStyle, maskImage: logoMask(part), WebkitMaskImage: logoMask(part) }}
            />
          ))}
        </div>
      </div>
      <div className="hero__frame" aria-hidden />

      <ReleaseBar className="hero__bar" onReserve={() => scrollTo('edicoes')} />

      <button className="hero__chev" onClick={() => scrollTo('trailers')} aria-label="Rolar para os trailers">
        <svg viewBox="0 0 24 12" aria-hidden>
          <path d="M2 2l10 8 10-8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="hero__story">
        <h2 className="hero__story-title display">
          <SplitWords text={STORY.title} />
        </h2>
        <p className="hero__story-body">
          <SplitWords text={STORY.body} />
        </p>
      </div>
    </section>
  )
}
