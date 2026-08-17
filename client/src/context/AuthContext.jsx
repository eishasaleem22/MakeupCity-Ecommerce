import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD SAVED LOGIN INFORMATION
  // ==========================================

  useEffect(() => {
    // ------------------------------
    // Load normal customer
    // ------------------------------

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);

        // An admin should never be stored
        // as a normal customer.
        if (parsedUser.role === "admin") {
          localStorage.removeItem("user");
        } else {
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Error reading stored user:", error);
        localStorage.removeItem("user");
      }
    }

    // ------------------------------
    // Load admin separately
    // ------------------------------

    const storedAdmin = localStorage.getItem("adminUser");

    if (storedAdmin) {
      try {
        const parsedAdmin = JSON.parse(storedAdmin);

        if (parsedAdmin.role === "admin") {
          setAdminUser(parsedAdmin);
        } else {
          localStorage.removeItem("adminUser");
        }
      } catch (error) {
        console.error("Error reading stored admin:", error);
        localStorage.removeItem("adminUser");
      }
    }

    setLoading(false);
  }, []);

  // ==========================================
  // CUSTOMER REGISTER
  // ==========================================

  const register = async (name, email, password) => {
    const { data } = await axios.post(
      "http://makeup-city-backend.vercel.app/api/auth/register",
      {
        name,
        email,
        password,
      }
    );

    // Make sure there is no admin session
    // when registering as a customer.
    localStorage.removeItem("adminUser");
    setAdminUser(null);

    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);

    return data;
  };

  // ==========================================
  // CUSTOMER LOGIN
  // ==========================================

  const login = async (email, password) => {
    const { data } = await axios.post(
      "http://makeup-city-backend.vercel.app/api/auth/login",
      {
        email,
        password,
      }
    );

    // Customer login should never create
    // or keep an admin session.
    localStorage.removeItem("adminUser");
    setAdminUser(null);

    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);

    return data;
  };

  // ==========================================
  // ADMIN LOGIN
  // ==========================================

  const adminLogin = async (email, password) => {
    const { data } = await axios.post(
      "http://makeup-city-backend.vercel.app/api/auth/login",
      {
        email,
        password,
      }
    );

    // Make sure the account is actually an admin.
    if (data.role !== "admin") {
      throw new Error(
        "Access denied. This account is not an admin account."
      );
    }

    // Remove normal customer session.
    localStorage.removeItem("user");
    setUser(null);

    // Save admin separately.
    localStorage.setItem("adminUser", JSON.stringify(data));
    setAdminUser(data);

    return data;
  };

  // ==========================================
  // CUSTOMER LOGOUT
  // ==========================================

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // ==========================================
  // ADMIN LOGOUT
  // ==========================================

  const adminLogout = () => {
    localStorage.removeItem("adminUser");
    setAdminUser(null);
  };

  // ==========================================
  // LOGOUT CURRENT SESSION
  // ==========================================
  //
  // This is useful because AdminDashboard
  // can simply call logout(), and the correct
  // session will be cleared automatically.
  //
  // ==========================================

  const logoutCurrentUser = () => {
    if (adminUser) {
      localStorage.removeItem("adminUser");
      setAdminUser(null);
    }

    if (user) {
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  // ==========================================
  // CONTEXT
  // ==========================================

  return (
    <AuthContext.Provider
      value={{
        user,
        adminUser,
        loading,

        register,

        login,
        adminLogin,

        logout,
        adminLogout,
        logoutCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);