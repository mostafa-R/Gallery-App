import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import PhotoThumbnail from "./PhotoThumbnail";
import { Button } from "react-bootstrap";

function PostDetail() {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/post/${postId}`)
      .then((response) => {
        setPost(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching post:", error);
        setLoading(false);
      });
  }, []);

  const handleLikeClick = async () => {
    try {
      if (postId) {
        const response = await axios.put(`${API_BASE_URL}/post/${postId}/like`);
        setPost({ ...post, likesCount: response.data.likesCount });
      } else {
        console.error("postId is not defined or incorrect.");
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  return (
    <div>
      <h2>Post Detail</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h3>{post.title}</h3>
          <p>{post.description}</p>
          <p>Likes: {post.likesCount}</p>
          <Button variant="primary" onClick={handleLikeClick}>
            Like
          </Button>
        </div>
      )}
      <div>
        {post && (
          <PhotoThumbnail key={post._id} post={post} enableLikeButton={false} />
        )}
      </div>
    </div>
  );
}

export default PostDetail;
