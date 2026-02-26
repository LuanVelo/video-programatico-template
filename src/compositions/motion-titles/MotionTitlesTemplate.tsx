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
  const tokens = splitWithSpaces(segment.text);
  const revealWindow = Math.max(1, durationInFrames - 8);
  const nonSpaceTokens = tokens.filter((token) => !/^\s+$/.test(token)).length;
  const staggerFrames = nonSpaceTokens > 0 ? Math.max(1, Math.floor(revealWindow / (nonSpaceTokens + 2))) : 1;
  const blurOutStart = Math.max(0, durationInFrames - Math.max(10, Math.round(0.25 * fps)));
  const isWelcomeSegment = isWelcomeSegmentText(segment.text);
  const isSignatureArea = isSignatureAreaText(segment.text);
  const isMinimalistLine = isMinimalistLineText(segment.text);
  const welcomeParts = isWelcomeSegment ? getWelcomeParts(segment.text) : null;

  const enterEnd = Math.min(durationInFrames - 1, 12);
  const opacity = interpolate(localFrame, [0, enterEnd, blurOutStart, durationInFrames - 1], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.ease),
  });

  const globalScale = interpolate(localFrame, [0, enterEnd], [0.985, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.ease),
  });

  const globalY = interpolate(localFrame, [0, enterEnd], [8, 0], {
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
                      opacity: charOpacity,
                      transform: `translateY(${charY}px)`,
                    }}
                  >
                    {char}
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
        ) : isMinimalistLine ? (
          (() => {
            const words = segment.text.split(/\s+/).filter(Boolean);
            const step = Math.max(1, Math.floor(durationInFrames / Math.max(1, words.length)));
            const activeWordIndex = Math.min(words.length - 1, Math.floor(localFrame / step));
            const activeWord = words[activeWordIndex] ?? '';
            const localWordFrame = localFrame - activeWordIndex * step;

            const wordOpacity = interpolate(
              localWordFrame,
              [0, Math.floor(step * 0.28), Math.floor(step * 0.72), step - 1],
              [0, 1, 1, 0],
              {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: Easing.inOut(Easing.cubic),
              },
            );
            const wordY = interpolate(localWordFrame, [0, Math.floor(step * 0.28)], [22, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.out(Easing.exp),
            });
            const wordScale = interpolate(localWordFrame, [0, Math.floor(step * 0.28)], [0.92, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.out(Easing.exp),
            });
            const wordBlur = interpolate(localWordFrame, [0, Math.floor(step * 0.28)], [10, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });

            return (
              <span
                style={{
                  display: 'inline-block',
                  opacity: wordOpacity,
                  transform: `translateY(${wordY}px) scale(${wordScale})`,
                  filter: `blur(${wordBlur}px)`,
                  willChange: 'transform, opacity, filter',
                }}
              >
                {activeWord}
              </span>
            );
          })()
        ) : (
          (() => {
            let wordIndex = -1;

            return tokens.map((token, index) => {
              const isSpace = /^\s+$/.test(token);
              if (!isSpace) {
                wordIndex += 1;
              }

              const wordStart = isSpace ? 0 : wordIndex * staggerFrames;
              const wordEnd = wordStart + Math.max(6, Math.floor(staggerFrames * 1.8));

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

              if (isSpace) {
                return (
                  <span key={`space-${index}`} style={{whiteSpace: 'pre'}}>
                    {token}
                  </span>
                );
              }

              const reservaToken = logoSrc ? extractReservaToken(token) : null;

              return (
                <span
                  key={`${token}-${index}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    opacity: wordOpacity,
                    transform: `translate3d(${wordX}px, ${wordY}px, 0) rotate(${wordRotate}deg) scale(${
                      wordScale * signaturePulse
                    })`,
                    filter: `blur(${wordBlur}px)`,
                    willChange: 'transform, opacity, filter',
                  }}
                >
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
                    token
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
  segments,
  blockStartSec = 0,
  blockEndSec,
  variant = 'default',
  backgroundVideos = [],
  logoSrc,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const maxSec = segments.reduce((acc, segment) => Math.max(acc, segment.endSec), 0);
  const resolvedBlockStartSec = Math.max(0, blockStartSec);
  const resolvedBlockEndSec = Math.max(resolvedBlockStartSec, blockEndSec ?? maxSec);
  const blockStartFrame = Math.max(0, Math.floor(resolvedBlockStartSec * fps));
  const blockEndFrame = Math.max(blockStartFrame + 1, Math.ceil(resolvedBlockEndSec * fps));

  const clippedSegments = segments
    .map((segment, index) => {
      const originalFrom = Math.max(0, Math.floor(segment.startSec * fps));
      const originalTo = Math.max(originalFrom + 1, Math.ceil(segment.endSec * fps));
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
    if (variant === 'apple' && isSignatureAreaText(text) && picapauSrc) {
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

  return (
    <AbsoluteFill style={{backgroundColor: variant === 'apple' ? '#f5f5f7' : '#000000'}}>
      {clippedSegments.map((segmentData, visibleIndex) => {
        const {from, durationInFrames, segment} = segmentData;
        const videoSrc = segmentVideoSources[visibleIndex] ?? null;
        const isSignatureArea = isSignatureAreaText(segment.text);

        const segmentLocalFrame = frame - from;
        const bgOpacity = interpolate(
          segmentLocalFrame,
          [0, 8, durationInFrames - 8, durationInFrames - 1],
          [0, 1, 1, 0],
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
            {videoSrc ? (
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
                      [0, durationInFrames - 1],
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
        const hasVideoBg = Boolean(segmentVideoSources[visibleIndex]);

        return (
          <Sequence key={`caption-${index}-${from}`} from={from} durationInFrames={durationInFrames}>
            <Caption
              segment={segment}
              segmentIndex={visibleIndex}
              localFrame={sourceFrame - originalFrom}
              durationInFrames={originalDuration}
              variant={variant}
              textColor={hasVideoBg ? '#ffffff' : '#000000'}
              logoSrc={logoSrc}
            />
          </Sequence>
        );
      })}

      {audioSrc ? (
        <Sequence from={0} durationInFrames={Math.max(1, blockEndFrame - blockStartFrame)}>
          <Audio src={audioSrc} trimBefore={blockStartFrame} />
        </Sequence>
      ) : null}
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
