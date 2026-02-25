import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.root}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Discover Your Perfect Stay</h1>
          <p style={styles.heroSubtitle}>
            Book luxury hotels and resorts at the best prices. Your dream vacation awaits.
          </p>
          <button onClick={() => navigate("/hotels")} style={styles.ctaButton}>
            Explore Hotels
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <h2 style={styles.sectionTitle}>Why Choose Us?</h2>
        <div style={styles.featureGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🏨</div>
            <h3>Premium Hotels</h3>
            <p>Handpicked luxury accommodations from around the world.</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>💰</div>
            <h3>Best Prices</h3>
            <p>Guaranteed lowest rates with exclusive deals and discounts.</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🔒</div>
            <h3>Secure Booking</h3>
            <p>Safe and secure transactions with encrypted payments.</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>⭐</div>
            <h3>5-Star Service</h3>
            <p>24/7 customer support to help you with any queries.</p>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section style={styles.destinations}>
        <h2 style={styles.sectionTitle}>Popular Destinations</h2>
        <div style={styles.destinationGrid}>
          <div style={styles.destinationCard}>
            <div style={styles.destImage}>🏖️</div>
            <h3>Maldives</h3>
            <p>Tropical paradise with pristine beaches</p>
          </div>
          <div style={styles.destinationCard}>
            <div style={styles.destImage}>🗼</div>
            <h3>Paris</h3>
            <p>The city of love and romance</p>
          </div>
          <div style={styles.destinationCard}>
            <div style={styles.destImage}>🏔️</div>
            <h3>Switzerland</h3>
            <p>Mountains and breathtaking landscapes</p>
          </div>
          <div style={styles.destinationCard}>
            <div style={styles.destImage}>🌃</div>
            <h3>New York</h3>
            <p>The city that never sleeps</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Ready to Book Your Stay?</h2>
        <p style={styles.ctaText}>Start exploring amazing hotels and book your next adventure today!</p>
        <div style={styles.ctaButtonGroup}>
          <button onClick={() => navigate("/hotels")} style={styles.primaryButton}>
            Browse Hotels
          </button>
          <button onClick={() => navigate("/bookings")} style={styles.secondaryButton}>
            My Bookings
          </button>
        </div>
      </section>
    </div>
  );
};

const styles = {
  root: {
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
  },
  hero: {
    background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
    color: "#fff",
    padding: "120px 20px",
    textAlign: "center",
  },
  heroContent: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  heroTitle: {
    fontSize: "48px",
    fontWeight: "bold",
    marginBottom: "16px",
    textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
  },
  heroSubtitle: {
    fontSize: "20px",
    marginBottom: "32px",
    opacity: 0.95,
  },
  ctaButton: {
    padding: "14px 40px",
    fontSize: "16px",
    fontWeight: "600",
    backgroundColor: "#f59e0b",
    color: "#1e3a8a",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  features: {
    padding: "80px 20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  sectionTitle: {
    fontSize: "36px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "48px",
    color: "#1e3a8a",
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "24px",
  },
  featureCard: {
    backgroundColor: "#fff",
    padding: "32px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    textAlign: "center",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  featureIcon: {
    fontSize: "48px",
    marginBottom: "16px",
  },
  destinations: {
    padding: "80px 20px",
    backgroundColor: "#fff",
  },
  destinationGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  destinationCard: {
    backgroundColor: "#f8f9fa",
    padding: "24px",
    borderRadius: "12px",
    textAlign: "center",
    transition: "all 0.3s ease",
    border: "2px solid #e5e7eb",
  },
  destImage: {
    fontSize: "64px",
    marginBottom: "16px",
  },
  ctaSection: {
    padding: "80px 20px",
    background: "linear-gradient(135deg, #f59e0b 0%, #facc15 100%)",
    textAlign: "center",
    color: "#1e3a8a",
  },
  ctaTitle: {
    fontSize: "36px",
    fontWeight: "bold",
    marginBottom: "16px",
  },
  ctaText: {
    fontSize: "18px",
    marginBottom: "32px",
    opacity: 0.9,
  },
  ctaButtonGroup: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  primaryButton: {
    padding: "14px 40px",
    fontSize: "16px",
    fontWeight: "600",
    backgroundColor: "#1e3a8a",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  secondaryButton: {
    padding: "14px 40px",
    fontSize: "16px",
    fontWeight: "600",
    backgroundColor: "transparent",
    color: "#1e3a8a",
    border: "2px solid #1e3a8a",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};

export default Home;
