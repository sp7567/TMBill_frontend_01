import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";
import { Search, Star, MapPin, ChevronRight } from "lucide-react";

const RestaurantListPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    const p = new URLSearchParams();
    if (search) p.set("search", search);
    if (cuisine) p.set("cuisine", cuisine);
    api
      .get(`/restaurants/public?${p}`)
      .then((r) => setRestaurants(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [search, cuisine]);

  const CUISINES = [
    "Indian",
    "Chinese",
    "Italian",
    "Mexican",
    "Fast Food",
    "Desserts",
  ];

  return (
    <div style={{ padding: "32px 40px" }}>
      <h1
        style={{
          fontSize: 24,
          fontWeight: 800,
          color: "var(--text-primary)",
          marginBottom: 4,
        }}
      >
        🍕 What are you craving?
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 24 }}>
        Choose from {restaurants.length} restaurants nearby
      </p>

      {/* Search */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 400 }}>
          <Search
            size={16}
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
            }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search restaurants..."
            style={{
              width: "100%",
              paddingLeft: 42,
              paddingRight: 16,
              paddingTop: 11,
              paddingBottom: 11,
              borderRadius: 12,
              background: "var(--bg-card)",
              border: "1px solid var(--border-2)",
              color: "var(--text-primary)",
              fontSize: 13,
              outline: "none",
            }}
          />
        </div>
      </div>

      {/* Restaurant cards */}
      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>Finding restaurants...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {restaurants.map((r) => (
            <div
              key={r._id}
              onClick={() => navigate(`/customer/restaurant/${r._id}`)}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-2)",
                borderRadius: 18,
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "#10b98133")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "var(--border)")
              }
            >
              {/* Banner */}
              <div
                style={{
                  height: 100,
                  background: "var(--bg-hover)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 36,
                }}
              >
                🍽️
              </div>
              <div style={{ padding: "16px 18px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        fontSize: 15,
                      }}
                    >
                      {r.name}
                    </h3>
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--text-muted)",
                        marginTop: 2,
                      }}
                    >
                      {r.cuisine}
                    </p>
                  </div>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: 9999,
                      fontSize: 11,
                      fontWeight: 700,
                      background: "#10b98122",
                      color: "#34d399",
                    }}
                  >
                    OPEN
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 10,
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 12,
                      color: "#f59e0b",
                    }}
                  >
                    <Star size={12} fill="#f59e0b" /> {r.rating.toFixed(1)}
                  </span>
                  <span style={{ color: "var(--bg-input)" }}>·</span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 12,
                      color: "var(--text-muted)",
                    }}
                  >
                    <MapPin size={11} /> {r.address?.split(",")[0]}
                  </span>
                </div>
                <div
                  style={{
                    marginTop: 12,
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 12,
                      color: "#10b981",
                      fontWeight: 600,
                    }}
                  >
                    Order Now <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          ))}
          {restaurants.length === 0 && (
            <p
              style={{
                color: "var(--text-muted)",
                gridColumn: "1/-1",
                textAlign: "center",
                padding: 40,
              }}
            >
              No restaurants found.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default RestaurantListPage;
