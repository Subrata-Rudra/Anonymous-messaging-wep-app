const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const expressAsyncHandler = require("express-async-handler");

const protect = expressAsyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userExist = await User.findById(decoded.id);
      if (!userExist) {
        throw new Error("User does not exist with this id");
      }
      req.user = userExist;
      next();
    } catch (error) {
      res
        .status(401)
        .json({ status: "Failed", message: "Not authorized, token failed." });
      // throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res
      .status(401)
      .json({ status: "Failed", message: "Not authorized, no token." });
    // throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };
