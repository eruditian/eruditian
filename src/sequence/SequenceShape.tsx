import { cn } from '~/lib/utils';
import { SequenceShapes } from './sequence_extras';

const paths: Record<SequenceShapes, string> = {
  circle: 'circle(50% at 50% 50%)',
  parallelogram: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)',
  pentagon: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
  rhombus: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
  square: 'inset(6% 6% 6% 6%)',
  star: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
  triangle_down: 'polygon(50% 100%, 0 0, 100% 0)',
  triangle_left: 'polygon(100% 100%, 0 50%, 100% 0)',
  triangle_right: 'polygon(0 100%, 0 0, 100% 50%)',
  triangle_up: 'polygon(0 100%, 50% 0, 100% 100%)',
};

import React from 'react';

interface SequenceShapeProps {
  shape: SequenceShapes;
  className?: string;
}

const SequenceShape: React.FC<SequenceShapeProps> = ({ shape, className }) => {
  return (
    <div
      style={{
        clipPath: paths[shape],
      }}
      className={cn('aspect-square size-full bg-white', className)}
    />
  );
};

export default SequenceShape;
