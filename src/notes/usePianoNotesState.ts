import { create as createZustand } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ActivePlayer } from '~/hooks/usePlayerMeta';

interface PianoNotesState {
  scores: Record<
    string,
    {
      clicks: number;
      score: number;
    }
  >;
  current_player: number;
  players: ActivePlayer[];
  remaining_players: string[];
  init: (players: ActivePlayer[]) => void;
  tick: (t?: number) => void;
}

const usePianoNotesState = createZustand<PianoNotesState>()(
  devtools(
    (set, get) =>
      ({
        scores: {},
        current_player: 0,
        players: [],
        remaining_players: [],
        init: (players) => {
          const scores = players.reduce<PianoNotesState['scores']>(
            (acc, player) => {
              acc[player.id] = {
                clicks: 0,
                score: 0,
              };
              return acc;
            },
            {},
          );
          set({
            scores,
            players,
            current_player: 0,
          });
        },
        tick: () => {},
      }) as PianoNotesState,
    {
      name: 'Eruditian Piano Notes State',
    },
  ),
);

export default usePianoNotesState;
