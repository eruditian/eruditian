import { useCallback, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

const player_colors = [
  'pink',
  'blue',
  'green',
  'cyan',
  'yellow',
  'purple',
] as const;

export type PlayerColor = (typeof player_colors)[number];

export interface EruditioPlayer {
  name: string;
  id: string;
  color_preference: PlayerColor;
}
export interface ActivePlayer extends EruditioPlayer {
  color: PlayerColor;
}
export interface PlayersMeta {
  version: number;
  players: Record<string, EruditioPlayer>;
  active_players: ActivePlayer[];
}

const default_players_meta: PlayersMeta = {
  version: 3,
  players: {},
  active_players: [],
};

const getStoredOrDefault = (): PlayersMeta => {
  const stored = window.localStorage.getItem('players_meta');
  if (stored) {
    const parsed = JSON.parse(stored);
    if (parsed.version !== default_players_meta.version) {
      return default_players_meta;
    }
    return JSON.parse(stored);
  }
  return default_players_meta;
};

const createPlayer = (
  partial: Partial<EruditioPlayer> = {},
): EruditioPlayer => {
  return {
    id: uuid(),
    name: 'Unknown player',
    color_preference: 'green',
    ...partial,
  };
};

const usePlayersMeta = () => {
  const [players_meta, setMeta] = useState<PlayersMeta>(getStoredOrDefault());
  const [players_meta_str, setMetaStr] = useState<string>(
    JSON.stringify(getStoredOrDefault()),
  );

  useEffect(() => {
    setMeta(JSON.parse(players_meta_str));
  }, [players_meta_str]);

  const setPlayersMeta = useCallback((players_meta: PlayersMeta) => {
    console.log('players_meta', players_meta);
    const str = JSON.stringify(players_meta);
    setMetaStr(str);
    window.localStorage.setItem('players_meta', str);

    setMeta(players_meta);

    const ev = new CustomEvent<string>('updatePlayersMeta', { detail: str });
    window.dispatchEvent(ev);
  }, []);

  useEffect(() => {
    const listener = (ev: CustomEvent<string>) => {
      setMetaStr(ev.detail);
    };
    const storageListener = () => {
      const stored = window.localStorage.getItem('players_meta');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.version === default_players_meta.version) {
          setMetaStr(stored);
        }
      }
    };

    window.addEventListener(
      'updatePlayersMeta',
      listener as unknown as EventListener,
    );
    window.addEventListener('storage', storageListener);

    return () => {
      window.removeEventListener(
        'updatePlayersMeta',
        listener as unknown as EventListener,
      );
      window.removeEventListener('storage', storageListener);
    };
  }, []);

  const setPlayer = useCallback(
    (meta_data: Partial<EruditioPlayer>) => {
      const copy = { ...players_meta };

      const player = meta_data?.id
        ? copy.players[meta_data.id]
        : createPlayer(meta_data);

      copy.players[player.id] = { ...player, ...meta_data };

      setPlayersMeta(copy);
      return copy.players[player.id];
    },
    [players_meta, setPlayersMeta],
  );

  const getPlayer = useCallback(
    (player_id: string): EruditioPlayer => {
      const player = players_meta.players[player_id];
      if (!player) {
        throw new Error('Player not found. ' + player_id);
      }
      return player;
    },
    [players_meta],
  );

  const setActivePlayers = useCallback(
    (players: EruditioPlayer[]) => {
      const available_colors: PlayerColor[] = [...player_colors];
      const actives = players
        .map<[ActivePlayer, boolean]>((p) => {
          if (!players_meta.players[p.id]) {
            throw new Error('Player not found. ' + p.id);
          }
          const color_idx = available_colors.findIndex(
            (c) => c === p.color_preference,
          );
          if (color_idx > -1) {
            available_colors.splice(color_idx, 1);
          }
          return [
            {
              ...p,
              color: p.color_preference,
            },
            color_idx > -1,
          ];
        })
        .map<ActivePlayer>(([p, color_available]) => {
          if (color_available) {
            return p;
          }
          const color = available_colors.splice(0, 1)[0];
          return { ...p, color };
        });
      setPlayersMeta({ ...players_meta, active_players: actives });
    },
    [players_meta, setPlayersMeta],
  );

  return {
    players_meta,
    setPlayer,
    getPlayer,
    setActivePlayers,
    setPlayersMeta,
  };
};

export default usePlayersMeta;
