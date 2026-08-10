import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  // ==========================================
  // ADMIN LOGIN
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await adminLogin(email, password);

      // Admin successfully logged in
      navigate("/admin/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Invalid email or password"
      );
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "80px auto",
        padding: "30px",
        border: "1px solid #eee",
        borderRadius: "12px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
      }}
    >
      <h2
        style={{
          color: "#d81b60",
          textAlign: "center",
          marginBottom: "10px",
        }}
      >
        Admin Login
      </h2>

      <p
        style={{
          textAlign: "center",
          color: "#888",
          marginBottom: "25px",
        }}
      >
        Makeup City Administration
      </p>

      {error && (
        <p
          style={{
            color: "red",
            textAlign: "center",
            marginBottom: "15px",
          }}
        >
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />

        <div
          style={{
            position: "relative",
            marginBottom: "12px",
          }}
        >
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              ...inputStyle,
              marginBottom: 0,
              paddingRight: "40px",
            }}
          />

          <span
            onClick={() =>
              setShowPassword((prev) => !prev)
            }
            style={eyeIconStyle}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <button
          type="submit"
          style={buttonStyle}
        >
          Login as Admin
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  boxSizing: "border-box",
};

const eyeIconStyle = {
  position: "absolute",
  right: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer",
  fontSize: "16px",
  userSelect: "none",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#d81b60",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  fontWeight: "bold",
  cursor: "pointer",
};

export default AdminLogin;