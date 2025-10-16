import { create as createZustand } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ActiveEruditioPlayer } from '~/hooks/usePlayerMeta';

type Phase = 'await-start' | 'playing' | 'game-over';

export interface Bounds {
  /** X (left) component of top-left-corner. */
  x: number;
  /** Y (top) component of top-left-corner. */
  y: number;
  width: number;
  height: number;
  x2: number;
  y2: number;
}

export interface Point {
  x: number;
  y: number;
}

interface TargetPoint {
  radius: number;
  x: number;
  y: number;
}

/** Should be a reference that is directly updated as touch positions change. */
export type TouchPointsRef = [Point, Point, Point, Point];

interface TraceState {
  container?: HTMLDivElement;
  bounds: Bounds;
  target_refs?: [
    HTMLDivElement,
    HTMLDivElement,
    HTMLDivElement,
    HTMLDivElement,
  ];
  /** A reference to an array that should be directly updated as touch positions change.
   * The game loop will periodically read these values.
   */
  touch_points?: TouchPointsRef;
  time: {
    start: number;
    last_frame: number;
    delta: number;
  };
  targets: TargetPoint[];
  phase: Phase;
  players: ActiveEruditioPlayer[];
  init: (
    container_ref: HTMLDivElement,
    target_refs: [
      HTMLDivElement,
      HTMLDivElement,
      HTMLDivElement,
      HTMLDivElement,
    ],
    touch_points_ref: TouchPointsRef,
    players: ActiveEruditioPlayer[],
  ) => void;
  tick: (t: number) => void;
}

const useTraceState = createZustand<TraceState>()(
  devtools(
    (set, get) =>
      ({
        phase: 'game-over',
        bounds: {
          x: 0,
          y: 0,
          width: 500,
          height: 500,
          x2: 500,
          y2: 500,
        },
        targets: [],
        time: {
          start: 0,
          last_frame: 0,
          delta: 0,
        },
        players: [],

        init: (container, target_refs, touch_points, players) => {
          const bbox = container.getBoundingClientRect();
          const bounds: Bounds = {
            x: bbox.x,
            y: bbox.y,
            width: bbox.width,
            height: bbox.height,
            x2: bbox.right,
            y2: bbox.bottom,
          };
          set(
            {
              container,
              bounds,
              target_refs,
              touch_points,
              players,
              phase: 'await-start',
              time: {
                start: performance.now(),
                last_frame: performance.now(),
                delta: 0,
              },
            },
            undefined,
            'init',
          );
          requestAnimationFrame(get().tick);
        },

        tick: () => {
          const { phase, time, touch_points } = get();
          time.delta = performance.now() - time.last_frame;
          time.last_frame = performance.now();

          if (!touch_points) {
            throw new Error('Tick without touch_points reference object.');
          }

          if (phase === 'game-over') {
            return;
          }

          if (phase === 'await-start') {
            // set({});
            return;
          }
          requestAnimationFrame(get().tick);
        },
      }) as TraceState,
    {
      name: 'Eruditio Trace State',
    },
  ),
);

export default useTraceState;
