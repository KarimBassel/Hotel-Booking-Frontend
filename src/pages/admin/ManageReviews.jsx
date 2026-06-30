import { useEffect, useState } from "react";
import {
  getAllReviews,
  deleteReview,
} from "../../api/reviewApi";
import AdminFilters from "../../components/admin/AdminFilters";


const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [hotelFilter, setHotelFilter] = useState("ALL");
  const [ratingFilter, setRatingFilter] = useState("ALL");

  const hotels = [
  "ALL",
  ...new Set(
    reviews
      .map((review) => review.hotelName)
      .filter(Boolean)
  ),
];


const filteredReviews = reviews.filter((review) => {
  const matchesSearch =
    review.userName
      ?.toLowerCase()
      .includes(search.toLowerCase()) ||
    review.hotelName
      ?.toLowerCase()
      .includes(search.toLowerCase()) ||
    review.comment
      ?.toLowerCase()
      .includes(search.toLowerCase());

  const matchesHotel =
    hotelFilter === "ALL" ||
    review.hotelName === hotelFilter;

  const matchesRating =
    ratingFilter === "ALL" ||
    review.review === Number(ratingFilter);

  return (
    matchesSearch &&
    matchesHotel &&
    matchesRating
  );
});
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

      <AdminFilters
  search={search}
  setSearch={setSearch}
  searchPlaceholder="Search reviews..."
  filters={[
    {
      name: "hotel",
      value: hotelFilter,
      onChange: setHotelFilter,
      options: hotels.map((hotel) => ({
        value: hotel,
        label:
          hotel === "ALL"
            ? "All Hotels"
            : hotel,
      })),
    },
    {
      name: "rating",
      value: ratingFilter,
      onChange: setRatingFilter,
      options: [
        {
          value: "ALL",
          label: "All Ratings",
        },
        {
          value: "5",
          label: "5 Stars",
        },
        {
          value: "4",
          label: "4 Stars",
        },
        {
          value: "3",
          label: "3 Stars",
        },
        {
          value: "2",
          label: "2 Stars",
        },
        {
          value: "1",
          label: "1 Star",
        },
      ],
    },
  ]}
/>

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
            {filteredReviews.map((review) => (
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

            {filteredReviews.length === 0 && (
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
    padding: "clamp(1rem, 2.5vw, 1.25rem)",
    width: "100%",
    boxSizing: "border-box",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "0.75rem",
    flexWrap: "wrap",
    marginBottom: "1rem",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "white",
    borderRadius: "10px",
    overflowX: "auto",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    tableLayout: "fixed",
    display: "block",
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
    padding: "0.7rem",
    verticalAlign: "middle",
  },

  tdDesc: {
    textAlign: "center",
    padding: "0.7rem",
    verticalAlign: "middle",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  actions: {
    display: "flex",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "0.7rem",
    flexWrap: "wrap",
  },

  deleteBtn: {
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    padding: "0.4rem 0.7rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },

  empty: {
    textAlign: "center",
    padding: "1.25rem",
  },
};

export default ManageReviews;