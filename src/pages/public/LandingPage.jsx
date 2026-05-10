import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const LandingPage = () => {
  const { user } = useAuth();

  // If user is already authenticated, it redirects them to their dashboard
  if (user) {
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    if (user.role === "restaurant")
      return <Navigate to="/restaurant" replace />;
    return <Navigate to="/customer" replace />;
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1
        style={{
          fontSize: "clamp(2.5rem, 8vw, 4rem)",
          fontWeight: "900",
          marginBottom: "1rem",
          color: "var(--text-primary)",
        }}
      >
        Welcome to <span style={{ color: "#ef4444" }}>FoodHub</span>
      </h1>
      <p
        style={{
          fontSize: "clamp(1rem, 4vw, 1.25rem)",
          color: "var(--text-secondary)",
          maxWidth: "600px",
          marginBottom: "3rem",
        }}
      >
        Your favorite food, delivered fast and fresh. Discover restaurants,
        order a delicious meal, and track it in real-time.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1.5rem" }}>
        <Link
          to="/register"
          style={{
            background: "#ef4444",
            color: "white",
            padding: "1rem 2.5rem",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "1.125rem",
            boxShadow: "var(--shadow)",
          }}
        >
          Get Started
        </Link>
        <Link
          to="/login"
          style={{
            background: "var(--bg-card)",
            color: "var(--text-primary)",
            padding: "1rem 2.5rem",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "1.125rem",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow)",
          }}
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
