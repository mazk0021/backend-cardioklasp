const express = require("express");
const router = express.Router();
const { createCheckoutSession } = require("../controllers/payments")
const { authorize } = require("../middlewares/authorization")

router.post("/create-checkout-session", createCheckoutSession);

module.exports = router