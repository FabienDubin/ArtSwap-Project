//This route manages User update,
// get informations on a specific user,
// add a friend to the user and get all friends users.
const bcrypt = require("bcrypt");
const router = require("express").Router();
const UserModel = require("../models/User.model.js");
//To add image size we use probe-image-size package
const probe = require("probe-image-size");

//Edit a user
router.put("/update/:userId", async (req, res, next) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true }
    );
    res.status(200).json({ message: "🥳user has been updated", updatedUser });
  } catch (err) {
    next(err);
  }
});

//Delete a user
//🚨 DON'T DELETE USER FOR NOW
//SINCE WE NEED TO ALSO DELETE COMMENTS AND COLLECTION OF THE USER
// router.delete("/delete/:userId", async (req, res, next) => {
//   try {
//     const deletedUser = await UserModel.findByIdAndDelete(req.params.userId);
//     res.status(200).json({ message: "🥳 user deleted" });
//   } catch (error) {
//     next(err);
//   }
// });

//Update user password
router.put("/update-password/:id", async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.params.id;

  try {
    // Get Users ID
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check the former password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "🤦‍♂️ The former password doesn't match" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password uin DB
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    next(error);
  }
});

//Add a friend to a specific user
router.put("/togetheritsbetter/:userId/:friendId", async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    const friend = await UserModel.findById(req.params.friendId);
    //check if the user and the friend exist in the user db
    if (!user || !friend) {
      return res.status(404).json({ message: "🤦User or friend not found" });
    }
    //check if the friend already exist in the friends list of the current user
    if (user.friends.includes(friend._id)) {
      return res.status(409).json({ message: "⛔️Friend already added" });
    }

    user.friends.push(friend._id);
    await user.save();

    res
      .status(200)
      .json({ message: "🥳Friend added successfully", updatedUser: user });
  } catch (err) {
    next(err);
  }
});

//Delete a friend to a specific user
router.delete(
  "/togetheritsbetter/:userId/:friendId",
  async (req, res, next) => {
    try {
      const user = await UserModel.findById(req.params.userId);
      const friend = await UserModel.findById(req.params.friendId);

      //check if the user and the friend exist in the user db
      if (!user || !friend) {
        return res.status(404).json({ message: "🤦User or friend not found" });
      }

      //check if the firend does exist in the friends list of the current user
      if (!user.friends.includes(friend._id)) {
        return res
          .status(418)
          .json({ message: "🤷‍♂️Friend not found in user's friends list" });
      }
      const friendIndex = user.friends.indexOf(friend._id);
      user.friends.splice(friendIndex, 1);
      await user.save();

      res
        .status(200)
        .json({ message: "🥳Friend removed successfully", updatedUser: user });
    } catch (err) {
      next(err);
    }
  }
);

//Check of a relationship exists between the logged in user and a user
router.get("/arefriends", async (req, res, next) => {
  const userId = req.query.userId;
  const friendId = req.query.friendId;

  try {
    //check if the user and the friend exist
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "🤦‍♂️ User not found!" });
    const friend = await UserModel.findById(friendId);
    if (!friend)
      return res.status(404).json({ message: "🤦‍♂️ Friend not found" });

    //checking if the user has this friend ahas a friend
    const areFriends = user.friends.includes(friendId);

    if (areFriends) {
      res.status(200).json({ message: "🥳 friendship", areFriends: true });
    } else {
      res
        .status(200)
        .json({ message: "🚨 They are not friends", areFriends: false });
    }
  } catch (err) {
    next(err);
  }
});

//Dynamic search for a friend
router.get("/search-friend", async (req, res, next) => {
  const query = req.query.username;

  try {
    if (!query || query.trim().length === 0) {
      return res.json([]);
    }

    const users = await UserModel.find({
      username: { $regex: query, $options: "i" },
    });

    res.json(users);
  } catch (err) {
    next(err);
  }
});

//Get all friends
router.get("/allFriends/:userId", async (req, res, next) => {
  try {
    // Get the user by ID and populate their friends
    const user = await UserModel.findById(req.params.userId).populate(
      "friends"
    );

    if (!user) {
      return res.status(404).json({ message: "🤦‍♂️ User not found!" });
    }

    // Get image dimension if possible
    const friendsWithDimensions = await Promise.all(
      user.friends.map(async (friend) => {
        try {
          const dimensions = await probe(`${friend.image}?q=30`);
          return {
            id: friend._id,
            username: friend.username,
            image: friend.image,
            width: dimensions.width,
            height: dimensions.height,
          };
        } catch (error) {
          console.error(
            `Did not manage to find the dimensions of : ${friend.image}`,
            error
          );
          return {
            id: friend._id,
            username: friend.username,
            image: friend.image,
            width: 300,
            height: 300,
          };
        }
      })
    );

    res.status(200).json({
      message: "🥳 Friends found !",
      friends: friendsWithDimensions,
    });
  } catch (err) {
    next(err);
  }
});

//Get user informations
router.get("/:userId", async (req, res, next) => {
  try {
    const oneUser = await UserModel.findById(req.params.userId);
    res.status(200).json({ message: "🥳User found", oneUser });
  } catch (err) {
    next(err);
  }
});

// // Change Profile Picture via Cloudinary
const uploader = require("../middleware/cloudinary.middleware.js");
router.put(
  "/update-image/:userId",
  uploader.single("imageUrl"),
  async (req, res, next) => {
    // the uploader.single() callback will send tnhe file to cloudinary and get you and obj with the url in return
    console.log("file is: ", req.file, "user id", req.params.userId);

    if (!req.file) {
      console.log("there was an error uploading the file");
      next(new Error("No file uploaded!"));
      return;
    } else {
      const updatedUser = await UserModel.findByIdAndUpdate(
        req.params.userId,
        { image: req.file.path },
        { new: true }
      );
      console.log("user image updated", updatedUser);
      res.status(200).json({ message: "🥳 user image updated", updatedUser });
    }
  }
);

module.exports = router;
