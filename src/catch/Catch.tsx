import React, { useRef } from 'react';
import useCatchState, { CatchTouchPoint } from './useCatchState';
// import PlayerScore from '~/generic/PlayerScore';
// import usePlayersMeta from '~/hooks/usePlayerMeta';

const Catch: React.FC = () => {
  // const {
  //   players_meta: { active_players },
  // } = usePlayersMeta();
  const phase = useCatchState(({ phase }) => phase);
  const updateTouch = useCatchState(({ updateTouch }) => updateTouch);
  console.log('phase', phase);
  const container_ref = useRef<HTMLDivElement>(null);

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div className="flex items-center gap-4">
        <p className="text-accent-foreground/70 text-2xl font-bold">Catch</p>
        {/* <div className="flex gap-3">
          {active_players.map((p) => (
            <PlayerScore key={p.id} player={p} score={0} />
          ))}
        </div> */}
      </div>
      <div
        ref={container_ref}
        onTouchMove={(ev) => {
          ev.preventDefault();
          const rect = (ev.target as HTMLDivElement).getBoundingClientRect();
          const pts: CatchTouchPoint[] = [];
          for (let i = 0; i < ev.touches.length; i++) {
            const touch = ev.touches[i];
            pts.push({
              index: touch.identifier,
              x: touch.clientX - rect.x,
              y: touch.clientY - rect.y,
            });
          }
          updateTouch(pts);
        }}
        onTouchStart={(ev) => {
          ev.preventDefault();
          console.log('start', ev);
        }}
        className="relative mb-10 flex grow border border-red-400"
      >
        <div className="absolute top-1/12 size-14 bg-blue-400">casd</div>
      </div>
    </div>
  );
};

export default Catch;
