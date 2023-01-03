import React from "react";
//import { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";

function Controls({
  isActive,
  setTimerOnSelect,
  setConstantTimerValue_basedOnStats,
  isDisabled,
  toggleActive,
  constantTimerValue,
  setToReset_true,
  putFocusOnTextArea,
}) {
  return (
    <div className="control-buttons-row container">
      <div className="column-left">
        <button
          className="btn btn-control control-item"
          onClick={() => toggleActive()}
        >
          {isActive ? "Pause" : "Run"}
        </button>
        <select
          className="control-item timer-select"
          onChange={(e) => {
            setTimerOnSelect(e.target.value);
            setConstantTimerValue_basedOnStats(parseInt(e.target.value));
          }}
          ref={isDisabled}
          // defaultValue="60"
          value={constantTimerValue.toString()}
        >
          <option value="5">00:05</option>
          <option value="60">01:00</option>
          <option value="120">02:00</option>
          <option value="300">05:00</option>

          <option value="600">10:00</option>
        </select>
      </div>

      <div className="column-right">
        <button
          className="btn btn-control control-item btn-reset"
          onClick={(event) => {
            setToReset_true();
            putFocusOnTextArea();
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    constantTimerValue: state.resultsAndTimerState.counter.constantTimerValue,
    isActive: state.resultsAndTimerState.counter.isActive,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setToReset_true: () => dispatch({ type: "TO_RESET_TRUE" }),
    setConstantTimerValue_basedOnStats: (data) =>
      dispatch({ type: "SET_CONST_TIMER_BASED_ON_STATS", payload: data }),
    toggleActive: () => dispatch({ type: "TOGGLE_ACTIVE" }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
  // Your component will receive dispatch by default, i.e., when you do not supply a second parameter to connect():
)(Controls);
