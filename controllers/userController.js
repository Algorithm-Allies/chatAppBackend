const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwtSecret = process.env.JWT_SECRET || "secret";
const mongoose = require("mongoose");

// @desc: Register a new user
// @route: POST /api/users
// @access: Public
const registerUser = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    username,
    password,
    dateOfBirth,
    profilePhoto,
  } = req.body;

  if (!firstName || !lastName || !email || !password || !dateOfBirth) {
    res.status(400);
    throw new Error("Please provide all fields");
  }

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    username,
    password: hashedPassword,
    dateOfBirth,
    profilePhoto,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc: Authenticate a user
// @route: POST /api/users/login
// @access: Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  // Check if the user exists
  const user = await User.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error("Invalid email");
  }

  // Check if the password is correct
  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    res.status(401);
    throw new Error("Invalid password");
  }

  // Generate a JSON Web Token (JWT)
  const token = jwt.sign({ userId: user._id }, jwtSecret, {
    expiresIn: "1h",
  });

  res.status(200).json({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
    token,
  });
});

// @desc: Get all users
// @route: GET /api/users
// @access: Private
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();

  if (!users || users.length === 0) {
    return res.status(404).json({ message: "No users found" });
  }

  res.status(200).json(users);
});

// @desc: Get user data
// @route: GET /api/users/:id
// @access: Private
const getUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400);
    throw new Error("Invalid user ID");
  }

  try {
    // Find the user by ID in the database
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Return the user data, including all schema fields
    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      pronouns: user.pronouns,
      email: user.email,
      username: user.username,
      dateOfBirth: user.dateOfBirth,
      profilePhoto: user.profilePhoto,
      primaryColor: user.primaryColor,
      accentColor: user.accentColor,
      aboutMe: user.aboutMe,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Internal Server Error");
  }
});

const getUserByUsername = asyncHandler(async (req, res) => {
  const username = req.params.username;

  // Find the user by username in the database
  const user = await User.findOne({ username });

  // Check if the user exists
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    dateOfBirth: user.dateOfBirth,
    profilePhoto: user.profilePhoto,
  });
});

// @desc: Update user profile picture
// @route: PUT /api/users/:id/update-profile-picture
// @access: Private
const updateProfilePhoto = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400);
    throw new Error("Invalid user ID");
  }

  // Find the user by ID in the database
  const user = await User.findById(userId);

  // Check if the user exists
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Update profile picture
  user.profilePhoto = req.body.profilePhoto; // Assuming profilePhoto is the new picture URL or base64 data
  console.log(user.profilePhoto);
  // Save the updated user
  await user.save();

  res.status(200).json({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    dateOfBirth: user.dateOfBirth,
    profilePhoto: user.profilePhoto,
  });
});

module.exports = {
  registerUser,
  loginUser,
  getUsers,
  getUser,
  getUserByUsername,
  updateProfilePhoto,
};
