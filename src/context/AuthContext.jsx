import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("fh_token");
    const saved = localStorage.getItem("fh_user");
    if (token && saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return null;
  });
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("fh_token", data.data.token);
    localStorage.setItem("fh_user", JSON.stringify(data.data.user));
    setUser(data.data.user);
    return data.data.user;
  }, []);

  const register = useCallback(
    async (name, email, password, role, phone = "", address = "") => {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
        role,
        phone,
        address,
      });
      localStorage.setItem("fh_token", data.data.token);
      localStorage.setItem("fh_user", JSON.stringify(data.data.user));
      setUser(data.data.user);
      return data.data.user;
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("fh_token");
    localStorage.removeItem("fh_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
