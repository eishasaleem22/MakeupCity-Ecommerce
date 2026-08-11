const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// =====================================================
// LOAD ENVIRONMENT VARIABLES FIRST
// =====================================================

dotenv.config();

// =====================================================
// DATABASE
// =====================================================

const connectDB = require("./config/db");

// =====================================================
// ROUTES
// =====================================================

const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");

// =====================================================
// CONNECT DATABASE
// =====================================================

connectDB();

// =====================================================
// CREATE EXPRESS APP
// =====================================================

const app = express();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());
app.use(express.json());

// =====================================================
// API ROUTES
// =====================================================

app.use("/api/products", productRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/users", userRoutes);

// =====================================================
// ROOT ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.send("MakeupCity API is running smoothly...");
});

// =====================================================
// SERVER
// =====================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});