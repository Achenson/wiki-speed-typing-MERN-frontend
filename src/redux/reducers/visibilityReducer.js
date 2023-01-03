const initialState = {
  areHintsVisible: false,
  areResultsVisible: false,
  areStatsVisible: false,
  isConfirmDeleteVisible: false,
  isWikiLinkClickable: false,
  isWikiButtonClickable: true,
  isMainRendered: false,
  isProfileVisible: false,
  // for disabling stats button when db connection error
  isStatsButtonClickable: true,
};

function visibilityReducer(state = initialState, action) {
  let {
    areHintsVisible,
    areResultsVisible,
    areStatsVisible,
    isProfileVisible,
    // isConfirmDeleteVisible,
  } = state;

  switch (action.type) {
    case "HINTS_VISIBILITY":
      return {
        ...state,
        areHintsVisible: !areHintsVisible,
      };
    case "RESULTS_VISIBILITY":
      return {
        ...state,
        areResultsVisible: !areResultsVisible,
      };
    case "STATS_VISIBILITY":
      return {
        ...state,
        areStatsVisible: !areStatsVisible,
      };

    case "PROFILE_VISIBILITY":
      return {
        ...state,
        isProfileVisible: !isProfileVisible,
      };

    case "CONFIRM_DELETE_VISIBILITY_TRUE":
      return {
        ...state,
        isConfirmDeleteVisible: true,
      };

    case "CONFIRM_DELETE_VISIBILITY_FALSE":
      return {
        ...state,
        isConfirmDeleteVisible: false,
      };

    case "WIKILINK_CLICKABLE_TRUE":
      return {
        ...state,
        isWikiLinkClickable: true,
      };

    case "WIKILINK_CLICKABLE_FALSE":
      return {
        ...state,
        isWikiLinkClickable: false,
      };

    case "WIKI_BTN_CLICKABLE_TRUE":
      return {
        ...state,
        isWikiButtonClickable: true,
      };

    case "WIKI_BTN_CLICKABLE_FALSE":
      return {
        ...state,
        isWikiButtonClickable: false,
      };

    case "MAIN_RENDERED_TRUE":
      return {
        ...state,
        isMainRendered: true,
      };

    case "STATS_BTN_TRUE":
      return {
        ...state,
        isStatsButtonClickable: true,
      };
    case "STATS_BTN_FALSE":
      return {
        ...state,
        isStatsButtonClickable: false,
      };

    default:
      return state;
  }
}

export default visibilityReducer;
