import React from "react";
import { connect } from "react-redux";
//import { useState, useEffect, useRef } from "react";

function Results({ finalResults, areResultsVisible }) {
  // counter display proper format in results
  let resultsDisplay;
  let resultsMinutes;
  let resultsSeconds;

  let minutesInt_constTimer = Math.floor(finalResults["timer length"] / 60);
  let minutesStr_constTimer = minutesInt_constTimer.toString();
  let secondsInt_constTimer =
    finalResults["timer length"] - minutesInt_constTimer * 60;
  let secondsStr_constTimer = secondsInt_constTimer.toString();

  minutesInt_constTimer
    ? (resultsMinutes = `${minutesStr_constTimer}min`)
    : (resultsMinutes = "");
  secondsInt_constTimer
    ? (resultsSeconds = `${secondsStr_constTimer}s`)
    : (resultsSeconds = "");

  resultsDisplay = `${resultsMinutes} ${resultsSeconds}`;

  return (
    <div
      className="results"
      style={{
        visibility: `${areResultsVisible ? "visible" : "hidden"}`,
      }}
    >
      <div className="inner-results container">
        <p className="results-title">
          Results{" "}
          <span style={{ fontWeight: "normal" }}>
            (timer length: {resultsDisplay})
          </span>
        </p>

        <div className="results-main">
          <div className="tooltip">
            <p>Speed: {finalResults.speed} CPM</p>
            <span className="tooltip-text">
              Characters per minute - with penalties (minus 5 for 1 unfixed
              mistake/minute)
            </span>
          </div>

          <div className="tooltip">
            <p>Accuracy: {finalResults.accuracy}%</p>
            <span className="tooltip-text">
              Correct entries/total entries
            </span>
          </div>
        </div>

        <div className="results-other">
          <div className="tooltip">
            <p>Correct Entries: {finalResults.correct}</p>
            <span className="tooltip-text tooltip-text-other">
              Total correct entries (including backspace corrected)
            </span>
          </div>

          <div className="tooltip">
            <p>Incorrect Entries: {finalResults.incorrect}</p>
            <span className="tooltip-text tooltip-text-other">
              Total incorrect entries (including backspace corrected)
            </span>
          </div>
          <div className="tooltip">
            <p>Unfixed Mistakes: {finalResults.unfixed}</p>
            <span className="tooltip-text tooltip-text-other">Incorrect entries left unfixed</span>
          </div>
          <div className="tooltip">
            <p>Raw Speed: {finalResults.noPenalty} CPM</p>
            <span className="tooltip-text tooltip-text-other">
              Characters per minute - without penalties for mistakes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    finalResults: state.resultsAndTimerState.finalResults,
    areResultsVisible: state.visibilityState.areResultsVisible,
  };
};

export default connect(
  mapStateToProps
  // Your component will receive dispatch by default, i.e., when you do not supply a second parameter to connect():
)(Results); // (3)
