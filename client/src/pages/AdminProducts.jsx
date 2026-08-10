import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function AdminProducts() {
  const { adminUser } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    shade: "",
    image: "",
    countInStock: "",
  });

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await axios.get(
        "http://localhost:5000/api/products"
      );

      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);

      setError(
        "Unable to load products. Please make sure the server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ==========================================
  // FORM INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      brand: "",
      shade: "",
      image: "",
      countInStock: "",
    });

    setEditingProduct(null);
    setShowForm(false);
  };

  // ==========================================
  // OPEN ADD FORM
  // ==========================================

  const handleAddProduct = () => {
    setEditingProduct(null);

    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      brand: "",
      shade: "",
      image: "",
      countInStock: "",
    });

    setShowForm(true);
  };

  // ==========================================
  // OPEN EDIT FORM
  // ==========================================

  const handleEditProduct = (product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      category: product.category || "",
      brand: product.brand || "",
      shade: product.shade || "",
      image: product.image || "",
      countInStock: product.countInStock ?? "",
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // SAVE PRODUCT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ------------------------------------------
    // CONFIRMATION BEFORE ADD / UPDATE
    // ------------------------------------------

    let confirmationMessage = "";

    if (editingProduct) {
      confirmationMessage =
        `Are you sure you want to update "${formData.name}"?\n\n` +
        "The existing product information will be replaced with these changes.";
    } else {
      confirmationMessage =
        `Are you sure you want to add "${formData.name}" as a new product?\n\n` +
        "This product will be added to your product catalog.";
    }

    const confirmed = window.confirm(
      confirmationMessage
    );

    if (!confirmed) {
      return;
    }

    // ------------------------------------------
    // SAVE PRODUCT
    // ------------------------------------------

    try {
      setError("");

      if (!adminUser?.token) {
        setError(
          "Admin session not found. Please login again."
        );
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${adminUser.token}`,
        },
      };

      const productData = {
        ...formData,
        price: Number(formData.price),
        countInStock: Number(formData.countInStock),
      };

      if (editingProduct) {
        // UPDATE PRODUCT

        await axios.put(
          `http://localhost:5000/api/products/${editingProduct._id}`,
          productData,
          config
        );

        alert("Product updated successfully!");
      } else {
        // ADD PRODUCT

        await axios.post(
          "http://localhost:5000/api/products",
          productData,
          config
        );

        alert("Product added successfully!");
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      console.error("Error saving product:", err);

      setError(
        err.response?.data?.message ||
          "Failed to save product."
      );
    }
  };

  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  const handleDeleteProduct = async (productId) => {
    const product = products.find(
      (item) => item._id === productId
    );

    const productName =
      product?.name || "this product";

    // ------------------------------------------
    // DELETE CONFIRMATION
    // ------------------------------------------

    const confirmed = window.confirm(
      `Are you sure you want to delete "${productName}"?\n\n` +
        "This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    // ------------------------------------------
    // DELETE PRODUCT
    // ------------------------------------------

    try {
      setError("");

      if (!adminUser?.token) {
        setError(
          "Admin session not found. Please login again."
        );
        return;
      }

      await axios.delete(
        `http://localhost:5000/api/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${adminUser.token}`,
          },
        }
      );

      setProducts((prev) =>
        prev.filter(
          (product) =>
            product._id !== productId
        )
      );

      alert("Product deleted successfully!");
    } catch (err) {
      console.error(
        "Error deleting product:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to delete product."
      );
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredProducts = products.filter(
    (product) => {
      const search = searchTerm.toLowerCase();

      return (
        product.name
          ?.toLowerCase()
          .includes(search) ||
        product.brand
          ?.toLowerCase()
          .includes(search) ||
        product.category
          ?.toLowerCase()
          .includes(search)
      );
    }
  );

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div style={styles.page}>

      {/* ==========================================
          HEADER
      ========================================== */}

      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            Products
          </h1>

          <p style={styles.subtitle}>
            Manage your Makeup City product
            catalog
          </p>
        </div>

        <button
          onClick={handleAddProduct}
          style={styles.addButton}
        >
          + Add Product
        </button>
      </div>

      {/* ==========================================
          ERROR
      ========================================== */}

      {error && (
        <div style={styles.errorBox}>
          {error}
        </div>
      )}

      {/* ==========================================
          ADD / EDIT FORM
      ========================================== */}

      {showForm && (
        <div style={styles.formCard}>

          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>
              {editingProduct
                ? "Edit Product"
                : "Add New Product"}
            </h2>

            <button
              onClick={resetForm}
              style={styles.closeButton}
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit}>

            <div style={styles.formGrid}>

              {/* NAME */}

              <div style={styles.field}>
                <label>
                  Product Name *
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Studio Fix Foundation"
                  style={styles.input}
                />
              </div>

              {/* BRAND */}

              <div style={styles.field}>
                <label>Brand *</label>

                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                  placeholder="e.g. MAC"
                  style={styles.input}
                />
              </div>

              {/* CATEGORY */}

              <div style={styles.field}>
                <label>Category *</label>

                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Foundations"
                  style={styles.input}
                />
              </div>

              {/* SHADE */}

              <div style={styles.field}>
                <label>Shade</label>

                <input
                  type="text"
                  name="shade"
                  value={formData.shade}
                  onChange={handleChange}
                  placeholder="e.g. NC42"
                  style={styles.input}
                />
              </div>

              {/* PRICE */}

              <div style={styles.field}>
                <label>
                  Price (PKR) *
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="4200"
                  style={styles.input}
                />
              </div>

              {/* STOCK */}

              <div style={styles.field}>
                <label>
                  Stock Quantity *
                </label>

                <input
                  type="number"
                  name="countInStock"
                  value={
                    formData.countInStock
                  }
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="20"
                  style={styles.input}
                />
              </div>

              {/* IMAGE */}

              <div
                style={{
                  ...styles.field,
                  gridColumn: "1 / -1",
                }}
              >
                <label>
                  Product Image *
                </label>

                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  required
                  placeholder="/images/products/product.jpg"
                  style={styles.input}
                />
              </div>

              {/* DESCRIPTION */}

              <div
                style={{
                  ...styles.field,
                  gridColumn: "1 / -1",
                }}
              >
                <label>
                  Description *
                </label>

                <textarea
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Enter product description..."
                  style={{
                    ...styles.input,
                    resize: "vertical",
                  }}
                />
              </div>

            </div>

            {/* FORM BUTTONS */}

            <div style={styles.formActions}>

              <button
                type="button"
                onClick={resetForm}
                style={styles.cancelButton}
              >
                Cancel
              </button>

              <button
                type="submit"
                style={styles.saveButton}
              >
                {editingProduct
                  ? "Update Product"
                  : "Add Product"}
              </button>

            </div>

          </form>
        </div>
      )}

      {/* ==========================================
          SEARCH
      ========================================== */}

      <div style={styles.toolbar}>

        <input
          type="text"
          placeholder="Search products by name, brand or category..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          style={styles.searchInput}
        />

        <div style={styles.productCount}>
          {filteredProducts.length} Products
        </div>

      </div>

      {/* ==========================================
          PRODUCTS
      ========================================== */}

      {loading ? (
        <div style={styles.loading}>
          Loading products...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div style={styles.empty}>

          <div style={styles.emptyIcon}>
            📦
          </div>

          <h3>
            No products found
          </h3>

          <p>
            Try another search or add a new
            product.
          </p>

        </div>
      ) : (
        <div style={styles.tableCard}>

          <div style={styles.tableWrapper}>

            <table style={styles.table}>

              <thead>
                <tr>

                  <th style={styles.th}>
                    Product
                  </th>

                  <th style={styles.th}>
                    Brand
                  </th>

                  <th style={styles.th}>
                    Category
                  </th>

                  <th style={styles.th}>
                    Price
                  </th>

                  <th style={styles.th}>
                    Stock
                  </th>

                  <th style={styles.th}>
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredProducts.map(
                  (product) => (
                    <tr key={product._id}>

                      {/* PRODUCT */}

                      <td
                        style={
                          styles.productCell
                        }
                      >

                        <img
                          src={product.image}
                          alt={product.name}
                          style={
                            styles.productImage
                          }
                        />

                        <div>

                          <div
                            style={
                              styles.productName
                            }
                          >
                            {product.name}
                          </div>

                          {product.shade && (
                            <div
                              style={
                                styles.shade
                              }
                            >
                              Shade:{" "}
                              {product.shade}
                            </div>
                          )}

                        </div>

                      </td>

                      {/* BRAND */}

                      <td style={styles.td}>
                        {product.brand}
                      </td>

                      {/* CATEGORY */}

                      <td style={styles.td}>

                        <span
                          style={
                            styles.categoryBadge
                          }
                        >
                          {product.category}
                        </span>

                      </td>

                      {/* PRICE */}

                      <td style={styles.td}>

                        <strong
                          style={
                            styles.price
                          }
                        >
                          Rs.{" "}
                          {product.price.toLocaleString()}
                        </strong>

                      </td>

                      {/* STOCK */}

                      <td style={styles.td}>

                        <span
                          style={{
                            ...styles.stockBadge,

                            ...(product.countInStock ===
                            0
                              ? styles.outOfStock
                              : product.countInStock <=
                                5
                              ? styles.lowStock
                              : styles.inStock),
                          }}
                        >
                          {product.countInStock ===
                          0
                            ? "Out of Stock"
                            : `${product.countInStock} in stock`}
                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td style={styles.td}>

                        <div
                          style={
                            styles.actions
                          }
                        >

                          <button
                            onClick={() =>
                              handleEditProduct(
                                product
                              )
                            }
                            style={
                              styles.editButton
                            }
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDeleteProduct(
                                product._id
                              )
                            }
                            style={
                              styles.deleteButton
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        </div>
      )}

    </div>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = {
  page: {
    padding: "35px",
    backgroundColor: "#fdf7f9",
    minHeight: "100vh",
    boxSizing: "border-box",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  title: {
    margin: 0,
    color: "#333",
    fontSize: "30px",
  },

  subtitle: {
    margin: "6px 0 0",
    color: "#888",
    fontSize: "14px",
  },

  addButton: {
    backgroundColor: "#d81b60",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  errorBox: {
    backgroundColor: "#ffebee",
    color: "#c62828",
    padding: "14px 18px",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "1px solid #ffcdd2",
  },

  formCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "25px",
    marginBottom: "25px",
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.06)",
    border: "1px solid #f3e5e9",
  },

  formHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },

  formTitle: {
    margin: 0,
    color: "#333",
    fontSize: "21px",
  },

  closeButton: {
    border: "none",
    background: "transparent",
    fontSize: "20px",
    cursor: "pointer",
    color: "#777",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "18px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  input: {
    width: "100%",
    padding: "11px 12px",
    border: "1px solid #ddd",
    borderRadius: "7px",
    boxSizing: "border-box",
    fontSize: "14px",
    outline: "none",
  },

  formActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "25px",
  },

  cancelButton: {
    padding: "11px 18px",
    borderRadius: "7px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    color: "#555",
    cursor: "pointer",
    fontWeight: "600",
  },

  saveButton: {
    padding: "11px 20px",
    borderRadius: "7px",
    border: "none",
    backgroundColor: "#d81b60",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
  },

  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
  },

  searchInput: {
    width: "400px",
    padding: "12px 15px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fff",
    fontSize: "14px",
    boxSizing: "border-box",
  },

  productCount: {
    color: "#777",
    fontSize: "14px",
    fontWeight: "600",
  },

  loading: {
    backgroundColor: "#fff",
    padding: "60px",
    textAlign: "center",
    borderRadius: "12px",
    color: "#888",
  },

  empty: {
    backgroundColor: "#fff",
    padding: "70px 20px",
    textAlign: "center",
    borderRadius: "12px",
    color: "#888",
  },

  emptyIcon: {
    fontSize: "45px",
    marginBottom: "10px",
  },

  tableCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.05)",
    overflow: "hidden",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "950px",
  },

  th: {
    textAlign: "left",
    padding: "16px",
    backgroundColor: "#fff5f8",
    color: "#555",
    fontSize: "13px",
    borderBottom:
      "1px solid #f3e5e9",
  },

  td: {
    padding: "16px",
    borderBottom:
      "1px solid #f5f5f5",
    fontSize: "14px",
    color: "#555",
  },

  productCell: {
    padding: "12px 16px",
    borderBottom:
      "1px solid #f5f5f5",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  productImage: {
    width: "55px",
    height: "55px",
    objectFit: "cover",
    borderRadius: "7px",
    border: "1px solid #eee",
  },

  productName: {
    fontWeight: "600",
    color: "#333",
    maxWidth: "250px",
  },

  shade: {
    color: "#999",
    fontSize: "12px",
    marginTop: "4px",
  },

  categoryBadge: {
    backgroundColor: "#fce4ec",
    color: "#c2185b",
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },

  price: {
    color: "#d81b60",
    whiteSpace: "nowrap",
  },

  stockBadge: {
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },

  inStock: {
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
  },

  lowStock: {
    backgroundColor: "#fff3e0",
    color: "#ef6c00",
  },

  outOfStock: {
    backgroundColor: "#ffebee",
    color: "#c62828",
  },

  actions: {
    display: "flex",
    gap: "7px",
  },

  editButton: {
    padding: "7px 11px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#fce4ec",
    color: "#c2185b",
    cursor: "pointer",
    fontWeight: "600",
  },

  deleteButton: {
    padding: "7px 11px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#ffebee",
    color: "#c62828",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default AdminProducts;