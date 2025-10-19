import { create as createZustand } from 'zustand';
import { devtools } from 'zustand/middleware';
import { v4 as uuid } from 'uuid';
import { shuffleArray } from '~/emath';

import airplane from '~/assets/memory-images/airplane.jpg';
import apple_tree from '~/assets/memory-images/apple_tree.jpg';
import bear_panda from '~/assets/memory-images/bear_panda.jpg';
import bear_white from '~/assets/memory-images/bear_white.jpg';
import bus from '~/assets/memory-images/bus.jpg';
import car_blue from '~/assets/memory-images/car_blue.jpg';
import car_green from '~/assets/memory-images/car_green.jpg';
import car_pink from '~/assets/memory-images/car_pink.jpg';
import car_yellow from '~/assets/memory-images/car_yellow.jpg';
import chipmunk_acorn from '~/assets/memory-images/chipmunk_acorn.jpg';
import chipmunk_in_dress from '~/assets/memory-images/chipmunk_in_dress.jpg';
import crab from '~/assets/memory-images/crab.jpg';
import elephants_1 from '~/assets/memory-images/elephants_1.jpg';
import elephants_2 from '~/assets/memory-images/elephants_2.jpg';
import fish_3 from '~/assets/memory-images/fish_3.jpg';
import fish_blue from '~/assets/memory-images/fish_blue.jpg';
import fish_shark from '~/assets/memory-images/fish_shark.jpg';
import fish_yellow from '~/assets/memory-images/fish_yellow.jpg';
import flower_blue from '~/assets/memory-images/flower_blue.jpg';
import flower_sun from '~/assets/memory-images/flower_sun.jpg';
import fox from '~/assets/memory-images/fox.jpg';
import goat from '~/assets/memory-images/goat.jpg';
import hamster_eating from '~/assets/memory-images/hamster_eating.jpg';
import lion from '~/assets/memory-images/lion.jpg';
import manta_ray from '~/assets/memory-images/manta_ray.jpg';
import moon from '~/assets/memory-images/moon.jpg';
import orca from '~/assets/memory-images/orca.jpg';
import prince_blue from '~/assets/memory-images/prince_blue.jpg';
import prince_pink from '~/assets/memory-images/prince_pink.jpg';
import prince_yellow from '~/assets/memory-images/prince_yellow.jpg';
import princess_blue from '~/assets/memory-images/princess_blue.jpg';
import princess_carousel from '~/assets/memory-images/princess_carousel.jpg';
import princess_purple from '~/assets/memory-images/princess_purple.jpg';
import princess_snorkling from '~/assets/memory-images/princess_snorklings.jpg';
import princess_surfing from '~/assets/memory-images/princess_surfing.jpg';
import princess_swinging from '~/assets/memory-images/princess_swinging.jpg';
import princess_water_dance from '~/assets/memory-images/princess_water_dance.jpg';
import princess_yellow from '~/assets/memory-images/princess_yellow.jpg';
import pups_1 from '~/assets/memory-images/pups_1.jpg';
import pups_2 from '~/assets/memory-images/pups_2.jpg';
import pups_3 from '~/assets/memory-images/pups_3.jpg';
import pups_4 from '~/assets/memory-images/pups_4.jpg';
import pups_5 from '~/assets/memory-images/pups_5.jpg';
import rainbow from '~/assets/memory-images/rainbow.jpg';
import seagull from '~/assets/memory-images/seagull.jpg';
import starfish from '~/assets/memory-images/starfish.jpg';
import sun from '~/assets/memory-images/sun.jpg';
import tree_palm from '~/assets/memory-images/tree_palm.jpg';
import tea_pot from '~/assets/memory-images/tea_pot.jpg';
import tree_house from '~/assets/memory-images/tree_house.jpg';
import unicorn_pink from '~/assets/memory-images/unicorn_pink.jpg';
import unicorn_white from '~/assets/memory-images/unicorn_white.jpg';
import waterfall from '~/assets/memory-images/waterfall.jpg';
import { ActivePlayer } from '~/hooks/usePlayerMeta';

const images = [
  airplane,
  apple_tree,
  bear_panda,
  bear_white,
  bus,
  car_blue,
  car_green,
  car_pink,
  car_yellow,
  chipmunk_acorn,
  chipmunk_in_dress,
  crab,
  elephants_1,
  elephants_2,
  fish_3,
  fish_blue,
  fish_shark,
  fish_yellow,
  flower_blue,
  flower_sun,
  fox,
  goat,
  hamster_eating,
  lion,
  manta_ray,
  moon,
  orca,
  prince_blue,
  prince_pink,
  prince_yellow,
  princess_blue,
  princess_carousel,
  princess_purple,
  princess_snorkling,
  princess_surfing,
  princess_swinging,
  princess_water_dance,
  princess_yellow,
  pups_1,
  pups_2,
  pups_3,
  pups_4,
  pups_5,
  rainbow,
  seagull,
  starfish,
  sun,
  tree_palm,
  tea_pot,
  tree_house,
  unicorn_pink,
  unicorn_white,
  waterfall,
] as const;

type MemoryCellState = 'hidden' | 'peeking' | 'peeked' | 'matched' | 'revealed';

export interface MemoryCell {
  image: string;
  id: string;
  siblings: string[];
  state: MemoryCellState;
  index: number;
  pending?: PendingChange<MemoryCellState>;
  player?: ActivePlayer;
}

type PendingChange<T> = {
  timeout: number;
  data: T;
};

const createGrid = (
  count: number,
  match_count: number,
): Pick<MemoryState, 'cells' | 'grid'> => {
  const imgs = shuffleArray([...images]);

  const cells = Array(count / match_count)
    .fill(null)
    .reduce<Record<string, MemoryCell>>((acc, _, image_idx) => {
      const ids = Array(match_count)
        .fill(null)
        .map(() => uuid());

      ids.forEach((id) => {
        acc[id] = {
          id,
          image: imgs[image_idx],
          siblings: ids,
          state: 'hidden',
          index: 0,
        };
      });
      return acc;
    }, {});

  const grid = shuffleArray(Object.values(cells)).map<MemoryCell>((c, i) => {
    c.index = i;
    return c as MemoryCell;
  });

  return {
    cells: cells as Record<string, MemoryCell>,
    grid,
  };
};

interface MemoryState {
  cells: Record<string, MemoryCell>;
  grid: MemoryCell[];
  completed: boolean;
  scores: Record<
    string,
    {
      clicks: number;
      score: number;
    }
  >;
  match_count: number;
  current_player: number;
  players: ActivePlayer[];
  init: (count: number, players: ActivePlayer[], match_count?: number) => void;
  backgroundClick: () => void;
  cellClick: (cellId: string) => void;
  tick: (t?: number) => void;
}

const useMemoryState = createZustand<MemoryState>()(
  devtools(
    (set, get) =>
      ({
        cells: {},
        grid: [],
        completed: false,
        match_count: 2,
        scores: {},
        current_player: 0,
        player_count: 1,
        players: [],
        init: (count, players, match_count = 2) => {
          const x = createGrid(count, match_count);
          const scores = players.reduce<MemoryState['scores']>(
            (acc, player) => {
              acc[player.id] = {
                clicks: 0,
                score: 0,
              };
              return acc;
            },
            {},
          );
          set({
            ...x,
            match_count,
            scores,
            completed: false,
            players,
            current_player: 0,
          });
          requestAnimationFrame(get().tick);
        },
        backgroundClick: () => {},
        cellClick: (cellId) => {
          const { cells, grid, match_count, scores, current_player, players } =
            get();
          const clicked = cells[cellId];

          if (clicked.state !== 'hidden') {
            return;
          }

          const peeking = grid.filter(
            (c) => c.state === 'peeking' && !c.pending,
          );

          const peeking_same = peeking.every((c) => c.image === clicked.image);
          peeking.push(clicked);
          const match_found = peeking_same && peeking.length === match_count;

          const updated_cells = peeking.map<MemoryCell>((c) => {
            if (match_found) {
              const copy: MemoryCell = {
                ...c,
                player: players[current_player],
                state: 'revealed',
              };
              delete copy['pending'];
              return copy;
            }
            if (!peeking_same) {
              return {
                ...c,
                player: players[current_player],
                state: 'peeking',
                pending: {
                  data: 'peeked',
                  timeout: performance.now() + 1500,
                },
              };
            }
            const copy: MemoryCell = {
              ...c,
              player: players[current_player],
              state: 'peeking',
            };
            delete copy['pending'];
            return copy;
          });

          const new_grid = [...grid];
          const new_cells = { ...cells };

          updated_cells.forEach((c) => {
            new_grid[c.index] = c;
            new_cells[c.id] = c;
          });

          const all_found = new_grid.every((c) => c.state === 'revealed');
          // console.log(current_player, players);
          const player_id = players[current_player].id;

          const new_scores = {
            ...scores,
            [player_id]: {
              clicks: scores[player_id].clicks + 1,
              score: match_found
                ? scores[player_id].score + 1
                : scores[player_id].score,
            },
          };

          set({
            grid: new_grid,
            cells: new_cells,
            completed: all_found,
            scores: new_scores,
            current_player: peeking_same
              ? current_player
              : (current_player + 1) % players.length,
          });
        },
        tick: () => {
          const { grid, cells, completed } = get();
          const pending = grid.filter((c) => c.pending);
          if (pending.length === 0) {
            if (!completed) {
              requestAnimationFrame(get().tick);
            }
            return;
          }

          const updated_cells = pending
            .filter((c) => performance.now() > (c.pending?.timeout || 0))
            .map<MemoryCell>((c) => {
              const state = c.pending?.data || 'hidden';
              const tmp = {
                ...c,
                state,
              };
              delete tmp.pending;
              if (state === 'peeked') {
                delete tmp.player;
                tmp.pending = {
                  timeout: performance.now() + 500,
                  data: 'hidden',
                };
              }
              return tmp;
            });

          if (updated_cells.length > 0) {
            const new_grid = [...grid];
            const new_cells = { ...cells };

            updated_cells.forEach((c) => {
              new_grid[c.index] = c;
              new_cells[c.id] = c;
            });
            set({
              grid: new_grid,
              cells: new_cells,
            });
          }
          requestAnimationFrame(get().tick);
        },
      }) as MemoryState,
    {
      name: 'Eruditio Memory State',
    },
  ),
);

export default useMemoryState;
