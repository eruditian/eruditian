import { ScaleLinear, scaleLinear } from 'd3';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { getRandomInt } from '~/emath';

type Vec = {
  x: number;
  y: number;
};

interface ValuePos {
  value: number;
  pos: Vec;
}

interface MathState {
  new: (min: number, max: number, count: number) => void;
  numbers: number[];
  result: undefined | number;
  revealed: ValuePos[];
  step: number;
  next: () => void;
  scale: undefined | ScaleLinear<number, number, never>;
  ticks: ValuePos[];
}

const vecAdd = (a: Vec, b: Vec): Vec => {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  };
};

const getPositions = (
  bbox: DOMRect,
  offset: Vec,
  min: number,
  max: number,
  tick_count: number,
): Vec[] => {
  // const center = bbox.left + (bbox.width / 2);
  console.log('bbox.left, bbox.right', bbox.left, bbox.right);
  const values = scaleLinear(
    [min - 1, max + 1],
    [bbox.left, bbox.right],
  ).nice();
  console.log('values.', values.range(), values.domain());
  const ticks = values.ticks(tick_count);
  return ticks.map((v) => {
    const left = offset.x + values(v);
    console.log('left', v, left);
    return { x: left, y: 0 };
  });
};

const getPosition = (
  scale: ScaleLinear<number, number, never>,
  value: number,
  offset?: Vec,
): Vec => {
  return offset
    ? { ...offset, x: offset.x + scale(value) }
    : { x: scale(value), y: 0 };
};

const useMathAState = create<MathState>()(
  devtools(
    (set, get) =>
      ({
        ticks: [],
        new: (min = 1, max = 9, count = 2) => {
          set({
            numbers: Array(count)
              .fill(null)
              .map(() => getRandomInt(min, max)),
            ticks: getPositions(x.getBoundingClientRect(), scroll, -3, 6, 6),
            step: 0,
          });
        },
        numbers: [],
        result: undefined,
        revealed: [],
        scale: undefined,
        step: 0,
        next: () => {
          const { step, numbers, revealed, scale } = get();
          if (step >= numbers.length || !scale) {
            //"End"
            return;
          }
          const reveal: ValuePos = {
            value: numbers[step],
            pos: getPosition(scale, numbers[step]),
          };
          set(
            {
              revealed: [...revealed, reveal],
            },
            undefined,
            'next',
          );
        },
      }) as MathState,
    { name: 'Math State' },
  ),
);

export default useMathAState;
