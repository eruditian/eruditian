import { FC } from 'react';
import { ActivePlayer } from '~/hooks/usePlayerMeta';
import { cn } from '~/lib/utils';

interface PlayerScoreProps {
  player: ActivePlayer;
  score: number;
  current_player?: string;
}

const PlayerScore: FC<PlayerScoreProps> = ({
  player,
  score,
  current_player,
}) => {
  const color = player.color;
  const current = current_player === player.id;
  return (
    <div
      className={cn(
        'shadow-center-xs rounded px-2 py-1 text-2xl opacity-80 transition-shadow duration-300',
        current && 'shadow-center font-bold opacity-100',
        color === 'green' && 'shadow-green-500/100',
        color === 'blue' && 'shadow-blue-500/100',
        color === 'pink' && 'shadow-pink-400/100',
        color === 'cyan' && 'shadow-cyan-300/90',
        color === 'yellow' && 'shadow-yellow-400/90',
        color === 'purple' && 'shadow-purple-600/90',
      )}
    >
      {player.name}
      <span className="ml-2 font-light">{score}</span>
    </div>
  );
};

export default PlayerScore;
