const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(
  "sk_test_51NzCpLSGV85by5jinCxb3a5bpafIcJFEmE2rU6rmdPdooVLoG6nxXKaJ72VOqdpLc0ccp952zIzNHEL51ffFLOQV00XOoHEEfK"
);
const YOUR_DOMAIN = "http://127.0.0.1:3000";

const createCheckoutSession = asyncHandler(async (req, res) => {
  const { amount, appointmentId } = req.body;

  // If no customer with that appointmentId exists, create a new customer
  customer = await stripe.customers.create({ id: appointmentId });

  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2022-08-01" }
  );

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "inr",
      customer: customer.id,
      payment_method_types: ["card"],
    });

    const result = {
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
    };

    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.error("Stripe payment intent creation error:", error);
    res.status(500).json({ paymentIntent: null, error: "Server error" });
  }
});

module.exports = { createCheckoutSession };
