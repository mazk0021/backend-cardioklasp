const express = require("express");
const router = express.Router();
const {
  getUserDetails,
  editUserDetails,
  deleteUser,
  editDoctorInfo,
  getAllUsers
} = require("../controllers/user");
const { authorize } = require("../middlewares/authorization");

router.get("/userDetails/:id", authorize, getUserDetails);
router.patch("/editUser/:id", authorize, editUserDetails);
router.patch("/editDoctor/:id", editDoctorInfo);
router.delete("/deleteUser/:id", authorize, deleteUser);
router.get("/", authorize, getAllUsers);



module.exports = router;
