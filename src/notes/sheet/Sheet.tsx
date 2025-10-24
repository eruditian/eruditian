import React, { useMemo } from 'react';
import { SheetNote } from './note_extras';

import Fclef from '../../assets/fclef.svg?react';
import Gclef from '../../assets/gclef.svg?react';
import { cn } from '~/lib/utils';
import Note from './Note';

interface SheetProps {
  notes: SheetNote[];
}

const Sheet: React.FC<SheetProps> = ({ notes }) => {
  const revealed = useMemo(() => {
    return notes.reduce(
      (acc, n) => {
        const joined = n.name + n.octave + (n.sharp ? '#' : '');
        acc[joined] = n;
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
        {/* <div
          className={cn(
            'border-primary absolute aspect-square h-[8%] translate-x-3/5 -translate-y-full scale-x-125 scale-y-90 rounded-full border-6 border-y-2 opacity-0',
            revealed['C5'] && 'opacity-100',
          )}
        /> */}
        <Note
          note={{ name: 'C', octave: 5, sharp: false }}
          revealed={!!revealed['C5']}
        />
        <Note
          note={{ name: 'B', octave: 5, sharp: false }}
          revealed={!!revealed['B5']}
        />
        {/* <div
          className={cn(
            'border-primary absolute aspect-square h-[8%] -translate-x-3/5 -translate-y-1/2 scale-x-125 scale-y-90 rounded-full border-6 border-y-2 opacity-0',
            revealed['B5'] && 'opacity-100',
          )}
        /> */}
      </div>
      <div className="border-primary/80 flex w-full place-content-center border-t">
        <div className="absolute left-0 flex h-2/5 w-1/4">
          <Gclef className="fill-primary h-full grow translate-y-[-65%]" />
        </div>
        <Note
          note={{ name: 'A', octave: 5, sharp: false }}
          revealed={!!revealed['A5']}
        />
        <Note
          note={{ name: 'A', octave: 5, sharp: true }}
          revealed={!!revealed['A5#']}
        />
        <Note
          note={{ name: 'G', octave: 4, sharp: false }}
          revealed={!!revealed['G4']}
        />
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
