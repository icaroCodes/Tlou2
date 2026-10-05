import { img } from '../lib/assets'

const SOCIAL = [
  ['X', 'https://x.com/Naughty_Dog'],
  ['Instagram', 'https://www.instagram.com/playstation'],
  ['YouTube', 'https://www.youtube.com/@PlayStationBrasil'],
  ['TikTok', 'https://www.tiktok.com/@playstation'],
  ['Naughty Dog', 'https://www.naughtydog.com'],
  ['PlayStation', 'https://www.playstation.com/pt-br/'],
]

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <img className="footer__logo" src={img('brand/logo')} alt="The Last of Us Part II Remastered" loading="lazy" />
        <ul className="footer__social">
          {SOCIAL.map(([label, href]) => (
            <li key={label}>
              <a href={href} target="_blank" rel="noreferrer">
                {label}
              </a>
            </li>
          ))}
        </ul>
        <p className="footer__rating">
          <span className="footer__age">18</span> Não recomendado para menores de 18 anos. Violência extrema, drogas, nudez e
          linguagem imprópria.
        </p>
        <p className="footer__legal">
          Projeto pessoal de{' '}
          <a href="https://github.com/IcaroCodes" target="_blank" rel="noreferrer">
            IcaroCodes
          </a>
          , sem ligação com a Sony ou a Naughty Dog. Data, preços e edições são de mentira. Artes, trailers e marcas pertencem
          aos donos. O jogo de verdade está em{' '}
          <a href="https://www.playstation.com/pt-br/games/the-last-of-us-part-ii-remastered/" target="_blank" rel="noreferrer">
            playstation.com
          </a>
          .
        </p>
      </div>
    </footer>
  )
}
