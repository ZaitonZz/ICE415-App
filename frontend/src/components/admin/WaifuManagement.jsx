import React, { useState, useEffect } from "react";
import {
  getAllWaifus,
  createWaifu,
  updateWaifu,
  deleteWaifu,
  uploadEmotionImage,
  getWaifuImageUrl,
} from "../../services/waifuApi";

const WaifuManagement = ({ token }) => {
  const [waifus, setWaifus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingWaifu, setEditingWaifu] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Debug: Log token status
  useEffect(() => {
    console.log(
      "WaifuManagement - token received:",
      token ? "Present" : "Missing"
    );
    console.log("WaifuManagement - token value:", token);
  }, [token]);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    personality: "",
    description: "",
    color: "from-pink-400 to-red-500",
    icon: "💕",
    traits: "",
    yandereTrigger: "",
    isActive: true,
    order: 0,
  });

  const [emotionImages, setEmotionImages] = useState({
    normal: null,
    happy: null,
    sad: null,
    angry: null,
  });

  useEffect(() => {
    fetchWaifus();
  }, []);

  const fetchWaifus = async () => {
    try {
      setLoading(true);
      console.log("Fetching waifus...");
      const response = await getAllWaifus(null); // Get all waifus (both active and inactive)
      console.log("Waifus fetched:", response);
      setWaifus(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching waifus:", err);
      setError(err.message || err.error || "Failed to fetch waifus");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (emotion, file) => {
    setEmotionImages((prev) => ({
      ...prev,
      [emotion]: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      // Check if token is available
      if (!token) {
        setError("Authentication required. Please login again.");
        setLoading(false);
        return;
      }

      // Prepare traits array
      const traits = formData.traits
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t);

      // Create/Update waifu
      let waifuId;
      if (editingWaifu) {
        const updateData = {
          ...formData,
          traits,
        };
        const response = await updateWaifu(editingWaifu._id, updateData, token);
        waifuId = editingWaifu._id;
      } else {
        // For new waifu, we need to upload images first
        // Create temporary emotion URLs
        const tempEmotions = [
          { emotion: "normal", imageUrl: "/placeholder.png" },
          { emotion: "happy", imageUrl: "/placeholder.png" },
          { emotion: "sad", imageUrl: "/placeholder.png" },
          { emotion: "angry", imageUrl: "/placeholder.png" },
        ];

        const createData = {
          ...formData,
          traits,
          emotions: tempEmotions,
        };

        const response = await createWaifu(createData, token);
        waifuId = response.data._id;
      }

      // Upload emotion images if provided
      for (const [emotion, file] of Object.entries(emotionImages)) {
        if (file) {
          await uploadEmotionImage(waifuId, emotion, file, token);
        }
      }

      // Reset form
      setFormData({
        name: "",
        personality: "",
        description: "",
        color: "from-pink-400 to-red-500",
        icon: "💕",
        traits: "",
        yandereTrigger: "",
        isActive: true,
        order: 0,
      });
      setEmotionImages({
        normal: null,
        happy: null,
        sad: null,
        angry: null,
      });
      setEditingWaifu(null);
      setShowCreateForm(false);

      // Refresh list
      await fetchWaifus();
    } catch (err) {
      console.error("Error saving waifu:", err);
      // Better error messaging
      const errorMessage =
        err.message ||
        err.error ||
        (typeof err === "string" ? err : "Failed to save waifu");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (waifu) => {
    setEditingWaifu(waifu);
    setFormData({
      name: waifu.name,
      personality: waifu.personality,
      description: waifu.description,
      color: waifu.color,
      icon: waifu.icon,
      traits: waifu.traits.join(", "),
      yandereTrigger: waifu.yandereTrigger,
      isActive: waifu.isActive,
      order: waifu.order,
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this waifu?")) return;

    if (!token) {
      setError("Authentication required. Please login again.");
      return;
    }

    try {
      setLoading(true);
      await deleteWaifu(id, token);
      await fetchWaifus();
      setError(null);
    } catch (err) {
      console.error("Error deleting waifu:", err);
      const errorMessage =
        err.message ||
        err.error ||
        (typeof err === "string" ? err : "Failed to delete waifu");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingWaifu(null);
    setShowCreateForm(false);
    setFormData({
      name: "",
      personality: "",
      description: "",
      color: "from-pink-400 to-red-500",
      icon: "💕",
      traits: "",
      yandereTrigger: "",
      isActive: true,
      order: 0,
    });
    setEmotionImages({
      normal: null,
      happy: null,
      sad: null,
      angry: null,
    });
  };

  if (loading && waifus.length === 0) {
    return <div className="text-center py-8">Loading waifus...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Waifu Management</h2>
        {!showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            disabled={!token}
          >
            Add New Waifu
          </button>
        )}
      </div>

      {!token && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          ⚠️ Authentication required. Please login as admin to manage waifus.
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showCreateForm && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-8">
          <h3 className="text-xl font-bold mb-4">
            {editingWaifu ? "Edit Waifu" : "Create New Waifu"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  placeholder="e.g., Aiko, Yuki, Sakura"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Personality *
                </label>
                <input
                  type="text"
                  name="personality"
                  value={formData.personality}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  placeholder="e.g., sweet, tsundere, yandere"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  rows="3"
                  placeholder="A sweet and gentle girl who loves to make others smile..."
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Color Gradient
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  placeholder="from-pink-400 to-red-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Icon
                </label>
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  placeholder="💕 (emoji)"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Traits (comma separated)
                </label>
                <input
                  type="text"
                  name="traits"
                  value={formData.traits}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  placeholder="loving, protective, romantic"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Yandere Trigger *
                </label>
                <input
                  type="text"
                  name="yandereTrigger"
                  value={formData.yandereTrigger}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  placeholder="e.g., 'other girl' or 'leaving'"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Order
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  placeholder="0"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label className="text-gray-700 text-sm font-bold">
                  Active
                </label>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-bold mb-3">Emotion Images</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["normal", "happy", "sad", "angry"].map((emotion) => (
                  <div key={emotion}>
                    <label className="block text-gray-700 text-sm font-bold mb-2 capitalize">
                      {emotion} {!editingWaifu && "*"}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageChange(emotion, e.target.files[0])
                      }
                      className="text-sm"
                      required={!editingWaifu}
                    />
                    {editingWaifu && (
                      <img
                        src={getWaifuImageUrl(
                          editingWaifu.emotions.find(
                            (e) => e.emotion === emotion
                          )?.imageUrl
                        )}
                        alt={emotion}
                        className="mt-2 w-full h-32 object-cover rounded"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : editingWaifu
                  ? "Update Waifu"
                  : "Create Waifu"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Waifus List */}
      {loading && waifus.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          Loading waifus...
        </div>
      ) : waifus.length === 0 ? (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <p className="text-gray-400 text-lg mb-2">No waifus found</p>
          <p className="text-gray-500 text-sm">
            Click "Add New Waifu" to create your first waifu character
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {waifus.map((waifu) => (
            <div key={waifu._id} className="bg-white shadow-md rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-xl font-bold">
                    {waifu.icon} {waifu.name}
                  </h3>
                  <p className="text-sm text-gray-600">{waifu.personality}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    waifu.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {waifu.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <p className="text-sm text-gray-700 mb-3">{waifu.description}</p>

              <div className="flex flex-wrap gap-1 mb-3">
                {waifu.traits.map((trait) => (
                  <span
                    key={trait}
                    className="bg-gray-100 text-gray-700 px-2 py-1 text-xs rounded"
                  >
                    {trait}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-2 mb-3">
                {waifu.emotions.map((emotion) => (
                  <div key={emotion.emotion} className="text-center">
                    <img
                      src={getWaifuImageUrl(emotion.imageUrl)}
                      alt={emotion.emotion}
                      className="w-full h-16 object-cover rounded"
                    />
                    <p className="text-xs mt-1 capitalize">{emotion.emotion}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(waifu)}
                  disabled={!token}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(waifu._id)}
                  disabled={!token}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WaifuManagement;
