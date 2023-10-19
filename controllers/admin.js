const User = require("../models/User")
const asyncHandler = require("express-async-handler")

const acceptDoctor = asyncHandler(async (req, res) => {
    const doctorId = req.params.doctorId
    const updateDoctorStatusToAccepted = await User.findByIdAndUpdate(
        { _id: doctorId },
        { isDoctorAccepted: true },
        { new: true, projection: "-password" })
    res.status(202).json(updateDoctorStatusToAccepted)
})

const editDoctor = asyncHandler(async (req, res) => {
    const doctorId = req.params.doctorId
    const updatedDoctorDetails = await User.findByIdAndUpdate(
        { _id: doctorId },
        { ...req.body },
        { new: true, projection: "-password" })
    res.status(202).json(updatedDoctorDetails)
})

const deleteDoctor = asyncHandler(async (req, res) => {
    const doctorId = req.params.doctorId
    const deletedDoctor = await User.findByIdAndDelete({ _id: doctorId })
    res.status(202).json(deletedDoctor)
})

const viewAllDoctors = asyncHandler(async (req, res) => {
    const doctors = await User.find({ role: "DOCTOR" }, { password: 0 })
    res.status(200).json(doctors)
})

const viewAllPatients = asyncHandler(async (req, res) => {
    const patients = await User.find({ role: "PATIENT" }, { password: 0 })
    res.status(200).json(patients)
})


module.exports = { acceptDoctor, editDoctor, deleteDoctor, viewAllDoctors, viewAllPatients }