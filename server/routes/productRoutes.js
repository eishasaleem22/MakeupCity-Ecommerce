const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  getProductsByCategory,
  getCategoryList,
  seedProducts,
} = require("../controllers/productController");

router.get("/categories/list", getCategoryList);
router.get("/category/:categorySlug", getProductsByCategory);
router.post("/seed", seedProducts);
router.get("/:id", getProductById);
router.get("/", getProducts);

module.exports = router;