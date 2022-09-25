import 'styles/globals.css'
import type { AppProps } from 'next/app'
import { ApolloProvider, gql } from "@apollo/client";
import client, { makeGraphqlQuery } from "apollo-client";

import { wrapper, store } from "redux/reduxStore";
import { Provider } from "react-redux";
import { useEffect, useState } from 'react';
import { setJwtTokenAction, setUserInfoAction } from 'redux/actions/actions';
import { useRouter } from 'next/router';
import axios from 'axios';
import memoryCache from 'utility/mem-cache/mem-cache';
import { listenToPairUpdates } from 'utility/binance-coin-trading/pairsManager';
import Toast from 'components/Toast';
import { fetchUserInfo } from 'graphql/queries/fetchUserInfo';

function MyApp({ Component, pageProps }: AppProps) {
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (loaded) return; // it's not gonna do anything between re-render here so 100% safe
    (async () => {
      const { user, jwtToken } = await fetchUserInfo();

      const setUserAndJwtTokenAction = (newUser: any, newJwtToken: any) => {
        return async (dispatch: any, getState: any) => {
          dispatch(setUserInfoAction(newUser));
          dispatch(setJwtTokenAction(newJwtToken));

          const newState = getState();

          if (newState.user && ['/sign-up', '/sign-in'].includes(router.pathname)) {
            window.location.href = '/stock/BTC';
          } else setLoaded(true);
        }
      }
      // we must use store.dispatch because the normal useDispatch() does not know redux-thunk middleware exists
      store.dispatch(setUserAndJwtTokenAction(user, jwtToken));

    })();
  }, [loaded]);

  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <Toast />
        {
          loaded && <Component {...pageProps} />
        }
      </ApolloProvider>
    </Provider>
  );
}

MyApp.getInitialProps = async (context: any) => {
  if (typeof window === "undefined" && !memoryCache.get('tickersWSstarted')) {
    const signature = Math.random();
    memoryCache.set('tickersWSstarted', signature);

    console.log('Start listen to tickers data websocket stream: ', signature);

    listenToPairUpdates();
  }

  return { props: {} };
};

export default wrapper.withRedux(MyApp);
