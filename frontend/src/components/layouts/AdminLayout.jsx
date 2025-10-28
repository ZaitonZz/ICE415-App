import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Shield, LogOut, Home } from "lucide-react";

const AdminLayout = ({ children }) => {
  const { isAuthenticated, isAdmin, loading, user, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-red-200">
        <div className="text-center bg-white p-8 rounded-2xl shadow-2xl max-w-md">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            You don't have admin privileges to access this area.
          </p>
          <a
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <Home className="w-4 h-4" />
            <span>Go to Home</span>
          </a>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout from admin panel?")) {
      await logout();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Admin Navigation Bar */}
      <nav className="bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Shield className="w-8 h-8 text-purple-400" />
              <div className="text-2xl font-bold text-white">Admin Panel</div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-purple-300">
                <Shield className="w-5 h-5" />
                <span className="font-medium">{user?.username}</span>
                <span className="text-xs bg-purple-600 px-2 py-1 rounded-full">
                  Admin
                </span>
              </div>

              <a
                href="/"
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </a>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Admin Content */}
      <main>{children}</main>
    </div>
  );
};

export default AdminLayout;
