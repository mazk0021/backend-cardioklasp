const User = require("../models/User");
const asyncHandler = require("express-async-handler");

const getUserDetails = asyncHandler(async (req, res) => {
  console.log("In getUserDetails");
  const userId = req.params.id;
  console.log("id git in params is ", userId);
  const user = await User.findById({ _id: userId }, { password: 0 });
  res.status(200).json(user);
});

const editUserDetails = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const editedUserDetails = await User.findByIdAndUpdate(
    { _id: userId },
    { ...req.body },
    { new: true, projection: "-password" }
  );
  res.status(202).json(editedUserDetails);
});

const editDoctorInfo = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const editedUserDetails = await User.findByIdAndUpdate(
    { _id: userId },
    { ...req.body },
    { new: true, projection: "-password" }
  );
  res.status(202).json(editedUserDetails);
});

const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const deletedUser = await User.findByIdAndDelete(
    { _id: userId },
    { ...req.body },
    { new: true, projection: "-password" }
  );
  res.status(200).json(deletedUser);
});

const getAllUsers = asyncHandler(async (req, res) => {
  console.log("In get all users");
  const {user } = req.user
  const adminUser = await User.findOne({ role: 'admin' }); // Replace 'role' and 'admin' with your actual criteria
  const users = await User.find();

  // Filter out the admin user
  const filteredUsers = users.filter(u => u._id.toString() !== (adminUser._id.toString() || user._id.toString()));
  res.status(200).json(filteredUsers);
});

module.exports = {
  getUserDetails,
  editUserDetails,
  deleteUser,
  editDoctorInfo,
  getAllUsers
};
