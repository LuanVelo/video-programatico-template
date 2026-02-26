# vmaker

Projeto base para edição de vídeo programática com [Remotion](https://www.remotion.dev/).

## Requisitos

- Node.js 20+
- npm 10+

## Setup

```bash
npm install
```

## Comandos

```bash
npm run dev         # abre o Remotion Studio e já abre no Google Chrome
npm run preview     # preview no navegador
npm run render      # renderiza output/intro.mp4 (concurrency=1)
npm run render:frames
npm run check       # validação TypeScript
```

## Browser usado no render

O projeto está configurado para usar o Chrome local em:

`/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`

## Estrutura

- `src/index.ts`: entrypoint do Remotion
- `src/Root.tsx`: registro das composições
- `src/compositions/IntroVideo.tsx`: composição inicial de exemplo
- `Assets/`: mídia de entrada (vídeos, imagens, áudio, etc.)
- `output/`: renders gerados

## Próximo passo

Quando você me passar a skill/workflow de Remotion que quer usar, eu já adapto essa base para pipeline (templating, cenas, trilha, legendas, render batch, etc.).
