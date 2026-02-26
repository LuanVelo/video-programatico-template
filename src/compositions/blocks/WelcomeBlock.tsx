import React from 'react';
import {Easing, Img, interpolate} from 'remotion';

type WelcomeBlockProps = {
  frame: number;
  secondBlockStart: number;
  secondBlockEnd: number;
  secondTextEnterStart: number;
  secondTextEnterEnd: number;
  secondTextExitStart: number;
  secondTextExitEnd: number;
  firstLine: string;
  secondLine: string;
  beforeReserva: string;
  afterReserva: string;
  logoSrc: string;
  scaledFont: (size: number) => number;
};

export const WelcomeBlock: React.FC<WelcomeBlockProps> = ({
  frame,
  secondBlockStart,
  secondBlockEnd,
  secondTextEnterStart,
  secondTextEnterEnd,
  secondTextExitStart,
  secondTextExitEnd,
  firstLine,
  secondLine,
  beforeReserva,
  afterReserva,
  logoSrc,
  scaledFont,
}) => {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'white',
          opacity: frame >= secondBlockStart && frame < secondBlockEnd ? 1 : 0,
          pointerEvents: 'none',
        }}
      />
      {frame >= secondBlockStart && frame < secondBlockEnd ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 80px',
            fontFamily: 'DM Sans, system-ui, sans-serif',
            color: 'black',
            textAlign: 'center',
            fontWeight: 700,
            textTransform: 'uppercase',
          }}
        >
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
            {[firstLine, secondLine].map((line, index) => {
              const lineDelay = index * 7;
              const lineOpacity = interpolate(
                frame,
                [secondTextEnterStart + lineDelay, secondTextEnterEnd + lineDelay, secondTextExitStart, secondTextExitEnd],
                [0, 1, 1, 0],
                {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                  easing: Easing.inOut(Easing.ease),
                },
              );

              const lineTranslateY = interpolate(
                frame,
                [secondTextEnterStart + lineDelay, secondTextEnterEnd + lineDelay, secondTextExitStart, secondTextExitEnd],
                [20, 0, 0, -16],
                {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                  easing: Easing.inOut(Easing.ease),
                },
              );

              return (
                <span
                  key={line + index}
                  style={{
                    fontSize: scaledFont(38),
                    fontWeight: 700,
                    letterSpacing: -1.4,
                    lineHeight: 1.05,
                    textShadow: 'none',
                    opacity: lineOpacity,
                    transform: `translateY(${lineTranslateY}px)`,
                  }}
                >
                  {index === 1 ? (
                    <span style={{display: 'inline-flex', alignItems: 'center', gap: 8}}>
                      <span>{beforeReserva}</span>
                      <Img
                        src={logoSrc}
                        style={{
                          height: scaledFont(38),
                          width: 'auto',
                          objectFit: 'contain',
                          transform: 'translateY(1px)',
                        }}
                      />
                      <span>{afterReserva}</span>
                    </span>
                  ) : (
                    line
                  )}
                </span>
              );
            })}
          </div>
        </div>
      ) : null}
    </>
  );
};
