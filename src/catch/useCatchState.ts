import { create as createZustand } from 'zustand';
import { devtools } from 'zustand/middleware';
import { PlayerColor } from '~/hooks/usePlayerMeta';
import { stepTowards, Vec } from '~/emath';

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
  origin: Vec;
  /** Current position. */
  pos: Vec;
  /** Where it "goes away". */
  target: Vec;
  rotation: number;
  /** Visual scaling. */
  scale: number;
  /** Hitbox size. */
  size: number;
  velocity: number;
  image: string;
  /** Player id who should catch this parcel. If undefined it is a dangerous parcel! */
  catchable_by?: string;
}

type Phase = 'playing' | 'waiting_start' | 'game-over';
export type CatchTouchPoint = {
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
    // players: ??[],
  ) => void;
  updateTouch: (points: CatchTouchPoint[]) => void;
  updateCountdown: (delta_time: number) => void;
  tick: (delta_time: number) => void;
  /** Function called by itself as part of RequestAnimationFrame. It calls `tick` with frame delta. */
  tickRAF: (t: number) => void;
  countdown:
    | {
        time: number;
        display: string;
      }
    | undefined;
  time: {
    /** Delta from last frame. */
    delta: number;
    /** End of last frame as received from RAF. */
    last_frame_timestamp: number;
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
          last_frame_timestamp: -1,
        },
        countdown: undefined,
        init: (net_refs) => {
          set({
            net_refs,
            phase: 'waiting_start',
          });
        },
        updateTouch: () => {},
        updateCountdown: (delta) => {
          const { countdown } = get();
          if (!countdown) {
            set(
              {
                countdown: {
                  time: 3000,
                  display: '3',
                },
              },
              undefined,
              'tick; countdown init',
            );
            return;
          }
          const new_time = countdown.time - delta;
          if (new_time <= 0) {
            set(
              {
                countdown: undefined,
                phase: 'playing',
              },
              undefined,
              'tick; countdown finished',
            );
            return;
          }
          const display = Math.ceil(new_time).toString();
          if (display === countdown.display) {
            //The value to display has not updated. We can update by reference to save a render.
            countdown.time = new_time;
            return;
          }
          set(
            {
              countdown: {
                time: new_time,
                display: display,
              },
            },
            undefined,
            'tick; countdown update',
          );
        },
        tick: (delta) => {
          const { phase, parcels, parcel_refs, updateCountdown } = get();
          if (phase === 'game-over') {
            return;
          }

          if (phase === 'waiting_start') {
            updateCountdown(delta);
            return;
          }

          const updated = parcels.map((parcel) => ({
            ...parcel,
            pos: stepTowards(parcel.pos, parcel.target, parcel.velocity, delta),
          }));
          parcel_refs.forEach((ref, i) => {
            ref.style.top = updated[i].pos.x + '%';
          });

          set(
            {
              parcels: updated,
            },
            undefined,
            'tick',
          );
        },
        tickRAF: (t) => {
          const { time, tick, tickRAF } = get();
          if (time.last_frame_timestamp < 0) {
            time.last_frame_timestamp = t;
            requestAnimationFrame(tickRAF);
            return;
          }
          time.delta = t - time.last_frame_timestamp;
          tick(time.delta);
          requestAnimationFrame(tickRAF);
        },
      }) as CatchState,
    {
      name: 'Eruditio Catch State',
    },
  ),
);

export default useCatchState;
