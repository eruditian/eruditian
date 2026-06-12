import React, { useEffect } from 'react';
import useMathPuzzleState from './useMathPuzzle';
import { useShallow } from 'zustand/shallow';

const MathPuzzle: React.FC = () => {
  const { newPuzzle, seq_done, seq_numbers } = useMathPuzzleState(
    useShallow(({ newPuzzle, seq_done, seq_numbers }) => ({
      newPuzzle,
      seq_done,
      seq_numbers,
    })),
  );

  useEffect(() => {
    newPuzzle('seq');
  }, [newPuzzle]);

  return (
    <div>
      <div className="mt-10 flex justify-evenly">
        {seq_numbers.map((n) => (
          <div className="border-b-muted-foreground text-5xl empty:w-8 empty:border-b-2">
            {n}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MathPuzzle;
