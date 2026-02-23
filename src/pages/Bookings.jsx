import { useEffect, useState } from "react";
import { getBookings, cancelBooking } from "../api/bookingsApi";
import colors from "../styles/colors";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [debug, setDebug] = useState(null);

  useEffect(() => {
    // try to load bookings for current user if user id is available in localStorage
    const userId = localStorage.getItem('userId');
    loadBookings(userId);
  }, []);

  const loadBookings = async (userId) => {
    try {
      console.log("loadBookings: userId=", userId);
      const res = await getBookings(userId);
      console.log("loadBookings: response", res);
      setDebug({ request: { userId }, response: res?.data, status: res?.status, headers: res?.headers });
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      setDebug({ request: { userId }, error: err?.response || err?.message || err });
      setError("Could not load bookings.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      console.log("cancelBooking: id=", id);
      await cancelBooking(id);
      console.log("cancelBooking: success", id);
      setBookings((prev) => prev.filter((b) => b.bookingID !== id));
    } catch (err) {
      console.error(err);
      setDebug((d) => ({ ...(d||{}), cancelError: err?.response || err?.message || err }));
      alert("Failed to cancel booking");
    }
  };

  if (loading) return <p style={styles.center}>Loading bookings...</p>;
  if (error) return <p style={styles.center}>{error}</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Bookings</h1>

      {bookings.length === 0 ? (
        <p style={styles.center}>You have no bookings.</p>
      ) : (
        <div style={styles.list}>
          {bookings.map((b) => (
            <div key={b.bookingID} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <div style={styles.hotelName}>{b.hotelName}</div>
                  <div style={styles.roomInfo}>Room {b.rommNumber}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={styles.total}>${b.totalPayment}</div>
                  <div style={styles.status}>{b.status}</div>
                </div>
              </div>

              <div style={styles.dates}>
                <div>Check-in: {new Date(b.CheckIn).toLocaleDateString()}</div>
                <div>Check-out: {new Date(b.CheckOut).toLocaleDateString()}</div>
              </div>

              <div style={styles.actions}>
                <button style={styles.cancelButton} onClick={() => handleCancel(b.bookingID)}>
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Debug panel - shown when debug info exists */}
      {debug && (
        <div style={{ marginTop: 20 }}>
          <h3 style={{ marginBottom: 8 }}>Debug info</h3>
          <pre style={{ background: '#f8fafc', padding: 12, borderRadius: 8, overflowX: 'auto' }}>{JSON.stringify(debug, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: 24, maxWidth: 980, margin: "18px auto", fontFamily: "Arial, sans-serif" },
  center: { textAlign: "center", marginTop: 40, color: "#374151" },
  title: { marginBottom: 16, color: colors.textDark },
  list: { display: "grid", gap: 12 },
  card: { padding: 16, borderRadius: 10, background: "#fff", boxShadow: "0 8px 30px rgba(16,24,40,0.04)" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  hotelName: { fontWeight: 700 },
  roomInfo: { color: "#6b7280" },
  total: { fontWeight: 700, color: colors.primary },
  status: { color: colors.accent },
  dates: { color: "#4b5563", marginBottom: 8 },
  actions: { display: "flex", gap: 8 },
  cancelButton: { background: "#ef4444", color: "#fff", border: "none", padding: "8px 10px", borderRadius: 8, cursor: "pointer" },
};

export default Bookings;