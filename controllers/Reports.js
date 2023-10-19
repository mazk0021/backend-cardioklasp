const Report = require("../models/Reports");
const User = require("../models/User");
exports.uploadReport = async (req, res) => {
  try {
    const { originalname, buffer } = req.file;
    const patientId = req.user._id;
    const { notes, doctorId } = req.body;

    const newReport = new Report({
      name: originalname,
      notes,
      patientId,
      doctorId,
      fileData: buffer,
    });

    await newReport.save();

    res.status(200).json({ message: "Report uploaded successfully" });
    console.log("success");
  } catch (error) {
    console.error(error);
    console.log("error");
    res.status(500).json({ message: "Error uploading report" });
  }
};

exports.getReports = async (req, res) => {
  try {
    const patientId = req.user._id;

    const reports = await Report.find({ patientId });

    res.status(200).json(reports);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "No reports Found" });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    const reportId = req.params.reportId;

    const response = await Report.findByIdAndDelete(reportId);

    if (!response) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({ message: "Report Deleted Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getSingleReportDetails = async (req, res) => {
  try {
    const reportId = req.params.reportId;
    const reportDetails = await Report.findById(reportId);

    if (!reportDetails) {
      res.status(404).json({ message: "No report Found" });
    }
    res.status(200).json(reportDetails);
    console.log("success");
  } catch (err) {
    res.send(err);
    console.log("err");
  }
};
exports.downloadReport = async (req, res) => {
  try {
    const reportId = req.params.reportId;
    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.set({
      "Content-Type": "application/octet-stream", // Set the appropriate content type for your file
      "Content-Disposition": `attachment; filename=${report.name}`, // Set the filename for the download
    });

    // Send the file data as the response
    res.send(report.fileData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// exports.downloadReport = async (req, res) => {
//   try {
//     const reportId = req.params.reportId;
//     const report = await Report.findById(reportId);

//     if (!report) {
//       return res.status(404).json({ message: "Report not found" });
//     }

//     const fileName = report.name;
//     let contentType = "image/jpg"; // Default to generic content type

//     if (fileName.endsWith(".pdf")) {
//       contentType = "application/pdf";
//     }
//     console.log(contentType);
//     // Add this line to check the content type before setting it in the response headers
//     res.set({
//       "Content-Type": contentType,
//       "Content-Disposition": `attachment; filename=${fileName}`,
//     });
//     console.log(report.name);
//     // Send the file data as the response
//     res.send(report.fileData);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

exports.getPatientReport = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const patient = await User.findById(patientId);

    if (!patient) {
      return res.status(404).json({ message: "No Patient Found" });
    }

    const reports = await Report.find({ patientId })
      .sort({ createdAt: -1 })
      .limit(1);

    if (reports.length === 0) {
      return res.status(404).json({ message: "No report Found" });
    }

    res.status(200).json(reports[0]);
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.addNoteToReport = async (req, res) => {
  try {
    const reportId = req.params.reportId;
    const { note } = req.body; // Assuming the note is sent in the request body

    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Update the notes field in the report
    report.notes = note;

    // Save the updated report
    await report.save();

    res.status(200).json({ message: "Note added to the report successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
