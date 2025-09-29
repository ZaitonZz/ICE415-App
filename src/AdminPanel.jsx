import React, { useState } from "react";
import {
  Settings,
  X,
  Plus,
  Edit,
  Trash2,
  Save,
  RotateCcw,
  User,
  Heart,
  Gift,
  Camera,
  Trophy,
  Palette,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  Home,
  Database,
  BarChart3,
  Shield,
} from "lucide-react";

const AdminPanel = ({
  isOpen,
  onClose,
  gameData,
  onUpdateGameData,
  waifuTypes,
  achievementList,
  giftList,
  outfitList,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Admin password (in a real app, this would be server-side)
  const ADMIN_PASSWORD = "admin123";

  // Notification functions
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Authentication functions
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate loading delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError("");
      setPassword("");
      showNotification("Welcome to Admin Panel!", "success");
    } else {
      setLoginError("Incorrect password. Please try again.");
      setPassword("");
      showNotification("Invalid password. Please try again.", "error");
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
    setLoginError("");
    setActiveTab("overview");
    showNotification("Logged out successfully", "info");
  };

  // Reset game data
  const resetGameData = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all game data? This cannot be undone."
      )
    ) {
      setIsLoading(true);
      setTimeout(() => {
        onUpdateGameData({
          gameState: "start",
          selectedWaifu: null,
          mood: "neutral",
          affection: 50,
          conversationCount: 0,
          achievements: [],
          unlockedOutfits: [],
          currentOutfit: "default",
          screenshots: [],
          gifts: [],
          currentDate: 0,
          storyProgress: 0,
          unlockedEndings: [],
        });
        setIsLoading(false);
        showNotification("Game data reset successfully!", "success");
      }, 1500);
    }
  };

  // Update specific game data
  const updateGameData = (key, value) => {
    onUpdateGameData({ [key]: value });
    showNotification(`${key} updated successfully!`, "success");
  };

  // Handle form changes
  const handleFormChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  // Save edited item
  const saveEdit = () => {
    if (editingItem && editForm) {
      setIsLoading(true);
      setTimeout(() => {
        // Handle different item types
        if (activeTab === "waifus") {
          // Update waifu type
          const updatedWaifuTypes = { ...waifuTypes };
          updatedWaifuTypes[editForm.id] = { ...editForm };
          onUpdateGameData({ waifuTypes: updatedWaifuTypes });
        }
        setEditingItem(null);
        setEditForm({});
        setIsLoading(false);
        showNotification("Item saved successfully!", "success");
      }, 1000);
    }
  };

  // Delete item
  const deleteItem = (itemId, itemType) => {
    if (window.confirm(`Are you sure you want to delete this ${itemType}?`)) {
      setIsLoading(true);
      setTimeout(() => {
        if (itemType === "screenshot") {
          const updatedScreenshots = gameData.screenshots.filter(
            (s) => s.id !== itemId
          );
          updateGameData("screenshots", updatedScreenshots);
        } else if (itemType === "gift") {
          const updatedGifts = gameData.gifts.filter((g) => g.id !== itemId);
          updateGameData("gifts", updatedGifts);
        }
        setIsLoading(false);
        showNotification(`${itemType} deleted successfully!`, "success");
      }, 1000);
    }
  };

  if (!isOpen) return null;

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 z-50 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-md p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Access</h1>
            <p className="text-gray-300">
              Enter password to access admin panel
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pl-12 pr-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                  placeholder="Enter admin password"
                  required
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {loginError && (
                <p className="text-red-400 text-sm mt-2">{loginError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Access Admin Panel</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Admin Panel
  return (
    <div className="fixed inset-0 bg-gray-50 dark:bg-gray-900 z-50 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Yandere AI Game Management
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={onClose}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Home className="w-4 h-4" />
                <span>Back to Game</span>
              </button>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Admin Online</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div
            className={`px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 ${
              notification.type === "success"
                ? "bg-green-500 text-white"
                : notification.type === "error"
                ? "bg-red-500 text-white"
                : "bg-blue-500 text-white"
            }`}
          >
            <div className="w-5 h-5">
              {notification.type === "success" ? (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : notification.type === "error" ? (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-2xl">
            <div className="flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-lg font-medium text-gray-900 dark:text-white">
                Processing...
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <div className="space-y-2">
              {[
                {
                  id: "overview",
                  label: "Dashboard",
                  icon: BarChart3,
                  description: "Game statistics",
                },
                {
                  id: "waifus",
                  label: "Waifus",
                  icon: Heart,
                  description: "Character management",
                },
                {
                  id: "achievements",
                  label: "Achievements",
                  icon: Trophy,
                  description: "Unlock system",
                },
                {
                  id: "gifts",
                  label: "Gifts",
                  icon: Gift,
                  description: "Gift tracking",
                },
                {
                  id: "screenshots",
                  label: "Screenshots",
                  icon: Camera,
                  description: "Photo gallery",
                },
                {
                  id: "outfits",
                  label: "Outfits",
                  icon: Palette,
                  description: "Wardrobe system",
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-all duration-200 transform hover:scale-105 ${
                    activeTab === tab.id
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 shadow-md"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 hover:shadow-sm"
                  }`}
                >
                  <tab.icon
                    className={`w-5 h-5 ${
                      activeTab === tab.id ? "text-blue-600" : ""
                    }`}
                  />
                  <div>
                    <div className="font-medium">{tab.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {tab.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="p-6">
            {/* Page Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {activeTab === "overview" && "Dashboard"}
                {activeTab === "waifus" && "Waifu Management"}
                {activeTab === "achievements" && "Achievement System"}
                {activeTab === "gifts" && "Gift Tracking"}
                {activeTab === "screenshots" && "Screenshot Gallery"}
                {activeTab === "outfits" && "Wardrobe System"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {activeTab === "overview" &&
                  "Monitor game statistics and performance"}
                {activeTab === "waifus" &&
                  "Manage character types and personalities"}
                {activeTab === "achievements" &&
                  "Control achievement unlocks and progress"}
                {activeTab === "gifts" && "Track and manage gift interactions"}
                {activeTab === "screenshots" &&
                  "View and manage captured moments"}
                {activeTab === "outfits" &&
                  "Control outfit unlocks and wardrobe"}
              </p>
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm font-medium">
                          Game State
                        </p>
                        <p className="text-2xl font-bold capitalize">
                          {gameData.gameState}
                        </p>
                      </div>
                      <Database className="w-8 h-8 text-blue-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm font-medium">
                          Affection Level
                        </p>
                        <p className="text-2xl font-bold">
                          {gameData.affection}%
                        </p>
                      </div>
                      <Heart className="w-8 h-8 text-green-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm font-medium">
                          Conversations
                        </p>
                        <p className="text-2xl font-bold">
                          {gameData.conversationCount}
                        </p>
                      </div>
                      <User className="w-8 h-8 text-purple-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-xl text-white shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-100 text-sm font-medium">
                          Achievements
                        </p>
                        <p className="text-2xl font-bold">
                          {gameData.achievements.length}
                        </p>
                      </div>
                      <Trophy className="w-8 h-8 text-yellow-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-6 rounded-xl text-white shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-pink-100 text-sm font-medium">
                          Screenshots
                        </p>
                        <p className="text-2xl font-bold">
                          {gameData.screenshots.length}
                        </p>
                      </div>
                      <Camera className="w-8 h-8 text-pink-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-6 rounded-xl text-white shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-indigo-100 text-sm font-medium">
                          Gifts Given
                        </p>
                        <p className="text-2xl font-bold">
                          {gameData.gifts.length}
                        </p>
                      </div>
                      <Gift className="w-8 h-8 text-indigo-200" />
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                        <RotateCcw className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
                        Danger Zone
                      </h3>
                      <p className="text-red-700 dark:text-red-300 mb-4">
                        This will permanently reset all game data including
                        progress, achievements, and user interactions. This
                        action cannot be undone.
                      </p>
                      <button
                        onClick={resetGameData}
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2 font-medium transform hover:scale-105 disabled:scale-100 shadow-lg"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Resetting...</span>
                          </>
                        ) : (
                          <>
                            <RotateCcw className="w-4 h-4" />
                            <span>Reset All Game Data</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Waifus Tab */}
            {activeTab === "waifus" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Waifu Types
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Manage character personalities and traits
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingItem("new")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 font-medium shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Waifu</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(waifuTypes).map(([key, waifu]) => (
                    <div
                      key={key}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-3xl">{waifu.icon}</div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                              {waifu.name}
                            </h4>
                            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                              {waifu.personality}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setEditingItem(key);
                            setEditForm({ ...waifu, id: key });
                          }}
                          className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                        {waifu.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {waifu.traits.map((trait, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                          >
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements Tab */}
            {activeTab === "achievements" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Achievement System
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Control achievement unlocks and progress tracking
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {achievementList.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 p-6 transition-all duration-200 ${
                        gameData.achievements.includes(achievement.id)
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-green-200 dark:shadow-green-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="text-3xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                            {achievement.name}
                          </h4>
                          <div
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              gameData.achievements.includes(achievement.id)
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {gameData.achievements.includes(achievement.id)
                              ? "Unlocked"
                              : "Locked"}
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        {achievement.description}
                      </p>

                      <button
                        onClick={() => {
                          const newAchievements =
                            gameData.achievements.includes(achievement.id)
                              ? gameData.achievements.filter(
                                  (a) => a !== achievement.id
                                )
                              : [...gameData.achievements, achievement.id];
                          updateGameData("achievements", newAchievements);
                        }}
                        className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                          gameData.achievements.includes(achievement.id)
                            ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
                            : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50"
                        }`}
                      >
                        {gameData.achievements.includes(achievement.id)
                          ? "Remove Achievement"
                          : "Unlock Achievement"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gifts Tab */}
            {activeTab === "gifts" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Gift Tracking
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Monitor and manage gift interactions
                  </p>
                </div>

                <div className="space-y-4">
                  {gameData.gifts.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                      <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        No Gifts Given Yet
                      </h4>
                      <p className="text-gray-500 dark:text-gray-400">
                        Gifts will appear here once they are given in the game
                      </p>
                    </div>
                  ) : (
                    gameData.gifts.map((gift) => (
                      <div
                        key={gift.id}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-4xl">{gift.icon}</div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                                {gift.name}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                +{gift.value} affection points
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500">
                                Given on{" "}
                                {new Date(gift.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => deleteItem(gift.id, "gift")}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Screenshots Tab */}
            {activeTab === "screenshots" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Screenshot Gallery
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    View and manage captured moments
                  </p>
                </div>

                <div className="space-y-4">
                  {gameData.screenshots.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                      <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        No Screenshots Yet
                      </h4>
                      <p className="text-gray-500 dark:text-gray-400">
                        Screenshots will appear here once they are taken in the
                        game
                      </p>
                    </div>
                  ) : (
                    gameData.screenshots.map((screenshot) => (
                      <div
                        key={screenshot.id}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                              <Camera className="w-8 h-8 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                                Screenshot #{screenshot.id}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {screenshot.waifu?.name} • {screenshot.mood} •{" "}
                                {screenshot.affection}% affection
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500">
                                Captured on {screenshot.timestamp}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              deleteItem(screenshot.id, "screenshot")
                            }
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Outfits Tab */}
            {activeTab === "outfits" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Wardrobe System
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Control outfit unlocks and wardrobe management
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {Object.entries(outfitList).map(([key, outfit]) => (
                    <div
                      key={key}
                      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 p-6 text-center transition-all duration-200 hover:shadow-xl ${
                        gameData.unlockedOutfits.includes(key)
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-green-200 dark:shadow-green-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <div className="text-4xl mb-3">{outfit.icon}</div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
                        {outfit.name}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                        {outfit.description}
                      </p>
                      <div
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-4 ${
                          gameData.unlockedOutfits.includes(key)
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {gameData.unlockedOutfits.includes(key)
                          ? "Unlocked"
                          : "Locked"}
                      </div>
                      <button
                        onClick={() => {
                          const newOutfits = gameData.unlockedOutfits.includes(
                            key
                          )
                            ? gameData.unlockedOutfits.filter((o) => o !== key)
                            : [...gameData.unlockedOutfits, key];
                          updateGameData("unlockedOutfits", newOutfits);
                        }}
                        className={`w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          gameData.unlockedOutfits.includes(key)
                            ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
                            : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50"
                        }`}
                      >
                        {gameData.unlockedOutfits.includes(key)
                          ? "Lock"
                          : "Unlock"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Edit Item
              </h3>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setEditForm({});
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={editForm.name || ""}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={editForm.description || ""}
                  onChange={(e) =>
                    handleFormChange("description", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                  rows="4"
                  placeholder="Enter description"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setEditForm({});
                  }}
                  className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 font-medium shadow-lg"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
