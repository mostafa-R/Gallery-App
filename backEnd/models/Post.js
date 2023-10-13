const mongoose = require("mongoose");
const User = require("../models/User");

const { Schema } = mongoose;

const ModelSchema = mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    picturePath: {
      type: String,
      // required: false,
    },
    userPicturePath: {
      type: String,
    },
    likes: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    likesCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

ModelSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
  },
});

const Post = mongoose.model("Post", ModelSchema);

module.exports = Post;
