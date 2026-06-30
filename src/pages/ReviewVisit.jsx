import { useLocation, useNavigate } from "react-router-dom";
import { CreateReview, updateHotelReview } from "../api/reviewApi";
import { useEffect, useState } from "react";

const ReviewVisit = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const booking = location.state?.booking;
  const existingReview = location.state?.review || null;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.review || 0);
      setComment(existingReview.comment || "");
    }
  }, [existingReview]);

  const isFormValid = () => {
    if (rating === 0) {
      setError("Please select a rating.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setError("");

    if (!isFormValid()) return;

    setSubmitting(true);

    try {
      if (existingReview) {
        const payload = {
          reviewID: existingReview.id,
          rating,
          comment,
        };

        await updateHotelReview(payload);
      } else {
        const payload = {
          hotelID: booking.HotelID,
          rating,
          comment,
        };

        await CreateReview(payload);
      }

      navigate("/bookings");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to submit review. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        style={{
          fontSize: 35,
          cursor: "pointer",
          color: star <= rating ? "#ca8a04" : "#d1d5db",
        }}
        onClick={() => {
          setRating(star);
          setError("");
        }}
      >
        ★
      </span>
    ));
  };

  if (!booking) {
    return <p style={styles.center}>No booking selected.</p>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Review Your Visit</h1>

      {/* BOOKING INFO */}
      <div style={styles.card}>
        <h2>{booking.hotelName}</h2>

        <p>
          <b>Room:</b> {booking.roomNumber}
        </p>

        <p>
          <b>Check-in:</b>{" "}
          {new Date(booking.CheckIn).toLocaleDateString()}
        </p>

        <p>
          <b>Check-out:</b>{" "}
          {new Date(booking.CheckOut).toLocaleDateString()}
        </p>
      </div>

      {/* EXISTING REVIEW */}
      {existingReview && (
        <div style={styles.card}>
          <h3>Existing Review</h3>

          <p>
            <b>Rating:</b> {existingReview.review}/5
          </p>

          <p>
            <b>Comment:</b> {existingReview.comment}
          </p>
        </div>
      )}

      {/* STARS */}
      <div style={styles.card}>
        <h3>Rate your stay</h3>

        <div style={styles.stars}>{renderStars()}</div>

        <p>Rating: {rating || "Not selected"}</p>
      </div>

      {/* COMMENT */}
      <div style={styles.card}>
        <h3>Write a Comment</h3>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell us about your experience..."
          style={styles.textarea}
        />
      </div>

      {/* ERROR */}
      {error && <div style={styles.error}>{error}</div>}

      {/* SUBMIT */}
      <button
        style={styles.button}
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting
          ? "Submitting..."
          : existingReview
          ? "Update Review"
          : "Submit Review"}
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 700,
    margin: "40px auto",
    fontFamily: "Arial",
  },

  title: {
    marginBottom: 20,
  },

  center: {
    textAlign: "center",
  },

  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
    marginBottom: 15,
  },

  stars: {
    display: "flex",
    gap: 8,
    marginTop: 10,
  },

  textarea: {
    width: "100%",
    height: 120,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
    marginTop: 10,
  },

  error: {
    marginBottom: 15,
    padding: 12,
    borderRadius: 8,
    background: "#fee2e2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
    textAlign: "center",
  },

  button: {
    width: "100%",
    padding: 12,
    background: "#ca8a04",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 16,
    fontWeight: "bold",
    opacity: 1,
  },
};

export default ReviewVisit;