// Mapa: nome amigável (public/img/<nome>.webp) -> [arquivo em assets-src/tlou, largura máxima, opções]
// Originais: scripts/fetch-assets.mjs (Steam/PlayStation) e still-* de scripts/extract-media.mjs (trailers).
// opções: trim = recorta a margem transparente; crop = 'w:h:x:y' aplicado antes de redimensionar
export const assetMap = {
  // ── Hero: key art oficial composta para o palco (desktop 2560x1440, mobile 1200x1672) ──
  'hero/cover': ['ps-keyart-wide.jpg', 2560, { crop: '3049:1715:791:0' }],
  'hero-m/cover': ['ps-keyart-mobile.jpg', 1200, { crop: '1200:1672:264:0' }],

  // ── Marca ──
  'brand/logo': ['steam-logo.png', 1280, { trim: true }],
  'brand/keyart': ['steam-hero.jpg', 2400],
  'brand/capsule': ['steam-capsule.jpg', 600],
  'brand/city': ['steam-bg.jpg', 1438],
  'brand/no-return': ['ps-noreturn-logo.jpg', 600],

  // ── Trailers ──
  'trailers/launch': ['still-horses-vista.jpg', 2400],
  'trailers/announce': ['still-ellie-hospital.jpg', 1280],
  'trailers/no-return': ['still-lev-bow.jpg', 1280],
  'trailers/features': ['ps-joel-guitar.jpg', 1280],

  // ── Ellie & Abby ──
  'ellie/1': ['ss03.jpg', 1920],
  'ellie/2': ['ps-horse-seattle.jpg', 1920],
  'ellie/3': ['still-ellie-face.jpg', 1600],
  'ellie/4': ['ps-dina-ellie.jpg', 1600],
  'abby/1': ['ss01.jpg', 1920],
  'abby/2': ['ps-abby-alley.jpg', 1920],
  'abby/3': ['still-abby-face.jpg', 1600],
  'abby/4': ['still-abby-fight.jpg', 1600],

  // ── Elenco (fundo + foto) ──
  'cast/joel-bg': ['ss12.jpg', 1920],
  'cast/joel': ['ps-joel-guitar.jpg', 1280],
  'cast/dina-bg': ['ps-dina-ellie.jpg', 1920],
  'cast/dina': ['still-dina.jpg', 1280],
  'cast/jesse-bg': ['ss11.jpg', 1920],
  'cast/jesse': ['still-jesse.jpg', 1280],
  'cast/owen-bg': ['still-abby-owen.jpg', 1920],
  'cast/owen': ['still-owen.jpg', 1280],
  'cast/lev-bg': ['still-lev-bow.jpg', 1920],
  'cast/lev': ['still-yara-lev.jpg', 1280],
  'cast/serafitas-bg': ['ss13.jpg', 1920],
  'cast/serafitas': ['still-island-fire.jpg', 1280],
  'cast/wlf-bg': ['ss05.jpg', 1920],
  'cast/wlf': ['ss04.jpg', 1280],

  // ── Locais ──
  'places/jackson': ['ps-jackson-snow.jpg', 1600],
  'places/seattle': ['ss10.jpg', 1600, { crop: '1920:808:0:136' }], // o original tem barras pretas
  'places/centro': ['ps-seattle.jpg', 1600],
  'places/hillcrest': ['still-hillcrest.jpg', 1600],
  'places/ilha': ['ss09.jpg', 1600],
  'places/santa-barbara': ['still-santa-barbara.jpg', 1600],

  // ── Edições ──
  'editions/standard': ['steam-capsule.jpg', 900],
  'editions/wlf': ['ss05.jpg', 1080, { crop: '864:1080:640:0' }],
  'editions/banner': ['steam-hero.jpg', 2400],
  'novidades/sem-volta': ['still-nr-snow.jpg', 1280],
  'novidades/niveis-perdidos': ['ss04.jpg', 1280],
  'novidades/guitarra': ['still-ellie-guitar.jpg', 1280],
  'novidades/comentarios': ['ss02.jpg', 1280],
  'novidades/trajes': ['still-abby-water.jpg', 1280],
  'novidades/speedrun': ['still-hillcrest.jpg', 1280],
  'novidades/fidelidade': ['ss10.jpg', 1280, { crop: '1920:808:0:136' }],
  'novidades/dualsense': ['still-abby-infected.jpg', 1280],
  'novidades/audio-3d': ['ps-rat-king.jpg', 1280],
  'novidades/bastidores': ['still-joel-close.jpg', 1280],
  'novidades/seattle': ['still-seattle-overgrown.jpg', 1280],

  // ── Modo Sem Volta ──
  'sem-volta/bg': ['ps-noreturn-hunted.jpg', 1920],
  'sem-volta/board': ['still-board-hunted.jpg', 1280],
  'sem-volta/rat-king': ['still-rat-king.jpg', 1280],
  'sem-volta/forest': ['still-nr-forest.jpg', 1280],
  'sem-volta/bloater': ['still-nr-bloater.jpg', 1280],
  'sem-volta/shambler': ['still-nr-shambler.jpg', 1280],
  'sem-volta/crossbow': ['still-nr-crossbow.jpg', 1280],

  // ── Guitarra livre ──
  'guitar/joel': ['ps-joel-guitar.jpg', 1920],
  'guitar/ellie': ['still-ellie-guitar.jpg', 1600],

  // ── Extras ──
  'extras/soundtrack': ['ss00.jpg', 1920],
  'extras/hbo': ['ps-hbo.jpg', 1920],
  'news/launch': ['yt-launch.jpg', 960],
  'news/no-return': ['yt-no-return.jpg', 960],
  'news/features': ['yt-features.jpg', 960],
}
