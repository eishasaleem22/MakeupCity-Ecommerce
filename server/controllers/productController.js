const Product = require("../models/Product");

// @desc    Fetch all products
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Fetch products belonging to one category (via slug, e.g. "face-powders")
// @route   GET /api/products/category/:categorySlug
const getProductsByCategory = async (req, res) => {
  try {
    const categoryName = req.params.categorySlug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    const products = await Product.find({ category: categoryName });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get list of distinct categories with count + a sample image
// @route   GET /api/products/categories/list
const getCategoryList = async (req, res) => {
  try {
    const categories = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 }, image: { $first: "$image" } } },
      { $sort: { _id: 1 } },
    ]);

    const formatted = categories.map((c) => ({
      name: c._id,
      slug: c._id.toLowerCase().replace(/\s+/g, "-"),
      count: c.count,
      image: c.image,
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Add full makeup catalog (7 categories)
// @route   POST /api/products/seed
const seedProducts = async (req, res) => {
  try {
    await Product.deleteMany({}); // Purana data saaf karne ke liye

    const placeholderImg = (bg, text, label) =>
      `https://placehold.co/400x400/${bg}/${text}?font=montserrat&text=${encodeURIComponent(label)}`;

    const sampleProducts = [
      // ---------- FOUNDATIONS ----------
      { name: "Studio Fix Fluid Foundation", brand: "MAC", shade: "NC42", price: 4200, category: "Foundations", countInStock: 20, description: "Medium-to-full buildable coverage with a natural matte finish.", image: placeholderImg("F7CAC9", "6B2C3E", "MAC") },
      { name: "Pro Filt'r Soft Matte Foundation", brand: "Fenty Beauty", shade: "310", price: 6800, category: "Foundations", countInStock: 15, description: "Long-wearing, sweat and humidity resistant soft matte foundation.", image: placeholderImg("F7CAC9", "6B2C3E", "Fenty Beauty") },
      { name: "FauxFilter Foundation", brand: "Huda Beauty", shade: "Toffee", price: 6200, category: "Foundations", countInStock: 12, description: "Full coverage matte foundation with a soft-focus, poreless finish.", image: placeholderImg("F7CAC9", "6B2C3E", "Huda Beauty") },
      { name: "Fit Me Matte + Poreless Foundation", brand: "Maybelline", shade: "128 Warm Nude", price: 1800, category: "Foundations", countInStock: 30, description: "Affordable everyday foundation that controls shine and blurs pores.", image: placeholderImg("F7CAC9", "6B2C3E", "Maybelline") },
      { name: "Sheer Glow Foundation", brand: "NARS", shade: "Punjab", price: 7200, category: "Foundations", countInStock: 10, description: "Buildable, radiant coverage that looks like skin, not makeup.", image: placeholderImg("F7CAC9", "6B2C3E", "NARS") },
      { name: "Infallible 24H Fresh Wear Foundation", brand: "L'Oreal Paris", shade: "Golden Beige", price: 2600, category: "Foundations", countInStock: 18, description: "Transfer-proof, up to 24-hour wear foundation.", image: placeholderImg("F7CAC9", "6B2C3E", "L'Oreal") },

      // ---------- CONCEALERS ----------
      { name: "Radiant Creamy Concealer", brand: "NARS", shade: "Custard", price: 5200, category: "Concealers", countInStock: 14, description: "Creamy, radiance-boosting concealer for under-eyes and blemishes.", image: placeholderImg("FADADD", "7A1E3D", "NARS") },
      { name: "Instant Age Rewind Concealer", brand: "Maybelline", shade: "Warm Light", price: 1400, category: "Concealers", countInStock: 25, description: "Erases dark circles instantly with a hydrating triple-action formula.", image: placeholderImg("FADADD", "7A1E3D", "Maybelline") },
      { name: "Pro Filt'r Concealer", brand: "Fenty Beauty", shade: "310", price: 4800, category: "Concealers", countInStock: 16, description: "Full coverage, long-wearing concealer that stays crease-free.", image: placeholderImg("FADADD", "7A1E3D", "Fenty Beauty") },
      { name: "Faux Filter Concealer", brand: "Huda Beauty", shade: "Toffee", price: 4600, category: "Concealers", countInStock: 13, description: "Buildable medium-to-full coverage with a natural matte finish.", image: placeholderImg("FADADD", "7A1E3D", "Huda Beauty") },
      { name: "Shape Tape Concealer", brand: "Tarte", shade: "Light Medium", price: 5600, category: "Concealers", countInStock: 11, description: "Cult-favorite full coverage concealer with a natural finish.", image: placeholderImg("FADADD", "7A1E3D", "Tarte") },
      { name: "Studio Finish Concealer", brand: "MAC", shade: "NC35", price: 3600, category: "Concealers", countInStock: 17, description: "High coverage concealer for spot concealing and correcting.", image: placeholderImg("FADADD", "7A1E3D", "MAC") },

      // ---------- FACE POWDERS ----------
      { name: "Studio Fix Powder Plus Foundation", brand: "MAC", shade: "NC42", price: 4400, category: "Face Powders", countInStock: 15, description: "Pressed powder and foundation in one for a flawless matte finish.", image: placeholderImg("FDE2E4", "8E2A45", "MAC") },
      { name: "Fit Me Loose Finishing Powder", brand: "Maybelline", shade: "Translucent", price: 1600, category: "Face Powders", countInStock: 28, description: "Lightweight loose powder that sets makeup without caking.", image: placeholderImg("FDE2E4", "8E2A45", "Maybelline") },
      { name: "Easy Bake Loose Baking & Setting Powder", brand: "Huda Beauty", shade: "Sugar Cookie", price: 5200, category: "Face Powders", countInStock: 10, description: "Ultra-fine loose powder for baking and setting makeup.", image: placeholderImg("FDE2E4", "8E2A45", "Huda Beauty") },
      { name: "Translucent Loose Setting Powder", brand: "Laura Mercier", shade: "Translucent", price: 6000, category: "Face Powders", countInStock: 9, description: "Iconic setting powder for a soft-focus, blurred finish.", image: placeholderImg("FDE2E4", "8E2A45", "Laura Mercier") },
      { name: "Banana Powder", brand: "essence", shade: "Yellow", price: 900, category: "Face Powders", countInStock: 32, description: "Affordable color-correcting loose powder to banish dark circles.", image: placeholderImg("FDE2E4", "8E2A45", "essence") },
      { name: "Can't Stop Won't Stop Setting Powder", brand: "NYX", shade: "Light", price: 2200, category: "Face Powders", countInStock: 20, description: "24-hour setting powder for a smooth, poreless look.", image: placeholderImg("FDE2E4", "8E2A45", "NYX") },

      // ---------- EYESHADOW PALETTES ----------
      { name: "Rose Gold Eyeshadow Palette", brand: "Huda Beauty", shade: "18 shades", price: 7800, category: "Eyeshadow Palettes", countInStock: 12, description: "Rich matte and shimmer shades in warm rose gold tones.", image: placeholderImg("E0BBE4", "4A235A", "Huda Beauty") },
      { name: "Naked3 Eyeshadow Palette", brand: "Urban Decay", shade: "12 shades", price: 8200, category: "Eyeshadow Palettes", countInStock: 8, description: "Rosy neutral shades with a mix of mattes and shimmers.", image: placeholderImg("E0BBE4", "4A235A", "Urban Decay") },
      { name: "Soft Glam Eyeshadow Palette", brand: "Anastasia Beverly Hills", shade: "14 shades", price: 7600, category: "Eyeshadow Palettes", countInStock: 10, description: "Everyday neutrals with a few pops of shimmer.", image: placeholderImg("E0BBE4", "4A235A", "ABH") },
      { name: "Ultimate Shadow Palette", brand: "NYX", shade: "Warm Neutrals, 16 shades", price: 2800, category: "Eyeshadow Palettes", countInStock: 22, description: "Affordable, highly blendable warm-toned shadow palette.", image: placeholderImg("E0BBE4", "4A235A", "NYX") },
      { name: "Chocolate Bar Eyeshadow Palette", brand: "Too Faced", shade: "16 shades", price: 6800, category: "Eyeshadow Palettes", countInStock: 11, description: "Cocoa-infused shadows in a range of chocolate-inspired shades.", image: placeholderImg("E0BBE4", "4A235A", "Too Faced") },
      { name: "35O Nature Glow Palette", brand: "Morphe", shade: "35 shades", price: 3200, category: "Eyeshadow Palettes", countInStock: 18, description: "Warm-toned everyday palette with mattes and metallics.", image: placeholderImg("E0BBE4", "4A235A", "Morphe") },

      // ---------- LIPSTICKS ----------
      { name: "Retro Matte Lipstick", brand: "MAC", shade: "Ruby Woo", price: 3200, category: "Lipsticks", countInStock: 25, description: "Iconic blue-red matte lipstick with intense pigment.", image: placeholderImg("FF8FA3", "6E0D25", "MAC") },
      { name: "Stunna Lip Paint", brand: "Fenty Beauty", shade: "Uncensored", price: 4600, category: "Lipsticks", countInStock: 14, description: "Universal red liquid lipstick with a long-wearing matte finish.", image: placeholderImg("FF8FA3", "6E0D25", "Fenty Beauty") },
      { name: "Power Bullet Matte Lipstick", brand: "Huda Beauty", shade: "Trendsetter", price: 4200, category: "Lipsticks", countInStock: 16, description: "Full coverage matte lipstick with a comfortable, creamy feel.", image: placeholderImg("FF8FA3", "6E0D25", "Huda Beauty") },
      { name: "SuperStay Matte Ink", brand: "Maybelline", shade: "Pioneer", price: 1600, category: "Lipsticks", countInStock: 30, description: "Up to 16-hour wear liquid lipstick that doesn't budge.", image: placeholderImg("FF8FA3", "6E0D25", "Maybelline") },
      { name: "Matte Revolution Lipstick", brand: "Charlotte Tilbury", shade: "Pillow Talk", price: 5800, category: "Lipsticks", countInStock: 9, description: "Best-selling nude-pink matte lipstick, universally flattering.", image: placeholderImg("FF8FA3", "6E0D25", "Charlotte Tilbury") },
      { name: "Soft Matte Lip Cream", brand: "NYX", shade: "Copenhagen", price: 1200, category: "Lipsticks", countInStock: 28, description: "Lightweight, velvety matte lip cream in a rosy mauve shade.", image: placeholderImg("FF8FA3", "6E0D25", "NYX") },

      // ---------- MASCARAS ----------
      { name: "Lash Sensational Mascara", brand: "Maybelline", shade: "Blackest Black", price: 1500, category: "Mascaras", countInStock: 26, description: "Fanning brush mascara for full, fanned-out lashes.", image: placeholderImg("D6CADD", "3D2C4E", "Maybelline") },
      { name: "Better Than Sex Mascara", brand: "Too Faced", shade: "Black", price: 4400, category: "Mascaras", countInStock: 13, description: "Volumizing, lengthening mascara with a collagen-infused formula.", image: placeholderImg("D6CADD", "3D2C4E", "Too Faced") },
      { name: "They're Real Mascara", brand: "Benefit", shade: "Black", price: 4800, category: "Mascaras", countInStock: 12, description: "Lengthens, curls, volumizes and separates every lash.", image: placeholderImg("D6CADD", "3D2C4E", "Benefit") },
      { name: "Voluminous Lash Paradise Mascara", brand: "L'Oreal Paris", shade: "Black", price: 1900, category: "Mascaras", countInStock: 22, description: "Soft, feathery brush for buildable volume and length.", image: placeholderImg("D6CADD", "3D2C4E", "L'Oreal") },
      { name: "Legit Lashes Mascara", brand: "Huda Beauty", shade: "Black", price: 3600, category: "Mascaras", countInStock: 10, description: "Buildable volume and curl that lasts all day.", image: placeholderImg("D6CADD", "3D2C4E", "Huda Beauty") },
      { name: "Lash Princess Mascara", brand: "essence", shade: "Black", price: 700, category: "Mascaras", countInStock: 35, description: "Affordable cult-favorite for dramatic volume and length.", image: placeholderImg("D6CADD", "3D2C4E", "essence") },

      // ---------- EYELINERS ----------
      { name: "Kohl Kajal Eyeliner", brand: "Huda Beauty", shade: "Blackout", price: 2200, category: "Eyeliners", countInStock: 18, description: "Ultra-pigmented, smudge-proof kajal for a smoky look.", image: placeholderImg("C9ADA7", "4A3F35", "Huda Beauty") },
      { name: "Colossal Kajal", brand: "Maybelline", shade: "Black", price: 500, category: "Eyeliners", countInStock: 40, description: "Long-lasting, smudge-proof everyday kajal.", image: placeholderImg("C9ADA7", "4A3F35", "Maybelline") },
      { name: "Epic Ink Liner", brand: "NYX", shade: "Black", price: 1800, category: "Eyeliners", countInStock: 24, description: "Ultra-fine felt tip liquid liner for precise lines.", image: placeholderImg("C9ADA7", "4A3F35", "NYX") },
      { name: "Stay All Day Liquid Eyeliner", brand: "Stila", shade: "Intense Black", price: 3400, category: "Eyeliners", countInStock: 12, description: "Waterproof, smudge-proof liquid liner with a fine tip.", image: placeholderImg("C9ADA7", "4A3F35", "Stila") },
      { name: "Scandaleyes Waterproof Kohl Liner", brand: "Rimmel", shade: "Black", price: 900, category: "Eyeliners", countInStock: 26, description: "Soft, waterproof kohl liner that glides on smoothly.", image: placeholderImg("C9ADA7", "4A3F35", "Rimmel") },
      { name: "Precision Liquid Eyeliner", brand: "e.l.f.", shade: "Black", price: 1200, category: "Eyeliners", countInStock: 20, description: "Budget-friendly precise liquid liner with a flexible tip.", image: placeholderImg("C9ADA7", "4A3F35", "e.l.f.") },
    ];

    const createdProducts = await Product.insertMany(sampleProducts);
    res.status(201).json({ message: "Sample products added!", count: createdProducts.length });
  } catch (error) {
    res.status(500).json({ message: "Error seeding products: " + error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductsByCategory,
  getCategoryList,
  seedProducts,
};