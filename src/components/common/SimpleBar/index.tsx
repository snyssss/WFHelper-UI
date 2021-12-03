import { styled } from '@mui/material/styles';
import SimpleBarReact from 'simplebar-react';

const SimpleBar = styled(SimpleBarReact)(() => ({
  flex: 1,
  width: '100%',
  height: '100%',
}));

const SimpleBarHorizontal = styled(SimpleBarReact)(() => ({
  flex: 1,
  width: '100%',
  overflowY: 'hidden',
}));

const SimpleBarVertical = styled(SimpleBarReact)(() => ({
  flex: 1,
  height: '100%',
  overflowX: 'hidden',
}));

export default SimpleBar;

export { SimpleBarHorizontal, SimpleBarVertical };
