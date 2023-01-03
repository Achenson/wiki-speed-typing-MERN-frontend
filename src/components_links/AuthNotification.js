import React from "react";
// import { connect } from "react-redux";

function AuthNotification({
  notification = { notification },
  colorClass = { colorClass },
}) {
  return (
    <div className={`auth-notification-div ${colorClass}`}>
      <p>{notification}</p>
    </div>
  );
}

export default AuthNotification;
