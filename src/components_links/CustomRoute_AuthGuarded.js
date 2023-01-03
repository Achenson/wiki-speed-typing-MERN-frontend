import React from "react";
import { Route, Redirect } from "react-router-dom";

const CustomRoute = (props) => {
  if (!props.isAuthenticated) {
    return <Redirect to="/" />;

    //  return <Route {...props} />
  } else {
    return <Route {...props} />;
  }
  // return <Redirect to='/countries' />
};

export default CustomRoute;
