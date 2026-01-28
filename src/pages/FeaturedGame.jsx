// src/pages/FeaturedGame.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUpload, FaTrash, FaEdit, FaSpinner } from "react-icons/fa";
import { baseURL, baseURL_For_IMG_UPLOAD } from "../utils/baseURL";

export default function FeaturedGame() {
  const [games, setGames] = useState({ title: "", titleBD: "", items: [] });
  const [formData, setFormData] = useState({ title: "", titleBD: "" });
  const [newItem, setNewItem] = useState({
    image: "",
    title: "",
    titleBD: "",
    link: "",
  });
  const [editItem, setEditItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await axios.get(`${baseURL}/featured-games`);
      if (response.data.success) {
        setGames(response.data.data);
        setFormData({
          title: response.data.data.title,
          titleBD: response.data.data.titleBD,
        });
      }
    } catch (error) {
      toast.error("Failed to fetch Featured Games");
    }
  };

  const handleImageUpload = async (file) => {
    const uploadData = new FormData();
    uploadData.append("image", file);

    try {
      const res = await fetch(baseURL_For_IMG_UPLOAD, {
        method: "POST",
        body: uploadData,
      });

      const data = await res.json();
      if (!res.ok || !data.imageUrl) {
        throw new Error("Image upload failed");
      }
      return data.imageUrl;
    } catch (error) {
      console.error("Upload Error:", error);
      throw error;
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleEditItemChange = (e) => {
    setEditItem({ ...editItem, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e, isEdit = false) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await handleImageUpload(file);
      if (isEdit) {
        setEditItem((prev) => ({ ...prev, image: imageUrl }));
      } else {
        setNewItem((prev) => ({ ...prev, image: imageUrl }));
      }
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const response = await axios.put(`${baseURL}/featured-games`, {
        title: formData.title,
        titleBD: formData.titleBD,
        items: games.items,
      });
      if (response.data.success) {
        setGames(response.data.data);
        toast.success("Featured Games updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update Featured Games");
    } finally {
      setUploading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.image || !newItem.title || !newItem.titleBD || !newItem.link) {
      toast.error("Please fill all item fields");
      return;
    }
    setUploading(true);
    try {
      const response = await axios.post(
        `${baseURL}/featured-games/item`,
        newItem,
      );
      if (response.data.success) {
        setGames(response.data.data);
        setNewItem({ image: "", title: "", titleBD: "", link: "" });
        toast.success("Game item added successfully");
      }
    } catch (error) {
      toast.error("Failed to add game item");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    if (
      !editItem.image ||
      !editItem.title ||
      !editItem.titleBD ||
      !editItem.link
    ) {
      toast.error("Please fill all item fields");
      return;
    }
    setUploading(true);
    try {
      const response = await axios.put(
        `${baseURL}/featured-games/item/${editItem._id}`,
        {
          image: editItem.image,
          title: editItem.title,
          titleBD: editItem.titleBD,
          link: editItem.link,
        },
      );
      if (response.data.success) {
        setGames(response.data.data);
        setIsModalOpen(false);
        setEditItem(null);
        toast.success("Game item updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update game item");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("Delete this game item?")) return;
    try {
      const response = await axios.delete(
        `${baseURL}/featured-games/item/${itemId}`,
      );
      if (response.data.success) {
        setGames(response.data.data);
        toast.success("Game item deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete game item");
    }
  };

  const openEditModal = (item) => {
    setEditItem({ ...item });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950/20 to-black p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-10 text-center bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          Featured Games Management
        </h1>

        {/* Update Main Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl mb-12"
        >
          <h2 className="text-2xl font-bold text-emerald-300 mb-6">
            Update Games Title
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Title (English)
              </label>
              <input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter Title"
                required
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Title (Bangla)
              </label>
              <input
                name="titleBD"
                value={formData.titleBD}
                onChange={handleInputChange}
                placeholder="Enter Title (Bangla)"
                required
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
            </div>

            <div className="md:col-span-2 flex justify-center mt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={uploading}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-4 px-12 rounded-xl font-bold cursor-pointer transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-3"
              >
                {uploading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Games"
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Add New Item */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl mb-12"
        >
          <h2 className="text-2xl font-bold text-emerald-300 mb-6">
            Add New Game Item
          </h2>

          <form
            onSubmit={handleAddItem}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-emerald-300 font-medium mb-2">
                Game Image
              </label>
              <div className="relative border-2 border-dashed border-emerald-700/50 rounded-xl p-10 text-center cursor-pointer hover:border-emerald-500/70 transition-all group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="space-y-3">
                  <FaUpload className="mx-auto text-5xl text-emerald-500 group-hover:text-emerald-400 transition-colors" />
                  <p className="text-gray-300 text-lg">
                    {uploading ? "Uploading..." : "Click or drag & drop image"}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Recommended: 300×400 or similar
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Title (English)
              </label>
              <input
                name="title"
                value={newItem.title}
                onChange={handleItemChange}
                placeholder="Game Title"
                required
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Title (Bangla)
              </label>
              <input
                name="titleBD"
                value={newItem.titleBD}
                onChange={handleItemChange}
                placeholder="গেমের নাম"
                required
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-emerald-300 font-medium mb-2">
                Game Link URL
              </label>
              <input
                name="link"
                value={newItem.link}
                onChange={handleItemChange}
                placeholder="https://example.com/game"
                required
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
            </div>

            <div className="md:col-span-2 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={uploading}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-4 px-12 rounded-xl font-bold cursor-pointer transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-3"
              >
                {uploading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Game Item"
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Current Games List */}
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-emerald-300 mb-6">
            Current Featured Games ({games.items?.length || 0})
          </h2>

          {games.items?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.items.map((item) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-900/50 border border-emerald-800/50 rounded-xl overflow-hidden shadow-lg group relative"
                >
                  <img
                    src={`${baseURL_For_IMG_UPLOAD}s/${item.image}`}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />

                  <div className="p-5 space-y-3">
                    <h3 className="text-lg font-bold text-emerald-300 truncate">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-sm truncate">
                      {item.titleBD}
                    </p>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 text-sm block truncate hover:underline"
                    >
                      {item.link}
                    </a>

                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => openEditModal(item)}
                        className="flex-1 bg-emerald-700/60 hover:bg-emerald-600/70 text-white py-2 rounded-xl font-medium cursor-pointer transition-all"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="flex-1 bg-rose-700/60 hover:bg-rose-600/70 text-white py-2 rounded-xl font-medium cursor-pointer transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400 text-lg">
              No featured games added yet
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {isModalOpen && editItem && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-lg border border-emerald-800/50 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Edit Game Item
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white text-3xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleUpdateItem} className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-emerald-300 font-medium mb-2">
                    Game Image
                  </label>
                  <div className="relative border-2 border-dashed border-emerald-700/50 rounded-xl p-8 text-center cursor-pointer hover:border-emerald-500/70 transition-all group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, true)}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {editItem.image ? (
                      <img
                        src={`${baseURL_For_IMG_UPLOAD}s/${editItem.image}`}
                        alt="Current"
                        className="max-h-48 mx-auto object-contain rounded-lg border border-emerald-700/50"
                      />
                    ) : (
                      <div className="space-y-3">
                        <FaUpload className="mx-auto text-5xl text-emerald-500 group-hover:text-emerald-400 transition-colors" />
                        <p className="text-gray-300">
                          Click to upload new image
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-emerald-300 font-medium mb-2">
                    Title (English)
                  </label>
                  <input
                    name="title"
                    value={editItem.title}
                    onChange={handleEditItemChange}
                    placeholder="Game Title"
                    required
                    className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-emerald-300 font-medium mb-2">
                    Title (Bangla)
                  </label>
                  <input
                    name="titleBD"
                    value={editItem.titleBD}
                    onChange={handleEditItemChange}
                    placeholder="গেমের নাম"
                    required
                    className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-emerald-300 font-medium mb-2">
                    Game Link URL
                  </label>
                  <input
                    name="link"
                    value={editItem.link}
                    onChange={handleEditItemChange}
                    placeholder="https://example.com/game"
                    required
                    className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={uploading}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-4 rounded-xl font-bold cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {uploading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Item"
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-4 rounded-xl font-bold cursor-pointer transition-all border border-gray-600"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
}
