import React from "react";
import { useState, useEffect } from "react";
// import { BrowserRouter, Route, Link, Switch, Redirect } from "react-router-dom";
import { Link } from "react-router-dom";

import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import AuthNotification from "./AuthNotification";

import { useMutation } from "@apollo/react-hooks";

import { loginMutation } from "../graphql/queries.js";

function Login({
  logIn,
  loginNotification,
  setLoginNotification,
  loginErrorMessage,
  setLoginErrorMessage,
}) {
  const [loginMut] = useMutation(loginMutation);

  // not {history}!!! because we are not destructuring here,
  // history is an object!
  let history = useHistory();

  // reseting loginError && loginNotification whne unmounting
  useEffect(() => {
    return () => {
      setLoginErrorMessage(null);
      setLoginNotification(null);
    };
  }, [setLoginErrorMessage, setLoginNotification]);

  let [email_or_name, setEmail_or_name] = useState("");
  let [password, setPassword] = useState("");

  function loginValidation() {
    if (email_or_name === "" || password === "") {
      setLoginErrorMessage("Email or password not provided");
      return;
    }

    loginMut({
      variables: {
        email_or_name: email_or_name,
        password: password,
      },
    }).then(
      (res) => {
        if (res.data.login.token === "User does not exist!") {
          setLoginErrorMessage(`${res.data.login.token}`);
          return;
        }

        if (res.data.login.token === "Password is incorrect!") {
          setLoginErrorMessage(`${res.data.login.token}`);
          return;
        }

        // console.log("loginMut res");
        // console.log(res);

        setLoginErrorMessage(null);
        logIn({
          authenticatedUserId: res.data.login.userId,
          token: res.data.login.token,
        });
        setLoginNotification(null);

        // history.push('/')
        // no going back! not possible to go back to login when logged in
        history.replace("/");
      },
      (err) => {
        console.log(err);
        setLoginErrorMessage("Server connection Error");
        return;
      }
    );
  }

  return (
    <div>
      {loginNotification ? (
        <AuthNotification
          notification={loginNotification}
          colorClass={"auth-notification-info"}
        />
      ) : null}
      {loginErrorMessage ? (
        <AuthNotification
          notification={loginErrorMessage}
          colorClass={"auth-notification-danger"}
        />
      ) : null}

      <div className="outer-container">
        <div className="main-square-auth">
          <div className="form-div">
            <div className="title-auth-div">
              <h3 className="title title-auth">Login</h3>
            </div>
            <form className="form">
              {/* associating label with input without ID -> nesting */}
              <label className="label">
                Email address / username
                <input
                  className="input"
                  // type="email"
                  onChange={(e) => {
                    setEmail_or_name(e.target.value);
                  }}
                  value={email_or_name}
                />
              </label>
              <br />
              <br />

              <label className="label">
                Password
                <input
                  className="input"
                  type="password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  value={password}
                />
              </label>
              <br />

              <button
                className="btn btn-control btn-auth"
                onClick={(e) => {
                  e.preventDefault();
                  loginValidation();
                }}
              >
                Login
              </button>
            </form>
            <div className="auth-links-div">
              <p className="auth-link-item" style={{ marginBottom: "0.25rem" }}>
                No account?&nbsp;Register{" "}
                <Link to="/register" className="auth-link">
                  here
                </Link>
              </p>

              <p className="auth-link-item" style={{ marginBottom: "0.75rem" }}>
                Forgot password? Click&nbsp;
                <Link to="/passforgot" className="auth-link">
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

const mapStateToProps = (state) => {
  return {
    loginNotification: state.authState.loginNotification,
    loginErrorMessage: state.authState.loginErrorMessage,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logIn: (dataObj) => dispatch({ type: "LOG_IN", payload: dataObj }),
    setLoginNotification: (data) =>
      dispatch({ type: "SET_LOGIN_NOTIFICATION", payload: data }),
    setLoginErrorMessage: (data) =>
      dispatch({ type: "SET_LOGIN_ERROR_MESSAGE", payload: data }),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
  // Your component will receive dispatch by default, i.e., when you do not supply a second parameter to connect():
)(Login);
