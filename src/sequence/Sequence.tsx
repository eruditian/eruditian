import React, { useEffect, useMemo } from 'react';
import useSequenceState from './useSequenceState';
import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { RefreshCcwIcon } from 'lucide-react';
import {
  createSequenceForType,
  SequenceShapes,
  SequenceType,
} from './sequence_extras';
import SequenceButton from './SequenceButton';
import SequenceShape from './SequenceShape';

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

  const seq = useMemo(() => {
    return createSequenceForType(type);
  }, [type]);

  useEffect(() => {
    initSequence(seq);
  }, [initSequence, seq]);

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
          onClick={() => initSequence(seq)}
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
            <div className="mb-10 min-h-14 min-w-14 animate-ping [animation-duration:_1400ms]">
              {type === 'shapes' ? (
                <SequenceShape shape={reveal as SequenceShapes} />
              ) : (
                reveal
              )}
            </div>
          )}
          {reveal_index % 2 === 1 && reveal && (
            <div className="mb-10 min-h-14 min-w-14 animate-ping [animation-duration:_1400ms]">
              {type === 'shapes' ? (
                <SequenceShape shape={reveal as SequenceShapes} />
              ) : (
                reveal
              )}
            </div>
          )}
          {phase === 'game-over' && (
            <div className="flex gap-2">
              {sequence.map((v, i) => (
                <div
                  key={i + '-' + v}
                  className={cn(
                    'w-16',
                    sequence.length > 8 && 'w-10 text-6xl',
                    type === 'shapes' && 'h-16',
                    type === 'shapes' && sequence.length > 8 && 'h-10',
                  )}
                >
                  {type === 'shapes' ? (
                    <SequenceShape shape={v as SequenceShapes} />
                  ) : (
                    v
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex min-h-14 gap-2">
            {answers.map((v, i) => (
              <div
                key={i + '-' + v}
                className={cn(
                  'w-16 text-teal-600',
                  sequence.length > 8 && 'w-10 text-6xl',
                  phase === 'game-over' && 'last:text-red-700',
                  type === 'shapes' && 'h-16',
                  type === 'shapes' && sequence.length > 8 && 'h-10',
                )}
              >
                {type === 'shapes' ? (
                  <SequenceShape
                    shape={v as SequenceShapes}
                    className={
                      phase === 'game-over' && i === answers.length - 1
                        ? 'bg-red-700'
                        : 'bg-teal-600'
                    }
                  />
                ) : (
                  v
                )}
              </div>
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
            value={
              type === 'shapes' ? (
                <SequenceShape shape={v as SequenceShapes} />
              ) : (
                v
              )
            }
            key={v}
            onClick={phase === 'input' ? () => onAnswer(v) : undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default Sequence;
