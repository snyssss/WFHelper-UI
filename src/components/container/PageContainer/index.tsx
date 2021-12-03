import React, { PropsWithChildren, ReactElement, ReactNode } from 'react';

import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';

import Header from './Header';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.default,
    minWidth: theme.breakpoints.values.md,
    height: '100%',
  },
  container: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
}));

export interface PageContainerProps {
  header?: boolean | ReactNode;
}

const PageContainer = ({
  children,
}: PropsWithChildren<PageContainerProps>): ReactElement => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Header />
      <div className={classes.container}>{children}</div>
    </div>
  );
};

export default PageContainer;
