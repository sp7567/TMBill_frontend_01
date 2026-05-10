import { useEffect, useState } from "react";
import api from "../../api/client";
import { ShoppingBag, Clock, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useSocket } from "../../context/SocketContext";

const STATUS_COLORS = {
  PLACED: "#6366f1", CONFIRMED: "#f59e0b", PREPARING: "#f97316",
  READY: "#10b981", DELIVERED: "#22c55e", CANCELLED: "#ef4444",
};
const NEXT_STATUS = {
  PLACED: "CONFIRMED", CONFIRMED: "PREPARING", PREPARING: "READY", READY: "DELIVERED",
};

const RestaurantOrdersPage = () => {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState("all");
  const { socket } = useSocket();

  const load = () => {
    api.get("/orders/restaurant").then(r => {
      setOrders(r.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  // Real-time: refresh on new order
  useEffect(() => {
    if (!socket) return;
    socket.on("order_placed", () => { load(); });
    socket.on("order_status_updated", () => { load(); });
    return () => { socket.off("order_placed"); socket.off("order_status_updated"); };
  }, [socket]);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      toast.success(`Order marked as ${status}`);
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
    } catch (err) { toast.error(err.message); }
  };

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)" }}>Incoming Orders</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 2 }}>Real-time order management</p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {["all","PLACED","CONFIRMED","PREPARING","READY","DELIVERED"].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              style={{ padding: "6px 14px", borderRadius: 9999, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "1px solid",
                background: filter === s ? `${STATUS_COLORS[s] ?? "#6366f1"}22` : "transparent",
                color:      filter === s ? (STATUS_COLORS[s] ?? "#818cf8") : "var(--text-muted)",
                borderColor: filter === s ? (STATUS_COLORS[s] ?? "#6366f1") + "44" : "var(--bg-input)",
              }}>{s}</button>
          ))}
        </div>
      </div>

      {loading ? <p style={{ color: "var(--text-muted)" }}>Loading orders...</p> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.length === 0 && <p style={{ color: "var(--text-muted)", textAlign: "center", padding: 40 }}>No orders found.</p>}
          {filtered.map(order => (
            <div key={order._id} className="card" style={{ border: `1px solid ${STATUS_COLORS[order.status]}33`, padding: "18px 22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 12 }}>
                <div>
                  <p style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 14 }}>
                    Order <span style={{ fontFamily: "monospace", color: "#818cf8" }}>#{order._id.slice(-6).toUpperCase()}</span>
                  </p>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                    👤 {order.customer_id?.name} · {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ padding: "4px 12px", borderRadius: 9999, fontSize: 12, fontWeight: 700,
                    background: `${STATUS_COLORS[order.status]}22`, color: STATUS_COLORS[order.status] }}>
                    {order.status}
                  </span>
                  <span style={{ fontWeight: 800, color: "#10b981", fontSize: 15 }}>₹{order.total_amount.toFixed(0)}</span>
                </div>
              </div>

              {/* Items */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                {order.items.map((item, i) => (
                  <span key={i} style={{ padding: "4px 12px", background: "var(--bg-input)", borderRadius: 20, fontSize: 12, color: "var(--text-secondary)" }}>
                    {item.name} ×{item.qty}
                  </span>
                ))}
              </div>

              {/* Actions */}
              {NEXT_STATUS[order.status] && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <button onClick={() => updateStatus(order._id, NEXT_STATUS[order.status])}
                    style={{ padding: "8px 20px", borderRadius: 10, background: "#f59e0b", color: "#000", fontWeight: 700, border: "none", cursor: "pointer", fontSize: 13 }}>
                    ✓ Mark as {NEXT_STATUS[order.status]}
                  </button>
                  {order.status === "PLACED" && (
                    <button onClick={() => updateStatus(order._id, "CANCELLED")}
                      style={{ padding: "8px 16px", borderRadius: 10, background: "#ef444422", color: "#ef4444", border: "1px solid #ef444433", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
                      ✕ Cancel
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantOrdersPage;
