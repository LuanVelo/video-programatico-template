import React from 'react';

type OpeningTextBlockProps = {
  overlayText: string;
  textOpacity: number;
  textTranslateY: number;
  textScale: number;
  detailScale: number;
  isDetailBold: boolean;
  scaledFont: (size: number) => number;
};

export const OpeningTextBlock: React.FC<OpeningTextBlockProps> = ({
  overlayText,
  textOpacity,
  textTranslateY,
  textScale,
  detailScale,
  isDetailBold,
  scaledFont,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 80px',
        fontFamily: 'DM Sans, system-ui, sans-serif',
        color: 'white',
        textAlign: 'center',
        fontWeight: 700,
        textTransform: 'uppercase',
        opacity: textOpacity,
        transform: `translateY(${textTranslateY}px) scale(${textScale})`,
      }}
    >
      <span
        style={{
          fontSize: scaledFont(38),
          fontWeight: 700,
          letterSpacing: -1.4,
          lineHeight: 1.05,
          textShadow: '0 12px 30px rgba(0,0,0,0.45)',
        }}
      >
        {overlayText.replace('detalhe.', '').replace('detalhe', '').trim()}{' '}
        <span
          style={{
            display: 'inline-block',
            fontWeight: 700,
            transform: `scale(${detailScale})`,
            transformOrigin: 'left center',
            color: 'white',
            textShadow: '0 12px 30px rgba(0,0,0,0.45)',
          }}
        >
          detalhe
        </span>
        .
      </span>
    </div>
  );
};
