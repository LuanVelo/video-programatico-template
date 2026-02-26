import React from 'react';
import {Audio, Video} from '@remotion/media';
import {AbsoluteFill, Sequence} from 'remotion';

type MediaLayersBlockProps = {
  videoSrc: string;
  videoSrc2: string;
  videoSrc3: string;
  videoSrc4: string;
  audioSrc: string;
  durationInFrames: number;
  video2Start: number;
  video3Start: number;
  video4Start: number;
  firstVideoFadeEnd: number;
  firstVideoOpacity: number;
  secondVideoOpacity: number;
  thirdVideoOpacity: number;
  fourthVideoOpacity: number;
  finalSceneWhiteBgOpacity: number;
};

export const MediaLayersBlock: React.FC<MediaLayersBlockProps> = ({
  videoSrc,
  videoSrc2,
  videoSrc3,
  videoSrc4,
  audioSrc,
  durationInFrames,
  video2Start,
  video3Start,
  video4Start,
  firstVideoFadeEnd,
  firstVideoOpacity,
  secondVideoOpacity,
  thirdVideoOpacity,
  fourthVideoOpacity,
  finalSceneWhiteBgOpacity,
}) => {
  return (
    <>
      <Sequence from={0} durationInFrames={firstVideoFadeEnd}>
        <Video
          src={videoSrc}
          muted
          style={{width: '100%', height: '100%', objectFit: 'cover', opacity: firstVideoOpacity}}
        />
      </Sequence>
      <Sequence from={video2Start} durationInFrames={Math.max(1, durationInFrames - video2Start)}>
        <Video
          src={videoSrc2}
          muted
          style={{width: '100%', height: '100%', objectFit: 'cover', opacity: secondVideoOpacity}}
        />
      </Sequence>
      <Sequence from={video3Start} durationInFrames={Math.max(1, durationInFrames - video3Start)}>
        <Video
          src={videoSrc3}
          muted
          style={{width: '100%', height: '100%', objectFit: 'cover', opacity: thirdVideoOpacity}}
        />
      </Sequence>
      <Sequence from={video4Start} durationInFrames={Math.max(1, durationInFrames - video4Start)}>
        <Video
          src={videoSrc4}
          muted
          style={{width: '100%', height: '100%', objectFit: 'cover', opacity: fourthVideoOpacity}}
        />
      </Sequence>
      <Sequence from={video4Start} durationInFrames={Math.max(1, durationInFrames - video4Start)}>
        <AbsoluteFill style={{backgroundColor: 'white', opacity: finalSceneWhiteBgOpacity}} />
      </Sequence>
      <Audio src={audioSrc} />
    </>
  );
};
