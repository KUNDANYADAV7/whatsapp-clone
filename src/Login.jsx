import React from "react";
import "./Login.css";
import { Button } from "@mui/material";
import { auth, provider } from "./firebase";
import { signInWithPopup } from "firebase/auth";
import { useStateValue } from "./StateProvider";
import { type } from "@testing-library/user-event/dist/type";
import { actionTypes } from "./Reducer";

const Login = () => {
  const [{}, dispatch] = useStateValue();
  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("Successfully signed in with Google:", result.user);
        dispatch({ type: actionTypes.SET_USER, user: result.user });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <div className="login">
      <div className="login_container">
        <img
          src="https://1000logos.net/wp-content/uploads/2021/04/WhatsApp-logo-768x432.png"
          alt=""
        />
        <div className="login_text">
          <h1>Sign in to WhatsApp</h1>
        </div>
        <Button onClick={signInWithGoogle}>Sign in With Google</Button>
      </div>
    </div>
  );
};

export default Login;
