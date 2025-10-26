import { create as createZustand } from 'zustand';
import { devtools } from 'zustand/middleware';
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
    | 'awaiting-init'
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

const usePatternState = createZustand<PatternState>()(
  devtools(
    (set, get) =>
      ({
        zone_count: 0,
        difficulty: 0,
        wave: 0,
        players: [],
        remaining_players: [],
        revealed: [],
        pattern: [],
        picked: [],
        phase: 'awaiting-init',
        init: (count, players) => {
          set({
            zone_count: count,
            difficulty: 0,
            wave: 0,
            players,
            remaining_players: players,
            pattern: [],
            picked: [],
            revealed: [],
          });
        },
        onRevealEnd: (zone_index) => {
          const revealed = get().revealed;
          const idx = revealed.findIndex((v) => v === zone_index);
          if (idx === -1) {
            return;
          }

          set({
            revealed: revealed.toSpliced(idx, 1),
          });
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
              picked: updated_picked,
              phase: finished ? 'awaiting-next' : phase,
            },
            undefined,
            'onZoneClick',
          );
        },
        nextRound: () => {
          const { remaining_players, current_player_id, difficulty } = get();
          const current_player_idx = remaining_players.findIndex(
            ({ id }) => id === current_player_id,
          );
          const loop = current_player_idx + 1 === remaining_players.length;
          const next_player_id =
            remaining_players[loop ? 0 : current_player_idx + 1].id;
          const next_difficulty = loop ? difficulty + 1 : difficulty;

          set({
            current_player_id: next_player_id,
          });
        },
      }) as PatternState,
    {
      name: 'Eruditio Pattern State',
    },
  ),
);

export default usePatternState;
