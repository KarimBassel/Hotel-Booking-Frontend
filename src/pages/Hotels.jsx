import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHotels } from "../api/hotelsApi";
import colors from "../styles/colors";

const Hotels = () => {
  const navigate = useNavigate();

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
  if (error) return <p style={styles.center}>{error}</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Available Hotels</h1>

      <button style={styles.homeButton} onClick={() => navigate("/")}>
        ← Back to Home
      </button>

      {hotels.length === 0 ? (
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
    padding: "30px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: colors.primary,
  },
  center: {
    textAlign: "center",
    marginTop: "40px",
    fontSize: "18px",
    color: colors.textDark,
  },
  homeButton: {
    marginBottom: "20px",
    padding: "10px 20px",
    backgroundColor: colors.primary,
    color: colors.textLight,
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "0.2s",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: "12px",
    boxShadow: `0 4px 12px ${colors.cardShadow}`,
    padding: "16px",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  image: {
    width: "100%",
    height: "140px",
    backgroundColor: colors.placeholder,
    borderRadius: "8px",
    marginBottom: "10px",
  },
  hotelName: {
    margin: "5px 0",
    fontSize: "20px",
    color: colors.textDark,
  },
  location: {
    margin: "3px 0",
    color: "#555",
    fontSize: "14px",
  },
  description: {
    fontSize: "14px",
    color: "#666",
    margin: "10px 0",
    // multiline truncation with ellipsis
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
    marginTop: "10px",
  },
  rating: {
    fontWeight: "bold",
    color: colors.accent,
  },
  roomsBadge: {
    backgroundColor: colors.primary,
    color: colors.textLight,
    padding: "2px 8px",
    borderRadius: "8px",
    fontSize: "12px",
  },
};

export default Hotels;
