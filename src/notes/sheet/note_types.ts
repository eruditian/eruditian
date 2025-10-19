export type SheetNoteName =
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'B'
  | 'A'
  | 'C#'
  | 'D#'
  | 'F#'
  | 'G#'
  | 'A#';
export type SheetNoteDuration = 'full' | 'half' | 'quarter';

export interface SheetNote {
  name: SheetNoteName;
  octave: number;
  sharp?: boolean;
  duration?: SheetNoteDuration;
}
