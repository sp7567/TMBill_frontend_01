import { useState, useEffect } from "react";
import api from "../../api/client";
import toast from "react-hot-toast";
import { Store, Save } from "lucide-react";

const RestaurantProfilePage = () => {
  const [form, setForm] = useState({ name: "", cuisine: "", address: "", phone: "", isOpen: true });
  const [exists,  setExists]  = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/restaurants/me").then(r => {
      setForm(r.data.data);
      setExists(true);
    }).catch(() => {});
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (exists) {
        await api.patch("/restaurants/me", form);
        toast.success("Profile updated!");
      } else {
        await api.post("/restaurants", form);
        toast.success("Restaurant created!");
        setExists(true);
      }
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div style={{ padding: "28px 32px", maxWidth: 600 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>
        {exists ? "Restaurant Profile" : "Create Your Restaurant"}
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 28 }}>
        {exists ? "Update your restaurant details" : "Set up your restaurant to start receiving orders"}
      </p>

      <form onSubmit={save} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {[["name","Restaurant Name"],["cuisine","Cuisine Type"],["address","Address"],["phone","Phone Number"]].map(([k, l]) => (
          <div key={k}>
            <label style={{ display: "block", fontSize: 11, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>{l}</label>
            <input type="text" required={k !== "phone"} value={form[k] || ""} onChange={set(k)} placeholder={l}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 10, background: "var(--bg-card)", border: "1px solid #1e293b", color: "var(--text-primary)", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
          </div>
        ))}

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <label style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>Restaurant Status:</label>
          <button type="button" onClick={() => setForm(p => ({ ...p, isOpen: !p.isOpen }))}
            style={{ padding: "7px 16px", borderRadius: 9999, border: "1px solid", fontWeight: 700, fontSize: 12, cursor: "pointer",
              background: form.isOpen ? "#10b98122" : "#ef444418",
              color:      form.isOpen ? "#34d399" : "#ef4444",
              borderColor: form.isOpen ? "#10b98133" : "#ef444433" }}>
            {form.isOpen ? "🟢 OPEN" : "🔴 CLOSED"}
          </button>
        </div>

        <button disabled={loading} style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", padding: "12px", borderRadius: 12, background: "#f59e0b", color: "#000", fontWeight: 800, border: "none", cursor: "pointer", fontSize: 14, marginTop: 8 }}>
          <Save size={17} /> {loading ? "Saving..." : exists ? "Update Profile" : "Create Restaurant"}
        </button>
      </form>
    </div>
  );
};

export default RestaurantProfilePage;
