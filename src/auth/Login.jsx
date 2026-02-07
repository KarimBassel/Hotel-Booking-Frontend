import { useState } from "react";
import api from "../api/axios";
import logo from "../assets/Hotel Booking App.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const login = async () => {
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      const res = await api.post(
        "/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      console.log(res.data);
      setSuccess(true);
    } catch (err) {
      console.error("login error:", err);
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    login();
  };

  const styles = {
    container: {
      maxWidth: 420,
      margin: 0,
      padding: 24,
      backgroundColor: "#ffffff",
      border: "1px solid #e6eef8",
      borderRadius: 12,
      boxShadow: "0 8px 30px rgba(16,24,40,0.08)",
      fontFamily:
        "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    },
    label: { display: "block", marginBottom: 6, fontSize: 13, color: "#374151" },
    input: {
      width: "100%",
      padding: "12px 14px",
      marginBottom: 12,
      borderRadius: 8,
      border: "1px solid #d1d5db",
      backgroundColor: "#f8fafc",
      fontSize: 14,
      boxSizing: "border-box",
      outline: "none",
      color: "#0f172a",
      caretColor: "#2563eb",
    },
    button: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: 8,
      border: "none",
      background: "linear-gradient(90deg,#2563eb,#06b6d4)",
      color: "#fff",
      fontSize: 15,
      cursor: "pointer",
      boxShadow: "0 6px 18px rgba(37,99,235,0.12)",
      transition: "transform 80ms ease, box-shadow 120ms ease",
    },
    meta: { marginTop: 10, fontSize: 13, color: "#6b7280" },
    error: { color: "#ef4444", marginTop: 10 },
    success: { color: "#059669", marginTop: 10 },
  };

  return (
    <>
      {/* placeholder color for inputs */}
      <style>{`input::placeholder { color: #94a3b8; opacity: 1; } input { color: #0f172a; }`}</style>

      {/* existing wrapper */}
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
          width: "100vw",
          background: "#f3f4f6",
        }}
      >
        <div style={styles.container}>
          <img
            src={logo}
            alt="Hotel Booking App"
            style={{
              width: 84,
              height: "auto",
              display: "block",
              margin: "0 auto 12px",
            }}
          />
          <h2
            style={{
              margin: 0,
              marginBottom: 12,
              color: "#0f172a",
              textAlign: "center",
            }}
          >
            Login
          </h2>

          <form onSubmit={handleSubmit}>
            <label htmlFor="email" style={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              aria-label="Email"
            />

            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              aria-label="Password"
            />

            <button
              type="submit"
              style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <button
              type="button"
              onClick={() => (window.location.href = "/register")}
              style={{
                marginTop: 10,
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #e6eef8",
                background: "#fff",
                color: "#2563eb",
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Create account
            </button>
          </form>

          <div style={styles.meta}>
            {error && <div style={styles.error}>{error}</div>}
            {success && <div style={styles.success}>Login successful.</div>}
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
