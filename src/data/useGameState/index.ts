import { useGlobalState } from '@zyda/swr-internal-state';

export type BossName = string;

export type BossLevel = string;

export type BossInfo = {
  name: string;
  set: string;
  party: string;
  enabled: boolean;
};

export interface GameState {
  [key: string]: unknown;

  铃铛设置: {
    [key: BossName]: {
      [key: BossLevel]: BossInfo;
    };
  };
}

const useGameState = () =>
  useGlobalState<GameState>('game-state', { 铃铛设置: {} });

const useGameStateByKey = (key: keyof GameState) => {
  const [state] = useGameState();

  if (state) {
    const hasKey = Object.prototype.hasOwnProperty.call(state, key);

    if (hasKey) {
      return state[key];
    }
  }

  return null;
};

export default useGameState;

export { useGameStateByKey };
