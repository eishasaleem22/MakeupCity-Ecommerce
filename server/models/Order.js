const mongoose = require("mongoose");

// ==========================================
// ORDER ITEM SCHEMA
// ==========================================

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: false,
    },

    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    qty: {
      type: Number,
      required: true,
      min: 1,
    },

    image: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

// ==========================================
// ORDER SCHEMA
// ==========================================

const orderSchema = new mongoose.Schema(
  {
    // ==========================================
    // CUSTOMER INFORMATION
    // ==========================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    province: {
      type: String,
      required: true,
    },

    postalCode: {
      type: String,
      default: "",
    },

    // ==========================================
    // ORDER ITEMS
    // ==========================================

    orderItems: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: function (items) {
          return items && items.length > 0;
        },
        message: "Order must contain at least one product.",
      },
    },

    // ==========================================
    // PAYMENT INFORMATION
    // ==========================================

    paymentMethod: {
      type: String,
      required: true,
      enum: [
        "Cash on Delivery",
        "Credit/Debit Card",
        "Bank Transfer",
      ],
    },

    // ==========================================
    // PRICE INFORMATION
    // ==========================================

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    // ==========================================
    // ORDER STATUS
    // ==========================================

    status: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);