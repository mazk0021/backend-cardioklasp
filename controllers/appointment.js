const asynchandler = require("express-async-handler");
const Appointment = require("../models/Appointment");
const User = require("../models/User");

const bookAppointment = asynchandler(async (req, res) => {
  const patientId = req.user._id;
  const { startTime, endTime, day, doctorId, notes, diagnosis } = req.body;

  if (
    !startTime ||
    !endTime ||
    !doctorId ||
    // !notes ||
    // !diagnosis ||
    !day
  ) {
    res.status(400).json({ error: "Fields not defined correctly" });
    throw new Error("fields not defined correctly");
  } else {
    var appointment = new Appointment({
      date: new Date(),
      startTime,
      endTime,
      day,
      patientId,
      doctorId,
      notes,
      diagnosis,
    });
    appointment.save();

    if (appointment) {
      res.status(201).json(appointment);
    } else {
      res.status(400).json({ error: "Failed to book appointment correctly" });
      throw new Error("Failed to book appointment");
    }
  }
});

const deleteAppointment = asynchandler(async (req, res) => {
  const appointmentId = req.params.id;
  const appointment = await Appointment.findByIdAndDelete(appointmentId);
  if (appointment) {
    res.status(202).json(appointment);
  } else {
    res.status(400).json({ error: "failed to delete appointment correctly" });
    throw new Error("Failed to delete appointment");
  }
});

const viewAllAppointmentHistoryForAPatient = asynchandler(async (req, res) => {
  const patientId = req.user._id;
  const appointments = await Appointment.find({ patientId }).populate(
    "doctorId",
    "_id email name"
  );
  console.log(appointments);
  if (appointments) {
    res.status(200).json(appointments);
  } else {
    res
      .status(400)
      .json({ error: "failed to get appointments history correctly" });
    throw new Error("Failed to get all appointments history");
  }
});

const viewAppointmentDetails = asynchandler(async (req, res) => {
  const appointmentId = req.params.id;
  const appointment = await Appointment.findById(appointmentId)
    .populate("patientId", "_id email name role")
    .populate("doctorId", "_id email name role doctorTimeSlots");
  if (appointment) {
    res.status(200).json(appointment);
  } else {
    res
      .status(400)
      .json({ error: "failed to get appointment details correctly" });
    throw new Error("Failed to get appointment details");
  }
});

const viewAllAppointmentHistoryForADoctor = asynchandler(async (req, res) => {
  const { id } = req.params;
  const appointments = await Appointment.find({ doctorId: id }).populate(
    "patientId",
    "_id name "
  );

  if (appointments) {
    res.status(200).json(appointments);
  } else {
    res.status(400).json({ error: "failed to get all doctor's appointments" });
    throw new Error("failed to get all doctor's appointments");
  }
});

const getDoctorsPatients = asynchandler(async (req, res) => {
  const { id } = req.params;

  try {
    const appointments = await Appointment.find({ doctorId: id });
    if (!appointments) {
      return res
        .status(400)
        .json({ error: "Failed to get doctor's appointments" });
    }

    const patientIds = appointments.map((appointment) => appointment.patientId);

    const patients = await User.find({ _id: { $in: patientIds } });

    if (!patients) {
      return res.status(400).json({ error: "Failed to get patients" });
    }
    console.log(patients);
    res.status(200).json({ patients });
  } catch (error) {
    console.error("Error getting doctor's patients:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = {
  bookAppointment,
  deleteAppointment,
  viewAllAppointmentHistoryForAPatient,
  viewAppointmentDetails,
  viewAllAppointmentHistoryForADoctor,
  getDoctorsPatients
};
