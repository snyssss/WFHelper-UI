import React, { ReactElement, ReactNode } from 'react';

import { Box, Tab, Typography, TypographyProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface ComponentProps {
  icon?: ReactNode;
  title: ReactNode;
}

const StyledBox = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const StyledCaption = styled((props: TypographyProps) => (
  <Typography variant="caption" {...props} />
))(({ theme }) => ({
  height: theme.spacing(2),
  lineHeight: theme.spacing(2),
  whiteSpace: 'nowrap',
}));

const Component = ({ icon, title, ...props }: ComponentProps): ReactElement => (
  <Tab
    label={
      <StyledBox>
        {icon}
        <StyledCaption>{title}</StyledCaption>
      </StyledBox>
    }
    {...props}
  />
);

export default Component;
