# The Last of Us Part II Remastered (landing conceitual)

Landing page de mentira para o lançamento do remaster no PS5, feita no mesmo esquema da landing de GTA VI:
React, TypeScript, Vite, GSAP com ScrollTrigger, Framer Motion e Lenis. Não tem ligação com a Sony nem com a
Naughty Dog. Data, preços e edições foram inventados.

```bash
npm install
npm run dev
```

## O que tem de diferente

O hero usa a key art oficial cortada em pedaços por um gerador de rachaduras (`crackShards` em `src/lib/assets.ts`).
Quando a capa quebra, as duas barras do "II" de "PART II" viram uma máscara SVG e a câmera entra por ela até os frames
do trailer de lançamento. As coordenadas do "II" foram medidas no canal alfa do PNG do logo.

A seção Guitarra Livre toca de verdade. O som sai de um Karplus-Strong simples em `src/lib/guitar.ts`, sem arquivo
de áudio.

Fora isso a estrutura segue a do GTA: vídeo controlado pelo scroll, elenco em scroll horizontal, frames do logo no
final e o teste de desempenho no loading. `?perf=low`, `medium` ou `high` na URL força um modo.

## Assets

O que está em `public/` já vem pronto. Para gerar tudo de novo:

```bash
npm run assets
```

Isso baixa as artes da Steam e da PlayStation.com, os trailers (Steam via HLS, YouTube via
[yt-dlp](https://github.com/yt-dlp/yt-dlp), que precisa estar instalado), extrai frames, clipes e quadros com ffmpeg
e converte tudo para WebP. Os tempos de cada trecho estão em `scripts/extract-media.mjs`.
