import React from 'react';
import { SheetNote, sheet_note_shift } from './note_extras';
import { cn } from '~/lib/utils';
import Hashtag from '../../assets/hashtag.svg?react';

interface NoteProps {
  revealed: boolean;
  note: SheetNote;
  className?: string;
}

const Note: React.FC<NoteProps> = ({ note, revealed, className }) => {
  const sharp = note.sharp || false;
  return (
    <div
      className={cn(
        'border-primary absolute aspect-square h-[8%] translate-x-3/5 -translate-y-full scale-x-125 scale-y-90 rounded-full border-6 border-y-2 opacity-0',
        revealed && 'opacity-100',
        sheet_note_shift[note.name] && '-translate-x-3/5 -translate-y-1/2',
        className,
      )}
    >
      {sharp && (
        <div className="absolute h-1/2 w-1/2 -translate-x-full">
          <Hashtag className="stroke-primary stroke-2" />
        </div>
      )}
    </div>
  );
};

export default Note;
