# Assets Motion titles

Pasta dedicada para organizar os insumos do template `MotionTitlesTemplate`.

## Estrutura sugerida

- `backgrounds/`: videos de fundo por bloco (mp4, mov)
- `narrations/`: audios de narracao (wav, mp3)
- `references/`: referencias visuais e roteiro
- `timings/`: presets de duracao para encaixe por locucao

## Como ajustar tempo por narracao

No `src/Root.tsx`, composicao `MotionTitlesTemplate`:

- `narrationDurationsInSeconds`: define duracao de cada bloco em segundos.
- `segments[].durationInFrames`: fallback manual quando nao houver duracao em segundos.

Sempre que houver troca de bloco, a transicao P&B e aplicada automaticamente (`transitionFrames`).
