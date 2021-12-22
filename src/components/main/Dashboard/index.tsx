import React, { FC, ReactElement, useContext } from 'react';

import { Grid, Paper, paperClasses } from '@mui/material';
import { styled } from '@mui/material/styles';

import LoadingSpinner from '~/components/common/LoadingSpinner';
import LoadProvider, { LoadContext } from '~/components/context/load';
import { SocketContext } from '~/components/context/socket';
import { Boss, CurrentTask, Log, Misc, RunningTime } from '~/components/state';

const StyledPaper = styled(Paper)(({ theme }) => ({
  [`&.${paperClasses.root}`]: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(4),
    backgroundColor: theme.palette.grey[100],
  },
}));

const Container: FC = ({ children }) => {
  const { connected } = useContext(SocketContext);

  return (
    <LoadProvider loading={connected === false}>
      <LoadContext.Consumer>
        {({ loading }) => (loading ? <LoadingSpinner /> : <>{children}</>)}
      </LoadContext.Consumer>
    </LoadProvider>
  );
};

const Component = (): ReactElement => {
  const list = [
    '八岐大蛇',
    '管理者',
    '诅咒弧魔艾基尔',
    '不死王瑞西塔尔',
    '白虎',
    '寄居蟹船长',
    '废墟魔像',
    '维·索拉斯',
    '伊尔考普斯',
  ];

  return (
    <Container>
      <StyledPaper>
        <CurrentTask />
        <RunningTime />
      </StyledPaper>
      <Grid container p={2} pb={0} spacing={2}>
        {list.map((item) => (
          <Grid key={item} item xs={4}>
            <Boss name={item} />
          </Grid>
        ))}
      </Grid>
      <Grid container p={2} spacing={2}>
        <Grid item xs={6}>
          <Log />
        </Grid>
        <Grid item xs={6}>
          <Misc />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Component;
