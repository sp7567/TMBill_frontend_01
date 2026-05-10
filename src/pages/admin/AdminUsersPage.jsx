import { useEffect, useState } from "react";
import api from "../../api/client";
import { Trash2, Search, UserCircle } from "lucide-react";
import toast from "react-hot-toast";

const ROLE_STYLES = {
  admin:      { bg: "#6366f122", color: "#818cf8" },
  restaurant: { bg: "#f59e0b22", color: "#fbbf24" },
  customer:   { bg: "#10b98122", color: "#34d399" },
};

const AdminUsersPage = () => {
  const [users,   setUsers]   = useState([]);
  const [search,  setSearch]  = useState("");
  const [role,    setRole]    = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 50 });
      if (search) params.append("search", search);
      if (role)   params.append("role", role);
      const { data } = await api.get(`/admin/users?${params}`);
      setUsers(data.data);
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [search, role]);

  const deleteUser = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success("User deleted");
      setUsers(u => u.filter(x => x._id !== id));
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>User Management</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>View and manage all platform users</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200, maxWidth: 320 }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
            style={{ width: "100%", paddingLeft: 36, paddingRight: 16, paddingTop: 10, paddingBottom: 10, borderRadius: 10, background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)", fontSize: 13, outline: "none" }} />
        </div>
        <select value={role} onChange={e => setRole(e.target.value)}
          style={{ padding: "10px 14px", borderRadius: 10, background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-secondary)", fontSize: 13, outline: "none" }}>
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="restaurant">Restaurant</option>
          <option value="customer">Customer</option>
        </select>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "var(--bg-input)" }}>
                {["User","Email","Role","Joined","Action"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", color: "var(--text-muted)", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>No users found.</td></tr>
              ) : users.map((u, i) => (
                <tr key={u._id} style={{ borderTop: "1px solid var(--border)", background: i % 2 ? "var(--table-alt)" : "transparent" }}>
                  <td style={{ padding: "12px 16px", whiteSpace: "nowrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--bg-input)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <UserCircle size={18} color="var(--text-muted)" />
                      </div>
                      <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--text-secondary)" }}>{u.email}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ padding: "3px 10px", borderRadius: 9999, fontSize: 11, fontWeight: 700,
                      background: ROLE_STYLES[u.role]?.bg, color: ROLE_STYLES[u.role]?.color }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <button onClick={() => deleteUser(u._id, u.name)}
                      style={{ background: "#ef444422", border: "1px solid #ef444433", color: "#ef4444", padding: "5px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 5 }}>
                      <Trash2 size={13} /> Delete
                    </button>
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

export default AdminUsersPage;
