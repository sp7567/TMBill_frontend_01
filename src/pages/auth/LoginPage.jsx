import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import {
  UtensilsCrossed,
  Eye,
  EyeOff,
  ArrowRight,
  UserPlus,
} from "lucide-react";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}! 👋`);
      const dest =
        user.role === "admin"
          ? "/admin"
          : user.role === "restaurant"
            ? "/restaurant"
            : "/customer";
      navigate(dest, { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-base)",
        padding: "24px 16px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              margin: "0 auto 16px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 40px rgba(99,102,241,0.35)",
            }}
          >
            <UtensilsCrossed size={30} color="white" />
          </div>
          <h1
            style={{
              fontSize: 30,
              fontWeight: 900,
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
            }}
          >
            FoodHub
          </h1>
          <p style={{ color: "var(--text-muted)", marginTop: 6, fontSize: 14 }}>
            Sign in to continue
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 24,
            padding: "32px 28px",
            boxShadow: "var(--shadow)",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            {/* Email */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  color: "var(--text-muted)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 6,
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 12,
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-2)",
                  color: "var(--text-primary)",
                  fontSize: 13,
                  outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border-2)")}
              />
            </div>

            {/* Password */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  color: "var(--text-muted)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 6,
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 42px 12px 14px",
                    borderRadius: 12,
                    background: "var(--bg-input)",
                    border: "1px solid var(--border-2)",
                    color: "var(--text-primary)",
                    fontSize: 13,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "var(--border-2)")
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((p) => !p)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                    display: "flex",
                  }}
                >
                  {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Sign In button */}
            <button
              disabled={loading}
              style={{
                marginTop: 4,
                padding: "13px",
                borderRadius: 14,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff",
                fontWeight: 800,
                fontSize: 14,
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                boxShadow: "0 8px 24px rgba(99,102,241,0.3)",
                opacity: loading ? 0.7 : 1,
                transition: "opacity 0.2s",
              }}
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  {" "}
                  Sign In <ArrowRight size={16} />{" "}
                </>
              )}
            </button>
          </form>

          {/* Admin hint */}
          <div
            style={{
              marginTop: 18,
              padding: "10px 14px",
              borderRadius: 12,
              background: "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.2)",
            }}
          >
            <p
              style={{
                fontSize: 11,
                color: "#818cf8",
                fontWeight: 600,
                marginBottom: 2,
              }}
            >
              🔐 Admin credentials
            </p>
            <p style={{ fontSize: 12, color: "#6366f1" }}>
              admin@foodhub.com / Admin@1234
            </p>
          </div>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              margin: "20px 0",
            }}
          >
            <div
              style={{ flex: 1, height: 1, background: "var(--bg-input)" }}
            />
            <span style={{ color: "var(--text-muted)", fontSize: 12 }}>
              new here?
            </span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          {/* Register button — prominent */}
          <Link to="/register" style={{ textDecoration: "none" }}>
            <button
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: 14,
                background: "transparent",
                border: "2px solid var(--border)",
                color: "var(--text-secondary)",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#6366f1";
                e.currentTarget.style.color = "#6366f1";
                e.currentTarget.style.background = "rgba(99,102,241,0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--text-secondary)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <UserPlus size={17} /> Create New Account
            </button>
          </Link>

          {/* Role info */}
          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            {[
              {
                label: "Admin",
                desc: "Manage all",
                color: "#10b981",
                emoji: "🛡️",
              },
              {
                label: "Restaurant",
                desc: "Manage orders",
                color: "#f59e0b",
                emoji: "🏪",
              },
            ].map((r) => (
              <div
                key={r.label}
                style={{
                  flex: 1,
                  padding: "10px 12px",
                  borderRadius: 10,
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-2)",
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: 16, marginBottom: 4 }}>{r.emoji}</p>
                <p style={{ fontSize: 12, fontWeight: 700, color: r.color }}>
                  {r.label}
                </p>
                <p
                  style={{
                    fontSize: 10,
                    color: "var(--text-muted)",
                    marginTop: 2,
                  }}
                >
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
