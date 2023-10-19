const express = require("express");
const router = express.Router();
const { acceptDoctor, editDoctor, deleteDoctor, viewAllDoctors, viewAllPatients } = require("../controllers/admin")
const { authorize, checkIfRoleIsAdmin } = require("../middlewares/authorization")

router.patch("/addDoctor/:doctorId", authorize, checkIfRoleIsAdmin, acceptDoctor);
router.patch("/editDoctor/:doctorId", authorize, checkIfRoleIsAdmin, editDoctor);
router.delete("/deleteDoctor/:doctorId", authorize, checkIfRoleIsAdmin, deleteDoctor);
router.get("/viewAllDoctors", authorize, checkIfRoleIsAdmin, viewAllDoctors);
router.get("/viewAllPatients", authorize, checkIfRoleIsAdmin, viewAllPatients);

module.exports = router