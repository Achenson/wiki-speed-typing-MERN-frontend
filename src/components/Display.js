import React from "react";
import { useEffect, useCallback, useRef } from "react";
import { connect } from "react-redux";

import AllRenders from "./AllRenders.js";
// const escapeStringRegexp = require("escape-string-regexp");

function Display({
  myText,
  displayToReset,
  setDisplayToReset_false,

  resultsCorrect,
  resultsIncorrect,
  resultsNoPenalty,

  setIndexOfPartialTextArr,
  setTextAreaValue,
  setPrevTextAreaValue,
  setColorForEachLetter,

  textAreaValue,
  prevTextAreaValue,
  indexOfPartialTextArr,
  colorForEachLetter,

  focusElement,
  // toggleResults,
  toggleStats,
  isCounterRunning,
  isActive,
  disablingButton,

  putFocusOnTextArea,
  setTimerOnSelect,
  toggleHints,
  focusTextArea,
  // graphql mutation
  addScore,
  mainHistory,

  resultsIncorrect_correctable_inc,
  resultsIncorrect_correctable_dec,

}) {
  // rendering text ============================
  const lengthOfSinglePart = 363;

  let myTextToArr = myText.split("");
  let textDividedByLength_floor = Math.floor(
    myTextToArr.length / lengthOfSinglePart
  );
  // contains arrays make out of whole text
  let arrOfPartialText = makeArrOfPartialText(lengthOfSinglePart, myTextToArr);
  let textToRender = arrOfPartialText[indexOfPartialTextArr];
  let arrOutOfText = textToRender.split("");

  //make default(gray) color in wiki display area
  //useCallback is used so useEffect below won't run on every every time toggleResults function is called
  const makeDefaultColoredLetters = useCallback(() => {
    let arrToReturn = [];
    for (let i = 0; i < lengthOfSinglePart; i++) {
      arrToReturn.push("DimGray");
    }
    return arrToReturn;
  }, [lengthOfSinglePart]);

  //coloring letters in display according to errors or no
  //  + counting entries!!
  useEffect(() => {
    // for correct, incorrect, allEntries
    if (textAreaValue.length > prevTextAreaValue.length) {
      let colorForEachLetter_2 = [...colorForEachLetter];
      resultsNoPenalty();

      if (
        textAreaValue[textAreaValue.length - 1] ===
        arrOutOfText[textAreaValue.length - 1]
      ) {
        resultsCorrect();
        colorForEachLetter_2[textAreaValue.length - 1] = "blue";
      }

      if (
        textAreaValue[textAreaValue.length - 1] !==
        arrOutOfText[textAreaValue.length - 1]
      ) {
        resultsIncorrect();
        resultsIncorrect_correctable_inc();
        colorForEachLetter_2[textAreaValue.length - 1] = "red";
      }

      setColorForEachLetter([...colorForEachLetter_2]);

      // if the last letter in a display is reached -> clear inputArea, load new screen
      if (textAreaValue.length === textToRender.length) {
        // e.target.value = "";
        setTextAreaValue("");

        if (indexOfPartialTextArr < textDividedByLength_floor) {
          setColorForEachLetter(makeDefaultColoredLetters());
          setIndexOfPartialTextArr(
            // indexOfPartialTextArr => indexOfPartialTextArr + 1
            indexOfPartialTextArr + 1
          );
        } else {
          setColorForEachLetter(makeDefaultColoredLetters());
          setIndexOfPartialTextArr(0);
        }
      }
    }

    if (textAreaValue.length < prevTextAreaValue.length) {

      // if mistake was corrected, decrement number of mistakes for speed (but not for accuracy)
      if(prevTextAreaValue[prevTextAreaValue.length-1] !== arrOutOfText[prevTextAreaValue.length - 1] ) {
        resultsIncorrect_correctable_dec()
      }


      let colorForEachLetter_3 = [...colorForEachLetter];
      colorForEachLetter_3[textAreaValue.length] = "DimGray";
      setColorForEachLetter([...colorForEachLetter_3]);
    }

    setPrevTextAreaValue(textAreaValue);
  }, [
    resultsCorrect,
    resultsIncorrect,
    resultsNoPenalty,
    setColorForEachLetter,
    setIndexOfPartialTextArr,
    setPrevTextAreaValue,
    setTextAreaValue,

    textAreaValue,
    colorForEachLetter,
    arrOutOfText,
    indexOfPartialTextArr,
    makeDefaultColoredLetters,
    prevTextAreaValue.length,
    textDividedByLength_floor,
    textToRender.length,

    prevTextAreaValue,
    resultsIncorrect_correctable_dec,
    resultsIncorrect_correctable_inc
  ]);

  // reseting display
  useEffect(() => {
    if (displayToReset) {
      resetDisplay();
      setDisplayToReset_false();
    }

    function resetDisplay() {
      setTextAreaValue("");
      setIndexOfPartialTextArr(0);
      setColorForEachLetter(makeDefaultColoredLetters());
    }
  }, [
    displayToReset,
    makeDefaultColoredLetters,
    setDisplayToReset_false,
    //
    setColorForEachLetter,
    setIndexOfPartialTextArr,
    setTextAreaValue,
  ]);

  const isDisabled = useRef(null);

  useEffect(() => {
    if (isActive || isCounterRunning) {
      isDisabled.current.setAttribute("disabled", true);
    } else {
      isDisabled.current.removeAttribute("disabled");
    }
  }, [isActive, isCounterRunning]);

  // arrToRender = [ [letter, color for the letter], ... ]
  const arrToRender = makeArrayToRender();

  function makeArrOfPartialText(lengthOfSinglePart, myTextToArr) {
    let arrOfPartialText = [];

    for (let i = 0; i <= textDividedByLength_floor; i++) {
      let newArr = [];
      for (
        let j = i * lengthOfSinglePart;
        j < lengthOfSinglePart + i * lengthOfSinglePart;
        j++
      ) {
        newArr.push(myTextToArr[j]);
      }

      let joinedNewArr = newArr.join("");

      arrOfPartialText.push(joinedNewArr);
    }
    return arrOfPartialText;
  }

  function makeArrayToRender() {
    let arrToSet = [];
    for (let i = 0; i < arrOutOfText.length; i++) {
      let newArr = [];
      newArr.push(arrOutOfText[i]);
      newArr.push(colorForEachLetter[i]);
      arrToSet.push(newArr);
    }

    return arrToSet;
  }

  return (
    <AllRenders
      mainHistory={mainHistory}
      arrToRender={arrToRender}
      arrOfPartialText={arrOfPartialText}
      addScore={addScore}
      setTextAreaValue={setTextAreaValue}
      focusElement={focusElement}
      toggleStats={toggleStats}
      disablingButton={disablingButton}
      putFocusOnTextArea={putFocusOnTextArea}
      toggleHints={toggleHints}
      focusTextArea={focusTextArea}
      setTimerOnSelect={setTimerOnSelect}
      isDisabled={isDisabled}
    />
  );
}

const mapStateToProps = (state) => {
  return {
    timerValue: state.resultsAndTimerState.counter.timerValue,
    textAreaValue: state.displayState.inputArea.textAreaValue,
    prevTextAreaValue: state.displayState.inputArea.prevTextAreaValue,
    indexOfPartialTextArr: state.displayState.wikiDisplay.indexOfPartialTextArr,
    colorForEachLetter: state.displayState.wikiDisplay.colorForEachLetter,

    liveResults: state.resultsAndTimerState.liveResults,
    finalResults: state.resultsAndTimerState.finalResults,

    isAuthenticated: state.authState.isAuthenticated,
    //
    constantTimerValue: state.resultsAndTimerState.counter.constantTimerValue,
    isActive: state.resultsAndTimerState.counter.isActive,
    toReset: state.resultsAndTimerState.counter.toReset,
    displayToReset: state.displayState.textDisplay.displayToReset,

    // hints & results
    areHintsVisible: state.visibilityState.areHintsVisible,
    areResultsVisible: state.visibilityState.areResultsVisible,
    areStatsVisible: state.visibilityState.areStatsVisible,

    myText: state.displayState.textDisplay.myText,
    wikiTitle: state.displayState.textDisplay.wikiTitle,
    isCounterRunning: state.resultsAndTimerState.counter.isCounterRunning,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setDisplayToReset_false: () => dispatch({ type: "DISPLAY_TO_RESET_FALSE" }),
    toggleAreResultsVisible: () => dispatch({ type: "RESULTS_VISIBILITY" }),
    // dispatching plain actions
    resultsCorrect: () => dispatch({ type: "RESULTS_CORRECT" }),
    resultsIncorrect: () => dispatch({ type: "RESULTS_INCORRECT" }),
    resultsNoPenalty: () => dispatch({ type: "RESULTS_NO_PENALTY" }),
    // for display only
    setIndexOfPartialTextArr: (data) =>
      dispatch({ type: "INDEX_OF_PARTIAL_TEXTARR", payload: data }),
    setTextAreaValue: (data) =>
      dispatch({ type: "TEXT_AREA_VALUE", payload: data }),
    setPrevTextAreaValue: (data) =>
      dispatch({ type: "PREV_TEXT_AREA_VALUE", payload: data }),
    setColorForEachLetter: (data) =>
      dispatch({ type: "COLOR_FOR_EACH_LETTER", payload: data }),
    // fetch & wikiController
    setNewRandomArticle_false: () => dispatch({ type: "RANDOM_ARTICLE_FALSE" }),

    resultsIncorrect_correctable_inc: () => dispatch({type: "RESULTS_INCORRECT_CORRECTABLE_INC"}),
    resultsIncorrect_correctable_dec: () => dispatch({type: "RESULTS_INCORRECT_CORRECTABLE_DEC"})
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
  // Your component will receive dispatch by default, i.e., when you do not supply a second parameter to connect():
)(Display);
