import AdminSidebar from "./AdminSidebar";

function AdminLayout({ children }) {
  return (
    <div style={styles.container}>
      {/* ================= ADMIN SIDEBAR ================= */}

      <AdminSidebar />

      {/* ================= ADMIN MAIN CONTENT ================= */}

      <main style={styles.main}>
        {children}
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#fdf7f9",
  },

  main: {
    marginLeft: "250px",
    minHeight: "100vh",
    boxSizing: "border-box",
  },
};

export default AdminLayout;