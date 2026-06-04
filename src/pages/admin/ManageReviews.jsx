import { useEffect, useState } from "react";
import {
  getAllReviews,
  deleteReview,
} from "../../api/reviewApi";

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);

      const response = await getAllReviews();

      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (reviewId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmDelete) return;

    try {
      await deleteReview(reviewId);

      setReviews((prev) =>
        prev.filter((review) => review.id !== reviewId)
      );
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Manage Reviews</h2>
      </div>

      {loading ? (
        <p>Loading reviews...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.thId}>ID</th>
              <th style={styles.thUser}>User</th>
              <th style={styles.thHotel}>Hotel</th>
              <th style={styles.thRating}>Rating</th>
              <th style={styles.thComment}>Comment</th>
              <th style={styles.thDate}>Created At</th>
              <th style={styles.thActions}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {reviews.map((review) => (
              <tr key={review.id}>
                <td style={styles.td}>{review.id}</td>

                <td style={styles.td}>
                  {review.userName || review.userId}
                </td>

                <td style={styles.td}>
                  {review.hotelName || review.hotelId}
                </td>

                <td style={styles.td}>
                  ⭐ {review.review}
                </td>

                <td style={styles.tdDesc}>
                  {review.comment || "-"}
                </td>

                <td style={styles.td}>
                  {review.createdAt}
                </td>

                <td style={styles.actions}>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(review.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {reviews.length === 0 && (
              <tr>
                <td colSpan="7" style={styles.empty}>
                  No reviews found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "white",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    tableLayout: "fixed",
  },

  thId: {
    width: "60px",
    textAlign: "center",
  },

  thUser: {
    width: "150px",
    textAlign: "center",
  },

  thHotel: {
    width: "180px",
    textAlign: "center",
  },

  thRating: {
    width: "90px",
    textAlign: "center",
  },

  thComment: {
    width: "320px",
    textAlign: "center",
  },

  thDate: {
    width: "130px",
    textAlign: "center",
  },

  thActions: {
    width: "120px",
    textAlign: "center",
  },

  td: {
    textAlign: "center",
    padding: "10px",
    verticalAlign: "middle",
  },

  tdDesc: {
    textAlign: "center",
    padding: "10px",
    verticalAlign: "middle",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  actions: {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
    padding: "10px",
  },

  deleteBtn: {
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },

  empty: {
    textAlign: "center",
    padding: "20px",
  },
};

export default ManageReviews;