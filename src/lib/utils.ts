import { clsx, type ClassValue } from 'clsx';
import { createTailwindMerge, getDefaultConfig } from 'tailwind-merge';

const customTwMerge = createTailwindMerge(() => {
  const config = getDefaultConfig();
  return {
    ...config,
    classGroups: {
      ...config.classGroups,
      //This can be used to fix collisions between custom classes and built in tw classes.
      //https://github.com/dcastil/tailwind-merge/blob/main/docs/api-reference.md#createtailwindmerge
      // text: ['lg-regular', 'text-success'],
      shadow: [
        'shadow-center',
        'shadow-center-sm',
        'shadow-center-xs',
        'shadow-xl',
        'shadow-lg',
        'shadow-md',
        'shadow-sm',
        'shadow-xs',
      ],
      'inset-shadow': [
        'inset-shadow-center-lg',
        'inset-shadow-center',
        'inset-shadow-center-md',
        'inset-shadow-center-sm',
        'inset-shadow-center-xs',
        'inset-shadow-sm',
        'inset-shadow-xs',
      ],
    },
  };
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}

export function mergeListAndIdState<
  T extends { id: string },
  R extends { byId: Record<string, T>; list: T[] },
>(state: R, v: T) {
  if (!state.byId[v.id]) {
    //New decision to add.
    return {
      byId: { ...state.byId, [v.id]: v },
      list: [...state.list, v],
    };
  }

  const index = state.list.findIndex((d) => d.id === v.id);
  const list = [...state.list];
  list.splice(index, 1, v);

  return {
    list,
    byId: { ...state.byId, [v.id]: v },
  };
}
