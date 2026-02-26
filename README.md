# Video Programatico Template

Template de edição de vídeo programática com [Remotion](https://www.remotion.dev/), focado em montar narrativas com múltiplos blocos, transições, textos animados, imagens e trilha de áudio.

## O que é este projeto

Este projeto serve como base para:

- Compor vídeos em React/Remotion com timeline controlada por frames.
- Organizar cenas em blocos reutilizáveis.
- Fazer animações de texto (linha por linha, palavra por palavra).
- Sincronizar vídeo + overlays + transições de forma programática.
- Renderizar em `1920x1080` com pipeline simples de desenvolvimento e exportação.

## Stack

- Remotion 4
- React 19
- TypeScript
- Node.js + npm

## Composições atuais

- `IntroVideo`: composição principal (timeline ajustada para 15s exatos).
- `02SobreTecidos`: nova composição de 15s para evolução do projeto.

## Passos que fizemos no projeto

1. Inicializamos base Remotion e scripts de execução (`dev`, `preview`, `render`, `check`).
2. Organizamos mídia em `Assets/` e copiamos arquivos necessários para `public/`.
3. Construímos a composição principal com múltiplos blocos de vídeo e overlays.
4. Adicionamos áudio e textos animados (entrada/saída, linha a linha e palavra a palavra).
5. Aplicamos transições suaves entre blocos (fade de vídeo, texto e imagens).
6. Inserimos e tratamos imagens laterais (`antigo`/`novo`) com blend/filter e ajustes de posição/escala.
7. Ajustamos timings finos por frame conforme feedback (ex.: 13:11, 15:04, etc.).
8. Forçamos render em `1920x1080` e corrigimos diferenças de preview vs render.
9. Refatoramos a composição em blocos (`src/compositions/blocks`) para melhor manutenção.
10. Criamos a composição `02SobreTecidos` para expansão do fluxo.
11. Publicamos o projeto no GitHub em repositório novo.

## Estrutura de pastas

```txt
.
├─ Assets/                         # Mídias originais (vídeos, imagens, narração)
│  ├─ bloco1/
│  ├─ bloco2/
│  ├─ intro/
│  └─ narracao/
├─ public/                         # Assets servidos pelo Remotion (staticFile)
├─ src/
│  ├─ index.ts                     # registerRoot
│  ├─ Root.tsx                     # registro das composições
│  ├─ compositions/
│  │  ├─ IntroVideo.tsx            # orquestração da composição principal
│  │  ├─ Scene02.tsx               # composição "02SobreTecidos"
│  │  ├─ blocks/                   # blocos reutilizáveis da timeline
│  │  │  ├─ MediaLayersBlock.tsx
│  │  │  ├─ OpeningTextBlock.tsx
│  │  │  ├─ WelcomeBlock.tsx
│  │  │  ├─ SideImagesBlock.tsx
│  │  │  ├─ SignatureBlock.tsx
│  │  │  ├─ MinimalistBlock.tsx
│  │  │  └─ LifestyleBlock.tsx
│  │  └─ motion-titles/            # utilitários/template para motion titles
│  └─ utils/
├─ output/                         # renders finais (.mp4)
├─ remotion.config.ts
├─ package.json
└─ tsconfig.json
```

## Como rodar

```bash
npm install
npm run preview
```

Comandos úteis:

```bash
npm run dev         # abre Studio (script local)
npm run preview     # preview no navegador
npm run render      # render da composição IntroVideo
npm run check       # validação TypeScript
```

## Publicação no GitHub

Repositório criado:

- https://github.com/LuanVelo/video-programatico-template
