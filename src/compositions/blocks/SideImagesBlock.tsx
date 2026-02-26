import React from 'react';
import {AbsoluteFill, Img, Sequence} from 'remotion';

type SideImagesBlockProps = {
  sideImagesStart: number;
  video3Start: number;
  transitionFrames: number;
  sideImagesScale: number;
  sideImagesOpacity: number;
  sideImageWidth: number;
  sideImageHeight: number;
  oldImageSrc: string;
  newImageSrc: string;
};

export const SideImagesBlock: React.FC<SideImagesBlockProps> = ({
  sideImagesStart,
  video3Start,
  transitionFrames,
  sideImagesScale,
  sideImagesOpacity,
  sideImageWidth,
  sideImageHeight,
  oldImageSrc,
  newImageSrc,
}) => {
  return (
    <Sequence
      from={sideImagesStart}
      durationInFrames={Math.max(1, video3Start - sideImagesStart + transitionFrames)}
    >
      <AbsoluteFill style={{pointerEvents: 'none'}}>
        <div
          style={{
            position: 'absolute',
            left: 60,
            top: '50%',
            transform: `translateY(-50%) scale(${sideImagesScale})`,
            opacity: sideImagesOpacity,
            width: sideImageWidth,
            height: sideImageHeight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <Img
            src={oldImageSrc}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              mixBlendMode: 'multiply',
              filter: 'grayscale(1) contrast(12) brightness(1.25)',
            }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            right: 60,
            top: '50%',
            transform: `translateY(-50%) scale(${sideImagesScale})`,
            opacity: sideImagesOpacity,
            width: sideImageWidth,
            height: sideImageHeight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <Img
            src={newImageSrc}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              mixBlendMode: 'multiply',
              filter: 'grayscale(1) contrast(12) brightness(1.25)',
            }}
          />
        </div>
      </AbsoluteFill>
    </Sequence>
  );
};
