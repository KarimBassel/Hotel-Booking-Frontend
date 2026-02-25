import { useState } from "react";
import api from "../api/axios";
import logo from "../assets/Hotel Booking App.png";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const register = async () => {
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      const res = await api.post(
        "/api/auth/register",
        { name, email, password, phonenumber },
        { withCredentials: true }
      );

      console.log(res.data);
      setSuccess(true);
      //Reset fields on refresh
      setName("");
      setEmail("");
      setPassword("");
      setConfirm("");
      setPhonenumber("");
    } catch (err) {
      console.error("register error:", err);
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password || !phonenumber) {
      setError("Please fill all required fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    register();
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
      <style>{`input::placeholder { color: #94a3b8; opacity: 1; } input { color: #0f172a; }`}</style>

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
          width: "100%",
          background: "#f3f4f6",
          boxSizing: "border-box",
        }}
      >
        <div style={styles.container}>
          <img
            src={logo}
            alt="Hotel Booking App"
            style={{ width: 84, height: "auto", display: "block", margin: "0 auto 12px" }}
          />

          <h2 style={{ margin: 0, marginBottom: 12, color: "#0f172a", textAlign: "center" }}>
            Create account
          </h2>

          <form onSubmit={handleSubmit}>
            <label htmlFor="name" style={styles.label}>
              Full name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              aria-label="Full name"
            />

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

            <label htmlFor="confirm" style={styles.label}>
              Confirm password
            </label>
            <input
              id="confirm"
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              style={styles.input}
              aria-label="Confirm password"
            />

            <label htmlFor="phonenumber" style={styles.label}>
              Phone number
            </label>
            <input
              id="phonenumber"
              type="tel"
              placeholder="e.g. +1234567890"
              value={phonenumber}
              onChange={(e) => setPhonenumber(e.target.value)}
              style={styles.input}
              aria-label="Phone number"
            />

            <button type="submit" style={{ ...styles.button, opacity: loading ? 0.7 : 1 }} disabled={loading}>
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => (window.location.href = "/login")}
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
            Back to login
          </button>

          <div style={styles.meta}>
            {error && <div style={styles.error}>{error}</div>}
            {success && <div style={styles.success}>Account created.</div>}
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
