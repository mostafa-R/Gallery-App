import React, { useState } from "react";
import PostsList from "./getPosts";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Home = (props) => {
  const jwtToken = Cookies.get("jwtToken");

  const navigate = useNavigate();

  const handleCreatePostClick = () => {
    if (!jwtToken) {
      navigate("/login");
      window.location.reload();
      return;
    }
    navigate("/createpost");
    window.location.reload();
  };

  return (
    <Container>
      <Row className="mt-4">
        <Col>
          <Button variant="primary" onClick={handleCreatePostClick}>
            Create Post
          </Button>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col></Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <PostsList />
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
