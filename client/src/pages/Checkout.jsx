import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const { cart, clearCart } = useCart();

  // =====================================================
  // BUY NOW PRODUCT
  // =====================================================
  // If the user came from Product Details by clicking
  // "Buy It Now", the product will be available here.
  //
  // Normal cart checkout will have no buyNowProduct.
  // =====================================================

  const buyNowProduct = location.state?.buyNowProduct || null;

  // =====================================================
  // DETERMINE PRODUCTS TO CHECKOUT
  // =====================================================
  //
  // Buy Now:
  //     checkout only the selected product
  //
  // Normal Checkout:
  //     checkout the entire cart
  //
  // =====================================================

  const checkoutItems = buyNowProduct
    ? [buyNowProduct]
    : cart;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    paymentMethod: "Cash on Delivery",
  });

  const [orderPlaced, setOrderPlaced] = useState(false);

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  // =====================================================
  // TOTAL PRICE
  // =====================================================

  const totalPrice = checkoutItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  // =====================================================
  // HANDLE INPUT CHANGES
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove previous error when user changes a field
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  // =====================================================
  // PLACE ORDER
  // =====================================================

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // =====================================================
    // SAFETY CHECK
    // =====================================================

    if (checkoutItems.length === 0) {
      alert("Cart is Empty");
      return;
    }

    // Prevent duplicate submissions
    if (isPlacingOrder) {
      return;
    }

    setIsPlacingOrder(true);
    setErrorMessage("");

    try {
      // =====================================================
      // SEND ORDER TO BACKEND
      // =====================================================

      const response = await fetch(
        "http://localhost:5000/api/orders/send-confirmation",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            ...formData,

            // IMPORTANT:
            // Send only the products being checked out.
            cart: checkoutItems,

            totalPrice,
          }),
        }
      );

      const data = await response.json();

      // =====================================================
      // CHECK BACKEND RESPONSE
      // =====================================================

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to place the order. Please try again."
        );
      }

      // =====================================================
      // CLEAR CART
      // =====================================================
      //
      // For normal checkout:
      //     clear the cart because the entire cart was ordered.
      //
      // For Buy Now:
      //     DO NOT clear the cart because the Buy Now product
      //     was never added to it.
      //
      // =====================================================

      if (!buyNowProduct) {
        clearCart();
      }

      // Show success screen
      setOrderPlaced(true);
    } catch (error) {
      console.error("Error placing order:", error);

      setErrorMessage(
        error.message ||
          "Something went wrong while placing your order. Please try again."
      );
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // =====================================================
  // EMPTY CHECKOUT
  // =====================================================

  if (checkoutItems.length === 0 && !orderPlaced) {
    return (
      <main style={styles.page}>
        <div style={styles.emptyContainer}>
          <h1 style={styles.emptyTitle}>
            Cart is Empty
          </h1>

          <p style={styles.emptyText}>
            Please add some products to your cart
            before proceeding to checkout.
          </p>

          <button
            onClick={() => navigate("/")}
            style={styles.continueButton}
            className="checkout-button-hover"
          >
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  // =====================================================
  // ORDER SUCCESSFULLY PLACED
  // =====================================================

  if (orderPlaced) {
    return (
      <main style={styles.page}>
        <div style={styles.successContainer}>
          <div style={styles.successIcon}>
            ✓
          </div>

          <h1 style={styles.successTitle}>
            Order Placed Successfully!
          </h1>

          <p style={styles.successText}>
            Thank you for your order,{" "}
            {formData.fullName}.
          </p>

          <p style={styles.successText}>
            A confirmation email has been sent to:
          </p>

          <p style={styles.emailText}>
            {formData.email}
          </p>

          <p style={styles.successText}>
            Your order will be delivered to:
          </p>

          <p style={styles.addressText}>
            {formData.address},{" "}
            {formData.city},{" "}
            {formData.province}{" "}
            {formData.postalCode}
          </p>

          <button
            onClick={() => navigate("/")}
            style={styles.continueButton}
            className="checkout-button-hover"
          >
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>

        {/* =========================
            PAGE HEADER
        ========================= */}

        <button
          onClick={() => navigate(-1)}
          style={styles.backButton}
        >
          ← Back
        </button>

        <h1 style={styles.title}>
          Checkout
        </h1>

        <p style={styles.subtitle}>
          Complete your details to place your order.
        </p>

        <div style={styles.checkoutGrid}>

          {/* =========================
              CUSTOMER DETAILS
          ========================= */}

          <div style={styles.formSection}>
            <h2 style={styles.sectionTitle}>
              Delivery Information
            </h2>

            <form onSubmit={handlePlaceOrder}>

              {/* Full Name */}

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Full Name *
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  style={styles.input}
                />
              </div>

              {/* Email */}

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Email Address *
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  required
                  style={styles.input}
                />
              </div>

              {/* Phone */}

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Phone Number *
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="03XX-XXXXXXX"
                  required
                  style={styles.input}
                />
              </div>

              {/* Address */}

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Complete Delivery Address *
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House number, street, area..."
                  required
                  rows="4"
                  style={styles.textarea}
                />
              </div>

              {/* City */}

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  City *
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter your city"
                  required
                  style={styles.input}
                />
              </div>

              {/* Province */}

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Province *
                </label>

                <select
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  required
                  style={styles.input}
                >
                  <option value="">
                    Select Province
                  </option>

                  <option value="Punjab">
                    Punjab
                  </option>

                  <option value="Sindh">
                    Sindh
                  </option>

                  <option value="Khyber Pakhtunkhwa">
                    Khyber Pakhtunkhwa
                  </option>

                  <option value="Balochistan">
                    Balochistan
                  </option>

                  <option value="Islamabad Capital Territory">
                    Islamabad Capital Territory
                  </option>

                  <option value="Gilgit-Baltistan">
                    Gilgit-Baltistan
                  </option>

                  <option value="Azad Kashmir">
                    Azad Kashmir
                  </option>
                </select>
              </div>

              {/* Postal Code */}

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  Postal Code
                </label>

                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="e.g. 54000"
                  style={styles.input}
                />
              </div>

              {/* =========================
                  PAYMENT METHOD
              ========================= */}

              <h2
                style={{
                  ...styles.sectionTitle,
                  marginTop: "30px",
                }}
              >
                Payment Method
              </h2>

              <div style={styles.paymentOptions}>

                <label style={styles.paymentOption}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    checked={
                      formData.paymentMethod ===
                      "Cash on Delivery"
                    }
                    onChange={handleChange}
                  />

                  <span>
                    Cash on Delivery
                  </span>
                </label>

                <label style={styles.paymentOption}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Bank Transfer"
                    checked={
                      formData.paymentMethod ===
                      "Bank Transfer"
                    }
                    onChange={handleChange}
                  />

                  <span>
                    Bank Transfer
                  </span>
                </label>

              </div>

              {/* =========================
                  ERROR MESSAGE
              ========================= */}

              {errorMessage && (
                <div style={styles.errorMessage}>
                  {errorMessage}
                </div>
              )}

              {/* =========================
                  PLACE ORDER
              ========================= */}

              <button
                type="submit"
                style={{
                  ...styles.placeOrderButton,
                  ...(isPlacingOrder
                    ? styles.placeOrderButtonDisabled
                    : {}),
                }}
                className="checkout-button-hover"
                disabled={isPlacingOrder}
              >
                {isPlacingOrder
                  ? "Placing Order..."
                  : "Place Order"}
              </button>

            </form>
          </div>

          {/* =========================
              ORDER SUMMARY
          ========================= */}

          <div style={styles.summarySection}>
            <h2 style={styles.sectionTitle}>
              Order Summary
            </h2>

            <div style={styles.productsContainer}>

              {checkoutItems.map((item) => (
                <div
                  key={item._id}
                  style={styles.productItem}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={styles.productImage}
                  />

                  <div style={styles.productInfo}>
                    <h3 style={styles.productName}>
                      {item.name}
                    </h3>

                    <p style={styles.productQuantity}>
                      Quantity: {item.qty}
                    </p>

                    <p style={styles.productPrice}>
                      Rs.{" "}
                      {item.price * item.qty}
                    </p>
                  </div>
                </div>
              ))}

            </div>

            <div style={styles.divider}></div>

            <div style={styles.totalRow}>
              <span>
                Subtotal
              </span>

              <span>
                Rs. {totalPrice}
              </span>
            </div>

            <div style={styles.totalRow}>
              <span>
                Delivery
              </span>

              <span>
                FREE
              </span>
            </div>

            <div style={styles.divider}></div>

            <div style={styles.grandTotalRow}>
              <span>
                Total
              </span>

              <span>
                Rs. {totalPrice}
              </span>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}

const styles = {
  page: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 20px 70px",
  },

  container: {
    width: "100%",
  },

  backButton: {
    background: "none",
    border: "none",
    color: "#d81b60",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    padding: "5px 0",
    marginBottom: "20px",
  },

  title: {
    textAlign: "center",
    color: "#333",
    fontSize: "36px",
    marginBottom: "8px",
  },

  subtitle: {
    textAlign: "center",
    color: "#777",
    fontSize: "15px",
    marginBottom: "40px",
  },

  checkoutGrid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    gap: "35px",
    alignItems: "start",
  },

  formSection: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
  },

  summarySection: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
    position: "sticky",
    top: "20px",
  },

  sectionTitle: {
    color: "#333",
    fontSize: "22px",
    marginBottom: "25px",
  },

  inputGroup: {
    marginBottom: "18px",
  },

  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#444",
    marginBottom: "7px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    border: "1px solid #ddd",
    borderRadius: "7px",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "#fff",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    border: "1px solid #ddd",
    borderRadius: "7px",
    fontSize: "14px",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
  },

  paymentOptions: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "25px",
  },

  paymentOption: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px",
    border: "1px solid #eee",
    borderRadius: "7px",
    cursor: "pointer",
    color: "#444",
    fontSize: "14px",
  },

  placeOrderButton: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#d81b60",
    color: "#fff",
    border: "none",
    borderRadius: "7px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
  },

  placeOrderButtonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
  },

  errorMessage: {
    backgroundColor: "#ffebee",
    color: "#c62828",
    border: "1px solid #ffcdd2",
    borderRadius: "7px",
    padding: "12px 14px",
    fontSize: "14px",
    marginBottom: "15px",
  },

  productsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  productItem: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    paddingBottom: "15px",
    borderBottom: "1px solid #f2f2f2",
  },

  productImage: {
    width: "70px",
    height: "70px",
    objectFit: "cover",
    borderRadius: "8px",
  },

  productInfo: {
    flex: 1,
  },

  productName: {
    fontSize: "14px",
    color: "#333",
    margin: "0 0 5px",
  },

  productQuantity: {
    fontSize: "13px",
    color: "#888",
    margin: "0 0 5px",
  },

  productPrice: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#d81b60",
    margin: 0,
  },

  divider: {
    height: "1px",
    backgroundColor: "#eee",
    margin: "20px 0",
  },

  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    color: "#555",
    marginBottom: "12px",
  },

  grandTotalRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "20px",
    fontWeight: "bold",
    color: "#333",
  },

  emptyContainer: {
    textAlign: "center",
    padding: "100px 20px",
  },

  emptyTitle: {
    color: "#333",
    fontSize: "32px",
    marginBottom: "10px",
  },

  emptyText: {
    color: "#777",
    fontSize: "15px",
    marginBottom: "25px",
  },

  continueButton: {
    backgroundColor: "#d81b60",
    color: "#fff",
    border: "none",
    padding: "12px 25px",
    borderRadius: "7px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },

  successContainer: {
    textAlign: "center",
    padding: "100px 20px",
  },

  successIcon: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    backgroundColor: "#2e7d32",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
    fontSize: "35px",
    fontWeight: "bold",
  },

  successTitle: {
    color: "#333",
    fontSize: "30px",
    marginBottom: "15px",
  },

  successText: {
    color: "#666",
    fontSize: "15px",
    marginBottom: "8px",
  },

  emailText: {
    color: "#d81b60",
    fontWeight: "600",
    marginBottom: "20px",
  },

  addressText: {
    color: "#444",
    fontWeight: "600",
    marginBottom: "30px",
  },
};

export default Checkout;