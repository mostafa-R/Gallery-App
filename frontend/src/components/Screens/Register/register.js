import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

 
  const handleNavigation = () => {
    navigate("/");
    window.location.reload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!name) {
      setError("Please enter your name");
      setShowToast(false);
      return;
    }

    if (!email) {
      setError("Please enter an email");
      setShowToast(false);
      return;
    }

    if (!password) {
      setError("Please enter a password");
      setShowToast(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setShowToast(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setShowToast(false);
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

        if (!showToast) {
          toast.success("تم انشاء الحساب بنجاح", {
            position: toast.POSITION.TOP_LEFT,
          });
          setShowToast(true);
        }

        setTimeout(handleNavigation, 2000);
      } else {
        console.log("Something went wrong");
        setError("Registration failed. Please check your credentials.");
        setShowToast(false);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      if (error.response && error.response.status === 400) {
        setError(error.response.data.message);
        setShowToast(false);
      } else {
        setError("Something went wrong. Please try again later.");
        setShowToast(false);
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
          {showToast && <ToastContainer />}
          <p className="forgot-password text-right">
            Already have an account? <a href="/login">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
