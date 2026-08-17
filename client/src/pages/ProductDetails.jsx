import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useFavorites } from "../context/FavoritesContext";

function ProductDetails({ onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    toggleFavorite,
    isFavorite,
  } = useFavorites();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Zoom states
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `http://makeup-city-backend.vercel.app/api/products/${id}`
        );

        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div style={styles.centerMessage}>
        <h3>Loading product...</h3>
      </div>
    );
  }

  // =========================
  // Product not found
  // =========================

  if (!product) {
    return (
      <div style={styles.centerMessage}>
        <h3>Product not found.</h3>

        <button
          onClick={() => navigate(-1)}
          style={styles.backButton}
          className="product-back-hover"
        >
          Go Back
        </button>
      </div>
    );
  }

  // =========================
  // Favourite Status
  // =========================

  const productIsFavorite = isFavorite(product._id);

  // =========================
  // Add To Cart
  // =========================

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  // =========================
  // Buy Now
  // =========================

  const handleBuyNow = () => {
  if (product.countInStock === 0) {
    return;
  }

      navigate("/checkout", {
        state: {
          buyNowProduct: {
            ...product,
            qty: 1,
          },
        },
      });
    };

  // =========================
  // Favourite
  // =========================

  const handleFavorite = () => {
    const result = toggleFavorite(product);

    if (result === false) {
      navigate("/login");
    }
  };

  // =========================
  // Zoom
  // =========================

  const handleOpenZoom = () => {
    setZoomLevel(1);
    setIsZoomOpen(true);
  };

  const handleCloseZoom = () => {
    setIsZoomOpen(false);
    setZoomLevel(1);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) =>
      Math.min(prev + 0.25, 3)
    );
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) =>
      Math.max(prev - 0.25, 1)
    );
  };

  return (
    <>
      {/* ========================= */}
      {/* PRODUCT PAGE */}
      {/* ========================= */}

      <main style={styles.page}>

        {/* Back Button */}

        <button
          onClick={() => navigate(-1)}
          style={styles.backButton}
          className="product-back-hover"
        >
          ← Back
        </button>

        <div style={styles.productContainer}>

          {/* ========================= */}
          {/* IMAGE SECTION */}
          {/* ========================= */}

          <div style={styles.imageSection}>

            <div style={styles.imageWrapper}>

              <img
                src={product.image}
                alt={product.name}
                style={styles.productImage}
              />

              {/* Magnifying Glass */}

              <button
                onClick={handleOpenZoom}
                style={styles.zoomButton}
                className="zoom-button-hover"
                title="Zoom image"
              >
                <span
                  style={{
                    color: "#777",
                    fontSize: "18px",
                  }}
                >
                  🔍
                </span>
              </button>

            </div>

          </div>

          {/* ========================= */}
          {/* PRODUCT INFORMATION */}
          {/* ========================= */}

          <div style={styles.infoSection}>

            {/* Brand */}

            <p style={styles.brand}>
              {product.brand}
            </p>

            {/* Product Name */}

            <h1 style={styles.productName}>
              {product.name}
            </h1>

            {/* Price */}

            <p style={styles.price}>
              Rs. {product.price}
            </p>

            {/* Shade */}

            {product.shade && (
              <p style={styles.shade}>
                <strong>Shade:</strong>{" "}
                {product.shade}
              </p>
            )}

            <div style={styles.divider}></div>

            {/* Description */}

            <h3 style={styles.descriptionTitle}>
              Description
            </h3>

            <p style={styles.description}>
              {product.description}
            </p>

            {/* Stock */}

            <p
              style={{
                ...styles.stock,
                color:
                  product.countInStock > 0
                    ? "#2e7d32"
                    : "#d32f2f",
              }}
            >
              {product.countInStock > 0
                ? `✓ In Stock (${product.countInStock} available)`
                : "Out of Stock"}
            </p>

            {/* ========================= */}
            {/* FAVOURITE */}
            {/* ========================= */}

            <button
              onClick={handleFavorite}
              style={{
                ...styles.favouriteButton,
                ...(productIsFavorite
                  ? styles.favouriteActive
                  : {}),
              }}
              className="product-favourite-btn"
            >
              {productIsFavorite ? "♥" : "♡"}{" "}
              {productIsFavorite
                ? "Remove from Favourite"
                : "Favourite"}
            </button>

            {/* ========================= */}
            {/* ADD TO CART */}
            {/* ========================= */}

            <button
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
              style={{
                ...styles.addToCartButton,
                ...(product.countInStock === 0
                  ? styles.disabledButton
                  : {}),
              }}
              className="product-cart-btn"
            >
              Add to Cart
            </button>

            {/* ========================= */}
            {/* BUY NOW */}
            {/* ========================= */}

            <button
              onClick={handleBuyNow}
              disabled={product.countInStock === 0}
              style={{
                ...styles.buyNowButton,
                ...(product.countInStock === 0
                  ? styles.disabledButton
                  : {}),
              }}
              className="product-buy-btn"
            >
              Buy It Now
            </button>

          </div>
        </div>
      </main>

      {/* ========================= */}
      {/* IMAGE ZOOM MODAL */}
      {/* ========================= */}

      {isZoomOpen && (
        <div
          style={styles.zoomOverlay}
          onClick={handleCloseZoom}
        >

          <div
            style={styles.zoomContainer}
            onClick={(e) => e.stopPropagation()}
          >

            {/* Close */}

            <button
              onClick={handleCloseZoom}
              style={styles.closeZoomButton}
              className="zoom-control-hover"
              title="Close"
            >
              ✕
            </button>

            {/* Zoomed Image */}

            <div style={styles.zoomImageContainer}>

              <img
                src={product.image}
                alt={product.name}
                style={{
                  ...styles.zoomImage,
                  transform: `scale(${zoomLevel})`,
                }}
              />

            </div>

            {/* Zoom Controls */}

            <div style={styles.zoomControls}>

              <button
                onClick={handleZoomOut}
                disabled={zoomLevel === 1}
                style={styles.zoomControlButton}
                className="zoom-control-hover"
                title="Zoom out"
              >
                −
              </button>

              <span style={styles.zoomLevelText}>
                {Math.round(zoomLevel * 100)}%
              </span>

              <button
                onClick={handleZoomIn}
                disabled={zoomLevel === 3}
                style={styles.zoomControlButton}
                className="zoom-control-hover"
                title="Zoom in"
              >
                +
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
}

const styles = {

  // =========================
  // Page
  // =========================

  page: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "35px 20px 60px",
  },

  backButton: {
    background: "none",
    border: "none",
    color: "#d81b60",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginBottom: "25px",
    padding: "5px 0",
  },

  productContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "60px",
    alignItems: "start",
  },

  // =========================
  // Image
  // =========================

  imageSection: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: "15px",
    padding: "30px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
  },

  imageWrapper: {
    position: "relative",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  productImage: {
    width: "100%",
    maxWidth: "500px",
    height: "500px",
    objectFit: "contain",
    borderRadius: "12px",
  },

  zoomButton: {
    position: "absolute",
    right: "10px",
    bottom: "10px",
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    fontSize: "20px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  // =========================
  // Product Info
  // =========================

  infoSection: {
    padding: "10px 0",
  },

  brand: {
    color: "#888",
    fontSize: "15px",
    fontWeight: "600",
    marginBottom: "8px",
  },

  productName: {
    fontSize: "32px",
    color: "#333",
    margin: "0 0 15px",
    lineHeight: "1.2",
  },

  price: {
    color: "#d81b60",
    fontSize: "26px",
    fontWeight: "bold",
    marginBottom: "15px",
  },

  shade: {
    color: "#555",
    fontSize: "15px",
    marginBottom: "20px",
  },

  divider: {
    height: "1px",
    backgroundColor: "#eee",
    margin: "20px 0",
  },

  descriptionTitle: {
    color: "#333",
    marginBottom: "8px",
  },

  description: {
    color: "#666",
    lineHeight: "1.7",
    fontSize: "15px",
    marginBottom: "20px",
  },

  stock: {
    fontWeight: "600",
    marginBottom: "25px",
  },

  // =========================
  // Buttons
  // =========================

  favouriteButton: {
    width: "100%",
    padding: "13px",
    border: "1px solid #d81b60",
    backgroundColor: "#fff",
    color: "#d81b60",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
    marginBottom: "12px",
  },

  favouriteActive: {
    backgroundColor: "#fce4ec",
  },

  addToCartButton: {
    width: "100%",
    padding: "14px",
    border: "none",
    backgroundColor: "#d81b60",
    color: "#fff",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "12px",
  },

  buyNowButton: {
    width: "100%",
    padding: "14px",
    border: "none",
    backgroundColor: "#333",
    color: "#fff",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },

  disabledButton: {
    opacity: 0.5,
    cursor: "not-allowed",
  },

  // =========================
  // Messages
  // =========================

  centerMessage: {
    textAlign: "center",
    padding: "100px 20px",
  },

  // =========================
  // Zoom Modal
  // =========================

  zoomOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  zoomContainer: {
    position: "relative",
    width: "80%",
    maxWidth: "900px",
    height: "80%",
    backgroundColor: "#fff",
    borderRadius: "15px",
    padding: "25px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
  },

  zoomImageContainer: {
    width: "100%",
    height: "90%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  zoomImage: {
    maxWidth: "90%",
    maxHeight: "90%",
    objectFit: "contain",
    transition: "transform 0.25s ease",
  },

  closeZoomButton: {
    position: "absolute",
    top: "15px",
    right: "15px",
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    color: "#555",
    fontSize: "18px",
    cursor: "pointer",
    zIndex: 2,
  },

  zoomControls: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginTop: "10px",
  },

  zoomControlButton: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    border: "1px solid #d81b60",
    backgroundColor: "#fff",
    color: "#d81b60",
    fontSize: "24px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  zoomLevelText: {
    minWidth: "55px",
    textAlign: "center",
    color: "#555",
    fontWeight: "600",
  },
};

export default ProductDetails;