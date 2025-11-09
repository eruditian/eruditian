import { getRandomInt } from '~/emath';

export const sequence_types = [
  'alphanumeric',
  'characters',
  'numeric',
  'shapes',
] as const;
export type SequenceType = (typeof sequence_types)[number];

const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;
const characters = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  // 'O', //Disregard to not confuse with numeric zero.
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'X',
  'Y',
  'Z',
  'Å',
  'Ä',
  'Ö',
] as const;
const alphanumerics = [...digits, ...characters] as const;
const shapes = [
  'circle',
  'pentagon',
  'parallelogram',
  'rhombus',
  'square',
  'star',
  'triangle_down',
  'triangle_left',
  'triangle_right',
  'triangle_up',
] as const;
export type SequenceShapes = (typeof shapes)[number];

export const createSequenceForType = (type: SequenceType): string[] => {
  if (type === 'numeric') {
    return [...digits];
  }
  if (type === 'shapes') {
    return [...shapes];
  }

  let values: string[] = [...characters];

  if (type === 'alphanumeric') {
    values = [...alphanumerics];
  }

  return Array(Math.min(values.length, 10))
    .fill(null)
    .map(() => values.splice(getRandomInt(0, values.length), 1)[0]);
};
