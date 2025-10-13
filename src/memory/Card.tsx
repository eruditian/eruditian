import React from 'react';
import backside from '../assets/memory_card_back.png';
import { cn } from '~/lib/utils';
import { MemoryCell } from './useMemoryState';

interface CardProps {
  data: MemoryCell;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({
  data: { state, image, player },
  onClick,
}) => {
  const color = player?.color;
  return (
    <div
      className={cn(
        'inset-shadow-accent border-accent relative h-full w-full cursor-pointer rounded-lg border inset-shadow-sm transition-all duration-700',
        (state === 'revealed' || state === 'matched') &&
          'cursor-default border-transparent inset-shadow-transparent',

        state === 'peeking' && color === 'green' && 'inset-shadow-green-500/80',
        state === 'peeking' && color === 'blue' && 'inset-shadow-blue-600/90',
        state === 'peeking' && color === 'pink' && 'inset-shadow-pink-400/90',
        state === 'peeking' && color === 'cyan' && 'inset-shadow-cyan-500/80',
        state === 'peeking' &&
          color === 'yellow' &&
          'inset-shadow-yellow-400/80',
        state === 'peeking' &&
          color === 'purple' &&
          'inset-shadow-purple-500/90',

        state === 'peeked' && 'inset-shadow-accent',
      )}
      onClick={onClick}
      onContextMenu={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onClick();
      }}
    >
      <div
        style={{
          backgroundImage: `url(${backside})`,
        }}
        className={cn(
          'absolute inset-2 rounded-lg bg-black bg-contain bg-center bg-no-repeat',
        )}
      />
      <div
        style={{
          backgroundImage: `url(${image})`,
        }}
        className={cn(
          'absolute inset-2 rounded-lg bg-black bg-contain bg-center bg-no-repeat opacity-0 transition-all duration-700',
          state !== 'hidden' && 'opacity-100',
          state === 'revealed' && 'shadow-center',
          color === 'green' && 'shadow-green-500/90',
          color === 'blue' && 'shadow-blue-500/100',
          color === 'pink' && 'shadow-pink-300/100',
          color === 'cyan' && 'shadow-cyan-300/90',
          color === 'yellow' && 'shadow-yellow-400/90',
          color === 'purple' && 'shadow-purple-600/90',
          state === 'peeked' && 'opacity-0',
        )}
      />
    </div>
  );
};

export default Card;
