import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRooms, deleteRoom } from "../../api/roomsApi";
import AdminFilters from "../../components/admin/AdminFilters";

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [hotelFilter, setHotelFilter] =useState("ALL");
  const [typeFilter, setTypeFilter] =useState("ALL");
  const [availabilityFilter, setAvailabilityFilter] =useState("ALL");
  

  const navigate = useNavigate();
  const hotels = [
  "ALL",
  ...new Set(
    rooms.map(
      (room) =>
        room.hotelName
    )
  ),
];
const roomTypes = [
  "ALL",
  ...new Set(
    rooms.map(
      (room) =>
        room.roomType ||
        room.roomtype
    )
  ),
];
  const filteredRooms = rooms.filter((room) => {
  const hotelName =room.hotelName;

  const roomType =room.roomtype;

  const matchesSearch =
    room.roomNumber
      ?.toString()
      .includes(search);

  const matchesHotel =
    hotelFilter === "ALL" ||
    hotelName === hotelFilter;

  const matchesType =
    typeFilter === "ALL" ||
    roomType === typeFilter;

  const matchesAvailability =
    availabilityFilter === "ALL" ||
    (availabilityFilter === "AVAILABLE" &&
      room.availability) ||
    (availabilityFilter === "UNAVAILABLE" &&
      !room.availability);

  return (
    matchesSearch &&
    matchesHotel &&
    matchesType &&
    matchesAvailability
  );
});
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await getRooms();
      setRooms(res.data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this room?"
    );
    if (!confirmDelete) return;

    try {
      await deleteRoom(id);
      setRooms((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Error deleting room:", err);
      alert("Failed to delete room");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Manage Rooms</h2>

        <button
          style={styles.addBtn}
          onClick={() => navigate("/admin/add-room")}
        >
          + Create Room
        </button>
      </div>

      <AdminFilters
  search={search}
  setSearch={setSearch}
  searchPlaceholder="Search room number..."
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
      name: "type",
      value: typeFilter,
      onChange: setTypeFilter,
      options: roomTypes.map((type) => ({
        value: type,
        label:
          type === "ALL"
            ? "All Types"
            : type,
      })),
    },
    {
      name: "availability",
      value: availabilityFilter,
      onChange: setAvailabilityFilter,
      options: [
        {
          value: "ALL",
          label: "All Rooms",
        },
        {
          value: "AVAILABLE",
          label: "Available",
        },
        {
          value: "UNAVAILABLE",
          label: "Unavailable",
        },
      ],
    },
  ]}
/>

      {loading ? (
        <p>Loading rooms...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.thId}>ID</th>
              <th style={styles.thNumber}>Room #</th>
              <th style={styles.thType}>Type</th>
              <th style={styles.thPrice}>Price</th>
              <th style={styles.thAvail}>Available</th>
              <th style={styles.thHotel}>Hotel</th>
              <th style={styles.thImage}>Image</th>
              <th style={styles.thActions}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredRooms.map((room) => (
              <tr key={room.id}>
                <td style={styles.td}>{room.id}</td>
                <td style={styles.td}>{room.roomNumber}</td>
                <td style={styles.td}>{room.roomtype}</td>
                <td style={styles.td}>{room.price}</td>
                <td style={styles.td}>
                  {room.availability ? "Yes" : "No"}
                </td>

                {/* FIX: backend must send hotel name */}
                <td style={styles.td}>
                  {room.hotelName || room.hotel?.name || "-"}
                </td>

                <td style={styles.td}>
                  {room.image_url ? (
                    <img
                      src={room.image_url}
                      alt="room"
                      style={styles.image}
                    />
                  ) : (
                    "-"
                  )}
                </td>

                <td style={styles.actions}>
                  <button
                    style={styles.editBtn}
                    onClick={() =>
                      navigate(`/admin/edit-room/${room.id}`)
                    }
                  >
                    Edit
                  </button>

                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(room.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {rooms.length === 0 && (
              <tr>
                <td colSpan="8" style={styles.empty}>
                  No rooms found
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

  addBtn: {
    backgroundColor: "#1e3a8a",
    color: "white",
    border: "none",
    padding: "0.7rem 0.9rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    width: "fit-content",
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

  thId: { width: "50px", textAlign: "center" },
  thNumber: { width: "80px", textAlign: "center" },
  thType: { width: "100px", textAlign: "center" },
  thPrice: { width: "80px", textAlign: "center" },
  thAvail: { width: "90px", textAlign: "center" },
  thHotel: { width: "120px", textAlign: "center" },
  thImage: { width: "100px", textAlign: "center" },
  thActions: { width: "140px", textAlign: "center" },

  td: {
    textAlign: "center",
    padding: "0.7rem",
    verticalAlign: "middle",
  },

  image: {
    width: "clamp(50px, 10vw, 60px)",
    height: "clamp(35px, 8vw, 40px)",
    objectFit: "cover",
    borderRadius: "6px",
  },

  actions: {
    display: "flex",
    justifyContent: "center",
    gap: "0.5rem",
    padding: "0.7rem",
    flexWrap: "wrap",
  },

  editBtn: {
    backgroundColor: "#facc15",
    border: "none",
    padding: "0.4rem 0.7rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
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

export default ManageRooms;