import { create as createZustand } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Parcel {
  x: number;
  y: number;
  /** The current offset from the original spawn x-location. */
  x_offset: number;
  /** Visual scaling. */
  rotation: number;
  scale: number;
  /** Hitbox size. */
  size: number;
  velocity: number;
  image: string;
  /** Player id who should catch this parcel. If undefined it is dangerous! */
  catchable_by?: string;
}

type Phase = 'playing' | 'waiting_start' | 'game-over';

interface CatchState {
  phase: Phase;
  tick: (delta_time: number) => void;
  tickRAF: (t: number) => void;
  time: {
    delta: number;
    last_frame: number;
  };
}

const useCatchState = createZustand<CatchState>()(
  devtools(
    (set, get) =>
      ({
        phase: 'game-over',

        tick: (delta) => {
          const { phase } = get();
          if (phase === 'game-over') {
            return;
          }

          requestAnimationFrame(get().tickRAF);
        },
        tickRAF: (t) => {
          const { time, tick, tickRAF } = get();
          if (time.last_frame < 0) {
            time.last_frame = t;
            requestAnimationFrame(tickRAF);
            return;
          }
          time.delta = t - time.last_frame;
          tick(time.delta);
          requestAnimationFrame(tickRAF);
        },
      }) as CatchState,
    {
      name: 'Eruditio Sequence State',
    },
  ),
);

export default useCatchState;
