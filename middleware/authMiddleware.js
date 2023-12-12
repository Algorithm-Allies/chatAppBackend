const jwt = require("jsonwebtoken");
const UserActivation = require("../models/userModel.js"); // Fix the import here
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  console.log("Headers",req.headers.authorization);
  console.log("process.env",process.env.JWT_SECRET);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Decodes token id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Use the correct model here (UserActivation instead of uer)
      req.user = await UserActivation.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token found");
  }
});

module.exports = { protect };
