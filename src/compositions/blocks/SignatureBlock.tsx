import React from 'react';
import {AbsoluteFill, Easing, Sequence, interpolate} from 'remotion';

type SignatureBlockProps = {
  frame: number;
  signatureTextStart: number;
  signatureTextEnd: number;
  signatureTextEnterEnd: number;
  signatureTextExitStart: number;
  signatureTextOpacity: number;
  signatureTextScale: number;
  scaledFont: (size: number) => number;
};

export const SignatureBlock: React.FC<SignatureBlockProps> = ({
  frame,
  signatureTextStart,
  signatureTextEnd,
  signatureTextEnterEnd,
  signatureTextExitStart,
  signatureTextOpacity,
  signatureTextScale,
  scaledFont,
}) => {
  return (
    <Sequence
      from={signatureTextStart}
      durationInFrames={Math.max(1, signatureTextEnd - signatureTextStart + 1)}
    >
      <AbsoluteFill style={{pointerEvents: 'none', justifyContent: 'center', alignItems: 'center'}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
          {['Diminuimos a', 'nossa assinatura'].map((line, index) => {
            const lineDelay = index * 7;
            const lineOpacity = interpolate(
              frame,
              [
                signatureTextStart + lineDelay,
                signatureTextEnterEnd + lineDelay,
                signatureTextExitStart,
                signatureTextEnd,
              ],
              [0, 1, 1, 0],
              {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: Easing.inOut(Easing.ease),
              },
            );
            const lineTranslateY = interpolate(
              frame,
              [
                signatureTextStart + lineDelay,
                signatureTextEnterEnd + lineDelay,
                signatureTextExitStart,
                signatureTextEnd,
              ],
              [40, 0, 0, -24],
              {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: Easing.inOut(Easing.ease),
              },
            );

            return (
              <div
                key={line}
                style={{
                  color: 'white',
                  fontFamily: 'DM Sans, system-ui, sans-serif',
                  fontSize: scaledFont(28),
                  fontWeight: 700,
                  letterSpacing: -1.1,
                  lineHeight: 1.05,
                  textTransform: 'uppercase',
                  opacity: lineOpacity * signatureTextOpacity,
                  transform: `translateY(${lineTranslateY}px) scale(${signatureTextScale})`,
                  textShadow: '0 12px 30px rgba(0,0,0,0.45)',
                  textAlign: 'center',
                }}
              >
                {line}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </Sequence>
  );
};
