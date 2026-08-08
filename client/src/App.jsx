import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";

import "./hover.css";

import { useCart } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CategoryProducts from "./pages/CategoryProducts";
import ProductDetails from "./pages/ProductDetails";
import Favorites from "./pages/Favorites";
import Checkout from "./pages/Checkout";
import AboutUs from "./pages/AboutUs";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // ==========================================
  // GLOBAL CART NOTIFICATION
  // ==========================================

  const [showCartNotification, setShowCartNotification] =
    useState(false);

  const {
    cart,
    addToCart,
    updateQty,
    removeFromCart,
  } = useCart();

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/products"
        );

        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error(
          "Error fetching products:",
          error
        );
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ==========================================
  // CART TOTAL
  // ==========================================

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  // ==========================================
  // GLOBAL ADD TO CART HANDLER
  // ==========================================

  const handleAddToCart = (product) => {
    addToCart(product);

    setShowCartNotification(true);

    setTimeout(() => {
      setShowCartNotification(false);
    }, 2500);
  };

  // ==========================================
  // FEATURED PRODUCTS
  // One product from each category
  // ==========================================

  const featuredProducts = [];

  products.forEach((product) => {
    if (
      !featuredProducts.some(
        (item) =>
          item.category === product.category
      )
    ) {
      featuredProducts.push(product);
    }
  });

  return (
    <>
      {/* ==========================================
          NAVBAR
      ========================================== */}

      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* ==========================================
          GLOBAL CART SUCCESS NOTIFICATION
      ========================================== */}

      {showCartNotification && (
        <div style={styles.cartNotification}>
          ✓ Product successfully added to the Cart.
        </div>
      )}

      <ScrollToTop />

      {/* ==========================================
          ROUTES
      ========================================== */}

      <Routes>

        {/* ================= HOME ================= */}

        <Route
          path="/"
          element={
            <>
              <Hero />

              <main
                id="products"
                style={{
                  maxWidth: "1200px",
                  margin: "0 auto",
                  padding: "0 20px",
                }}
              >
                <h2
                  style={{
                    fontSize: "28px",
                    color: "#333",
                    marginBottom: "20px",
                    textAlign: "center",
                  }}
                >
                  Featured Products
                </h2>

                {loading ? (
                  <h3
                    style={{
                      textAlign: "center",
                      color: "#888",
                    }}
                  >
                    Loading products...
                  </h3>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(250px, 1fr))",
                      gap: "25px",
                    }}
                  >
                    {featuredProducts.map(
                      (product) => (
                        <div
                          key={product._id}
                          className="product-card-hover"
                          onClick={() =>
                            navigate(
                              `/product/${product._id}`
                            )
                          }
                          style={{
                            cursor: "pointer",
                          }}
                        >
                          {/* Product Image */}

                          <img
                            src={product.image}
                            alt={product.name}
                            className="product-image-hover"
                            style={{
                              width: "100%",
                              height: "200px",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />

                          {/* Product Name */}

                          <h3
                            style={{
                              fontSize: "16px",
                              margin:
                                "12px 0 5px 0",
                            }}
                          >
                            {product.name}
                          </h3>

                          {/* Category */}

                          <p
                            style={{
                              color: "#888",
                              fontSize: "13px",
                              marginBottom: "12px",
                            }}
                          >
                            {product.category}
                          </p>

                          {/* Price + Add To Cart */}

                          <div
                            style={{
                              display: "flex",
                              justifyContent:
                                "space-between",
                              alignItems: "center",
                            }}
                          >
                            <span
                              style={{
                                fontWeight: "bold",
                                color: "#d81b60",
                                fontSize: "18px",
                              }}
                            >
                              Rs. {product.price}
                            </span>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();

                                handleAddToCart(
                                  product
                                );
                              }}
                              className="add-cart-hover"
                              style={{
                                backgroundColor:
                                  "#d81b60",
                                color: "#fff",
                                border: "none",
                                padding:
                                  "8px 14px",
                                borderRadius:
                                  "6px",
                                cursor: "pointer",
                                fontWeight: "600",
                              }}
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </main>
            </>
          }
        />

        {/* ================= ABOUT US ================= */}

        <Route
          path="/about"
          element={<AboutUs />}
        />

        {/* ================= LOGIN ================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* ================= SIGNUP ================= */}

        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* ================= CATEGORY PRODUCTS ================= */}

        <Route
          path="/category/:categorySlug"
          element={
            <CategoryProducts
              onAddToCart={handleAddToCart}
            />
          }
        />

        {/* ================= PRODUCT DETAILS ================= */}

        <Route
          path="/product/:id"
          element={
            <ProductDetails
              onAddToCart={handleAddToCart}
            />
          }
        />

        {/* ================= FAVORITES ================= */}

        <Route
          path="/favorites"
          element={<Favorites />}
        />

        {/* ================= CHECKOUT ================= */}

        <Route
          path="/checkout"
          element={<Checkout />}
        />

      </Routes>

      {/* ==========================================
          CART DRAWER
      ========================================== */}

      {isCartOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "350px",
            height: "100vh",
            backgroundColor: "#fff",
            boxShadow:
              "-4px 0 15px rgba(0,0,0,0.15)",
            zIndex: 200,
            padding: "20px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Cart Header */}

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              borderBottom:
                "1px solid #eee",
              paddingBottom: "10px",
            }}
          >
            <h3
              style={{
                color: "#d81b60",
              }}
            >
              Your Cart
            </h3>

            <button
              onClick={() =>
                setIsCartOpen(false)
              }
              style={{
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              ✖
            </button>
          </div>

          {/* Cart Items */}

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              marginTop: "15px",
            }}
          >
            {cart.length === 0 ? (
              <p
                style={{
                  textAlign: "center",
                  color: "#888",
                  marginTop: "40px",
                }}
              >
                Your cart is empty!
              </p>
            ) : (
              cart.map((item) => (
                <div
                  key={item._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                      "space-between",
                    marginBottom: "15px",
                    borderBottom:
                      "1px solid #f0f0f0",
                    paddingBottom: "10px",
                  }}
                >
                  <div>
                    <h4
                      style={{
                        margin:
                          "0 0 5px 0",
                        fontSize: "14px",
                      }}
                    >
                      {item.name}
                    </h4>

                    <span
                      style={{
                        color: "#d81b60",
                        fontWeight: "bold",
                      }}
                    >
                      Rs. {item.price}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems:
                        "center",
                      gap: "8px",
                    }}
                  >
                    <button
                      onClick={() =>
                        updateQty(
                          item._id,
                          -1
                        )
                      }
                      style={{
                        padding:
                          "2px 8px",
                      }}
                    >
                      -
                    </button>

                    <span>{item.qty}</span>

                    <button
                      onClick={() =>
                        updateQty(
                          item._id,
                          1
                        )
                      }
                      style={{
                        padding:
                          "2px 8px",
                      }}
                    >
                      +
                    </button>

                    <button
                      onClick={() =>
                        removeFromCart(
                          item._id
                        )
                      }
                      style={{
                        color: "red",
                        border: "none",
                        background:
                          "none",
                        cursor: "pointer",
                        marginLeft: "5px",
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Total */}

          {cart.length > 0 && (
            <div
              style={{
                borderTop:
                  "2px solid #eee",
                paddingTop: "15px",
                flexShrink: 0,
                backgroundColor: "#fff",
              }}
            >
              <h3>
                Total:{" "}
                <span
                  style={{
                    color: "#d81b60",
                  }}
                >
                  Rs. {totalPrice}
                </span>
              </h3>

              <button
                onClick={() => {
                  if (cart.length === 0) {
                    alert("Cart is Empty");
                    return;
                  }

                  setIsCartOpen(false);
                  navigate("/checkout");
                }}
                style={{
                  width: "100%",
                  backgroundColor: "#2e7d32",
                  color: "#fff",
                  border: "none",
                  padding: "12px",
                  borderRadius: "6px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
                className="checkout-button-hover"
              >
                Checkout Now
              </button>
            </div>
          )}
        </div>
      )}

      <Footer />
    </>
  );
}

const styles = {
  cartNotification: {
    position: "fixed",
    top: "90px",
    right: "30px",
    backgroundColor: "#eb8fb0",
    color: "#fff",
    padding: "14px 22px",
    borderRadius: "8px",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.2)",
    fontSize: "14px",
    fontWeight: "600",
    zIndex: 2000,
  },
};

export default App;