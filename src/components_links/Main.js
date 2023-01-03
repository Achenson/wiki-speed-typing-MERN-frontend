import React from "react";
import { useEffect, useRef } from "react";
import { connect } from "react-redux";
//ApolloClient & ApolloProvider are in store.js
import { useQuery, useMutation } from "@apollo/react-hooks";

import Display from "../components/Display.js";

import { updateScore_postAction } from "../redux/actions/updateScore_postAction.js";

// import { BrowserRouter, Route, Link, Switch, Redirect, useHistory, HashRouter } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { getStatsQuery } from "../graphql/queries.js";
import { updateStats } from "../graphql/queries.js";

//!!!!! imported actions creators must be passed here as props
function Main({
  //  from mapStateToProps
  timerValue,
  constantTimerValue,
  isActive,
  toReset,
  isCounterRunning,
  areResultsVisible,
  isAuthenticated,
  areHintsVisible,
  // from mapDispatchToProps
  toggleAreHintsVisible,
  toggleAreResultsVisible,
  toggleAreStatsVisible,
  resultsReset,
  setLiveResults,
  resetLiveResults,
  setFinalResults,

  setTimerValue,
  setTimerValueCountdown,
  toggleIsCounterRunning,
  toggleActive,
  setIsActiveToFalse,
  setToReset_true,
  setToReset_false,
  setDisplayToReset_true,
  setConstantTimerValue,

  disableFocusTextArea,
  updateScore,
  setStats,
  authenticatedUserId,
  disablingButton,
  logOut,
  setLoginErrorMessage,
  loginError_true,

  constantTimerValue_basedOnStats,
  areStatsVisible,
  setLiveResultsFinal,
}) {
  let history = useHistory();

  const { error } = useQuery(getStatsQuery, {
    variables: { userId: authenticatedUserId },
    // fetchPolicy: "no-cache",
  });

  if (error) {
    if (isAuthenticated) {
      logOut();
      loginError_true();
      setLoginErrorMessage("querying database connection error");
      history.replace("/login");
    }
  }

  // In addition to a mutate function, the useMutation hook returns an object that represents
  //  the current state of the mutation's execution.
  const [addScore] = useMutation(updateStats);

  // for keyboard shortcuts
  useEffect(() => {
    document.addEventListener("keypress", handleKeyPress);
  });

  // not crucial, Stats shouldn't be accessed in not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setStats({
        five_s: makeDefaultStats(1),
        thirty_s: makeDefaultStats(2),
        one_min: makeDefaultStats(3),
        two_min: makeDefaultStats(4),
        five_min: makeDefaultStats(5),
      });
    }
  }, [isAuthenticated, setStats]);

  function makeDefaultStats(n) {
    return [
      [n, n],
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
    ];
  }

  // display
  function toggleStats() {
    if (!isAuthenticated) {
      return;
    }

    if (areHintsVisible) {
      toggleHints();
    }

    if (areStatsVisible && !isCounterRunning) {
      setTimerOnSelect(constantTimerValue_basedOnStats);
    }

    if (!isActive) {
      // toggleAreHintsVisible(h => !h);
      toggleAreStatsVisible();
    } else {
      toggleAreStatsVisible();
      toggleActive();
    }
  }

  function toggleHints() {
    if (!isActive) {
      // toggleAreHintsVisible(h => !h);
      toggleAreHintsVisible();
    }
  }

  // for turning results off when the timer is running  =========
  // BEFORE: useCallback used
  //useCallback is used so useEffect below won't run on every every time toggleResults function is called
  /*   const toggleResults = useCallback(() => {
    // functional update(r=>!r) so the useCallback don't depend on areResultsVisible
    // toggleAreResultsVisible(r => !r);
    toggleAreResultsVisible();
  }, [toggleAreResultsVisible]); */

  useEffect(() => {
    if (isActive && timerValue > 0 && areResultsVisible) {
      toggleAreResultsVisible();
    }

    if (!areResultsVisible && timerValue <= 0) {
      toggleAreResultsVisible();
    }
  }, [isActive, timerValue, areResultsVisible, toggleAreResultsVisible]);

  // for counter=======
  useEffect(() => {
    // otherwise there will be error: timerInterval not defined
    let timerInterval = null;

    if (isActive && timerValue > 0) {
      // timerInterval = setInterval(() => setTimerValue(t => t - 1), 1000);
      timerInterval = setInterval(() => setTimerValueCountdown(), 1000);

      if (!isCounterRunning) {
        // toggleIsCounterRunning(b => !b);
        toggleIsCounterRunning();
      }
    }

    if (toReset) {
      clearInterval(timerInterval);
      setTimerValue(constantTimerValue);
      setIsActiveToFalse();
      setDisplayToReset_true();

      if (isCounterRunning) {
        // toggleIsCounterRunning(b => !b);
        toggleIsCounterRunning();
      }

      setToReset_false();
    }
    // turning interval off on pause
    if (!isActive && timerValue > 0) {
      clearInterval(timerInterval);
    }

    if (timerValue <= 0) {
      setDisplayToReset_true();
      clearInterval(timerInterval);
      setIsActiveToFalse();

      if (isCounterRunning) {
        // toggleIsCounterRunning(b => !b);
        toggleIsCounterRunning();
      }

      setTimerValue(constantTimerValue);
    }

    // this equivalent to componentWillUnmount
    // "our interval would be cleared and set again whenever the count changes" (useEffect complete guite)
    return () => clearInterval(timerInterval);
    // useEffect will run every time isActive changes
  }, [
    timerValue,
    isActive,
    toReset,
    isCounterRunning,
    constantTimerValue,
    setDisplayToReset_true,
    toggleIsCounterRunning,
    setTimerValue,
    setTimerValueCountdown,
    setToReset_false,
    toggleActive,
    setIsActiveToFalse,
  ]);

  // for time select
  function setTimerOnSelect(value) {
    setTimerValue(parseInt(value));
    setConstantTimerValue(parseInt(value));
  }

  //  for key press
  let keysPressed = {};

  function handleKeyPress(event) {
    // pause button will work only if the timer hasn't started yet
    if (constantTimerValue !== timerValue) {
      keysPressed[event.key] = true;

      if (event.key === "Tab" && isActive) {
        toggleActive();
        delete keysPressed[event.key];
      }

      if (keysPressed["Shift"] && event.key === "Delete") {
        setToReset_true();

        delete keysPressed[event.key];
      }
    }
    return;
  }

  // useRef unfocusing btn-hints on textarea focus
  // useRef focusin on textArea if the timer is active
  const focusElement = useRef(null);
  const focusTextArea = useRef(null);

  useEffect(() => {
    if (disableFocusTextArea) {
      focusTextArea.current.setAttribute("disabled", true);
    }

    if (!disableFocusTextArea) {
      focusTextArea.current.removeAttribute("disabled");
    }
  }, [disableFocusTextArea]);

  useEffect(() => {
    if (timerValue <= 0) {
      focusElement.current.focus();
    }
  }, [timerValue]);

  useEffect(() => {
    if (isActive) {
      putFocusOnTextArea();
    }
  }, [isActive]);

  function putFocusOnTextArea() {
    focusTextArea.current.focus();
  }

  // for setting results (live & final)=====
  useEffect(() => {
    if (isActive && timerValue === constantTimerValue) {
      // for displaying 0speed & 0 accuracy if the counter becomes active
      resultsReset();
      resetLiveResults();

      // for live results display every 2s  ==============
    } else if (isActive && timerValue % 2 === 0) {
      if (timerValue > 0) {
        setLiveResults();
      } else {
        // setting the same results as finalResults
        setLiveResultsFinal();
      }
    }
    if (toReset) {
      resetLiveResults();
    }
    if (timerValue <= 0) {
      setFinalResults();

      if (isAuthenticated) {
        updateScore(addScore, history);
      }
    }
  }, [
    timerValue,
    isActive,
    toReset,
    constantTimerValue,
    resetLiveResults,
    resultsReset,
    setFinalResults,
    setLiveResults,
    setLiveResultsFinal,
    setStats,
    addScore,

    updateScore,
    isAuthenticated,
    history,
  ]);
  // ===========================================

  return (
    <div className="App" onKeyDown={handleKeyPress}>
      {/* <div className="app-outer-container">
        <h3 className="title">Wiki Speed Typing</h3> */}
      <Display
        // timer
        setTimerOnSelect={setTimerOnSelect}
        // hints & results visibility
        toggleHints={toggleHints}
        toggleStats={toggleStats}
        // disabling select, menaging focus
        // isDisabled={isDisabled} isDisabled moved to Display!
        focusTextArea={focusTextArea}
        putFocusOnTextArea={putFocusOnTextArea}
        focusElement={focusElement}
        // results
        disablingButton={disablingButton}
        addScore={addScore}
        mainHistory={history}
      />
      {/* custom routes are used to avoid warning when rendering <Routes> conditionally:
            <Route> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.
             */}
      {/* </div> */}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    //  !!!! totalState is from reducers.js combineReducers at the end
    timerValue: state.resultsAndTimerState.counter.timerValue, // (1)
    constantTimerValue: state.resultsAndTimerState.counter.constantTimerValue, // (1)
    isActive: state.resultsAndTimerState.counter.isActive, // (1)
    toReset: state.resultsAndTimerState.counter.toReset, // (1)
    isCounterRunning: state.resultsAndTimerState.counter.isCounterRunning, // (1)
    // hints & results
    areHintsVisible: state.visibilityState.areHintsVisible,
    areResultsVisible: state.visibilityState.areResultsVisible,
    areStatsVisible: state.visibilityState.areStatsVisible,
    // auth
    isAuthenticated: state.authState.isAuthenticated,
    authenticatedUserId: state.authState.authenticatedUserId,
    //
    disableFocusTextArea: state.displayState.inputArea.disableFocusTextArea,

    constantTimerValue_basedOnStats:
      state.resultsAndTimerState.constantTimerValue_basedOnStats,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    //  resultsCorrect, resultsIncorrect, resultsNoPenalty in for <Display>,
    // here deleted
    resultsReset: () => dispatch({ type: "RESULTS_RESET" }),
    setLiveResults: () => dispatch({ type: "SET_LIVE_RESULTS" }),
    resetLiveResults: () => dispatch({ type: "RESET_LIVE_RESULTS" }),
    setFinalResults: () => dispatch({ type: "SET_FINAL_RESULTS" }),
    //setMyText & setWikiTitle in <Fetch/> only, here deleted
    // fetch & wikiController
    setNewRandomArticle_false: () => dispatch({ type: "RANDOM_ARTICLE_FALSE" }),
    // wikiController from Display
    setNewRandomArticle_true: () => dispatch({ type: "RANDOM_ARTICLE_TRUE" }),
    // for App
    setDisplayToReset_true: () => dispatch({ type: "DISPLAY_TO_RESET_TRUE" }),
    //
    toggleActive: () => dispatch({ type: "TOGGLE_ACTIVE" }),
    setIsActiveToFalse: () => dispatch({ type: "SET_IS_ACTIVE_TO_FALSE" }),
    setTimerValue: (data) => dispatch({ type: "TIMER_VALUE", payload: data }),
    setTimerValueCountdown: (data) =>
      dispatch({ type: "TIMER_VALUE_COUNTDOWN", payload: data }),

    setConstantTimerValue: (data) =>
      dispatch({ type: "CONSTANT_TIMER_VALUE", payload: data }),

    setToReset_true: () => dispatch({ type: "TO_RESET_TRUE" }),
    setToReset_false: () => dispatch({ type: "TO_RESET_FALSE" }),
    toggleIsCounterRunning: () => dispatch({ type: "COUNTER_RUNNING" }),

    toggleAreHintsVisible: () => dispatch({ type: "HINTS_VISIBILITY" }),
    toggleAreResultsVisible: () => dispatch({ type: "RESULTS_VISIBILITY" }),
    toggleAreStatsVisible: () => dispatch({ type: "STATS_VISIBILITY" }),
    // for Stats
    // for synchronizing select timer with select from Stats
    setCurrentStatsKey: (data) =>
      dispatch({ type: "SET_CURRENT_STATS", payload: data }),
    // !!! dispatching function instead of object thanks to redux-thunk
    // fetchingWiki: () => dispatch(fetchWikiApi()),
    updateScore: (addScore, history) =>
      dispatch(updateScore_postAction(addScore, history)),
    // initially setting stats from setStatsQuery apollo hook
    setStats: (data) => dispatch({ type: "SET_STATS", payload: data }),

    logOut: () => dispatch({ type: "LOG_OUT" }),
    setLoginErrorMessage: (error) =>
      dispatch({ type: "SET_LOGIN_ERROR_MESSAGE", payload: error }),
    loginError_true: () => dispatch({ type: "LOGIN_ERROR_TRUE" }),
    setLiveResultsFinal: () => dispatch({ type: "SET_LIVE_RESULTS_FINAL" }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
  // Your component will receive dispatch by default, i.e., when you do not supply a second parameter to connect():
)(Main);
