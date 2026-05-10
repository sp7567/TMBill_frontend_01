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
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)", fontFamily: "Inter, sans-serif" }}>
      <aside style={{ width: 240, background: "var(--sidebar-bg)", borderRight: "1px solid var(--sidebar-border)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ padding: "20px", borderBottom: "1px solid var(--border)" }}>
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
        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} style={({ isActive }) => ({
              display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10,
              marginBottom: 2, textDecoration: "none", fontSize: 14, fontWeight: 500,
              background: isActive ? "rgba(16,185,129,0.12)" : "transparent",
              color:      isActive ? "#34d399" : "var(--text-secondary)",
              border:     isActive ? "1px solid rgba(16,185,129,0.25)" : "1px solid transparent",
            })}>
              <Icon size={17} /> {label}
            </NavLink>
          ))}
        </nav>

        {/* Theme toggle */}
        <div style={{ padding: "8px 8px 0" }}>
          <button onClick={toggle} style={{
            display: "flex", alignItems: "center", gap: 8, width: "100%",
            padding: "8px 12px", borderRadius: 10, border: "1px solid var(--border)",
            background: "var(--bg-hover)", color: "var(--text-secondary)", cursor: "pointer", fontSize: 13, fontWeight: 600,
          }}>
            {isDark ? <Sun size={15} color="#f59e0b" /> : <Moon size={15} color="#6366f1" />}
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* Logout */}
        <div style={{ padding: "12px 16px" }}>
          <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 8, color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
      <main style={{ flex: 1, overflow: "auto" }}><Outlet /></main>
    </div>
  );
};

export default CustomerLayout;
