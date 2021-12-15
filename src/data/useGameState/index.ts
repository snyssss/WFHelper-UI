import { useGlobalState } from '@zyda/swr-internal-state';

export interface GameState {
  [key: string]: unknown;
}

const useGameState = () => useGlobalState<GameState>('game-state', {});

const useGameStateByKey = (key: string) => {
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
