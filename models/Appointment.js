const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    day: { type: String, required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    notes: { type: String },
    diagnosis: { type: String }
});

module.exports = mongoose.model("Appointment", appointmentSchema, "Appointments");