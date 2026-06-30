import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHotels } from "../api/hotelsApi";
import colors from "../styles/colors";

const Hotels = () => {
  const navigate = useNavigate();

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //Hotels will be rendered only once because dependency array is empty, so useEffect will run only once after the initial render
  //This prevents unnecessary API calls and improves performance by avoiding repeated fetching of the same data.
  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    try {
      const res = await getHotels();
      setHotels(res.data);
    } catch (err) {
      setError("Could not load hotels");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p style={styles.center}>Loading hotels...</p>;
  if (error) {
    return (
      <div style={styles.errorPage}>
        <div style={styles.error}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Available Hotels</h1>

      {(hotels.length === 0 && error == "") ? (
        <p style={styles.center}>No hotels available</p>
      ) : (
        <div style={styles.grid}>
          {hotels.map((hotel) => (
            <div
              key={hotel.id}
              style={styles.card}
              onClick={() => navigate(`/hotels/${hotel.id}`)}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              {hotel.image_url ? (
                <img
                  src={hotel.image_url}
                  alt={hotel.name || "Hotel image"}
                  style={styles.image}
                  onError={(e) => {
                    // hide broken image so placeholder shows (if any)
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div style={styles.image}></div>
              )}

              <h3 style={styles.hotelName}>{hotel.name}</h3>
              <p style={styles.location}>{hotel.location}</p>
              <p style={styles.description}>{hotel.description}</p>

              <div style={styles.footer}>
                <span style={styles.rating}>⭐ {hotel.averageRating.toFixed(1)}</span>
                <span style={styles.roomsBadge}>
                  {hotel.Rooms ? hotel.Rooms.length : 0} rooms
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "clamp(1rem, 3vw, 2rem)",
    fontFamily: "Arial, sans-serif",
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    boxSizing: "border-box",
  },
  title: {
    textAlign: "center",
    marginBottom: "1.25rem",
    color: colors.primary,
    fontSize: "clamp(1.5rem, 3vw, 2rem)",
  },
  center: {
    textAlign: "center",
    marginTop: "2.5rem",
    fontSize: "clamp(1rem, 2vw, 1.125rem)",
    color: colors.textDark,
  },
  homeButton: {
    marginBottom: "1.25rem",
    padding: "0.7rem 1.25rem",
    backgroundColor: colors.primary,
    color: colors.textLight,
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "0.2s",
    width: "fit-content",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "clamp(1rem, 2vw, 1.25rem)",
    justifyContent: "center",
  },
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: "12px",
    boxShadow: `0 4px 12px ${colors.cardShadow}`,
    padding: "1rem",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    width: "100%",
    maxWidth: "520px",
    margin: "0 auto",
  },
  image: {
    width: "100%",
    height: "clamp(120px, 26vw, 160px)",
    backgroundColor: colors.placeholder,
    borderRadius: "8px",
    marginBottom: "0.7rem",
    objectFit: "cover",
  },
  hotelName: {
    margin: "0.35rem 0",
    fontSize: "clamp(1rem, 2vw, 1.25rem)",
    color: colors.textDark,
  },
  location: {
    margin: "0.2rem 0",
    color: "#555",
    fontSize: "0.875rem",
  },
  description: {
    fontSize: "0.875rem",
    color: "#666",
    margin: "0.7rem 0",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "0.7rem",
    gap: "0.5rem",
    flexWrap: "wrap",
  },
  rating: {
    fontWeight: "bold",
    color: colors.accent,
  },
  roomsBadge: {
    backgroundColor: colors.primary,
    color: colors.textLight,
    padding: "0.15rem 0.5rem",
    borderRadius: "8px",
    fontSize: "0.75rem",
  },
  error: {
    marginBottom: "1rem",
    padding: "0.8rem",
    borderRadius: "8px",
    background: "#fee2e2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
    textAlign: "center",
  },
  errorPage: {
    minHeight: "100dvh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f1f5f9",
    padding: "1rem",
  },
};

export default Hotels;
