import React, { ReactElement } from 'react';

import { useGameStateByKey } from '~/data';

import Base from './Base';
import Enhanced from './Enhanced';

export interface ComponentProps {
  name: string;
}

const Component = ({ name }: ComponentProps): ReactElement => {
  const enhanced = useGameStateByKey('铃铛设置');

  if (enhanced) {
    return <Enhanced name={name} />;
  }

  return <Base name={name} />;
};

export default Component;
