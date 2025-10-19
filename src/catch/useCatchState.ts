import { create as createZustand } from 'zustand';
import { devtools } from 'zustand/middleware';
import { PlayerColor } from '~/hooks/usePlayerMeta';

import butterfly_blue from '../assets/catch/butterfly_blue.png';
import butterfly_cyan from '../assets/catch/butterfly_cyan.png';
import butterfly_green from '../assets/catch/butterfly_green.png';
import butterfly_pink from '../assets/catch/butterfly_pink.png';
import butterfly_purple from '../assets/catch/butterfly_purple.png';
import butterfly_yellow from '../assets/catch/butterfly_yellow.png';

import net_blue from '../assets/catch/net_blue.png';
import net_cyan from '../assets/catch/net_cyan.png';
import net_green from '../assets/catch/net_green.png';
import net_pink from '../assets/catch/net_pink.png';
import net_purple from '../assets/catch/net_purple.png';
import net_yellow from '../assets/catch/net_yellow.png';

import rock_angry from '../assets/catch/rock_angry.png';
import rock_happy from '../assets/catch/rock_happy.png';

const butterflies: Record<PlayerColor, string> = {
  blue: butterfly_blue,
  cyan: butterfly_cyan,
  green: butterfly_green,
  pink: butterfly_pink,
  purple: butterfly_purple,
  yellow: butterfly_yellow,
};
const nets: Record<PlayerColor, string> = {
  blue: net_blue,
  cyan: net_cyan,
  green: net_green,
  pink: net_pink,
  purple: net_purple,
  yellow: net_yellow,
};
const rocks: Record<'angry' | 'happy', string> = {
  angry: rock_angry,
  happy: rock_happy,
};

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
type TouchPoint = {
  x: number;
  y: number;
  index: number;
};

interface CatchState {
  phase: Phase;
  parcels: Parcel[];
  parcel_refs: HTMLDivElement[];
  net_refs?: [HTMLDivElement, HTMLDivElement, HTMLDivElement, HTMLDivElement];
  init: (
    net_refs: [HTMLDivElement, HTMLDivElement, HTMLDivElement, HTMLDivElement],
    parcel_refs: HTMLDivElement[],
    // players: ??[],
  ) => void;
  updateTouch: (points: TouchPoint[]) => void;
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
        parcels: [],
        parcel_refs: [],
        time: {
          delta: 0,
          last_frame: -1,
        },
        init: (net_refs, parcel_refs) => {
          set({
            net_refs,
            parcel_refs,
            phase: 'waiting_start',
          });
        },
        updateTouch: () => {},
        tick: (delta) => {
          const { phase } = get();
          if (phase === 'game-over') {
            return;
          }

          if (phase === 'waiting_start') {
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
