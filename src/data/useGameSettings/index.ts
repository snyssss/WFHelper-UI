import { useGlobalState } from '@zyda/swr-internal-state';

export interface GameSettings {
  server: string;
}

const useGameSettings = () =>
  useGlobalState<GameSettings>('game-settings', {
    server: '',
  });

const useGameSettingsByKey = (key: keyof GameSettings) => {
  const [state] = useGameSettings();

  if (state) {
    const hasKey = Object.prototype.hasOwnProperty.call(state, key);

    if (hasKey) {
      return state[key];
    }
  }

  return null;
};

export default useGameSettings;

export { useGameSettingsByKey };
