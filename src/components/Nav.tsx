import { useCallback, useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useScrollTo } from '../lib/scroll'
import { IIMark } from './BrandIcons'
import { Menu } from './Menu'

export function Nav() {
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const scrollTo = useScrollTo()
  const close = useCallback(() => setOpen(false), [])

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(y > prev && y > 300)
  })

  return (
    <>
      <motion.header
        className="nav"
        animate={{ y: hidden ? '-120%' : '0%' }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <button className="nav__brand" onClick={() => scrollTo('inicio')} aria-label="Voltar ao início">
          <IIMark className="nav__mark" />
          <span className="nav__name">
            The Last of Us <b>Part II</b>
          </span>
        </button>
        <button className="nav__burger" onClick={() => setOpen(true)} aria-label="Abrir menu de navegação" aria-expanded={open}>
          <i />
          <i />
        </button>
      </motion.header>

      <Menu open={open} onClose={close} onNavigate={scrollTo} />
    </>
  )
}
