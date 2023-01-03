import React from "react";
import { useState, useEffect } from "react";

import { connect } from "react-redux";

function WikiController({
  isWikiButtonClickable,
  isWikiLinkClickable,
  wikiTitle,
  isCounterRunning,
  disableFocusTextArea,
  setNewRandomArticle_true,
  disablingButton,
  setToReset_true,
}) {
  const [wikiButtonCSSClass, setWikiButtonClass] = useState(
    "btn btn-control btn-wiki"
  );

  useEffect(() => {
    if (isWikiButtonClickable) {
      setWikiButtonClass("btn btn-control btn-wiki");
    } else {
      setWikiButtonClass("btn btn-control-disabled btn-wiki");
    }
  }, [isWikiButtonClickable]);

  return (
    <div className="wiki-controler container">
      <div className="wiki-title-container">
        <p className="wiki-title-label">Current wikipedia article</p>
        <div className="wiki-title-display">
          {isWikiLinkClickable ? (
            <a
              className="wiki-title-display-link"
              href={`https://en.wikipedia.org/wiki/${wikiTitle}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {wikiTitle}
            </a>
          ) : (
            <p>{wikiTitle}</p>
          )}
        </div>
      </div>
      <button
        // className=`btn btn-control btn-wiki`
        className={wikiButtonCSSClass}
        onClick={() => {
          if (!isCounterRunning) {
            disableFocusTextArea();
            setNewRandomArticle_true();
            disablingButton.current.setAttribute("disabled", true);
          } else {
            disableFocusTextArea();
            setToReset_true();
            setNewRandomArticle_true();
            disablingButton.current.setAttribute("disabled", true);
          }
        }}
        ref={disablingButton}
      >
        Random Wiki Article
      </button>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    isWikiLinkClickable: state.visibilityState.isWikiLinkClickable,
    isWikiButtonClickable: state.visibilityState.isWikiButtonClickable,
    wikiTitle: state.displayState.textDisplay.wikiTitle,
    isCounterRunning: state.resultsAndTimerState.counter.isCounterRunning,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    disableFocusTextArea: () => dispatch({ type: "DISABLE_FOCUS_TEXT_AREA" }),
    setToReset_true: () => dispatch({ type: "TO_RESET_TRUE" }),
    setNewRandomArticle_true: () => dispatch({ type: "RANDOM_ARTICLE_TRUE" }),
  };
};

// export default WikiController;
export default connect(
  mapStateToProps,
  mapDispatchToProps
  // Your component will receive dispatch by default, i.e., when you do not supply a second parameter to connect():
)(WikiController); // (3)
