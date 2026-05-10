import { useEffect, useState } from "react";
import api from "../../api/client";
import { Store, Star } from "lucide-react";

const AdminRestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/restaurants")
      .then(r => setRestaurants(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>All Restaurants</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>{restaurants.length} restaurants on the platform</p>
        </div>
      </div>

      <div className="grid-cards">
        {loading ? <p style={{ color: "var(--text-muted)" }}>Loading...</p> : restaurants.map(r => (
          <div key={r._id} className="card" style={{ padding: 0, overflow: "hidden" }}>
            {/* Banner */}
            <div style={{ height: 80, background: "linear-gradient(135deg, #1e293b, #0f172a)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "#6366f122", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Store size={22} color="#6366f1" />
              </div>
            </div>
            <div style={{ padding: "16px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 15 }}>{r.name}</h3>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{r.cuisine}</p>
                </div>
                <span style={{ padding: "2px 8px", borderRadius: 9999, fontSize: 11, fontWeight: 700,
                  background: r.isOpen ? "#10b98122" : "#ef444422", color: r.isOpen ? "#34d399" : "#ef4444" }}>
                  {r.isOpen ? "OPEN" : "CLOSED"}
                </span>
              </div>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 8 }}>{r.address}</p>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>Owner: <b style={{ color: "var(--text-primary)" }}>{r.owner_id?.name ?? "—"}</b></span>
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#f59e0b" }}>
                  <Star size={12} fill="#f59e0b" /> {r.rating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminRestaurantsPage;
