import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createHotel,
  updateHotel,
  getHotelById,
} from "../../api/hotelsApi";
import { uploadImage, deleteImage } from "../../api/CloudinaryApi";

const HotelFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditMode = !!id;

  const [hotel, setHotel] = useState({
    name: "",
    location: "",
    description: "",
    image_url: "",
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      loadHotel();
    }
  }, []);

  const loadHotel = async () => {
    try {
      const response = await getHotelById(id);

      setHotel({
        name: response.data.name || "",
        location: response.data.location || "",
        description: response.data.description || "",
        image_url: response.data.image_url || "",
      });
    } catch (error) {
      console.error("Failed to load hotel", error);
      alert("Failed to load hotel");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setHotel((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const uploadImageIfNew = async () => {
    if (!file) return hotel.image_url;

    try {
      const oldImageUrl = hotel.image_url;

      if (oldImageUrl) {
        await deleteImage(oldImageUrl);
      }

      const response = await uploadImage(file);

      return response.imageURL;
    } catch (error) {
      console.error("Image upload failed", error);
      return hotel.image_url;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const image_url = await uploadImageIfNew();

      const payload = {
        name: hotel.name,
        location: hotel.location,
        description: hotel.description,
        image_url,
      };

      if (isEditMode) {
        await updateHotel(id, payload);
      } else {
        await createHotel(payload);
      }

      navigate("/admin/hotels");
    } catch (error) {
      console.error(error);
      alert("Failed to save hotel");
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
          {isEditMode ? "Edit Hotel" : "Add Hotel"}
        </h2>

        <form onSubmit={handleSubmit} style={styles.form}>
            {(isEditMode || file) && (
                <img
            src={
              file
                ? URL.createObjectURL(file)
                : hotel.image_url ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    hotel.name || "Hotel"
                  )}`
            }
            alt="Hotel"
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

          <div style={styles.field}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={hotel.name}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={hotel.location}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label>Description</label>
            <textarea
              rows="5"
              name="description"
              value={hotel.description}
              onChange={handleChange}
              style={styles.textarea}
            />
          </div>

          <div style={styles.buttons}>
            <button
              type="button"
              style={styles.cancelBtn}
              onClick={() => navigate("/admin/hotels")}
            >
              Cancel
            </button>

            <button
              type="submit"
              style={styles.saveBtn}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : isEditMode
                ? "Update Hotel"
                : "Create Hotel"}
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
    marginBottom: "0.625rem",
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

  input: {
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    width: "100%",
  },

  textarea: {
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    resize: "vertical",
    fontSize: "14px",
    width: "100%",
    minHeight: "7rem",
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

export default HotelFormPage;