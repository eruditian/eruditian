import { Bounds } from './useTraceState';

export const boundsFromRect = (
  rect: DOMRect,
  relative: boolean = false,
  padding: number = 0,
): Bounds => ({
  x: (relative ? 0 : rect.x) + padding,
  x2: (relative ? rect.width : rect.right) - padding,
  y: (relative ? 0 : rect.y) + padding,
  y2: (relative ? rect.height : rect.bottom) - padding,
  width: rect.width - 2 * padding,
  height: rect.height - 2 * padding,
});
