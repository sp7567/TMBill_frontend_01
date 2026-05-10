import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const PublicNavbar = () => {
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem 2rem",
        background: "var(--bg-card)",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        <Link
          to="/"
          style={{ fontSize: "1.5rem", fontWeight: "800", color: "#ef4444" }}
        >
          FoodHub
        </Link>
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            fontWeight: "500",
            color: "var(--text-secondary)",
          }}
        >
          <Link to="/" className="hover-link">
            Home
          </Link>
          <Link to="/about" className="hover-link">
            About
          </Link>
          <Link to="/contact" className="hover-link">
            Contact
          </Link>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Link
          to="/login"
          style={{ fontWeight: "500", color: "var(--text-secondary)" }}
          className="hover-link"
        >
          Login
        </Link>
        <Link
          to="/register"
          style={{
            background: "#ef4444",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            fontWeight: "600",
          }}
        >
          Register
        </Link>
        <ThemeToggle />
      </div>
      <style>{`
        .hover-link:hover { color: var(--text-primary); transition: color 0.2s; }
      `}</style>
    </nav>
  );
};

export default PublicNavbar;
