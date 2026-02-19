'use client';

import { Provider } from 'react-redux';
import { store } from '../store';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Arial, sans-serif;
    background-color: #f4f7f6;
  }
`;

const theme = {
  colors: {
    primary: '#0070f3',
    background: '#ffffff',
    text: '#333333',
  },
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        {children}
      </ThemeProvider>
    </Provider>
  );
}