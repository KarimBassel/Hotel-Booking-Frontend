import { useState, useEffect } from "react";
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
  const [debug, setDebug] = useState(null);
  const [ValidWindow, setValidWindow] = useState(true);
  const [EmptyWindow, setEmptyWindow] = useState(false);
  const [ValidityJustification, setValidityJustification] = useState("");

  //TBC
  //Check room availability on a specific date window
useEffect(() => {

  const fetchAvailability = async () => {

    if (!checkInDate || !checkOutDate)
      return;
    if(new Date().toISOString().split("T")[0] > checkInDate){
      setValidWindow(false);
      return;
    }
    if (new Date(checkOutDate)<=new Date(checkInDate)) {
      setValidWindow(false);
      return;
    }
    else{
      setValidWindow(true);
    }

    if(booking?.status && booking.status === "PENDING"){
      setValidWindow(true);
      setEmptyWindow(true);
      setValidityJustification("This booking is currently pending. You can proceed to payment or modify the dates.");
      return;
    }
    try {
      //console.log("ROOM OBJECT:", room);
      const response =
        await checkRoomAvailability(
          room.id,
          checkInDate,
          checkOutDate
        );

      if (!response.data.available) {
        setEmptyWindow(false)
        setValidityJustification(
          "Room is not available for the selected dates.\n" +
          "This room has the following bookings during the selected dates: " +
          response.data.conflicts
            .map((b) => `(${b.checkIn} to ${b.checkOut})`)
            .join(", ")
        );

      } else {
        setEmptyWindow(true);
        setValidityJustification(
          "Room available"
        );
      }

    } catch (err) {
      console.error(err);
      setEmptyWindow(true);
    }
  };

  fetchAvailability();

}, [checkInDate,checkOutDate]);
  // When coming from Bookings page, populate with existing booking data
  useEffect(() => {
    if (fromBookings && booking) {
      setCheckInDate(booking.CheckIn ? booking.CheckIn.split("T")[0] : "");
      setCheckOutDate(booking.CheckOut ? booking.CheckOut.split("T")[0] : "");
      setDebug({ source: "Bookings", booking, checkInDate: booking.CheckIn, checkOutDate: booking.CheckOut });
    } else if (!fromBookings) {
      setDebug({ source: "HotelDetails", hotel, room });
    }
  }, [fromBookings, booking, hotel, room]);

  useEffect(() => {
    if (!fromBookings && (!hotel || !room)) {
      navigate("/hotels");
    }
  }, [hotel, room, navigate, fromBookings]);

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();
  const roomPrice = room?.price || 0;
  
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
        const bookingId = bookingRes.data?.bookingID;
        const checkIn = bookingRes.data?.CheckIn ;
        const checkOut = bookingRes.data?.CheckOut ;
        totalPrice = nights * roomPrice;

        navigate("/stripe-checkout", {
          state: {
            booking,
          },
        });
      }
    } catch (err) {
      // console.error("FULL ERROR:", err);
      // console.error("Response:", err.response);
      // console.error("Data:", err.response?.data);
      // console.error("Status:", err.response?.status);

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
            disabled={(loading || !ValidWindow || !EmptyWindow) && booking?.status !== "PENDING"}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Processing..." : fromBookings ? "Proceed to Payment" : "Proceed to Payment"}
          </button>
          )}

          {(checkInDate && checkOutDate && !ValidWindow && (booking.status !== "CONFIRMED" && booking.status !== "CANCELLED") && (
            <div style={{ marginTop: 16, color: "#ef4444", fontWeight: "500" }}>
              Check-out date must be after check-in date.
              Dates must be in the future.
            </div>
          ))}
          {(ValidityJustification && ValidWindow) && (
            <div style={{ marginBottom: 16,marginTop: 16, color: EmptyWindow ? "#10b981" : "#ef4444", fontWeight: "500" }}>
              {ValidityJustification}
            </div>
          )}
        </div>

      </div>

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
  container: {
    padding: 24,
    maxWidth: 1000,
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  backButton: {
    marginBottom: 20,
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #e6eef8",
    background: "#fff",
    cursor: "pointer",
    fontSize: 14,
  },
  content: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 24,
  },
  infoSection: {
    padding: 20,
    borderRadius: 12,
    background: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  formSection: {
    padding: 20,
    borderRadius: 12,
    background: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  title: {
    margin: 0,
    fontSize: 24,
    color: colors.textDark || "#0f172a",
    marginBottom: 8,
  },
  location: {
    margin: "0 0 16px 0",
    color: "#6b7280",
  },
  roomInfo: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 12,
    color: colors.textDark || "#0f172a",
  },
  roomImage: {
    width: "100%",
    height: 200,
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
    padding: "10px 12px",
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
  },
  priceRowTotal: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTop: "1px solid #d1d5db",
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textDark || "#0f172a",
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
    padding: "12px",
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