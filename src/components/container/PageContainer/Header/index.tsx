import React, { ReactElement } from 'react';

import {
  AppBar as MuiAppBar,
  Toolbar as MuiToolbar,
  Stack,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { Debug, Power } from '~/components/state';

const StyledAppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
}));

const StyledToolbar = styled(MuiToolbar)(({ theme }) => ({
  padding: theme.spacing(0, 2),
}));

const Header = (): ReactElement | null => (
  <StyledAppBar position="static">
    <StyledToolbar disableGutters>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        WFHelper
      </Typography>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Debug />
        <Power />
      </Stack>
    </StyledToolbar>
  </StyledAppBar>
);

export default Header;
