const express = require("express");

const {
  getAllUsers,
  getUserById,
} = require("../controllers/userController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// ADMIN USER ROUTES
// =====================================================

// Get all users
// GET /api/users
router.get(
  "/",
  protect,
  adminOnly,
  getAllUsers
);

// Get single user + order history
// GET /api/users/:id
router.get(
  "/:id",
  protect,
  adminOnly,
  getUserById
);

module.exports = router;