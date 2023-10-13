import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "./index.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter an email");
      return;
    }

    if (!password) {
      setError("Please enter a password");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/account/login`, {
        email,
        password,
      });

      const data = response.data;

      if (data.status === "ok") {
        console.log("Login successful");

        Cookies.set("jwtToken", data.data.jwtToken, { expires: 7 });

        localStorage.setItem("loggedIn", "true");

        navigate("/");
        window.location.reload();
      } else {
        console.log("Login failed");
        setError("Incorrect email or password. Please try again.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      if (error.response && error.response.status === 401) {
        setError("Incorrect email or password. Please try again.");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div >
      
    <div className="auth-wrapper">
          <div className="auth-inner">
        
          <form onSubmit={handleSubmit}>
            <h3>Login</h3>

            {error && <p className="text-danger">{error}</p>}

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

            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
            <p className="forgot-password text-right">
              Don't have an account? <a href="/register">Register</a>
            </p>
          </form>
          </div>
          </div>
          </div>
  
  );
};

export default Login;
