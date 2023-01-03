import React from "react";
//import { useState, useEffect, useRef } from "react";
import SingleLetter from "./SingleLetter.js";
import { connect } from "react-redux";

function WikiDisplay({
  areStatsVisible,
  indexOfPartialTextArr,
  toggleStats,
  arrToRender,
  arrOfPartialText,
  ellipsis,
}) {
  return (
    <div className="wiki-display-outer container">
      <div
        className="wiki-display"
        onClick={() => {
          if (areStatsVisible) {
            toggleStats();
          }
        }}
      >
        {arrToRender.map((el, i) => {
          return <SingleLetter letterToRender={el[0]} color={el[1]} key={i} />;
        })}
        {indexOfPartialTextArr !== arrOfPartialText.length - 1 ? ellipsis : ""}
      </div>
      <div className="wiki-display-page-counter">
        {indexOfPartialTextArr + 1}/{arrOfPartialText.length}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    indexOfPartialTextArr: state.displayState.wikiDisplay.indexOfPartialTextArr,
    areStatsVisible: state.visibilityState.areStatsVisible,
  };
};

export default connect(
  mapStateToProps
  // Your component will receive dispatch by default, i.e., when you do not supply a second parameter to connect():
)(WikiDisplay); // (3)
