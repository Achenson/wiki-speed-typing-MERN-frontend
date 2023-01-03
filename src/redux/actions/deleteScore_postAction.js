import store from "../store.js";

import { getStatsQuery } from "../../graphql/queries.js";

export const deleteScore_postAction = (addScore, history) => (dispatch) => {
  let stats = store.getState().resultsAndTimerState.stats;

  let statsObj = {
    // currentStatsKey: stats.currentStatsKey,
    five_s: stats["five_s"],
    one_min: stats["one_min"],
    two_min: stats["two_min"],
    five_min: stats["five_min"],
    ten_min: stats["ten_min"],
  };

  statsObj[
    changeCurrentStatsKey(
      store.getState().resultsAndTimerState.constantTimerValue_basedOnStats
    )
  ] = [
    [0, 0],
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

  dispatch({ type: "UPDATE_STATS", payload: statsObj });

  // graphql mutation
  addScore({
    variables: {
      userId: store.getState().authState.authenticatedUserId,
      ...statsObj,
    },
    refetchQueries: [
      {
        query: getStatsQuery,
        variables: { userId: store.getState().authState.authenticatedUserId },
      },
    ],
  }).then((res) => {
    if (!res.data.addScore) {
      console.log("there is no res");

      dispatch({ type: "TO_RESET_TRUE" });
      dispatch({ type: "DISPLAY_TO_RESET_TRUE" });

      if (store.getState().visibilityState.areResultsVisible) {
        dispatch({ type: "RESULTS_VISIBILITY" });
      }
      dispatch({ type: "RESET_FINAL_RESULTS" });

      dispatch({ type: "LOG_OUT" });

      if (store.getState().visibilityState.areStatsVisible) {
        toggleStats();
      }

      dispatch({ type: "LOGIN_ERROR_TRUE" });
      dispatch({
        type: "SET_LOGIN_ERROR_MESSAGE",
        payload: "Your session has expired",
      });

      history.replace("/login");
    } else {
      console.log("there is a res");
      console.log(res);
    }
  });
  function toggleStats() {
    if (!store.getState().authState.isAuthenticated) {
      return;
    }

    if (!store.getState().resultsAndTimerState.counter.isActive) {
      // toggleAreHintsVisible(h => !h);

      dispatch({ type: "STATS_VISIBILITY" });
    } else {
      dispatch({ type: "STATS_VISIBILITY" });
      dispatch({ type: "TOGGLE_ACTIVE" });
    }
  }

  function changeCurrentStatsKey(payload) {
    switch (payload) {
      case 5:
        return "five_s";
      case 60:
        return "one_min";
      case 120:
        return "two_min";
      case 300:
        return "five_min";
      case 600:
        return "ten_min";
      default:
        return "one_min";
    }
  }
};
