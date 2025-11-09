import React, { ReactNode, useState } from 'react';
import { cn } from '~/lib/utils';

interface SequenceButtonProps {
  value: string | ReactNode;
  onClick?: () => void;
  className?: string;
}

const SequenceButton: React.FC<SequenceButtonProps> = ({
  value,
  onClick,
  className,
}) => {
  const [clicked, setClicked] = useState<boolean>(false);

  return (
    <div
      className={cn(
        'border-secondary-foreground/50 flex grow basis-1 items-center justify-center rounded-sm border bg-transparent p-4 text-5xl transition-all duration-200 ease-out',
        clicked &&
          'border-secondary-foreground/100 scale-105 border-2 bg-cyan-600/50',
        className,
      )}
      onTransitionEnd={() => setClicked(false)}
      onClick={() => {
        if (onClick) {
          setClicked(true);
          onClick();
        }
      }}
      onAuxClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onContextMenu={() => {
        if (onClick) {
          setClicked(true);
          onClick();
        }
      }}
    >
      {value}
    </div>
  );
};

export default SequenceButton;
