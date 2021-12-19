import { useGlobalState } from '@zyda/swr-internal-state';

export type GameTargetList = string[];

const useGameTargetList = () =>
  useGlobalState<GameTargetList>('game-targetList', []);

export default useGameTargetList;
