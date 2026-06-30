import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createRoom,
  updateRoom,
  getRoomById,
} from "../../api/roomsApi";
import { getHotels } from "../../api/hotelsApi";
import { uploadImage, deleteImage } from "../../api/CloudinaryApi";

const RoomFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditMode = !!id;

  const [room, setRoom] = useState({
    availability: true,
    price: 0,
    roomNumber: "",
    roomType: "",
    hotelID: "",
    imageURL: "",
  });

  const [hotels, setHotels] = useState([]);
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchHotels();

    if (isEditMode) {
      loadRoom();
    }
  }, []);

  const fetchHotels = async () => {
    try {
      const res = await getHotels();
      setHotels(res.data);
    } catch (err) {
      console.error("Failed to load hotels", err);
    }
  };

  const loadRoom = async () => {
    try {
      const res = await getRoomById(id);

      setRoom({
        availability: res.data.availability ?? true,
        price: res.data.price ?? 0,
        roomNumber: res.data.roomNumber ?? "",
        roomType: res.data.roomtype ?? "",
        hotelID: res.data.hotelID ?? "",
        imageURL: res.data.image_url ?? "",
      });
    } catch (err) {
      console.error("Failed to load room", err);
      alert("Failed to load room");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setRoom((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "price" || name === "roomNumber"
          ? Number(value)
          : value,
    }));
  };

  const uploadImageIfNew = async () => {
    if (!file) return room.imageURL;

    try {
      if (room.imageURL) {
        await deleteImage(room.imageURL);
      }

      const res = await uploadImage(file);
      return res.imageURL;
    } catch (err) {
      console.error("Image upload failed", err);
      return room.imageURL;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const imageURL = await uploadImageIfNew();

      const payload = {
        availability: room.availability,
        price: room.price,
        roomNumber: room.roomNumber,
        roomType: room.roomType,
        hotelID: Number(room.hotelID),
        imageURL,
      };

      if (isEditMode) {
        await updateRoom(id, payload);
      } else {
        await createRoom(payload);
      }

      navigate("/admin/rooms");
    } catch (err) {
      console.error(err);
      alert("Failed to save room");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <h2 style={{ padding: "20px" }}>Loading...</h2>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>
          {isEditMode ? "Edit Room" : "Add Room"}
        </h2>

        <form onSubmit={handleSubmit} style={styles.form}>

          {/* IMAGE */}
          {(isEditMode || file) && (
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : room.imageURL ||
                    `https://ui-avatars.com/api/?name=Room`
              }
              alt="Room"
              style={styles.image}
            />
          )}

          <div style={styles.fileInputContainer}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              style={styles.fileInput}
            />
          </div>

          {/* ROOM NUMBER */}
          <div style={styles.field}>
            <label>Room Number</label>
            <input
              type="number"
              name="roomNumber"
              value={room.roomNumber}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          {/* PRICE */}
          <div style={styles.field}>
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={room.price}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          {/* ROOM TYPE */}
          <div style={styles.field}>
            <label>Room Type</label>
            <select
              name="roomType"
              value={room.roomType}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">Select Type</option>
              <option value="SINGLE">SINGLE</option>
              <option value="DOUBLE">DOUBLE</option>
              <option value="SUITE">SUITE</option>
            </select>
          </div>

          {/* HOTEL */}
          <div style={styles.field}>
            <label>Hotel</label>
            <select
              name="hotelID"
              value={room.hotelID}
              onChange={handleChange}
              required
              style={styles.input}
            >
              <option value="">Select Hotel</option>
              {hotels.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>

          {/* AVAILABILITY */}
          <div style={styles.fieldRow}>
            <label>Available</label>
            <input
              type="checkbox"
              name="availability"
              checked={room.availability}
              onChange={handleChange}
            />
          </div>

          {/* BUTTONS */}
          <div style={styles.buttons}>
            <button
              type="button"
              style={styles.cancelBtn}
              onClick={() => navigate("/admin/rooms")}
            >
              Cancel
            </button>

            <button type="submit" style={styles.saveBtn} disabled={saving}>
              {saving
                ? "Saving..."
                : isEditMode
                ? "Update Room"
                : "Create Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "clamp(1rem, 3vw, 2.5rem)",
    background: "#f1f5f9",
    minHeight: "100dvh",
    width: "100%",
    boxSizing: "border-box",
  },

  card: {
    width: "min(100%, 700px)",
    background: "#fff",
    padding: "clamp(1rem, 3vw, 1.875rem)",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },

  title: {
    marginBottom: "1.25rem",
    color: "#1e3a8a",
    textAlign: "center",
    fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0.875rem",
  },

  image: {
    width: "100%",
    height: "clamp(180px, 35vw, 280px)",
    objectFit: "cover",
    borderRadius: "12px",
    border: "4px solid #e5e7eb",
  },

  fileInputContainer: {
    display: "flex",
    justifyContent: "center",
  },

  fileInput: {
    textAlign: "center",
    width: "100%",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "0.375rem",
  },

  fieldRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "0.75rem",
    flexWrap: "wrap",
  },

  input: {
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    width: "100%",
  },

  buttons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.625rem",
    marginTop: "0.625rem",
    flexWrap: "wrap",
  },

  cancelBtn: {
    padding: "0.75rem 1.125rem",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    background: "#fff",
    cursor: "pointer",
    width: "fit-content",
  },

  saveBtn: {
    padding: "0.75rem 1.125rem",
    borderRadius: "8px",
    border: "none",
    background: "linear-gradient(90deg,#2563eb,#06b6d4)",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    width: "fit-content",
  },
};

export default RoomFormPage;