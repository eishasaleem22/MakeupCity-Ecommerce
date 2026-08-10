import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const { adminUser, adminLogout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/login");
  };

  return (
    <div className="admin-dashboard-page">

      {/* ================= SIDEBAR ================= */}

      <aside className="admin-dashboard-sidebar">

        {/* LOGO */}

        <div className="admin-logo-section">
          <div className="admin-logo-icon">💄</div>

          <div>
            <div className="admin-logo-text">
              makeup city
            </div>

            <div className="admin-logo-subtitle">
              ADMIN PANEL
            </div>
          </div>
        </div>


        {/* NAVIGATION */}

        <nav className="admin-dashboard-navigation">

          <button
            className="admin-nav-item admin-nav-item-active"
            onClick={() => navigate("/admin/dashboard")}
          >
            <span className="admin-nav-icon">🏠</span>
            <span>Dashboard</span>
          </button>


          <button
            className="admin-nav-item"
            onClick={() => navigate("/admin/products")}
          >
            <span className="admin-nav-icon">📦</span>
            <span>Products</span>
          </button>


          <button
            className="admin-nav-item"
            onClick={() => navigate("/admin/orders")}
          >
            <span className="admin-nav-icon">🛒</span>
            <span>Orders</span>
          </button>


          <button
            className="admin-nav-item"
            onClick={() => navigate("/admin/users")}
          >
            <span className="admin-nav-icon">👥</span>
            <span>Users</span>
          </button>


          <button
            className="admin-nav-item"
            onClick={() => navigate("/admin/analytics")}
          >
            <span className="admin-nav-icon">📊</span>
            <span>Analytics</span>
          </button>

        </nav>


        {/* BOTTOM NAVIGATION */}

        <div className="admin-dashboard-bottom">

          <button
            className="admin-nav-item"
            onClick={() => navigate("/admin/settings")}
          >
            <span className="admin-nav-icon">⚙️</span>
            <span>Settings</span>
          </button>


          <button
            className="admin-nav-item admin-logout-item"
            onClick={handleLogout}
          >
            <span className="admin-nav-icon">🚪</span>
            <span>Logout</span>
          </button>

        </div>

      </aside>


      {/* ================= MAIN CONTENT ================= */}

      <main className="admin-dashboard-main">

        {/* ================= HEADER ================= */}

        <header className="admin-dashboard-header">

          <div>
            <h1 className="admin-page-title">
              Dashboard
            </h1>

            <p className="admin-page-subtitle">
              Welcome back to Makeup City Administration
            </p>
          </div>


          {/* ADMIN PROFILE */}

          <div className="admin-profile-section">

            <div className="admin-profile-circle">
              {adminUser?.name
                ? adminUser.name.charAt(0).toUpperCase()
                : "M"}
            </div>

            <div>
              <div className="admin-profile-name">
                {adminUser?.name || "Makeup City Admin"}
              </div>

              <div className="admin-profile-role">
                Admin
              </div>
            </div>

          </div>

        </header>


        {/* ================= DASHBOARD BODY ================= */}

        <div className="admin-dashboard-body">

          {/* WELCOME */}

          <section className="admin-welcome-section">

            <h2 className="admin-welcome-title">
              Hi, {adminUser?.name || "Makeup City Admin"} 👋
            </h2>

            <p className="admin-welcome-text">
              Welcome to the Makeup City administration panel.
              Manage your products, orders and customers from here.
            </p>

          </section>


          {/* ================= STAT CARDS ================= */}

          <section className="admin-dashboard-stats">

            {/* PRODUCTS */}

            <div className="admin-stat-card">

              <div className="admin-stat-icon">
                📦
              </div>

              <div>
                <p className="admin-stat-label">
                  Total Products
                </p>

                <h2 className="admin-stat-number">
                  0
                </h2>
              </div>

            </div>


            {/* ORDERS */}

            <div className="admin-stat-card">

              <div className="admin-stat-icon">
                🛒
              </div>

              <div>
                <p className="admin-stat-label">
                  Total Orders
                </p>

                <h2 className="admin-stat-number">
                  0
                </h2>
              </div>

            </div>


            {/* USERS */}

            <div className="admin-stat-card">

              <div className="admin-stat-icon">
                👥
              </div>

              <div>
                <p className="admin-stat-label">
                  Total Users
                </p>

                <h2 className="admin-stat-number">
                  0
                </h2>
              </div>

            </div>


            {/* REVENUE */}

            <div className="admin-stat-card">

              <div className="admin-stat-icon">
                💰
              </div>

              <div>
                <p className="admin-stat-label">
                  Total Revenue
                </p>

                <h2 className="admin-stat-number">
                  Rs. 0
                </h2>
              </div>

            </div>

          </section>


          {/* ================= QUICK MANAGEMENT ================= */}

          <section className="admin-management-section">

            <h2 className="admin-section-title">
              Quick Management
            </h2>

            <p className="admin-section-subtitle">
              Manage different parts of your Makeup City store.
            </p>


            <div className="admin-management-grid">

              {/* PRODUCTS */}

              <div className="admin-management-card">

                <div className="admin-management-icon">
                  📦
                </div>

                <h3 className="admin-management-title">
                  Manage Products
                </h3>

                <p className="admin-management-text">
                  Add, edit and delete products from your store.
                </p>

                <button
                  className="admin-management-button"
                  onClick={() => navigate("/admin/products")}
                >
                  Manage Products
                </button>

              </div>


              {/* ORDERS */}

              <div className="admin-management-card">

                <div className="admin-management-icon">
                  🛍️
                </div>

                <h3 className="admin-management-title">
                  Manage Orders
                </h3>

                <p className="admin-management-text">
                  View and manage customer orders.
                </p>

                <button
                  className="admin-management-button"
                  onClick={() => navigate("/admin/orders")}
                >
                  Manage Orders
                </button>

              </div>


              {/* USERS */}

              <div className="admin-management-card">

                <div className="admin-management-icon">
                  👥
                </div>

                <h3 className="admin-management-title">
                  Manage Users
                </h3>

                <p className="admin-management-text">
                  View and manage registered customers.
                </p>

                <button
                  className="admin-management-button"
                  onClick={() => navigate("/admin/users")}
                >
                  Manage Users
                </button>

              </div>


              {/* ANALYTICS */}

              <div className="admin-management-card">

                <div className="admin-management-icon">
                  📊
                </div>

                <h3 className="admin-management-title">
                  View Analytics
                </h3>

                <p className="admin-management-text">
                  Monitor your store's performance and sales.
                </p>

                <button
                  className="admin-management-button"
                  onClick={() => navigate("/admin/analytics")}
                >
                  View Analytics
                </button>

              </div>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default AdminDashboard;