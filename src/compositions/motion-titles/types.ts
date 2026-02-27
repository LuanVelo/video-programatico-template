export type TranscriptSegment = {
  startSec: number;
  endSec: number;
  text: string;
};

export type MotionTitlesTemplateProps = {
  audioSrc?: string;
  audioOffsetSec?: number;
  audioDurationSec?: number;
  segments: TranscriptSegment[];
  blockStartSec?: number;
  blockEndSec?: number;
  variant?: 'default' | 'apple';
  backgroundVideos?: string[];
  threeColumnVideos?: string[];
  pimaTechBackgroundSrc?: string;
  unindoBackgroundSrc?: string;
  lastSequenceBackgroundSrc?: string;
  repensamosBackgroundSrc?: string;
  etiquetaFitVideoSrc?: string;
  audioCutsSec?: Array<{startSec: number; endSec: number}>;
  logoSrc?: string;
};
