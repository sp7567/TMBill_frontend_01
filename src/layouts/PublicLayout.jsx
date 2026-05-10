import { Outlet } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";

const PublicLayout = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-base)",
      }}
    >
      <PublicNavbar />
      <main style={{ flex: 1, display: "flex" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
