const { default: axios } = require("axios");
const asyncHandler = require("express-async-handler");

const FAST_API_URL = "http://127.0.0.1:8000";

const classifyECGImage = asyncHandler(async (req, res) => {
  console.log("inside classify image ", req.file);
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No files were uploaded." });
    }
    const file = req.file;
    const formData = new FormData();
    const fileBlob = new Blob([file.buffer], { type: file.mimetype });
    formData.append("file", fileBlob, file.originalname);

    const uploadResponse = await axios.post(
      FAST_API_URL + "/classify_ECG_Image",
      formData
    );
    console.log("File upload response from FastAPI:", uploadResponse.data);
    res.status(200).json(uploadResponse.data);
  } catch (error) {
    console.error("File upload error:", error.message);
    res.status(500).json({ message: "File upload error" });
  }
});


const predict= asyncHandler(async (req, res) => {
  console.log('predict',req.body)
  try {
    // Make a POST request to FastAPI's /predict_heart_disease endpoint
    const response = await axios.post(
      `${FAST_API_URL}/predict_heart_disease`,
      req.body
    );

    if (response.status === 200) {
      console.log("Response from FastAPI:", response.data);
      res.status(200).json(response.data);
    } else {
      console.error("Error from FastAPI:", response.status);
      res.status(response.status).json({ message: "Error while predicting heart disease ML" });
    }
  } catch (error) {
    console.error("Error from FastAPI:", error.message);
    res.status(500).json({ message: "Error while predicting heart disease ML" });
  }

});


module.exports = { classifyECGImage, predict };
