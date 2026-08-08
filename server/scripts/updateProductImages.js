// server/scripts/updateProductImages.js
//
// Run this from your server folder with:  node scripts/updateProductImages.js
// Make sure your server/.env has MONGO_URI set, and that dotenv is installed.
//
// What it does:
// 1. Connects to your MongoDB
// 2. Fetches every product
// 3. Builds a filename from brand + name (e.g. "MAC Studio Fix Fluid Foundation" -> "mac-studio-fix-fluid-foundation.jpg")
// 4. Sets product.image = "/images/products/<filename>.jpg"
// 5. Saves the update
//
// Before running this: make sure your images are already placed in
// client/public/images/products/  using the exact filenames printed below.
 
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
 
// Adjust this path if your .env is not one level up from /scripts
dotenv.config({ path: path.join(__dirname, "..", ".env") });
 
const Product = require("../models/Product");
 
function slugify(brand, name) {
  return `${brand}-${name}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
 
async function run() {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI not found. Check your .env path/config.");
    process.exit(1);
  }
 
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");
 
  const products = await Product.find({});
  console.log(`Found ${products.length} products`);
 
  let updated = 0;
 
  for (const product of products) {
    const filename = slugify(product.brand, product.name) + ".jpg";
    const newImagePath = `/images/products/${filename}`;
 
    if (product.image !== newImagePath) {
      product.image = newImagePath;
      await product.save();
      updated++;
      console.log(`Updated: ${product.brand} ${product.name} -> ${newImagePath}`);
    }
  }
 
  console.log(`\nDone. ${updated} product(s) updated out of ${products.length}.`);
  await mongoose.disconnect();
  process.exit(0);
}
 
run().catch((err) => {
  console.error("Error running script:", err);
  process.exit(1);
});