import { useState } from 'react'
import { motion } from 'framer-motion'
import { PLACES } from '../lib/content'
import { img, responsive } from '../lib/assets'

export function Places() {
  const [open, setOpen] = useState(0)

  return (
    <section id="locais" className="places container" aria-label="Locais">
      <header className="section-head section-head--row">
        <h2 className="display">Do Wyoming à Califórnia</h2>
        <p className="lead">Os lugares por onde a história passa.</p>
      </header>

      <div className="places__row">
        {PLACES.map((p, i) => (
          <motion.button
            key={p.id}
            layout
            className={`place ${open === i ? 'is-open' : ''}`}
            onPointerEnter={() => setOpen(i)}
            onFocus={() => setOpen(i)}
            onClick={() => setOpen(i)}
            style={{ flex: open === i ? 5 : 1 }}
            transition={{ layout: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }}
            aria-expanded={open === i}
          >
            <motion.img layout {...responsive(img(`places/${p.id}`), '(max-width: 960px) 100vw, 60vw')} alt="" loading="lazy" />
            <span className="place__shade" />
            <motion.span layout="position" className="place__name">
              {p.name}
            </motion.span>
            <motion.span
              className="place__blurb"
              animate={{ opacity: open === i ? 1 : 0, y: open === i ? 0 : 20 }}
              transition={{ duration: 0.5, delay: open === i ? 0.25 : 0 }}
            >
              {p.blurb}
            </motion.span>
          </motion.button>
        ))}
      </div>
    </section>
  )
}
