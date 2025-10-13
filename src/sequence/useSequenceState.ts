import { create as createZustand } from 'zustand';
import { devtools } from 'zustand/middleware';

type Phase =
  | 'reveal'
  | 'input'
  | 'game-over'
  | 'transition-to-input'
  | 'transition-to-reveal';

// const durations = [400, 800, 1000, 2000, 3000];

interface SequenceState {
  next_timeout: number;
  values_to_pick_from: string[];
  phase: Phase;
  reveal_index: number;
  reveal: string;
  sequence: string[];
  /** Milliseconds that each number is displayed. */
  duration: number;
  answer_index: number;
  answers: string[];
  init: (values_to_pick_from?: string[], duration?: number) => void;
  tick: (t: number) => void;
  onAnswer: (value: string) => void;
}

const default_values_to_pick_from = Array(10)
  .fill(null)
  .map((_, i) => i.toString());

const useSequenceState = createZustand<SequenceState>()(
  devtools(
    (set, get) =>
      ({
        values_to_pick_from: [],
        next_timeout: 0,
        sequence: [],
        duration: 0,
        reveal: '',
        reveal_index: 0,
        answer_index: -1,
        answers: [],
        phase: 'game-over',

        init: (values_to_pick_from, duration = 800) => {
          console.log('values_to_pick_from', values_to_pick_from);
          values_to_pick_from =
            values_to_pick_from || default_values_to_pick_from;
          const sequence = [
            values_to_pick_from[
              Math.floor(Math.random() * values_to_pick_from.length)
            ],
          ];
          set({
            values_to_pick_from,
            duration,
            sequence,
            reveal: sequence[0],
            reveal_index: 0,
            next_timeout: performance.now() + duration,
            answer_index: 0,
            answers: [],
            phase: 'reveal',
          });
          requestAnimationFrame(get().tick);
        },

        onAnswer: (value) => {
          const {
            values_to_pick_from,
            answer_index,
            sequence,
            duration,
            answers,
          } = get();

          if (value !== sequence[answer_index]) {
            //Wrong answer, game over.
            set({
              reveal: '',
              phase: 'game-over',
              answers: [...answers, value],
            });
            return;
          }

          if (answer_index + 1 === sequence.length) {
            //Last index was answered, add to sequence and move to reveal.
            set({
              answer_index: 0,
              sequence: [
                ...sequence,
                values_to_pick_from[
                  Math.floor(Math.random() * values_to_pick_from.length)
                ],
              ],
              phase: 'transition-to-reveal',
              next_timeout: performance.now() + duration,
              answers: [...answers, sequence[answer_index]],
            });
            return;
          }

          set({
            answer_index: answer_index + 1,
            answers: [...answers, sequence[answer_index]],
          });
        },
        tick: () => {
          const { next_timeout, duration, phase, sequence, reveal_index } =
            get();
          if (phase === 'game-over') {
            return;
          }
          if (
            phase === 'reveal' ||
            phase === 'transition-to-input' ||
            phase === 'transition-to-reveal'
          ) {
            const diff = next_timeout - performance.now();
            if (diff > 0) {
              requestAnimationFrame(get().tick);
              return;
            }
            if (phase === 'transition-to-reveal') {
              set({
                next_timeout: performance.now() + duration,
                phase: 'reveal',
                reveal_index: 0,
                reveal: sequence[0],
                answers: [],
              });
              requestAnimationFrame(get().tick);
              return;
            }

            if (phase === 'transition-to-input') {
              set({
                next_timeout: performance.now() + duration,
                reveal: '',
                phase: 'input',
              });
              requestAnimationFrame(get().tick);
              return;
            }
            console.log('reveal_index', reveal_index);
            set({
              next_timeout: performance.now() + duration,
              reveal: sequence[reveal_index + 1],
              reveal_index: reveal_index + 1,
              phase:
                reveal_index + 2 >= sequence.length
                  ? 'transition-to-input'
                  : 'reveal',
            });
          }
          requestAnimationFrame(get().tick);
        },
      }) as SequenceState,
    {
      name: 'Eruditio Sequence State',
    },
  ),
);

export default useSequenceState;
