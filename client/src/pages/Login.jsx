import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "60px auto", padding: "30px", border: "1px solid #eee", borderRadius: "12px" }}>
      <h2 style={{ color: "#d81b60", textAlign: "center" }}>Login</h2>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />

        <div style={{ position: "relative", marginBottom: "12px" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ ...inputStyle, marginBottom: 0, paddingRight: "40px" }}
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            style={eyeIconStyle}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <button type="submit" style={buttonStyle}>Login</button>
      </form>

      <p style={{ textAlign: "center", marginTop: "15px" }}>
        Don't have an account? <a href="/signup" style={{ color: "#d81b60" }}>Sign Up</a>
      </p>
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

export default Login;