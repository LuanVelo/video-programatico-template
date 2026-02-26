import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {LifestyleBlock} from './blocks/LifestyleBlock';
import {MediaLayersBlock} from './blocks/MediaLayersBlock';
import {MinimalistBlock} from './blocks/MinimalistBlock';
import {OpeningTextBlock} from './blocks/OpeningTextBlock';
import {SideImagesBlock} from './blocks/SideImagesBlock';
import {SignatureBlock} from './blocks/SignatureBlock';
import {WelcomeBlock} from './blocks/WelcomeBlock';

type IntroVideoProps = {
  videoSrc: string;
  videoSrc2: string;
  videoSrc3: string;
  videoSrc4: string;
  audioSrc: string;
  logoSrc: string;
  oldImageSrc: string;
  newImageSrc: string;
  overlayText: string;
  secondOverlayText: string;
  secondBlockStart: number;
  secondBlockEnd: number;
  video2Start: number;
  video3Start: number;
  video4Start: number;
  totalDurationInFrames: number;
};

export const IntroVideo: React.FC<IntroVideoProps> = ({
  videoSrc,
  videoSrc2,
  videoSrc3,
  videoSrc4,
  audioSrc,
  logoSrc,
  oldImageSrc,
  newImageSrc,
  overlayText,
  secondOverlayText,
  secondBlockStart,
  secondBlockEnd,
  video2Start,
  video3Start,
  video4Start,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps, width, height} = useVideoConfig();

  const typographyScale = Math.min(width / 768, height / 480);
  const scaledFont = (size: number) => Math.round(size * typographyScale);
  const transitionFrames = 8;

  const textFullyVisibleAt = Math.min(durationInFrames - 1, 1 * fps + 25);
  const textMustBeGoneAt = Math.min(durationInFrames - 1, 3 * fps + 10);
  const textEnterEnd = textFullyVisibleAt;
  const textEnterStart = Math.max(0, textEnterEnd - 20);
  const textExitStart = Math.max(textEnterEnd + 12, textMustBeGoneAt - 18);
  const textExitEnd = textMustBeGoneAt;

  const textOpacity = interpolate(
    frame,
    [textEnterStart, textEnterEnd, textExitStart, textExitEnd],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.ease),
    },
  );

  const textTranslateY = interpolate(
    frame,
    [textEnterStart, textEnterEnd, textExitStart, textExitEnd],
    [40, 0, 0, -24],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.ease),
    },
  );

  const textScale = interpolate(frame, [textEnterStart, textEnterEnd], [0.96, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const detailHighlightStart = Math.max(textEnterEnd + 8, textMustBeGoneAt - 32);
  const detailHighlightPeak = detailHighlightStart + 6;
  const detailHighlightEnd = Math.min(durationInFrames - 10, detailHighlightStart + 16);

  const detailScale = interpolate(
    frame,
    [detailHighlightStart, detailHighlightPeak, detailHighlightEnd],
    [1, 1.12, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.ease),
    },
  );

  const isDetailBold = frame >= detailHighlightStart && frame <= detailHighlightEnd;

  const firstVideoFadeEnd = secondBlockStart + 1;
  const firstVideoOpacity = interpolate(frame, [secondBlockStart, firstVideoFadeEnd], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.ease),
  });

  const secondVideoOpacity = interpolate(
    frame,
    [video2Start, video2Start + transitionFrames, video3Start, video3Start + transitionFrames],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.ease),
    },
  );

  const thirdVideoOpacity = interpolate(
    frame,
    [video3Start, video3Start + transitionFrames, video4Start, video4Start + transitionFrames],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.ease),
    },
  );

  const fourthVideoIntroOpacity = interpolate(frame, [video4Start, video4Start + transitionFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.ease),
  });

  const secondTextEnterStart = secondBlockStart + 4;
  const secondTextEnterEnd = secondTextEnterStart + 18;
  const secondTextExitEnd = secondBlockEnd - 1;
  const secondTextExitStart = Math.max(secondTextEnterEnd + 12, secondTextExitEnd - 10);
  const secondTextLines = secondOverlayText.split('\n').filter(Boolean);
  const firstLine = secondTextLines[0] ?? 'Bem-vindos';
  const secondLine = secondTextLines[1] ?? 'a Reserva 2.0';
  const [beforeReserva, afterReserva] = secondLine.split(/Reserva/i);

  const sideImagesStart = 7 * fps;
  const signatureTextStart = 7 * fps;
  const signatureTextEnd = 8 * fps + 17;
  const signatureTextEnterEnd = signatureTextStart + 14;
  const signatureTextExitStart = Math.max(signatureTextEnterEnd + 10, signatureTextEnd - 8);

  const signatureTextOpacity = interpolate(
    frame,
    [signatureTextStart, signatureTextEnterEnd, signatureTextExitStart, signatureTextEnd],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.ease),
    },
  );

  const signatureTextScale = interpolate(frame, [signatureTextStart, signatureTextEnterEnd], [0.96, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const sideImagesOpacity = interpolate(
    frame,
    [sideImagesStart, sideImagesStart + transitionFrames, video3Start, video3Start + transitionFrames],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.ease),
    },
  );

  const sideImagesScale = interpolate(frame, [sideImagesStart, sideImagesStart + 8], [0.96, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.ease),
  });

  const sideImageWidth = Math.round(width * 0.28);
  const sideImageHeight = Math.round(height * 0.56);

  const minimalistTextWords = ['O', 'novo', 'pica-pau', 'é', 'minimalista'];
  const minimalistWordStep = 6;
  const minimalistWordRevealFrames = 10;

  const lifestyleLines = ['Para que a sua personalidade', 'apareça primeiro que a marca'];
  const lifestyleLineWords = lifestyleLines.map((line) => line.split(' '));
  const lifestyleLine1Start = video4Start;
  const lifestyleLine1End = 13 * fps + 11;
  const lifestyleLine2Start = lifestyleLine1End;
  const lifestyleLine2End = 15 * fps + 4;

  const lifestyleTransitionStart = Math.min(durationInFrames - 1, lifestyleLine2End);
  const lifestyleTransitionEnd = Math.max(
    lifestyleTransitionStart + 1,
    Math.min(durationInFrames - 1, lifestyleTransitionStart + 14),
  );

  const finalSceneVideoFadeOpacity = interpolate(
    frame,
    [lifestyleTransitionStart, lifestyleTransitionEnd],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.ease),
    },
  );

  const finalSceneTextFadeOpacity = interpolate(
    frame,
    [lifestyleTransitionStart, lifestyleTransitionEnd],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.ease),
    },
  );

  const finalSceneWhiteBgOpacity = interpolate(
    frame,
    [lifestyleTransitionStart, lifestyleTransitionEnd],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.ease),
    },
  );

  const fourthVideoOpacity = fourthVideoIntroOpacity * finalSceneVideoFadeOpacity;

  const minimalistTextTransitionOpacity = interpolate(
    frame,
    [video4Start, video4Start + transitionFrames],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.ease),
    },
  );

  return (
    <AbsoluteFill>
      <MediaLayersBlock
        videoSrc={videoSrc}
        videoSrc2={videoSrc2}
        videoSrc3={videoSrc3}
        videoSrc4={videoSrc4}
        audioSrc={audioSrc}
        durationInFrames={durationInFrames}
        video2Start={video2Start}
        video3Start={video3Start}
        video4Start={video4Start}
        firstVideoFadeEnd={firstVideoFadeEnd}
        firstVideoOpacity={firstVideoOpacity}
        secondVideoOpacity={secondVideoOpacity}
        thirdVideoOpacity={thirdVideoOpacity}
        fourthVideoOpacity={fourthVideoOpacity}
        finalSceneWhiteBgOpacity={finalSceneWhiteBgOpacity}
      />

      <OpeningTextBlock
        overlayText={overlayText}
        textOpacity={textOpacity}
        textTranslateY={textTranslateY}
        textScale={textScale}
        detailScale={detailScale}
        isDetailBold={isDetailBold}
        scaledFont={scaledFont}
      />

      <WelcomeBlock
        frame={frame}
        secondBlockStart={secondBlockStart}
        secondBlockEnd={secondBlockEnd}
        secondTextEnterStart={secondTextEnterStart}
        secondTextEnterEnd={secondTextEnterEnd}
        secondTextExitStart={secondTextExitStart}
        secondTextExitEnd={secondTextExitEnd}
        firstLine={firstLine}
        secondLine={secondLine}
        beforeReserva={beforeReserva}
        afterReserva={afterReserva}
        logoSrc={logoSrc}
        scaledFont={scaledFont}
      />

      <SideImagesBlock
        sideImagesStart={sideImagesStart}
        video3Start={video3Start}
        transitionFrames={transitionFrames}
        sideImagesScale={sideImagesScale}
        sideImagesOpacity={sideImagesOpacity}
        sideImageWidth={sideImageWidth}
        sideImageHeight={sideImageHeight}
        oldImageSrc={oldImageSrc}
        newImageSrc={newImageSrc}
      />

      <SignatureBlock
        frame={frame}
        signatureTextStart={signatureTextStart}
        signatureTextEnd={signatureTextEnd}
        signatureTextEnterEnd={signatureTextEnterEnd}
        signatureTextExitStart={signatureTextExitStart}
        signatureTextOpacity={signatureTextOpacity}
        signatureTextScale={signatureTextScale}
        scaledFont={scaledFont}
      />

      <MinimalistBlock
        frame={frame}
        video3Start={video3Start}
        video4Start={video4Start}
        transitionFrames={transitionFrames}
        minimalistTextWords={minimalistTextWords}
        minimalistWordStep={minimalistWordStep}
        minimalistWordRevealFrames={minimalistWordRevealFrames}
        minimalistTextTransitionOpacity={minimalistTextTransitionOpacity}
        scaledFont={scaledFont}
      />

      <LifestyleBlock
        frame={frame}
        video4Start={video4Start}
        durationInFrames={durationInFrames}
        lifestyleLineWords={lifestyleLineWords}
        lifestyleLine1Start={lifestyleLine1Start}
        lifestyleLine1End={lifestyleLine1End}
        lifestyleLine2Start={lifestyleLine2Start}
        lifestyleLine2End={lifestyleLine2End}
        finalSceneTextFadeOpacity={finalSceneTextFadeOpacity}
        scaledFont={scaledFont}
      />
    </AbsoluteFill>
  );
};
