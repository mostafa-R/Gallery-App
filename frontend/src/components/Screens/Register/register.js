import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "./index.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Add confirmPassword state
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!name) {
      setError("Please enter your name");
      return;
    }

    if (!email) {
      setError("Please enter an email");
      return;
    }

    if (!password) {
      setError("Please enter a password");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      // Check if passwords match
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/account/register`, {
        name,
        email,
        password,
        confirmPassword,
      });

      const data = response.data;

      if (data.status === "ok") {
        console.log("Registration successful");

        Cookies.set("jwtToken", data.data.jwtToken, { expires: 7 });
        localStorage.setItem("loggedIn", "true");

        navigate("/");
        window.location.reload();
      } else {
        console.log("Something went wrong");
        setError("Registration failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      if (error.response && error.response.status === 400) {
        setError(error.response.data.message); // Handle duplicate email
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <form onSubmit={handleSubmit}>
          <h3>Register</h3>

          {error && <p className="text-danger">{error}</p>}

          <div className="mb-3">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label>Confirm Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Register
            </button>
          </div>
          <p className="forgot-password text-right">
            Already have an account? <a href="/login">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
