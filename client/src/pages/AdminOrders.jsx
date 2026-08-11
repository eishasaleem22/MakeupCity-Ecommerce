import { useEffect, useState } from "react";
import axios from "axios";

// =====================================================
// ADMIN ORDERS
// =====================================================

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [updatingStatus, setUpdatingStatus] =
    useState(false);

  // =====================================================
  // GET ADMIN TOKEN
  // =====================================================

  const getToken = () => {
    const storedAdmin =
      localStorage.getItem("adminUser");

    if (!storedAdmin) {
      return null;
    }

    try {
      const admin = JSON.parse(storedAdmin);
      return admin.token;
    } catch (error) {
      console.error(
        "Error reading admin session:",
        error
      );

      return null;
    }
  };

  // =====================================================
  // FETCH ORDERS
  // =====================================================

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const token = getToken();

      if (!token) {
        console.error(
          "Admin token not found."
        );
        return;
      }

      const { data } = await axios.get(
        "http://localhost:5000/api/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(data.orders || []);
    } catch (error) {
      console.error(
        "Error fetching orders:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD ORDERS
  // =====================================================

  useEffect(() => {
    fetchOrders();
  }, []);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // =====================================================
  // SHORT ORDER ID
  // =====================================================

  const shortOrderId = (id) => {
    if (!id) return "N/A";

    return `${id.substring(
      0,
      8
    )}...`;
  };

  // =====================================================
  // GET TOTAL ITEMS
  // =====================================================

  const getTotalItems = (order) => {
    if (!order.orderItems) return 0;

    return order.orderItems.reduce(
      (total, item) =>
        total + Number(item.qty || 0),
      0
    );
  };

  // =====================================================
  // STATUS UPDATE
  // =====================================================

  const handleStatusChange = async (
    orderId,
    newStatus
  ) => {
    try {
      setUpdatingStatus(true);

      const token = getToken();

      if (!token) {
        alert(
          "Admin session expired. Please login again."
        );

        return;
      }

      const { data } =
        await axios.put(
          `http://localhost:5000/api/orders/${orderId}/status`,
          {
            status: newStatus,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      // Update order in list
      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === orderId
            ? data.order
            : order
        )
      );

      // Update selected order if modal is open
      if (
        selectedOrder &&
        selectedOrder._id === orderId
      ) {
        setSelectedOrder(data.order);
      }
    } catch (error) {
      console.error(
        "Error updating order status:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update order status."
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Processing":
        return {
          backgroundColor: "#e3f2fd",
          color: "#1565c0",
        };

      case "Shipped":
        return {
          backgroundColor: "#ede7f6",
          color: "#5e35b1",
        };

      case "Delivered":
        return {
          backgroundColor: "#e8f5e9",
          color: "#2e7d32",
        };

      case "Cancelled":
        return {
          backgroundColor: "#ffebee",
          color: "#c62828",
        };

      case "Pending":
      default:
        return {
          backgroundColor: "#fff3cd",
          color: "#9a6b00",
        };
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingIcon}>
            🛒
          </div>

          <h2 style={styles.loadingTitle}>
            Loading Orders...
          </h2>

          <p style={styles.loadingText}>
            Please wait while we fetch customer
            orders.
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN RETURN
  // =====================================================

  return (
    <div style={styles.page}>

      {/* =================================================
          HEADER
      ================================================= */}

      <div style={styles.header}>

        <div>
          <h1 style={styles.title}>
            Orders
          </h1>

          <p style={styles.subtitle}>
            Manage customer orders and update
            their status.
          </p>
        </div>

        <div style={styles.orderCount}>
          🛒 {orders.length}{" "}
          {orders.length === 1
            ? "Order"
            : "Orders"}
        </div>

      </div>

      {/* =================================================
          ORDERS TABLE
      ================================================= */}

      {orders.length === 0 ? (

        <div style={styles.emptyState}>

          <div style={styles.emptyIcon}>
            🛒
          </div>

          <h2 style={styles.emptyTitle}>
            No Orders Yet
          </h2>

          <p style={styles.emptyText}>
            Customer orders will appear here once
            someone places an order.
          </p>

        </div>

      ) : (

        <div style={styles.tableWrapper}>

          <table style={styles.table}>

            {/* =================================================
                TABLE HEADER
            ================================================= */}

            <thead>
              <tr>

                <th
                  style={{
                    ...styles.th,
                    width: "170px",
                  }}
                >
                  Order
                </th>

                <th
                  style={{
                    ...styles.th,
                    width: "240px",
                  }}
                >
                  Customer
                </th>

                <th
                  style={{
                    ...styles.th,
                    width: "155px",
                  }}
                >
                  Date
                </th>

                <th
                  style={{
                    ...styles.th,
                    width: "90px",
                  }}
                >
                  Items
                </th>

                <th
                  style={{
                    ...styles.th,
                    width: "120px",
                  }}
                >
                  Total
                </th>

                <th
                  style={{
                    ...styles.th,
                    width: "150px",
                  }}
                >
                  Payment
                </th>

                <th
                  style={{
                    ...styles.th,
                    width: "145px",
                  }}
                >
                  Status
                </th>

                <th
                  style={{
                    ...styles.th,
                    width: "150px",
                  }}
                >
                  Action
                </th>

              </tr>
            </thead>

            {/* =================================================
                TABLE BODY
            ================================================= */}

            <tbody>

              {orders.map((order) => (

                <tr
                  key={order._id}
                  style={styles.tr}
                >

                  {/* ================= ORDER ================= */}

                  <td style={styles.td}>

                    <div style={styles.orderCell}>

                      <span style={styles.orderHash}>
                        #
                      </span>

                      <div>

                        <div
                          style={
                            styles.orderId
                          }
                          title={order._id}
                        >
                          {shortOrderId(
                            order._id
                          )}
                        </div>

                        <div
                          style={
                            styles.orderLabel
                          }
                        >
                          Order ID
                        </div>

                      </div>

                    </div>

                  </td>

                  {/* ================= CUSTOMER ================= */}

                  <td style={styles.td}>

                    <div
                      style={
                        styles.customerCell
                      }
                    >

                      <div
                        style={
                          styles.customerAvatar
                        }
                      >
                        {order.fullName
                          ?.charAt(0)
                          ?.toUpperCase() ||
                          "U"}
                      </div>

                      <div
                        style={
                          styles.customerInfo
                        }
                      >

                        <div
                          style={
                            styles.customerName
                          }
                        >
                          {order.fullName ||
                            "Unknown Customer"}
                        </div>

                        <div
                          style={
                            styles.customerEmail
                          }
                        >
                          {order.email ||
                            "No email"}
                        </div>

                      </div>

                    </div>

                  </td>

                  {/* ================= DATE ================= */}

                  <td style={styles.td}>

                    <div
                      style={
                        styles.dateText
                      }
                    >
                      {formatDate(
                        order.createdAt
                      )}
                    </div>

                  </td>

                  {/* ================= ITEMS ================= */}

                  <td style={styles.td}>

                    <div
                      style={
                        styles.itemsText
                      }
                    >
                      {getTotalItems(
                        order
                      )}{" "}
                      {getTotalItems(
                        order
                      ) === 1
                        ? "Item"
                        : "Items"}
                    </div>

                  </td>

                  {/* ================= TOTAL ================= */}

                  <td style={styles.td}>

                    <div
                      style={
                        styles.totalText
                      }
                    >
                      Rs.{" "}
                      {Number(
                        order.totalPrice || 0
                      ).toLocaleString()}
                    </div>

                  </td>

                  {/* ================= PAYMENT ================= */}

                  <td style={styles.td}>

                    <div
                      style={
                        styles.paymentText
                      }
                    >
                      {order.paymentMethod ||
                        "N/A"}
                    </div>

                  </td>

                  {/* ================= STATUS ================= */}

                  <td style={styles.td}>

                    <select
                      value={
                        order.status ||
                        "Pending"
                      }
                      onChange={(e) =>
                        handleStatusChange(
                          order._id,
                          e.target.value
                        )
                      }
                      disabled={
                        updatingStatus
                      }
                      style={{
                        ...styles.statusSelect,
                        ...getStatusStyle(
                          order.status
                        ),
                      }}
                    >

                      <option value="Pending">
                        Pending
                      </option>

                      <option value="Processing">
                        Processing
                      </option>

                      <option value="Shipped">
                        Shipped
                      </option>

                      <option value="Delivered">
                        Delivered
                      </option>

                      <option value="Cancelled">
                        Cancelled
                      </option>

                    </select>

                  </td>

                  {/* ================= ACTION ================= */}

                  <td style={styles.td}>

                    <button
                      onClick={() =>
                        setSelectedOrder(
                          order
                        )
                      }
                      style={
                        styles.viewButton
                      }
                    >
                      View Details
                      <span
                        style={
                          styles.arrow
                        }
                      >
                        →
                      </span>
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

      {/* =================================================
          ORDER DETAILS MODAL
      ================================================= */}

      {selectedOrder && (

        <div
          style={styles.modalOverlay}
          onClick={() =>
            setSelectedOrder(null)
          }
        >

          <div
            style={styles.modal}
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* ================= MODAL HEADER ================= */}

            <div
              style={
                styles.modalHeader
              }
            >

              <div>

                <h2
                  style={
                    styles.modalTitle
                  }
                >
                  Order Details
                </h2>

                <p
                  style={
                    styles.modalOrderId
                  }
                >
                  #{selectedOrder._id}
                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedOrder(
                    null
                  )
                }
                style={
                  styles.closeButton
                }
              >
                ×
              </button>

            </div>

            {/* ================= MODAL CONTENT ================= */}

            <div
              style={
                styles.modalContent
              }
            >

              {/* ================= STATUS ================= */}

              <div
                style={
                  styles.detailStatusRow
                }
              >

                <span
                  style={
                    styles.detailLabel
                  }
                >
                  Order Status
                </span>

                <select
                  value={
                    selectedOrder.status ||
                    "Pending"
                  }
                  onChange={(e) =>
                    handleStatusChange(
                      selectedOrder._id,
                      e.target.value
                    )
                  }
                  disabled={
                    updatingStatus
                  }
                  style={{
                    ...styles.statusSelect,
                    ...getStatusStyle(
                      selectedOrder.status
                    ),
                  }}
                >

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Processing">
                    Processing
                  </option>

                  <option value="Shipped">
                    Shipped
                  </option>

                  <option value="Delivered">
                    Delivered
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>

                </select>

              </div>

              {/* ================= CUSTOMER ================= */}

              <section
                style={
                  styles.detailSection
                }
              >

                <h3
                  style={
                    styles.sectionTitle
                  }
                >
                  Customer Information
                </h3>

                <div
                  style={
                    styles.detailGrid
                  }
                >

                  <DetailItem
                    label="Full Name"
                    value={
                      selectedOrder.fullName
                    }
                  />

                  <DetailItem
                    label="Email"
                    value={
                      selectedOrder.email
                    }
                  />

                  <DetailItem
                    label="Phone"
                    value={
                      selectedOrder.phone
                    }
                  />

                  <DetailItem
                    label="City"
                    value={
                      selectedOrder.city
                    }
                  />

                  <DetailItem
                    label="Province"
                    value={
                      selectedOrder.province
                    }
                  />

                  <DetailItem
                    label="Postal Code"
                    value={
                      selectedOrder.postalCode ||
                      "N/A"
                    }
                  />

                </div>

                <div
                  style={
                    styles.addressBox
                  }
                >

                  <div
                    style={
                      styles.detailLabel
                    }
                  >
                    Delivery Address
                  </div>

                  <div
                    style={
                      styles.addressText
                    }
                  >
                    {selectedOrder.address}
                  </div>

                </div>

              </section>

              {/* ================= ORDER ITEMS ================= */}

              <section
                style={
                  styles.detailSection
                }
              >

                <h3
                  style={
                    styles.sectionTitle
                  }
                >
                  Ordered Products
                </h3>

                <div
                  style={
                    styles.productsList
                  }
                >

                  {selectedOrder.orderItems?.map(
                    (item, index) => (

                      <div
                        key={index}
                        style={
                          styles.productRow
                        }
                      >

                        <div
                          style={
                            styles.productImageWrapper
                          }
                        >

                          {item.image ? (

                            <img
                              src={item.image}
                              alt={
                                item.name
                              }
                              style={
                                styles.productImage
                              }
                            />

                          ) : (

                            <div
                              style={
                                styles.noImage
                              }
                            >
                              💄
                            </div>

                          )}

                        </div>

                        <div
                          style={
                            styles.productInfo
                          }
                        >

                          <div
                            style={
                              styles.productName
                            }
                          >
                            {item.name}
                          </div>

                          <div
                            style={
                              styles.productQuantity
                            }
                          >
                            Quantity:{" "}
                            {item.qty}
                          </div>

                        </div>

                        <div
                          style={
                            styles.productPrice
                          }
                        >
                          Rs.{" "}
                          {(
                            Number(
                              item.price
                            ) *
                            Number(
                              item.qty
                            )
                          ).toLocaleString()}
                        </div>

                      </div>

                    )
                  )}

                </div>

              </section>

              {/* ================= PAYMENT ================= */}

              <section
                style={
                  styles.detailSection
                }
              >

                <h3
                  style={
                    styles.sectionTitle
                  }
                >
                  Payment Information
                </h3>

                <div
                  style={
                    styles.paymentDetail
                  }
                >

                  <span>
                    Payment Method
                  </span>

                  <strong>
                    {selectedOrder.paymentMethod ||
                      "N/A"}
                  </strong>

                </div>

                <div
                  style={
                    styles.totalDetail
                  }
                >

                  <span>
                    Total Order Amount
                  </span>

                  <strong>
                    Rs.{" "}
                    {Number(
                      selectedOrder.totalPrice ||
                        0
                    ).toLocaleString()}
                  </strong>

                </div>

              </section>

              {/* ================= DATE ================= */}

              <section
                style={
                  styles.orderDateSection
                }
              >

                <span>
                  Order placed on
                </span>

                <strong>
                  {formatDate(
                    selectedOrder.createdAt
                  )}
                </strong>

              </section>

            </div>

            {/* ================= MODAL FOOTER ================= */}

            <div
              style={
                styles.modalFooter
              }
            >

              <button
                onClick={() =>
                  setSelectedOrder(
                    null
                  )
                }
                style={
                  styles.closeModalButton
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

// =====================================================
// DETAIL ITEM COMPONENT
// =====================================================

function DetailItem({
  label,
  value,
}) {
  return (
    <div style={styles.detailItem}>

      <div
        style={
          styles.detailLabel
        }
      >
        {label}
      </div>

      <div
        style={
          styles.detailValue
        }
      >
        {value || "N/A"}
      </div>

    </div>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = {

  // ===================================================
  // PAGE
  // ===================================================

  page: {
    minHeight: "100vh",
    backgroundColor: "#fdf7f9",
    padding: "55px 70px",
    boxSizing: "border-box",
    fontFamily:
      "Georgia, 'Times New Roman', serif",
  },

  // ===================================================
  // HEADER
  // ===================================================

  header: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: "45px",
    gap: "30px",
  },

  title: {
    margin: 0,
    color: "#d81b60",
    fontSize: "56px",
    lineHeight: "1",
    fontWeight: "700",
  },

  subtitle: {
    margin:
      "15px 0 0 0",
    color: "#777",
    fontSize: "19px",
  },

  orderCount: {
    backgroundColor: "#fce4ec",
    color: "#d81b60",
    padding:
      "16px 28px",
    borderRadius: "30px",
    fontSize: "17px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  // ===================================================
  // TABLE
  // ===================================================

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
    backgroundColor: "#fff",
    border:
      "1px solid #f8bbd0",
    borderRadius: "18px",
    boxShadow:
      "0 4px 18px rgba(216,27,96,0.06)",
  },

  table: {
    width: "100%",
    minWidth: "1250px",
    borderCollapse: "separate",
    borderSpacing: 0,
    tableLayout: "fixed",
  },

  th: {
    padding: "22px 18px",
    backgroundColor: "#fff4f7",
    color: "#d81b60",
    fontSize: "16px",
    fontWeight: "700",
    textAlign: "left",
    borderBottom:
      "1px solid #f8bbd0",
    whiteSpace: "nowrap",
  },

  tr: {
    backgroundColor: "#fff",
  },

  td: {
    padding:
      "24px 18px",
    verticalAlign: "middle",
    borderBottom:
      "1px solid #f4edf0",
    overflow: "hidden",
  },

  // ===================================================
  // ORDER
  // ===================================================

  orderCell: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    minWidth: 0,
  },

  orderHash: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    backgroundColor: "#fce4ec",
    color: "#d81b60",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    flexShrink: 0,
  },

  orderId: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#333",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  orderLabel: {
    marginTop: "4px",
    color: "#999",
    fontSize: "11px",
    fontFamily:
      "Arial, sans-serif",
  },

  // ===================================================
  // CUSTOMER
  // ===================================================

  customerCell: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minWidth: 0,
  },

  customerAvatar: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    backgroundColor: "#fce4ec",
    color: "#d81b60",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "17px",
    fontWeight: "700",
    flexShrink: 0,
  },

  customerInfo: {
    minWidth: 0,
  },

  customerName: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#333",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  customerEmail: {
    marginTop: "5px",
    fontFamily:
      "Arial, sans-serif",
    fontSize: "12px",
    color: "#888",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  // ===================================================
  // DATE
  // ===================================================

  dateText: {
    fontFamily:
      "Arial, sans-serif",
    fontSize: "13px",
    lineHeight: "1.5",
    color: "#555",
  },

  // ===================================================
  // ITEMS
  // ===================================================

  itemsText: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#333",
    whiteSpace: "nowrap",
  },

  // ===================================================
  // TOTAL
  // ===================================================

  totalText: {
    color: "#d81b60",
    fontSize: "17px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  // ===================================================
  // PAYMENT
  // ===================================================

  paymentText: {
    fontFamily:
      "Arial, sans-serif",
    fontSize: "13px",
    color: "#555",
    lineHeight: "1.4",
    whiteSpace: "normal",
  },

  // ===================================================
  // STATUS
  // ===================================================

  statusSelect: {
    border: "none",
    outline: "none",
    padding:
      "10px 13px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "700",
    cursor: "pointer",
    fontFamily:
      "Georgia, serif",
    maxWidth: "130px",
  },

  // ===================================================
  // VIEW BUTTON
  // ===================================================

  viewButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding:
      "11px 16px",
    backgroundColor: "#fff",
    color: "#d81b60",
    border:
      "1px solid #f48fb1",
    borderRadius: "9px",
    cursor: "pointer",
    fontFamily:
      "Georgia, serif",
    fontSize: "13px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  arrow: {
    fontSize: "16px",
  },

  // ===================================================
  // EMPTY STATE
  // ===================================================

  emptyState: {
    backgroundColor: "#fff",
    border:
      "1px solid #f8bbd0",
    borderRadius: "18px",
    padding: "80px 30px",
    textAlign: "center",
  },

  emptyIcon: {
    fontSize: "55px",
    marginBottom: "15px",
  },

  emptyTitle: {
    margin: 0,
    color: "#333",
    fontSize: "26px",
  },

  emptyText: {
    color: "#888",
    fontFamily:
      "Arial, sans-serif",
    fontSize: "14px",
  },

  // ===================================================
  // LOADING
  // ===================================================

  loadingContainer: {
    backgroundColor: "#fff",
    borderRadius: "18px",
    padding: "80px 30px",
    textAlign: "center",
    border:
      "1px solid #f8bbd0",
  },

  loadingIcon: {
    fontSize: "45px",
  },

  loadingTitle: {
    color: "#d81b60",
    fontSize: "25px",
    margin:
      "15px 0 8px",
  },

  loadingText: {
    color: "#888",
    fontFamily:
      "Arial, sans-serif",
  },

  // ===================================================
  // MODAL
  // ===================================================

  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor:
      "rgba(0,0,0,0.45)",
    zIndex: 3000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px",
    boxSizing: "border-box",
  },

  modal: {
    width: "100%",
    maxWidth: "900px",
    maxHeight: "90vh",
    backgroundColor: "#fff",
    borderRadius: "18px",
    overflow: "hidden",
    boxShadow:
      "0 15px 50px rgba(0,0,0,0.25)",
    display: "flex",
    flexDirection: "column",
  },

  modalHeader: {
    padding:
      "24px 30px",
    borderBottom:
      "1px solid #f3dce4",
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
  },

  modalTitle: {
    margin: 0,
    color: "#d81b60",
    fontSize: "28px",
  },

  modalOrderId: {
    margin:
      "7px 0 0",
    color: "#888",
    fontSize: "12px",
    fontFamily:
      "Arial, sans-serif",
    wordBreak: "break-all",
  },

  closeButton: {
    width: "38px",
    height: "38px",
    border: "none",
    borderRadius: "50%",
    backgroundColor: "#fce4ec",
    color: "#d81b60",
    fontSize: "27px",
    cursor: "pointer",
    lineHeight: "1",
  },

  modalContent: {
    padding: "30px",
    overflowY: "auto",
  },

  modalFooter: {
    padding:
      "18px 30px",
    borderTop:
      "1px solid #f3dce4",
    display: "flex",
    justifyContent: "flex-end",
  },

  closeModalButton: {
    padding:
      "11px 25px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#d81b60",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "700",
  },

  // ===================================================
  // DETAIL STATUS
  // ===================================================

  detailStatusRow: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    padding: "15px 18px",
    backgroundColor: "#fff7f9",
    borderRadius: "10px",
    marginBottom: "25px",
  },

  // ===================================================
  // DETAIL SECTIONS
  // ===================================================

  detailSection: {
    marginBottom: "30px",
  },

  sectionTitle: {
    margin:
      "0 0 18px",
    color: "#d81b60",
    fontSize: "20px",
  },

  detailGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: "22px",
  },

  detailItem: {
    minWidth: 0,
  },

  detailLabel: {
    color: "#999",
    fontSize: "12px",
    fontWeight: "700",
    textTransform:
      "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "7px",
    fontFamily:
      "Arial, sans-serif",
  },

  detailValue: {
    color: "#333",
    fontSize: "15px",
    fontWeight: "600",
    wordBreak: "break-word",
  },

  addressBox: {
    marginTop: "22px",
    padding: "18px",
    backgroundColor: "#fafafa",
    borderRadius: "10px",
  },

  addressText: {
    color: "#333",
    fontSize: "15px",
    lineHeight: "1.6",
    wordBreak: "break-word",
  },

  // ===================================================
  // PRODUCTS
  // ===================================================

  productsList: {
    border:
      "1px solid #eee",
    borderRadius: "10px",
    overflow: "hidden",
  },

  productRow: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "15px",
    borderBottom:
      "1px solid #eee",
  },

  productImageWrapper: {
    width: "55px",
    height: "55px",
    borderRadius: "8px",
    overflow: "hidden",
    flexShrink: 0,
    backgroundColor: "#fce4ec",
  },

  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  noImage: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
  },

  productInfo: {
    flex: 1,
    minWidth: 0,
  },

  productName: {
    color: "#333",
    fontSize: "15px",
    fontWeight: "700",
    wordBreak: "break-word",
  },

  productQuantity: {
    marginTop: "5px",
    color: "#888",
    fontSize: "12px",
    fontFamily:
      "Arial, sans-serif",
  },

  productPrice: {
    color: "#d81b60",
    fontSize: "15px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  // ===================================================
  // PAYMENT DETAILS
  // ===================================================

  paymentDetail: {
    display: "flex",
    justifyContent:
      "space-between",
    padding: "15px 0",
    borderBottom:
      "1px solid #eee",
    fontFamily:
      "Arial, sans-serif",
    fontSize: "14px",
  },

  totalDetail: {
    display: "flex",
    justifyContent:
      "space-between",
    padding: "18px 0",
    fontSize: "17px",
  },

  orderDateSection: {
    padding:
      "15px 18px",
    backgroundColor: "#fafafa",
    borderRadius: "8px",
    display: "flex",
    justifyContent:
      "space-between",
    gap: "20px",
    fontFamily:
      "Arial, sans-serif",
    fontSize: "13px",
    color: "#777",
  },

};

export default AdminOrders;