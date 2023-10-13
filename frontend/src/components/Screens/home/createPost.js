import React, { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    picturePath: null,
  });
  const navigate = useNavigate();

  const jwtToken = Cookies.get("jwtToken");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      picturePath: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!jwtToken) {
      navigate("/login");
      window.location.reload();
      return;
    }

    const postFormData = new FormData();
    postFormData.append("title", formData.title);
    postFormData.append("description", formData.description);
    postFormData.append("name", formData.picturePath);

    try {
      const response = await fetch(`${API_BASE_URL}/post/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        body: postFormData,
      });
      console.log(formData.picturePath);
      if (response.status === 201) {
        console.log("Post created successfully.");

        navigate("/");
        window.location.reload();

        setFormData({
          title: "",
          description: "",
          picturePath: null,
        });
      } else if (response.status === 409) {
        console.error("Conflict: This post already exists.");
      } else {
        console.error("Error creating post:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create a New Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title:
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description:
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="picture" className="form-label">
            Upload Picture:
          </label>
          <input
            type="file"
            accept="image/*"
            name="picturePath"
            onChange={handleFileChange}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
