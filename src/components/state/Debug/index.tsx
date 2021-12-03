import React, { ReactElement, useMemo } from 'react';

import { Adb } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

import Maybe from '~/components/common/Maybe';
import { useGameStateByKey } from '~/data/useGameState';

const Component = (): ReactElement => {
  const isDebug = useGameStateByKey('isDebug');

  const validate = useMemo(() => (isDebug || false) as boolean, [isDebug]);

  return (
    <Maybe validate={validate}>
      <Tooltip title="调试模式">
        <Adb />
      </Tooltip>
    </Maybe>
  );
};

export default Component;
