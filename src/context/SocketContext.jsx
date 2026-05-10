import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const URL = import.meta.env.VITE_API_URL || "/";
    const s = io(URL, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
    });

    setSocket(s);

    s.on("connect", () => setIsConnected(true));
    s.on("disconnect", () => setIsConnected(false));

    // Join role-based room for targeted events
    if (user) {
      if (user.role === "restaurant")
        s.emit("join_room", `restaurant:${user.restaurant_id || user.id}`);
      if (user.role === "customer")
        s.emit("join_room", `customer:${user._id || user.id}`);
    }

    s.on("order_placed", (order) => {
      toast.success(`🛍️ New order from ${order.customer_id?.name}!`, {
        duration: 6000,
      });
    });
    s.on("order_status_updated", (data) => {
      toast.success(`📦 Order is now: ${data.status}`, { duration: 5000 });
    });

    setSocket(s);
    return () => s.close();
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
