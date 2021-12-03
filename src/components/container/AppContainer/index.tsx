import React, { FC } from 'react';

import LoadingSpinner from '~/components/common/LoadingSpinner';
import LoadProvider, { LoadContext } from '~/components/context/load';
import { useGameState } from '~/data';

import Notifier from './Notifier';
import ThemeContainer from './ThemeContainer';
import WebSocketContainer from './WebSocketContainer';

const AppContent: FC = ({ children }) => {
  const [gameState] = useGameState();

  return (
    <LoadProvider loading={gameState === null}>
      <LoadContext.Consumer>
        {({ loading }) => (loading ? <LoadingSpinner /> : <>{children}</>)}
      </LoadContext.Consumer>
    </LoadProvider>
  );
};

const AppContainer: FC = ({ children }) => (
  <ThemeContainer>
    <AppContent>
      <Notifier>{children}</Notifier>
    </AppContent>
    <WebSocketContainer />
  </ThemeContainer>
);

export default AppContainer;
