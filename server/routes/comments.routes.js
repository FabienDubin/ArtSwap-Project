//This route handles the comments made by the users on an image

const router = require("express").Router();
const commentModel = require("../models/Comment.model");

//Get all the comments on a given image
router.get("/:imageId", async (req, res, next) => {
  try {
    const comments = await commentModel
      .find({ imageId: req.params.imageId })
      .sort({ createdAt: -1 })
      .populate("userId");

    res.status(200).json({ message: "Here are your comments", comments });
  } catch (error) {
    next(error);
  }
});

//Post a comment on an image
router.post("/create", async (req, res, next) => {
  try {
    const newComment = await commentModel.create(req.body);
    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
});

//Delete a comment
router.delete("/delete/:id", async (req, res, next) => {
  try {
    const deletedComment = await commentModel.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ message: "comment has been deleted", deletedComment });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
