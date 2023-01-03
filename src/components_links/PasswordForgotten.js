import React from "react";
import { useState, useEffect, useRef } from "react";
// import { BrowserRouter, Route, Link, Switch, Redirect } from "react-router-dom";
import { Link } from "react-router-dom";

// import { connect } from "react-redux";

import AuthNotification from "./AuthNotification";

import { useMutation } from "@apollo/react-hooks";

import { forgotPassword } from "../graphql/queries.js";

function PasswordForgotten() {
  const [forgotPass] = useMutation(forgotPassword);

  const [passForgotCSSClass, setPassForgotCSSClass] = useState(
    "btn btn-control btn-auth"
  );

  const [isPassForgotClickable, setIsPassForgotClickable] = useState(true);

  const disablePassForgotBtn = useRef(null);

  if (disablePassForgotBtn.current) {
    disablePassForgotBtn.current.removeAttribute("disabled");
  }

  useEffect(() => {
    if (isPassForgotClickable) {
      setPassForgotCSSClass("btn btn-control btn-auth");
      disablePassForgotBtn.current.setAttribute("disabled", true);
    } else {
      setPassForgotCSSClass("btn btn-control-disabled btn-auth");
      if (disablePassForgotBtn.current) {
        disablePassForgotBtn.current.removeAttribute("disabled");
      }
    }
  }, [isPassForgotClickable]);

  let [errorNotification, setErrorNotification] = useState(null);
  let [infoNotification, setInfoNotification] = useState(null);

  useEffect(() => {
    // after the component is unmounted!
    return () => {
      setErrorNotification(null);
      setInfoNotification(null);
    };
  }, [setErrorNotification, setInfoNotification]);

  let [email, setEmail] = useState("");

  function emailValidation() {
    if (email === "" || email.indexOf("@") === -1) {
      setErrorNotification("Invalid email");
      setIsPassForgotClickable(true);
      return;
    }

    forgotPass({
      variables: {
        email: email,
      },
    }).then(
      (res) => {
        setIsPassForgotClickable(true);

        // console.log("forgotPassword res");
        // console.log(res);

        setErrorNotification(null);
        setInfoNotification("Email successfully sent");
      },
      (err) => {
        console.log(err);
        setErrorNotification("Server connection Error - email not sent");
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
              <h3 className="title title-auth">Password Retrieval</h3>
            </div>

            <p style={{ color: "steelblue" }}>
              A password change link will be sent to the provided email address.
            </p>

            <form className="form">
              {/* associating label with input without ID -> nesting */}
              <label className="label">
                Email address
                <input
                  className="input"
                  // type="email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  value={email}
                />
              </label>
              <br />

              <button
                ref={disablePassForgotBtn}
                className={passForgotCSSClass}
                onClick={(e) => {
                  e.preventDefault();
                  setInfoNotification(null);
                  setErrorNotification(null);
                  setIsPassForgotClickable(false);
                  emailValidation();
                }}
              >
                Send link
              </button>
            </form>
            <div className="auth-links-div">
              <p className="auth-link-item">
                No account?&nbsp;Register{" "}
                <Link to="/register" className="auth-link">
                  here
                </Link>
              </p>
              <p className="auth-link-item">
                <Link to="/" className="auth-link">
                  Back
                </Link>
                &nbsp;to speed typing
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PasswordForgotten;
