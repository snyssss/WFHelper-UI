import React, {
  PropsWithChildren,
  ReactElement,
  createContext,
  useState,
} from 'react';

import { blue, grey, orange } from '@mui/material/colors';
import {
  Theme,
  createTheme as createLegacyModeTheme,
} from '@mui/material/styles';

export type ThemeContextProps = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export type ThemeContextProviderProps = PropsWithChildren<
  Partial<Pick<ThemeContextProps, 'theme'>>
>;

const createTheme = (fontSize = 14, spacing = 12): Theme =>
  createLegacyModeTheme({
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '#__next, html, body': {
            position: 'relative',
            height: '100%',
          },
        },
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            fontSize: 24,
          },
        },
      },
    },
    mixins: {
      toolbar: {
        minHeight: 64,
      },
    },
    palette: {
      mode: 'light',
      primary: blue,
      secondary: orange,
      background: {
        default: grey[50],
      },
    },
    shape: {
      borderRadius: 0,
    },
    spacing,
    typography: {
      fontSize,
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        '"Noto Sans"',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"',
      ].join(','),
    },
  });

const ThemeContext = createContext<ThemeContextProps>({} as ThemeContextProps);

const ThemeContextProvider = ({
  theme: customTheme,
  children,
}: ThemeContextProviderProps): ReactElement => {
  const [theme, setTheme] = useState(customTheme || createTheme());

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;

export { ThemeContext, createTheme };
