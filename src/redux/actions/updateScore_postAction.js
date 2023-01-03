import store from "../store.js";

import { getStatsQuery } from "../../graphql/queries.js";
import resultsMaker from "../../utility functions/resultsMaker";

export const updateScore_postAction = (addScore, history) => (dispatch) => {
  let finalResultObj = {
    ...resultsMaker(
      store.getState().resultsAndTimerState.currentResults.resultsCorrect,
      store.getState().resultsAndTimerState.currentResults.resultsIncorrect,
      store.getState().resultsAndTimerState.currentResults
        .resultsIncorrect_correctable,
      store.getState().resultsAndTimerState.currentResults.resultsNoPenalty,
      0,
      store.getState().resultsAndTimerState.counter.constantTimerValue
    ),
  };

  let statsStateKey;

  switch (finalResultObj["timer length"]) {
    case "5":
      statsStateKey = "five_s";
      break;
    case "60":
      statsStateKey = "one_min";
      break;
    case "120":
      statsStateKey = "two_min";
      break;
    case "300":
      statsStateKey = "five_min";
      break;
    case "600":
      statsStateKey = "ten_min";
      break;
    default:
      statsStateKey = "one_min";
  }

  console.log("statsStateKey");
  console.log(statsStateKey);

  let upd = updateAndSort(
    store.getState().resultsAndTimerState.stats[statsStateKey],
    finalResultObj.speed,
    finalResultObj.accuracy
  );

  let updatedAndSortedArr = [];
  for (let i = 0; i < 10; i++) {
    updatedAndSortedArr.push(upd[i]);
  }

  let statsObject = {
    ...store.getState().resultsAndTimerState.stats,
    [statsStateKey]: updatedAndSortedArr,
  };

  // graphql mutation
  addScore({
    variables: {
      userId: store.getState().authState.authenticatedUserId,
      ...statsObject,
    },
    refetchQueries: [
      {
        query: getStatsQuery,
        variables: { userId: store.getState().authState.authenticatedUserId },
      },
    ],
  }).then(
    (res) => {
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

        dispatch({
          type: "SET_LOGIN_ERROR_MESSAGE",
          payload: "Your session has expired",
        });

        history.replace("/login");
      } else {
        console.log("there is a res");
        console.log(res);
      }
    },

    (err) => {
      console.log("database connection error");
      console.log(err);
    }
  );
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

  function updateAndSort(arr, speed, accuracy) {
    let finalArr = [];
    let arrToAdd = [speed, accuracy];

    arr.push(arrToAdd);
    arr.sort((a, b) => {
      if (a[0] === b[0]) {
        return b[1] - a[1];
      } else {
        return b[0] - a[0];
      }
    });

    console.log("arr length");
    console.log(arr.length);

    console.log(arr[0][0], arr[0][1]);
    console.log(arr[1][0], arr[1][1]);

    for (let i = 0; i < 10; i++) {
      finalArr.push(arr[i]);
    }

    console.log("finalArr length");
    console.log(finalArr.length);
    return finalArr;
  }
};
