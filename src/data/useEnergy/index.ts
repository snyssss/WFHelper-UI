import { useGlobalState } from '@zyda/swr-internal-state';

const useEnergy = () => useGlobalState<string>('energy', '');

export default useEnergy;
