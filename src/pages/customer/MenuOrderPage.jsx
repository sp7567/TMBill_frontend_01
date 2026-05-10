import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/client";
import { ShoppingCart, Plus, Minus, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

const MenuOrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState({});
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    api.get("/restaurants/public").then(r => setRestaurant(r.data.data.find(x => x._id === id)));
    api.get(`/restaurants/${id}/menu`).then(r => setMenu(r.data.data));
  }, [id]);

  const inc = (item) => setCart(p => ({ ...p, [item._id]: (p[item._id] ?? 0) + 1 }));
  const dec = (item) => setCart(p => {
    const n = (p[item._id] ?? 0) - 1;
    if (n <= 0) { const c = { ...p }; delete c[item._id]; return c; }
    return { ...p, [item._id]: n };
  });

  const cartItems = Object.entries(cart).filter(([, qty]) => qty > 0);
  const total = cartItems.reduce((sum, [itemId, qty]) => sum + (menu.find(m => m._id === itemId)?.price ?? 0) * qty, 0);

  const placeOrder = async () => {
    if (!cartItems.length) return;
    setPlacing(true);
    try {
      const items = cartItems.map(([menu_item_id, qty]) => ({ menu_item_id, qty }));
      await api.post("/orders", { restaurant_id: id, items });
      toast.success("Order placed! Track in My Orders.");
      setCart({});
      navigate("/customer/orders");
    } catch (err) { toast.error(err.message); }
    finally { setPlacing(false); }
  };

  const categories = [...new Set(menu.map(i => i.category))];

  return (
    <div style={{ padding: "28px 32px", maxWidth: 900 }}>
      <button onClick={() => navigate("/customer")}
        style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", fontSize: 13, marginBottom: 16 }}>
        <ArrowLeft size={14} /> Back
      </button>

      {restaurant && (
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)" }}>{restaurant.name}</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 3 }}>{restaurant.cuisine} · {restaurant.address}</p>
        </div>
      )}

      <div style={{ display: "flex", gap: 24 }}>
        <div style={{ flex: 1 }}>
          {categories.map(cat => (
            <div key={cat} style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 11, fontWeight: 700, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>{cat}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {menu.filter(m => m.category === cat).map(item => (
                  <div key={item._id} style={{ background: "var(--bg-card)", border: "1px solid #1e293b", borderRadius: 12, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 10 }}>{item.isVeg ? "🟢" : "🔴"}</span>
                        <p style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: 13 }}>{item.name}</p>
                      </div>
                      {item.description && <p style={{ color: "var(--text-muted)", fontSize: 11, marginTop: 2 }}>{item.description}</p>}
                      <p style={{ color: "#10b981", fontWeight: 700, fontSize: 13, marginTop: 3 }}>₹{item.price}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {cart[item._id] ? (
                        <>
                          <button onClick={() => dec(item)} style={{ width: 26, height: 26, borderRadius: 7, background: "var(--bg-input)", border: "1px solid #334155", color: "var(--text-primary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Minus size={11} />
                          </button>
                          <span style={{ fontWeight: 700, color: "#10b981", minWidth: 18, textAlign: "center" }}>{cart[item._id]}</span>
                          <button onClick={() => inc(item)} style={{ width: 26, height: 26, borderRadius: 7, background: "#10b981", border: "none", color: "#000", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Plus size={11} />
                          </button>
                        </>
                      ) : (
                        <button onClick={() => inc(item)} style={{ padding: "5px 14px", borderRadius: 9999, background: "#10b98122", border: "1px solid #10b98133", color: "#34d399", fontWeight: 700, cursor: "pointer", fontSize: 12 }}>
                          + ADD
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Cart */}
        <div style={{ width: 260, flexShrink: 0 }}>
          <div style={{ background: "var(--bg-card)", border: "1px solid #1e293b", borderRadius: 14, padding: 18, position: "sticky", top: 24 }}>
            <h3 style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: 14, marginBottom: 12, display: "flex", alignItems: "center", gap: 7 }}>
              <ShoppingCart size={16} color="#10b981" /> Cart
            </h3>
            {cartItems.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: 12, textAlign: "center", padding: "16px 0" }}>Add items to order</p>
            ) : (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
                  {cartItems.map(([itemId, qty]) => {
                    const item = menu.find(m => m._id === itemId);
                    return item ? (
                      <div key={itemId} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                        <span style={{ color: "#cbd5e1" }}>{item.name} ×{qty}</span>
                        <span style={{ color: "#10b981", fontWeight: 700 }}>₹{(item.price * qty).toFixed(0)}</span>
                      </div>
                    ) : null;
                  })}
                </div>
                <div style={{ borderTop: "1px solid #1e293b", paddingTop: 10, marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, color: "var(--text-primary)", fontSize: 14 }}>
                    <span>Total</span>
                    <span style={{ color: "#10b981" }}>₹{total.toFixed(0)}</span>
                  </div>
                </div>
                <button onClick={placeOrder} disabled={placing}
                  style={{ width: "100%", padding: "11px", borderRadius: 10, background: "#10b981", color: "#000", fontWeight: 800, border: "none", cursor: "pointer", fontSize: 13 }}>
                  {placing ? "Placing..." : "Place Order 🛍️"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuOrderPage;
