import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useSocket } from "../context/SocketContext";
import { Home, ShoppingBag, LogOut, UtensilsCrossed, Wifi, WifiOff, Moon, Sun } from "lucide-react";
import toast from "react-hot-toast";

const NAV = [
  { to: "/customer",        label: "Restaurants", icon: Home,        end: true },
  { to: "/customer/orders", label: "My Orders",   icon: ShoppingBag },
];

const CustomerLayout = () => {
  const { user, logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const { isConnected } = useSocket();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); toast.success("See you again!"); navigate("/login"); };

  return (
    <div className="app-layout">
      <aside className="app-sidebar">
        {/* Logo */}
        <div className="app-sidebar-logo">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#10b981,#059669)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <UtensilsCrossed size={18} color="white" />
            </div>
            <div>
              <p style={{ fontWeight: 800, fontSize: 14, color: "var(--text-primary)" }}>FoodHub</p>
              <p style={{ fontSize: 10, color: "#10b981", fontWeight: 700 }}>ORDER FOOD</p>
            </div>
          </div>
          {/* User info */}
          <div style={{ padding: "10px 12px", background: "var(--bg-hover)", borderRadius: 10, border: "1px solid var(--border)" }}>
            <p style={{ fontSize: 11, color: "var(--text-muted)" }}>Welcome back,</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginTop: 1 }}>{user?.name}</p>
          </div>
          {/* Live status */}
          <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: isConnected ? "#10b981" : "var(--text-muted)" }}>
            {isConnected ? <Wifi size={11} /> : <WifiOff size={11} />}
            {isConnected ? "Real-time updates on" : "Offline"}
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
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 4 }}>
             <button onClick={handleLogout} style={{ width: '100%', display: "flex", alignItems: "center", justifyContent: 'center', gap: 6, color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </aside>
      <main className="app-main"><Outlet /></main>
    </div>
  );
};

export default CustomerLayout;
