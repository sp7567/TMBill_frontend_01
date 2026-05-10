import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/client";
import toast from "react-hot-toast";
import {
  UtensilsCrossed,
  Eye,
  EyeOff,
  User,
  Store,
  ArrowRight,
} from "lucide-react";

const InputField = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = true,
}) => (
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
      {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      style={{
        width: "100%",
        padding: "11px 14px",
        borderRadius: 12,
        background: "var(--bg-input)",
        border: "1px solid var(--border-2)",
        color: "var(--text-primary)",
        fontSize: 13,
        outline: "none",
        boxSizing: "border-box",
        transition: "border-color 0.15s",
      }}
      onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
      onBlur={(e) => (e.target.style.borderColor = "var(--border-2)")}
    />
  </div>
);

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("customer");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  // Shared fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Customer-specific
  const [name, setName] = useState("");

  // Restaurant-specific
  const [restroName, setRestroName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6)
      return toast.error("Password must be at least 6 characters.");

    setLoading(true);
    try {
      const displayName = role === "restaurant" ? restroName : name;
      const user = await register(
        displayName,
        email,
        password,
        role,
        phone,
        address,
      );
      toast.success(`Welcome, ${user.name}! 🎉`);

      // If restaurant owner, auto-create the restaurant record
      if (role === "restaurant") {
        try {
          await api.post("/restaurants", {
            name: restroName,
            cuisine: "General",
            address,
            phone,
          });
        } catch {} // ignore if already exists
      }

      navigate(role === "restaurant" ? "/restaurant" : "/customer", {
        replace: true,
      });
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
      <div style={{ width: "100%", maxWidth: 480 }}>
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
              fontSize: 28,
              fontWeight: 900,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            Create Account
          </h1>
          <p style={{ color: "var(--text-muted)", marginTop: 6, fontSize: 14 }}>
            Join FoodHub today — it's free
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
          {/* Role Selector */}
          <div style={{ marginBottom: 24 }}>
            <p
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 10,
              }}
            >
              I am a <span style={{ color: "#ef4444" }}>*</span>
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              {/* Customer option */}
              <button
                type="button"
                onClick={() => setRole("customer")}
                style={{
                  padding: "14px 12px",
                  borderRadius: 14,
                  cursor: "pointer",
                  border: `2px solid ${role === "customer" ? "#10b981" : "var(--bg-input)"}`,
                  background:
                    role === "customer"
                      ? "rgba(16,185,129,0.08)"
                      : "var(--bg-input)",
                  transition: "all 0.2s",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background:
                      role === "customer"
                        ? "rgba(16,185,129,0.2)"
                        : "rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <User
                    size={20}
                    color={
                      role === "customer" ? "#10b981" : "var(--text-secondary)"
                    }
                  />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: role === "customer" ? "#10b981" : "#94a3b8",
                    }}
                  >
                    Customer
                  </p>
                  <p
                    style={{
                      fontSize: 10,
                      color: "var(--text-secondary)",
                      marginTop: 2,
                    }}
                  >
                    Order food
                  </p>
                </div>
              </button>

              {/* Restaurant option */}
              <button
                type="button"
                onClick={() => setRole("restaurant")}
                style={{
                  padding: "14px 12px",
                  borderRadius: 14,
                  cursor: "pointer",
                  border: `2px solid ${role === "restaurant" ? "#f59e0b" : "var(--border-2)"}`,
                  background:
                    role === "restaurant"
                      ? "rgba(245,158,11,0.08)"
                      : "var(--bg-input)",
                  transition: "all 0.2s",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background:
                      role === "restaurant"
                        ? "rgba(245,158,11,0.2)"
                        : "rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Store
                    size={20}
                    color={
                      role === "restaurant"
                        ? "#f59e0b"
                        : "var(--text-secondary)"
                    }
                  />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color:
                        role === "restaurant"
                          ? "#f59e0b"
                          : "var(--text-primary)",
                    }}
                  >
                    Restaurant
                  </p>
                  <p
                    style={{
                      fontSize: 10,
                      color: "var(--text-secondary)",
                      marginTop: 2,
                    }}
                  >
                    Manage orders
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            {/* Role-specific name field */}
            {role === "customer" ? (
              <InputField
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
              />
            ) : (
              <InputField
                label="Restaurant Name"
                value={restroName}
                onChange={(e) => setRestroName(e.target.value)}
                placeholder="Spice Garden"
              />
            )}

            {/* Email */}
            <InputField
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
            />

            {/* Mobile Number */}
            <InputField
              label="Mobile Number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              required={false}
            />

            {/* Address */}
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
                {role === "restaurant" ? "Restaurant Address" : "Your Address"}
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={
                  role === "restaurant"
                    ? "123 Main Street, City"
                    : "Block A, Street Name, City"
                }
                rows={2}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: 12,
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-2)",
                  color: "var(--text-primary)",
                  fontSize: 13,
                  outline: "none",
                  boxSizing: "border-box",
                  resize: "none",
                  fontFamily: "Inter, sans-serif",
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
                Password <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  style={{
                    width: "100%",
                    padding: "11px 42px 11px 14px",
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

            {/* Submit */}
            <button
              disabled={loading}
              style={{
                marginTop: 8,
                padding: "13px",
                borderRadius: 14,
                background:
                  role === "restaurant"
                    ? "linear-gradient(135deg, #f59e0b, #d97706)"
                    : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: role === "restaurant" ? "#000" : "#fff",
                fontWeight: 800,
                fontSize: 14,
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                boxShadow:
                  role === "restaurant"
                    ? "0 8px 24px rgba(245,158,11,0.3)"
                    : "0 8px 24px rgba(99,102,241,0.3)",
                opacity: loading ? 0.7 : 1,
                transition: "opacity 0.2s",
              }}
            >
              {loading ? (
                "Creating account..."
              ) : (
                <>
                  {role === "restaurant"
                    ? "Register Restaurant"
                    : "Create Account"}{" "}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

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
            <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>
              already have an account?
            </span>
            <div
              style={{ flex: 1, height: 1, background: "var(--bg-input)" }}
            />
          </div>

          <Link
            to="/login"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "11px",
              borderRadius: 14,
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
              transition: "all 0.15s",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--border-2)";
              e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--bg-input)";
              e.currentTarget.style.color = "#94a3b8";
            }}
          >
            Sign In Instead
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
