import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRooms, deleteRoom } from "../../api/roomsApi";

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

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
            {rooms.map((room) => (
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
    padding: "20px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },

  addBtn: {
    backgroundColor: "#1e3a8a",
    color: "white",
    border: "none",
    padding: "10px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
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
    padding: "10px",
    verticalAlign: "middle",
  },

  image: {
    width: "60px",
    height: "40px",
    objectFit: "cover",
    borderRadius: "6px",
  },

  actions: {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
    padding: "10px",
  },

  editBtn: {
    backgroundColor: "#facc15",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
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

export default ManageRooms;