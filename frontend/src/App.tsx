import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import NavBar from "./components/NavBar";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import Loader from "./components/ui/Loader";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore";

const App = () => {
  const { checkAuth, isCheckingAuth, isAuthenticated } = useAuthStore();
  const { theme } = useThemeStore();
  useEffect(() => {
    checkAuth();
  }, []);
  console.log("isCheckingAuth:", isCheckingAuth, isAuthenticated);

  const PublicRoutes = () =>
    !isAuthenticated ? <Outlet /> : <Navigate to="/" />;
  const PrivateRoutes = () =>
    isAuthenticated ? <Outlet /> : <Navigate to="/login" />;

  if (isCheckingAuth) {
    return <Loader />;
  }

  return (
    <div data-theme={theme}>
      <NavBar />
      <Routes>
        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
          <Route path="/settings" element={<SettingsPage />} />
      </Routes>
      <Toaster position="bottom-center" reverseOrder={false} />
    </div>
  );
};

export default App;
