const Product = require("../models/Product");

// ==========================================
// CATEGORY NORMALIZER
// ==========================================
// Converts categories into consistent Title Case.
// Examples:
// "foundations" -> "Foundations"
// "FOUNDATIONS" -> "Foundations"
// "face powders" -> "Face Powders"
// "FACE POWDERS" -> "Face Powders"
// ==========================================

const normalizeCategory = (category) => {
  return category
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
};

// ==========================================
// GET ALL PRODUCTS
// ==========================================
// @route GET /api/products
// ==========================================

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({
      createdAt: -1,
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ==========================================
// GET SINGLE PRODUCT
// ==========================================
// @route GET /api/products/:id
// ==========================================

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ==========================================
// GET PRODUCTS BY CATEGORY
// ==========================================
// @route GET /api/products/category/:categorySlug
// ==========================================

const getProductsByCategory = async (req, res) => {
  try {
    const categoryName = req.params.categorySlug
      .split("-")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");

    // Case-insensitive search
    // This allows both "Foundations" and
    // "foundations" to be found.
    const products = await Product.find({
      category: {
        $regex: new RegExp(
          `^${categoryName}$`,
          "i"
        ),
      },
    });

    res.status(200).json(products);
  } catch (error) {
    console.error(
      "Error fetching category products:",
      error
    );

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ==========================================
// GET CATEGORY LIST
// ==========================================
// @route GET /api/products/categories/list
// ==========================================

const getCategoryList = async (req, res) => {
  try {
    const categories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: {
            $sum: 1,
          },
          image: {
            $first: "$image",
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    const formatted = categories.map(
      (category) => ({
        name: category._id,
        slug: category._id
          .toLowerCase()
          .replace(/\s+/g, "-"),
        count: category.count,
        image: category.image,
      })
    );

    res.status(200).json(formatted);
  } catch (error) {
    console.error(
      "Error fetching categories:",
      error
    );

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ==========================================
// CREATE PRODUCT
// ==========================================
// @route POST /api/products
// @access Admin
// ==========================================

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      brand,
      shade,
      image,
      countInStock,
    } = req.body;

    // Required fields check
    if (
      !name ||
      !description ||
      price === undefined ||
      !category ||
      !brand ||
      !image ||
      countInStock === undefined
    ) {
      return res.status(400).json({
        message:
          "Please provide all required product fields.",
      });
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),

      // Normalize category before saving
      // Example: "foundations" -> "Foundations"
      category: normalizeCategory(category),

      brand,
      shade: shade || "",
      image,
      countInStock: Number(countInStock),
    });

    res.status(201).json({
      message: "Product created successfully.",
      product,
    });
  } catch (error) {
    console.error(
      "Error creating product:",
      error
    );

    res.status(500).json({
      message:
        error.message ||
        "Failed to create product.",
    });
  }
};

// ==========================================
// UPDATE PRODUCT
// ==========================================
// @route PUT /api/products/:id
// @access Admin
// ==========================================

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    const {
      name,
      description,
      price,
      category,
      brand,
      shade,
      image,
      countInStock,
    } = req.body;

    // ==========================================
    // UPDATE FIELDS
    // ==========================================

    product.name =
      name !== undefined
        ? name
        : product.name;

    product.description =
      description !== undefined
        ? description
        : product.description;

    product.price =
      price !== undefined
        ? Number(price)
        : product.price;

    // Normalize category before saving
    product.category =
      category !== undefined
        ? normalizeCategory(category)
        : product.category;

    product.brand =
      brand !== undefined
        ? brand
        : product.brand;

    product.shade =
      shade !== undefined
        ? shade
        : product.shade;

    product.image =
      image !== undefined
        ? image
        : product.image;

    product.countInStock =
      countInStock !== undefined
        ? Number(countInStock)
        : product.countInStock;

    const updatedProduct =
      await product.save();

    res.status(200).json({
      message:
        "Product updated successfully.",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(
      "Error updating product:",
      error
    );

    res.status(500).json({
      message:
        error.message ||
        "Failed to update product.",
    });
  }
};

// ==========================================
// DELETE PRODUCT
// ==========================================
// @route DELETE /api/products/:id
// @access Admin
// ==========================================

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    await Product.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      message:
        "Product deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Error deleting product:",
      error
    );

    res.status(500).json({
      message:
        error.message ||
        "Failed to delete product.",
    });
  }
};

// ==========================================
// SEED PRODUCTS
// ==========================================
// @route POST /api/products/seed
// ==========================================

const seedProducts = async (req, res) => {
  try {
    await Product.deleteMany({});

    const placeholderImg = (
      bg,
      text,
      label
    ) =>
      `https://placehold.co/400x400/${bg}/${text}?font=montserrat&text=${encodeURIComponent(
        label
      )}`;

    const sampleProducts = [
      {
        name:
          "Studio Fix Fluid Foundation",
        brand: "MAC",
        shade: "NC42",
        price: 4200,
        category: "Foundations",
        countInStock: 20,
        description:
          "Medium-to-full buildable coverage with a natural matte finish.",
        image: placeholderImg(
          "F7CAC9",
          "6B2C3E",
          "MAC"
        ),
      },

      {
        name:
          "Pro Filt'r Soft Matte Foundation",
        brand: "Fenty Beauty",
        shade: "310",
        price: 6800,
        category: "Foundations",
        countInStock: 15,
        description:
          "Long-wearing, sweat and humidity resistant soft matte foundation.",
        image: placeholderImg(
          "F7CAC9",
          "6B2C3E",
          "Fenty Beauty"
        ),
      },

      {
        name:
          "FauxFilter Foundation",
        brand: "Huda Beauty",
        shade: "Toffee",
        price: 6200,
        category: "Foundations",
        countInStock: 12,
        description:
          "Full coverage matte foundation with a soft-focus, poreless finish.",
        image: placeholderImg(
          "F7CAC9",
          "6B2C3E",
          "Huda Beauty"
        ),
      },

      {
        name:
          "Fit Me Matte + Poreless Foundation",
        brand: "Maybelline",
        shade: "128 Warm Nude",
        price: 1800,
        category: "Foundations",
        countInStock: 30,
        description:
          "Affordable everyday foundation that controls shine and blurs pores.",
        image: placeholderImg(
          "F7CAC9",
          "6B2C3E",
          "Maybelline"
        ),
      },

      {
        name:
          "Sheer Glow Foundation",
        brand: "NARS",
        shade: "Punjab",
        price: 7200,
        category: "Foundations",
        countInStock: 10,
        description:
          "Buildable, radiant coverage that looks like skin, not makeup.",
        image: placeholderImg(
          "F7CAC9",
          "6B2C3E",
          "NARS"
        ),
      },

      {
        name:
          "Infallible 24H Fresh Wear Foundation",
        brand: "L'Oreal Paris",
        shade: "Golden Beige",
        price: 2600,
        category: "Foundations",
        countInStock: 18,
        description:
          "Transfer-proof, up to 24-hour wear foundation.",
        image: placeholderImg(
          "F7CAC9",
          "6B2C3E",
          "L'Oreal"
        ),
      },
    ];

    const createdProducts =
      await Product.insertMany(
        sampleProducts
      );

    res.status(201).json({
      message:
        "Sample products added!",
      count: createdProducts.length,
    });
  } catch (error) {
    console.error(
      "Error seeding products:",
      error
    );

    res.status(500).json({
      message:
        "Error seeding products: " +
        error.message,
    });
  }
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  getProducts,
  getProductById,
  getProductsByCategory,
  getCategoryList,
  createProduct,
  updateProduct,
  deleteProduct,
  seedProducts,
};