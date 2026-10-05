import { img } from './assets'

// data fictícia: a landing finge que o remaster ainda não saiu
export const RELEASE_DATE = new Date('2027-02-19T00:00:00')

export const STORE_URL = 'https://www.playstation.com/pt-br/games/the-last-of-us-part-ii-remastered/'

export const STORY = {
  title: 'Jackson, Wyoming.',
  body:
    'Cinco anos depois de atravessar o país, Ellie e Joel vivem em Jackson. Há patrulhas, festas no celeiro e até uma ' +
    'certa rotina. Até o dia em que três desconhecidos aparecem na neve e Ellie decide ir atrás deles, em Seattle.',
}

export type Trailer = {
  id: string
  title: string
  subtitle: string
  duration: string
  youtubeId: string
  image: string
}

export const TRAILERS: Trailer[] = [
  {
    id: 'lancamento',
    title: 'Trailer de Lançamento',
    subtitle: 'The Last of Us Part II Remastered',
    duration: '1:43',
    youtubeId: 'cMj9mzTgYRQ',
    image: img('trailers/launch'),
  },
  {
    id: 'anuncio',
    title: 'Trailer de Anúncio',
    subtitle: 'Remasterizado para o PS5',
    duration: '1:49',
    youtubeId: 'DRf0IGOrf34',
    image: img('trailers/announce'),
  },
  {
    id: 'sem-volta',
    title: 'Modo Sem Volta',
    subtitle: 'Roguelike de sobrevivência',
    duration: '1:35',
    youtubeId: 'O5xlXOKgJDA',
    image: img('trailers/no-return'),
  },
  {
    id: 'recursos',
    title: 'Novos Recursos',
    subtitle: 'Com o diretor Matthew Gallant',
    duration: '3:16',
    youtubeId: 'b-UzhXDMmEs',
    image: img('trailers/features'),
  },
]

export type Protagonist = {
  id: 'ellie' | 'abby'
  name: [string, string]
  role: string
  tagline: string
  bio: string[]
  quote: string
  journal: string
  clip: string
  images: string[]
  accent: string
}

export const PROTAGONISTS: Protagonist[] = [
  {
    id: 'ellie',
    name: ['Ellie', 'Williams'],
    role: 'Jackson, Wyoming',
    tagline: 'Dezenove anos, imune e com um violão que era do Joel.',
    bio: [
      'Em Jackson, Ellie faz patrulha a cavalo, desenha no diário e passa mais tempo do que admite com a Dina.',
      'Quando a violência chega até a cidade, ela pega a estrada para Seattle. Ninguém consegue convencê-la a ficar.',
    ],
    quote: 'Cada um deles.',
    journal: 'Seattle, dia 1. Prometi pra mim mesma que não ia parar.',
    clip: 'ellie',
    images: [img('ellie/1'), img('ellie/2'), img('ellie/3'), img('ellie/4')],
    accent: '#e8b46a',
  },
  {
    id: 'abby',
    name: ['Abby', 'Anderson'],
    role: 'Seattle, Washington',
    tagline: 'Soldada da WLF. A outra metade da história.',
    bio: [
      'O pai dela era cirurgião dos Vagalumes. Depois do hospital, Abby passou anos treinando e encontrou na Frente de Libertação de Washington um lugar para ficar.',
      'Em Seattle a WLF está em guerra com os Serafitas, e Abby começa a duvidar de quase tudo.',
    ],
    quote: 'Ninguém sai inteiro desta cidade.',
    journal: 'Os pesadelos voltaram. Talvez nunca tenham ido embora.',
    clip: 'abby',
    images: [img('abby/1'), img('abby/2'), img('abby/3'), img('abby/4')],
    accent: '#e2532e',
  },
]

export type CastMember = {
  id: string
  name: string
  tagline: string
  bio: string
  quote: string
  place: string
  color: string
}

export const CAST: CastMember[] = [
  {
    id: 'joel',
    name: 'Joel Miller',
    tagline: 'Salvou a Ellie no hospital. Nunca contou a verdade.',
    bio: 'Vinte anos de fim do mundo deixaram Joel duro, mas Jackson amoleceu um pouco o homem. Ele toca violão na varanda e conserta o que dá.',
    quote: 'Se o Senhor me desse uma segunda chance, eu faria tudo de novo.',
    place: 'Jackson',
    color: '#e8b46a',
  },
  {
    id: 'dina',
    name: 'Dina',
    tagline: 'Vai junto para Seattle, mesmo sabendo que não devia.',
    bio: 'Melhor amiga da Ellie e parceira de patrulha. Fala demais quando está nervosa e é a primeira a puxar o gatilho quando precisa.',
    quote: 'Eu vou com você. Não é uma pergunta.',
    place: 'Seattle',
    color: '#c9a7ff',
  },
  {
    id: 'jesse',
    name: 'Jesse',
    tagline: 'Quem segura Jackson nos dias ruins.',
    bio: 'Jesse cuida das patrulhas e resolve os problemas que ninguém quer. Quando Ellie e Dina somem rumo ao oeste, ele vai atrás.',
    quote: 'A gente resolve isso junto.',
    place: 'Seattle',
    color: '#8fc7c2',
  },
  {
    id: 'owen',
    name: 'Owen Moore',
    tagline: 'Cansou da guerra antes de todo mundo.',
    bio: 'Veterano da WLF e ex-namorado da Abby. Owen fala de um barco e de uma ilha na Califórnia como quem fala de um sonho.',
    quote: 'Tem que existir algo além disso.',
    place: 'Aquário',
    color: '#9fb88c',
  },
  {
    id: 'lev',
    name: 'Lev & Yara',
    tagline: 'Fugiram da própria seita.',
    bio: 'Dois irmãos serafitas que agora são caçados pelos dois lados da guerra. Lev é bom com o arco. Yara não sabe desistir.',
    quote: 'Não somos mais um deles.',
    place: 'Ilha dos Serafitas',
    color: '#ff9a6b',
  },
  {
    id: 'serafitas',
    name: 'Os Serafitas',
    tagline: 'Se você ouviu o assobio, já estão perto.',
    bio: 'Uma seita que rejeita a tecnologia do velho mundo e vive numa ilha perto de Seattle. Eles se comunicam por assobios entre as árvores.',
    quote: 'Que a Profeta nos guie.',
    place: 'Seattle',
    color: '#d9482b',
  },
  {
    id: 'wlf',
    name: 'W.L.F.',
    tagline: 'Frente de Libertação de Washington.',
    bio: 'A milícia que expulsou a FEDRA de Seattle. Usa cães farejadores e transformou um estádio em quartel.',
    quote: 'Seattle é nossa.',
    place: 'Estádio da WLF',
    color: '#c6d0d4',
  },
]

// mesma ordem dos trechos de video/jornada.mp4
export const JOURNEY = [
  { id: 'jackson', name: 'Jackson', blurb: 'Neve até o joelho e uma cidade que voltou a ter festa de inverno.' },
  { id: 'seattle', name: 'Seattle, centro', blurb: 'Prédios cobertos de mato e água por todo lado.' },
  { id: 'hillcrest', name: 'Hillcrest', blurb: 'Bairro residencial abandonado. A WLF patrulha de caminhonete.' },
  { id: 'ilha', name: 'Ilha dos Serafitas', blurb: 'A vila da seita, pegando fogo.' },
]

export const PLACES = [
  { id: 'jackson', name: 'Jackson', blurb: 'Montanhas, trilhas de patrulha e o celeiro onde todo mundo dança.' },
  { id: 'seattle', name: 'Seattle', blurb: 'Uma cidade grande e quieta, tomada pela chuva e pelo verde.' },
  { id: 'centro', name: 'Capitol Hill', blurb: 'Uma sinagoga, uma loja de música e muitos infectados.' },
  { id: 'hillcrest', name: 'Hillcrest', blurb: 'Casas vazias e tiro vindo de onde você não espera.' },
  { id: 'ilha', name: 'Ilha dos Serafitas', blurb: 'Pontes de madeira e barcos de pesca na névoa.' },
  { id: 'santa-barbara', name: 'Santa Bárbara', blurb: 'Sol forte, poeira e o fim da estrada.' },
]

export type Format = 'digital' | 'fisica'

export const EDITIONS = [
  {
    id: 'standard',
    name: 'Edição Padrão',
    price: 'R$ 249,90',
    cover: img('editions/standard'),
    items: [
      'The Last of Us Part II Remastered',
      'Modo Sem Volta',
      'Níveis perdidos com comentários dos desenvolvedores',
      'Guitarra Livre e trajes novos',
      'Quem tem a versão de PS4 paga R$ 50 pelo upgrade',
    ],
    note: 'PlayStation Store Brasil',
  },
  {
    id: 'wlf',
    name: 'Edição W.L.F.',
    price: 'R$ 1.099,90',
    cover: img('editions/wlf'),
    items: [
      'Tudo da Edição Padrão',
      'Jaqueta bomber da WLF',
      'Steelbook',
      'Patches bordados da WLF e dos Serafitas',
      'Seis cartões de arte e um pin de metal',
    ],
    note: 'Só em mídia física, tiragem limitada',
  },
] as const

export const NOVIDADES = [
  { id: 'sem-volta', name: 'Modo Sem Volta' },
  { id: 'niveis-perdidos', name: 'Níveis perdidos' },
  { id: 'guitarra', name: 'Guitarra Livre' },
  { id: 'comentarios', name: 'Comentários dos criadores' },
  { id: 'trajes', name: 'Trajes novos' },
  { id: 'speedrun', name: 'Modo speedrun' },
  { id: 'fidelidade', name: '4K nativo no modo fidelidade' },
  { id: 'dualsense', name: 'Gatilhos adaptáveis' },
  { id: 'audio-3d', name: 'Áudio 3D' },
  { id: 'bastidores', name: 'Galeria de bastidores' },
  { id: 'seattle', name: 'Carregamento quase instantâneo' },
]

export const NEWS = [
  {
    title: 'Trailer de lançamento de The Last of Us Part II Remastered',
    date: 'Trailer, 1:43',
    image: img('news/launch'),
    href: 'https://www.youtube.com/watch?v=cMj9mzTgYRQ',
  },
  {
    title: 'Sem Volta, o modo roguelike, em ação',
    date: 'Gameplay, 1:35',
    image: img('news/no-return'),
    href: 'https://www.youtube.com/watch?v=O5xlXOKgJDA',
  },
  {
    title: 'Matthew Gallant mostra o que mudou no PS5',
    date: 'Bastidores, 3:16',
    image: img('news/features'),
    href: 'https://www.youtube.com/watch?v=b-UzhXDMmEs',
  },
]
