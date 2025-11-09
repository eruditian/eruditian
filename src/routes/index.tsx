import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Toggle } from '~/components/ui/toggle';
import usePlayersMeta, { EruditianPlayer } from '~/hooks/usePlayerMeta';
import { cn } from '~/lib/utils';

export const Route = createFileRoute('/')({
  component: Index,
});

const players: EruditianPlayer[] = [
  { name: 'Player A', color_preference: 'pink', id: 'player_a' },
  { name: 'Player B', color_preference: 'green', id: 'player_b' },
  { name: 'Player C', color_preference: 'yellow', id: 'player_c' },
];

function Index() {
  const { setActivePlayers, players_meta, setPlayersMeta } = usePlayersMeta();
  const has_active_players = players_meta.active_players.length > 0;
  useEffect(() => {
    const players_defined =
      Object.keys(players_meta.players).length === players.length &&
      players.every(({ id }) => !!players_meta.players[id]);
    if (players_defined) {
      return;
    }
    setPlayersMeta({
      players: players.reduce<Record<string, EruditianPlayer>>((acc, p) => {
        acc[p.id] = { ...p };
        return acc;
      }, {}),
      active_players: [{ ...players[0], color: players[0].color_preference }],
      version: 3,
    });
  }, [players_meta.players, setPlayersMeta]);

  return (
    <div className="flex flex-col gap-8 p-12">
      <div className="shadow-center-sm flex justify-center gap-4 rounded-lg border-2 p-4 shadow-cyan-700/70">
        {players.map((player, i) => {
          const active_idx = players_meta.active_players.findIndex(
            (p) => p.id === player.id,
          );
          return (
            <Toggle
              key={i + player.id + player.color_preference}
              className="inset-shadow-green-500 data-[state=on]:inset-shadow-sm"
              variant="outline"
              pressed={active_idx > -1}
              onPressedChange={() => {
                if (active_idx > -1) {
                  const actives = [...players_meta.active_players];
                  actives.splice(active_idx, 1);
                  setActivePlayers(actives);
                } else {
                  setActivePlayers([...players_meta.active_players, player]);
                }
              }}
            >
              {player.name}
            </Toggle>
          );
        })}
      </div>
      <div className="shadow-center border-accent-foreground/30 rounded-lg border-2 p-4 shadow-cyan-700/70">
        {!has_active_players && (
          <p className="mb-2 text-center">Pick some players</p>
        )}
        <div className="flex justify-center gap-4">
          <Link
            to="/memory/$size"
            params={{ size: '12' }}
            disabled={!has_active_players}
            className={cn(
              'border-primary/70 rounded border p-4',
              !has_active_players && 'opacity-50',
            )}
          >
            Memory 12
          </Link>
          <Link
            to="/memory/$size"
            params={{ size: '16' }}
            disabled={!has_active_players}
            className={cn(
              'border-primary/70 rounded border p-4',
              !has_active_players && 'opacity-50',
            )}
          >
            Memory 16
          </Link>
          <Link
            to="/memory/$size"
            params={{ size: '20' }}
            disabled={!has_active_players}
            className={cn(
              'border-primary/70 rounded border p-4',
              !has_active_players && 'opacity-50',
            )}
          >
            Memory 20
          </Link>
          <Link
            to="/memory/$size"
            params={{ size: '24' }}
            disabled={!has_active_players}
            className={cn(
              'border-primary/70 rounded border p-4',
              !has_active_players && 'opacity-50',
            )}
          >
            Memory 24
          </Link>
          <Link
            to="/memory/$size"
            params={{ size: '28' }}
            disabled={!has_active_players}
            className={cn(
              'border-primary/70 rounded border p-4',
              !has_active_players && 'opacity-50',
            )}
          >
            Memory 28
          </Link>
        </div>
      </div>
      <div className="shadow-center border-accent-foreground/30 flex justify-center gap-4 rounded-lg border-2 p-4 shadow-cyan-700/70">
        <Link
          to="/sequence/$type"
          params={{ type: 'numeric' }}
          className={cn(
            'border-primary/70 rounded border p-4',
            !has_active_players && 'opacity-50',
          )}
        >
          123...
        </Link>
        <Link
          to="/sequence/$type"
          params={{ type: 'alphanumeric' }}
          className={cn(
            'border-primary/70 rounded border p-4',
            !has_active_players && 'opacity-50',
          )}
        >
          1A6...
        </Link>
        <Link
          to="/sequence/$type"
          params={{ type: 'characters' }}
          className={cn(
            'border-primary/70 rounded border p-4',
            !has_active_players && 'opacity-50',
          )}
        >
          BÄC...
        </Link>
        <Link
          to="/sequence/$type"
          params={{ type: 'shapes' }}
          className={cn(
            'border-primary/70 rounded border p-4',
            !has_active_players && 'opacity-50',
          )}
        >
          &#9632;&#9679;&#9650;...
        </Link>
        <Link
          to="/pattern"
          className={cn(
            'border-primary/70 rounded border p-4',
            !has_active_players && 'opacity-50',
          )}
        >
          Pattern
        </Link>
      </div>
    </div>
  );
}
