// src/pages/ImageControlPanel.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUpload, FaTrash, FaEdit, FaSpinner } from "react-icons/fa";
import { baseURL, baseURL_For_IMG_UPLOAD } from "../utils/baseURL";

export default function ImageControlPanel() {
  const [banners, setBanners] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [type, setType] = useState("login_banner");
  const [editingBanner, setEditingBanner] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch banners
  const fetchBanners = async () => {
    try {
      const response = await axios.get(`${baseURL}/bannersRegistration`);
      if (response.data.success) {
        setBanners(response.data.data);
      }
    } catch (err) {
      toast.error("Failed to fetch banners");
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Handle file selection + preview
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("image/")) {
        setError("Please select a valid image file");
        toast.error("Invalid file type");
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  // Drag & Drop handlers
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
      setError(null);
    } else {
      setError("Please drop a valid image file");
      toast.error("Invalid file type");
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Upload image to server
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
    } catch (err) {
      console.error("Upload Error:", err);
      throw err;
    }
  };

  // Submit / Update banner
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file && !editingBanner) {
      setError("Please select or drop an image");
      toast.error("No image selected");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let imageUrl = editingBanner?.url;

      if (file) {
        imageUrl = await handleImageUpload(file);
      }

      // Check if another banner with same type exists (when changing type)
      const existing = banners.find(
        (b) => b.type === type && b._id !== editingBanner?._id,
      );
      if (existing) {
        setError(`A banner with type "${type}" already exists`);
        toast.error(`A banner with type "${type}" already exists`);
        setLoading(false);
        return;
      }

      if (editingBanner) {
        // Update existing
        await axios.put(`${baseURL}/bannersRegistration/${editingBanner._id}`, {
          url: imageUrl,
          type,
        });
        toast.success("Banner updated successfully!");
      } else {
        // Create new
        await axios.post(`${baseURL}/bannersRegistration`, {
          url: imageUrl,
          type,
        });
        toast.success("Banner uploaded successfully!");
      }

      setFile(null);
      setPreview(null);
      setType("login_banner");
      setEditingBanner(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchBanners();
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to save banner";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Start editing
  const startEditing = (banner) => {
    setEditingBanner(banner);
    setType(banner.type);
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Delete banner
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this banner permanently?")) return;

    try {
      await axios.delete(`${baseURL}/bannersRegistration/${id}`);
      toast.success("Banner deleted!");
      fetchBanners();
    } catch (err) {
      toast.error("Failed to delete banner");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950/20 to-black p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-10 text-center bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          Banner Control Panel
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl mb-12"
        >
          <h2 className="text-2xl font-bold text-emerald-300 mb-6">
            {editingBanner ? "Edit Banner" : "Upload / Replace Banner"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Dropzone */}
            <div
              className="relative border-2 border-dashed border-emerald-700/50 rounded-xl p-8 text-center cursor-pointer hover:border-emerald-500/70 transition-all group"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current.click()}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
              />

              {preview ? (
                <div className="space-y-4">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-64 mx-auto object-contain rounded-lg border border-emerald-700/50 shadow-lg"
                  />
                  <p className="text-emerald-300 font-medium">Image selected</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <FaUpload className="mx-auto text-5xl text-emerald-500 group-hover:text-emerald-400 transition-colors" />
                  <p className="text-gray-300 text-lg">
                    Drag & drop an image here or click to select
                  </p>
                  <p className="text-gray-500 text-sm">Supports JPG, PNG</p>
                </div>
              )}
            </div>

            {/* Banner Type */}
            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Banner Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                disabled={editingBanner}
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="login_banner">Login Banner</option>
                <option value="registration_banner">Registration Banner</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading || (!file && !editingBanner)}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-4 rounded-xl font-bold cursor-pointer transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading && <FaSpinner className="animate-spin" />}
                {loading
                  ? "Saving..."
                  : editingBanner
                    ? "Update Banner"
                    : banners.find((b) => b.type === type)
                      ? "Replace Banner"
                      : "Upload Banner"}
              </motion.button>

              {editingBanner && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => {
                    setEditingBanner(null);
                    setFile(null);
                    setPreview(null);
                    setType("login_banner");
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-4 rounded-xl font-bold cursor-pointer transition-all border border-gray-600"
                >
                  Cancel Edit
                </motion.button>
              )}
            </div>

            {error && (
              <div className="bg-rose-900/40 border border-rose-700/50 text-rose-300 px-6 py-4 rounded-xl text-center">
                {error}
              </div>
            )}
          </form>
        </motion.div>

        {/* Banner List */}
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-emerald-300 mb-6">
            Existing Banners
          </h2>

          {banners.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-lg">
              No banners uploaded yet. Add your first banner above!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {banners.map((banner) => (
                <motion.div
                  key={banner._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-900/50 border border-emerald-800/50 rounded-xl overflow-hidden shadow-lg group relative"
                >
                  <div className="relative">
                    <img
                      src={`${baseURL_For_IMG_UPLOAD}s/${banner.url}`}
                      alt={banner.type}
                      className="w-full h-64 object-cover"
                    />
                    <span
                      className={`absolute top-4 left-4 px-4 py-1 rounded-full text-sm font-semibold text-white ${
                        banner.type === "login_banner"
                          ? "bg-emerald-600"
                          : "bg-indigo-600"
                      }`}
                    >
                      {banner.type.replace("_", " ").toUpperCase()}
                    </span>
                  </div>

                  <div className="p-5 flex gap-3">
                    <button
                      onClick={() => startEditing(banner)}
                      className="flex-1 bg-emerald-700/60 hover:bg-emerald-600/70 text-white py-3 rounded-xl font-medium cursor-pointer transition-all"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="flex-1 bg-rose-700/60 hover:bg-rose-600/70 text-white py-3 rounded-xl font-medium cursor-pointer transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
}
