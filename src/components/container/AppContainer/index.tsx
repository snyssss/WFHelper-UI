import React, { FC } from 'react';

import SocketContextProvider from '~/components/context/socket';

import Notifier from './Notifier';
import ThemeContainer from './ThemeContainer';

const AppContainer: FC = ({ children }) => (
  <ThemeContainer>
    <Notifier>
      <SocketContextProvider>{children}</SocketContextProvider>
    </Notifier>
  </ThemeContainer>
);

export default AppContainer;
