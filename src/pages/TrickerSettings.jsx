// src/pages/TrickerSettings.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../utils/baseURL";
import { FaSpinner } from "react-icons/fa";

export default function TrickerSettings() {
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/tricker`);
      setImages(res.data.images || []);
    } catch (err) {
      console.error("Failed to load tricker images:", err);
      toast.error("Failed to load images");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, JPEG, PNG, WebP allowed!");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB!");
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("icons", selectedFile);

    try {
      if (images.length === 0) {
        await axios.post(`${API_URL}/api/tricker`, formData);
      } else {
        await axios.put(`${API_URL}/api/tricker`, formData);
      }
      toast.success("Image uploaded successfully!");
      setSelectedFile(null);
      setPreview(null);
      loadData();
    } catch (err) {
      toast.error("Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (index) => {
    if (!window.confirm("Delete this image?")) return;

    try {
      await axios.delete(`${API_URL}/api/tricker/${index}`);
      toast.success("Image deleted!");
      loadData();
    } catch (err) {
      toast.error("Failed to delete image");
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Delete ALL tricker images?")) return;

    try {
      await axios.delete(`${API_URL}/api/tricker`);
      toast.success("All images deleted!");
      loadData();
    } catch (err) {
      toast.error("Failed to delete all images");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950/30 to-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          className="text-emerald-400 text-6xl"
        >
          <FaSpinner />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950/20 to-black p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 text-center">
          Tricker Settings
        </h1>
        <p className="text-emerald-300/80 text-lg sm:text-xl text-center mb-10">
          Add one image at a time (JPG, PNG, WebP - Max 5MB)
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl"
        >
          {/* Upload Area */}
          <div className="mb-12">
            <label className="block text-emerald-300 font-medium mb-4 text-lg">
              Upload Tricker Image
            </label>

            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
              id="tricker-file-input"
            />

            <label
              htmlFor="tricker-file-input"
              className="block w-full bg-gray-900/60 border-2 border-dashed border-emerald-700/50 rounded-xl px-6 py-16 text-center cursor-pointer hover:border-emerald-500/70 hover:bg-gray-900/70 transition-all"
            >
              <span className="text-gray-400 text-lg font-medium">
                Click or drag image here (JPG, PNG, WebP)
              </span>
              <span className="text-emerald-400 text-sm mt-2 block">
                Max 5MB
              </span>
            </label>

            {preview && (
              <div className="mt-8 text-center">
                <p className="text-emerald-300 font-medium mb-4">Preview:</p>
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-64 mx-auto object-contain rounded-xl border border-emerald-700/50 shadow-xl"
                />

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleUpload}
                  disabled={uploading}
                  className="mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-10 py-4 rounded-xl font-bold cursor-pointer transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {uploading ? "Uploading..." : "Upload Image"}
                </motion.button>
              </div>
            )}
          </div>

          {/* Existing Images */}
          {images.length > 0 ? (
            <>
              <h3 className="text-xl font-bold text-white mb-6">
                Current Tricker Images
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {images.map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative bg-gray-900/50 border border-emerald-800/50 rounded-xl overflow-hidden shadow-xl group hover:shadow-2xl transition-all"
                  >
                    <img
                      src={`${API_URL}${img.url}`}
                      alt={`Tricker ${i + 1}`}
                      className="w-full h-48 object-contain p-6 bg-gray-950/50"
                    />

                    <button
                      onClick={() => handleDelete(i)}
                      className="absolute top-3 right-3 bg-rose-700/80 hover:bg-rose-600/90 text-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-lg"
                    >
                      ×
                    </button>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleDeleteAll}
                className="mt-10 mx-auto block bg-gradient-to-r from-rose-700 to-red-700 hover:from-rose-600 hover:to-red-600 text-white px-10 py-4 rounded-xl font-bold cursor-pointer transition-all shadow-lg"
              >
                Delete All Images
              </motion.button>
            </>
          ) : (
            <div className="text-center py-20 text-gray-400 text-xl">
              No tricker images added yet. Upload your first image above.
            </div>
          )}
        </motion.div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
}
