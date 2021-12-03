import React, { ReactElement, useMemo } from 'react';

import { Switch, Tooltip } from '@mui/material';

import { useGameStateByKey } from '~/data/useGameState';

const Component = (): ReactElement => {
  const isRunning = useGameStateByKey('isRunning');

  const checked = useMemo(() => (isRunning || false) as boolean, [isRunning]);

  const handleChange = (_: unknown, newValue: boolean): void => {
    if (newValue) {
      fetch('/start');
    } else {
      fetch('/stop');
    }
  };

  return (
    <Tooltip title={checked ? '启用' : '暂停'}>
      <Switch color="secondary" onChange={handleChange} checked={checked} />
    </Tooltip>
  );
};

export default Component;
