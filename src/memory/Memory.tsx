import { FC, useEffect } from 'react';
import { cn } from '~/lib/utils';
import Card from './Card';
import useMemoryState from './useMemoryState';
import { Button } from '~/components/ui/button';
import { RefreshCcwIcon } from 'lucide-react';
import usePlayersMeta from '~/hooks/usePlayerMeta';
import PlayerScore from './PlayerScore';
import { useShallow } from 'zustand/shallow';

interface MemoryProps {
  count: number;
}

// const match_count = 2;

const Memory: FC<MemoryProps> = ({ count }) => {
  const { players_meta } = usePlayersMeta();

  const initMemory = useMemoryState(({ init }) => init);
  const cellClick = useMemoryState(({ cellClick }) => cellClick);
  const grid = useMemoryState(({ grid }) => grid);
  const completed = useMemoryState(({ completed }) => completed);
  const players = useMemoryState(({ players }) => players);
  const current_player = useMemoryState(
    useShallow(({ current_player, players }) =>
      players.length > 0 ? players[current_player] : undefined,
    ),
  );
  const scores = useMemoryState(({ scores }) => scores);

  useEffect(() => {
    initMemory(count, players_meta.active_players);
  }, [initMemory, count, players_meta]);

  return (
    <div
      className={cn(
        'inset-shadow-center-lg relative flex h-full flex-col gap-2 inset-shadow-green-500/100 transition-shadow duration-300',
        current_player?.color === 'green' && 'inset-shadow-green-500/80',
        current_player?.color === 'blue' && 'inset-shadow-blue-600/90',
        current_player?.color === 'pink' && 'inset-shadow-pink-400/90',
        current_player?.color === 'cyan' && 'inset-shadow-cyan-500/80',
        current_player?.color === 'yellow' && 'inset-shadow-yellow-400/80',
        current_player?.color === 'purple' && 'inset-shadow-purple-500/90',
      )}
    >
      <div className="flex items-center gap-4 pt-4">
        <p className="text-accent-foreground/70 ml-5 text-2xl font-bold">
          Memory
        </p>
        <div className="flex gap-3">
          {players.map((p) => (
            <PlayerScore
              key={p.id}
              player={p}
              score={scores[p.id]?.score || 0}
              current_player={current_player ? current_player.id : ''}
            />
          ))}
        </div>
      </div>
      <div className={cn('grid grow grid-cols-4 gap-6 px-8 pt-2 pb-16')}>
        {grid.map((cell) => (
          <Card key={cell.id} data={cell} onClick={() => cellClick(cell.id)} />
        ))}
      </div>
      {completed && (
        <div
          className="absolute top-1/2 left-1/2 w-0"
          onClick={() => initMemory(count, players_meta.active_players)}
        >
          <div className="bg-background/80 border-accent-foreground/70 relative flex w-80 -translate-1/2 flex-col items-center gap-2 rounded-md border p-4">
            Play again
            <Button variant="secondary" size="icon">
              <RefreshCcwIcon />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Memory;
