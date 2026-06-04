import { useEffect, useState } from "react";
import { getProfile,updateProfile } from "../api/userApi";
import { uploadImage, deleteImage } from "../api/CloudinaryApi";
import api from "../api/axios";

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
  const [message, setMessage] = useState("");
  const [debug, setDebug] = useState(null);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();

        const data = res.data;

        setForm({
          name: data.name || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          imageURL: data.imageURL || data.ImageURL || "",
        });

        setDebug({ rawResponse: data });
      } catch (err) {
        console.error(err);
        setDebug({ error: err?.response?.data || err.message });
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
    const isNewImageSelected = !!file;

    if (!isNewImageSelected) return form.imageURL;

    try {
      const oldImageURL = form.imageURL;

      if (oldImageURL) {
        await deleteImage(oldImageURL);
      }

      const response = await uploadImage(file);

      setForm((prev) => ({
        ...prev,
        imageURL: response.imageURL,
      }));

      return response.imageURL;
    } catch (err) {
      console.error(err);
      setDebug((prev) => ({
        ...prev,
        imageUploadError: err?.response?.data || err.message,
      }));

      return form.imageURL;
    }
  };

  const handleUpdate = async () => {
    setUpdating(true);
    setMessage("");

    try {
      const imageURL = await uploadImageIfNew();

      const payload = {
        ...form,
        imageURL,
      };

      const res = await updateProfile(payload);

      setForm(payload);
      setFile(null);

      setMessage("Profile updated successfully");

      setDebug((prev) => ({
        ...prev,
        updateResponse: res.data,
      }));
    } catch (err) {
      console.error(err);
      setMessage("Update failed");

      setDebug((prev) => ({
        ...prev,
        error: err?.response?.data || err.message,
      }));
    }

    setUpdating(false);
  };

  if (loading) return <div>Loading...</div>;

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

        {/* CENTERED FILE INPUT */}
        <div style={styles.fileInputContainer}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            style={styles.fileInput}
          />
        </div>

        {/* NAME */}
        <input
          type="text"
          name="name"
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

        {/* MESSAGE */}
        {message && <div style={styles.message}>{message}</div>}

        {/* UPDATE BUTTON */}
        <button
          onClick={handleUpdate}
          disabled={updating}
          style={styles.button}
        >
          {updating ? "Updating..." : "Update Profile"}
        </button>

        {/* DEBUG */}
        <div style={styles.debugBox}>
          <h3>Debug</h3>
          <pre style={styles.debugText}>
            {JSON.stringify(debug, null, 2)}
          </pre>
        </div>

      </div>
    </div>
  );
};

export default Profile;


const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: 40,
    background: "#f1f5f9",
    minHeight: "100vh",
  },

  card: {
    width: 420,
    background: "#fff",
    padding: 30,
    borderRadius: 16,
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  image: {
    width: 320,
    height: 320,
    borderRadius: "50%",
    objectFit: "cover",
    alignSelf: "center",
    border: "4px solid #e5e7eb",
  },

  fileInputContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
  },

  fileInput: {
    textAlign: "center",
  },

  input: {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 14,
  },

  button: {
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
    border: "none",
    background: "linear-gradient(90deg,#2563eb,#06b6d4)",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },

  message: {
    fontSize: 14,
    color: "#16a34a",
    textAlign: "center",
  },

  debugBox: {
    marginTop: 20,
    padding: 12,
    background: "#0f172a",
    color: "#e2e8f0",
    borderRadius: 10,
    fontSize: 12,
  },

  debugText: {
    whiteSpace: "pre-wrap",
  },
};