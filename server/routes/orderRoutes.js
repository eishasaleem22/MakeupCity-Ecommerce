const express = require("express");

const {
  sendOrderConfirmation,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// CUSTOMER ROUTE
// =====================================================

// Place order + send confirmation email
router.post(
  "/send-confirmation",
  sendOrderConfirmation
);

// =====================================================
// ADMIN ORDER ROUTES
// =====================================================

// Get all orders
// GET /api/orders
router.get(
  "/",
  protect,
  adminOnly,
  getAllOrders
);

// Get single order
// GET /api/orders/:id
router.get(
  "/:id",
  protect,
  adminOnly,
  getOrderById
);

// Update order status
// PUT /api/orders/:id/status
router.put(
  "/:id/status",
  protect,
  adminOnly,
  updateOrderStatus
);

module.exports = router;