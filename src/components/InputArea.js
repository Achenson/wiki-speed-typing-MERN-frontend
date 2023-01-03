import React from "react";
import { connect } from "react-redux";
//import { useState, useEffect, useRef } from "react";

function InputArea({
  setTextAreaValue,
  textAreaValue,
  focusTextArea,
  isActive,
  toggleActive,
  areHintsVisible,
  toggleHints,
  isProfileVisible,
  toggleProfile,
}) {
  function preventArrowKeys(event) {
    let arrowKeysArr = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];

    if (arrowKeysArr.indexOf(event.key) !== -1) {
      event.preventDefault();
    }
  }

  // no text selecting
  function focusOnlyOnClick(event) {
    let myTarget = event.target;
    myTarget.setSelectionRange(myTarget.value.length, myTarget.value.length);
  }

  return (
    <textarea
      className="typing-display container"
      onChange={(e) => {
        setTextAreaValue(e.target.value);
      }}
      autoFocus
      // crucial for two-way binding! reset button
      value={textAreaValue}
      ref={focusTextArea}
      onPaste={(e) => {
        e.preventDefault();
      }}
      onKeyDown={(event) => {
        let arrowKeysArr = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
        preventArrowKeys(event);
        if (!isActive && arrowKeysArr.indexOf(event.key) === -1) {
          toggleActive();
        }
      }}
      onClick={focusOnlyOnClick}
      onFocus={() => {
        if (areHintsVisible) {
          toggleHints();
        }

        if (isProfileVisible) {
          toggleProfile();
        }
      }}
      onBlur={() => {
        if (areHintsVisible) {
          toggleHints();
        }
      }}
      placeholder="Type here"
    ></textarea>
  );
}

const mapStateToProps = (state) => {
  return {
    isActive: state.resultsAndTimerState.counter.isActive,
    areHintsVisible: state.visibilityState.areHintsVisible,
    textAreaValue: state.displayState.inputArea.textAreaValue,
    isProfileVisible: state.visibilityState.isProfileVisible,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleActive: () => dispatch({ type: "TOGGLE_ACTIVE" }),
    toggleProfile: () => dispatch({ type: "PROFILE_VISIBILITY" }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
  // Your component will receive dispatch by default, i.e., when you do not supply a second parameter to connect():
)(InputArea);
