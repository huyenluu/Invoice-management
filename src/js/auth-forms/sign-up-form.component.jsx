import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/user.context";
import {
  createAuthUserWithEmailAndPassword,
  createUserDocumentFromAuth,
} from "../utils/firebase/firebase.utils";

const DEFAULT_FORM_FIELDS = {
  displayName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const SignUpForm = ({ toggleSignUp }) => {
  const [formFields, setFormFields] = useState(DEFAULT_FORM_FIELDS);
  const { displayName, email, password, confirmPassword } = formFields;

  const resetFormFields = () => {
    setFormFields(DEFAULT_FORM_FIELDS);
  };

  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("passwords do not match");
      return;
    }

    try {
      const { user } = await createAuthUserWithEmailAndPassword(
        email,
        password
      );
      await createUserDocumentFromAuth(user, { displayName });
      resetFormFields();
      login(user);
      navigate("/home");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("Cannot create user, email already in use");
      } else {
        console.log("user creation encountered an error", error);
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <div className="sign-up-container form">
      <h2>Don't have an account?</h2>
      <div className="text-blue-dark">Sign up with your email and password</div>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="display-name">Display Name</label>
            <input
              type="text"
              required
              onChange={handleChange}
              name="displayName"
              value={displayName}
            />
          </div>
        </div>
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
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="confirm-password">Confirm password</label>
            <input
              type="password"
              id="confirm-password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="buttons-container  mt-32">
          <button className="button-main button-2" type="submit">
            Sign Up
          </button>
          <button
            type="button"
            className="button-main button-3"
            onClick={toggleSignUp}
          >
            Back to Sign In
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
