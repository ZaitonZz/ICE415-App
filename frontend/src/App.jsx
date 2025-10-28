import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Layouts
import GuestLayout from "./components/layouts/GuestLayout";
import AuthenticatedLayout from "./components/layouts/AuthenticatedLayout";
import AdminLayout from "./components/layouts/AdminLayout";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import GamePage from "./pages/GamePage";
import AdminPanelPage from "./pages/AdminPanelPage";

import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes - Guest Layout */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth Routes - Guest Layout (redirects to game if authenticated) */}
          <Route
            path="/login"
            element={
              <GuestLayout>
                <LoginPage />
              </GuestLayout>
            }
          />
          <Route
            path="/register"
            element={
              <GuestLayout>
                <RegisterPage />
              </GuestLayout>
            }
          />
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Protected Routes - Authenticated Layout */}
          <Route
            path="/game"
            element={
              <AuthenticatedLayout>
                <GamePage />
              </AuthenticatedLayout>
            }
          />

          {/* Admin Routes - Admin Layout (directly shows panel after login) */}
          <Route
            path="/admin"
            element={
              <AdminLayout>
                <AdminPanelPage />
              </AdminLayout>
            }
          />

          {/* Catch all - redirect to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
