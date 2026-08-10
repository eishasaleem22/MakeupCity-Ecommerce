const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProductById,
  getProductsByCategory,
  getCategoryList,
  createProduct,
  updateProduct,
  deleteProduct,
  seedProducts,
} = require("../controllers/productControllers");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

// ==========================================
// PUBLIC PRODUCT ROUTES
// ==========================================

// Get category list
router.get(
  "/categories/list",
  getCategoryList
);

// Get products by category
router.get(
  "/category/:categorySlug",
  getProductsByCategory
);

// Seed products
router.post(
  "/seed",
  seedProducts
);

// Get single product
router.get(
  "/:id",
  getProductById
);

// Get all products
router.get(
  "/",
  getProducts
);


// ==========================================
// ADMIN PRODUCT ROUTES
// ==========================================

// Add new product
router.post(
  "/",
  protect,
  adminOnly,
  createProduct
);

// Update existing product
router.put(
  "/:id",
  protect,
  adminOnly,
  updateProduct
);

// Delete product
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteProduct
);


module.exports = router;