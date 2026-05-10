import { useEffect, useState } from "react";
import api from "../../api/client";
import { Plus, Trash2, ToggleLeft, ToggleRight, Leaf } from "lucide-react";
import toast from "react-hot-toast";

const MenuPage = () => {
  const [items,    setItems]    = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState({ name: "", description: "", price: "", category: "", isVeg: true });
  const [loading,  setLoading]  = useState(false);

  const load = () => api.get("/restaurants/menu").then(r => setItems(r.data.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const addItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/restaurants/menu", { ...form, price: parseFloat(form.price) });
      toast.success("Item added!");
      setForm({ name: "", description: "", price: "", category: "", isVeg: true });
      setShowForm(false);
      load();
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    await api.delete(`/restaurants/menu/${id}`);
    toast.success("Item deleted");
    setItems(prev => prev.filter(x => x._id !== id));
  };

  const toggleAvail = async (id, curr) => {
    await api.patch(`/restaurants/menu/${id}`, { isAvailable: !curr });
    setItems(prev => prev.map(x => x._id === id ? { ...x, isAvailable: !curr } : x));
  };

  const categories = [...new Set(items.map(i => i.category))];

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)" }}>Menu Management</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 2 }}>{items.length} items on your menu</p>
        </div>
        <button onClick={() => setShowForm(p => !p)}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 12, background: "#f59e0b", color: "#000", fontWeight: 700, border: "none", cursor: "pointer", fontSize: 14 }}>
          <Plus size={18}/> Add Item
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={addItem} style={{ background: "var(--bg-card)", border: "1px solid #f59e0b33", borderRadius: 16, padding: 24, marginBottom: 24 }}>
          <h3 style={{ color: "#fbbf24", fontWeight: 700, marginBottom: 16, fontSize: 14 }}>New Menu Item</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[["name","Item Name"],["category","Category"],["price","Price (₹)"],["description","Description"]].map(([k,l]) => (
              <div key={k} style={{ gridColumn: k === "description" ? "1/-1" : undefined }}>
                <label style={{ display: "block", fontSize: 11, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>{l}</label>
                <input type={k === "price" ? "number" : "text"} required value={form[k]} onChange={e => setForm(p => ({...p, [k]: e.target.value}))} placeholder={l}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 10, background: "var(--bg-input)", border: "1px solid #334155", color: "var(--text-primary)", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14 }}>
            <button type="button" onClick={() => setForm(p => ({...p, isVeg: !p.isVeg}))}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: `1px solid ${form.isVeg ? "#10b981" : "#ef4444"}44`,
                background: `${form.isVeg ? "#10b981" : "#ef4444"}15`, color: form.isVeg ? "#34d399" : "#f87171", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
              <Leaf size={14}/> {form.isVeg ? "Veg" : "Non-Veg"}
            </button>
            <button disabled={loading}
              style={{ padding: "8px 20px", borderRadius: 10, background: "#f59e0b", color: "#000", fontWeight: 700, border: "none", cursor: "pointer", fontSize: 13 }}>
              {loading ? "Adding..." : "Add Item"}
            </button>
          </div>
        </form>
      )}

      {/* Items by category */}
      {categories.map(cat => (
        <div key={cat} style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>{cat}</h3>
          <div style={{ background: "var(--bg-card)", border: "1px solid #1e293b", borderRadius: 14, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr style={{ background: "var(--bg-input)" }}>
                {["Item","Price","Type","Status","Actions"].map(h =>
                  <th key={h} style={{ padding: "9px 16px", textAlign: "left", color: "var(--text-muted)", fontWeight: 600, fontSize: 11, textTransform: "uppercase" }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {items.filter(i => i.category === cat).map((item, idx) => (
                  <tr key={item._id} style={{ borderTop: "1px solid #1e293b", background: idx % 2 ? "#0a1021" : "transparent" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <p style={{ color: "#e2e8f0", fontWeight: 600 }}>{item.name}</p>
                      {item.description && <p style={{ color: "var(--text-muted)", fontSize: 11, marginTop: 2 }}>{item.description}</p>}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#10b981", fontWeight: 700 }}>₹{item.price}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: item.isVeg ? "#34d399" : "#f87171" }}>{item.isVeg ? "🟢 Veg" : "🔴 Non-Veg"}</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <button onClick={() => toggleAvail(item._id, item.isAvailable)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                        {item.isAvailable ? <ToggleRight size={24} color="#10b981"/> : <ToggleLeft size={24} color="var(--text-secondary)"/>}
                      </button>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <button onClick={() => deleteItem(item._id)} style={{ background: "#ef444422", border: "1px solid #ef444433", color: "#ef4444", padding: "5px 10px", borderRadius: 8, cursor: "pointer", fontSize: 12 }}>
                        <Trash2 size={13}/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuPage;
