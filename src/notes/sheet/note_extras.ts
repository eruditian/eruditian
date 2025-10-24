const sheet_note_names = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;
export const sheet_note_shift = sheet_note_names.reduce(
  (acc, n, i) => {
    acc[n] = i % 2 === 1;
    return acc;
  },
  {} as Record<SheetNoteName, boolean>,
);

export type SheetNoteName = (typeof sheet_note_names)[number];
export type SheetNoteDuration = 'full' | 'half' | 'quarter';

export interface SheetNote {
  name: SheetNoteName;
  octave: number;
  sharp?: boolean;
  duration?: SheetNoteDuration;
}
