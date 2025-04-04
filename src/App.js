import { Route, Routes, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "./contexts/AuthContext";
import theme from "./theme";
import Login from "./components/Login";
import Signup from "./components/Signup";
import MobileCoverLandingPage from "./MobileCoverLandingPage";
import ProductDetail from "./components/ProductDetail";
import CartPage from "./components/CartPage";
import CategoryPage from "./components/CategoryPage";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import AdminPanel from "./pages/admin/AdminPanel";
import AdminRoute from "./components/AdminRoute"; // New component for admin protection
import ProductManagement from "./pages/admin/ProductManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import ForgotPassword from "./components/ForgotPassword";




// import UserManagement from "./pages/admin/UserManagement";
// import NotFound from "./components/NotFound"; // New 404 component
// import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />

          {/* Protected User Routes */}
          <Route
            path="/"
            element={
              <AuthenticatedRoute>
                <MobileCoverLandingPage />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/product/:productId"
            element={
              <AuthenticatedRoute>
                <ProductDetail />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <AuthenticatedRoute>
                <CartPage />
              </AuthenticatedRoute>
            }
          />
          <Route
            path="/forgotpassword"
            element={
             
                <ForgotPassword />
 
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <Routes>
                  <Route path="/" element={<AdminPanel />}>
                    <Route path="products" element={<ProductManagement />} />
                    <Route path="orders" element={<OrderManagement />} />
                    {/* <Route index element={<AdminDashboard />} /> */}
                    {/* <Route path="users" element={<UserManagement />} /> */}
                  </Route>
                </Routes>
              </AdminRoute>
            }
          />

          {/* Error Routes */}
          {/* <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} /> */}
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
