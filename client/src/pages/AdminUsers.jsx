import { useEffect, useState } from "react";
import axios from "axios";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // =====================================================
  // FETCH ALL USERS
  // =====================================================

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const adminUser = JSON.parse(
        localStorage.getItem("adminUser")
      );

      const token = adminUser?.token;

      const { data } = await axios.get(
        "http://makeup-city-backend.vercel.app/api/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // VIEW USER DETAILS
  // =====================================================

  const handleViewDetails = async (userId) => {
    try {
      setDetailsLoading(true);
      setShowDetails(true);

      const adminUser = JSON.parse(
        localStorage.getItem("adminUser")
      );

      const token = adminUser?.token;

      const { data } = await axios.get(
        `http://makeup-city-backend.vercel.app/api/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelectedUser(data.user);
    } catch (error) {
      console.error(
        "Error fetching user details:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to load user details."
      );

      setShowDetails(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  // =====================================================
  // CLOSE DETAILS
  // =====================================================

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedUser(null);
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // FORMAT CURRENCY
  // =====================================================

  const formatCurrency = (amount) => {
    return `Rs. ${Number(amount || 0).toLocaleString()}`;
  };

  // =====================================================
  // FILTER USERS
  // =====================================================

  const filteredUsers = users.filter((user) => {
    const search = searchTerm
      .toLowerCase()
      .trim();

    if (!search) return true;

    return (
      user.name
        ?.toLowerCase()
        .includes(search) ||
      user.email
        ?.toLowerCase()
        .includes(search)
    );
  });

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getRoleStyle = (role) => {
    if (role === "admin") {
      return {
        backgroundColor: "#fce4ec",
        color: "#c2185b",
      };
    }

    return {
      backgroundColor: "#f3f4f6",
      color: "#555",
    };
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingIcon}>👥</div>

          <h2 style={styles.loadingTitle}>
            Loading Users...
          </h2>

          <p style={styles.loadingText}>
            Please wait while we fetch customer
            information.
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div style={styles.page}>

      {/* =================================================
          HEADER
      ================================================= */}

      <div style={styles.header}>

        <div>
          <h1 style={styles.title}>
            Users
          </h1>

          <p style={styles.subtitle}>
            Manage MakeupCity customers and view
            their order history.
          </p>
        </div>

        <div style={styles.userCountBadge}>
          <span style={styles.userCountIcon}>
            👥
          </span>

          <div>
            <div style={styles.userCountNumber}>
              {users.length}
            </div>

            <div style={styles.userCountLabel}>
              Total Users
            </div>
          </div>
        </div>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div style={styles.errorBox}>
          <strong>Error:</strong> {error}

          <button
            onClick={fetchUsers}
            style={styles.retryButton}
          >
            Retry
          </button>
        </div>
      )}

      {/* =================================================
          SEARCH
      ================================================= */}

      <div style={styles.toolbar}>

        <div style={styles.searchWrapper}>

          <span style={styles.searchIcon}>
            🔍
          </span>

          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            style={styles.searchInput}
          />

          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              style={styles.clearSearch}
            >
              ✕
            </button>
          )}

        </div>

        <div style={styles.resultText}>
          Showing{" "}
          <strong>
            {filteredUsers.length}
          </strong>{" "}
          of{" "}
          <strong>
            {users.length}
          </strong>{" "}
          users
        </div>

      </div>

      {/* =================================================
          USERS TABLE
      ================================================= */}

      <div style={styles.tableContainer}>

        <table style={styles.table}>

          <thead>

            <tr style={styles.tableHeaderRow}>

              <th style={styles.th}>
                User
              </th>

              <th style={styles.th}>
                Email
              </th>

              <th style={styles.th}>
                Role
              </th>

              <th style={styles.th}>
                Joined
              </th>

              <th
                style={{
                  ...styles.th,
                  textAlign: "center",
                }}
              >
                Orders
              </th>

              <th
                style={{
                  ...styles.th,
                  textAlign: "right",
                }}
              >
                Total Spent
              </th>

              <th
                style={{
                  ...styles.th,
                  textAlign: "center",
                }}
              >
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredUsers.length === 0 ? (

              <tr>

                <td
                  colSpan="7"
                  style={styles.emptyCell}
                >

                  <div style={styles.emptyIcon}>
                    👥
                  </div>

                  <h3 style={styles.emptyTitle}>
                    No Users Found
                  </h3>

                  <p style={styles.emptyText}>
                    {searchTerm
                      ? "No users match your search."
                      : "There are no users yet."
                    }
                  </p>

                </td>

              </tr>

            ) : (

              filteredUsers.map((user) => (

                <tr
                  key={user._id}
                  style={styles.tableRow}
                >

                  {/* USER */}

                  <td style={styles.td}>

                    <div style={styles.userCell}>

                      <div style={styles.avatar}>
                        {user.name
                          ?.charAt(0)
                          ?.toUpperCase() || "U"}
                      </div>

                      <div>

                        <div style={styles.userName}>
                          {user.name}
                        </div>

                        <div style={styles.userId}>
                          ID:{" "}
                          {user._id
                            ?.slice(-8)}
                        </div>

                      </div>

                    </div>

                  </td>

                  {/* EMAIL */}

                  <td style={styles.td}>

                    <span style={styles.email}>
                      {user.email}
                    </span>

                  </td>

                  {/* ROLE */}

                  <td style={styles.td}>

                    <span
                      style={{
                        ...styles.roleBadge,
                        ...getRoleStyle(
                          user.role
                        ),
                      }}
                    >
                      {user.role === "admin"
                        ? "Admin"
                        : "Customer"}
                    </span>

                  </td>

                  {/* JOINED */}

                  <td style={styles.td}>

                    <span style={styles.date}>
                      {formatDate(
                        user.createdAt
                      )}
                    </span>

                  </td>

                  {/* ORDERS */}

                  <td
                    style={{
                      ...styles.td,
                      textAlign: "center",
                    }}
                  >

                    <span
                      style={
                        styles.orderCount
                      }
                    >
                      {user.totalOrders || 0}
                    </span>

                  </td>

                  {/* TOTAL SPENT */}

                  <td
                    style={{
                      ...styles.td,
                      textAlign: "right",
                    }}
                  >

                    <strong
                      style={
                        styles.totalSpent
                      }
                    >
                      {formatCurrency(
                        user.totalSpent
                      )}
                    </strong>

                  </td>

                  {/* ACTION */}

                  <td
                    style={{
                      ...styles.td,
                      textAlign: "center",
                    }}
                  >

                    <button
                      onClick={() =>
                        handleViewDetails(
                          user._id
                        )
                      }
                      style={styles.viewButton}
                    >
                      View Details →
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* =================================================
          USER DETAILS DIALOG
      ================================================= */}

      {showDetails && (

        <div
          style={styles.overlay}
          onClick={closeDetails}
        >

          <div
            style={styles.dialog}
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* DIALOG HEADER */}

            <div style={styles.dialogHeader}>

              <div>

                <h2
                  style={
                    styles.dialogTitle
                  }
                >
                  User Details
                </h2>

                <p
                  style={
                    styles.dialogSubtitle
                  }
                >
                  Customer account information
                </p>

              </div>

              <button
                onClick={closeDetails}
                style={styles.closeButton}
              >
                ✕
              </button>

            </div>

            {/* DIALOG CONTENT */}

            {detailsLoading ? (

              <div
                style={
                  styles.dialogLoading
                }
              >

                <div
                  style={
                    styles.loadingIcon
                  }
                >
                  👤
                </div>

                <p>
                  Loading user details...
                </p>

              </div>

            ) : selectedUser ? (

              <div
                style={
                  styles.dialogContent
                }
              >

                {/* =====================================
                    CUSTOMER INFORMATION
                ===================================== */}

                <section>

                  <h3
                    style={
                      styles.sectionTitle
                    }
                  >
                    Customer Information
                  </h3>

                  <div
                    style={
                      styles.profileCard
                    }
                  >

                    <div
                      style={
                        styles.largeAvatar
                      }
                    >
                      {selectedUser.name
                        ?.charAt(0)
                        ?.toUpperCase() ||
                        "U"}
                    </div>

                    <div
                      style={
                        styles.profileInfo
                      }
                    >

                      <h2
                        style={
                          styles.profileName
                        }
                      >
                        {selectedUser.name}
                      </h2>

                      <p
                        style={
                          styles.profileEmail
                        }
                      >
                        {selectedUser.email}
                      </p>

                      <span
                        style={{
                          ...styles.roleBadge,
                          ...getRoleStyle(
                            selectedUser.role
                          ),
                        }}
                      >
                        {selectedUser.role ===
                        "admin"
                          ? "Admin"
                          : "Customer"}
                      </span>

                    </div>

                  </div>

                  <div
                    style={
                      styles.infoGrid
                    }
                  >

                    <div
                      style={
                        styles.infoBox
                      }
                    >
                      <span
                        style={
                          styles.infoLabel
                        }
                      >
                        Account Created
                      </span>

                      <strong
                        style={
                          styles.infoValue
                        }
                      >
                        {formatDate(
                          selectedUser.createdAt
                        )}
                      </strong>
                    </div>

                    <div
                      style={
                        styles.infoBox
                      }
                    >
                      <span
                        style={
                          styles.infoLabel
                        }
                      >
                        Total Orders
                      </span>

                      <strong
                        style={
                          styles.infoValue
                        }
                      >
                        {selectedUser.totalOrders ||
                          0}
                      </strong>
                    </div>

                    <div
                      style={
                        styles.infoBox
                      }
                    >
                      <span
                        style={
                          styles.infoLabel
                        }
                      >
                        Total Spent
                      </span>

                      <strong
                        style={{
                          ...styles.infoValue,
                          color: "#d81b60",
                        }}
                      >
                        {formatCurrency(
                          selectedUser.totalSpent
                        )}
                      </strong>
                    </div>

                  </div>

                </section>

                {/* =====================================
                    ORDER HISTORY
                ===================================== */}

                <section>

                  <h3
                    style={
                      styles.sectionTitle
                    }
                  >
                    Order History
                  </h3>

                  {selectedUser.orders &&
                  selectedUser.orders.length > 0 ? (

                    <div
                      style={
                        styles.ordersList
                      }
                    >

                      {selectedUser.orders.map(
                        (order) => (

                          <div
                            key={order._id}
                            style={
                              styles.orderCard
                            }
                          >

                            <div
                              style={
                                styles.orderMain
                              }
                            >

                              <div>

                                <div
                                  style={
                                    styles.orderId
                                  }
                                >
                                  Order #
                                  {order._id?.slice(
                                    -8
                                  )}
                                </div>

                                <div
                                  style={
                                    styles.orderDate
                                  }
                                >
                                  {formatDate(
                                    order.createdAt
                                  )}
                                </div>

                              </div>

                              <div
                                style={
                                  styles.orderAmount
                                }
                              >
                                {formatCurrency(
                                  order.totalPrice
                                )}
                              </div>

                            </div>

                            <div
                              style={
                                styles.orderBottom
                              }
                            >

                              <span
                                style={
                                  getStatusStyle(
                                    order.status
                                  )
                                }
                              >
                                {order.status}
                              </span>

                              <span
                                style={
                                  styles.paymentText
                                }
                              >
                                {order.paymentMethod}
                              </span>

                            </div>

                          </div>

                        )
                      )}

                    </div>

                  ) : (

                    <div
                      style={
                        styles.noOrders
                      }
                    >

                      <div
                        style={
                          styles.noOrdersIcon
                        }
                      >
                        🛒
                      </div>

                      <p>
                        This user has not placed
                        any orders yet.
                      </p>

                    </div>

                  )}

                </section>

              </div>

            ) : null}

            {/* DIALOG FOOTER */}

            <div
              style={
                styles.dialogFooter
              }
            >

              <button
                onClick={closeDetails}
                style={
                  styles.closeDialogButton
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
// ORDER STATUS STYLE
// =====================================================

const getStatusStyle = (status) => {
  const base = {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
  };

  switch (status) {
    case "Pending":
      return {
        ...base,
        backgroundColor: "#fff3cd",
        color: "#856404",
      };

    case "Processing":
      return {
        ...base,
        backgroundColor: "#e3f2fd",
        color: "#1565c0",
      };

    case "Shipped":
      return {
        ...base,
        backgroundColor: "#ede7f6",
        color: "#5e35b1",
      };

    case "Delivered":
      return {
        ...base,
        backgroundColor: "#e8f5e9",
        color: "#2e7d32",
      };

    case "Cancelled":
      return {
        ...base,
        backgroundColor: "#ffebee",
        color: "#c62828",
      };

    default:
      return {
        ...base,
        backgroundColor: "#f5f5f5",
        color: "#555",
      };
  }
};

// =====================================================
// STYLES
// =====================================================

const styles = {
  page: {
    padding: "35px 40px",
    minHeight: "100vh",
    backgroundColor: "#fdf7f9",
    boxSizing: "border-box",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "30px",
  },

  title: {
    margin: 0,
    color: "#333",
    fontSize: "32px",
    fontFamily: "Georgia, serif",
  },

  subtitle: {
    margin: "8px 0 0",
    color: "#777",
    fontSize: "14px",
  },

  userCountBadge: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    backgroundColor: "#fff",
    border: "1px solid #f8bbd0",
    borderRadius: "10px",
    padding: "12px 18px",
    minWidth: "130px",
  },

  userCountIcon: {
    fontSize: "25px",
  },

  userCountNumber: {
    color: "#d81b60",
    fontSize: "20px",
    fontWeight: "700",
  },

  userCountLabel: {
    color: "#888",
    fontSize: "11px",
    marginTop: "2px",
  },

  errorBox: {
    backgroundColor: "#ffebee",
    border: "1px solid #ef9a9a",
    color: "#c62828",
    borderRadius: "8px",
    padding: "14px 18px",
    marginBottom: "20px",
  },

  retryButton: {
    marginLeft: "15px",
    border: "none",
    backgroundColor: "#c62828",
    color: "#fff",
    padding: "7px 13px",
    borderRadius: "5px",
    cursor: "pointer",
  },

  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "20px",
  },

  searchWrapper: {
    position: "relative",
    width: "430px",
    maxWidth: "100%",
  },

  searchIcon: {
    position: "absolute",
    left: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "15px",
  },

  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 42px",
    border: "1px solid #e5d7dc",
    borderRadius: "8px",
    outline: "none",
    fontSize: "14px",
    backgroundColor: "#fff",
  },

  clearSearch: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    backgroundColor: "transparent",
    color: "#999",
    cursor: "pointer",
    fontSize: "14px",
  },

  resultText: {
    color: "#777",
    fontSize: "13px",
  },

  tableContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: "10px",
    border: "1px solid #f0dce3",
    overflow: "hidden",
    boxShadow:
      "0 2px 8px rgba(0,0,0,0.04)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed",
  },

  tableHeaderRow: {
    backgroundColor: "#fce4ec",
  },

  th: {
    padding: "16px 14px",
    textAlign: "left",
    color: "#555",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
    borderBottom: "1px solid #f1d7df",
  },

  td: {
    padding: "17px 14px",
    borderBottom: "1px solid #f3edf0",
    color: "#444",
    fontSize: "13px",
    verticalAlign: "middle",
    wordBreak: "break-word",
  },

  tableRow: {
    transition: "background-color 0.2s ease",
  },

  userCell: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    minWidth: 0,
  },

  avatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    backgroundColor: "#fce4ec",
    color: "#d81b60",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "15px",
    flexShrink: 0,
  },

  userName: {
    fontWeight: "700",
    color: "#333",
    fontSize: "14px",
  },

  userId: {
    marginTop: "3px",
    color: "#aaa",
    fontSize: "10px",
  },

  email: {
    color: "#555",
    wordBreak: "break-word",
  },

  roleBadge: {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "700",
  },

  date: {
    color: "#666",
  },

  orderCount: {
    display: "inline-flex",
    minWidth: "28px",
    height: "28px",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: "50%",
    fontWeight: "700",
    color: "#555",
  },

  totalSpent: {
    color: "#333",
    whiteSpace: "nowrap",
  },

  viewButton: {
    border: "none",
    backgroundColor: "#d81b60",
    color: "#fff",
    padding: "8px 13px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  emptyCell: {
    padding: "70px 20px",
    textAlign: "center",
  },

  emptyIcon: {
    fontSize: "42px",
    marginBottom: "10px",
  },

  emptyTitle: {
    margin: 0,
    color: "#555",
  },

  emptyText: {
    color: "#999",
    fontSize: "13px",
  },

  loadingContainer: {
    minHeight: "70vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingIcon: {
    fontSize: "42px",
    marginBottom: "12px",
  },

  loadingTitle: {
    margin: 0,
    color: "#555",
  },

  loadingText: {
    color: "#999",
    fontSize: "13px",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "25px",
    zIndex: 3000,
    boxSizing: "border-box",
  },

  dialog: {
    width: "850px",
    maxWidth: "100%",
    maxHeight: "90vh",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow:
      "0 10px 40px rgba(0,0,0,0.25)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },

  dialogHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "22px 25px",
    borderBottom: "1px solid #eee",
    backgroundColor: "#fff",
  },

  dialogTitle: {
    margin: 0,
    color: "#d81b60",
    fontSize: "22px",
    fontFamily: "Georgia, serif",
  },

  dialogSubtitle: {
    margin: "5px 0 0",
    color: "#999",
    fontSize: "12px",
  },

  closeButton: {
    border: "none",
    backgroundColor: "#f8f8f8",
    color: "#777",
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "14px",
  },

  dialogContent: {
    padding: "25px",
    overflowY: "auto",
  },

  dialogLoading: {
    minHeight: "300px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#777",
  },

  sectionTitle: {
    margin: "0 0 15px",
    color: "#444",
    fontSize: "16px",
  },

  profileCard: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    backgroundColor: "#fdf7f9",
    border: "1px solid #f8e1e8",
    borderRadius: "9px",
    padding: "18px",
  },

  largeAvatar: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    backgroundColor: "#f8bbd0",
    color: "#d81b60",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "700",
    flexShrink: 0,
  },

  profileInfo: {
    minWidth: 0,
  },

  profileName: {
    margin: 0,
    color: "#333",
    fontSize: "19px",
  },

  profileEmail: {
    margin: "4px 0 9px",
    color: "#777",
    fontSize: "13px",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: "12px",
    marginTop: "15px",
    marginBottom: "30px",
  },

  infoBox: {
    backgroundColor: "#fff",
    border: "1px solid #eee",
    borderRadius: "8px",
    padding: "14px",
  },

  infoLabel: {
    display: "block",
    color: "#999",
    fontSize: "11px",
    marginBottom: "7px",
  },

  infoValue: {
    color: "#444",
    fontSize: "15px",
  },

  ordersList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  orderCard: {
    border: "1px solid #eee",
    borderRadius: "8px",
    padding: "14px 16px",
    backgroundColor: "#fff",
  },

  orderMain: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
  },

  orderId: {
    color: "#444",
    fontWeight: "700",
    fontSize: "13px",
  },

  orderDate: {
    color: "#999",
    fontSize: "11px",
    marginTop: "4px",
  },

  orderAmount: {
    color: "#d81b60",
    fontWeight: "700",
    fontSize: "14px",
    whiteSpace: "nowrap",
  },

  orderBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    marginTop: "11px",
    paddingTop: "10px",
    borderTop: "1px solid #f3f3f3",
  },

  paymentText: {
    color: "#888",
    fontSize: "11px",
    textAlign: "right",
  },

  noOrders: {
    textAlign: "center",
    padding: "30px",
    backgroundColor: "#fafafa",
    borderRadius: "8px",
    color: "#888",
    fontSize: "13px",
  },

  noOrdersIcon: {
    fontSize: "30px",
    marginBottom: "8px",
  },

  dialogFooter: {
    borderTop: "1px solid #eee",
    padding: "15px 25px",
    display: "flex",
    justifyContent: "flex-end",
    backgroundColor: "#fafafa",
  },

  closeDialogButton: {
    border: "none",
    backgroundColor: "#555",
    color: "#fff",
    padding: "9px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default AdminUsers;