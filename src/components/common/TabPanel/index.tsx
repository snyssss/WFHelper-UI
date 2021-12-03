import React, { PropsWithChildren, ReactElement } from 'react';

import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

import Maybe from '../Maybe';
import { SimpleBarVertical } from '../SimpleBar';

export interface ComponentProps {
  value: number;
  index: number;
}

const StyledBox = styled(Box)(() => ({
  display: 'flex',
  flexGrow: 1,

  [`&[hidden]`]: {
    display: 'none',
  },
}));

const Component = ({
  value,
  index,
  children,
}: PropsWithChildren<ComponentProps>): ReactElement => (
  <StyledBox role="tabpanel" hidden={value !== index}>
    <SimpleBarVertical>
      <Maybe validate={value === index}>{children}</Maybe>
    </SimpleBarVertical>
  </StyledBox>
);

export default Component;
