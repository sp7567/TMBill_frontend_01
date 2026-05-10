import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useSocket } from "../context/SocketContext";
import api from "../api/client";
import { LayoutDashboard, UtensilsCrossed, ShoppingBag, Settings, LogOut, Wifi, WifiOff, Moon, Sun } from "lucide-react";
import toast from "react-hot-toast";

const NAV = [
  { to: "/restaurant",         label: "Orders",   icon: ShoppingBag,    end: true },
  { to: "/restaurant/menu",    label: "Menu",     icon: UtensilsCrossed },
  { to: "/restaurant/profile", label: "Profile",  icon: Settings },
];

const RestaurantLayout = () => {
  const { user, logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const { isConnected } = useSocket();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    api.get("/restaurants/me").then(r => setRestaurant(r.data.data)).catch(() => {});
  }, []);

  const handleLogout = () => { logout(); toast.success("Logged out"); navigate("/login"); };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)", fontFamily: "Inter, sans-serif" }}>
      <aside style={{ width: 240, background: "var(--sidebar-bg)", borderRight: "1px solid var(--sidebar-border)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ padding: "20px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#f59e0b,#ef4444)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <UtensilsCrossed size={18} color="white" />
            </div>
            <div>
              <p style={{ fontWeight: 800, fontSize: 14, color: "var(--text-primary)", maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {restaurant?.name ?? user?.name ?? "Restaurant"}
              </p>
              <p style={{ fontSize: 10, color: "#f59e0b", fontWeight: 700 }}>RESTAURANT</p>
            </div>
          </div>
          {/* Live indicator */}
          <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: isConnected ? "#10b981" : "var(--text-muted)" }}>
            {isConnected ? <Wifi size={11} /> : <WifiOff size={11} />}
            {isConnected ? "Live orders on" : "Reconnecting..."}
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} style={({ isActive }) => ({
              display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10,
              marginBottom: 2, textDecoration: "none", fontSize: 14, fontWeight: 500,
              background: isActive ? "rgba(245,158,11,0.12)" : "transparent",
              color:      isActive ? "#fbbf24" : "var(--text-secondary)",
              border:     isActive ? "1px solid rgba(245,158,11,0.25)" : "1px solid transparent",
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

export default RestaurantLayout;
