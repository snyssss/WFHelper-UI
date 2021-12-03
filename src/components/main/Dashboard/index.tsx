import React, { ReactElement } from 'react';

import { Grid, Paper, paperClasses } from '@mui/material';
import { styled } from '@mui/material/styles';

import { Boss, Log, Misc, RunningTime } from '~/components/state';

const StyledPaper = styled(Paper)(({ theme }) => ({
  [`&.${paperClasses.root}`]: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(4),
    backgroundColor: theme.palette.grey[100],
  },
}));

const Component = (): ReactElement => {
  const list = [
    ['八岐大蛇', ['高级']],
    ['管理者', ['高级', '中级']],
    ['诅咒弧魔艾基尔', ['高级', '中级']],
    ['不死王瑞西塔尔', ['高级', '中级']],
    ['白虎', ['高级', '中级']],
    ['寄居蟹船长', ['高级', '中级']],
    ['废墟魔像', ['超级', '高级+', '高级', '中级']],
    ['维·索拉斯', ['初级']],
    ['伊尔考普斯', ['高级+', '高级']],
  ];

  return (
    <>
      <StyledPaper>
        <RunningTime />
      </StyledPaper>
      <Grid container p={2} pb={0} spacing={2}>
        {list.map((item) => {
          const [name, levels] = item as [string, string[]];
          return (
            <Grid key={name} item xs={4}>
              <Boss name={name} levels={levels} />
            </Grid>
          );
        })}
      </Grid>
      <Grid container p={2} spacing={2}>
        <Grid item xs={6}>
          <Log />
        </Grid>
        <Grid item xs={6}>
          <Misc />
        </Grid>
      </Grid>
    </>
  );
};

export default Component;
