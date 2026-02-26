import React from 'react';
import {AbsoluteFill, Easing, Sequence, interpolate} from 'remotion';

type LifestyleBlockProps = {
  frame: number;
  video4Start: number;
  durationInFrames: number;
  lifestyleLineWords: string[][];
  lifestyleLine1Start: number;
  lifestyleLine1End: number;
  lifestyleLine2Start: number;
  lifestyleLine2End: number;
  finalSceneTextFadeOpacity: number;
  scaledFont: (size: number) => number;
};

export const LifestyleBlock: React.FC<LifestyleBlockProps> = ({
  frame,
  video4Start,
  durationInFrames,
  lifestyleLineWords,
  lifestyleLine1Start,
  lifestyleLine1End,
  lifestyleLine2Start,
  lifestyleLine2End,
  finalSceneTextFadeOpacity,
  scaledFont,
}) => {
  return (
    <Sequence from={video4Start} durationInFrames={Math.max(1, durationInFrames - video4Start)}>
      <AbsoluteFill style={{pointerEvents: 'none'}}>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontFamily: 'DM Sans, system-ui, sans-serif',
            fontSize: scaledFont(30),
            fontWeight: 700,
            letterSpacing: -0.6,
            lineHeight: 1.1,
            textShadow: '0 10px 24px rgba(0,0,0,0.45)',
            textAlign: 'center',
            textTransform: 'uppercase',
            opacity: finalSceneTextFadeOpacity,
            maxWidth: '90%',
            whiteSpace: 'normal',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            {(() => {
              const isSecondLineActive = frame >= lifestyleLine2Start;
              const words = isSecondLineActive ? lifestyleLineWords[1] : lifestyleLineWords[0];
              const lineColor = 'white';
              const lineStart = isSecondLineActive ? lifestyleLine2Start : lifestyleLine1Start;
              const lineEnd = isSecondLineActive ? lifestyleLine2End : lifestyleLine1End;
              const lineDuration = Math.max(1, lineEnd - lineStart);
              const wordStep = words.length > 1 ? Math.max(3, Math.floor(lineDuration / (words.length + 1))) : 0;
              const wordRevealFrames = Math.max(8, Math.min(14, wordStep + 6));

              return (
                <div style={{display: 'inline-flex', justifyContent: 'center', alignItems: 'center'}}>
                  {words.map((word, wordIndex) => {
                    const wordStart = lineStart + wordIndex * wordStep;
                    const wordEnd = wordStart + wordRevealFrames;
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
                    const wordScale = interpolate(frame, [wordStart, wordEnd], [0.96, 1], {
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                    });

                    return (
                      <span
                        key={`${word}-${wordIndex}`}
                        style={{
                          display: 'inline-block',
                          color: lineColor,
                          opacity: wordOpacity,
                          transform: `translateY(${wordTranslateY}px) scale(${wordScale})`,
                          marginRight: wordIndex === words.length - 1 ? 0 : 8,
                        }}
                      >
                        {word}
                      </span>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>
      </AbsoluteFill>
    </Sequence>
  );
};
