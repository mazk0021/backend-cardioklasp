const express = require("express")
router = express.Router()

const { bookAppointment, deleteAppointment,
    viewAllAppointmentHistoryForAPatient, viewAppointmentDetails, viewAllAppointmentHistoryForADoctor, getDoctorsPatients } = require("../controllers/appointment")
const { authorize } = require("../middlewares/authorization")

router.post("/book", authorize, bookAppointment)
router.delete("/:id", authorize, deleteAppointment)
router.get("/", authorize, viewAllAppointmentHistoryForAPatient)
router.get("/doctor/:id", authorize, viewAllAppointmentHistoryForADoctor)
router.get("/:id", authorize, viewAppointmentDetails)
router.get("/getDoctorPatients/:id", authorize, getDoctorsPatients)


module.exports = router