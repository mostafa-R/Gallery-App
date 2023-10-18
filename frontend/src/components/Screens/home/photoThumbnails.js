import React, { useState } from "react";
import axios from "axios";
import { Card, Button } from "react-bootstrap";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function PhotoThumbnail({ post }) {
  const [likes, setLikes] = useState(post.likesCount);
  const [liked, setLiked] = useState(false);

  const accessToken = Cookies.get("jwtToken");

  const handleLikeClick = async () => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/post/${post.id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setLikes(response.data.likesCount);
      setLiked(!liked);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  return (
    <Card
      key={post._id}
      className="mb-3"
      style={{ width: "300px", height: "400px" }}
    >
      <Card.Img
        variant="top"
        src={`${API_BASE_URL}${post.picturePath}`}
        alt={post.title}
        onClick={() =>
          window.open(`${API_BASE_URL}${post.picturePath}`, "_blank")
        }
        style={{ cursor: "pointer", width: "100%", height: "60%" }}
      />
      <Card.Body>
        <Card.Title>{post.title}</Card.Title>
        <Card.Text>{post.description}</Card.Text>
        <Button
          variant={liked ? "success" : "primary"}
          onClick={handleLikeClick}
        >
          {liked ? "Liked" : "Like"} ({likes})
        </Button>
      </Card.Body>
    </Card>
  );
}

export default PhotoThumbnail;
