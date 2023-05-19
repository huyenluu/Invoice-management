import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/user.context";
import SignUpForm from "./sign-up-form.component";
import {
  signInWithGooglePopup,
  createUserDocumentFromAuth,
  signInAuthUserWithEmailAndPassword,
} from "../utils/firebase/firebase.utils";

const DEFAULT_FORM_FIELDS = {
  email: "",
  password: "",
};

const SignInForm = () => {
  const [formFields, setFormFields] = useState(DEFAULT_FORM_FIELDS);
  const { email, password } = formFields;
  const [openSignUp, setOpenSignUp] = useState(false);

  const resetFormFields = () => {
    setFormFields(DEFAULT_FORM_FIELDS);
  };
  const toggleSignUpForm = () => {
    setOpenSignUp(!openSignUp);
  };

  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    const { user } = await signInWithGooglePopup();
    await createUserDocumentFromAuth(user);
    login(user);
    navigate("/home");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { user } = await signInAuthUserWithEmailAndPassword(
        email,
        password
      );
      resetFormFields();
      login(user);
      navigate("/home");
    } catch (error) {
      switch (error.code) {
        case "auth/wrong-password":
          alert("incorrect password for email");
          break;
        case "auth/user-not-found":
          alert("no user associated with this email");
          break;
        default:
          console.log(error);
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <>
      <div className={`sign-up-container form ${openSignUp ? "sr-only" : ""}`}>
        <h2>Authentication</h2>
        <div className="text-blue-dark">
          Sign in with your email and password
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="Email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="buttons-container">
            <button className="button-main button-2 mt-32" type="submit">
              Sign In
            </button>
            <button
              type="button"
              buttontype="google"
              onClick={signInWithGoogle}
              className="button-main button-2 mt-32"
            >
              Sign in with Google
            </button>
          </div>
        </form>
        <button
          className="button-main button-3 mt-32"
          onClick={toggleSignUpForm}
        >
          Don't have an account ? Sign up here.
        </button>
      </div>
      {openSignUp && <SignUpForm toggleSignUp={toggleSignUpForm} />}
    </>
  );
};

export default SignInForm;
