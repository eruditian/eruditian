import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import z from 'zod/v4';
import { getRandomInt, shuffleArray } from '~/emath';

const zoneStateSchema = z.object({
  revealed: z.boolean(),
  index: z.number().min(0).max(120),
  picked: z.boolean(),
  active: z.boolean(),
});

type ZoneData = z.infer<typeof zoneStateSchema>;

export interface ZoneState extends ZoneData {
  onRevealEnd: () => void;
  onClick: () => void;
}

const patternStateDataSchema = z.object({
  /** The current phase of gameplay.
   *
   * revealing: This is true after a new round has been started and while
   * there are `active` zone indexes which has not been passed to `onRevealEnd(index)`.
   *
   * awaiting-init: True until any game has been started by calling `init()`.
   *
   * awaiting-input: True during gameplay, when game is awaiting player input.
   *
   * awaiting-next: True when a round has been completed and waiting for player to
   * call `nextRound()`.
   */
  phase: z.literal([
    'game-over',
    'awaiting-init',
    'revealing',
    'awaiting-input',
    'awaiting-next',
  ]),
  difficulty: z.number(),
  /** The state data for each zone. */
  zones: z.array(zoneStateSchema),
  /** A list of zone indices to show, per column. */
  pattern: z.array(z.array(z.number())),
});

export type PatternStateData = z.infer<typeof patternStateDataSchema>;

interface PatternState extends Omit<PatternStateData, 'zones'> {
  zones: ZoneState[];
  init: (difficulty?: number) => void;
  onRevealEnd: (zoneIdx: number) => void;
  nextRound: () => void;
  onZoneClick: (zoneIdx: number) => void;
  /** Returns an error if parsing of the state fails. */
  onResume: (state: PatternStateData) => undefined | Error;
  /** Stringify current state. This could be used to save game-state and resume it later.
   *
   * The string will be pretty-printed for sake of readability in this demo project.
   */
  stringify: () => string;
}

const getRandomUniqueValuesInRange = (
  min: number,
  max: number,
  count: number,
): number[] => {
  if (count > max - min) {
    throw new Error(
      'Requested more unique values than available in given range.',
    );
  }
  const available = Array(max - min)
    .fill(null)
    .map((_, i) => min + i);
  const uniques = Array(count)
    .fill(null)
    .reduce((acc) => {
      const idx = getRandomInt(0, available.length);
      acc.push(available[idx]);
      available.splice(idx, 1);
      return acc;
    }, [] as number[]);
  return uniques;
};

const usePatternState = create<PatternState>()(
  devtools(
    (set, get) =>
      ({
        difficulty: 0,
        phase: 'awaiting-init',
        zones: [],
        pattern: [],
        init: (difficulty = 1) => {
          set(
            {
              difficulty,
            },
            undefined,
            'init',
          );
          get().nextRound();
        },
        stringify: () => {
          //By default the the zod parser will strip anything that is not part
          //of the schema. In this case used to strip the functions from the
          //state and give safe-to-stringify data.
          //
          //It is possible to config Zod to error on superfluous props.
          const valid = patternStateDataSchema.safeParse(get());
          if (!valid.data) {
            throw new Error('Invalid state somehow!');
          }
          return JSON.stringify(valid.data, undefined, 2);
        },
        onResume: (state) => {
          const valid = patternStateDataSchema.safeParse(state);
          //Use zod to validate that the data is valid.
          //NOTE: This does not validate that the data makes sense in terms
          //of the game engine. For example if the indices in `pattern` have
          //been modified it may not match with `zones` any more.
          //In a prod scenario you would probably need a custom reviving/validator
          //function to ensure that the data is consistent with expectations.
          if (!valid.data) {
            return new Error('Tried to resume with invalid state.');
          }

          const { onZoneClick, onRevealEnd } = get();
          const zones = valid.data.zones.map<ZoneState>((z) => ({
            ...z,
            onRevealEnd: () => onRevealEnd(z.index),
            onClick: () => onZoneClick(z.index),
          }));
          set({ ...valid.data, zones });
        },
        onRevealEnd: (zoneIdx) => {
          const { zones } = get();
          const z: ZoneState = { ...zones[zoneIdx], revealed: false };

          const nextZones = zones.toSpliced(zoneIdx, 1, z);
          const anyRemainingUnrevealed = nextZones.some(
            ({ revealed }) => revealed,
          );
          set(
            {
              zones: nextZones,
              phase: anyRemainingUnrevealed ? 'revealing' : 'awaiting-input',
            },
            undefined,
            'onRevealEnd zone:' + zoneIdx,
          );
        },
        onZoneClick: (zoneIdx) => {
          const { zones } = get();

          const z: ZoneState = { ...zones[zoneIdx], picked: true };

          if (!z.active) {
            set({ phase: 'game-over' }, undefined, 'onZoneClick failed');
            return;
          }

          const nextZones = zones.toSpliced(zoneIdx, 1, z);
          const anyRemainingUnpicked = nextZones.some(
            ({ active, picked }) => active && !picked,
          );

          set(
            {
              phase: anyRemainingUnpicked ? 'awaiting-input' : 'awaiting-next',
              zones: nextZones,
            },
            undefined,
            'onZoneClick ' + zoneIdx,
          );
        },
        nextRound: () => {
          const { difficulty, onRevealEnd, onZoneClick } = get();
          const activeZonesCount = difficulty;
          const inactiveZonesCount = getRandomInt(
            Math.round(activeZonesCount / 2),
            activeZonesCount * 2,
          );

          const activeIndices = getRandomUniqueValuesInRange(
            0,
            activeZonesCount + inactiveZonesCount,
            activeZonesCount,
          );

          const zones = Array(activeZonesCount + inactiveZonesCount)
            .fill(null)
            .map<ZoneState>((_, i) => {
              const active = activeIndices.includes(i);
              return {
                index: i,
                revealed: active,
                active,
                picked: false,
                onRevealEnd: () => onRevealEnd(i),
                onClick: () => onZoneClick(i),
              };
            });
          const indices = zones.map(({ index }) => index);
          const columns = 5;
          const pattern = Array(columns)
            .fill(null)
            .reduce<number[][]>((acc, _, columnIdx) => {
              if (columnIdx === columns - 1) {
                acc.push(indices);
                return acc;
              }
              const countToGrab = getRandomInt(1, indices.length);
              acc.push(indices.splice(0, countToGrab));
              return acc;
            }, []);
          shuffleArray(pattern);

          set(
            {
              phase: 'revealing',
              zones,
              pattern,
              difficulty: difficulty + 1,
            },
            undefined,
            'nextRound',
          );
        },
      }) as PatternState,
    { name: 'Pattern State' },
  ),
);

export default usePatternState;
