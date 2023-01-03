import React from "react";
import { connect } from "react-redux";
import { useState, useEffect } from "react";

function UpperUI({
  timerValue,
  liveResults,
  toggleHints,
  areHintsVisible,
  toggleStats,
  areStatsVisible,
  isAuthenticated,
}) {
  // counter display ================================

  let minutesInt = Math.floor(timerValue / 60);
  let secondsInt = timerValue - minutesInt * 60;

  let minutesStr = minutesInt.toString();
  let secondsStr = secondsInt.toString();

  let minutesFormatted;
  let secondsFormatted;

  if (minutesInt >= 10) {
    minutesFormatted = minutesStr;
  } else {
    minutesFormatted = `0${minutesStr}`;
  }

  if (secondsInt >= 10) {
    secondsFormatted = secondsStr;
  } else {
    secondsFormatted = `0${secondsStr}`;
  }

  let counterDisplay = `${minutesFormatted}:${secondsFormatted}`;

  const [flashingOrNot, setFlashingOrNot] = useState(false);

  useEffect(() => {
    let timerInterval = null;

    if (!isAuthenticated) {
      timerInterval = setInterval(() => setFlashingOrNot((b) => !b), 500);
      setTimeout(() => {
        clearInterval(timerInterval);
        setFlashingOrNot(false);
      }, 3000);
    }

    return () => clearInterval(timerInterval);
  }, [isAuthenticated]);

  return (
    <div className="upper-ui container">
      <div className="upper-ui-left">
        <div className="upper-ui-inner">
          <p className="upper-ui-item-label" style={{ visibility: "hidden" }}>
            Time
          </p>

          <p className="upper-ui-item counter">{counterDisplay}</p>
        </div>
      </div>
      <div className="upper-ui-right">
        <div className="upper-ui-inner">
          <p className="upper-ui-item-label">Speed (CPM)</p>
          <p className="upper-ui-item display-speed">{liveResults.speed}</p>
        </div>
        <div className="upper-ui-inner">
          <p className="upper-ui-item-label">Accuracy</p>
          <p className="upper-ui-item display-accuracy">
            {liveResults.accuracy} %
          </p>
        </div>
        <button
          className="btn btn-display-hints"
          onClick={() => {
            toggleHints();
            if (areStatsVisible) {
              toggleStats();
            }
          }}
          style={{
            // color: `${flashingOrNot ? "cyan" : "white"}`,
            color: `${flashingOrNot ? "Aqua" : "white"}`,
            backgroundColor: `${areHintsVisible ? "black" : "green"}`,
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = `${
              areHintsVisible ? "green" : "black"
            }`;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = `${
              areHintsVisible ? "black" : "green"
            }`;
          }}
        >
          ?
        </button>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    areHintsVisible: state.visibilityState.areHintsVisible,
    isActive: state.resultsAndTimerState.counter.isActive,
    timerValue: state.resultsAndTimerState.counter.timerValue,
    liveResults: state.resultsAndTimerState.liveResults,
    areStatsVisible: state.visibilityState.areStatsVisible,
    isAuthenticated: state.authState.isAuthenticated,
  };
};

export default connect(
  mapStateToProps,
  null
  // Your component will receive dispatch by default, i.e., when you do not supply a second parameter to connect():
)(UpperUI);
