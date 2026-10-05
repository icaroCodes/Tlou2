import { useCallback, useEffect, useState } from 'react'
import { ScrollTrigger, useLenis } from './lib/scroll'
import { PerfContext, type PerfTier } from './lib/perf'
import { Loader } from './components/Loader'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Trailers } from './components/Trailers'
import { Characters } from './components/Characters'
import { JourneyScrub } from './components/JourneyScrub'
import { Cast } from './components/Cast'
import { Places } from './components/Places'
import { Editions } from './components/Editions'
import { SemVolta } from './components/SemVolta'
import { Guitar } from './components/Guitar'
import { Finale } from './components/Finale'
import { Extras } from './components/Extras'
import { Footer } from './components/Footer'

export default function App() {
  // a página só monta depois do teste de desempenho, assim cada seção já pega os assets do nível certo
  const [tier, setTier] = useState<PerfTier | null>(null)
  const [loading, setLoading] = useState(true)
  const [revealed, setRevealed] = useState(false)
  const reveal = useCallback(() => setRevealed(true), [])
  const lenis = useLenis()

  useEffect(() => {
    if (loading) lenis?.stop()
    else lenis?.start()
  }, [loading, lenis])

  useEffect(() => {
    // imagens lazy mudam a altura das seções e desalinham os gatilhos do ScrollTrigger
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    return () => window.removeEventListener('load', refresh)
  }, [])

  const onDone = useCallback(() => {
    setLoading(false)
    ScrollTrigger.refresh()
  }, [])

  return (
    <PerfContext.Provider value={tier ?? 'high'}>
      {loading && <Loader onDetected={setTier} onReveal={reveal} onDone={onDone} />}
      <Nav />
      {tier && (
        <>
          <main>
            <Hero intro={revealed} />
            <Trailers />
            <Characters />
            <JourneyScrub />
            <Cast />
            <Places />
            <Editions />
            <SemVolta />
            <Guitar />
            <Finale />
            <Extras />
          </main>
          <Footer />
        </>
      )}
    </PerfContext.Provider>
  )
}
