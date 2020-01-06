// https://github.com/zeit/next.js/blob/canary/examples/with-next-page-transitions/pages/_app.js

import App from 'next/app';
import React from 'react';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { PageTransition } from 'next-page-transitions';

import Loader from '@components/Loader';
import { auth } from '@services/firebase/firebase';
import AuthUserContext from '@context/authUser';

const TIMEOUT = 400;

const theme = {
  colors: {
    primary: '#823eb7',
    lightGrey: '#f3f3f3',
  },
};

const GlobalStyle = createGlobalStyle`
  html,
  body {
    margin: 0;
    padding: 0;

    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;

    font-size: 16px;
    letter-spacing: -0.003em;
    line-height: 1.58;
  }

  .page-transition-enter {
    opacity: 0;
    transform: translate3d(0, 20px, 0);
  }

  .page-transition-enter-active {
    opacity: 1;
    transform: translate3d(0, 0, 0);
    transition: opacity ${TIMEOUT}ms, transform ${TIMEOUT}ms;
  }

  .page-transition-exit {
    opacity: 1;
  }

  .page-transition-exit-active {
    opacity: 0;
    transition: opacity ${TIMEOUT}ms;
  }

  .loading-indicator-appear,
  .loading-indicator-enter {
    opacity: 0;
  }

  .loading-indicator-appear-active,
  .loading-indicator-enter-active {
    opacity: 1;
    transition: opacity ${TIMEOUT}ms;
  }
`;

const MyAppF = ({ children }) => {
  const [authUser, setAuthUser] = React.useState();

  React.useEffect(() => {
    let onAuthStateListener = auth.onAuthStateChanged(authUser => {
      authUser ? setAuthUser(authUser) : setAuthUser(null);
    });

    return () => onAuthStateListener();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <AuthUserContext.Provider value={authUser}>
        <GlobalStyle />
        <PageTransition
          timeout={TIMEOUT}
          classNames="page-transition"
          loadingComponent={<Loader />}
          loadingDelay={500}
          loadingTimeout={{
            enter: TIMEOUT,
            exit: 0,
          }}
          loadingClassNames="loading-indicator"
        >
          {children}
        </PageTransition>
      </AuthUserContext.Provider>
    </ThemeProvider>
  );
};

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <MyAppF>
        <Component {...pageProps} />
      </MyAppF>
    );
  }
}