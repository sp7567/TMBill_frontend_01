import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import RestaurantLayout from "./layouts/RestaurantLayout";
import CustomerLayout from "./layouts/CustomerLayout";

// Public pages
import LandingPage from "./pages/public/LandingPage";
import AboutPage from "./pages/public/AboutPage";
import ContactPage from "./pages/public/ContactPage";

// Auth pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// Admin pages (lazy)
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminUsersPage = lazy(() => import("./pages/admin/AdminUsersPage"));
const AdminRestaurantsPage = lazy(
  () => import("./pages/admin/AdminRestaurantsPage"),
);

// Restaurant pages (lazy)
const RestaurantOrdersPage = lazy(
  () => import("./pages/restaurant/RestaurantOrdersPage"),
);
const MenuPage = lazy(() => import("./pages/restaurant/MenuPage"));

// Customer pages (lazy)
const RestaurantListPage = lazy(
  () => import("./pages/customer/RestaurantListPage"),
);
const MenuOrderPage = lazy(() => import("./pages/customer/MenuOrderPage"));
const MyOrdersPage = lazy(() => import("./pages/customer/MyOrdersPage"));

// Restaurant profile (stub)
const RestaurantProfilePage = lazy(
  () => import("./pages/restaurant/RestaurantProfilePage"),
);

const Loader = () => (
  <div
    style={{
      minHeight: "60vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        width: 36,
        height: 36,
        border: "3px solid rgba(99,102,241,0.2)",
        borderTopColor: "#6366f1",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }}
    />
    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
  </div>
);

const App = () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="restaurants" element={<AdminRestaurantsPage />} />
      </Route>

      {/* Restaurant */}
      <Route
        path="/restaurant"
        element={
          <ProtectedRoute role="restaurant">
            <RestaurantLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<RestaurantOrdersPage />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="orders" element={<RestaurantOrdersPage />} />
        <Route path="profile" element={<RestaurantProfilePage />} />
      </Route>

      {/* Customer */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute role="customer">
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<RestaurantListPage />} />
        <Route path="restaurant/:id" element={<MenuOrderPage />} />
        <Route path="orders" element={<MyOrdersPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Suspense>
);

export default App;
