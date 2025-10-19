import React from 'react';
import { SheetNote } from './note_types';

interface NoteProps {
  note: SheetNote;
}

const Note: React.FC<NoteProps> = ({ note }) => {
  return <div>Note component</div>;
};

export default Note;
