const express = require("express");

const {
  sendOrderConfirmation,
} = require("../controllers/orderController");

const router = express.Router();

router.post(
  "/send-confirmation",
  sendOrderConfirmation
);

module.exports = router;