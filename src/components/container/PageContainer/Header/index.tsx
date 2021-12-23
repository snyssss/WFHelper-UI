import React, { ReactElement, useEffect } from 'react';

import {
  AppBar as MuiAppBar,
  Toolbar as MuiToolbar,
  Stack,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { useSnackbar } from 'notistack';

import { EnergyMonitor } from '~/components/misc';
import { Debug, Power } from '~/components/state';
import { useEnergy } from '~/data';

const StyledAppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
}));

const StyledToolbar = styled(MuiToolbar)(({ theme }) => ({
  padding: theme.spacing(0, 2),
}));

const Header = (): ReactElement | null => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [energy] = useEnergy();

  useEffect(() => {
    if (energy) {
      const splitArray = energy.split('/');

      if (splitArray[0] === splitArray[1]) {
        enqueueSnackbar('体力已满', {
          key: 'energy',
          variant: 'warning',
          persist: true,
          preventDuplicate: true,
        });
        return;
      }
    }

    closeSnackbar('energy');
  }, [energy]);

  return (
    <>
      <StyledAppBar position="static">
        <StyledToolbar disableGutters>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {energy ? `WFHelper - ${energy}` : 'WFHelper'}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Debug />
            <Power />
          </Stack>
        </StyledToolbar>
      </StyledAppBar>
      <EnergyMonitor />
    </>
  );
};

export default Header;
