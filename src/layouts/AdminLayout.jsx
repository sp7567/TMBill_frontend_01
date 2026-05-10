import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { LayoutDashboard, Users, Store, ShoppingBag, LogOut, UtensilsCrossed, Moon, Sun } from "lucide-react";
import toast from "react-hot-toast";

const NAV = [
  { to: "/admin",               label: "Dashboard",   icon: LayoutDashboard, end: true },
  { to: "/admin/users",         label: "Users",       icon: Users },
  { to: "/admin/restaurants",   label: "Restaurants", icon: Store },
  { to: "/admin/orders",        label: "All Orders",  icon: ShoppingBag },
];

const AdminLayout = () => {
  const { logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); toast.success("Logged out"); navigate("/login"); };

  return (
    <div className="app-layout">
      <aside className="app-sidebar">
        {/* Logo */}
        <div className="app-sidebar-logo">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <UtensilsCrossed size={18} color="white" />
            </div>
            <div>
              <p style={{ fontWeight: 800, fontSize: 15, color: "var(--text-primary)" }}>FoodHub</p>
              <p style={{ fontSize: 10, color: "#6366f1", fontWeight: 700 }}>ADMIN PANEL</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="app-sidebar-nav">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `app-sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <Icon size={17} /> {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="app-sidebar-bottom">
          <button onClick={toggle} style={{
            display: "flex", alignItems: "center", gap: 8, width: "100%",
            padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)",
            background: "var(--bg-hover)", color: "var(--text-secondary)", cursor: "pointer", fontSize: 13, fontWeight: 600,
          }}>
            {isDark ? <Sun size={15} color="#f59e0b" /> : <Moon size={15} color="#6366f1" />}
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Signed in as <b style={{ color: "var(--text-primary)" }}>Admin</b></p>
            <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 6, color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </aside>

      <main className="app-main"><Outlet /></main>
    </div>
  );
};

export default AdminLayout;
