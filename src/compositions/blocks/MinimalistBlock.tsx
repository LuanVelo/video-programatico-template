import React from 'react';
import {AbsoluteFill, Easing, Sequence, interpolate} from 'remotion';

type MinimalistBlockProps = {
  frame: number;
  video3Start: number;
  video4Start: number;
  transitionFrames: number;
  minimalistTextWords: string[];
  minimalistWordStep: number;
  minimalistWordRevealFrames: number;
  minimalistTextTransitionOpacity: number;
  scaledFont: (size: number) => number;
};

export const MinimalistBlock: React.FC<MinimalistBlockProps> = ({
  frame,
  video3Start,
  video4Start,
  transitionFrames,
  minimalistTextWords,
  minimalistWordStep,
  minimalistWordRevealFrames,
  minimalistTextTransitionOpacity,
  scaledFont,
}) => {
  return (
    <Sequence
      from={video3Start}
      durationInFrames={Math.max(1, video4Start - video3Start + transitionFrames)}
    >
      <AbsoluteFill style={{pointerEvents: 'none'}}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontFamily: 'DM Sans, system-ui, sans-serif',
            fontSize: scaledFont(30),
            fontWeight: 700,
            letterSpacing: -0.6,
            lineHeight: 1.1,
            textShadow: '0 10px 24px rgba(0,0,0,0.45)',
            textAlign: 'center',
            textTransform: 'uppercase',
            opacity: minimalistTextTransitionOpacity,
          }}
        >
          {minimalistTextWords.map((word, index) => {
            const wordStart = video3Start + index * minimalistWordStep;
            const wordEnd = wordStart + minimalistWordRevealFrames;
            const wordOpacity = interpolate(frame, [wordStart, wordEnd], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.out(Easing.ease),
            });
            const wordTranslateY = interpolate(frame, [wordStart, wordEnd], [18, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.out(Easing.ease),
            });

            return (
              <span
                key={word + index}
                style={{
                  display: 'inline-block',
                  opacity: wordOpacity,
                  transform: `translateY(${wordTranslateY}px)`,
                  marginRight: index === minimalistTextWords.length - 1 ? 0 : 8,
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      </AbsoluteFill>
    </Sequence>
  );
};
