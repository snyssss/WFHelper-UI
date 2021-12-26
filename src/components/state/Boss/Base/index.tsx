import React, { ReactElement, useEffect } from 'react';

import { Box, Grid, Paper, Typography } from '@mui/material';

import { useGlobalState } from '@zyda/swr-internal-state';

import { useGameStateByKey } from '~/data';

const useBossList = () => useGlobalState<string[]>('boss-list', []);
export interface ComponentProps {
  name: string;
}

const Summary = ({ name }: ComponentProps): ReactElement => {
  const currentBoss = useGameStateByKey('正在挑战的boss');

  const count = useGameStateByKey(name);

  return (
    <Paper
      sx={
        String(currentBoss).indexOf(name) === 0
          ? { background: (theme) => theme.palette.secondary.light }
          : {}
      }
    >
      <Box display="flex" alignItems="center" px={2} minHeight={48}>
        <Typography
          sx={{
            flex: 1,
          }}
        >
          {name}
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary',
          }}
        >
          {Number(count || 0)}
        </Typography>
      </Box>
    </Paper>
  );
};

const Component = ({ name }: ComponentProps): ReactElement => {
  return <Summary name={name} />;
};

const Container = (): ReactElement => {
  const [bossList, setBossList] = useBossList();

  const currentBoss = useGameStateByKey('正在挑战的boss');

  useEffect(() => {
    if (currentBoss && currentBoss !== '无') {
      if ((bossList || []).includes(currentBoss as string) === false) {
        setBossList([...(bossList || []), currentBoss as string]);
      }
    }
  }, [currentBoss]);

  return (
    <>
      {(bossList || []).map((item) => (
        <Grid key={item} item xs={4}>
          <Component name={item} />
        </Grid>
      ))}
    </>
  );
};

export default Container;
