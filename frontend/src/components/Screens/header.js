import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("jwtToken");
    const loginLocalStorage = localStorage.getItem("loggedIn");

    if (token || loginLocalStorage) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("jwtToken");
    setIsLoggedIn(false);
    localStorage.clear();
    navigate("/login");
    window.location.reload();
    
  };

  return (
    <Navbar bg="light" expand="lg" sticky="top">
      <Container>
        <Link to="/" className="navbar-brand">
          <strong>GALLERY</strong>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isLoggedIn ? (
              <NavDropdown title="User" id="basic-nav-dropdown">
                <Link to="/profile" className="dropdown-item">
                  Profile
                </Link>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Link to="/login" className="nav-link">
                Login
              </Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
