import React, { useMemo } from 'react';
import { cn } from '~/lib/utils';

interface ZoneProps {
  count: number;
  revealed: number[];
  picked: number[];
  column: number;
  row: number;
  onClick: (index: number) => void;
  onAnimationEnd: (index: number) => void;
}

const zones_per_column_by_zone_count: Record<number, number[]> = {
  3: [2, 0, 1, 0],
  4: [2, 0, 2],
  5: [2, 1, 2],
  6: [3, 0, 3],
  7: [3, 1, 3],
  8: [3, 2, 3],
  9: [4, 1, 4],
  10: [4, 2, 4],
  11: [4, 3, 4],
  12: [4, 4, 4],
  13: [4, 5, 4],
  14: [5, 4, 5],
  15: [5, 5, 5],
};

const getZoneIndex = (
  total_count: number,
  column: number,
  row: number,
): number => {
  const zone_count = zones_per_column_by_zone_count[total_count];
  if (zone_count[column] <= row) {
    //This zone is not active with this total_count.
    return -1;
  }

  return zone_count.reduce((acc, zone_count, i) => {
    if (i < column) {
      acc += zone_count;
    }
    return acc;
  }, row);
};

const Zone: React.FC<ZoneProps> = ({
  count,
  column,
  row,
  revealed,
  picked,
  onClick,
  onAnimationEnd,
}) => {
  const index = useMemo(
    () => getZoneIndex(count, column, row),
    [count, column, row],
  );
  const highlight_index = useMemo(
    () => revealed.findIndex((hz) => hz === index),
    [index, revealed],
  );
  const isPicked = useMemo(() => picked.includes(index), [index, picked]);

  if (index < 0) {
    return null;
  }

  return (
    <div
      style={{
        animationDelay: `${highlight_index > -1 ? 300 * highlight_index : 0}ms`,
      }}
      className={cn(
        'shadow-center shadow-accent-foreground border-accent-foreground/80 bg-secondary/90 aspect-square w-full rounded-xl border-2 transition-colors duration-75',
        highlight_index > -1 && 'animate-pattern-show',
        highlight_index === -1 && 'animate-pattern-hide',
        isPicked && 'bg-green-500 duration-300',
      )}
      onAnimationEnd={() => onAnimationEnd(index)}
      onClick={() => onClick(index)}
    />
  );
};

export default Zone;
