import React from "react";
import { Route, Redirect } from "react-router-dom";

const CustomRoute = (props) => {
  if (props.isAuthenticated) {
    return <Redirect to="/" />;
    //  return <Route {...props} />
  } else {
    return <Route {...props} />;
  }
  // return <Redirect to='/countries' />
};

export default CustomRoute;

// route guarding conditionally initially used in App.js, gives warnings

/* route guarding <> & </>!!!!*/
/* {isAuthenticated ? ( */
/* <Redirect to="/" /> */
/* ) : ( */
/* <> */
/* <Route path="/register" component={Register} /> */
/* <Route path="/login" component={Login} /> */
/*        render={(props) => (
              <Register
              path="/register"
            {...props}
              resetTimer={resetTimer}
              />
            )} */
/* </> */
/* )} */
