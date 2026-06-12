import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { getRandomInt } from '~/emath';

type PuzzleType = 'seq';

interface PuzzleState {
  newPuzzle: (type: PuzzleType, difficulty?: number) => void;
  type: PuzzleType;
  difficulty: number;
  seq_numbers: (number | undefined)[];
  seq_answers: number[];
  seq_done: boolean;
  next: () => undefined | Error;
  seqNext: () => undefined | Error;
}

const useMathPuzzleState = create<PuzzleState>()(
  devtools(
    (set, get) =>
      ({
        newPuzzle: (type, difficulty = 1) => {
          const { next } = get();
          set({
            type,
            difficulty,
          });
          next();
        },
        type: 'seq',
        difficulty: 1,

        seq_answers: [],
        seq_numbers: [],
        seq_done: false,
        seqNext: () => {
          const { seq_numbers, seq_done, difficulty } = get();
          if (seq_numbers.length > 0 && !seq_done) {
            return new Error('Not done');
          }
          if (difficulty === 1) {
            const start = getRandomInt(0, 9);
            const stepSize = getRandomInt(1, 3);
            const answers = Array(getRandomInt(5, 7))
              .fill(undefined)
              .map((_, i) => start + i * stepSize);
            const index_to_hide = getRandomInt(0, answers.length);
            const numbers: (number | undefined)[] = [...answers];
            numbers[index_to_hide] = undefined;
            set(
              {
                seq_answers: answers,
                seq_numbers: numbers,
                seq_done: false,
                difficulty: difficulty + 1,
              },
              undefined,
              'next: sequence',
            );
          }
        },

        next: () => {
          const { type, seqNext } = get();
          if (type === 'seq') {
            seqNext();
          }
        },
      }) as PuzzleState,
    { name: 'Math Puzzle State' },
  ),
);

export default useMathPuzzleState;
