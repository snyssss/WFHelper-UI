import React, { ReactElement } from 'react';

import { useGameStateByKey } from '~/data';
import { GameState } from '~/data/useGameState';

import Base from './Base';
import Enhanced from './Enhanced';

export interface ComponentProps {
  name: string;
}

const Component = (): ReactElement => {
  const settings = useGameStateByKey('铃铛设置') as GameState['铃铛设置'];

  if (Object.keys(settings || {}).length) {
    return <Enhanced />;
  }

  return <Base />;
};

export default Component;
