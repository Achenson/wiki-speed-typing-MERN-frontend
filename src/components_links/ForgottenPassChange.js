import React from "react";
import { useState, useEffect, useRef } from "react";

// import { BrowserRouter, Route, Link, Switch, Redirect } from "react-router-dom";
import { Link } from "react-router-dom";

import { connect } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import AuthNotification from "./AuthNotification";

import { changePasswordAfterForgot } from "../graphql/queries.js";

import { useMutation } from "@apollo/react-hooks";

function ForgottenPassChange({ logIn }) {
  // from ".../passforgot-change/:token"
  let { token } = useParams();

  const [passchangeCSSClass, setPasschangeCSSClass] = useState(
    "btn btn-control btn-auth"
  );

  const [isPasschangeClickable, setIsPasschangeClickable] = useState(true);

  const disablePasschangeBtn = useRef(null);

  if (disablePasschangeBtn.current) {
    disablePasschangeBtn.current.removeAttribute("disabled");
  }

  useEffect(() => {
    if (isPasschangeClickable) {
      setPasschangeCSSClass("btn btn-control btn-auth");
      disablePasschangeBtn.current.setAttribute("disabled", true);
    } else {
      setPasschangeCSSClass("btn btn-control-disabled btn-auth");
      if (disablePasschangeBtn.current) {
        disablePasschangeBtn.current.removeAttribute("disabled");
      }
    }
  }, [isPasschangeClickable]);

  let history = useHistory();

  const [changePassAfterForgot] = useMutation(changePasswordAfterForgot);

  let [errorNotification, setErrorNotification] = useState(null);
  let [infoNotification, setInfoNotification] = useState(null);

  useEffect(() => {
    // after the component is unmounted!
    return () => {
      setErrorNotification(null);
      setInfoNotification(null);
    };
  }, [setErrorNotification, setInfoNotification]);

  let [newPassword, setNewPassword] = useState("");
  let [newConfirmation, setNewConfirmation] = useState("");

  function formValidation() {
    // password confirmation backend

    if (newPassword === "") {
      setInfoNotification(null);
      setErrorNotification("Password cannot be blank");
      return;
    }

    if (newPassword.length < 8) {
      setInfoNotification(null);
      setErrorNotification("Password must contain at least 8 characters");
      return;
    }

    if (newPassword !== newConfirmation) {
      setInfoNotification(null);
      setErrorNotification("Password confirmation does not match");
      return;
    }

    changePassAfterForgot({
      variables: {
        token: token,
        password: newPassword,
      },
    }).then(
      (res) => {
        // console.log("changePassAfterForgot res");
        // console.log(res);

        if (!res.data.changePasswordAfterForgot) {
          setErrorNotification("failed to change password");
          return;
        }

        logIn({
          authenticatedUserId: res.data.changePasswordAfterForgot.userId,
          token: res.data.changePasswordAfterForgot.token,
        });

        setErrorNotification(null);
        setInfoNotification("Password successfully changed. Logging in...");

        setIsPasschangeClickable(false);

        setTimeout(() => {
          history.replace("/");
        }, 2500);
      },
      (err) => {
        console.log("err");
        console.log(err);

        if (err === "Error: GraphQL error: jwt expired") {
          setErrorNotification("Session expired - redirecting...");
          setTimeout(() => {
            history.replace("/passforgot");
          }, 2500);
          return;
        }

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
              <h3 className="title title-auth">Password change</h3>
            </div>
            <form className="form">
              {/* associating label with input without ID -> nesting */}
              <br />
              <label className="label">
                New password
                <input
                  className="input"
                  type="password"
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                  }}
                  value={newPassword}
                />
              </label>
              <label className="label">
                Confirm new password
                <input
                  className="input"
                  type="password"
                  onChange={(e) => {
                    setNewConfirmation(e.target.value);
                  }}
                  value={newConfirmation}
                />
              </label>
              <br />

              <button
                ref={disablePasschangeBtn}
                className={passchangeCSSClass}
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  formValidation();
                }}
              >
                Change password
              </button>
            </form>
            {isPasschangeClickable && (
              <div className="auth-links-div">
                <p className="auth-link-item">
                  <Link to="/" className="auth-link">
                    Back
                  </Link>
                  &nbsp;to speed typing
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    logIn: (dataObj) => dispatch({ type: "LOG_IN", payload: dataObj }),
  };
};

export default connect(
  null,
  mapDispatchToProps
  // Your component will receive dispatch by default, i.e., when you do not supply a second parameter to connect():
)(ForgottenPassChange);
