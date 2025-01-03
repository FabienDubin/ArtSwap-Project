//This Comment model is used for all the comments of the app. It also sets a relationship between user and image
// Here is an extra comment
const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageId: {
      type: Schema.Types.ObjectId,
      ref: "Image",
      required: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const CommentModel = model("Comment", commentSchema);
module.exports = CommentModel;
