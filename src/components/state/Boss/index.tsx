import React, { ReactElement } from 'react';

import { useGameStateByKey } from '~/data';

import Base from './Base';
import Enhanced from './Enhanced';

export interface ComponentProps {
  name: string;
}

const Component = (): ReactElement => {
  const enhanced = useGameStateByKey('铃铛设置');

  if (enhanced) {
    return <Enhanced />;
  }

  return <Base />;
};

export default Component;
