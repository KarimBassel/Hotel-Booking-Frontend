import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "../api/axios";
import { getHotelById } from "../api/hotelsApi";
import { getHotelReviews } from "../api/reviewApi";

import colors from "../styles/colors";
import placeholder from "../assets/react.svg";

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const apiBase = api.defaults?.baseURL || "";

  const getImageSrc = (img) => {
    if (!img) return null;

    return img.startsWith("http")
      ? img
      : `${apiBase}${img.startsWith("/") ? img : "/" + img}`;
  };

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const hotelRes = await getHotelById(id);
        setHotel(hotelRes.data);

        const reviewRes = await getHotelReviews(id);
        setReviews(reviewRes.data || []);
      } catch (err) {
        console.error(err);
        setError("Could not load hotel details.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading)
    return <p style={styles.center}>Loading hotel...</p>;

  if (error)
    return <p style={styles.center}>{error}</p>;

  if (!hotel)
    return <p style={styles.center}>Hotel not found</p>;

  const hotelImage = getImageSrc(hotel.image_url);

  return (
    <div style={styles.container}>
      <button
        onClick={() => navigate(-1)}
        style={styles.backButton}
      >
        ← Back
      </button>

      {/* ================= HOTEL HEADER ================= */}
      <div style={styles.header}>
        <img
          src={hotelImage || placeholder}
          alt={hotel.name}
          style={styles.hero}
          onError={(e) =>
            (e.currentTarget.src = placeholder)
          }
        />

        <div style={styles.headerMeta}>
          <h1 style={styles.title}>
            {hotel.name}
          </h1>

          <p style={styles.location}>
            {hotel.location}
          </p>

          <div style={styles.metaRow}>
            <strong style={styles.price}>
              {hotel.price ? `$${hotel.price}` : ""}
            </strong>

            <span style={styles.rating}>
              ⭐{" "}
              {hotel.averageRating
                ? hotel.averageRating.toFixed(1)
                : "—"}
            </span>
          </div>

          <p style={styles.descriptionFull}>
            {hotel.description}
          </p>
        </div>
      </div>

      {/* ================= ROOMS ================= */}
      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>Rooms</h3>

        {hotel.Rooms?.length > 0 ? (
          <div style={styles.roomsGrid}>
            {hotel.Rooms.map((room) => {
              const roomImg = getImageSrc(
                room.image_url ||
                  room.imageUrl ||
                  room.image
              );

              return (
                <div
                  key={room.id}
                  style={styles.roomCard}
                >
                  <img
                    src={roomImg || placeholder}
                    alt={`Room ${room.roomNumber}`}
                    style={styles.roomThumb}
                    onError={(e) =>
                      (e.currentTarget.src =
                        placeholder)
                    }
                  />

                  <div style={styles.roomHeader}>
                    <div>
                      <div style={{ fontWeight: 700 }}>
                        Room{" "}
                        {room.roomNumber ?? room.id}
                      </div>

                      <div
                        style={{
                          color: "#6b7280",
                          fontSize: 13,
                        }}
                      >
                        {room.type || "Room"}
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div style={styles.roomPrice}>
                        ${room.price}
                      </div>

                      <div style={{ marginTop: 6 }}>
                        {room.availability === false ||
                        room.availability === "false" ? (
                          <span
                            style={{
                              color: "#ef4444",
                              fontSize: 13,
                            }}
                          >
                            Unavailable
                          </span>
                        ) : (
                          <span
                            style={{
                              color: "#059669",
                              fontSize: 13,
                            }}
                          >
                            Available
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    style={styles.bookButton}
                    onClick={() =>
                      navigate("/bookingdetails", {
                        state: { hotel, room },
                      })
                    }
                  >
                    Book
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={styles.center}>
            No rooms available.
          </p>
        )}
      </section>

      {/* ================= REVIEWS ================= */}
      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>
          Reviews
        </h3>

        {reviews.length > 0 ? (
          <div style={styles.reviewsGrid}>
            {reviews.map((r) => (
              <div
                key={r.id}
                style={styles.reviewCard}
              >
                <div
                  style={styles.reviewHeader}
                >
                  <strong>{r.userName}</strong>
                  <span>⭐ {r.review}/5</span>
                </div>

                <p style={styles.comment}>
                  {r.comment}
                </p>

                <small style={styles.date}>
                  {new Date(
                    r.createdAt
                  ).toLocaleDateString()}
                </small>
              </div>
            ))}
          </div>
        ) : (
          <p style={styles.center}>
            No reviews yet.
          </p>
        )}
      </section>
    </div>
  );
};


const styles = {
  container: {
    padding: 24,
    maxWidth: 980,
    margin: "0 auto",
    fontFamily: "Arial",
  },

  center: {
    textAlign: "center",
  },

  backButton: {
    marginBottom: 12,
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #eee",
    background: "#fff",
    cursor: "pointer",
  },

  header: {
    display: "flex",
    gap: 18,
  },

  hero: {
    width: 360,
    height: 220,
    borderRadius: 12,
    objectFit: "cover",
  },

  headerMeta: {
    flex: 1,
  },

  title: {
    margin: 0,
  },

  location: {
    color: "#6b7280",
  },

  metaRow: {
    display: "flex",
    gap: 10,
    marginTop: 10,
  },

  price: {
    color: colors.primary,
  },

  rating: {
    color: colors.accent,
  },

  descriptionFull: {
    marginTop: 10,
    color: "#555",
  },

  section: {
    marginTop: 30,
  },

  sectionTitle: {
    marginBottom: 10,
  },

  roomsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill,minmax(220px,1fr))",
    gap: 12,
  },

  roomCard: {
    padding: 12,
    background: "#fff",
    borderRadius: 10,
  },

  roomThumb: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    objectFit: "cover",
  },

  roomHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 8,
  },

  roomPrice: {
    color: colors.primary,
    fontWeight: "bold",
  },

  bookButton: {
    marginTop: 10,
    width: "100%",
    background: colors.primary,
    color: "#fff",
    border: "none",
    padding: 8,
    borderRadius: 8,
    cursor: "pointer",
  },

  reviewsGrid: {
    display: "grid",
    gap: 12,
  },

  reviewCard: {
    background: "#fff",
    padding: 12,
    borderRadius: 10,
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },

  reviewHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  comment: {
    margin: 0,
    color: "#444",
  },

  date: {
    color: "#999",
    fontSize: 12,
  },
};

export default HotelDetails;