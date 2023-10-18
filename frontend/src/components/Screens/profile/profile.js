import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, Button } from "react-bootstrap";

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
    picturePath: "",
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
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
      return;
    }

    if (editingUserData.password && editingUserData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
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
    const postToEdit = userPosts.find((post) => post.id === postId);

    setEditedPostData({
      title: postToEdit.title,
      description: postToEdit.description,
    });

    setEditingPost(postId);
  };

  const handleSaveEditedPost = (postId) => {
    if (!jwtToken) {
      console.error("JWT token not found in cookies");
      return;
    }

    setShowConfirmModal(true);
  };

  const handleSavePostEditConfirmation = (postId) => {
    setShowConfirmModal(false);

    fetch(`${API_BASE_URL}/post/update/${postId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedPostData),
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

    const confirmDelete = () => {
      toast.info(
        <div>
          <p>Are you sure you want to delete this post?</p>
          <div className="d-flex justify-content-between">
            <button
              className="btn btn-danger btn"
              onClick={() => {
                handleDeleteConfirmed(postId);
              }}
            >
              Yes
            </button>
            <button
              className="btn btn-success"
              onClick={() => {
                toast.dismiss();
              }}
            >
              No
            </button>
          </div>
        </div>,
        {
          position: toast.POSITION.TOP_CENTER,
        }
      );
    };

    confirmDelete();
  };

  const handleDeleteConfirmed = (postId) => {
    toast.dismiss();
    fetch(`${API_BASE_URL}/post/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
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

  const handleCancelPostEditConfirmation = () => {
    setShowConfirmModal(false);
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
            <strong>Edit Name:</strong>{" "}
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
              <strong>New Password:</strong>{" "}
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
                <Card style={{ width: "300px", height: "400px" }}>
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
                      style={{
                        cursor: "pointer",
                        width: "100%",
                        height: "60%",
                      }}
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
                          Edit
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

      <Modal show={showConfirmModal} onHide={handleCancelPostEditConfirmation}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Edit</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to save the edited post?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCancelPostEditConfirmation}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => handleSavePostEditConfirmation(editingPost)}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </div>
  );
}

export default Profile;
