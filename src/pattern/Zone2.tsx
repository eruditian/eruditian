import React from 'react';
import { cn } from '~/lib/utils';
import { ZoneState } from './usePatternState2';

interface ZoneProps extends ZoneState {
  interactive: boolean;
}

const Zone: React.FC<ZoneProps> = ({
  revealed,
  picked,
  index,
  onClick,
  onAnimationEnd,
  interactive,
}) => {
  if (index < 0) {
    return null;
  }

  return (
    <div
      style={{
        animationDelay: `${revealed ? 300 * index : 0}ms`,
      }}
      className={cn(
        'shadow-center shadow-accent-foreground border-accent-foreground/80 bg-secondary/90 w-full grow rounded-xl border-2 opacity-20 transition duration-75',
        revealed && 'animate-pattern-show',
        picked && 'bg-green-500 opacity-100 duration-300',
        interactive && 'hover:opacity-100',
      )}
      onAnimationEnd={onAnimationEnd}
      onClick={onClick}
    />
  );
};

export default Zone;
