import { Link, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { logout } from "../auth/Logout";
import logoImg from "../assets/Hotel Booking App.png";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");

  let isLoggedIn = false;
  let isAdmin = false;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      isLoggedIn = true;

      if (decoded.role) {
        isAdmin = decoded.role === "ADMIN";
      } else if (decoded.roles) {
        isAdmin = decoded.roles.includes("ADMIN");
      }
    } catch (error) {
      console.log("Invalid token");
    }
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname === path ||
    location.pathname.startsWith(path + "/");

  const linkStyle = (path) => ({
    ...styles.link,
    ...(isActive(path) ? styles.activeLink : {}),
  });

  return (
    <nav style={styles.nav}>
      <div style={styles.logoContainer} onClick={() => navigate("/")}>
        <img src={logoImg} alt="Logo" style={styles.logoImage} />
        <span style={styles.logoText}>HotelBooking</span>
      </div>

      <div style={styles.links}>
        <Link style={linkStyle("/")} to="/">Home</Link>
        <Link style={linkStyle("/hotels")} to="/hotels">Hotels</Link>

        {isLoggedIn && (
          <>
            <Link style={linkStyle("/bookings")} to="/bookings">
              Bookings
            </Link>

            <Link style={linkStyle("/profile")} to="/UserProfile">
              Profile
            </Link>

            {isAdmin && (
              <>
                <Link style={linkStyle("/admin/add-hotel")} to="/admin/add-hotel">
                  Add Hotel
                </Link>
                <Link style={linkStyle("/admin/add-room")} to="/admin/add-room">
                  Add Room
                </Link>
                <Link style={linkStyle("/admin/bookings")} to="/admin/bookings">
                  Manage Bookings
                </Link>
              </>
            )}

            <button style={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </>
        )}

        {!isLoggedIn && (
          <>
            <Link style={linkStyle("/login")} to="/login">
              Login
            </Link>
            <Link style={linkStyle("/register")} to="/register">
              Register
            </Link>
          </>
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
    backgroundColor: "#1e3a8a", // 🔵 YOUR ORIGINAL BLUE
    color: "#facc15",
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
    color: "#facc15", // 🟡 GOLD
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  link: {
    color: "#facc15", // 🟡 GOLD
    textDecoration: "none",
    fontWeight: "500",
    transition: "0.2s ease",
  },
  activeLink: {
    textDecoration: "underline",
    color: "#ffffff",
  },
  logoutBtn: {
    backgroundColor: "#f59e0b", // 🟠 GOLD BUTTON
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    color: "#1e3a8a",
    cursor: "pointer",
    fontWeight: "500",
  },
};

export default NavBar;