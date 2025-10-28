import React, { useMemo } from 'react';
import { cn } from '~/lib/utils';
import { ZoneState } from './usePatternState2';

interface ZoneProps extends ZoneState {
  enabled: boolean;
}

const Zone: React.FC<ZoneProps> = ({
  revealed,
  picked,
  index,
  onClick,
  onAnimationEnd,
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
        'shadow-center shadow-accent-foreground border-accent-foreground/80 bg-secondary/90 aspect-square w-full rounded-xl border-2 transition-colors duration-75',
        revealed && 'animate-pattern-show',
        !revealed && 'animate-pattern-hide',
        picked && 'bg-green-500 duration-300',
      )}
      onAnimationEnd={onAnimationEnd}
      onClick={onClick}
    />
  );
};

export default Zone;
