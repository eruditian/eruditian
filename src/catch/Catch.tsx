import React, { useRef } from 'react';
import PlayerScore from '~/generic/PlayerScore';
import usePlayersMeta from '~/hooks/usePlayerMeta';

const Catch: React.FC = () => {
  const {
    players_meta: { active_players },
  } = usePlayersMeta();

  const container_ref = useRef<HTMLDivElement>(null);

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex items-center gap-4">
        <p className="text-accent-foreground/70 text-2xl font-bold">Catch</p>
        <div className="flex gap-3">
          {active_players.map((p) => (
            <PlayerScore key={p.id} player={p} score={0} />
          ))}
        </div>
      </div>
      <div
        ref={container_ref}
        className="mb-10 flex grow border border-red-400"
      ></div>
    </div>
  );
};

export default Catch;
