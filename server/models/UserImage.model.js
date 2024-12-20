//This model set the relation between user and image. Basicaly it add an image to the users collection.
const { Schema, model } = require("mongoose");

const userImageSchema = new Schema(
  {
    imageId: {
      type: Schema.Types.ObjectId,
      ref: "Image",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserImageModel = model("userImage", userImageSchema);

module.exports = UserImageModel;
