import { create as createZustand } from 'zustand';
import { devtools } from 'zustand/middleware';
import { getRandomInt } from '~/emath';

export interface ZoneState {
  revealed: boolean;
  picked: boolean;
  index: number;
  onClick: () => void;
  onAnimationEnd: () => void;
  active: boolean;
}
interface PatternState {
  difficulty: number;
  phase: 'awaiting-next' | 'awaiting-input' | 'revealing' | 'game-over';
  zones: ZoneState[];
  pattern: [number[], number[], number[], number[]];
  init: (difficulty: number) => void;
  onRevealEnd: (zone_index: number) => void;
  onZoneClick: (zone_index: number) => void;
  nextRound: () => void;
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

const usePatternState = createZustand<PatternState>()(
  devtools(
    (set, get) =>
      ({
        difficulty: 0,
        pattern: [[], [], [], []],
        phase: 'game-over',
        zones: [],
        init: (difficulty = 2) => {
          set(
            {
              //Difficulty dropped by one because nextRound() will increment it.
              difficulty: Math.max(0, difficulty - 1),
              pattern: [[], [], [], []],
            },
            undefined,
            'init',
          );
          get().nextRound();
        },
        onRevealEnd: (zone_index) => {
          const { zones, phase } = get();
          if (phase !== 'revealing') {
            return;
          }

          const z: ZoneState = { ...zones[zone_index], revealed: false };
          const next_zones = zones.toSpliced(zone_index, 1, z);
          const remaining_revealed = next_zones.filter(
            ({ revealed }) => !revealed,
          );
          set(
            {
              zones: next_zones,
              phase:
                remaining_revealed.length === 0
                  ? 'awaiting-input'
                  : 'revealing',
            },
            undefined,
            'onRevealEnd',
          );
        },
        onZoneClick: (zone_index) => {
          const { zones, phase } = get();
          if (phase !== 'awaiting-input') {
            return;
          }
          const z = { ...zones[zone_index], picked: true };
          if (!z.active) {
            set(
              {
                phase: 'game-over',
              },
              undefined,
              'onZoneClick player failed',
            );
            return;
          }
          const finished = zones.some(
            ({ active, picked }) => active && !picked,
          );
          set(
            {
              zones: zones.toSpliced(zone_index, 1, z),
              phase: finished ? 'awaiting-next' : phase,
            },
            undefined,
            'onZoneClick',
          );
        },
        nextRound: () => {
          const { difficulty, onRevealEnd, onZoneClick } = get();

          const next_difficulty = difficulty;

          const active_zone_count = next_difficulty * 2;
          const dead_zone_count =
            active_zone_count +
            getRandomInt(
              Math.round(active_zone_count / 2),
              Math.round(active_zone_count * 1.2),
            );

          const active_indices = getRandomUniqueValuesInRange(
            0,
            active_zone_count + dead_zone_count,
            active_zone_count,
          );

          const zones = Array(active_zone_count + dead_zone_count)
            .fill(null)
            .map<ZoneState>((_, i) => {
              const active = active_indices.includes(i);
              return {
                active,
                index: i,
                onClick: () => onZoneClick(i),
                revealed: active,
                onAnimationEnd: () => onRevealEnd(i),
                picked: false,
              };
            });
          const indices = zones.map(({ index }) => index);
          const columns = 4;
          const pattern = Array(columns)
            .fill(null)
            .reduce<PatternState['pattern']>(
              (acc, _, column_index) => {
                if (column_index === columns - 1) {
                  acc[column_index] = indices;
                  return acc;
                }
                const idx = getRandomInt(0, indices.length);
                acc[column_index] = indices.splice(0, idx);
                return acc;
              },
              [[], [], [], []],
            );

          set(
            {
              zones,
              pattern,
              difficulty: next_difficulty,
              phase: 'revealing',
            },
            undefined,
            'nextRound',
          );
        },
      }) as PatternState,
    {
      name: 'Eruditio Pattern State',
    },
  ),
);

export default usePatternState;
