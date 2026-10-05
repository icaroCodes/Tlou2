import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import type { Trailer } from '../lib/content'
import { useLenis } from '../lib/scroll'

export function VideoModal({ trailer, onClose }: { trailer: Trailer | null; onClose: () => void }) {
  const lenis = useLenis()

  useEffect(() => {
    if (!trailer) return
    lenis?.stop()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      lenis?.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [trailer, lenis, onClose])

  // portal: o .trailers tem isolation: isolate e prenderia o z-index do modal abaixo das seções seguintes
  return createPortal(
    <AnimatePresence>
      {trailer && (
        <motion.div
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-label={trailer.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal__panel"
            initial={{ scale: 0.88, y: 40, clipPath: 'inset(12% 8% 12% 8% round 6px)' }}
            animate={{ scale: 1, y: 0, clipPath: 'inset(0% 0% 0% 0% round 6px)' }}
            exit={{ scale: 0.92, y: 30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal__video">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${trailer.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={trailer.title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            </div>
            <div className="modal__bar">
              <div>
                <p className="modal__sub">{trailer.subtitle}</p>
                <p className="modal__title">{trailer.title}</p>
              </div>
              <div className="modal__actions">
                <a
                  className="btn btn--ghost btn--sm"
                  href={`https://www.youtube.com/watch?v=${trailer.youtubeId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Abrir no YouTube
                </a>
                <button className="btn btn--primary btn--sm" onClick={onClose} aria-label="Fechar vídeo">
                  Fechar
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
