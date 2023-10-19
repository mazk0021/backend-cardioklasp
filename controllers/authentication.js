const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../configurations/generateToken");
const asyncHandler = require("express-async-handler");

const registerUser = asyncHandler(async (req, res) => {
  console.log("here");
  const { name, email, password, picture, role } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: "Fields not defined correctly" });
    throw new Error("fields not defined correctly");
  }
  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    res.status(400).json({ error: "User already exists" }); // Send an error message
    throw new Error("User already exists");
  }
  const newUser = new User({ name, email, password, picture, role });
  newUser.save();
  if (newUser) {
    res.status(200).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      picture: newUser.picture,
      token: generateToken(newUser._id),
    });
  } else {
    res.status(400).json({ error: "Failed to create User" }); // Send an error message
    throw new Error("Failed to create User");
  }
});
const loginUser = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;
  console.log("body", req.body);
  const user = await User.findOne({ email: email, role: role });
  console.log("User", user);

  if (user) {
    const result = await bcrypt.compare(password, user.password);
    console.log("result before if=====", result);
    if (result) {
      console.log("result=====", result);
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        picture: user.picture,
        isDoctorAccepted: user.isDoctorAccepted,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ error: "Failed to login" });
      throw new Error("Failed to login");
    }
  } else {
    res.status(400).json({ error: "Failed to login" });
    throw new Error("Failed to login");
  }
});

const getAllUsersExceptAskingOne = asyncHandler(async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user.id } });
  res.status(200).json(users);
});

module.exports = { loginUser, registerUser, getAllUsersExceptAskingOne };
