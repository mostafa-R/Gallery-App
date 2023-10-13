import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import PhotoThumbnail from "./photoThumbnails";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function PostsList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = () => {
    axios
      .get(`${API_BASE_URL}/posts`)
      .then((response) => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Container>
      <Row>
        {loading ? (
          <Col className="text-center">
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </Col>
        ) : (
          posts.map((post) => (
            <Col key={post._id} xs={12} sm={6} md={4} lg={3}>
              <PhotoThumbnail post={post} />
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}

export default PostsList;
