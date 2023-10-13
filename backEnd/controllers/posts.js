const User = require("../models/User");
const Post = require("../models/Post");
const fs = require("fs/promises");

exports.create = async (req, res) => {
  try {
    const { userId, title, description, picturePath } = req.body;
    const user = await User.findById(req.userId);
    const newPost = new Post({
      userId: req.userId,
      name: user.name,
      title,
      description,
      //userPicturePath: user.picturePath,
      picturePath: "/public/images/" + req.file.filename,
      likes: [],
    });
    await newPost.save();

    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const getPosts = await Post.find();
    res.status(200).json(getPosts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

exports.getPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const posts = await Post.find({ userId });
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const like = post.likes.find(
      (like) => like.user && like.user.toString() === userId
    );

    if (like) {
      post.likes.pull(like);
      post.likesCount -= 1;
    } else {
      post.likes.push({ user: userId });
      post.likesCount += 1;
    }

    const updatedPost = await post.save();

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.update = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { title, description } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const updatedFields = {};

    if (title) {
      updatedFields.title = title;
    }

    if (description) {
      updatedFields.description = description;
    }

    const updatedPost = await Post.findByIdAndUpdate(postId, updatedFields, {
      new: true,
    });

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (req.userId !== post.userId.toString()) {
      return res
        .status(403)
        .json({ message: "You do not have permission to delete this post" });
    }

    if (post.picturePath) {
      await fs.unlink("." + post.picturePath, function (err) {
        if (err) {
          console.error(err);
        }
      });
    }

    await Post.findByIdAndDelete(postId);

    res.json({ message: "Post and associated photo deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
