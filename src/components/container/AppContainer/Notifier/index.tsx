import React, { ComponentType, FC } from 'react';

import { Grow } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { SnackbarProvider } from 'notistack';

const Notifier: FC = ({ children }) => (
  <SnackbarProvider
    dense
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    TransitionComponent={Grow as ComponentType<TransitionProps>}
  >
    {children}
  </SnackbarProvider>
);

export default Notifier;
