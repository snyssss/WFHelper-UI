import { useGlobalState } from '@zyda/swr-internal-state';

const useGameLog = () => useGlobalState<[number, string][]>('game-log', []);

export default useGameLog;
