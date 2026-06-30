import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { logout } from "../auth/Logout";
import logoImg from "../assets/Hotel Booking App.png";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

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

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMenuOpen(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const renderLinks = () => (
    <>
      <Link style={linkStyle("/")} to="/">Home</Link>
      {isLoggedIn && !isAdmin && (
        <>
          <Link style={linkStyle("/hotels")} to="/hotels">Hotels</Link>
          <Link style={linkStyle("/bookings")} to="/bookings">Bookings</Link>
          <Link style={linkStyle("/UserProfile")} to="/UserProfile">Profile</Link>
          <Link style={linkStyle("/UserReviews")} to="/UserReviews">Reviews</Link>
        </>
      )}
      {isLoggedIn && isAdmin && (
        <>
          <Link style={linkStyle("/admin/hotels")} to="/admin/hotels">Hotels</Link>
          <Link style={linkStyle("/admin/rooms")} to="/admin/rooms">Rooms</Link>
          <Link style={linkStyle("/admin/bookings")} to="/admin/bookings">Bookings</Link>
          <Link style={linkStyle("/admin/reviews")} to="/admin/reviews">Reviews</Link>
          <Link style={linkStyle("/admin/users")} to="/admin/users">Users</Link>
          <Link style={linkStyle("/UserProfile")} to="/UserProfile">Profile</Link>
        </>
      )}
      {isLoggedIn ? (
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      ) : (
        <>
          <Link style={linkStyle("/login")} to="/login">Login</Link>
          <Link style={linkStyle("/register")} to="/register">Register</Link>
        </>
      )}
    </>
  );

  return (
    <nav style={styles.nav}>
      <div style={styles.logoContainer} onClick={() => navigate("/")}>
        <img src={logoImg} alt="logo" style={styles.logoImage} />
        <span style={styles.logoText}>HotelBooking</span>
      </div>

      {isMobile ? (
        <>
          <button
            style={styles.menuButton}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          {menuOpen && (
            <div style={styles.mobileMenu}>
              {renderLinks()}
            </div>
          )}
          {menuOpen && <div style={styles.mobileOverlay} onClick={() => setMenuOpen(false)} />}
        </>
      ) : (
        <div style={styles.links}>{renderLinks()}</div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 18px",
    backgroundColor: "#1e3a8a",
    color: "#facc15",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    flexWrap: "wrap",
    gap: "0.5rem",
  },

  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    flex: "0 0 auto",
  },

  logoImage: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
  },

  logoText: {
    fontSize: "1rem",
    fontWeight: "700",
  },

  links: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    width: "100%",
    paddingTop: "0.5rem",
    maxWidth: "900px",
    marginLeft: "auto",
  },

  menuButton: {
    background: "transparent",
    border: "2px solid #facc15",
    color: "#facc15",
    padding: "8px 12px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "1.2rem",
    fontWeight: "700",
  },

  mobileMenu: {
    position: "absolute",
    top: "70px",
    right: "16px",
    left: "16px",
    backgroundColor: "#1f3d8a",
    borderRadius: "14px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
    zIndex: 150,
  },

  mobileOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    zIndex: 140,
  },

  link: {
    color: "#facc15",
    textDecoration: "none",
    fontWeight: "500",
    padding: "8px 10px",
    borderRadius: "8px",
    display: "inline-block",
  },

  activeLink: {
    color: "#fff",
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  logoutBtn: {
    backgroundColor: "#f59e0b",
    border: "none",
    padding: "8px 14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default NavBar;