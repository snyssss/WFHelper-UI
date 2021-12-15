import { useGlobalState } from '@zyda/swr-internal-state';

export interface GameLog {
  time: number;
  message: string;
}

const useGameLog = () => useGlobalState<GameLog[]>('game-log', []);

export default useGameLog;
