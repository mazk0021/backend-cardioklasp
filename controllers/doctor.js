const asynchandler = require("express-async-handler");
const User = require("../models/User");
const Appointment = require("../models/Appointment");

const doctorAddsTimeSlots = asynchandler(async (req, res) => {
  const { start, end, date, price } = req.body;
  const userID = req.user._id;
  console.log("adding time slots for doctor");

  const updatedDoctor = await User.findByIdAndUpdate(
    { _id: userID },
    { $push: { doctorTimeSlots: { start, end, price } } },
    { new: true, projection: "-password" }
  );
  if (updatedDoctor) {
    res.status(200).json(updatedDoctor);
  } else {
    res.status(400);
    throw new Error("Failed to add slot");
  }
});

const removeDoctorTimeSlots = asynchandler(async (req, res) => {
  const slotId = req.params.id;
  const userID = req.user._id;
  const updatedDoctor = await User.findByIdAndUpdate(
    { _id: userID },
    { $pull: { doctorTimeSlots: { _id: slotId } } },
    { new: true, projection: "-password" }
  );
  if (updatedDoctor) {
    res.status(200).json(updatedDoctor);
  } else {
    res.status(400);
    throw new Error("Failed to add slot");
  }
});

const viewAllDoctorTimeSlots = asynchandler(async (req, res) => {
  const userID = req.user._id;
  const doctor = await User.findById(
    { _id: userID },
    {
      email: 1,
      name: 1,
      role: 1,
      doctorTimeSlots: 1,
    }
  );
  console.log(doctor);
  if (doctor) {
    res.status(200).json(doctor);
  } else {
    res.status(400);
    throw new Error("Failed to add slot");
  }
});

const viewAllDoctorAppointments = asynchandler(async (req, res) => {
  const doctorId = req.user._id;
  const appointments = await Appointment.find({ doctorId });
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

const getDoctors = asynchandler(async (req, res) => {
  console.log("inside getting registered doctors");
  const doctors = await User.find(
    { role: "DOCTOR", isDoctorAccepted: true },
    { password: 0 }
  );
  console.log(doctors);
  res.status(200).json(doctors);
});

module.exports = {
  doctorAddsTimeSlots,
  removeDoctorTimeSlots,
  viewAllDoctorTimeSlots,
  viewAllDoctorAppointments,
  getDoctors,
};
