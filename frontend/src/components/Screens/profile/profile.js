import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Profile() {
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState(null);
  const [editingUserData, setEditingUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editedPostData, setEditedPostData] = useState({
    title: "",
    description: "",
  });
  const jwtToken = Cookies.get("jwtToken");

  useEffect(() => {
    if (!jwtToken) {
      console.error("JWT token not found in cookies");
      return;
    }

    Promise.all([
      fetch(`${API_BASE_URL}/account/profile`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }).then((response) => response.json()),
      fetch(`${API_BASE_URL}/post/myposts`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }).then((response) => response.json()),
    ])
      .then(([userDataResponse, userPostsResponse]) => {
        setUserData(userDataResponse);
        setUserPosts(userPostsResponse);
        
      })
      .catch((error) =>
        console.error("Error fetching user data or posts:", error)
      );
  }, [jwtToken]);

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);

    if (!isEditing) {
      setEditingUserData({ ...userData });
    }
  };

  const handleSaveUserData = () => {
    if (!jwtToken) {
      console.error("JWT token not found in cookies");
      return
    }
    
      

    fetch(`${API_BASE_URL}/account/profile/update`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editingUserData),
    })
      .then((response) => {
        if (response.ok) {
          setUserData(editingUserData);
          console.log("User data updated successfully.");
          setIsEditing(false);
        } else {
          console.error("Error updating user data:", response.statusText);
        }
      })
      .catch((error) => console.error("Error updating user data:", error));
  };

  const handleEditPost = (postId) => {
    setEditingPost(postId);
  };

  const handleSaveEditedPost = (postId) => {
    if (!jwtToken) {
      console.error("JWT token not found in cookies");
      return;
    }

    fetch(`${API_BASE_URL}/post/update/${postId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: editedPostData.title,
        description: editedPostData.description,
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Post updated successfully.");
          setEditingPost(null);
          window.location.reload();
      
        } else {
          console.error("Error updating post:", response.statusText);
        }
      })
      .catch((error) => console.error("Error updating post:", error));
  };

  const handleDeletePost = (postId) => {
    if (!jwtToken) {
      console.error("JWT token not found in cookies");
      return;
    }

    fetch(`${API_BASE_URL}/post/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: editedPostData.title,
        description: editedPostData.description,
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Post Deleted successfully.");
          setEditingPost(null);
          window.location.reload();
      
        } else {
          console.error("Error deleting post:", response.statusText);
        }
      })
      .catch((error) => console.error("Error deleting post:", error));
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">My Profile</h1>
      {userData ? (
        <div className="mb-4">
          <div className="mb-3">
            <strong>Email:</strong> {userData.email}
          </div>
          <div className="mb-3">
            <strong>Name:</strong>{" "}
            {isEditing ? (
              <input
                type="text"
                className="form-control"
                value={editingUserData.name}
                onChange={(e) =>
                  setEditingUserData({
                    ...editingUserData,
                    name: e.target.value,
                  })
                }
              />
            ) : (
              userData.name
            )}
          </div>
          {isEditing && (
            <div className="mb-3">
              <strong>Password:</strong>{" "}
              <input
                type="password"
                className="form-control"
                value={editingUserData.password}
                onChange={(e) =>
                  setEditingUserData({
                    ...editingUserData,
                    password: e.target.value,
                  })
                }
              />
            </div>
          )}
          <button
            className={`btn ${
              isEditing ? "btn-success" : "btn-outline-primary"
            }`}
            onClick={isEditing ? handleSaveUserData : handleToggleEdit}
          >
            {isEditing ? "Save" : "Edit"}
          </button>{" "}
          {isEditing && (
            <button
              className="btn btn-danger btn-sm"
              onClick={handleToggleEdit}
            >
              Cancel
            </button>
          )}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}

      {userPosts ? (
        <div className="mb-4">
          <h2 className="mb-3">Your Posts:</h2>
          <div className="row">
            {userPosts.map((post) => (
              <div key={post.id} className="col-md-4 mb-3">
                <Card 
                    style={{ width: "300px", height: "400px" }} 
                >
                  {post.picturePath && (
                    <Card.Img
                      variant="top"
                      src={`${API_BASE_URL}${post.picturePath}`}
                      alt={post.title}
                      onClick={() =>
                        window.open(
                          `${API_BASE_URL}${post.picturePath}`,
                          "_blank"
                        )
                      }
                      style={{ cursor: "pointer" ,  width: "100%", height: "60%"}}
                    />
                  )}
                  <Card.Body>
                    {editingPost === post.id ? (
                      <div>
                        <input
                          type="text"
                          className="form-control"
                          value={editedPostData.title}
                          onChange={(e) =>
                            setEditedPostData({
                              ...editedPostData,
                              title: e.target.value,
                            })
                          }
                        />
                        <textarea
                          className="form-control"
                          value={editedPostData.description}
                          onChange={(e) =>
                            setEditedPostData({
                              ...editedPostData,
                              description: e.target.value,
                            })
                          }
                        />
                        <button
                          className="btn btn-success"
                          onClick={() => handleSaveEditedPost(post.id)}
                        >
                          Save
                        </button>{" "}
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => setEditingPost(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Card.Title className="card-title">
                          {post.title}
                        </Card.Title>
                        <Card.Text className="card-text">
                          {post.description}
                        </Card.Text>
                        <div className="d-flex justify-content-between">
                          <button
                            className="btn btn-primary"
                            onClick={() => handleEditPost(post.id)}
                          >
                            Edit Post
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDeletePost(post.id)}
                          >
                            Delete Post
                          </button>
                        </div>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Loading user posts...</p>
      )}
    </div>
  );
}

export default Profile;
