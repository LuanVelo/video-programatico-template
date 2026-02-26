export type TranscriptSegment = {
  startSec: number;
  endSec: number;
  text: string;
};

export type MotionTitlesTemplateProps = {
  audioSrc?: string;
  segments: TranscriptSegment[];
  blockStartSec?: number;
  blockEndSec?: number;
  variant?: 'default' | 'apple';
  backgroundVideos?: string[];
  logoSrc?: string;
};
