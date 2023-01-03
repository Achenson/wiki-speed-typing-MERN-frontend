import React from "react";
import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";

//ApolloClient & ApolloProvider are in store.js

import "./App.css";

import Main from "./components_links/Main.js";

import Login from "./components_links/Login.js";
import Register from "./components_links/Register.js";
import PasswordChange from "./components_links/PasswordChange.js";
import PasswordForgotten from "./components_links/PasswordForgotten.js";
import ForgottenPassChange from "./components_links/ForgottenPassChange.js";

import DeleteAccount from "./components_links/DeleteAccount.js";
import CustomRoute from "./components_links/CustomRoute.js";
import CustomRouteAuthGuarded from "./components_links/CustomRoute_AuthGuarded.js";

// import Test from "./components/Test.js";

import { fetchWikiApi } from "./redux/actions/fetchPostAction.js";

// import { BrowserRouter, Route, Link, Switch, Redirect, useHistory, HashRouter } from "react-router-dom";
import { Route, Switch, HashRouter } from "react-router-dom";

const environment = process.env.NODE_ENV;

let refreshtokenUri;

if (environment === "production") {
  refreshtokenUri = "/refresh_token";
} else {
  refreshtokenUri = "http://localhost:4000/refresh_token";
}

//!!!!! imported actions creators must be passed here as props
function App({
  //  from mapStateToProps
  isAuthenticated,

  // imported actionCreator
  fetchingWiki,
  newRandomArticle,
  setWikiButtonClickable_true,
  setWikiButtonClickable_false,
  logIn,
  isMainRendered,
  mainRenderedTrue,
}) {
  // ===========================================

  // disabling random wiki article button in <Fetch/>
  const disablingButton = useRef(null);

  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    // delay, so the loading text is not seen on every page refresh
    // but only when the refresh is slow
    setTimeout(() => setIsPaused(false), 500);
  }, [setIsPaused]);

  useEffect(() => {
    // fetch("http://localhost:4000/refresh_token", {
    // fetch("/refresh_token", {
    fetch(`${refreshtokenUri}`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) =>
        res.json().then((data) => {
          // console.log(data);
          // console.log("refreshhhing");

          if (data.accessToken) {
            logIn({
              authenticatedUserId: data.userId,
              token: data.accessToken,
            });
          }

          mainRenderedTrue();
        })
      )
      .catch((err) => {
        console.log("fetch error");
        console.log(err);
        mainRenderedTrue();
      });
  }, [logIn, mainRenderedTrue]);

  // fetching WikiApi

  useEffect(() => {
    // checking if fetchingWiki returns true of false! and calling fetchingWiki right in this line
    if (newRandomArticle) {
      fetchingWiki();
    }
  }, [
    newRandomArticle,
    fetchingWiki,
    setWikiButtonClickable_false,
    setWikiButtonClickable_true,
  ]);

  useEffect(() => {
    if (newRandomArticle) {
      setWikiButtonClickable_false();
    } else {
      // setTimeout(() => {
      if (disablingButton.current) {
        disablingButton.current.removeAttribute("disabled");
      }
      setWikiButtonClickable_true();
      // }, 5000);
    }
  }, [
    newRandomArticle,
    setWikiButtonClickable_false,
    setWikiButtonClickable_true,
  ]);

  const [counter, setCounter] = useState(0);
  const [iter, setIter] = useState(0);

  let arrOfLoading = ["...", ".", ".."];

  // interval with notes -> Main.js
  useEffect(() => {
    let timerInterval = null;

    if (!isMainRendered && counter <= 8) {
      timerInterval = setInterval(() => {
        setCounter((c) => c + 1);
        if (iter < 2) {
          setIter((i) => i + 1);
        } else {
          setIter(0);
        }
      }, 500);
    }

    return () => clearInterval(timerInterval);
  }, [counter, iter, isMainRendered]);

  if (!isMainRendered && isPaused) {
    return <div></div>;
  }

  if (!isMainRendered && !isPaused) {
    return (
      <div className="loading-div">
        <h3 className="title loading-text loading-text-top">
          loading{arrOfLoading[iter]}
        </h3>
        <h3 className="title loading-text">&nbsp;&nbsp;please wait</h3>
      </div>
    );
  }

  return (
    <div className="app-outer-container">
      <h3 className="title">Wiki Speed Typing</h3>

      <HashRouter>
        {/* <BrowserRouter> */}
        {/* testing headers */}
        {/* <Link to="/test">Test</Link> */}
        <Switch>
          {/* <Route path="/" exact component={Display}/> */}
          <Route
            path="/"
            exact
            // normally it would be component+ but render is needed is passing props
            // to a component
            render={(props) => <Main disablingButton={disablingButton} />}
          />

          {/* custom routes are used to avoid warning when rendering <Routes> conditionally:
            <Route> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.
             */}

          {/* must NOT be authenticated to access */}
          <CustomRoute
            isAuthenticated={isAuthenticated}
            path="/register"
            component={Register}
          />
          <CustomRoute
            isAuthenticated={isAuthenticated}
            path="/login"
            component={Login}
          />
          <CustomRoute
            path="/passforgot"
            component={PasswordForgotten}
            isAuthenticated={isAuthenticated}
          />
          <CustomRoute
            path="/passforgot-change/:token"
            component={ForgottenPassChange}
            isAuthenticated={isAuthenticated}
          />

          {/* must be authenticated to access */}
          <CustomRouteAuthGuarded
            path="/passchange"
            component={PasswordChange}
            isAuthenticated={isAuthenticated}
          />
          <CustomRouteAuthGuarded
            path="/delete-account"
            component={DeleteAccount}
            isAuthenticated={isAuthenticated}
          />

          {/* testing isAuth, has to be clicked on Link to work */}
          {/* <Route path="/test" component={Test} /> */}

          <Route render={() => <h1>404: page not found</h1>} />
        </Switch>
        {/* </BrowserRouter> */}
      </HashRouter>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    // auth
    isAuthenticated: state.authState.isAuthenticated,
    newRandomArticle: state.displayState.textDisplay.newRandomArticle,
    isMainRendered: state.visibilityState.isMainRendered,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // fetch & wikiController

    // !!! dispatching function instead of object thanks to redux-thunk
    fetchingWiki: () => dispatch(fetchWikiApi()),
    setWikiButtonClickable_true: () =>
      dispatch({ type: "WIKI_BTN_CLICKABLE_TRUE" }),
    setWikiButtonClickable_false: () =>
      dispatch({ type: "WIKI_BTN_CLICKABLE_FALSE" }),
    logIn: (dataObj) => dispatch({ type: "LOG_IN", payload: dataObj }),
    mainRenderedTrue: () => dispatch({ type: "MAIN_RENDERED_TRUE" }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
  // Your component will receive dispatch by default, i.e., when you do not supply a second parameter to connect():
)(App);
