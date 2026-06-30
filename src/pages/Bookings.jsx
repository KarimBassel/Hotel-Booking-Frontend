import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getBookings,
  updateBooking,
} from "../api/bookingsApi";

import { getUserHotelReview } from "../api/reviewApi";

import colors from "../styles/colors";

const Bookings = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      loadBookings(userId);
    } else {
      setLoading(false);
      setError("User not found. Please login again.");
    }
  }, []);

  const loadBookings = async (userId) => {
    setLoading(true);
    setError("");

    try {
      const response = await getBookings(userId);
      setBookings(response.data);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Could not load your bookings.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (booking) => {
    setError("");

    if (booking.status === "CONFIRMED") {
      setError("Confirmed bookings cannot be cancelled.");
      return;
    }

    try {
      const payload = { status: "CANCELLED" };

      await updateBooking(booking.bookingID, payload);

      setBookings((prev) =>
        prev.map((b) =>
          b.bookingID === booking.bookingID
            ? { ...b, status: "CANCELLED" }
            : b
        )
      );
    } catch (err) {
      console.error("CANCEL ERROR:", err);

      const message =
        err.response?.data?.message ||
        "Failed to cancel booking.";

      setError(message);
    }
  };

  const canReview = (booking) => {
    return (
      booking.status === "CONFIRMED" &&
      new Date(booking.CheckOut).getTime() < Date.now()
    );
  };

  const handleReviewNavigation = async (booking) => {
    setError("");

    try {
      const res = await getUserHotelReview(booking.HotelID);

      navigate("/review-visit", {
        state: {
          booking,
          review: res.data,
        },
      });
    } catch (err) {
      console.error("REVIEW ERROR:", err);

      if (err.response?.status === 404) {
        navigate("/review-visit", {
          state: { booking },
        });
        return;
      }

      setError(
        err.response?.data?.message ||
        "Failed to load review."
      );
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "CONFIRMED":
        return {
          background: "#dcfce7",
          color: "#166534",
        };

      case "PENDING":
        return {
          background: "#fef9c3",
          color: "#854d0e",
        };

      case "CANCELLED":
        return {
          background: "#fee2e2",
          color: "#991b1b",
        };

      default:
        return {};
    }
  };

  if (loading) {
    return <p style={styles.center}>Loading...</p>;
  }
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
      <h1 style={styles.title}>My Bookings</h1>

      {(bookings.length === 0 && error == "") ? (
        <p style={styles.center}>
          You have no bookings.
        </p>
      ) : (
        <div style={styles.list}>
          {bookings.map((booking) => (
            <div
              className="booking-card"
              key={booking.bookingID}
              style={styles.card}
            >
              {/* TOP */}
              <div style={styles.topRow}>
                <div>
                  <h3 style={styles.hotel}>
                    {booking.hotelName}
                  </h3>

                  <p style={styles.room}>
                    Room {booking.roomNumber}
                  </p>
                </div>

                <span
                  style={{
                    ...styles.status,
                    ...getStatusStyle(booking.status),
                  }}
                >
                  {booking.status}
                </span>
              </div>

              {/* MIDDLE */}
              <div style={styles.middleRow}>
                <div>
                  <div>
                    Check-in:{" "}
                    {new Date(
                      booking.CheckIn
                    ).toLocaleDateString()}
                  </div>

                  <div>
                    Check-out:{" "}
                    {new Date(
                      booking.CheckOut
                    ).toLocaleDateString()}
                  </div>
                </div>

                <div style={styles.price}>
                  ${booking.totalPayment}
                </div>
              </div>

              {/* ACTIONS */}
              <div style={styles.actions}>
                <button
                  style={styles.detailsButton}
                  onClick={() =>
                    navigate("/bookingdetails", {
                      state: {
                        booking,
                        fromBookings: true,
                      },
                    })
                  }
                >
                  View Details
                </button>

                {booking.status !== "CONFIRMED" &&
                  booking.status !== "CANCELLED" && (
                    <button
                      style={styles.cancelButton}
                      onClick={() =>
                        handleCancel(booking)
                      }
                    >
                      Cancel
                    </button>
                  )}

                {canReview(booking) && (
                  <button
                    style={styles.reviewButton}
                    onClick={() =>
                      handleReviewNavigation(booking)
                    }
                  >
                    Review Visit
                  </button>
                )}
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
    maxWidth: "min(100%, 900px)",
    margin: "2.5rem auto",
    padding: "clamp(1rem, 3vw, 1.25rem)",
    fontFamily: "Arial",
    width: "100%",
    boxSizing: "border-box",
  },

  title: {
    marginBottom: "1.25rem",
    color: colors.textDark,
    fontSize: "clamp(1.5rem, 3vw, 2rem)",
  },

  center: {
    textAlign: "center",
  },

  list: {
    display: "grid",
    gap: "1rem",
  },

  card: {
    background: "#fff",
    padding: "clamp(1rem, 2vw, 1.25rem)",
    borderRadius: 12,
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
    width: "100%",
  },

  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "0.75rem",
    flexWrap: "wrap",
  },

  hotel: {
    margin: 0,
  },

  room: {
    margin: 0,
    color: "#6b7280",
  },

  status: {
    padding: "0.375rem 0.875rem",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: "600",
  },

  error: {
    marginBottom: "1rem",
    padding: "0.75rem",
    borderRadius: 8,
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

  middleRow: {
    marginTop: "0.95rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "0.75rem",
    flexWrap: "wrap",
  },

  price: {
    fontWeight: "700",
    color: colors.primary,
  },

  actions: {
    marginTop: "0.95rem",
    display: "flex",
    gap: "0.625rem",
    flexWrap: "wrap",
  },

  detailsButton: {
    background: colors.primary,
    color: "#fff",
    border: "none",
    padding: "0.5rem 0.875rem",
    borderRadius: 8,
    cursor: "pointer",
    width: "fit-content",
  },

  cancelButton: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "0.5rem 0.875rem",
    borderRadius: 8,
    cursor: "pointer",
    width: "fit-content",
  },

  reviewButton: {
    background: "#ca8a04",
    color: "#fff",
    border: "none",
    padding: "0.5rem 0.875rem",
    borderRadius: 8,
    cursor: "pointer",
    width: "fit-content",
  },
};

export default Bookings;