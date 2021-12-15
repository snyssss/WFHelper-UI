import React, { ReactElement, useCallback, useContext, useMemo } from 'react';

import { Switch, Tooltip } from '@mui/material';

import { SocketContext } from '~/components/context/socket';
import { useGameStateByKey } from '~/data/useGameState';

const Component = (): ReactElement => {
  const { sendMessage } = useContext(SocketContext);

  const isRunning = useGameStateByKey('isRunning');

  const checked = useMemo(() => (isRunning || false) as boolean, [isRunning]);

  const handleChange = useCallback(
    (_: unknown, newValue: boolean) => {
      if (newValue) {
        sendMessage('startWFHelper');
      } else {
        sendMessage('stopWFHelper');
      }
    },
    [sendMessage]
  );

  return (
    <Tooltip title={checked ? '启用' : '暂停'}>
      <Switch color="secondary" onChange={handleChange} checked={checked} />
    </Tooltip>
  );
};

export default Component;
