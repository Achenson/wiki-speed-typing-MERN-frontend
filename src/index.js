import React from "react";
import ReactDOM from "react-dom";
import store from "./redux/store.js";
import { Provider } from "react-redux";

import "./index.css";
import AppContainer from "./App";
import * as serviceWorker from "./serviceWorker";

import { ApolloProvider } from "@apollo/react-hooks";
// import ApolloClient from 'apollo-boost';
import { ApolloClient } from "apollo-client";
import { ApolloLink, Observable } from "apollo-link";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import jwtDecode from "jwt-decode";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { onError } from "apollo-link-error";

const environment = process.env.NODE_ENV;

let graphqlUri;

if (environment === "production") {
  graphqlUri = "/graphql";
} else {
  graphqlUri = "http://localhost:4000/graphql";
}

let refreshtokenUri;

if (environment === "production") {
  refreshtokenUri = "/refresh_token";
} else {
  refreshtokenUri = "http://localhost:4000/refresh_token"
}

//  ========= refreshin token benawad

const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable((observer) => {
      let handle;
      Promise.resolve(operation)
        .then((operation) => {
          const accessToken = store.getState().authState.accessToken;
          if (accessToken) {
            operation.setContext({
              headers: {
                authorization: `Bearer ${accessToken}`,
              },
            });
          }
        })
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });
        })
        .catch(observer.error.bind(observer));

      return () => {
        if (handle) handle.unsubscribe();
      };
    })
);

const cache = new InMemoryCache({});

const client = new ApolloClient({
  link: ApolloLink.from([
    new TokenRefreshLink({
      accessTokenField: "accessToken",
      isTokenValidOrUndefined: () => {
        // const token = getAccessToken();
        const token = store.getState().authState.accessToken;

        if (!token) {
          return true;
        }

        try {
          const { exp } = jwtDecode(token);
          if (Date.now() >= exp * 1000) {
            return false;
          } else {
            return true;
          }
        } catch {
          return false;
        }
      },
      fetchAccessToken: () => {
        // return fetch("http://localhost:4000/refresh_token", {


        // return fetch("/refresh_token", {
        return fetch(`${refreshtokenUri}`, {
          method: "POST",
          credentials: "include",
        });
      },
      handleFetch: (accessToken) => {
        // setAccessToken(accessToken);
        store.dispatch({ type: "SET_ACCESS_TOKEN", payload: accessToken });
      },
      handleError: (err) => {
        console.warn("Your refresh token is invalid. Try to relogin");
        console.error(err);
      },
    }),
    onError(({ graphQLErrors, networkError }) => {
      console.log(graphQLErrors);
      console.log(networkError);
    }),
    requestLink,

    new HttpLink({
      // uri: "http://localhost:4000/graphql",
      // uri: "/graphql",
      uri: `${graphqlUri}`,
      credentials: "include"
    })

  ]),
  cache,
});

// =======

// ApolloClient from apolloBoost, before migrating to Apollo-client with apollo-link
// reason for migrating: to use apollo-link which works similar to middleware, only better

/* const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  // 02:03
  credentials: "include",
  request: operation => {
    let accessToken = store.getState().authState.accessToken;


    // const accessToken = getAccessToken();
    if (accessToken) {

      console.log("acccesssss");
      
      operation.setContext({
        headers: {
          authorization: `Bearer ${accessToken}`
        }
      })
    }
  }
}); */

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <AppContainer />
    </Provider>
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
