import { SFC32 } from '@thi.ng/random/sfc32';

export type Vec = { x: number; y: number };

export type Rand = SFC32;
export const prng = SFC32;

/** Shuffles the referenced array. Returns the same reference. */
export const shuffleArray = <T>(array: T[]): T[] => {
  // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

export const pickPoint = (rand: Rand, bounds: [Vec, Vec]): Vec => {
  return {
    x: rand.minmax(bounds[0].x, bounds[1].x),
    y: rand.minmax(bounds[0].y, bounds[1].y),
  };
};

/** Subtract vector b from a. */
export const vecSub = (a: Vec, b: Vec): Vec => ({ x: a.x - b.x, y: a.y - b.y });
/** Add vector b to a. */
export const vecAdd = (a: Vec, b: Vec): Vec => ({ x: a.x + b.x, y: a.y + b.y });
/** Calculate magnitude of vector. */
export const vecMag = (v: Vec): number => Math.sqrt(v.x * v.x + v.y * v.y);
/** Normalize the vector. */
export const vecNor = (v: Vec, magnitude?: number): Vec => {
  magnitude = typeof magnitude === 'number' ? magnitude : vecMag(v);
  return { x: v.x / magnitude, y: v.y / magnitude };
};
/** Scale vector. */
export const vecMul = (v: Vec, multiplier: number) => ({
  x: v.x * multiplier,
  y: v.y * multiplier,
});

export const stepTowards = (
  origin: Vec,
  destination: Vec,
  velocity: number,
  delta: number,
): Vec => {
  const vec = vecSub(destination, origin);
  const mag = vecMag(vec);
  const unit_v = vecNor(vec, mag);
  if (mag < velocity * delta) {
    //There will be overshoot, return destination.
    return {
      x: destination.x,
      y: destination.y,
    };
  }
  const step = vecMul(unit_v, velocity * delta);
  return vecAdd(origin, step);
};
