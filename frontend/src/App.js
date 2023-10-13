import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/Screens/Login/login";
import Register from "./components/Screens/Register/register";
import Home from "./components/Screens/home/home";
import Header from "./components/Screens/header";
import CreatePost from "./components/Screens/home/createPost";
import Profile from "./components/Screens/profile/profile";

function App() {
  const isLoggedIn = window.localStorage.getItem("loggedIn");

  return (
    <Router>
      <div className="App">
        <Header />

        <div>
          <Routes>
            <Route path="/createpost" element={<CreatePost />} />
            <Route exact path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            {!isLoggedIn ? (
              <>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </>
            ) : (
              <>
                <Route exact path="/" element={<Home />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
