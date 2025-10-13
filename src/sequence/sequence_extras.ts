export const sequence_types = ['numbers', 'shapes'] as const;
export type SequenceType = (typeof sequence_types)[number];
