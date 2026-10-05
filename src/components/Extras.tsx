import { img, responsive } from '../lib/assets'
import { NEWS } from '../lib/content'

const FEATURES = [
  {
    kicker: 'Trilha sonora',
    title: 'Gustavo Santaolalla e Mac Quayle',
    body: 'O violão do Santaolalla nos momentos quietos, a eletrônica do Mac Quayle quando a coisa aperta.',
    image: img('extras/soundtrack'),
    cta: 'Ouvir no Spotify',
    href: 'https://open.spotify.com/search/The%20Last%20of%20Us%20Part%20II%20Santaolalla',
  },
  {
    kicker: 'HBO',
    title: 'The Last of Us, 2ª temporada',
    body: 'A série adaptou a história de Ellie e Abby, com Bella Ramsey, Pedro Pascal e Kaitlyn Dever.',
    image: img('extras/hbo'),
    cta: 'Ver na HBO',
    href: 'https://www.hbo.com/the-last-of-us',
  },
]

export function Extras() {
  return (
    <section id="extras" className="extras container" aria-label="Mais de The Last of Us Part II">
      <div className="extras__features">
        {FEATURES.map((f) => (
          <a key={f.title} className="feature" href={f.href} target="_blank" rel="noreferrer">
            <img {...responsive(f.image, '(max-width: 960px) 100vw, 50vw')} alt="" loading="lazy" />
            <span className="feature__shade" />
            <span className="feature__copy">
              <span className="feature__kicker">{f.kicker}</span>
              <span className="display feature__title">{f.title}</span>
              <span className="feature__body">{f.body}</span>
              <span className="link-arrow">{f.cta}</span>
            </span>
          </a>
        ))}
      </div>

      <header className="section-head section-head--row">
        <h2 className="display">Vídeos</h2>
        <a className="link-arrow" href="https://www.youtube.com/@PlayStationBrasil" target="_blank" rel="noreferrer">
          Canal da PlayStation Brasil
        </a>
      </header>
      <div className="news">
        {NEWS.map((n) => (
          <a key={n.href} className="news__card" href={n.href} target="_blank" rel="noreferrer">
            <span className="news__img">
              <img src={n.image} alt="" loading="lazy" />
            </span>
            <span className="news__title">{n.title}</span>
            <span className="news__date">{n.date}</span>
          </a>
        ))}
      </div>
    </section>
  )
}
