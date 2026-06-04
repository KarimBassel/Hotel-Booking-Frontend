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

      const role = decoded.role || decoded.roles?.[0];
      isAdmin = role === "ADMIN";
    } catch (e) {
      console.log("Invalid token");
    }
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const linkStyle = (path) => ({
    ...styles.link,
    ...(isActive(path) ? styles.activeLink : {}),
  });

  return (
    <nav style={styles.nav}>
      {/* LOGO */}
      <div style={styles.logoContainer} onClick={() => navigate("/")}>
        <img src={logoImg} alt="logo" style={styles.logoImage} />
        <span style={styles.logoText}>HotelBooking</span>
      </div>

      {/* LINKS */}
      <div style={styles.links}>
        <Link style={linkStyle("/")} to="/">Home</Link>
        {/* USER */}
        {isLoggedIn && !isAdmin && (
          <>
            <Link style={linkStyle("/hotels")} to="/hotels">Hotels</Link>
            <Link style={linkStyle("/bookings")} to="/bookings">
              Bookings
            </Link>
            <Link style={linkStyle("/UserProfile")} to="/UserProfile">
              Profile
            </Link>
            <Link style={linkStyle("/UserReviews")} to="/UserReviews">
              Reviews
            </Link>
          </>
        )}
        {/* ADMIN */}
        {isLoggedIn && isAdmin && (
          <>
            <Link style={linkStyle("/admin/hotels")} to="/admin/hotels">
              Hotels
            </Link>
            <Link style={linkStyle("/admin/rooms")} to="/admin/rooms">
              Rooms
            </Link>
            <Link style={linkStyle("/admin/bookings")} to="/admin/bookings">
              Bookings
            </Link>
            <Link style={linkStyle("/admin/reviews")} to="/admin/reviews">
              Reviews
            </Link>
            <Link style={linkStyle("/admin/users")} to="/admin/users">
              Users
            </Link>
            <Link style={linkStyle("/UserProfile")} to="/UserProfile">
              Profile
            </Link>
          </>
        )}

        {/* AUTH */}
        {isLoggedIn ? (
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            <Link style={linkStyle("/login")} to="/login">Login</Link>
            <Link style={linkStyle("/register")} to="/register">Register</Link>
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
    padding: "12px 28px",
    backgroundColor: "#1e3a8a",
    color: "#facc15",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    flexWrap: "wrap",
  },

  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
  },

  logoImage: {
    width: "40px",
    height: "40px",
    borderRadius: "8px",
  },

  logoText: {
    fontSize: "20px",
    fontWeight: "700",
  },

  links: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    flexWrap: "wrap",
  },

  link: {
    color: "#facc15",
    textDecoration: "none",
    fontWeight: "500",
    padding: "6px 8px",
    borderRadius: "6px",
  },

  activeLink: {
    color: "#fff",
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  logoutBtn: {
    backgroundColor: "#f59e0b",
    border: "none",
    padding: "7px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default NavBar;