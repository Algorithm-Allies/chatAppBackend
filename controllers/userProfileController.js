const asyncHandler = require("express-async-handler");
const User = require("../models/userModel.js");

const updateUserProfile = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!req.body.newUsername && user.username === undefined) {
      return res.status(400).json({ error: "Username is required" });
    }

    if (req.body.newUsername) {
      user.username = req.body.newUsername;
    }

    if (req.body.newPronouns) {
      user.pronouns = req.body.newPronouns;
    }

    if (req.body.newProfilePic) {
      user.profilePhoto = req.body.newProfilePic;
    }

    if (req.body.newPrimaryColor) {
      user.primaryColor = req.body.newPrimaryColor;
    }

    if (req.body.newAccentColor) {
      user.accentColor = req.body.newAccentColor;
    }

    if (req.body.newAboutMe) {
      user.aboutMe = req.body.newAboutMe;
    }

    const updatedUser = await user.save();

    res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = {
  updateUserProfile,
};
