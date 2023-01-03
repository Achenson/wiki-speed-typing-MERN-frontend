import React from "react";
import { useEffect } from "react";
import { connect } from "react-redux";
import SingleStat from "./SingleStat";

// connecting graphql to component
import { useQuery } from "@apollo/react-hooks";

import { getStatsQuery } from "../graphql/queries.js";
import { deleteScore_postAction } from "../redux/actions/deleteScore_postAction.js";

function Stats({
  areStatsVisible,

  isConfirmDeleteVisible,
  confirmDeleteVisibility_true,
  confirmDeleteVisibility_false,
  // graphql mutation
  addScore,
  stats,
  authenticatedUserId,
  setStats,
  mainHistory,
  deleteScore,
  constantTimerValue_basedOnStats,
  setConstantTimerValue_basedOnStats,
  statsBtnDisabled,
  statsBtnEnabled,
}) {
  useEffect(() => {
    // console.log("render");
    confirmDeleteVisibility_false();
  }, [areStatsVisible, confirmDeleteVisibility_false]);

  function renderDeletion() {
    if (!isConfirmDeleteVisible) {
      return (
        <div className="delete-score-div  delete-score-initial-div">
          <span className="delete-score-text">
            Delete top score for selected timer length&nbsp;&nbsp;
          </span>
          <button
            className="btn btn-control control-item btn-reset btn-delete-stats"
            onClick={() => {
              confirmDeleteVisibility_true();
            }}
          >
            x
          </button>
        </div>
      );
    } else {
      return (
        <div className="delete-score-div delete-score-confirmation-div ">
          <span className="delete-score-text">
            Confirm deletion: &nbsp;&nbsp;
          </span>
          <span
            className="delete-score-confirm"
            onClick={() => {
              deleteScore(addScore, mainHistory);

              confirmDeleteVisibility_false();
            }}
          >
            DELETE
          </span>
          &nbsp;&nbsp;
          <span
            className="delete-score-cancel"
            onClick={confirmDeleteVisibility_false}
          >
            CANCEL
          </span>
        </div>
      );
    }
  }

  // same as in  resultsAndTimerReducer
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

  const { loading, error, data } = useQuery(getStatsQuery, {
    variables: { userId: authenticatedUserId },
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    if (loading) {
      // console.log("loading");
    }
    if (error) {
      // console.log("error");
    }

    if (data) {
      statsBtnEnabled();

      const { score } = data;

      // console.log("score");
      // console.log(data);
      // console.log(score);

      if (score) {
        setStats(score);
      } else {
        setStats({
          five_s: makeDefaultStats(1),
          one_min: makeDefaultStats(2),
          two_min: makeDefaultStats(3),
          five_min: makeDefaultStats(4),
          ten_min: makeDefaultStats(5),
        });
      }
    }
  }, [loading, error, data, setStats, statsBtnEnabled]);

  if (loading) {
    statsBtnDisabled();
    return <h5>connecting to database...</h5>;
  }

  if (error) {
    statsBtnDisabled();
    return <h5>database connection error </h5>;
  }

  if (!stats) {
    return null;
  }

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

  return (
    <div
      className="stats"
      style={{
        visibility: `${areStatsVisible ? "visible" : "hidden"}`,
      }}
    >
      <div className="inner-stats container">
        <div className="score-main">
          <p className="score-title">Top score</p>
          <div className="score-select-div">
            <p>timer length:&nbsp;</p>
            <select
              className="control-item timer-select top-score-timer-select"
              onChange={(e) => {
                setConstantTimerValue_basedOnStats(parseInt(e.target.value));
              }}
              value={constantTimerValue_basedOnStats.toString()}
            >
              <option value="5">00:05</option>
              <option value="60">01:00</option>
              <option value="120">02:00</option>
              <option value="300">05:00</option>
              <option value="600">10:00</option>
            </select>
          </div>
        </div>

        <ul className="score-list container">
          {/* !! [] not . */}
          {stats[changeCurrentStatsKey(constantTimerValue_basedOnStats)].map(
            (el, i) => {
              if (i > 9) {
                return null;
              } else {
                return <SingleStat speed={el[0]} accuracy={el[1]} key={i} />;
              }
            }
          )}
        </ul>

        {renderDeletion()}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    isConfirmDeleteVisible: state.visibilityState.isConfirmDeleteVisible,
    areStatsVisible: state.visibilityState.areStatsVisible,
    stats: state.resultsAndTimerState.stats,
    authenticatedUserId: state.authState.authenticatedUserId,
    constantTimerValue_basedOnStats:
      state.resultsAndTimerState.constantTimerValue_basedOnStats,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    confirmDeleteVisibility_true: () =>
      dispatch({ type: "CONFIRM_DELETE_VISIBILITY_TRUE" }),
    confirmDeleteVisibility_false: () =>
      dispatch({ type: "CONFIRM_DELETE_VISIBILITY_FALSE" }),
    setStats: (data) => dispatch({ type: "SET_STATS", payload: data }),
    deleteScore: (addScore, history) =>
      dispatch(deleteScore_postAction(addScore, history)),
    setConstantTimerValue_basedOnStats: (data) =>
      dispatch({ type: "SET_CONST_TIMER_BASED_ON_STATS", payload: data }),
    statsBtnEnabled: () => dispatch({ type: "STATS_BTN_TRUE" }),
    statsBtnDisabled: () => dispatch({ type: "STATS_BTN_FALSE" }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
  // Your component will receive dispatch by default, i.e., when you do not supply a second parameter to connect():
)(Stats);
