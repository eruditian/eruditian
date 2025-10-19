import { RefreshCcwIcon } from 'lucide-react';
import React from 'react';
import PlayerScore from '~/components/PlayerScore';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';
import usePianoNotesState from './usePianoNotesState';
import usePlayersMeta from '~/hooks/usePlayerMeta';
import { useShallow } from 'zustand/shallow';
import Sheet from './sheet/Sheet';

const Piano: React.FC = () => {
  const { players_meta } = usePlayersMeta();
  const init = usePianoNotesState(({ init }) => init);
  const players = usePianoNotesState(({ players }) => players);
  const current_player = usePianoNotesState(
    useShallow(({ current_player, players }) =>
      players.length > 0 ? players[current_player] : undefined,
    ),
  );

  return (
    <div
      className={cn(
        'inset-shadow-center-lg relative flex h-full flex-col items-center gap-2 inset-shadow-green-500/100 transition-shadow duration-300',
        current_player?.color === 'green' && 'inset-shadow-green-500/80',
        current_player?.color === 'blue' && 'inset-shadow-blue-600/90',
        current_player?.color === 'pink' && 'inset-shadow-pink-400/90',
        current_player?.color === 'cyan' && 'inset-shadow-cyan-500/80',
        current_player?.color === 'yellow' && 'inset-shadow-yellow-400/80',
        current_player?.color === 'purple' && 'inset-shadow-purple-500/90',
      )}
      onAuxClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div className="flex w-full items-center gap-4 pt-4">
        <p className="text-accent-foreground/70 ml-5 text-2xl font-bold">
          Piano note challenge
        </p>
        <div className="flex gap-3">
          {players.map((p) => (
            <PlayerScore
              key={p.id}
              player={p}
              score={0}
              current_player={current_player ? current_player.id : ''}
            />
          ))}
        </div>
      </div>
      <div
        className={cn(
          'absolute top-1/2 left-1/2 hidden -translate-1/2 items-center justify-center',
          // phase === 'game-over' && 'flex',
        )}
      >
        <div
          className="border-primary/50 flex cursor-pointer flex-col items-center justify-center gap-4 rounded border p-4"
          onClick={() => init(players_meta.active_players)}
          onAuxClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          Play again
          <Button variant="secondary" size="icon">
            <RefreshCcwIcon />
          </Button>
        </div>
      </div>
      <div className="flex w-1/3 basis-1/3 items-center p-4">
        <Sheet
          notes={[
            { name: 'G', octave: 4 },
            { name: 'A', octave: 5 },
            { name: 'B', octave: 5 },
            { name: 'C', octave: 5 },
          ]}
        />
      </div>
    </div>
  );
};

export default Piano;
