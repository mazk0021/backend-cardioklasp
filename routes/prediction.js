const express = require("express");
const router = express.Router();
const { classifyECGImage, predict} = require("../controllers/prediction")
const { authorize } = require("../middlewares/authorization")
const multer = require('multer'); 
const upload = multer(); 

router.post("/classifyImage", authorize, upload.single('file'), classifyECGImage);
router.post("/predictDisease", authorize, predict);

module.exports = router