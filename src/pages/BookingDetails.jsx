import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createBooking,checkRoomAvailability } from "../api/bookingsApi";
import colors from "../styles/colors";

const BookingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hotel, room, booking, fromBookings } = location.state || {};

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [availability, setAvailability] = useState({
    datesValid: true,
    canProceed: false,
    message: "",
  });

    // Check room availability on a specific date window
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!checkInDate || !checkOutDate) {
        setAvailability({ datesValid: true, canProceed: false, message: "" });
        return;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);

      if (checkIn < today) {
        setAvailability({
          datesValid: false,
          canProceed: false,
          message: "Check-in date must be in the future.",
        });
        return;
      }

      if (checkOut <= checkIn) {
        setAvailability({
          datesValid: false,
          canProceed: false,
          message: "Check-out date must be after check-in date.",
        });
        return;
      }

      if (booking?.status === "PENDING") {
        setAvailability({
          datesValid: true,
          canProceed: true,
          message: "This booking is currently pending. You can proceed to payment or modify the dates.",
        });
        return;
      }

      try {
        const response = await checkRoomAvailability(room?.id, checkInDate, checkOutDate);

        if (!response.data.available) {
          setAvailability({
            datesValid: true,
            canProceed: false,
            message:
              "Room is not available for the selected dates.\n" +
              "This room has the following bookings during the selected dates: " +
              response.data.conflicts
                .map((b) => `(${b.checkIn} to ${b.checkOut})`)
                .join(", "),
          });
        } else {
          setAvailability({
            datesValid: true,
            canProceed: true,
            message: "Room available",
          });
        }
      } catch (err) {
        setAvailability({ datesValid: true, canProceed: false, message: "" });
      }
    };

    fetchAvailability();
  }, [booking?.status, checkInDate, checkOutDate, room?.id]);
  // When coming from Bookings page, populate with existing booking data
  useEffect(() => {
    if (fromBookings && booking) {
      setCheckInDate(booking.CheckIn ? booking.CheckIn.split("T")[0] : "");
      setCheckOutDate(booking.CheckOut ? booking.CheckOut.split("T")[0] : "");
    }
  }, [fromBookings, booking]);

  useEffect(() => {
    if (!fromBookings && (!hotel || !room)) {
      navigate("/hotels");
    }
  }, [hotel, room, navigate, fromBookings]);

  //useMemo caches the result and don't recalculate unless the dependancy array variables changes
  const nights = useMemo(() => {
    if (!checkInDate || !checkOutDate) return 0;

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);

    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  }, [checkInDate, checkOutDate]);

  const roomPrice = room?.price || 0;
  const isProceedDisabled = loading || ((!availability.datesValid || !availability.canProceed) && booking?.status !== "PENDING");
  
  // Calculate total price based on the flow
  let totalPrice = 0;
  if (fromBookings && booking) {
    // For existing bookings, use the stored totalPayment
    totalPrice = booking?.totalPayment || 0;
  } else {
    // For new bookings, calculate based on nights and room price
    totalPrice = nights > 0 ? nights * roomPrice : 0;
  }

  const handleCreateBooking = async () => {
    setError("");
    
    if (!checkInDate || !checkOutDate) {
      setError("Please select check-in and check-out dates.");
      return;
    }

    if (nights <= 0) {
      setError("Check-out date must be after check-in date.");
      return;
    }

    setLoading(true);
    try {
      // If coming from existing booking, go directly to payment with booking ID
      if (fromBookings && booking) {
        navigate("/stripe-checkout", {
          state: {
            booking,
          },
        });
      } else {
        // New booking flow - create booking first
        const bookingPayload = {
          roomId: room.id,
          checkInDate,
          checkOutDate,
          numberOfNights: nights,
          totalPrice
        };

        const bookingRes = await createBooking(bookingPayload);

      navigate("/stripe-checkout", {
        state: {
          booking: bookingRes.data,
        },
        });
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Failed to create booking"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!fromBookings && (!hotel || !room)) {
    return <div style={styles.container}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backButton}>
        ← Back
      </button>

      <div style={styles.content}>
        {/* Hotel & Room Info */}
        <div style={styles.infoSection}>
          <h2 style={styles.title}>{fromBookings ? booking?.hotelName : hotel?.name}</h2>
          <p style={styles.location}>{fromBookings ? booking?.hotelLocation : hotel?.location}</p>

          {!fromBookings && (
            <div style={styles.roomInfo}>
              <h3 style={styles.sectionTitle}>Room Details</h3>
              {room.image_url && (
                <img
                  src={room.image_url}
                  alt={room.roomtype}
                  style={styles.roomImage}
                />
              )}
              <div style={styles.roomMeta}>
                <p><strong>Type:</strong> {room.roomtype}</p>
                <p><strong>Room Number:</strong> {room.roomNumber}</p>
                <p><strong>Price per night:</strong> ${room.price}</p>
                <p><strong>Availability:</strong> {room.availability? "Available" : "Unavailable"}</p>
              </div>
            </div>
          )}

          {fromBookings && (
            <div style={styles.roomInfo}>
              <h3 style={styles.sectionTitle}>Booking Information</h3>
              <div style={styles.roomMeta}>
                <p><strong>Room Number:</strong> {booking?.roomNumber}</p>
                <p><strong>Status:</strong> {booking?.status}</p>
                <p><strong>Total Price:</strong> ${booking?.totalPayment}</p>
              </div>
            </div>
          )}
        </div>

        {/* Booking Form */}
        <div style={styles.formSection}>
          <h3 style={styles.sectionTitle}>Booking Details</h3>

          <div style={styles.formGroup}>
            <label style={styles.label}>Check-in Date</label>
            <input 
              disabled={booking?.status && (booking?.status === "CANCELLED" || booking?.status === "CONFIRMED")}
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Check-out Date</label>
            <input
              disabled={booking?.status && (booking?.status === "CANCELLED" || booking?.status === "CONFIRMED")}
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              style={styles.input}
            />
          </div>

          {nights > 0 && !fromBookings && (
            <div style={styles.nightsInfo}>
              <p><strong>{nights} night{nights > 1 ? "s" : ""}</strong></p>
            </div>
          )}

          {error && <div style={styles.error}>{error}</div>}

          {/* Price Summary */}
          <div style={styles.priceSummary}>
            {!fromBookings && (
              <>
                <div style={styles.priceRow}>
                  <span>Room per night:</span>
                  <span>${roomPrice}</span>
                </div>
                <div style={styles.priceRow}>
                  <span>Number of nights:</span>
                  <span>{nights}</span>
                </div>
              </>
            )}
            <div style={styles.priceRowTotal}>
              <span>Total Price:</span>
              <span>${totalPrice}</span>
            </div>
          </div>
          {/* {booking?.status && (booking?.status === "CONFIRMED" || booking?.status === "CANCELLED") && (
            <div style={{ marginBottom: 16, color: "#f59e0b", fontWeight: "500" }}>
              Note: This booking is currently <strong>{booking.status}</strong>. Enjoy you stay!
            </div>
          )} */}

          {(booking==null || (booking?.status && booking?.status === "PENDING")) && (
          <button
            onClick={handleCreateBooking}
            disabled={isProceedDisabled}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Processing..." : "Proceed to Payment"}
          </button>
          )}

          {(checkInDate && checkOutDate && !availability.datesValid && (booking?.status !== "CONFIRMED" && booking?.status !== "CANCELLED")) && (
            <div style={{ marginTop: 16, color: "#ef4444", fontWeight: "500" }}>
              {availability.message}
            </div>
          )}
          {availability.message && availability.datesValid && (
            <div style={{ marginBottom: 16, marginTop: 16, color: availability.canProceed ? "#10b981" : "#ef4444", fontWeight: "500" }}>
              {availability.message}
            </div>
          )}
        </div>

      </div>

      {/* Debug panel - shown when debug info exists */}
      {/* {debug && (
        <div style={{ marginTop: 20 }}>
          <h3 style={{ marginBottom: 8 }}>Debug info</h3>
          <pre style={{ background: '#f8fafc', padding: 12, borderRadius: 8, overflowX: 'auto' }}>{JSON.stringify(debug, null, 2)}</pre>
        </div>
      )} */}
    </div>
  );
};

const styles = {
  container: {
    padding: "clamp(1rem, 3vw, 1.5rem)",
    maxWidth: "min(100%, 1000px)",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
    width: "100%",
    boxSizing: "border-box",
  },
  backButton: {
    marginBottom: "1.25rem",
    padding: "0.5rem 0.75rem",
    borderRadius: 8,
    border: "1px solid #e6eef8",
    background: "#fff",
    cursor: "pointer",
    fontSize: 14,
    width: "fit-content",
  },
  content: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
    gap: "1.25rem",
  },
  infoSection: {
    padding: "clamp(1rem, 2vw, 1.25rem)",
    borderRadius: 12,
    background: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    width: "100%",
  },
  formSection: {
    padding: "clamp(1rem, 2vw, 1.25rem)",
    borderRadius: 12,
    background: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    width: "100%",
  },
  title: {
    margin: 0,
    fontSize: "clamp(1.25rem, 2vw, 1.5rem)",
    color: colors.textDark || "#0f172a",
    marginBottom: 8,
  },
  location: {
    margin: "0 0 1rem 0",
    color: "#6b7280",
  },
  roomInfo: {
    marginTop: "1.25rem",
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 12,
    color: colors.textDark || "#0f172a",
  },
  roomImage: {
    width: "100%",
    height: "clamp(180px, 35vw, 220px)",
    borderRadius: 8,
    objectFit: "cover",
    marginBottom: 12,
  },
  roomMeta: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 1.6,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    display: "block",
    marginBottom: 6,
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "0.7rem",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    backgroundColor: "#f8fafc",
    fontSize: 14,
    boxSizing: "border-box",
    color: "#0f172a",
  },
  nightsInfo: {
    padding: 12,
    borderRadius: 8,
    background: "#f0f9ff",
    border: "1px solid #bfdbfe",
    marginBottom: 16,
    fontSize: 14,
    color: colors.primary || "#2563eb",
  },
  priceSummary: {
    padding: 16,
    borderRadius: 8,
    background: "#f3f4f6",
    marginBottom: 20,
  },
  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
    fontSize: 14,
    color: "#6b7280",
    gap: "0.5rem",
    flexWrap: "wrap",
  },
  priceRowTotal: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTop: "1px solid #d1d5db",
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textDark || "#0f172a",
    gap: "0.5rem",
    flexWrap: "wrap",
  },
  error: {
    color: "#ef4444",
    marginBottom: 16,
    padding: 8,
    borderRadius: 6,
    background: "#fee2e2",
  },
  button: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: 8,
    border: "none",
    background: "linear-gradient(90deg,#2563eb,#06b6d4)",
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(37,99,235,0.12)",
  },
};

export default BookingDetails;