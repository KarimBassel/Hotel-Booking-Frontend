import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHotels, deleteHotel } from "../../api/hotelsApi";
import AdminFilters from "../../components/admin/AdminFilters";


const ManageHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("ALL");
  const [ratingFilter, setRatingFilter] = useState("ALL");

  const navigate = useNavigate();

  const locations = [
    ...new Set( hotels.map((hotel) => hotel.location) ),
  ];

const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch = hotel.name;

    const matchesLocation = locationFilter === "ALL" || hotel.location === locationFilter;

    const matchesRating = ratingFilter === "ALL" || hotel.averageRating === Number(ratingFilter);
    return matchesSearch && matchesLocation && matchesRating;
  });

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const res = await getHotels();
      setHotels(res.data);
    } catch (err) {
      console.error("Error fetching hotels:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this hotel?");
    if (!confirmDelete) return;

    try {
      await deleteHotel(id);
      setHotels((prev) => prev.filter((h) => h.id !== id));
    } catch (err) {
      console.error("Error deleting hotel:", err);
      alert("Failed to delete hotel");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Manage Hotels</h2>

        <button
          style={styles.addBtn}
          onClick={() => navigate("/admin/add-hotel")}
        >
          + Create Hotel
        </button>
      </div>

      
            <AdminFilters
              search={search}
              setSearch={setSearch}
              searchPlaceholder="Search users..."
              filters={[
                  {
                  name: "location",
                  value: locationFilter,
                  onChange: setLocationFilter,
                  options: [
                      { value: "ALL", label: "All Locations" },
                      ...locations.map((loc) => ({
                        value: loc,
                        label: loc,
                      })),
                  ],
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
        <p>Loading hotels...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.thId}>ID</th>
              <th style={styles.thName}>Name</th>
              <th style={styles.thLocation}>Location</th>
              <th style={styles.thDesc}>Description</th>
              <th style={styles.thRating}>Rating</th>
              <th style={styles.thRooms}>Rooms</th>
              <th style={styles.thImage}>Image</th>
              <th style={styles.thActions}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredHotels.map((hotel) => (
              <tr key={hotel.id}>
                <td style={styles.td}>{hotel.id}</td>
                <td style={styles.td}>{hotel.name}</td>
                <td style={styles.td}>{hotel.location}</td>
                <td style={styles.tdDesc}>{hotel.description}</td>
                <td style={styles.td}>{hotel.averageRating ?? "-"}</td>

                <td style={styles.td}>
                  {hotel.Rooms ? hotel.Rooms.length : 0}
                </td>

                <td style={styles.td}>
                  {hotel.image_url ? (
                    <img
                      src={hotel.image_url}
                      alt="hotel"
                      style={styles.image}
                    />
                  ) : (
                    "-"
                  )}
                </td>

                <td style={styles.actions}>
                  <button
                    style={styles.editBtn}
                    onClick={() => navigate(`/admin/edit-hotel/${hotel.id}`)}
                  >
                    Edit
                  </button>

                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(hotel.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {filteredHotels.length === 0 && (
              <tr>
                <td colSpan="8" style={styles.empty}>
                  No hotels found
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
    tableLayout: "fixed", // ✅ IMPORTANT
  },

  thId: { width: "60px", textAlign: "center" },
  thName: { width: "120px", textAlign: "center" },
  thLocation: { width: "120px", textAlign: "center" },
  thDesc: { width: "250px", textAlign: "center" },
  thRating: { width: "80px", textAlign: "center" },
  thRooms: { width: "80px", textAlign: "center" },
  thImage: { width: "100px", textAlign: "center" },
  thActions: { width: "140px", textAlign: "center" },

  td: {
    textAlign: "center",
    padding: "10px",
    verticalAlign: "middle",
  },

  tdDesc: {
    textAlign: "center",
    padding: "10px",
    verticalAlign: "middle",

    // ✅ prevents long text breaking layout
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
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

export default ManageHotels;