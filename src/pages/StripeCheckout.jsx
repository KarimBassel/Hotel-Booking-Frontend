import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { getBookingById } from "../api/bookingsApi";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { createPaymentIntent } from "../api/payment";


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const { booking } = location.state || {};

  const bookingId = booking?.bookingID;
  const checkInDate = booking?.checkIn;
  const checkOutDate = booking?.checkOut;
  const nights =
    (checkInDate && checkOutDate
      ? Math.ceil(
          (new Date(checkOutDate) - new Date(checkInDate)) /
            (1000 * 60 * 60 * 24)
        )
      : 0);

  const totalPrice = booking?.totalPayment;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Redirect if missing data
  useEffect(() => {

    if (!bookingId || !totalPrice) {
      navigate("/hotels");
    }
  }, [bookingId, totalPrice, navigate, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!stripe || !elements) return;

    setLoading(true);

    try {
      const payload = {
        BookingID: bookingId,
        Amount: totalPrice,
      };
      const paymentIntent =await createPaymentIntent(payload);
      const clientSecret = paymentIntent.clientSecret;
      const cardElement = elements.getElement(CardElement);

      //Stripe hits confirm endpoint using a webhook
      //this endpoints update booking & payment status to CONFIRMED
      const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent?.status === "succeeded") {
        setSuccess(true);

        // Wait for webhook to update DB
        const maxAttempts = 10;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
          const response = await getBookingById(bookingId);
          const booking = response.data;

          if (booking.status === "CONFIRMED") {
            navigate("/bookings");
            return;
          }

          // wait 1 second before trying again
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        setError("Payment succeeded, but confirmation is taking longer than expected.");


      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Payment failed");
    }

    setLoading(false);
  };

  if (!bookingId || !totalPrice) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        
        {/* LEFT: SUMMARY */}
        <div style={styles.detailsCard}>
          <h2 style={styles.sectionTitle}>Booking Summary</h2>

          <div style={styles.detailRow}>
            <span>Hotel</span>
            <strong>{booking.hotelName}</strong>
          </div>

          <div style={styles.detailRow}>
            <span>Room</span>
            <strong>{booking.roomNumber}</strong>
          </div>

          <div style={styles.detailRow}>
            <span>Check-in</span>
            <strong>{booking.CheckIn.split("T")[0]}</strong>
          </div>

          <div style={styles.detailRow}>
            <span>Check-out</span>
            <strong>{booking.CheckOut?.split("T")[0]}</strong>
          </div>

          <hr style={{ margin: "20px 0" }} />

          <div style={styles.totalRow}>
            <span>Total</span>
            <strong>${booking.totalPayment}</strong>
          </div>
        </div>

        {/* RIGHT: PAYMENT */}
        <div style={styles.paymentCard}>
          <h2 style={styles.sectionTitle}>Payment</h2>

          {success && (
            <div style={styles.success}>
              Payment successful! Redirecting...
            </div>
          )}

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={styles.cardBox} data-testid="card-element">
              <CardElement />
            </div>

            <button
              type="submit"
              disabled={!stripe || loading || success}
              style={styles.button}
            >
              {loading ? "Processing..." : `Pay $${totalPrice}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const StripeCheckout = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};


const styles = {
  page: {
    minHeight: "100dvh",
    background: "#f1f5f9",
    padding: "clamp(1.25rem, 3vw, 2.5rem)",
    width: "100%",
    boxSizing: "border-box",
  },
  wrapper: {
    maxWidth: "min(100%, 1100px)",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
    gap: "1.25rem",
  },
  detailsCard: {
    flex: "1 1 320px",
    minWidth: 0,
    background: "#ffffff",
    padding: "clamp(1rem, 2vw, 1.875rem)",
    borderRadius: 16,
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
  },
  paymentCard: {
    flex: "1 1 320px",
    minWidth: 0,
    background: "#ffffff",
    padding: "clamp(1rem, 2vw, 1.875rem)",
    borderRadius: 16,
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
  },
  sectionTitle: {
    marginBottom: "1.25rem",
    fontSize: 20,
    fontWeight: "600",
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "0.75rem",
    fontSize: 15,
    gap: "0.5rem",
    flexWrap: "wrap",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 18,
    fontWeight: "bold",
    gap: "0.5rem",
    flexWrap: "wrap",
  },
  cardBox: {
    padding: "1rem",
    border: "1px solid #d1d5db",
    borderRadius: 12,
    marginBottom: "1.25rem",
    background: "#f8fafc",
  },
  button: {
    width: "100%",
    padding: "0.875rem",
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(90deg,#2563eb,#06b6d4)",
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    cursor: "pointer",
    transition: "0.2s ease",
  },
  error: {
    padding: "0.75rem",
    borderRadius: 10,
    background: "#fee2e2",
    color: "#ef4444",
    marginBottom: "1rem",
  },
  success: {
    padding: "0.75rem",
    borderRadius: 10,
    background: "#dcfce7",
    color: "#059669",
    marginBottom: "1rem",
  },
};

export default StripeCheckout;