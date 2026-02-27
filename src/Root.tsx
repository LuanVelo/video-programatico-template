import {getVideoMetadata} from '@remotion/media-utils';
import {Composition, staticFile} from 'remotion';
import {IntroVideo} from './compositions/IntroVideo';
import {getMotionTitleDuration, MotionTitlesTemplate} from './compositions/motion-titles';
import type {MotionTitlesTemplateProps} from './compositions/motion-titles';
import {Scene02} from './compositions/Scene02';

const videoSrc = staticFile('scene_01.mp4');
const videoSrc2 = staticFile('scene_01_video2.mp4');
const videoSrc3 = staticFile('picapau_minimalista.mp4');
const videoSrc4 = staticFile('lifestyle.mp4');
const introFillingSrc = staticFile('filling.mp4');
const introPersonalitySrc = staticFile('personalidade.mp4');
const bloco3Coluna01Src = staticFile('bloco3/coluna01.mp4');
const bloco3Coluna02Src = staticFile('bloco3/coluna02.mp4');
const bloco3Coluna03Src = staticFile('bloco3/coluna03.mp4');
const bloco3PimaTech01Src = staticFile('bloco3/pimatec-1.mp4');
const bloco3PimaTech02Src = staticFile('bloco3/pimatec-2.mp4');
const bloco3PimaTech03Src = staticFile('bloco3/pimatec-3.mp4');
const bloco3PimaSiteFrameSrc = staticFile('bloco3/pima-site-frame.png');
const bloco4VideoEtiquetaSrc = staticFile('bloco4/video-etiqueta.mp4');
const bloco4Coluna01Src = staticFile('bloco4/colunas/01.mp4');
const bloco4Coluna02Src = staticFile('bloco4/colunas/02.mp4');
const bloco4Coluna03Src = staticFile('bloco4/colunas/03.mp4');
const audioSrc = staticFile('audio.wav');
const audioNarracao03 = staticFile('narracao/audio_narracao_03.mp3');
const logoSrc = staticFile('reserva-logo.png');
const oldImageSrc = staticFile('antigo.jpeg');
const newImageSrc = staticFile('novo.png');
const cutStartSec = 0.2;
const bloco03StartSec = 31.656666666666666;
const pimaTechAnchorSec = 31.66;
const pimaTechTargetInBlockSec = (1 * 30 + 13) / 30; // 00:01.13 at 30fps
const pimaTechCurrentInBlockSec = pimaTechAnchorSec - bloco03StartSec;
const pimaTechSyncOffsetSec = Math.max(0, pimaTechTargetInBlockSec - pimaTechCurrentInBlockSec);
const pimaTechOriginalEndSec = 34.66;
const pimaTechTargetEndInBlockSec = (3 * 30 + 10) / 30; // with 00:01.13 trim => ends at 00:01.27
const pimaTechTargetEndSec = bloco03StartSec + pimaTechTargetEndInBlockSec;
const pimaTechCurrentEndSec = pimaTechOriginalEndSec + pimaTechSyncOffsetSec;
const pimaTechTailShiftSec = pimaTechTargetEndSec - pimaTechCurrentEndSec;
const respiraOriginalStartSec = 37.66;
const respiraTargetInBlockSec = (6 * 30 + 9) / 30; // shifted with start: 00:06.09
const respiraTargetSec = bloco03StartSec + respiraTargetInBlockSec;
const respiraCurrentStartSec = respiraOriginalStartSec + pimaTechSyncOffsetSec + pimaTechTailShiftSec;
const respiraTailShiftSec = respiraTargetSec - respiraCurrentStartSec;
const bloco03CutStartInBlockSec = (8 * 30 + 9) / 30; // shifted with start: 00:08.09
const bloco03CutEndInBlockSec = (10 * 30 + 6) / 30; // shifted with start: 00:10.06
const bloco03CutDurationSec = bloco03CutEndInBlockSec - bloco03CutStartInBlockSec;
const bloco03CutStartAbsoluteSec = bloco03StartSec + bloco03CutStartInBlockSec;
const bloco03CutEndAbsoluteSec = bloco03StartSec + bloco03CutEndInBlockSec;
const bloco03TrimStartInBlockSec = pimaTechTargetInBlockSec; // remove everything before 00:01.13

const sourceSegments = [
    {startSec: 0.66, endSec: 3.66, text: 'A evolução está no detalhe.'},
    {startSec: 3.66, endSec: 6.66, text: 'Bem-vindos à Reserva 2.0.'},
    {startSec: 6.66, endSec: 8.66, text: 'Diminuímos nossa assinatura.'},
    {startSec: 8.66, endSec: 11.66, text: 'O novo pica-pau é minimalista,'},
    {
      startSec: 11.66,
      endSec: 15.66,
      text: 'para que a sua personalidade apareça primeiro que a marca.',
    },
    {startSec: 16.66, endSec: 18.74, text: 'isso aqui é o nosso Neo line'},
    {startSec: 18.74, endSec: 20.71, text: 'a evolução do nosso line,'},
    {startSec: 20.71, endSec: 23.7, text: 'visual nobre, com performance,'},
    {startSec: 23.7, endSec: 27.8, text: 'Não amassa, estica e\nvolta para o lugar'},
    {startSec: 27.8, endSec: 31.66, text: 'E a nossa malha, mais amada, também evoluiu.'},
    {startSec: 31.66, endSec: 34.66, text: 'Viemos com o Pima Tech,'},
    {startSec: 34.66, endSec: 37.66, text: 'unindo o toque\ninsuperável do pima,'},
    {startSec: 37.66, endSec: 39.66, text: 'mas com tecnologia que respira.'},
    {startSec: 39.66, endSec: 44.13, text: 'Repensamos cada base,'},
    {startSec: 44.13, endSec: 46.13, text: 'de camisetas às calças.'},
    {
      startSec: 46.13,
      endSec: 50.13,
      text: 'As novas modelagens trazem um ajuste perfeito para cada corpo.',
    },
    {startSec: 50.13, endSec: 53.89, text: 'chega de dúvidas.'},
    {startSec: 53.89, endSec: 56.89, text: 'Nossa nova etiqueta fit sinaliza a modelagem'},
    {startSec: 56.89, endSec: 58.89, text: 'de um jeito visual e direto,'},
    {startSec: 58.89, endSec: 62.46, text: 'para você nunca mais errar.'},
    {startSec: 62.46, endSec: 64.46, text: 'Inovação que se lê.'},
    {startSec: 64.46, endSec: 68.46, text: 'Cada peça Tech agora tem seus pictogramas internos,'},
    {startSec: 68.46, endSec: 71.46, text: 'explicando exatamente as propriedades e diferenciais'},
    {startSec: 71.46, endSec: 74.83, text: 'daquele produto.'},
    {startSec: 74.83, endSec: 76.83, text: 'E para entender tudo isso,'},
    {startSec: 76.83, endSec: 78.83, text: 'criamos o tag explicativo.'},
    {startSec: 78.83, endSec: 84.72, text: 'É o nosso manual da inovação na palma da sua mão.'},
    {startSec: 84.72, endSec: 86.72, text: 'Versatilidade real.'},
    {startSec: 86.72, endSec: 88.72, text: 'Tecware que saiu do trabalho'},
    {startSec: 88.72, endSec: 91.72, text: 'para conquistar todas as ocasiões do seu dia.'},
  ];

const mapTimelineTime = (timeSec: number) => {
  const withAnchorSync = timeSec >= pimaTechAnchorSec ? timeSec + pimaTechSyncOffsetSec : timeSec;
  const withPimaEndSync = withAnchorSync >= pimaTechCurrentEndSec ? withAnchorSync + pimaTechTailShiftSec : withAnchorSync;
  const withRespiraSync = withPimaEndSync >= respiraCurrentStartSec ? withPimaEndSync + respiraTailShiftSec : withPimaEndSync;

  if (withRespiraSync >= bloco03CutEndAbsoluteSec) {
    return withRespiraSync - bloco03CutDurationSec;
  }

  if (withRespiraSync > bloco03CutStartAbsoluteSec) {
    return bloco03CutStartAbsoluteSec;
  }

  return withRespiraSync;
};

const syncedSourceSegments = sourceSegments.map((segment) => ({
  ...segment,
  startSec: mapTimelineTime(segment.startSec),
  endSec: mapTimelineTime(segment.endSec),
}));

const rebasedSegments = syncedSourceSegments
  .map((segment) => ({
    ...segment,
    startSec: Math.max(0, segment.startSec - cutStartSec),
    endSec: segment.endSec - cutStartSec,
  }))
  .filter((segment) => segment.endSec > 0);

const motionTitlesDefaultProps: MotionTitlesTemplateProps = {
  audioSrc: audioNarracao03,
  audioOffsetSec: cutStartSec,
  segments: rebasedSegments,
};

const bloco02TextStartSec =
  syncedSourceSegments.find((segment) => segment.text.toLowerCase().startsWith('isso aqui é'))?.startSec ??
  16.66;
const bloco02StartSec = Math.max(0, bloco02TextStartSec - 1);
const bloco02TrimSec = 1;
const bloco04TextStartSec =
  sourceSegments.find((segment) => segment.text.toLowerCase().startsWith('chega de dúvidas'))?.startSec ?? 50.13;
const bloco04DurationTargetSec = (20 * 30 + 17) / 30; // 00:20.17
const bloco04EndSec = bloco04TextStartSec + bloco04DurationTargetSec;
const bloco05TextStartSec =
  sourceSegments.find((segment) => segment.text.toLowerCase().startsWith('e para entender tudo isso'))?.startSec ??
  74.83;
const bloco04AudioCurrentStartSec = 3 + 29 / 30; // 00:03.29
const bloco04AudioTargetStartSec = 10 / 30; // 00:00.10
const bloco04AudioTrimAdvanceSec = bloco04AudioCurrentStartSec - bloco04AudioTargetStartSec; // 00:03.19

const sourceMotionTitleBlocksBase: Array<{id: string; startSec: number; endSec: number}> = [
  {id: 'intro-01', startSec: 0, endSec: 17.1},
  {
    id: 'Bloco-02-sobre-os-tecidos',
    startSec: bloco02StartSec + bloco02TrimSec,
    endSec: bloco02StartSec + 16.0,
  },
  {id: 'bloco-03-malha-mais-amada', startSec: bloco03StartSec, endSec: 50.0},
  {id: 'bloco-04-chega-de-duvidas', startSec: bloco04TextStartSec, endSec: bloco04EndSec},
  {id: 'bloco-05-entendendo', startSec: bloco05TextStartSec, endSec: 91.72},
];

const sourceMotionTitleBlocks = sourceMotionTitleBlocksBase.map((block) => ({
  ...block,
  startSec: mapTimelineTime(block.startSec),
  endSec: mapTimelineTime(block.endSec),
}));

const motionTitleBlocks = sourceMotionTitleBlocks
  .map((block) => ({
    ...block,
    startSec: Math.max(0, block.startSec - cutStartSec),
    endSec: block.endSec - cutStartSec,
  }))
  .filter((block) => block.endSec > 0);

const introOnlySegments = rebasedSegments.filter((segment) => segment.startSec < bloco02StartSec - cutStartSec);
const introExtendedSegments = introOnlySegments.map((segment, index) => {
  const isLast = index === introOnlySegments.length - 1;
  if (!isLast) {
    return segment;
  }
  return {
    ...segment,
    endSec: segment.endSec + 2,
  };
});

export const Root = () => {
  const calculateMetadata = async () => {
    const [metadata1, metadata2, metadata3, metadata4] = await Promise.all([
      getVideoMetadata(videoSrc),
      getVideoMetadata(videoSrc2),
      getVideoMetadata(videoSrc3),
      getVideoMetadata(videoSrc4),
    ]);
    const fps = 30;
    const secondBlockStart = 3 * fps + 13;
    const secondBlockDurationInFrames = 2 * fps;
    const secondBlockEnd = secondBlockStart + secondBlockDurationInFrames;
    const video2Start = secondBlockEnd;
    const video3Start = 9 * fps;
    const video4Start = 11 * fps + 13;
    const totalDurationInFrames = 15 * fps;

    return {
      durationInFrames: totalDurationInFrames,
      width: 1920,
      height: 1080,
      props: {
        videoSrc,
        videoSrc2,
        videoSrc3,
        videoSrc4,
        audioSrc,
        logoSrc,
        oldImageSrc,
        newImageSrc,
        overlayText: 'A evolução está no detalhe.',
        secondOverlayText: 'Bem-vindos\na Reserva 2.0',
        secondBlockStart,
        secondBlockEnd,
        video2Start,
        video3Start,
        video4Start,
        totalDurationInFrames,
      },
    };
  };

  return (
    <>
      <Composition
        id="IntroVideo"
        component={IntroVideo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        calculateMetadata={calculateMetadata}
        defaultProps={{
          videoSrc,
          videoSrc2,
          videoSrc3,
          videoSrc4,
          audioSrc,
          logoSrc,
          oldImageSrc,
          newImageSrc,
          overlayText: 'A evolução está no detalhe.',
          secondOverlayText: 'Bem-vindos\na Reserva 2.0',
          secondBlockStart: 103,
          secondBlockEnd: 163,
          video2Start: 163,
          video3Start: 270,
          video4Start: 343,
          totalDurationInFrames: 450,
        }}
      />

      <Composition
        id="02SobreTecidos"
        component={Scene02}
        durationInFrames={15 * 30}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="MotionTitlesTemplate"
        component={MotionTitlesTemplate}
        durationInFrames={getMotionTitleDuration(motionTitlesDefaultProps.segments, 30)}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={motionTitlesDefaultProps}
      />

      {motionTitleBlocks.map((block) => (
        (() => {
          const isIntroBlock = block.id === 'intro-01';
          const isBloco02 = block.id === 'Bloco-02-sobre-os-tecidos';
          const isBloco03 = block.id === 'bloco-03-malha-mais-amada';
          const isBloco04 = block.id === 'bloco-04-chega-de-duvidas';
          const blockSegments = isIntroBlock ? introExtendedSegments : motionTitlesDefaultProps.segments;
          const effectiveBlockStartSec = isBloco03 ? block.startSec + bloco03TrimStartInBlockSec : block.startSec;
          const effectiveAudioCutsSec = isBloco03
            ? [
                {
                  startSec: Math.max(0, bloco03CutStartInBlockSec - bloco03TrimStartInBlockSec),
                  endSec: Math.max(0, bloco03CutEndInBlockSec - bloco03TrimStartInBlockSec),
                },
              ].filter((cut) => cut.endSec > cut.startSec)
            : undefined;

          return (
        <Composition
          key={block.id}
          id={block.id}
          component={MotionTitlesTemplate}
          durationInFrames={getMotionTitleDuration(
            blockSegments,
            30,
            effectiveBlockStartSec,
            block.endSec,
          )}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            ...motionTitlesDefaultProps,
            segments: blockSegments,
            audioOffsetSec: isBloco04 ? cutStartSec + bloco04AudioTrimAdvanceSec : cutStartSec,
            blockStartSec: effectiveBlockStartSec,
            blockEndSec: block.endSec,
            audioDurationSec: isIntroBlock ? 15 : undefined,
            variant: isIntroBlock ? 'apple' : 'default',
            threeColumnVideos: isBloco02
              ? [bloco3Coluna01Src, bloco3Coluna02Src, bloco3Coluna03Src]
              : isBloco04
                ? [bloco4Coluna01Src, bloco4Coluna02Src, bloco4Coluna03Src]
                : undefined,
            pimaTechBackgroundSrc: isBloco03 ? bloco3PimaTech01Src : undefined,
            unindoBackgroundSrc: isBloco03 ? bloco3PimaTech02Src : undefined,
            lastSequenceBackgroundSrc: isBloco03 ? bloco3PimaTech03Src : undefined,
            repensamosBackgroundSrc: isBloco03 ? bloco3PimaSiteFrameSrc : undefined,
            etiquetaFitVideoSrc: isBloco04 ? bloco4VideoEtiquetaSrc : undefined,
            audioCutsSec: effectiveAudioCutsSec,
            backgroundVideos:
              isIntroBlock
                ? [videoSrc, introFillingSrc, videoSrc3, introPersonalitySrc]
                : undefined,
            logoSrc: isIntroBlock ? logoSrc : undefined,
          }}
        />
          );
        })()
      ))}
    </>
  );
};
