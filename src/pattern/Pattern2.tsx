import React from 'react';
import { ArrowBigRight, RefreshCcwIcon, UserIcon } from 'lucide-react';
import { Button } from '~/components/ui/button';
import usePlayersMeta from '~/hooks/usePlayerMeta';
import { cn } from '~/lib/utils';
// import PlayerScore from '~/memory/PlayerScore';
import Zone from './Zone2';
import usePatternState2 from './usePatternState2';

const Pattern: React.FC = () => {
  const { players_meta } = usePlayersMeta();
  const phase = usePatternState2(({ phase }) => phase);
  const pattern = usePatternState2(({ pattern }) => pattern);
  const zones = usePatternState2(({ zones }) => zones);
  const difficulty = usePatternState2(({ difficulty }) => difficulty);
  const init = usePatternState2(({ init }) => init);
  const nextRound = usePatternState2(({ nextRound }) => nextRound);

  const current_player =
    phase === 'awaiting-input' ? players_meta.active_players[0] : undefined;
  return (
    <div
      className={cn(
        'inset-shadow-center-lg inset-shadow-accent/0 relative flex h-full flex-col items-center gap-2 pb-8 transition-shadow duration-300',
        current_player?.color === 'green' && 'inset-shadow-green-500/80',
        current_player?.color === 'blue' && 'inset-shadow-blue-600/90',
        current_player?.color === 'pink' && 'inset-shadow-pink-400/90',
        current_player?.color === 'cyan' && 'inset-shadow-cyan-500/80',
        current_player?.color === 'yellow' && 'inset-shadow-yellow-400/80',
        current_player?.color === 'purple' && 'inset-shadow-purple-500/90',
      )}
    >
      <div className="flex w-full items-center gap-4 pt-4">
        <p className="text-accent-foreground/70 ml-5 text-2xl font-bold">
          Pattern
        </p>
        <div className="flex gap-3">
          {/* {players_meta.active_players.map((p) => (
            <PlayerScore
              key={p.id}
              player={p}
              score={0}
              current_player={current_player ? current_player.id : ''}
            />
          ))} */}
        </div>
      </div>
      <div className="flex w-[min(100vh/1.5,100%)] grow items-center gap-8 overflow-hidden p-8">
        {pattern.map((zone_indices, col_idx) => (
          <div
            key={'col_' + col_idx}
            className="flex h-full grow flex-col items-center justify-around gap-8"
          >
            {zone_indices.map((zone_idx) => (
              <Zone
                key={'zone_' + zone_idx}
                {...zones[zone_idx]}
                interactive={phase === 'awaiting-input'}
              />
            ))}
          </div>
        ))}
      </div>
      {phase === 'awaiting-next' && (
        <div
          className="absolute top-1/2 left-1/2 w-0"
          onClick={() => {
            nextRound();
          }}
        >
          <div className="bg-background/80 border-accent-foreground/70 relative flex w-80 -translate-1/2 flex-col items-center gap-2 rounded-md border p-4">
            Next round
            <Button variant="secondary" size="lg">
              <UserIcon />
              <ArrowBigRight />
            </Button>
          </div>
        </div>
      )}
      {(phase === 'game-over' || phase === 'awaiting-init') && (
        <div
          className="absolute top-1/2 left-1/2 w-0"
          onClick={() => {
            init();
          }}
        >
          <div className="bg-background/80 border-accent-foreground/70 relative flex w-80 -translate-1/2 flex-col items-center gap-2 rounded-md border p-4">
            {phase === 'game-over' && (
              <div className="font-bold">Score: {difficulty}</div>
            )}
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
