import { useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Favorites() {
  const { favorites, removeFavorite } = useFavorites();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const navigate = useNavigate();

  if (!user) {
    return (
      <main style={styles.centerMessage}>
        <h2>Login to view your favourites ❤️</h2>

        <button
          onClick={() => navigate("/login")}
          style={styles.loginButton}
        >
          Login
        </button>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>
        My Favourites ❤️
      </h1>

      {favorites.length === 0 ? (
        <div style={styles.emptyContainer}>
          <h2>No favourite products yet.</h2>

          <p>
            Click the Favourite button on a product to save it here.
          </p>

          <button
            onClick={() => navigate("/")}
            style={styles.shopButton}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {favorites.map((product) => (
            <div
              key={product._id}
              className="product-card-hover"
              style={styles.card}
              onClick={() =>
                navigate(`/product/${product._id}`)
              }
            >
              <img
                src={product.image}
                alt={product.name}
                style={styles.image}
              />

              <h3 style={styles.productName}>
                {product.name}
              </h3>

              <p style={styles.brand}>
                {product.brand}
              </p>

              {product.shade && (
                <p style={styles.shade}>
                  Shade: {product.shade}
                </p>
              )}

              <div style={styles.bottomRow}>
                <span style={styles.price}>
                  Rs. {product.price}
                </span>

                <button
                  className="add-cart-hover"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                  style={styles.cartButton}
                >
                  Add to Cart
                </button>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFavorite(product._id);
                }}
                style={styles.removeButton}
              >
                ♥ Remove from Favourites
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

const styles = {
  page: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 20px 60px",
  },

  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: "35px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "25px",
  },

  card: {
    border: "1px solid #eee",
    borderRadius: "12px",
    padding: "15px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
    cursor: "pointer",
  },

  image: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    borderRadius: "8px",
  },

  productName: {
    fontSize: "16px",
    margin: "12px 0 5px",
  },

  brand: {
    color: "#888",
    fontSize: "13px",
    marginBottom: "5px",
  },

  shade: {
    color: "#888",
    fontSize: "13px",
    marginBottom: "10px",
  },

  bottomRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
  },

  price: {
    fontWeight: "bold",
    color: "#d81b60",
    fontSize: "18px",
  },

  cartButton: {
    backgroundColor: "#d81b60",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },

  removeButton: {
    width: "100%",
    marginTop: "12px",
    padding: "9px",
    border: "1px solid #d81b60",
    backgroundColor: "#fff",
    color: "#d81b60",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },

  emptyContainer: {
    textAlign: "center",
    padding: "80px 20px",
    color: "#777",
  },

  shopButton: {
    marginTop: "20px",
    padding: "12px 25px",
    backgroundColor: "#d81b60",
    color: "#fff",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600",
  },

  centerMessage: {
    textAlign: "center",
    padding: "100px 20px",
  },

  loginButton: {
    marginTop: "20px",
    padding: "12px 25px",
    backgroundColor: "#d81b60",
    color: "#fff",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default Favorites;