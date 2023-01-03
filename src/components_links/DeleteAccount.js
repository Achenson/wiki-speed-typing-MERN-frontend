import React from "react";
import { useState, useEffect, useRef } from "react";

// import { BrowserRouter, Route, Link, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

import AuthNotification from "./AuthNotification";

import { deleteUser } from "../graphql/queries.js";

import { useMutation } from "@apollo/react-hooks";

function DeleteAccount({
  areStatsVisible,
  toggleAreStatsVisible,
  authenticatedUserId,
  logOut,
  setLoginErrorMessage,
}) {
  let history = useHistory();

  const [delaccountCSSClass, setDelaccountCSSClass] = useState(
    "btn btn-control btn-auth btn-reset"
  );

  let [errorNotification, setErrorNotification] = useState(null);
  let [infoNotification, setInfoNotification] = useState(null);

  let [password, setPassword] = useState("");

  const [isDelaccountClickable, setIsDelaccountClickable] = useState(true);

  const disableDelaccountBtn = useRef(null);

  const [delUser] = useMutation(deleteUser);

  if (disableDelaccountBtn.current) {
    disableDelaccountBtn.current.removeAttribute("disabled");
  }

  useEffect(() => {
    if (isDelaccountClickable) {
      setDelaccountCSSClass("btn btn-control btn-auth btn-reset");
      disableDelaccountBtn.current.setAttribute("disabled", true);
    } else {
      setDelaccountCSSClass("btn btn-control-disabled btn-auth");
      if (disableDelaccountBtn.current) {
        disableDelaccountBtn.current.removeAttribute("disabled");
      }
    }
  }, [isDelaccountClickable]);

  useEffect(() => {
    if (areStatsVisible) {
      toggleAreStatsVisible();
    }
  }, [areStatsVisible, toggleAreStatsVisible]);

  useEffect(() => {
    // after the component is unmounted!
    return () => {
      setErrorNotification(null);
      setInfoNotification(null);
    };
  }, [setErrorNotification]);

  function formValidation() {
    // password confirmation backend
    if (password === "") {
      setInfoNotification(null);
      setErrorNotification("Enter your password to delete account");
      return;
    }

    delUser({
      variables: {
        id: authenticatedUserId,
        password: password,
      },
    }).then(
      (res) => {
        if (!res.data.deleteUser) {
          // console.log("failed to delete user");
          setErrorNotification("Failed to delete user - recheck password");
          return;
        }

        // email will never have @ so it can by used to check auth
        if (res.data.deleteUser.email === "not auth") {
          // setErrorNotification("Your session has expired");
          logOut();
          setLoginErrorMessage("Your session has expired");
          history.replace("/login");
          return;
        }

        // console.log(res.data.deleteUser);

        setErrorNotification(null);
        setInfoNotification("Account deleted. Redirecting...");

        setIsDelaccountClickable(false);

        setTimeout(() => {
          logOut();

          history.replace("/");
        }, 2500);
      },
      (err) => {
        console.log(err);
        setErrorNotification("Server connection Error");
        return;
      }
    );
  }

  return (
    <div>
      {errorNotification ? (
        <AuthNotification
          notification={errorNotification}
          colorClass={"auth-notification-danger"}
        />
      ) : null}

      {infoNotification ? (
        <AuthNotification
          notification={infoNotification}
          colorClass={"auth-notification-info"}
        />
      ) : null}

      <div className="outer-container">
        <div className="main-square-auth">
          <div className="form-div">
            <div className="title-auth-div">
              <h3 className="title title-auth">Account deletion</h3>
            </div>
            <br />
            <form className="form">
              {/* associating label with input without ID -> nesting */}

              <label className="label">
                <p>1. Enter password</p>
                <p className="delaccount-p">2. Click "Delete account"</p>

                <input
                  style={{ marginBottom: "1em" }}
                  className="input"
                  type="password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  value={password}
                />
              </label>

              <br />
              <br />
              <br />

              <button
                ref={disableDelaccountBtn}
                className={delaccountCSSClass}
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  formValidation();
                }}
              >
                Delete account
              </button>
            </form>
            <div className="auth-links-div">
              {isDelaccountClickable && (
                <p className="auth-link-item">
                  <Link to="/" className="auth-link">
                    Back
                  </Link>
                  &nbsp;to speed typing
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    areStatsVisible: state.visibilityState.areStatsVisible,
    authenticatedUserId: state.authState.authenticatedUserId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleAreStatsVisible: () => dispatch({ type: "STATS_VISIBILITY" }),
    logOut: () => dispatch({ type: "LOG_OUT" }),
    setLoginErrorMessage: (data) =>
      dispatch({ type: "SET_LOGIN_ERROR_MESSAGE", payload: data }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
  // Your component will receive dispatch by default, i.e., when you do not supply a second parameter to connect():
)(DeleteAccount);
