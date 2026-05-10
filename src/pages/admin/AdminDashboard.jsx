import { useEffect, useState } from "react";
import api from "../../api/client";
import { Users, Store, ShoppingBag, DollarSign, Clock } from "lucide-react";

const STATUS_COLORS = {
  PLACED: "#6366f1", CONFIRMED: "#f59e0b", PREPARING: "#f97316",
  READY: "#10b981", DELIVERED: "#22c55e", CANCELLED: "#ef4444",
};

const KPI = ({ icon: Icon, label, value, color }) => (
  <div style={{
    background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16,
    padding: "20px 24px", display: "flex", alignItems: "center", gap: 16,
  }}>
    <div style={{ width: 48, height: 48, borderRadius: 14, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Icon size={22} color={color} />
    </div>
    <div>
      <p style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
      <p style={{ fontSize: 28, fontWeight: 900, color: "var(--text-primary)", marginTop: 2 }}>{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats,   setStats]   = useState(null);
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/orders?limit=8"),
        ]);
        setStats(statsRes.data.data);
        setOrders(ordersRes.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (error) return (
    <div style={{ padding: "40px", color: "#ef4444" }}>
      <p style={{ fontWeight: 700, fontSize: 15 }}>⚠️ Failed to load dashboard</p>
      <p style={{ fontSize: 13, marginTop: 6, color: "var(--text-muted)" }}>{error}</p>
      <button onClick={() => window.location.reload()} style={{ marginTop: 12, padding: "8px 16px", borderRadius: 8, background: "#6366f1", color: "#fff", border: "none", cursor: "pointer", fontSize: 13 }}>Retry</button>
    </div>
  );

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1200 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>Admin Dashboard</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 28, fontSize: 14 }}>Platform-wide overview & recent activity</p>

      {/* KPI Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        <KPI icon={Users}       label="Total Users"   value={loading ? "…" : stats?.users       ?? 0} color="#6366f1" />
        <KPI icon={Store}       label="Restaurants"   value={loading ? "…" : stats?.restaurants ?? 0} color="#f59e0b" />
        <KPI icon={ShoppingBag} label="Total Orders"  value={loading ? "…" : stats?.orders      ?? 0} color="#10b981" />
        <KPI icon={DollarSign}  label="Revenue"       value={loading ? "…" : `₹${(stats?.revenue ?? 0).toLocaleString("en-IN")}`} color="#8b5cf6" />
      </div>

      {/* Recent Orders Table */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
          <Clock size={16} color="#6366f1" />
          <h2 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>Recent Orders</h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "var(--bg-hover)" }}>
                {["Order ID", "Customer", "Restaurant", "Amount", "Status", "Date"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", color: "var(--text-muted)", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>Loading orders…</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>No orders yet.</td></tr>
              ) : orders.map((o, i) => (
                <tr key={o._id} style={{ borderTop: "1px solid var(--border)", background: i % 2 ? "var(--table-alt)" : "transparent" }}>
                  <td style={{ padding: "12px 16px", color: "var(--text-secondary)", fontFamily: "monospace", fontSize: 12 }}>#{o._id.slice(-6).toUpperCase()}</td>
                  <td style={{ padding: "12px 16px", color: "var(--text-primary)", fontWeight: 600 }}>{o.customer_id?.name ?? "—"}</td>
                  <td style={{ padding: "12px 16px", color: "var(--text-secondary)" }}>{o.restaurant_id?.name ?? "—"}</td>
                  <td style={{ padding: "12px 16px", color: "#10b981", fontWeight: 700 }}>₹{o.total_amount.toFixed(0)}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: 9999, fontSize: 11, fontWeight: 700,
                      background: `${STATUS_COLORS[o.status] ?? "#6366f1"}22`,
                      color: STATUS_COLORS[o.status] ?? "#6366f1" }}>
                      {o.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--text-muted)", fontSize: 12 }}>
                    {new Date(o.createdAt).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
