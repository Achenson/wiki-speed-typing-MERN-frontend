const initialState = {
  isAuthenticated: false,
  authenticatedUserId: null,
  accessToken: null,
  loginNotification: null,
  loginErrorMessage: null,
};

function authReducer(state = initialState, action) {
  switch (action.type) {
    case "LOG_IN":
      return {
        ...state,
        isAuthenticated: true,
        authenticatedUserId: action.payload.authenticatedUserId,
        accessToken: action.payload.token,
      };
    case "SET_ACCESS_TOKEN":
      return {
        ...state,
        accessToken: action.payload,
      };
    case "LOG_OUT":
      return {
        ...state,
        isAuthenticated: false,
        authenticatedUserId: null,
        accessToken: null,
      };
    case "SET_LOGIN_NOTIFICATION":
      return {
        ...state,
        loginNotification: action.payload,
      };
    case "SET_LOGIN_ERROR_MESSAGE":
      return {
        ...state,
        loginErrorMessage: action.payload,
      };
    case "SET_AUTHENTICATED_USER_ID":
      return {
        ...state,
        authenticatedUserId: action.payload,
      };

    default:
      return state;
  }
}

export default authReducer;
