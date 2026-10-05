# The Last of Us Part II Remastered — Landing Page Conceitual

Landing page conceitual inspirada no lançamento de **The Last of Us Part II Remastered** para PS5, desenvolvida como projeto de estudo e portfólio.

Construída com **React, TypeScript, Vite, GSAP + ScrollTrigger, Framer Motion e Lenis**, seguindo uma abordagem semelhante à landing page conceitual de GTA VI.

> **Aviso:** este é um projeto fan-made e não oficial. Não possui qualquer vínculo, afiliação ou endosso da Sony Interactive Entertainment, PlayStation ou Naughty Dog. As informações de lançamento, preços e edições apresentadas na página são fictícias.

```bash
npm install
npm run dev
```

## O que tem de diferente

O hero utiliza a key art oficial fragmentada em diferentes partes por meio de um gerador de rachaduras (`crackShards` em `src/lib/assets.ts`).

Quando a capa se rompe, as duas barras do **"II"** de _PART II_ são utilizadas como uma máscara SVG, criando uma transição de câmera que conduz aos frames do trailer de lançamento. As coordenadas do logotipo foram obtidas a partir da análise do canal alfa do PNG.

A seção **Guitarra Livre** possui áudio gerado em tempo real. O som é produzido por uma implementação simples de **Karplus-Strong** em `src/lib/guitar.ts`, sem depender de arquivos de áudio pré-gravados.

A página também utiliza:

- vídeo controlado pelo scroll;
- elenco em scroll horizontal;
- animações e transições sincronizadas;
- frames do logotipo na seção final;
- detecção de desempenho durante o carregamento.

O modo de desempenho pode ser controlado manualmente pela URL:

```text
?perf=low
?perf=medium
?perf=high
```

## Assets

Os arquivos necessários para executar o projeto já estão disponíveis em `public/`.

Para regenerar os assets:

```bash
npm run assets
```

O script automatiza o processo de obtenção e processamento das mídias, incluindo artes, trailers, frames e clipes, utilizando fontes como Steam e PlayStation.com.

Os trailers podem ser obtidos via HLS ou YouTube utilizando [`yt-dlp`](https://github.com/yt-dlp/yt-dlp), que precisa estar instalado no ambiente.

O processamento de vídeo é realizado com **FFmpeg**, incluindo extração de frames, cortes e conversão para WebP.

Os tempos utilizados para cada trecho de mídia estão definidos em:

```text
scripts/extract-media.mjs
```
