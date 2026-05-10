import { useEffect, useState } from "react";
import api from "../../api/client";
import { Trash2, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { useSocket } from "../../context/SocketContext";

const STATUS_COLORS = {
  PLACED: "#6366f1",
  CONFIRMED: "#f59e0b",
  PREPARING: "#f97316",
  READY: "#10b981",
  DELIVERED: "#22c55e",
  CANCELLED: "#ef4444",
};

const STATUS_EMOJI = {
  PLACED: "??",
  CONFIRMED: "??",
  PREPARING: "??",
  READY: "??",
  DELIVERED: "??",
  CANCELLED: "?",
};

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  const loadOrders = async () => {
    try {
      const { data } = await api.get("/orders/my");
      setOrders(data.data);
    } catch (err) {
      toast.error(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleUpdate = (order) => {
      setOrders((prev) => prev.map((o) => (o._id === order._id ? order : o)));
    };
    socket.on("order_updated", handleUpdate);
    return () => socket.off("order_updated", handleUpdate);
  }, [socket]);

  const deleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await api.delete(`/orders/${id}`);
      toast.success("Order cancelled");
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: 800 }}>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>
            My Orders
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            Track your recent food deliveries
          </p>
        </div>
        <button onClick={loadOrders}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, background: "var(--bg-card)", border: "1px solid var(--border-2)", color: "var(--text-primary)", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>Loading orders...</p>
      ) : orders.length === 0 ? (
        <div style={{ padding: "60px 20px", textAlign: "center", background: "var(--bg-card)", border: "1px dashed var(--border-2)", borderRadius: 16 }}>
          <p style={{ fontWeight: 600, fontSize: 16, color: "var(--text-secondary)" }}>
            No orders yet
          </p>
          <p style={{ fontSize: 13, marginTop: 4, color: "var(--text-muted)" }}>
            Browse restaurants and place your first order!
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {orders.map((order) => (
            <div key={order._id} className="card" style={{ padding: "18px 22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 12 }}>
                <div>
                  <p style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 14 }}>
                    {order.restaurant_id?.name ?? "Restaurant"}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                    #{order._id.slice(-6).toUpperCase()} ·{" "}
                    {new Date(order.createdAt).toLocaleDateString()}{" "}
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ padding: "5px 14px", borderRadius: 9999, fontSize: 12, fontWeight: 700, background: `${STATUS_COLORS[order.status]}22`, color: STATUS_COLORS[order.status], whiteSpace: "nowrap" }}>
                    {STATUS_EMOJI[order.status]} {order.status}
                  </span>
                  <span style={{ fontWeight: 800, color: "#10b981", fontSize: 15 }}>
                    ₹{order.total_amount?.toFixed(0) || 0}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                {order.items.map((item, i) => (
                  <span key={i} style={{ padding: "3px 10px", background: "var(--bg-input)", borderRadius: 20, fontSize: 12, color: "var(--text-secondary)" }}>
                    {item.name} ×{item.qty}
                  </span>
                ))}
              </div>

              {/* Progress bar */}
              <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
                {["PLACED", "CONFIRMED", "PREPARING", "READY", "DELIVERED"].map((s, i) => {
                  const statuses = ["PLACED", "CONFIRMED", "PREPARING", "READY", "DELIVERED"];
                  const currentIdx = statuses.indexOf(order.status);
                  const isPast = i <= currentIdx;
                  return (
                    <div key={s} style={{ flex: 1, height: 4, borderRadius: 9999, background: isPast ? STATUS_COLORS[order.status] : "var(--bg-input)", transition: "background 0.4s" }} />
                  );
                })}
              </div>

              {/* Cancel */}
              {["PLACED", "CONFIRMED"].includes(order.status) && (
                <button onClick={() => deleteOrder(order._id)}
                  style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 14px", borderRadius: 8, background: "#ef444418", border: "1px solid #ef444433", color: "#ef4444", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                  <Trash2 size={12} /> Cancel Order
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
