import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminSidebar() {
  const { adminLogout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/login");
  };

  const menuItems = [
    {
      label: "Dashboard",
      icon: "🏠",
      path: "/admin/dashboard",
    },
    {
      label: "Products",
      icon: "📦",
      path: "/admin/products",
    },
    {
      label: "Orders",
      icon: "🛒",
      path: "/admin/orders",
    },
    {
      label: "Users",
      icon: "👥",
      path: "/admin/users",
    },
    {
      label: "Analytics",
      icon: "📊",
      path: "/admin/analytics",
    },
  ];

  return (
    <aside style={styles.sidebar}>

      {/* LOGO */}
      <div style={styles.logoSection}>
        <div style={styles.logoIcon}>💄</div>

        <div>
          <h2 style={styles.logoText}>
            makeup city
          </h2>

          <p style={styles.logoSubtitle}>
            ADMIN PANEL
          </p>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav style={styles.nav}>

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              ...styles.navItem,
              ...(isActive ? styles.activeNavItem : {}),
            })}
          >
            <span style={styles.navIcon}>
              {item.icon}
            </span>

            <span>
              {item.label}
            </span>
          </NavLink>
        ))}

      </nav>

      {/* BOTTOM SECTION */}
      <div style={styles.bottomSection}>

        <button
          onClick={() => navigate("/admin/settings")}
          style={styles.bottomItem}
        >
          <span style={styles.navIcon}>
            ⚙️
          </span>

          Settings
        </button>

        <button
          onClick={handleLogout}
          style={{
            ...styles.bottomItem,
            ...styles.logoutItem,
          }}
        >
          <span style={styles.navIcon}>
            🚪
          </span>

          Logout
        </button>

      </div>

    </aside>
  );
}

const styles = {
  sidebar: {
    position: "fixed",
    left: 0,
    top: 0,
    width: "250px",
    height: "100vh",
    backgroundColor: "#fff",
    borderRight: "1px solid #f8bbd0",
    display: "flex",
    flexDirection: "column",
    zIndex: 1000,
    boxSizing: "border-box",
  },

  logoSection: {
    padding: "25px 20px",
    borderBottom: "1px solid #f8bbd0",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  logoIcon: {
    fontSize: "30px",
  },

  logoText: {
    margin: 0,
    color: "#d81b60",
    fontSize: "23px",
    fontFamily: "Georgia, serif",
  },

  logoSubtitle: {
    margin: "3px 0 0",
    color: "#999",
    fontSize: "10px",
    letterSpacing: "2px",
    fontWeight: "600",
  },

  nav: {
    padding: "20px 12px",
    flex: 1,
  },

  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    textDecoration: "none",
    color: "#555",
    padding: "13px 15px",
    marginBottom: "6px",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    transition: "all 0.2s ease",
  },

  activeNavItem: {
    backgroundColor: "#fce4ec",
    color: "#d81b60",
  },

  navIcon: {
    fontSize: "19px",
    width: "25px",
    textAlign: "center",
  },

  bottomSection: {
    borderTop: "1px solid #f8bbd0",
    padding: "15px 12px",
  },

  bottomItem: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "13px 15px",
    border: "none",
    backgroundColor: "transparent",
    color: "#555",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    textAlign: "left",
    marginBottom: "5px",
  },

  logoutItem: {
    color: "#d81b60",
  },
};

export default AdminSidebar;