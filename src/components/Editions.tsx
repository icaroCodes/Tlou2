import { useRef, useState, type PointerEvent } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { EDITIONS, NOVIDADES, STORE_URL, type Format } from '../lib/content'
import { img, responsive } from '../lib/assets'

const FORMATS: { id: Format; label: string }[] = [
  { id: 'digital', label: 'Digital' },
  { id: 'fisica', label: 'Mídia física' },
]

function EditionCard({ e, format }: { e: (typeof EDITIONS)[number]; format: Format }) {
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rotateY = useSpring(useTransform(mx, [0, 1], [-9, 9]), { stiffness: 160, damping: 18 })
  const rotateX = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 160, damping: 18 })
  const collector = e.id === 'wlf'
  const unavailable = collector && format === 'digital'

  const onMove = (ev: PointerEvent<HTMLDivElement>) => {
    const r = ev.currentTarget.getBoundingClientRect()
    mx.set((ev.clientX - r.left) / r.width)
    my.set((ev.clientY - r.top) / r.height)
  }
  const reset = () => {
    mx.set(0.5)
    my.set(0.5)
  }

  return (
    <article className={`edition ${collector ? 'edition--collector' : ''}`}>
      <motion.div className="edition__cover" style={{ rotateX, rotateY }} onPointerMove={onMove} onPointerLeave={reset}>
        <img src={e.cover} alt={`Capa da ${e.name}`} loading="lazy" />
        {collector && <img className="edition__logo" src={img('brand/logo')} alt="" loading="lazy" />}
      </motion.div>
      <div className="edition__body">
        <h3 className="display edition__name">{e.name}</h3>
        <p className="edition__price">
          {e.price} <small>{e.note}</small>
        </p>
        <ul className="edition__items">
          {e.items.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ul>
        {unavailable ? (
          <span className="btn btn--ghost btn--block is-disabled" aria-disabled="true">
            Exclusiva em mídia física
          </span>
        ) : (
          <a className={`btn ${collector ? 'btn--primary' : 'btn--light'} btn--block`} href={STORE_URL} target="_blank" rel="noreferrer">
            {format === 'digital' ? 'Comprar na PS Store' : 'Reservar mídia física'}
          </a>
        )}
      </div>
    </article>
  )
}

function NewsCarousel() {
  const bounds = useRef<HTMLDivElement>(null)
  return (
    <div className="ucar">
      <div className="ucar__head">
        <h3 className="display ucar__title">O que mudou no PS5</h3>
        <p className="lead">Arraste para o lado.</p>
      </div>
      <div className="ucar__viewport" ref={bounds}>
        <motion.ul className="ucar__track" drag="x" dragConstraints={bounds} dragElastic={0.08} whileTap={{ cursor: 'grabbing' }}>
          {NOVIDADES.map((it) => (
            <li key={it.id} className="ucar__item">
              <img {...responsive(img(`novidades/${it.id}`), '380px')} alt="" loading="lazy" draggable={false} />
              <span>{it.name}</span>
            </li>
          ))}
        </motion.ul>
      </div>
    </div>
  )
}

export function Editions() {
  const [format, setFormat] = useState<Format>('digital')

  return (
    <section id="edicoes" className="editions">
      <div className="editions__banner" aria-hidden>
        <img {...responsive(img('editions/banner'))} alt="" loading="lazy" />
      </div>
      <div className="container">
        <header className="section-head section-head--center">
          <h2 className="display">Pré-venda</h2>
          <div className="toggle" role="tablist" aria-label="Formato">
            {FORMATS.map((f) => (
              <button key={f.id} role="tab" aria-selected={format === f.id} onClick={() => setFormat(f.id)}>
                {format === f.id && (
                  <motion.span layoutId="format-pill" className="toggle__pill" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                )}
                <span className="toggle__label">{f.label}</span>
              </button>
            ))}
          </div>
        </header>

        <div className="editions__grid">
          {EDITIONS.map((e) => (
            <EditionCard key={e.id} e={e} format={format} />
          ))}
        </div>
        <p className="editions__note">
          Preços e itens inventados para esta landing. Quem já tem o jogo no PS4 faz o upgrade por R$ 50 na{' '}
          <a href={STORE_URL} target="_blank" rel="noreferrer">
            PlayStation Store
          </a>
          .
        </p>

        <NewsCarousel />
      </div>
    </section>
  )
}
