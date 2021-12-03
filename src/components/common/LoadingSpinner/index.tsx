import React, { ReactElement } from 'react';

import { CircularProgress, Backdrop as MuiBackdrop } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useLoading } from '~/components/context/load';

const StyledBackdrop = styled(MuiBackdrop)(({ theme }) => ({
  position: 'absolute',
  background: theme.palette.action.disabledBackground,
  zIndex: theme.zIndex.modal,
}));

const LoadingSpinner = (): ReactElement | null => {
  const loading = useLoading();

  if (loading) {
    return (
      <StyledBackdrop transitionDuration={{ enter: 1000 }} open={loading}>
        <CircularProgress />
      </StyledBackdrop>
    );
  }

  return null;
};

export default LoadingSpinner;
