import React, { useMemo } from 'react';
import { SheetNote } from './note_types';

import Fclef from '../../assets/fclef.svg?react';
import Gclef from '../../assets/gclef.svg?react';
import { cn } from '~/lib/utils';

interface SheetProps {
  notes: SheetNote[];
}

const Sheet: React.FC<SheetProps> = ({ notes }) => {
  const revealed = useMemo(() => {
    return notes.reduce(
      (acc, n) => {
        acc[n.name + n.octave] = n;
        return acc;
      },
      {} as Record<string, SheetNote>,
    );
  }, [notes]);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-between">
      <div className="border-primary/80 flex w-1/5 justify-center border-t"></div>
      <div className="border-primary/80 flex w-1/5 justify-center border-t"></div>
      <div className="border-primary/80 flex w-full justify-center border-t"></div>
      <div className="border-primary/80 flex w-full justify-center border-t"></div>
      <div className="border-primary/80 flex w-full justify-center border-t">
        <div
          className={cn(
            'border-primary absolute aspect-square h-[8%] translate-x-3/5 -translate-y-full scale-x-125 scale-y-90 rounded-full border-6 border-y-2 opacity-0',
            revealed['C5'] && 'opacity-100',
          )}
        />
        <div
          className={cn(
            'border-primary absolute aspect-square h-[8%] -translate-x-3/5 -translate-y-1/2 scale-x-125 scale-y-90 rounded-full border-6 border-y-2 opacity-0',
            revealed['B5'] && 'opacity-100',
          )}
        />
      </div>
      <div className="border-primary/80 flex w-full place-content-center border-t">
        <div
          className={cn(
            'border-primary absolute aspect-square h-[8%] translate-x-3/5 -translate-y-full scale-x-125 scale-y-90 rounded-full border-6 border-y-2 opacity-0',
            revealed['A5'] && 'opacity-100',
          )}
        />
        <div
          className={cn(
            'border-primary absolute aspect-square h-[8%] -translate-x-3/5 -translate-y-1/2 scale-x-125 scale-y-90 rounded-full border-6 border-y-2 opacity-0',
            revealed['G4'] && 'opacity-100',
          )}
        />
        <div className="absolute left-0 flex h-1/3 w-1/4">
          <Gclef className="fill-primary h-full grow -translate-y-2/3" />
        </div>
      </div>
      <div className="border-primary/80 flex w-full justify-center border-t"></div>
      <div className="border-primary/80 flex w-1/5 justify-center border-t"></div>
      <div className="border-primary/80 flex w-full justify-center border-t"></div>
      <div className="border-primary/80 flex w-full justify-center border-t">
        <div className="absolute left-0 flex h-1/4 w-1/4">
          <Fclef className="fill-primary h-full grow -translate-y-1/3" />
        </div>
      </div>
      <div className="border-primary/80 flex w-full justify-center border-t"></div>
      <div className="border-primary/80 flex w-full justify-center border-t"></div>
      <div className="border-primary/80 flex w-full justify-center border-t"></div>
      <div className="border-primary/80 flex w-1/5 justify-center border-t"></div>
      <div className="border-primary/80 flex w-1/5 justify-center border-t"></div>
    </div>
  );
};

export default Sheet;
