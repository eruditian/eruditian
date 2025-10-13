import React, { useEffect } from 'react';
import useSequenceState from './useSequenceState';
import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { RefreshCcwIcon } from 'lucide-react';
import { SequenceType } from './sequence_extras';
import SequenceButton from './SequenceButton';

interface SequenceProps {
  type: SequenceType;
}

const Sequence: React.FC<SequenceProps> = ({ type }) => {
  const reveal = useSequenceState(({ reveal }) => reveal);
  const reveal_index = useSequenceState(({ reveal_index }) => reveal_index);
  const phase = useSequenceState(({ phase }) => phase);
  const answers = useSequenceState(({ answers }) => answers);
  const sequence = useSequenceState(({ sequence }) => sequence);
  const values_to_pick_from = useSequenceState(
    ({ values_to_pick_from }) => values_to_pick_from,
  );

  const onAnswer = useSequenceState(({ onAnswer }) => onAnswer);
  const initSequence = useSequenceState(({ init }) => init);

  useEffect(() => {
    initSequence();
  }, [initSequence]);

  return (
    <div
      className="relative flex h-full flex-col gap-2"
      onAuxClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <p className="text-accent-foreground/50 mb-4 pl-2 text-2xl font-bold">
        Sequence {type}
      </p>
      <div
        className={cn(
          'pointer-events-none flex grow basis-1/2 items-center justify-center opacity-0',
          phase === 'game-over' && 'pointer-events-auto opacity-100',
        )}
      >
        <div
          className="border-primary/50 flex cursor-pointer flex-col items-center justify-center gap-4 rounded border p-4"
          onClick={() => initSequence()}
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
      <div className="flex grow basis-full justify-center text-8xl">
        <div className="flex flex-col">
          {reveal_index % 2 === 0 && reveal && (
            <p className="mb-10 min-h-14 animate-ping [animation-duration:_1400ms]">
              {reveal}
            </p>
          )}
          {reveal_index % 2 === 1 && reveal && (
            <p className="mb-10 min-h-14 animate-ping [animation-duration:_1400ms]">
              {reveal}
            </p>
          )}
          {phase === 'game-over' && (
            <div
              className={cn('flex gap-2', sequence.length > 10 && 'text-6xl')}
            >
              {sequence.map((v, i) => (
                <p key={i + '-' + v} className="w-20">
                  {v}
                </p>
              ))}
            </div>
          )}

          <div
            className={cn(
              'flex min-h-14 gap-2',
              sequence.length > 10 && 'text-6xl',
            )}
          >
            {answers.map((v, i) => (
              <p
                key={i + '-' + v}
                className={cn(
                  'w-20 text-teal-600',
                  phase === 'game-over' && 'last:text-red-700',
                )}
              >
                {v}
              </p>
            ))}
          </div>
        </div>
      </div>
      <div
        className={cn(
          'grid grow basis-full cursor-pointer grid-cols-5 gap-4 p-4 pb-10 transition-all duration-300',
          phase !== 'input' && 'cursor-default opacity-40',
        )}
      >
        {values_to_pick_from.map((v) => (
          <SequenceButton
            value={v}
            key={v}
            onClick={phase === 'input' ? () => onAnswer(v) : undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default Sequence;
