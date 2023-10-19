const express = require("express");
router = express.Router();
const {
  doctorAddsTimeSlots,
  removeDoctorTimeSlots,
  viewAllDoctorTimeSlots,
  viewAllDoctorAppointments,
  getDoctors,
} = require("../controllers/doctor");
const { authorize } = require("../middlewares/authorization");
const { getPatientReport } = require("../controllers/Reports");

router.patch("/slots/add", authorize, doctorAddsTimeSlots);
router.patch("/slots/remove/:id", authorize, removeDoctorTimeSlots);
router.get("/slots/", authorize, viewAllDoctorTimeSlots);
router.get("/appointments/all", authorize, viewAllDoctorAppointments);
router.get("/get", authorize, getDoctors);
router.get("/slots/:id", authorize, viewAllDoctorTimeSlots);

router.get("/report/:patientId", authorize, getPatientReport);
module.exports = router;
