import React from 'react';
import {Audio, Video} from '@remotion/media';
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {MotionTitlesTemplateProps, TranscriptSegment} from './types';

const getFontSize = (width: number, height: number, variant: 'default' | 'apple') => {
  const factor = Math.min(width / 1920, height / 1080);
  return Math.round((variant === 'apple' ? 88 : 92) * factor);
};

const toStrictlyIncreasing = (values: number[]) => {
  if (values.length <= 1) {
    return values;
  }

  const normalized = [values[0]];
  for (let i = 1; i < values.length; i += 1) {
    normalized.push(Math.max(values[i], normalized[i - 1] + 0.0001));
  }
  return normalized;
};

const splitWithSpaces = (value: string) => value.split(/(\s+)/).filter((token) => token.length > 0);

const extractReservaToken = (token: string) => {
  const match = token.match(/^(.*?)(reserva)([^\p{L}\p{N}]*)$/iu);
  if (!match) {
    return null;
  }

  return {
    prefix: match[1] ?? '',
    suffix: match[3] ?? '',
  };
};

const getWelcomeParts = (text: string) => {
  const match = text.match(/^(.*?)(reserva)(.*)$/iu);
  if (!match) {
    return null;
  }

  return {
    before: (match[1] ?? '').trim(),
    after: (match[3] ?? '').trim(),
  };
};

const isWelcomeSegmentText = (text: string) => /bem-vind/i.test(text) && /reserva/i.test(text);

const isSignatureAreaText = (text: string) =>
  /diminu[ií]mos nossa assinatura|novo pica-pau [ée] minimalista/i.test(text);

const isMinimalistLineText = (text: string) => /novo pica-pau [ée] minimalista/i.test(text);
const isDiminuimosLineText = (text: string) => /diminu[ií]mos nossa assinatura/i.test(text);
const isFinalPersonalityLineText = (text: string) =>
  /para que a sua personalidade apare[çc]a primeiro que a marca/i.test(text);
const isNeoLineText = (text: string) => /isso aqui [ée] o(?:\s+nosso)?\s+neo line/i.test(text);
const isPerformanceLineText = (text: string) => /visual nobre,\s*com performance/i.test(text);
const isNoAmassaLineText = (text: string) => /n[aã]o amassa,\s*estica e\s*volta para o lugar/i.test(text);
const isMalhaEvoluiuLineText = (text: string) => /e a nossa malha,\s*mais amada,\s*tamb[ée]m evoluiu/i.test(text);
const isPimaTechLineText = (text: string) => /viemos com o pima tech/i.test(text);
const isUnindoPimaLineText = (text: string) => /unindo o toque[\s\n]*insuper[aá]vel do pima/i.test(text);
const isRespiraLineText = (text: string) => /mas com tecnologia que respira/i.test(text);
const isLastSequenceText = (text: string) => /as novas modelagens trazem um ajuste perfeito para cada corpo/i.test(text);
const isCamisetasCalcasLineText = (text: string) => /de camisetas [àa]s cal[çc]as/i.test(text);
const isRepensamosBackgroundText = (text: string) =>
  /repensamos cada base|de camisetas [àa]s cal[çc]as/i.test(text);
const isThreeColumnBackgroundText = (text: string) =>
  isPerformanceLineText(text) || isNoAmassaLineText(text);
const removeTrailingPeriod = (text: string) => text.replace(/\.\s*$/u, '').trimEnd();
const normalizeWordToken = (token: string) =>
  token
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}]/gu, '')
    .toLowerCase();

const Caption: React.FC<{
  segment: TranscriptSegment;
  segmentIndex: number;
  localFrame: number;
  durationInFrames: number;
  variant: 'default' | 'apple';
  textColor: string;
  logoSrc?: string;
}> = ({segment, segmentIndex, localFrame, durationInFrames, variant, textColor, logoSrc}) => {
  const {width, height, fps} = useVideoConfig();
  const fontSize = getFontSize(width, height, variant);
  const displayText = removeTrailingPeriod(segment.text);
  const isNeoLine = isNeoLineText(displayText);
  const tokens = splitWithSpaces(displayText);
  const revealWindow = isNeoLine ? Math.max(1, Math.min(durationInFrames, Math.round(fps))) : Math.max(1, durationInFrames - 8);
  const nonSpaceTokens = tokens.filter((token) => !/^\s+$/.test(token)).length;
  const staggerFrames = nonSpaceTokens > 0 ? Math.max(1, Math.floor(revealWindow / (nonSpaceTokens + 2))) : 1;
  const blurOutStart = Math.max(0, durationInFrames - Math.max(10, Math.round(0.25 * fps)));
  const isWelcomeSegment = isWelcomeSegmentText(segment.text);
  const isSignatureArea = isSignatureAreaText(segment.text);
  const isDiminuimosLine = isDiminuimosLineText(segment.text);
  const isMinimalistLine = isMinimalistLineText(segment.text);
  const isFinalPersonalityLine = isFinalPersonalityLineText(segment.text);
  const isMalhaEvoluiuLine = isMalhaEvoluiuLineText(segment.text);
  const isPimaTechLine = isPimaTechLineText(segment.text);
  const welcomeParts = isWelcomeSegment ? getWelcomeParts(displayText) : null;

  const enterEnd = Math.min(durationInFrames - 1, 12);
  const opacity =
    durationInFrames <= 1
      ? 1
      : isNeoLine
        ? interpolate(localFrame, toStrictlyIncreasing([0, enterEnd]), [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.inOut(Easing.ease),
          })
        : interpolate(
            localFrame,
            toStrictlyIncreasing([0, enterEnd, blurOutStart, durationInFrames - 1]),
            [0, 1, 1, 0],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.inOut(Easing.ease),
            },
          );

  const globalScale =
    durationInFrames <= 1
      ? 1
      : interpolate(localFrame, toStrictlyIncreasing([0, enterEnd]), [0.985, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.ease),
        });

  const globalY =
    durationInFrames <= 1
      ? 0
      : interpolate(localFrame, toStrictlyIncreasing([0, enterEnd]), [8, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.ease),
        });

  const motionPreset = segmentIndex % 4;

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
        opacity,
      }}
    >
      <div
        style={{
          color: textColor,
          textTransform: 'uppercase',
          fontFamily: 'DM Sans, system-ui, sans-serif',
          fontWeight: variant === 'apple' ? 700 : 800,
          fontSize,
          letterSpacing: variant === 'apple' ? -2.1 : -1.4,
          lineHeight: variant === 'apple' ? 1.02 : 1.05,
          textAlign: 'center',
          transform: `translateY(${globalY}px) scale(${globalScale})`,
          textShadow:
            textColor === '#ffffff' ? '0 8px 24px rgba(0,0,0,0.38)' : '0 6px 18px rgba(0,0,0,0.14)',
          padding: '0 96px',
          maxWidth: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          rowGap: 8,
        }}
      >
        {isWelcomeSegment && welcomeParts && logoSrc ? (
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
            <div
              style={{
                opacity: interpolate(localFrame, [0, 14], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                  easing: Easing.out(Easing.exp),
                }),
                transform: `translateY(${interpolate(localFrame, [0, 14], [34, 0], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                  easing: Easing.out(Easing.exp),
                })}px)`,
                letterSpacing: interpolate(localFrame, [0, 14], [6, -1.8], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                }),
                filter: `blur(${interpolate(localFrame, [0, 14], [12, 0], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                })}px)`,
              }}
            >
              {Array.from(welcomeParts.before).map((char, index) => {
                const charStart = index * 1.5;
                const charEnd = charStart + 10;
                const charOpacity = interpolate(localFrame, [charStart, charEnd], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                  easing: Easing.out(Easing.exp),
                });
                const charY = interpolate(localFrame, [charStart, charEnd], [20, 0], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                  easing: Easing.out(Easing.exp),
                });
                return (
                  <span
                    key={`${char}-${index}`}
                    style={{
                      display: 'inline-block',
                      minWidth: char === ' ' ? '0.32em' : undefined,
                      opacity: charOpacity,
                      transform: `translateY(${charY}px)`,
                    }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                );
              })}
            </div>

            <div style={{display: 'inline-flex', alignItems: 'center', gap: 10}}>
              <Img
                src={logoSrc}
                style={{
                  height: Math.max(42, Math.round(fontSize * 0.9)),
                  width: 'auto',
                  objectFit: 'contain',
                  opacity: spring({
                    frame: Math.max(0, localFrame - 8),
                    fps,
                    config: {damping: 20, stiffness: 150, mass: 0.8},
                    durationInFrames: Math.max(12, durationInFrames - 10),
                  }),
                  transform: `scale(${0.86 + spring({
                    frame: Math.max(0, localFrame - 8),
                    fps,
                    config: {damping: 20, stiffness: 150, mass: 0.8},
                    durationInFrames: Math.max(12, durationInFrames - 10),
                  }) * 0.14})`,
                }}
              />
              <span
                style={{
                  opacity: interpolate(localFrame, [10, 20], [0, 1], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                    easing: Easing.out(Easing.cubic),
                  }),
                  transform: `translateX(${interpolate(localFrame, [10, 20], [16, 0], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                    easing: Easing.out(Easing.cubic),
                  })}px)`,
                }}
              >
                {welcomeParts.after}
              </span>
            </div>
            <div
              style={{
                width: Math.max(220, Math.round(fontSize * 3.8)),
                height: 2,
                borderRadius: 999,
                background:
                  textColor === '#ffffff'
                    ? 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0) 100%)'
                    : 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0) 100%)',
                opacity: interpolate(localFrame, [8, 20], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                }),
                transform: `scaleX(${interpolate(localFrame, [8, 20], [0.2, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                  easing: Easing.out(Easing.cubic),
                })})`,
              }}
            />
          </div>
        ) : isFinalPersonalityLine ? (
          (() => {
            const line1 = 'para que a sua personalidade';
            const line2 = 'apareça primeiro que a marca';
            const personalityWord = 'personalidade';
            const [line1BeforePersonality] = line1.split(/personalidade/i);

            // Faster start so this block is already visibly underway around 00:11:24.
            const line1EnterEnd = Math.min(durationInFrames - 1, 10);
            const line2EnterStart = Math.min(durationInFrames - 1, 8);
            const line2EnterEnd = Math.min(durationInFrames - 1, line2EnterStart + 14);

            const line1Opacity =
              durationInFrames <= 1
                ? 1
                : interpolate(localFrame, toStrictlyIncreasing([0, line1EnterEnd]), [0, 1], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                    easing: Easing.inOut(Easing.cubic),
                  });
            const line2Opacity =
              durationInFrames <= 1
                ? 1
                : interpolate(localFrame, toStrictlyIncreasing([line2EnterStart, line2EnterEnd]), [0, 1], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                    easing: Easing.inOut(Easing.cubic),
                  });

            const line1Y =
              durationInFrames <= 1
                ? 0
                : interpolate(localFrame, toStrictlyIncreasing([0, line1EnterEnd]), [42, 0], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                    easing: Easing.out(Easing.exp),
                  });
            const line2Y =
              durationInFrames <= 1
                ? 0
                : interpolate(localFrame, toStrictlyIncreasing([line2EnterStart, line2EnterEnd]), [32, 0], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                    easing: Easing.out(Easing.exp),
                  });
            const line1Blur =
              durationInFrames <= 1
                ? 0
                : interpolate(localFrame, toStrictlyIncreasing([0, line1EnterEnd]), [10, 0], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                  });
            const line2Blur =
              durationInFrames <= 1
                ? 0
                : interpolate(localFrame, toStrictlyIncreasing([line2EnterStart, line2EnterEnd]), [8, 0], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                  });

            const redBoxScaleX =
              durationInFrames <= 1
                ? 1
                : interpolate(localFrame, toStrictlyIncreasing([6, 18]), [0.2, 1], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                    easing: Easing.out(Easing.cubic),
                  });
            const redBoxOpacity =
              durationInFrames <= 1
                ? 1
                : interpolate(localFrame, toStrictlyIncreasing([6, 14]), [0, 1], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                    easing: Easing.out(Easing.cubic),
                  });

            return (
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
                <div
                  style={{
                    opacity: line1Opacity,
                    transform: `translateY(${line1Y}px)`,
                    filter: `blur(${line1Blur}px)`,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span>{line1BeforePersonality.trim()}</span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '4px 10px 5px',
                      borderRadius: 6,
                      backgroundColor: '#D3132B',
                      color: '#ffffff',
                      transformOrigin: 'left center',
                      transform: `scaleX(${redBoxScaleX})`,
                      opacity: redBoxOpacity,
                      boxShadow: '0 8px 20px rgba(211,19,43,0.45)',
                    }}
                  >
                    {personalityWord}
                  </span>
                </div>

                <div
                  style={{
                    opacity: line2Opacity,
                    transform: `translateY(${line2Y}px)`,
                    filter: `blur(${line2Blur}px)`,
                  }}
                >
                  {line2}
                </div>
              </div>
            );
          })()
        ) : isDiminuimosLine ? (
          (() => {
            const enterEnd = Math.min(durationInFrames - 1, 20);
            const holdEnd = Math.max(enterEnd + 1, durationInFrames - 12);
            const phraseOpacity =
              durationInFrames <= 1
                ? 1
                : interpolate(
                    localFrame,
                    toStrictlyIncreasing([0, enterEnd, holdEnd, durationInFrames - 1]),
                    [0, 1, 1, 0],
                    {
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                      easing: Easing.inOut(Easing.cubic),
                    },
                  );
            const phraseY =
              durationInFrames <= 1
                ? 0
                : interpolate(localFrame, toStrictlyIncreasing([0, enterEnd]), [64, 0], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                    easing: Easing.out(Easing.exp),
                  });
            const phraseScale =
              durationInFrames <= 1
                ? 1
                : interpolate(localFrame, toStrictlyIncreasing([0, enterEnd]), [0.93, 1], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                    easing: Easing.out(Easing.exp),
                  });
            const phraseBlur =
              durationInFrames <= 1
                ? 0
                : interpolate(localFrame, toStrictlyIncreasing([0, enterEnd]), [14, 0], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                  });

            return (
              <span
                style={{
                  display: 'inline-block',
                  opacity: phraseOpacity,
                  transform: `translateY(${phraseY}px) scale(${phraseScale})`,
                  filter: `blur(${phraseBlur}px)`,
                  willChange: 'transform, opacity, filter',
                  letterSpacing: variant === 'apple' ? -1.9 : -1.2,
                }}
              >
                {displayText}
              </span>
            );
          })()
        ) : isMinimalistLine ? (
          (() => {
            const words = displayText.split(/\s+/).filter(Boolean);
            return (
              <span style={{display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center'}}>
                {words.map((word, index) => {
                  const reverseIndex = words.length - 1 - index;
                  const delay = reverseIndex * 4;
                  const enterEnd = delay + 14;
                  const normalizedWord = word.toLowerCase().replace(/[^a-z0-9-áàâãéêíóôõúç]/gi, '');
                  const isMinimalista = /^minimalista/.test(normalizedWord);
                  const isPicaPau = /^pica-pau/.test(normalizedWord);
                  const wordOpacity = interpolate(localFrame, [delay, enterEnd], [0, 1], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                    easing: Easing.out(Easing.exp),
                  });
                  const wordX = interpolate(localFrame, [delay, enterEnd], [42, 0], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                    easing: Easing.out(Easing.exp),
                  });
                  const wordY = interpolate(localFrame, [delay, enterEnd], [10, 0], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                    easing: Easing.out(Easing.cubic),
                  });
                  const wordBlur = interpolate(localFrame, [delay, enterEnd], [10, 0], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                  });
                  const wordScale = interpolate(localFrame, [delay, enterEnd], [0.95, 1], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                    easing: Easing.out(Easing.cubic),
                  });
                  const underlineStart = enterEnd + 2;
                  const underlineEnd = underlineStart + 10;
                  const underlineProgress = interpolate(localFrame, [underlineStart, underlineEnd], [0, 1], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                    easing: Easing.out(Easing.cubic),
                  });

                  return (
                    <span
                      key={`${word}-${index}`}
                      style={{
                        display: 'inline-flex',
                        position: 'relative',
                        color: isMinimalista ? '#d3132b' : textColor,
                        marginRight: index === words.length - 1 ? 0 : 10,
                        opacity: wordOpacity,
                        transform: `translate3d(${wordX}px, ${wordY}px, 0) scale(${wordScale})`,
                        filter: `blur(${wordBlur}px)`,
                        willChange: 'transform, opacity, filter',
                        paddingBottom: isPicaPau ? 6 : 0,
                      }}
                    >
                      {word}
                      {isPicaPau ? (
                        <span
                          style={{
                            position: 'absolute',
                            left: 0,
                            bottom: 0,
                            height: 3,
                            width: `${underlineProgress * 100}%`,
                            backgroundColor: '#d3132b',
                            borderRadius: 999,
                            transformOrigin: 'left center',
                            boxShadow: '0 0 10px rgba(211, 19, 43, 0.45)',
                          }}
                        />
                      ) : null}
                    </span>
                  );
                })}
              </span>
            );
          })()
        ) : (
          (() => {
            let wordIndex = -1;

            return tokens.map((token, index) => {
              const isSpace = /^\s+$/.test(token);
              const isLineBreak = /\n/.test(token);
              if (!isSpace) {
                wordIndex += 1;
              }

              let wordStart = isSpace ? 0 : wordIndex * staggerFrames;

              const wordAnimDuration = isPimaTechLine ? 8 : Math.max(6, Math.floor(staggerFrames * 1.8));
              if (isPimaTechLine && !isSpace) {
                wordStart = wordIndex * 2;
              }
              if (isMalhaEvoluiuLine && !isSpace) {
                // Segment starts at 00:12:14.
                // Force end points using timeline timecode (seconds:frames):
                // "amada" -> 00:14:14 (delta 2:00), "também" -> 00:14:22 (delta 2:08).
                const framesFromSegmentStart = (seconds: number, frames: number) =>
                  Math.round(seconds * fps + (frames * fps) / 30);

                if (/^amada[,.!?;:]*$/iu.test(token)) {
                  const targetEnd = framesFromSegmentStart(2, 0);
                  wordStart = Math.max(0, targetEnd - wordAnimDuration);
                }

                if (/^tamb[ée]m[,.!?;:]*$/iu.test(token)) {
                  const targetEnd = framesFromSegmentStart(2, 8);
                  wordStart = Math.max(0, targetEnd - wordAnimDuration);
                }
              }
              const wordEnd = wordStart + wordAnimDuration;

              const fromY = isSignatureArea
                ? 36
                : motionPreset === 0
                  ? 14
                  : motionPreset === 1
                    ? 0
                    : motionPreset === 2
                      ? 24
                      : 10;
              const fromX = isSignatureArea
                ? 0
                : motionPreset === 0
                  ? 0
                  : motionPreset === 1
                    ? -18
                    : motionPreset === 2
                      ? 0
                      : 14;
              const fromRotate = isSignatureArea ? 0 : motionPreset === 2 ? -5 : motionPreset === 3 ? 2 : 0;
              const fromBlur = isSignatureArea
                ? 12
                : motionPreset === 0
                  ? 6
                  : motionPreset === 1
                    ? 4
                    : motionPreset === 2
                      ? 8
                      : 5;
              const easing =
                isSignatureArea
                  ? Easing.out(Easing.exp)
                  : motionPreset === 1
                  ? Easing.out(Easing.exp)
                  : motionPreset === 2
                    ? Easing.out(Easing.quad)
                    : Easing.out(Easing.cubic);

              const wordOpacity = interpolate(localFrame, [wordStart, wordEnd], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing,
              });
              const wordY = interpolate(localFrame, [wordStart, wordEnd], [fromY, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing,
              });
              const wordX = interpolate(localFrame, [wordStart, wordEnd], [fromX, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing,
              });
              const wordRotate = interpolate(localFrame, [wordStart, wordEnd], [fromRotate, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing,
              });
              const wordBlur = interpolate(localFrame, [wordStart, wordEnd], [fromBlur, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });
              const wordScale = interpolate(localFrame, [wordStart, wordEnd], [0.965, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing,
              });
              const signaturePulse =
                isSignatureArea
                  ? 1 +
                    Math.sin(((localFrame - wordStart) / Math.max(1, durationInFrames)) * Math.PI) * 0.018
                  : 1;

              if (isLineBreak) {
                return <span key={`break-${index}`} style={{flexBasis: '100%', width: '100%', height: 0}} />;
              }

              if (isSpace) {
                return (
                  <span key={`space-${index}`} style={{whiteSpace: 'pre'}}>
                    {token}
                  </span>
                );
              }

              const reservaToken = logoSrc ? extractReservaToken(token) : null;
              const cleanToken = normalizeWordToken(token);
              const isNeoLineWord = isNeoLine && (cleanToken === 'neo' || cleanToken === 'line');
              const isPimaTechWord = isPimaTechLine && (cleanToken === 'pima' || cleanToken === 'tech');
              const isTecnologiaWord = isRespiraLineText(segment.text) && cleanToken === 'tecnologia';
              const neoBoxStart = Math.max(0, wordStart - 6);
              const neoBoxEnd = wordEnd + 8;
              const neoBoxScale =
                isNeoLineWord && durationInFrames > 1
                  ? interpolate(localFrame, toStrictlyIncreasing([neoBoxStart, neoBoxEnd]), [0, 1], {
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                      easing: Easing.out(Easing.exp),
                    })
                  : 1;
              const neoBoxOpacity =
                isNeoLineWord && durationInFrames > 1
                  ? interpolate(localFrame, toStrictlyIncreasing([neoBoxStart, wordEnd]), [0.45, 1], {
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                      easing: Easing.out(Easing.cubic),
                    })
                  : 1;
              const pimaBoxStart = Math.max(0, wordStart - 4);
              const pimaBoxEnd = wordEnd + 8;
              const pimaBoxScaleY =
                isPimaTechWord && durationInFrames > 1
                  ? interpolate(localFrame, toStrictlyIncreasing([pimaBoxStart, pimaBoxEnd]), [0, 1], {
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                      easing: Easing.out(Easing.exp),
                    })
                  : 1;
              const pimaBoxOpacity =
                isPimaTechWord && durationInFrames > 1
                  ? interpolate(localFrame, toStrictlyIncreasing([pimaBoxStart, wordEnd]), [0.4, 1], {
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                      easing: Easing.out(Easing.cubic),
                    })
                  : 1;
              const tecnologiaBoxScaleY =
                isTecnologiaWord && durationInFrames > 1
                  ? interpolate(localFrame, toStrictlyIncreasing([Math.max(0, wordStart - 4), wordEnd + 8]), [0, 1], {
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                      easing: Easing.out(Easing.exp),
                    })
                  : 1;
              const tecnologiaBoxOpacity =
                isTecnologiaWord && durationInFrames > 1
                  ? interpolate(localFrame, toStrictlyIncreasing([Math.max(0, wordStart - 4), wordEnd]), [0.4, 1], {
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                      easing: Easing.out(Easing.cubic),
                    })
                  : 1;

              return (
                <span
                  key={`${token}-${index}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    position: 'relative',
                    opacity: wordOpacity,
                    transform: `translate3d(${wordX}px, ${wordY}px, 0) rotate(${wordRotate}deg) scale(${
                      wordScale * signaturePulse
                    })`,
                    filter: `blur(${wordBlur}px)`,
                    willChange: 'transform, opacity, filter',
                  }}
                >
                  {isNeoLineWord ? (
                    <span
                      style={{
                        position: 'absolute',
                        left: -10,
                        right: -10,
                        top: -8,
                        bottom: -8,
                        borderRadius: 8,
                        background:
                          'linear-gradient(180deg, rgba(235,28,36,0.9) 0%, rgba(186,16,28,0.98) 100%)',
                        transformOrigin: 'bottom center',
                        transform: `scaleY(${neoBoxScale})`,
                        opacity: neoBoxOpacity,
                        boxShadow: '0 10px 26px rgba(203, 27, 38, 0.38)',
                        zIndex: 0,
                      }}
                    />
                  ) : null}
                  {isPimaTechWord ? (
                    <span
                      style={{
                        position: 'absolute',
                        left: -10,
                        right: -10,
                        top: -8,
                        bottom: -8,
                        borderRadius: 8,
                        background:
                          'linear-gradient(180deg, rgba(225,28,42,0.95) 0%, rgba(179,16,27,0.98) 100%)',
                        transformOrigin: 'bottom center',
                        transform: `scaleY(${pimaBoxScaleY})`,
                        opacity: pimaBoxOpacity,
                        boxShadow: '0 10px 24px rgba(211, 19, 43, 0.42)',
                        zIndex: 0,
                      }}
                    />
                  ) : null}
                  {isTecnologiaWord ? (
                    <span
                      style={{
                        position: 'absolute',
                        left: -10,
                        right: -10,
                        top: -8,
                        bottom: -8,
                        borderRadius: 8,
                        background:
                          'linear-gradient(180deg, rgba(225,28,42,0.95) 0%, rgba(179,16,27,0.98) 100%)',
                        transformOrigin: 'bottom center',
                        transform: `scaleY(${tecnologiaBoxScaleY})`,
                        opacity: tecnologiaBoxOpacity,
                        boxShadow: '0 10px 24px rgba(211, 19, 43, 0.42)',
                        zIndex: 0,
                      }}
                    />
                  ) : null}
                  {reservaToken ? (
                    <>
                      {reservaToken.prefix ? <span>{reservaToken.prefix}</span> : null}
                      <Img
                        src={logoSrc!}
                        style={{
                          height: Math.max(34, Math.round(fontSize * 0.82)),
                          width: 'auto',
                          objectFit: 'contain',
                          margin: '0 4px',
                          transform: 'translateY(1px)',
                          filter: textColor === '#000000' ? 'none' : 'brightness(0) invert(1)',
                        }}
                      />
                      {reservaToken.suffix ? <span>{reservaToken.suffix}</span> : null}
                    </>
                  ) : (
                    <span
                      style={
                        isNeoLineWord || isPimaTechWord || isPimaTechLine || isTecnologiaWord
                          ? {
                              position: 'relative',
                              zIndex: 1,
                              color: '#ffffff',
                              textShadow: '0 2px 10px rgba(0,0,0,0.35)',
                            }
                          : undefined
                      }
                    >
                      {token}
                    </span>
                  )}
                </span>
              );
            });
          })()
        )}
      </div>
    </AbsoluteFill>
  );
};

export const MotionTitlesTemplate: React.FC<MotionTitlesTemplateProps> = ({
  audioSrc,
  audioOffsetSec = 0,
  audioDurationSec,
  segments,
  blockStartSec = 0,
  blockEndSec,
  variant = 'default',
  backgroundVideos = [],
  threeColumnVideos = [],
  pimaTechBackgroundSrc,
  unindoBackgroundSrc,
  lastSequenceBackgroundSrc,
  repensamosBackgroundSrc,
  audioCutsSec = [],
  logoSrc,
}) => {
  const frame = useCurrentFrame();
  const {fps, height} = useVideoConfig();
  const maxSec = segments.reduce((acc, segment) => Math.max(acc, segment.endSec), 0);
  const resolvedBlockStartSec = Math.max(0, blockStartSec);
  const resolvedBlockEndSec = Math.max(resolvedBlockStartSec, blockEndSec ?? maxSec);
  const blockStartFrame = Math.max(0, Math.round(resolvedBlockStartSec * fps));
  const blockEndFrame = Math.max(blockStartFrame + 1, Math.round(resolvedBlockEndSec * fps));
  const blockDurationFrames = Math.max(1, blockEndFrame - blockStartFrame);
  const audioOffsetFrame = Math.max(0, Math.round(audioOffsetSec * fps));
  const requestedAudioDurationFrames =
    audioDurationSec === undefined ? undefined : Math.max(1, Math.round(audioDurationSec * fps));
  const audioSequenceDuration = requestedAudioDurationFrames
    ? Math.min(blockDurationFrames, requestedAudioDurationFrames)
    : blockDurationFrames;
  const normalizedAudioCuts = audioCutsSec
    .map((cut) => ({
      start: Math.max(0, Math.round(cut.startSec * fps)),
      end: Math.min(blockDurationFrames, Math.round(cut.endSec * fps)),
    }))
    .filter((cut) => cut.end > cut.start)
    .sort((a, b) => a.start - b.start);

  const clippedSegments = segments
    .map((segment, index) => {
      const originalFrom = Math.max(0, Math.round(segment.startSec * fps));
      const originalTo = Math.max(originalFrom + 1, Math.round(segment.endSec * fps));
      const originalDuration = originalTo - originalFrom;
      const clippedFrom = Math.max(originalFrom, blockStartFrame);
      const clippedTo = Math.min(originalTo, blockEndFrame);
      const durationInFrames = clippedTo - clippedFrom;

      if (durationInFrames <= 0) {
        return null;
      }

      return {
        index,
        segment,
        originalFrom,
        originalDuration,
        from: clippedFrom - blockStartFrame,
        durationInFrames,
      };
    })
    .filter((segment): segment is NonNullable<typeof segment> => segment !== null);

  let videoCursor = 0;
  const segmentVideoSources = clippedSegments.map((_segment, visibleIndex) => {
    const text = _segment.segment.text;
    const picapauSrc = backgroundVideos.find((src) => src.includes('picapau_minimalista'));
    if (variant === 'apple' && isDiminuimosLineText(text) && picapauSrc) {
      return picapauSrc;
    }

    const wantsVideo = variant === 'apple' && visibleIndex % 2 === 0;
    if (!wantsVideo) {
      return null;
    }

    if (videoCursor >= backgroundVideos.length) {
      return null;
    }

    const src = backgroundVideos[videoCursor];
    videoCursor += 1;
    return src;
  });

  const threeColumnSegments = clippedSegments.filter(
    (segmentData) => isThreeColumnBackgroundText(segmentData.segment.text) && threeColumnVideos.length >= 3,
  );
  const threeColumnBackgroundRange =
    threeColumnSegments.length > 0
      ? {
          from: threeColumnSegments[0].from,
          durationInFrames:
            threeColumnSegments[threeColumnSegments.length - 1].from +
            threeColumnSegments[threeColumnSegments.length - 1].durationInFrames -
            threeColumnSegments[0].from,
        }
      : null;

  return (
    <AbsoluteFill style={{backgroundColor: variant === 'apple' ? '#f5f5f7' : '#000000'}}>
      {threeColumnBackgroundRange ? (
        <Sequence
          key="bg-three-columns-continuous"
          from={threeColumnBackgroundRange.from}
          durationInFrames={Math.max(1, threeColumnBackgroundRange.durationInFrames)}
        >
          <AbsoluteFill style={{opacity: 1}}>
            <div style={{display: 'flex', width: '100%', height: '100%'}}>
              {threeColumnVideos.slice(0, 3).map((src, columnIndex) => (
                <div key={`${src}-${columnIndex}`} style={{flex: 1, width: '33.3333%', height: '100%'}}>
                  <Video
                    src={src}
                    muted
                    loop
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
              ))}
            </div>
          </AbsoluteFill>
        </Sequence>
      ) : null}

      {clippedSegments.map((segmentData, visibleIndex) => {
        const {from, durationInFrames, segment} = segmentData;
        const isPimaTechLine = isPimaTechLineText(segment.text);
        const isUnindoPimaLine = isUnindoPimaLineText(segment.text);
        const isLastSequence = isLastSequenceText(segment.text);
        const isCamisetasCalcasLine = isCamisetasCalcasLineText(segment.text);
        const isRepensamosBackgroundLine = isRepensamosBackgroundText(segment.text);
        const videoSrc =
          (isPimaTechLine && pimaTechBackgroundSrc) ||
          (isUnindoPimaLine && unindoBackgroundSrc) ||
          (isLastSequence && lastSequenceBackgroundSrc)
            ? isPimaTechLine
              ? pimaTechBackgroundSrc!
              : isUnindoPimaLine
                ? unindoBackgroundSrc!
                : lastSequenceBackgroundSrc!
            : segmentVideoSources[visibleIndex] ?? null;
        const imageBgSrc = isRepensamosBackgroundLine ? repensamosBackgroundSrc : undefined;
        const isSignatureArea = isSignatureAreaText(segment.text);
        const isDiminuimosLine = isDiminuimosLineText(segment.text);
        const isMinimalistLine = isMinimalistLineText(segment.text);
        const isNeoLine = isNeoLineText(segment.text);
        const isThreeColumnSegment = isThreeColumnBackgroundText(segment.text) && threeColumnVideos.length >= 3;
        const hasVideoBackground = Boolean(videoSrc) || Boolean(imageBgSrc) || isThreeColumnSegment;

        const segmentLocalFrame = frame - from;
        const fadeInFrames = isUnindoPimaLine ? 0 : isMinimalistLine ? 16 : 8;
        const fadeOutFrames = isDiminuimosLine ? 20 : 8;
        const bgOpacity =
          durationInFrames <= 1
            ? 1
            : fadeInFrames === 0
              ? interpolate(
                  segmentLocalFrame,
                  toStrictlyIncreasing([0, durationInFrames - fadeOutFrames, durationInFrames - 1]),
                  [1, 1, hasVideoBackground ? 1 : 0],
                  {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                    easing: Easing.inOut(Easing.ease),
                  },
                )
            : isNeoLine
              ? interpolate(segmentLocalFrame, toStrictlyIncreasing([0, fadeInFrames]), [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                  easing: Easing.inOut(Easing.ease),
                })
              : interpolate(
                  segmentLocalFrame,
                  toStrictlyIncreasing([0, fadeInFrames, durationInFrames - fadeOutFrames, durationInFrames - 1]),
                  [0, 1, 1, hasVideoBackground ? 1 : 0],
                  {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                    easing: Easing.inOut(Easing.ease),
                  },
                );

        const bgScale =
          1 +
          spring({
            frame: Math.max(0, segmentLocalFrame),
            fps,
            config: {damping: 200, stiffness: 100},
            durationInFrames,
          }) *
            0.015;

        return (
          <Sequence key={`bg-${visibleIndex}-${from}`} from={from} durationInFrames={durationInFrames}>
            {isCamisetasCalcasLine ? (
              <AbsoluteFill style={{backgroundColor: '#ffffff', opacity: bgOpacity}} />
            ) : isMinimalistLine ? (
              <AbsoluteFill style={{backgroundColor: '#000000', opacity: bgOpacity}} />
            ) : isThreeColumnSegment ? (
              <AbsoluteFill style={{opacity: 0}} />
            ) : imageBgSrc ? (
              <AbsoluteFill style={{opacity: bgOpacity}}>
                <Img
                  src={imageBgSrc}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: '100% 28%',
                    transform: `translate3d(${interpolate(
                      segmentLocalFrame,
                      toStrictlyIncreasing([0, durationInFrames - 1]),
                      [0, -126],
                      {
                        extrapolateLeft: 'clamp',
                        extrapolateRight: 'clamp',
                        easing: Easing.inOut(Easing.cubic),
                      },
                    )}px, ${interpolate(
                      segmentLocalFrame,
                      toStrictlyIncreasing([0, durationInFrames - 1]),
                      [0, -286 - height * 0.15],
                      {
                        extrapolateLeft: 'clamp',
                        extrapolateRight: 'clamp',
                        easing: Easing.inOut(Easing.cubic),
                      },
                    )}px, 0) scale(${interpolate(
                      segmentLocalFrame,
                      toStrictlyIncreasing([0, durationInFrames - 1]),
                      [1, 2],
                      {
                        extrapolateLeft: 'clamp',
                        extrapolateRight: 'clamp',
                        easing: Easing.inOut(Easing.cubic),
                      },
                    ) * (bgScale + 0.01)})`,
                    transformOrigin: '64% 46%',
                    filter: 'brightness(0.52) contrast(1.08) saturate(1.04)',
                  }}
                />
              </AbsoluteFill>
            ) : videoSrc ? (
              <AbsoluteFill style={{opacity: bgOpacity}}>
                <Video
                  src={videoSrc}
                  muted
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: `translateX(${interpolate(
                      segmentLocalFrame,
                      toStrictlyIncreasing([0, durationInFrames - 1]),
                      isSignatureArea ? [-14, 14] : [0, 0],
                      {
                        extrapolateLeft: 'clamp',
                        extrapolateRight: 'clamp',
                      },
                    )}px) scale(${isSignatureArea ? bgScale + 0.03 : bgScale})`,
                    filter: isSignatureArea
                      ? 'brightness(0.72) contrast(1.12) saturate(1.15)'
                      : 'brightness(0.82) saturate(1.06)',
                  }}
                />
              </AbsoluteFill>
            ) : (
              <AbsoluteFill style={{backgroundColor: '#ffffff', opacity: bgOpacity}} />
            )}
          </Sequence>
        );
      })}
      {clippedSegments.map(({index, segment, from, originalFrom, originalDuration, durationInFrames}, visibleIndex) => {
        const sourceFrame = frame + blockStartFrame;
        const isThreeColumnSegment = isThreeColumnBackgroundText(segment.text) && threeColumnVideos.length >= 3;
        const hasPimaTechBg = isPimaTechLineText(segment.text) && Boolean(pimaTechBackgroundSrc);
        const hasUnindoBg = isUnindoPimaLineText(segment.text) && Boolean(unindoBackgroundSrc);
        const hasLastSequenceBg = isLastSequenceText(segment.text) && Boolean(lastSequenceBackgroundSrc);
        const hasRepensamosBg = isRepensamosBackgroundText(segment.text) && Boolean(repensamosBackgroundSrc);
        const isCamisetasCalcasLine = isCamisetasCalcasLineText(segment.text);
        const hasVideoBg =
          Boolean(segmentVideoSources[visibleIndex]) ||
          isThreeColumnSegment ||
          hasPimaTechBg ||
          hasUnindoBg ||
          hasLastSequenceBg ||
          hasRepensamosBg;
        const isMinimalistLine = isMinimalistLineText(segment.text);
        const hasDarkBackground = (hasVideoBg || isMinimalistLine) && !isCamisetasCalcasLine;

        return (
          <Sequence key={`caption-${index}-${from}`} from={from} durationInFrames={durationInFrames}>
            <Caption
              segment={segment}
              segmentIndex={visibleIndex}
              localFrame={sourceFrame - originalFrom}
              durationInFrames={originalDuration}
              variant={variant}
              textColor={hasDarkBackground ? '#ffffff' : '#000000'}
              logoSrc={logoSrc}
            />
          </Sequence>
        );
      })}

      {audioSrc
        ? (() => {
            if (normalizedAudioCuts.length === 0) {
              return (
                <Sequence from={0} durationInFrames={audioSequenceDuration}>
                  <Audio src={audioSrc} trimBefore={audioOffsetFrame + blockStartFrame} />
                </Sequence>
              );
            }

            const audioSlices: Array<{from: number; duration: number; trimBefore: number}> = [];
            let outputCursor = 0;
            let sourceCursor = 0;

            for (const cut of normalizedAudioCuts) {
              const playable = cut.start - sourceCursor;
              if (playable > 0 && outputCursor < audioSequenceDuration) {
                const duration = Math.min(playable, audioSequenceDuration - outputCursor);
                audioSlices.push({
                  from: outputCursor,
                  duration,
                  trimBefore: audioOffsetFrame + blockStartFrame + sourceCursor,
                });
                outputCursor += duration;
              }

              sourceCursor = Math.max(sourceCursor, cut.end);
              if (outputCursor >= audioSequenceDuration) {
                break;
              }
            }

            if (outputCursor < audioSequenceDuration) {
              audioSlices.push({
                from: outputCursor,
                duration: audioSequenceDuration - outputCursor,
                trimBefore: audioOffsetFrame + blockStartFrame + sourceCursor,
              });
            }

            return audioSlices.map((slice, index) => (
              <Sequence key={`audio-slice-${index}`} from={slice.from} durationInFrames={slice.duration}>
                <Audio src={audioSrc} trimBefore={slice.trimBefore} />
              </Sequence>
            ));
          })()
        : null}
    </AbsoluteFill>
  );
};

export const getMotionTitleDuration = (
  segments: TranscriptSegment[],
  fps: number,
  blockStartSec = 0,
  blockEndSec?: number,
) => {
  const maxSec = segments.reduce((acc, segment) => Math.max(acc, segment.endSec), 0);
  const start = Math.max(0, blockStartSec);
  const end = Math.max(start, blockEndSec ?? maxSec);
  return Math.max(1, Math.ceil((end - start) * fps));
};
