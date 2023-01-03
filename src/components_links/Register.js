import React from "react";
import { useState, useEffect } from "react";

// import { BrowserRouter, Route, Link, Switch, Redirect } from "react-router-dom";
import { Link } from "react-router-dom";

// import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

import AuthNotification from "./AuthNotification";

import { useMutation } from "@apollo/react-hooks";

import { addNewUserMutation } from "../graphql/queries.js";

function Register() {
  const [addUser] = useMutation(addNewUserMutation);

  let [errorNotification, setErrorNotification] = useState(null);
  // resetting register error when unmounting

  useEffect(() => {
    return () => {
      setErrorNotification(null);
    };
  }, [setErrorNotification]);

  let history = useHistory();

  let [username, setUsername] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [confirmation, setConfirmation] = useState("");

  function registerValidation() {
    if (username === "") {
      setErrorNotification("Invalid username");
      return;
    }

    if (username.indexOf("@") > -1) {
      setErrorNotification("Invalid username - @ symbol is not allowed");
      return;
    }

    if (email === "" || email.indexOf("@") === -1) {
      setErrorNotification("Invalid email");
      return;
    }

    if (password === "") {
      setErrorNotification("Invalid password");
      return;
    }

    if (password.length < 8) {
      setErrorNotification("Password must contain at least 8 characters");
      return;
    }

    if (password !== confirmation) {
      setErrorNotification("Password confirmation does not match");
      return;
    }

    addUser({
      variables: {
        username: username,
        email: email,
        password: password,
      },
      // refetchQueries: [{ query: getStatsQuery }],
      // useMutation mutate function does not call `onCompleted`!
      // so onCompleted can only be passed to initial hook
      // workaround: useMutation returns a Promise
    }).then(
      (res) => {
        // console.log(res);

        if (res.data.addUser) {
          setErrorNotification(null);
          history.push("/login");
          return;
        } else {
          setErrorNotification("Username or email is already in use");
          return;
        }
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
      <div className="outer-container">
        <div className="main-square-auth">
          <div className="form-div">
            <div className="title-auth-div">
              <h3 className="title title-auth">Register</h3>
            </div>
            <form className="form">
              {/* associating label with input without ID -> nesting */}
              <label className="label">
                Username
                <input
                  className="input"
                  type="text"
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  value={username}
                />
              </label>

              <label className="label">
                Email address
                <input
                  className="input"
                  type="email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  value={email}
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
              <label className="label">
                Confirm password
                <input
                  className="input"
                  type="password"
                  onChange={(e) => {
                    setConfirmation(e.target.value);
                  }}
                  value={confirmation}
                />
              </label>
              <br />

              <button
                className="btn btn-control btn-auth"
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  registerValidation();
                }}
              >
                Register
              </button>
            </form>
            <div className="auth-links-div">
              <p className="auth-link-item">
                Already registered?&nbsp;Login{" "}
                <Link to="/login" className="auth-link">
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

export default Register;
