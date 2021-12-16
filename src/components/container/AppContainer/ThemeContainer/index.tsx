import React, { FC } from 'react';

import Head from 'next/head';

import '@mui/lab/themeAugmentation';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';

import ThemeContextProvider, { ThemeContext } from '~/components/context/theme';

const cache = createCache({ key: 'css', prepend: true });

const { extractCriticalToChunks } = createEmotionServer(cache);

const ThemeContainer: FC = ({ children }) => {
  return (
    <ThemeContextProvider>
      <ThemeContext.Consumer>
        {({ theme }) => (
          <CacheProvider value={cache}>
            <Head>
              <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
              <meta name="force-rendering" content="webkit" />
              <meta name="renderer" content="webkit" />
              <meta name="theme-color" content={theme.palette.primary.main} />
            </Head>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {children}
            </ThemeProvider>
          </CacheProvider>
        )}
      </ThemeContext.Consumer>
    </ThemeContextProvider>
  );
};

export default ThemeContainer;

export { extractCriticalToChunks };
