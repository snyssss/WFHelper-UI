import React, { useEffect } from 'react';

import { NextComponentType } from 'next';
import { AppContext, AppInitialProps, AppProps } from 'next/app';

import 'simplebar/src/simplebar.css';

import AppContainer from '~/components/container/AppContainer';

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
