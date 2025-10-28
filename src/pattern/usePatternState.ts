import { create as createZustand } from 'zustand';
import { devtools } from 'zustand/middleware';
import { getRandomInt } from '~/emath';
import { ActivePlayer } from '~/hooks/usePlayerMeta';

interface PatternState {
  zone_count: number;
  difficulty: number;
  wave: number;
  phase:
    | 'awaiting-next'
    | 'player-end'
    | 'awaiting-input'
    | 'revealing'
    | 'game-over';
  revealed: number[];
  pattern: number[];
  /** The zones which player has picked. */
  picked: number[];
  players: ActivePlayer[];
  remaining_players: ActivePlayer[];
  current_player_id?: string;
  init: (count: number, players: ActivePlayer[]) => void;
  onRevealEnd: (zone_index: number) => void;
  onZoneClick: (zone_index: number) => void;
  /** Signal next player is ready. */
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
        zone_count: 0,
        difficulty: 1,
        wave: 0,
        players: [],
        remaining_players: [],
        revealed: [],
        pattern: [],
        picked: [],
        phase: 'game-over',
        init: (count, players) => {
          set(
            {
              zone_count: count,
              difficulty: 1,
              wave: 0,
              players,
              remaining_players: players,
              pattern: [],
              picked: [],
              revealed: [],
            },
            undefined,
            'init',
          );
          get().nextRound();
        },
        onRevealEnd: (zone_index) => {
          const { revealed, phase } = get();
          if (phase !== 'revealing') {
            return;
          }

          const idx = revealed.findIndex((v) => v === zone_index);
          if (idx === -1) {
            return;
          }
          const revealed_next = revealed.toSpliced(idx, 1);
          set(
            {
              revealed: revealed_next,
              phase:
                revealed_next.length === 0 ? 'awaiting-input' : 'revealing',
            },
            undefined,
            'onRevealEnd',
          );
        },
        onZoneClick: (zone_index) => {
          const {
            current_player_id,
            pattern,
            phase,
            picked,
            remaining_players,
          } = get();
          if (phase !== 'awaiting-input') {
            return;
          }
          if (!pattern.includes(zone_index)) {
            const current_player_idx = remaining_players.findIndex(
              ({ id }) => id === current_player_id,
            );
            const remaining = [...remaining_players];
            if (current_player_idx > -1) {
              remaining.splice(current_player_idx, 1);
            }
            set(
              {
                remaining_players: remaining,
                phase: remaining.length === 0 ? 'game-over' : 'player-end',
              },
              undefined,
              'onZoneClick player failed',
            );
            return;
          }
          if (picked.includes(zone_index)) {
            return;
          }
          const updated_picked = [...picked, zone_index];
          const finished = updated_picked.length === pattern.length;
          set(
            {
              picked: finished ? [] : updated_picked,
              phase: finished ? 'awaiting-next' : phase,
            },
            undefined,
            'onZoneClick',
          );
        },
        nextRound: () => {
          const {
            remaining_players,
            current_player_id,
            difficulty,
            zone_count,
          } = get();
          const current_player_idx = remaining_players.findIndex(
            ({ id }) => id === current_player_id,
          );
          const loop = current_player_idx + 1 === remaining_players.length;
          const next_player_id =
            remaining_players[loop ? 0 : current_player_idx + 1].id;
          const next_difficulty = loop ? difficulty + 1 : difficulty;

          const active_zone_count = Math.min(
            next_difficulty * 2,
            (zone_count * 0.75) | 0, //Bitwise |0 will convert to signed int, discarding fractions.
          );

          const pattern = getRandomUniqueValuesInRange(
            0,
            zone_count,
            active_zone_count,
          );

          set(
            {
              current_player_id: next_player_id,
              pattern,
              picked: [],
              revealed: pattern,
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
