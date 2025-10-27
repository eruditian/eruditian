import React from 'react';
import { RefreshCcwIcon } from 'lucide-react';
import { Button } from '~/components/ui/button';
import usePlayersMeta from '~/hooks/usePlayerMeta';
import { cn } from '~/lib/utils';
import PlayerScore from '~/memory/PlayerScore';
import Zone from './Zone';
import usePatternState from './usePatternState';

const rows = Array(4).fill(null);
const cols = Array(3).fill(null);

const Pattern: React.FC = () => {
  const { players_meta } = usePlayersMeta();
  const phase = usePatternState(({ phase }) => phase);
  const revealed = usePatternState(({ revealed }) => revealed);
  const picked = usePatternState(({ picked }) => picked);
  const players = usePatternState(({ players }) => players);

  const onRevealEnd = usePatternState(({ onRevealEnd }) => onRevealEnd);
  const onZoneClick = usePatternState(({ onZoneClick }) => onZoneClick);
  const init = usePatternState(({ init }) => init);
  console.log('revealed', phase, revealed);
  const current_player = players_meta.active_players[0];
  const zones = 10;
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
          Pattern
        </p>
        <div className="flex gap-3">
          {players_meta.active_players.map((p) => (
            <PlayerScore
              key={p.id}
              player={p}
              score={0}
              current_player={current_player ? current_player.id : ''}
            />
          ))}
        </div>
      </div>
      <div className="flex grow items-center gap-2 px-8">
        {cols.map((_, col) => (
          <div
            key={'col_' + col}
            className="flex h-full grow flex-col items-center justify-around"
          >
            {rows.map((_, row) => (
              <Zone
                key={'zone_' + col + '_' + row}
                count={zones}
                column={col}
                row={row}
                onClick={onZoneClick}
                onAnimationEnd={onRevealEnd}
                highlighted={revealed}
              />
            ))}
          </div>
        ))}
      </div>
      {phase === 'game-over' && (
        <div
          className="absolute top-1/2 left-1/2 w-0"
          onClick={() => {
            init(zones, players_meta.active_players);
          }}
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

export default Pattern;
