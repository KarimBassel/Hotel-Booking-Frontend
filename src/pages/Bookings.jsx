import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBookings, updateBooking } from "../api/bookingsApi";
import colors from "../styles/colors";

const Bookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    loadBookings(userId);
  }, []);

  const loadBookings = async (userId) => {
    try {
      const res = await getBookings(userId);
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (booking) => {
    if (booking.status === "CONFIRMED") {
      alert("Confirmed bookings cannot be cancelled.");
      return;
    }

    try {
      await updateBooking(booking.bookingID , "CANCELLED");
      setBookings((prev) =>
        prev.map((b) =>
          b.bookingID === booking.bookingID
            ? { ...b, status: "CANCELLED" }
            : b
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to cancel booking.");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "CONFIRMED":
        return { background: "#dcfce7", color: "#166534" };
      case "PENDING":
        return { background: "#fef9c3", color: "#854d0e" };
      case "CANCELLED":
        return { background: "#fee2e2", color: "#991b1b" };
      default:
        return {};
    }
  };

  if (loading) return <p style={styles.center}>Loading...</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Bookings</h1>

      {bookings.length === 0 ? (
        <p style={styles.center}>You have no bookings.</p>
      ) : (
        <div style={styles.list}>
          {bookings.map((b) => (
            <div key={b.bookingID} style={styles.card}>
              <div style={styles.topRow}>
                <div>
                  <h3 style={styles.hotel}>{b.hotelName}</h3>
                  <p style={styles.room}>Room {b.rommNumber}</p>
                </div>

                <span
                  style={{
                    ...styles.status,
                    ...getStatusStyle(b.status),
                  }}
                >
                  {b.status}
                </span>
              </div>

              <div style={styles.middleRow}>
                <div>
                  <div>
                    Check-in:{" "}
                    {new Date(b.CheckIn).toLocaleDateString()}
                  </div>
                  <div>
                    Check-out:{" "}
                    {new Date(b.CheckOut).toLocaleDateString()}
                  </div>
                </div>

                <div style={styles.price}>${b.totalPayment}</div>
              </div>

              <div style={styles.actions}>
                <button
                  style={styles.detailsButton}
                  onClick={() =>
                    navigate("/bookingdetails", {
                      state: { booking: b, fromBookings: true },
                    })
                  }
                >
                  View Details
                </button>

                {b.status !== "CONFIRMED" &&
                  b.status !== "CANCELLED" && (
                    <button
                      style={styles.cancelButton}
                      onClick={() => handleCancel(b)}
                    >
                      Cancel
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
  },
  list: {
    display: "grid",
    gap: 16,
  },
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  hotel: {
    margin: 0,
  },
  room: {
    margin: 0,
    color: "#6b7280",
  },
  status: {
    padding: "6px 14px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: "600",
  },
  middleRow: {
    marginTop: 15,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontWeight: "700",
    color: colors.primary,
  },
  actions: {
    marginTop: 15,
    display: "flex",
    gap: 10,
  },
  detailsButton: {
    background: colors.primary,
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: 8,
    cursor: "pointer",
  },
  cancelButton: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: 8,
    cursor: "pointer",
  },
};

export default Bookings;