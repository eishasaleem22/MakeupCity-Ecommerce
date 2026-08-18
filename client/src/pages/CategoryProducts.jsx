import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function CategoryProducts({ onAddToCart }) {
  const { categorySlug } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);

        const { data } = await axios.get(
          `http://localhost:5000/api/products/category/${categorySlug}`
        );

        setProducts(data);
      } catch (error) {
        console.error("Error fetching category products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categorySlug]);

  const categoryName = categorySlug
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");

  return (
    <main
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px 20px",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#333",
          marginBottom: "35px",
        }}
      >
        {categoryName}
      </h1>

      {loading ? (
        <h3
          style={{
            textAlign: "center",
            color: "#888",
          }}
        >
          Loading products...
        </h3>
      ) : products.length === 0 ? (
        <h3
          style={{
            textAlign: "center",
            color: "#888",
          }}
        >
          No products found in this category.
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
          {products.map((product) => (
            <div
              key={product._id}
              className="product-card-hover"
              onClick={() =>
                navigate(`/product/${product._id}`)
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
                  height: "250px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />

              {/* Product Name */}
              <h3
                style={{
                  fontSize: "16px",
                  margin: "12px 0 5px 0",
                }}
              >
                {product.name}
              </h3>

              {/* Brand */}
              <p
                style={{
                  color: "#888",
                  fontSize: "13px",
                  marginBottom: "5px",
                }}
              >
                {product.brand}
              </p>

              {/* Shade */}
              <p
                style={{
                  color: "#888",
                  fontSize: "13px",
                  marginBottom: "12px",
                }}
              >
                Shade: {product.shade}
              </p>

              {/* Price + Add To Cart */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
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
                    // IMPORTANT:
                    // Prevent the card click from opening
                    // the Product Details page.
                    e.stopPropagation();

                    // Use App's global handler so that
                    // BOTH cart addition and notification happen.
                    if (onAddToCart) {
                      onAddToCart(product);
                    }
                  }}
                  className="add-cart-hover"
                  style={{
                    backgroundColor: "#d81b60",
                    color: "#fff",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default CategoryProducts;