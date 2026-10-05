import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HERO_DESKTOP, HERO_MOBILE, img } from '../lib/assets'
import { detectPerf, frameSet, readOverride, type PerfTier } from '../lib/perf'
import { Spores } from './Spores'

function preload(urls: string[], onEach: () => void) {
  return Promise.all(
    urls.map(
      (src) =>
        new Promise<void>((resolve) => {
          const image = new Image()
          image.onload = image.onerror = () => {
            onEach()
            resolve()
          }
          image.src = src
        }),
    ),
  )
}

// O teste de desempenho roda durante o loading porque a página monta com os assets do nível escolhido.
export function Loader({
  onDetected,
  onReveal,
  onDone,
}: {
  onDetected: (tier: PerfTier) => void
  onReveal: () => void
  onDone: () => void
}) {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return // StrictMode monta duas vezes em dev
    started.current = true
    document.documentElement.classList.add('is-loading')

    const layout = window.innerWidth / window.innerHeight < 0.85 ? HERO_MOBILE : HERO_DESKTOP
    const hero = [img(`${layout.dir}/cover`), img('brand/logo')]
    const total = hero.length + 10
    let loaded = 0
    const bump = () => setProgress(Math.min(1, ++loaded / total))

    const run = async () => {
      const minTime = new Promise((r) => setTimeout(r, 2000))
      const heroDone = preload(hero, bump)
      const tier = readOverride() ?? (await detectPerf()).tier
      document.documentElement.dataset.perf = tier
      onDetected(tier)
      await Promise.all([heroDone, preload(frameSet('jackson', 82, tier).slice(0, 10), bump), minTime])
      setProgress(1)
      await new Promise((r) => setTimeout(r, 500))
      setVisible(false)
      onReveal()
    }
    run()
  }, [onDetected, onReveal])

  const pct = Math.round(progress * 100)

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.documentElement.classList.remove('is-loading')
        onDone()
      }}
    >
      {visible && (
        <motion.div
          className="loader"
          role="status"
          aria-live="polite"
          aria-label={`Carregando ${pct}%`}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <Spores className="loader__spores" density={1.2} />

          <motion.div
            className="loader__logo"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ scale: 1.06, opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            style={{ ['--logo' as string]: `url(${img('brand/logo')})` }}
          >
            <span className="loader__mark loader__mark--base" />
            <motion.span
              className="loader__mark loader__mark--fill"
              animate={{ clipPath: `inset(${100 - pct}% 0% 0% 0%)` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </motion.div>

          <span className="loader__pct">{pct}%</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
