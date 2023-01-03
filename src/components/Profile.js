import React, { useEffect } from "react";

import { useState } from "react";

import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import { getUserByIdQuery } from "../graphql/queries.js";
import { useQuery } from "@apollo/react-hooks";

function Profile({
  toggleStats,
  isProfileVisible,
  authenticatedUserId,
  isAuthenticated,
}) {
  let history = useHistory();

  const [boxShadow, setBoxShadow] = useState("0px 1px 2px black");

  const [displayingName, setDisplayingName] = useState("Unknown");

  const { data } = useQuery(getUserByIdQuery, {
    variables: { id: authenticatedUserId },
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    if (data && isAuthenticated) {
      if (data.userById) {
        setDisplayingName(data.userById.name);
      }
    }
  }, [data, isAuthenticated]);

  return (
    <div
      className="profile"
      style={{
        visibility: `${isProfileVisible ? "visible" : "hidden"}`,
      }}
    >
      <div className="inner-profile">
        <p style={{ textAlign: "center", fontSize: "0.8em" }}>Logged in as</p>
        <p className="profile-title">{displayingName}</p>
        <ul className="list-profile">
          <li
            className="profile-score"
            onClick={() => {
              toggleStats();
            }}
          >
            Top score &nbsp;
          </li>
          <li
            className="profile-password"
            onClick={() => {
              history.push("/passchange");
            }}
          >
            Change Password
          </li>
          <li
            style={{ boxShadow: `${boxShadow}` }}
            className="profile-delete"
            onClick={() => {
              history.push("/delete-account");
            }}
            onMouseOver={() => {
              setBoxShadow("none");
            }}
            onMouseOut={() => {
              setBoxShadow("0px 1px 2px black");
            }}
          >
            Delete Account
          </li>
        </ul>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.authState.isAuthenticated,
    isProfileVisible: state.visibilityState.isProfileVisible,
    authenticatedUserId: state.authState.authenticatedUserId,
  };
};

export default connect(
  mapStateToProps,
  null
  // Your component will receive dispatch by default, i.e., when you do not supply a second parameter to connect():
)(Profile);
