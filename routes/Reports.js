const express = require("express");
const multer = require("multer");
const router = express.Router();
const { authorize } = require("../middlewares/authorization");
const {
  uploadReport,
  getReports,
  deleteReport,
  getSingleReportDetails,
  addNoteToReport,
  downloadReport, // Add this line to import the downloadReport function
} = require("../controllers/Reports");
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", authorize, upload.single("file"), uploadReport);
router.get("/", authorize, getReports);
router.delete("/delete/:reportId", authorize, deleteReport);
router.get("/:reportId", authorize, getSingleReportDetails);
router.post("/addNote/:reportId", authorize, addNoteToReport);
// Add this route for downloading a report by its ID
router.get("/download/:reportId", authorize, downloadReport);

module.exports = router;
