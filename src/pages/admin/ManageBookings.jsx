import { useEffect, useState } from "react";
import { getBookings, updateBooking } from "../../api/bookingsApi";
import AdminFilters from "../../components/admin/AdminFilters";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [hotelFilter, setHotelFilter] = useState("ALL");
  const [priceFilter, setPriceFilter] = useState("ALL");

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const res = await getBookings();
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      alert("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingID) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) return;

    try {
      const payload = {
        status: "CANCELLED",
      };

      await updateBooking(bookingID, payload);

      setBookings((prev) =>
        prev.map((booking) =>
          booking.bookingID === bookingID
            ? { ...booking, status: "CANCELLED" }
            : booking
        )
      );
    } catch (err) {
      console.error("Error cancelling booking:", err);
      alert("Failed to cancel booking");
    }
  };

  // Unique hotels
  const hotels = [
    "ALL",
    ...new Set(
      bookings.map((b) => b.hotelName).filter(Boolean)
    ),
  ];

  // Filtering logic
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.hotelName
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      booking.bookingID?.toString().includes(search);

    const matchesStatus =
      statusFilter === "ALL" ||
      booking.status === statusFilter;

    const matchesHotel =
      hotelFilter === "ALL" ||
      booking.hotelName === hotelFilter;

    const matchesPrice =
      priceFilter === "ALL" ||
      (priceFilter === "LOW" &&
        booking.totalPayment < 100) ||
      (priceFilter === "MEDIUM" &&
        booking.totalPayment >= 100 &&
        booking.totalPayment <= 500) ||
      (priceFilter === "HIGH" &&
        booking.totalPayment > 500);

    return (
      matchesSearch &&
      matchesStatus &&
      matchesHotel &&
      matchesPrice
    );
  });

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Manage Bookings</h2>
      </div>

      {/* FILTERS */}
      <AdminFilters
        search={search}
        setSearch={setSearch}
        searchPlaceholder="Search bookings..."
        filters={[
          {
            name: "status",
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { value: "ALL", label: "Any Status" },
              { value: "PENDING", label: "Pending" },
              { value: "CONFIRMED", label: "Confirmed" },
              { value: "CANCELLED", label: "Cancelled" },
            ],
          },
          {
            name: "hotel",
            value: hotelFilter,
            onChange: setHotelFilter,
            options: hotels.map((h) => ({
              value: h,
              label: h === "ALL" ? "All Hotels" : h,
            })),
          },
          {
            name: "price",
            value: priceFilter,
            onChange: setPriceFilter,
            options: [
              { value: "ALL", label: "All Prices" },
              { value: "LOW", label: "< $100" },
              { value: "MEDIUM", label: "$100 - $500" },
              { value: "HIGH", label: "> $500" },
            ],
          },
        ]}
      />

      {loading ? (
        <p>Loading bookings...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.thId}>ID</th>
              <th style={styles.thHotel}>Hotel</th>
              <th style={styles.thRoom}>Room</th>
              <th style={styles.thDate}>Check In</th>
              <th style={styles.thDate}>Check Out</th>
              <th style={styles.thPrice}>Price</th>
              <th style={styles.thStatus}>Status</th>
              <th style={styles.thActions}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking.bookingID}>
                <td style={styles.td}>{booking.bookingID}</td>

                <td style={styles.td}>{booking.hotelName || "-"}</td>

                <td style={styles.td}>{booking.roomNumber || "-"}</td>

                <td style={styles.td}>{booking.CheckIn}</td>

                <td style={styles.td}>{booking.CheckOut}</td>

                <td style={styles.td}>${booking.totalPayment}</td>

                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.status,
                      ...(booking.status === "PENDING"
                        ? styles.pending
                        : booking.status === "CONFIRMED"
                        ? styles.confirmed
                        : styles.cancelled),
                    }}
                  >
                    {booking.status}
                  </span>
                </td>

                <td style={styles.td}>
                  {booking.status === "PENDING" ? (
                    <button
                      style={styles.cancelBtn}
                      onClick={() =>
                        handleCancel(booking.bookingID)
                      }
                    >
                      Cancel
                    </button>
                  ) : (
                    <span style={styles.noAction}>
                      No action taken
                    </span>
                  )}
                </td>
              </tr>
            ))}

            {filteredBookings.length === 0 && (
              <tr>
                <td colSpan="8" style={styles.empty}>
                  No bookings found
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
    marginBottom: "20px",
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

  thId: { width: "60px", textAlign: "center" },
  thHotel: { width: "180px", textAlign: "center" },
  thRoom: { width: "90px", textAlign: "center" },
  thDate: { width: "130px", textAlign: "center" },
  thPrice: { width: "100px", textAlign: "center" },
  thStatus: { width: "120px", textAlign: "center" },
  thActions: { width: "180px", textAlign: "center" },

  td: {
    textAlign: "center",
    padding: "12px",
    verticalAlign: "middle",
  },

  status: {
    padding: "6px 10px",
    borderRadius: "999px",
    fontWeight: "600",
    fontSize: "13px",
  },

  pending: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
  },

  confirmed: {
    backgroundColor: "#dcfce7",
    color: "#166534",
  },

  cancelled: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },

  cancelBtn: {
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },

  noAction: {
    color: "#6b7280",
    fontStyle: "italic",
  },

  empty: {
    textAlign: "center",
    padding: "20px",
  },
};

export default ManageBookings;