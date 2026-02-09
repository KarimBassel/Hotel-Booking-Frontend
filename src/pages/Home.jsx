import { useNavigate } from "react-router-dom";
import { logout } from "../auth/Logout";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1>Welcome 👋</h1>
      <p>You are logged in successfully.</p>

      <div style={styles.navButtons}>
        <button onClick={() => navigate("/hotels")} style={styles.navButton}>
          Hotels
        </button>

        <button onClick={() => navigate("/bookings")} style={styles.navButton}>
          My Bookings
        </button>
      </div>

      <button onClick={logout} style={styles.logoutButton}>
        Logout
      </button>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
  },
  navButtons: {
    display: "flex",
    gap: "12px",
  },
  navButton: {
    padding: "10px 20px",
    backgroundColor: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  logoutButton: {
    padding: "10px 20px",
    backgroundColor: "#d32f2f",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default Home;
