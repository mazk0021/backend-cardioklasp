const express = require("express")
const router = express.Router()
const { registerUser, loginUser, getAllUsersExceptAskingOne } = require("../controllers/authentication")
const { authorize } = require("../middlewares/authorization")

router.route("/signup").post(registerUser)
router.post("/login", loginUser)
router.route("/").get(authorize, getAllUsersExceptAskingOne)

module.exports = router