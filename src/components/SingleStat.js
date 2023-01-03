import React from "react";
import { Fragment } from "react";
// import { connect } from "react-redux";

function SingleStat({ speed, accuracy }) {
  let isThisARecord;

  if (speed === 0 && accuracy === 0) {
    isThisARecord = false;
  } else {
    isThisARecord = true;
  }

  return (
    <Fragment>
      {isThisARecord ? (
        <li>
          <div className="tooltip" style={{ display: "inline-block" }}>
            <span>{speed} CPM</span>
            <span className="tooltip-text tooltip-text-stats">
              Speed - characters per minute with penalties
            </span>
          </div>
          <span> &nbsp;|&nbsp; </span>

          <div className="tooltip" style={{ display: "inline-block" }}>
            <span>{accuracy}%</span>
            <span className="tooltip-text tooltip-text-stats">
              Accuracy - incorrect entries/total entries
            </span>
          </div>
        </li>
      ) : (
        <li>-</li>
      )}
    </Fragment>
  );
}

export default SingleStat;
