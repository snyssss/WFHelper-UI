import React, { useEffect } from 'react';

import { NextComponentType } from 'next';
import { AppInitialProps, AppContext, AppProps } from 'next/app';

import AppContainer from '~/components/container/AppContainer';

import 'simplebar/src/simplebar.css';

const App: NextComponentType<AppContext, AppInitialProps, AppProps> = ({
  Component,
  pageProps,
}: AppProps) => {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');

    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <AppContainer>
      <Component {...pageProps} />
    </AppContainer>
  );
};

export default App;
