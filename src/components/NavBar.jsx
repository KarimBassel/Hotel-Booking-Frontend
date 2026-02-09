import { Link, useNavigate } from "react-router-dom";
import * as jwtDecode from "jwt-decode"; 
import { logout } from "../auth/Logout";

// Import the logo image
import logoImg from "../assets/Hotel Booking App.png";

const NavBar = () => {
  const navigate = useNavigate();

  // Check JWT
  const token = localStorage.getItem("token");
  let isLoggedIn = false;
  let isAdmin = false;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      isLoggedIn = true;
      isAdmin = decoded.role === "ADMIN";
    } catch (err) {
      console.log("Invalid token");
    }
  }

  const handleLogout = () => {
    logout(); // remove token
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logoContainer} onClick={() => navigate("/")}>
        <img src={logoImg} alt="Logo" style={styles.logoImage} />
        <span style={styles.logoText}>HotelBooking</span>
      </div>

      <div style={styles.links}>
        {isLoggedIn && <Link style={styles.link} to="/">Home</Link>}
        {isLoggedIn && <Link style={styles.link} to="/hotels">Hotels</Link>}
        {isLoggedIn && <Link style={styles.link} to="/bookings">Bookings</Link>}

        {isAdmin && <Link style={styles.link} to="/admin">Admin</Link>}

        {!isLoggedIn && <Link style={styles.link} to="/login">Login</Link>}
        {!isLoggedIn && <Link style={styles.link} to="/register">Register</Link>}

        {isLoggedIn && (
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 30px",
    backgroundColor: "#1e3a8a", // deep blue, matches hotel vibe
    color: "#facc15", // golden-yellow accents
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    gap: "10px",
  },
  logoImage: {
    width: "40px",
    height: "40px",
    borderRadius: "8px",
    objectFit: "cover",
  },
  logoText: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#facc15", // golden like the logo
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  link: {
    color: "#facc15", // golden links
    textDecoration: "none",
    fontWeight: "500",
    transition: "0.2s",
  },
  logoutBtn: {
    backgroundColor: "#f59e0b", // warm orange-gold
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    color: "#1e3a8a", // deep blue text on button
    cursor: "pointer",
    fontWeight: "500",
  },
};


export default NavBar;
