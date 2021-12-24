import { useGlobalState } from '@zyda/swr-internal-state';

const useEnergy = () => useGlobalState<number>('energy', 0);

export default useEnergy;
