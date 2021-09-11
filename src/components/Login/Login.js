import React, { useContext, useEffect, useReducer, useState } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../store/auth-context";
import Input from "../UI/Input/Input";

const EmailReducer = (state, actions) => {
  if (actions.type === "USER_EMAIL") {
    return { value: actions.val, isValid: actions.val.includes("@") };
  }
  if (actions.type === "EMAIL_INPUT_BLUR")
    return { value: state.value, isValid: state.value.includes("@") };
};

const PasswordReducer = (state, actions) => {
  if (actions.type === "USER_PWD") {
    return { value: actions.val, isValid: actions.val.length > 6 };
  }
  if (actions.type === "PWD_INPUT_BLUR") {
    return { value: state.value, isValid: state.value.length > 6 };
  }
};

const Login = (props) => {
  const [formIsValid, setFormIsValid] = useState(false);
  const authCtx = useContext(AuthContext);

  //In this Use Effect, we uses timeOut to check the form validity once in a while. Without timeout, form validity
  //will be executed for all the keystrokes. With the below code, it will execute every 500ms if the user is not typing.
  //if the user continues to type, it will keep clearing the timeout so that the 500ms will be reseted for every stroke
  // and the form validity function will not execute until the user stops typing.

  //Above code is commented to manage the states using reducer.

  //useReducer helps to manage multiple states.

  const [emailState, dispatchEmail] = useReducer(EmailReducer, {
    value: "",
    isValid: null,
  });

  const [passwordState, dispatchPassword] = useReducer(PasswordReducer, {
    value: "",
    isValid: null,
  });
  const { isValid: emailValid } = emailState;
  const { isValid: passwordValid } = passwordState;

  useEffect(() => {
    const timerID = setTimeout(() => {
      setFormIsValid(emailValid && passwordValid);
    }, 500);

    return () => {
      clearTimeout(timerID);
    };
  }, [emailValid, passwordValid]);
  const emailChangeHandler = (event) => {
    dispatchEmail({ type: "USER_EMAIL", val: event.target.value });

    // setFormIsValid(emailState.isValid && passwordState.isValid);
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: "USER_PWD", val: event.target.value });
    // setFormIsValid(emailState.isValid && passwordState.isValid);
  };

  const validateEmailHandler = () => {
    dispatchEmail({
      type: "EMAIL_INPUT_BLUR",
    });
  };

  const validatePasswordHandler = () => {
    dispatchPassword({ type: "PWD_INPUT_BLUR" });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    authCtx.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          id="email"
          type="email"
          label="E-mail"
          value={emailState.value}
          isValid={emailState.isValid}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        ></Input>
        <Input
          id="password"
          type="password"
          label="Password"
          value={passwordState.value}
          isValid={passwordState.isValid}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        ></Input>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
