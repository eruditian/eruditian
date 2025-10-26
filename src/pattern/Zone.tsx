import React, { useMemo } from 'react';
import { cn } from '~/lib/utils';

interface ZoneProps {
  count: number;
  highlighted: number[];
  column: number;
  row: number;
  onClick: (index: number) => void;
  onAnimationEnd: (index: number) => void;
}

const zones_per_column_by_zone_count: Record<number, number[]> = {
  3: [1, 1, 1],
  4: [2, 0, 2],
  5: [2, 1, 2],
  6: [3, 0, 3],
  7: [3, 1, 3],
  8: [3, 2, 3],
  9: [4, 1, 4],
  10: [4, 2, 4],
  11: [4, 3, 4],
  12: [4, 4, 4],
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
  highlighted,
  onClick,
  onAnimationEnd,
}) => {
  const index = useMemo(
    () => getZoneIndex(count, column, row),
    [count, column, row],
  );
  const highlight_index = useMemo(
    () => highlighted.findIndex((hz) => hz === index),
    [index, highlighted],
  );

  if (index < 0) {
    return null;
  }

  return (
    <div
      style={{
        animationDelay: `${highlight_index > -1 ? 100 * highlight_index : 0}ms`,
      }}
      className={cn(
        'shadow-center shadow-accent-foreground border-accent-foreground/80 bg-secondary/90 aspect-square w-1/2 rounded-xl border-2',
        highlight_index > -1 && 'animate-pattern-show',
        highlight_index === -1 && 'animate-pattern-hide',
      )}
      onAnimationEnd={() => onAnimationEnd(index)}
      onClick={() => onClick(index)}
    />
  );
};

export default Zone;
