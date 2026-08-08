import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ onOpenCart }) => {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showCategories, setShowCategories] = useState(false);

  const totalItems = cart.reduce(
    (acc, item) => acc + item.qty,
    0
  );

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <nav style={styles.nav}>

        {/* Logo */}

        <Link to="/" style={styles.logo}>
          💄 makeup city
        </Link>

        {/* Navigation Links */}

        <div style={styles.links}>

          <Link
            to="/"
            style={styles.link}
            className="nav-hover"
          >
            Home
          </Link>

          <a
            href="/#products"
            style={styles.link}
            className="nav-hover"
          >
            Products
          </a>

          {/* ABOUT US */}

          <Link
            to="/about"
            style={styles.link}
            className="nav-hover"
          >
            About Us
          </Link>

          {/* Categories */}

          <div
            style={styles.categoryContainer}
            onMouseEnter={() =>
              setShowCategories(true)
            }
            onMouseLeave={() =>
              setShowCategories(false)
            }
          >
            <span
              style={styles.categoryTitle}
              className="category-hover"
            >
              Categories{" "}
              <span style={styles.arrow}>
                ▼
              </span>
            </span>

            {/* Dropdown */}

            {showCategories && (
              <div style={styles.categoryDropdown}>

                <Link
                  to="/category/foundations"
                  style={styles.dropdownLink}
                  className="dropdown-hover"
                >
                  Foundations
                </Link>

                <Link
                  to="/category/concealers"
                  style={styles.dropdownLink}
                  className="dropdown-hover"
                >
                  Concealers
                </Link>

                <Link
                  to="/category/face-powders"
                  style={styles.dropdownLink}
                  className="dropdown-hover"
                >
                  Face Powders
                </Link>

                <Link
                  to="/category/eyeshadow-palettes"
                  style={styles.dropdownLink}
                  className="dropdown-hover"
                >
                  Eyeshadow Palettes
                </Link>

                <Link
                  to="/category/mascaras"
                  style={styles.dropdownLink}
                  className="dropdown-hover"
                >
                  Mascaras
                </Link>

                <Link
                  to="/category/eyeliners"
                  style={styles.dropdownLink}
                  className="dropdown-hover"
                >
                  Eyeliners
                </Link>

                <Link
                  to="/category/lipsticks"
                  style={styles.dropdownLink}
                  className="dropdown-hover"
                >
                  Lipsticks
                </Link>

              </div>
            )}
          </div>

          {/* Favourites */}

          <Link
            to="/favorites"
            style={styles.link}
            className="nav-hover"
          >
            ♡ Favourites
          </Link>

        </div>

        {/* Right Side */}

        <div style={styles.rightSide}>

          {user ? (
            <button
              onClick={handleLogout}
              style={styles.logoutBtn}
              className="logout-hover"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                style={styles.authLink}
                className="login-hover"
              >
                Login
              </Link>

              <Link
                to="/signup"
                style={styles.signupBtn}
                className="signup-hover"
              >
                Sign Up
              </Link>
            </>
          )}

          <button
            onClick={onOpenCart}
            style={styles.cartBtn}
            className="cart-hover"
          >
            🛒 Cart ({totalItems})
          </button>

        </div>

      </nav>

      {/* Greeting */}

      {user && (
        <div style={styles.greetingBar}>
          <span style={styles.greetingText}>
            Hi, {user.name}
          </span>
        </div>
      )}
    </>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 50px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },

  logo: {
    textDecoration: "none",
    fontSize: "29px",
    fontWeight: "bold",
    color: "#d81b60",
    whiteSpace: "nowrap",
  },

  links: {
    display: "flex",
    gap: "25px",
    alignItems: "center",
  },

  link: {
    textDecoration: "none",
    color: "#555",
    fontWeight: "600",
    fontSize: "15px",
    whiteSpace: "nowrap",
  },

  categoryContainer: {
    position: "relative",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    height: "100%",
  },

  categoryTitle: {
    color: "#555",
    fontWeight: "600",
    fontSize: "15px",
    whiteSpace: "nowrap",
  },

  arrow: {
    fontSize: "10px",
    marginLeft: "3px",
  },

  categoryDropdown: {
    position: "absolute",
    top: "100%",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#f5f5f5",
    padding: "16px 22px",
    borderRadius: "10px",
    border: "1px solid #d289a4",
    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "25px",
    whiteSpace: "nowrap",
    zIndex: 1000,
  },

  dropdownLink: {
    textDecoration: "none",
    color: "#555",
    fontSize: "14px",
    fontWeight: "600",
    whiteSpace: "nowrap",
    transition: "color 0.2s",
  },

  rightSide: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  authLink: {
    textDecoration: "none",
    color: "#d81b60",
    fontWeight: "600",
    fontSize: "14px",
    padding: "8px 14px",
  },

  signupBtn: {
    textDecoration: "none",
    border: "1px solid #d81b60",
    color: "#d81b60",
    padding: "8px 16px",
    borderRadius: "20px",
    fontWeight: "600",
    fontSize: "14px",
  },

  logoutBtn: {
    background: "none",
    border: "1px solid #d81b60",
    color: "#d81b60",
    padding: "8px 16px",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },

  cartBtn: {
    backgroundColor: "#d81b60",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "25px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  greetingBar: {
    padding: "8px 50px",
    backgroundColor: "#fdfdfd",
    borderBottom: "1px solid #f8bbd0",
  },

  greetingText: {
    color: "#424040",
    fontWeight: "700",
    fontSize: "25px",
  },
};

export default Navbar;