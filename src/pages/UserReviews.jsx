import { useEffect, useState } from "react";
import { getUserReviews } from "../api/reviewApi";
import colors from "../styles/colors";

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const res = await getUserReviews();
      setReviews(res.data || []);
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        style={{
          color: i < rating ? "#ca8a04" : "#d1d5db",
          fontSize: 18,
        }}
      >
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <p style={styles.center}>
        Loading reviews...
      </p>
    );
  }

  if (reviews.length === 0) {
    return (
      <p style={styles.center}>
        You have no reviews yet.
      </p>
    );
  }


  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        My Reviews
      </h1>

      <div style={styles.grid}>
        {reviews.map((r) => (
          <div key={r.id} style={styles.card}>
            
            {/* HOTEL NAME */}
            <h3 style={styles.hotelName}>
              {r.hotelName}
            </h3>

            {/* STARS */}
            <div style={styles.stars}>
              {renderStars(r.review)}
              <span style={styles.ratingText}>
                {r.review}/5
              </span>
            </div>

            {/* COMMENT */}
            <p style={styles.comment}>
              {r.comment || "No comment provided"}
            </p>

            {/* FOOTER */}
            <div style={styles.footer}>
              <span style={styles.date}>
                {new Date(
                  r.createdAt
                ).toLocaleDateString()}
              </span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};



const styles = {
  container: {
    maxWidth: 900,
    margin: "40px auto",
    padding: 20,
    fontFamily: "Arial",
  },

  title: {
    marginBottom: 20,
    color: colors.textDark,
  },

  center: {
    textAlign: "center",
    marginTop: 40,
    color: "#6b7280",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 16,
  },

  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 16,
    boxShadow:
      "0 8px 20px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  hotelName: {
    margin: 0,
    color: colors.primary,
  },

  stars: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },

  ratingText: {
    marginLeft: 6,
    fontSize: 13,
    color: "#6b7280",
  },

  comment: {
    margin: 0,
    color: "#374151",
    fontSize: 14,
    lineHeight: 1.4,
  },

  footer: {
    marginTop: "auto",
    display: "flex",
    justifyContent: "flex-end",
  },

  date: {
    fontSize: 12,
    color: "#9ca3af",
  },
};

export default UserReviews;