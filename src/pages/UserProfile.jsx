import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api/userApi";
import { uploadImage, deleteImage } from "../api/CloudinaryApi";

const Profile = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    imageURL: "",
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setError("");

      try {
        const response = await getProfile();
        const data = response.data;

        setForm({
          name: data.name || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          imageURL: data.imageURL || data.ImageURL || "",
        });
      } catch (err) {
        console.error(err);

        const message =
          err.response?.data?.message ||
          "Failed to load your profile";

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const uploadImageIfNew = async () => {
    if (!file) return form.imageURL;

    try {
      if (form.imageURL) {
        await deleteImage(form.imageURL);
      }

      const response = await uploadImage(file);

      const newUrl = response.imageURL;

      setForm((prev) => ({
        ...prev,
        imageURL: newUrl,
      }));

      return newUrl;
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
        "Image upload failed. Please try again."
      );

      return form.imageURL;
    }
  };

  const handleUpdate = async () => {
    setUpdating(true);
    setError("");
    setSuccess("");

    try {
      const imageURL = await uploadImageIfNew();

      const payload = {
        ...form,
        imageURL,
      };

      await updateProfile(payload);

      setForm(payload);
      setFile(null);

      setSuccess("Profile updated successfully");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
        "Update failed"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) {
    return (
      <div style={styles.errorPage}>
        <div style={styles.error}>
          {error}
        </div>
      </div>
    );
  }


  return (
    <div style={styles.container}>

        <div style={styles.card}>

          {/* PROFILE IMAGE */}
          <img
            src={
              form.imageURL ||
              `https://ui-avatars.com/api/?name=${form.name}`
            }
            alt="profile"
            style={styles.image}
          />

          {/* FILE INPUT */}
          <div style={styles.fileInputContainer}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFile(e.target.files[0])
              }
              style={styles.fileInput}
            />
          </div>

          {/* NAME */}
          <input
            type="text"
            name="name"
            data-testid="name-input"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            style={styles.input}
          />

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            style={styles.input}
          />

          {/* PHONE */}
          <input
            type="text"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            style={styles.input}
          />

          {/* SUCCESS MESSAGE ONLY */}
          {success && (
            <div style={styles.message} data-testid="profile-message">
              {success}
            </div>
          )}

          {/* BUTTON */}
          <button
            onClick={handleUpdate}
            disabled={updating}
            style={styles.button}
          >
            {updating ? "Updating..." : "Update Profile"}
          </button>

        </div>
    </div>
  );
};

export default Profile;


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
    width: "min(100%, 420px)",
    background: "#fff",
    padding: "clamp(1rem, 3vw, 1.875rem)",
    borderRadius: 16,
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },

  image: {
    width: "min(100%, 320px)",
    height: "min(100%, 320px)",
    aspectRatio: "1 / 1",
    borderRadius: "50%",
    objectFit: "cover",
    alignSelf: "center",
    border: "4px solid #e5e7eb",
  },

  fileInputContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "0.6rem",
    marginBottom: "0.6rem",
  },

  fileInput: {
    textAlign: "center",
    width: "100%",
  },

  input: {
    padding: "0.7rem",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 14,
    width: "100%",
  },

  button: {
    marginTop: "0.6rem",
    padding: "0.75rem",
    borderRadius: 8,
    border: "none",
    background: "linear-gradient(90deg,#2563eb,#06b6d4)",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%",
  },

  message: {
    fontSize: 14,
    color: "#16a34a",
    textAlign: "center",
  },
  error: {
    marginBottom: "1rem",
    padding: "0.75rem",
    borderRadius: 8,
    background: "#fee2e2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
    textAlign: "center",
  },
  errorPage: {
    minHeight: "100dvh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f1f5f9",
    padding: "1rem",
  },
};