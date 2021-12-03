import { useGlobalState } from '@zyda/swr-internal-state';

const useGameState = () =>
  useGlobalState<Record<string, unknown>>('game-state');

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
