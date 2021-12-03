import React, { ReactElement, useState } from 'react';

import { Box, Divider, Paper, Typography, paperClasses } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useInterval } from 'ahooks';
import { DateTime } from 'luxon';

import { useGameStateByKey } from '~/data/useGameState';

const StyledPaper = styled(Paper)(() => ({
  [`&.${paperClasses.root}`]: {
    display: 'inline-flex',
  },
}));

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2),
  width: theme.spacing(24),
}));

const Component = (): ReactElement => {
  const startTime = useGameStateByKey('startTime');
  const lastActionTime = useGameStateByKey('lastActionTime');
  const [stRelative, setSTRelative] = useState<string | null>(null);
  const [ltRelative, setLTRelative] = useState<string | null>(null);

  useInterval(
    () => {
      setSTRelative(() =>
        startTime ? DateTime.fromSeconds(Number(startTime)).toRelative() : null
      );

      setLTRelative(() =>
        lastActionTime
          ? DateTime.fromSeconds(Number(lastActionTime)).toRelative()
          : null
      );
    },
    1000,
    { immediate: true }
  );

  return (
    <StyledPaper>
      <StyledBox>
        <Typography variant="h6">开始时间</Typography>
        <Typography>
          {startTime
            ? DateTime.fromSeconds(Number(startTime)).toLocaleString(
                DateTime.DATETIME_MED_WITH_SECONDS
              )
            : '-'}
        </Typography>
        <Typography variant="caption" sx={{ mt: 1 }}>
          {stRelative || '-'}
        </Typography>
      </StyledBox>
      <Divider orientation="vertical" flexItem />
      <StyledBox>
        <Typography variant="h6">活跃时间</Typography>
        <Typography>
          {lastActionTime
            ? DateTime.fromSeconds(Number(lastActionTime)).toLocaleString(
                DateTime.DATETIME_MED_WITH_SECONDS
              )
            : '-'}
        </Typography>
        <Typography variant="caption" sx={{ mt: 1 }}>
          {ltRelative || '-'}
        </Typography>
      </StyledBox>
    </StyledPaper>
  );
};

export default Component;
