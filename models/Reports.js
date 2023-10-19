const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema(
  {
    name: { type: String },
    notes: { type: String },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    fileData: { type: Buffer, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Report", ReportSchema, "Reports");
