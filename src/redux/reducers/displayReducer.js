const lengthOfSinglePart = 363;
//make default(gray) color in wiki display area
function makeDefaultColoredLetters() {
  let arrToReturn = [];
  for (let i = 0; i < lengthOfSinglePart; i++) {
    arrToReturn.push("DimGray");
  }
  return arrToReturn;
}

const initialState = {
  textDisplay: {
    displayToReset: false,
    myText: "[Data loading...]",
    wikiTitle: "",
    // newRandomArticle will be fetched if true
    newRandomArticle: true,
  },

  // originally from <Display/> component ======
  wikiDisplay: {
    indexOfPartialTextArr: 0,
    colorForEachLetter: makeDefaultColoredLetters(),
  },
  inputArea: {
    textAreaValue: "",
    prevTextAreaValue: "",
    disableFocusTextArea: true,
  },
};

function displayReducer(state = initialState, action) {
  switch (action.type) {
    case "DISPLAY_TO_RESET_TRUE":
      return {
        ...state,
        textDisplay: {
          ...state.textDisplay,
          displayToReset: true,
        },
      };

    case "DISPLAY_TO_RESET_FALSE":
      return {
        ...state,
        textDisplay: {
          ...state.textDisplay,
          displayToReset: false,
        },
      };

    // fetch only
    case "MY_TEXT":
      return {
        ...state,
        textDisplay: {
          ...state.textDisplay,
          myText: action.payload,
        },
      };

    case "WIKI_TITLE":
      return {
        ...state,
        textDisplay: {
          ...state.textDisplay,
          wikiTitle: action.payload,
        },
      };

    case "RANDOM_ARTICLE_TRUE":
      return {
        ...state,
        textDisplay: {
          ...state.textDisplay,
          newRandomArticle: true,
        },
      };

    case "RANDOM_ARTICLE_FALSE":
      return {
        ...state,
        textDisplay: {
          ...state.textDisplay,
          newRandomArticle: false,
        },
      };

    // display only
    case "INDEX_OF_PARTIAL_TEXTARR":
      return {
        ...state,
        wikiDisplay: {
          ...state.wikiDisplay,
          indexOfPartialTextArr: action.payload,
        },
      };

    case "COLOR_FOR_EACH_LETTER":
      return {
        ...state,
        wikiDisplay: {
          ...state.wikiDisplay,
          colorForEachLetter: action.payload,
        },
      };

    case "TEXT_AREA_VALUE":
      return {
        ...state,
        inputArea: {
          // !!!! You may not call store.getState() while the reducer is executing.
          ...state.inputArea,
          textAreaValue: action.payload,
        },
      };

    case "PREV_TEXT_AREA_VALUE":
      return {
        ...state,
        inputArea: {
          ...state.inputArea,
          prevTextAreaValue: action.payload,
        },
      };

    case "ENABLE_FOCUS_TEXT_AREA":
      return {
        ...state,
        inputArea: {
          ...state.inputArea,
          disableFocusTextArea: false,
        },
      };

    case "DISABLE_FOCUS_TEXT_AREA":
      return {
        ...state,
        inputArea: {
          ...state.inputArea,
          disableFocusTextArea: true,
        },
      };

    default:
      return state;
  }
}

export default displayReducer;
