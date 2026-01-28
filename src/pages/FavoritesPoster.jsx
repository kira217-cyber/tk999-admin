// src/pages/FavoritesPoster.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUpload, FaTrash, FaSpinner } from "react-icons/fa";
import { baseURL, baseURL_For_IMG_UPLOAD } from "../utils/baseURL";

export default function FavoritesPoster() {
  const [poster, setPoster] = useState({ title: "", titleBD: "", images: [] });
  const [formData, setFormData] = useState({ title: "", titleBD: "", images: [] });
  const [previewImages, setPreviewImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchPoster();
  }, []);

  const fetchPoster = async () => {
    try {
      const response = await axios.get(`${baseURL}/favorites-poster`);
      if (response.data.success) {
        setPoster(response.data.data);
        setFormData({
          title: response.data.data.title,
          titleBD: response.data.data.titleBD,
          images: response.data.data.images,
        });
      }
    } catch (error) {
      toast.error("Failed to fetch Favorites Poster");
    }
  };

  const handleImageUpload = useCallback(async (file) => {
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
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          const url = await handleImageUpload(file);
          return { file, url };
        })
      );

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls.map((item) => item.url)],
      }));

      setPreviewImages((prev) => [
        ...prev,
        ...uploadedUrls.map((item) => ({ url: item.url, fileName: item.file.name })),
      ]);

      toast.success("Images uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePreviewImage = (url) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((imageUrl) => imageUrl !== url),
    }));
    setPreviewImages((prev) => prev.filter((image) => image.url !== url));
    toast.info("Preview image removed");
  };

  const handleDeleteImage = async (imageUrl) => {
    try {
      const response = await axios.delete(
        `${baseURL}/favorites-poster/image/${encodeURIComponent(imageUrl)}`
      );
      if (response.data.success) {
        setPoster(response.data.data);
        setFormData((prev) => ({
          ...prev,
          images: response.data.data.images,
        }));
        toast.success("Image deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const response = await axios.put(`${baseURL}/favorites-poster`, {
        title: formData.title,
        titleBD: formData.titleBD,
        images: formData.images,
      });
      if (response.data.success) {
        setPoster(response.data.data);
        setPreviewImages([]);
        toast.success("Favorites Poster updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update Favorites Poster");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950/20 to-black p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-10 text-center bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          Favorites Poster Management
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl mb-12"
        >
          <h2 className="text-2xl font-bold text-emerald-300 mb-6">Update Poster Details</h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title (English) */}
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

            {/* Title (Bangla) */}
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

            {/* Image Upload */}
            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Upload Images
              </label>
              <div className="relative border-2 border-dashed border-emerald-700/50 rounded-xl p-10 text-center cursor-pointer hover:border-emerald-500/70 transition-all group">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="space-y-3">
                  <FaUpload className="mx-auto text-5xl text-emerald-500 group-hover:text-emerald-400 transition-colors" />
                  <p className="text-gray-300 text-lg">
                    {uploading ? "Uploading..." : "Drag & drop images or click to select"}
                  </p>
                  <p className="text-gray-500 text-sm">Supports JPG, PNG (multiple)</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={uploading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-4 rounded-xl font-bold cursor-pointer transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {uploading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Preview Uploaded Images */}
        {previewImages.length > 0 && (
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl mb-12">
            <h2 className="text-2xl font-bold text-emerald-300 mb-6">Preview Uploaded Images</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {previewImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gray-900/50 border border-emerald-800/50 rounded-xl p-3 relative overflow-hidden group"
                >
                  <img
                    src={`${baseURL_For_IMG_UPLOAD}s/${image.url}`}
                    alt={`Preview ${image.fileName}`}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <p className="text-xs text-gray-400 mt-2 text-center truncate">
                    {image.fileName}
                  </p>
                  <button
                    onClick={() => handleRemovePreviewImage(image.url)}
                    className="absolute top-2 right-2 bg-rose-700/80 hover:bg-rose-600/90 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FaTrash size={14} />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Current Poster */}
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-emerald-300 mb-6">Current Favorites Poster</h2>

          <div className="space-y-4 mb-8">
            <div>
              <span className="text-gray-400 font-medium">Title (EN):</span>{" "}
              <span className="text-white">{poster.title || "Not set"}</span>
            </div>
            <div>
              <span className="text-gray-400 font-medium">Title (BD):</span>{" "}
              <span className="text-white">{poster.titleBD || "Not set"}</span>
            </div>
          </div>

          {poster.images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {poster.images.map((url, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gray-900/50 border border-emerald-800/50 rounded-xl p-3 relative overflow-hidden group"
                >
                  <img
                    src={`${baseURL_For_IMG_UPLOAD}s/${url}`}
                    alt={`Poster ${index + 1}`}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleDeleteImage(url)}
                    className="absolute top-2 right-2 bg-rose-700/80 hover:bg-rose-600/90 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FaTrash size={14} />
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400 text-lg">
              No images uploaded yet
            </div>
          )}
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
}