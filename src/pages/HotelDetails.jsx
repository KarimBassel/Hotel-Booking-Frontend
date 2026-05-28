import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { getHotelById } from "../api/hotelsApi";
import colors from "../styles/colors";
import placeholder from "../assets/react.svg";

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        console.log("HotelDetails: fetching id=", id);
        const res = await getHotelById(id);
        console.log("HotelDetails: response", res);
        setHotel(res.data);
      } catch (err) {
        console.error(err);
        setError("Could not load hotel details.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <p style={styles.center}>Loading hotel...</p>;
  if (error) return <p style={styles.center}>{error}</p>;
  if (!hotel) return <p style={styles.center}>Hotel not found</p>;

  // temporary debug dump to help trace rendering issues
  console.log('HotelDetails: hotel state', hotel);
  
  const debugJson = (
    <pre style={{ background: '#f8fafc', padding: 12, borderRadius: 8, overflowX: 'auto' }}>{JSON.stringify(hotel, null, 2)}</pre>
  );

  // build image src (use axios baseURL when image path is relative)
  const apiBase = api.defaults?.baseURL || "";
  const raw = hotel.image_url;
  const imageSrc = raw ? (raw.startsWith("http") ? raw : `${apiBase}${raw}`) : null;

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backButton}>← Back</button>

      <div style={styles.header}>
        <img
          src={imageSrc || placeholder}
          alt={hotel.name}
          style={styles.hero}
          onError={(e) => { if (e.currentTarget.src !== placeholder) e.currentTarget.src = placeholder; }}
        />

        <div style={styles.headerMeta}>
          <h1 style={styles.title}>{hotel.name}</h1>
          <p style={styles.location}>{hotel.location}</p>
          <div style={styles.metaRow}>
            <strong style={styles.price}>{hotel.price ? `$${hotel.price}` : ""}</strong>
            <span style={styles.rating}>⭐ {hotel.averageRating ? hotel.averageRating.toFixed(1) : "—"}</span>
          </div>
          <p style={styles.descriptionFull}>{hotel.description}</p>
        </div>
      </div>

      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>Rooms</h3>
        {hotel.Rooms && hotel.Rooms.length > 0 ? (
          <div style={styles.roomsGrid}>
            {hotel.Rooms.map((room) => (
              <div key={room.id} style={styles.roomCard}>
                {/* room image (optional) */}
                {(() => {
                  const rawRoomImg = room.image_url || room.imageUrl || room.image;
                  const roomImgSrc = rawRoomImg ? (rawRoomImg.startsWith("http") ? rawRoomImg : `${apiBase}${rawRoomImg}`) : null;
                  return (
                    <img
                      src={roomImgSrc || placeholder}
                      alt={`Room ${room.roomNumber || room.id}`}
                      style={styles.roomThumb}
                      onError={(e) => { if (e.currentTarget.src !== placeholder) e.currentTarget.src = placeholder; }}
                    />
                  );
                })()}

                <div style={styles.roomHeader}>
                  <div>
                    <div style={{ fontWeight: 700 }}>Room {room.roomNumber ?? room.id}</div>
                    <div style={{ color: '#6b7280', fontSize: 13 }}>{room.rootype || room.type || 'Room'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={styles.roomPrice}>${room.price}</div>
                    <div style={{ marginTop: 6 }}>
                      {room.availiability === false || room.availiability === 'false' ? (
                        <span style={{ color: '#ef4444', fontSize: 13 }}>Unavailable</span>
                      ) : (
                        <span style={{ color: '#059669', fontSize: 13 }}>Available</span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={styles.roomMeta}>{room.notes || ''}</div>

                <button
                  style={{ ...styles.bookButton, opacity: room.availiability === false ? 0.6 : 1 }}
                  disabled={room.availiability === false}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/bookingdetails', { state: { hotel, room } });
                  }}
                >
                  {room.availiability === false ? 'Unavailable' : 'Book'}
                </button>
              </div>
             ))}
          </div>
        ) : (
          <p style={styles.center}>No rooms available.</p>
        )}
      </section>

      {/* Debug JSON dump - remove this block after debugging */}
      <div style={{ marginTop: 40 }}>
        <h3 style={styles.sectionTitle}>Debug Info</h3>
        {debugJson}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: 24, fontFamily: "Arial, sans-serif", maxWidth: 980, margin: "18px auto" },
  center: { textAlign: "center", marginTop: 40, color: "#374151" },
  backButton: { marginBottom: 12, padding: "8px 12px", borderRadius: 8, border: "1px solid #e6eef8", background: "#fff", cursor: "pointer" },
  header: { display: "flex", gap: 18, alignItems: "flex-start" },
  hero: { width: 360, height: 220, borderRadius: 12, objectFit: "cover", background: "#f3f4f6" },
  headerMeta: { flex: 1 },
  title: { margin: 0, fontSize: 24, color: colors.textDark },
  location: { marginTop: 6, color: "#6b7280" },
  metaRow: { display: "flex", gap: 12, alignItems: "center", marginTop: 10 },
  price: { color: colors.primary, fontSize: 18 },
  rating: { color: colors.accent },
  descriptionFull: { marginTop: 12, color: "#4b5563" },
  section: { marginTop: 22 },
  sectionTitle: { fontSize: 18, marginBottom: 8, color: colors.textDark },
  roomsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 },
  roomCard: { padding: 12, borderRadius: 10, background: "#fff", boxShadow: "0 6px 18px rgba(16,24,40,0.06)" },
  roomThumb: { width: "100%", height: 120, borderRadius: 8, objectFit: "cover", background: "#f3f4f6", marginBottom: 12 },
  roomHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  roomPrice: { color: colors.primary, fontWeight: "bold" },
  roomMeta: { color: "#6b7280", fontSize: 13, marginBottom: 8 },
  bookButton: { background: "linear-gradient(90deg,#2563eb,#06b6d4)", color: "#fff", border: "none", padding: "8px 10px", borderRadius: 8, cursor: "pointer" },
};

export default HotelDetails;