import React from "react";
import { connect } from "react-redux";

import { Link } from "react-router-dom";

import { logoutMutation } from "../graphql/queries.js";
import { useMutation } from "@apollo/react-hooks";

function AuthenticationUI({
  isAuthenticated,
  toggleStats,
  logOut,
  areStatsVisible,
  isActive,
  toggleActive,
  setToReset_true,
  toggleAreResultsVisible,
  areResultsVisible,
  resetFinalResults,
  setDisplayToReset_true,
  toggleProfile,
  toggleHints,
  areHintsVisible,
  isProfileVisible,
}) {
  const [logoutMut, { client }] = useMutation(logoutMutation);

  function authLinks() {
    if (!isAuthenticated) {
      return (
        <div className="auth-div">
          <Link
            to="/register"
            className="main-link"
            onClick={() => {
              if (isActive) {
                toggleActive();
              }
            }}
          >
            Register
          </Link>
          <Link
            to="/login"
            className="main-link"
            onClick={() => {
              if (isActive) {
                toggleActive();
              }
            }}
          >
            Login
          </Link>
        </div>
      );
    } else {
      return (
        <div className="auth-div">
          <span
            className="main-link"
            onClick={() => {
              if (areHintsVisible) {
                toggleHints();
              }

              if (isActive) {
                toggleActive();
              }

              toggleProfile();
            }}
          >
            Profile
          </span>
          <span
            className="main-link"
            onClick={() => {
              setToReset_true();
              setDisplayToReset_true();
              if (areResultsVisible) {
                toggleAreResultsVisible();
              }
              resetFinalResults();
              logOut();
              // mutation
              logoutMut();
              client.resetStore();

              if (areStatsVisible) {
                toggleStats();
              }

              if (isProfileVisible) {
                toggleProfile();
              }
            }}
          >
            Logout
          </span>
        </div>
      );
    }
  }

  return authLinks();
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.authState.isAuthenticated,
    areStatsVisible: state.visibilityState.areStatsVisible,
    isActive: state.resultsAndTimerState.counter.isActive,
    areResultsVisible: state.visibilityState.areResultsVisible,
    areHintsVisible: state.visibilityState.areHintsVisible,
    isProfileVisible: state.visibilityState.isProfileVisible,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logIn: () => dispatch({ type: "LOG_IN" }),
    logOut: () => dispatch({ type: "LOG_OUT" }),
    toggleActive: () => dispatch({ type: "TOGGLE_ACTIVE" }),
    setToReset_true: () => dispatch({ type: "TO_RESET_TRUE" }),
    resetFinalResults: () => dispatch({ type: "RESET_FINAL_RESULTS" }),
    toggleAreResultsVisible: () => dispatch({ type: "RESULTS_VISIBILITY" }),
    setDisplayToReset_true: () => dispatch({ type: "DISPLAY_TO_RESET_TRUE" }),
    toggleProfile: () => dispatch({ type: "PROFILE_VISIBILITY" }),
    toggleHints: () => dispatch({ type: "HINTS_VISIBILITY" }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
  // Your component will receive dispatch by default, i.e., when you do not supply a second parameter to connect():
)(AuthenticationUI);
