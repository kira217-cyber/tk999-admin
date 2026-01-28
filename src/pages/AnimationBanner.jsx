// src/pages/AnimationBanner.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSpinner } from "react-icons/fa";
import { baseURL } from "../utils/baseURL";

export default function AnimationBanner() {
  const [formData, setFormData] = useState({
    titleEN: "Jackpot",
    titleBD: "জ্যাকপট",
    titleColor: "#FFFF00",
    bannerBackgroundColor: "#012632",
    numberBackgroundColor: "#FFFFFF",
    numberColor: "#000000",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch AnimationBanner data from backend
  useEffect(() => {
    const fetchBannerData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${baseURL}/animation-banner`);
        if (!response.ok) {
          throw new Error("Failed to fetch AnimationBanner data");
        }
        const data = await response.json();
        setFormData({
          titleEN: data.titleEN || "Jackpot",
          titleBD: data.titleBD || "জ্যাকপট",
          titleColor: data.titleColor || "#FFFF00",
          bannerBackgroundColor: data.bannerBackgroundColor || "#012632",
          numberBackgroundColor: data.numberBackgroundColor || "#FFFFFF",
          numberColor: data.numberColor || "#000000",
        });
      } catch (err) {
        setError(err.message);
        toast.error(err.message || "Failed to load banner settings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBannerData();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${baseURL}/animation-banner`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update AnimationBanner");
      }

      const data = await response.json();
      setSuccess("AnimationBanner updated successfully!");
      toast.success("AnimationBanner updated successfully!");

      setFormData({
        titleEN: data.banner.titleEN,
        titleBD: data.banner.titleBD,
        titleColor: data.banner.titleColor,
        bannerBackgroundColor: data.banner.bannerBackgroundColor,
        numberBackgroundColor: data.banner.numberBackgroundColor,
        numberColor: data.banner.numberColor,
      });
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Failed to update banner");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950/20 to-black p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-bold text-white mb-10 text-center bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent"
        >
          Manage Animation Banner
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl"
        >
          {isLoading && (
            <div className="flex justify-center items-center gap-3 text-emerald-300 mb-6">
              <FaSpinner className="animate-spin w-6 h-6" />
              <span>Loading banner settings...</span>
            </div>
          )}

          {error && (
            <div className="bg-rose-900/40 border border-rose-700/50 text-rose-300 px-6 py-4 rounded-xl mb-6 text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-900/40 border border-emerald-700/50 text-emerald-300 px-6 py-4 rounded-xl mb-6 text-center">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title (English) */}
            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Title (English)
              </label>
              <input
                type="text"
                name="titleEN"
                value={formData.titleEN}
                onChange={handleChange}
                placeholder="Enter English title"
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
            </div>

            {/* Title (Bangla) */}
            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Title (Bangla)
              </label>
              <input
                type="text"
                name="titleBD"
                value={formData.titleBD}
                onChange={handleChange}
                placeholder="Enter Bangla title"
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
            </div>

            {/* Title Color */}
            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Title Color
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  name="titleColor"
                  value={formData.titleColor}
                  onChange={handleChange}
                  className="w-12 h-12 bg-transparent border border-emerald-800/50 rounded-lg cursor-pointer p-1"
                />
                <input
                  type="text"
                  name="titleColor"
                  value={formData.titleColor}
                  onChange={handleChange}
                  placeholder="#FFFF00"
                  className="flex-1 bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                />
              </div>
            </div>

            {/* Banner Background Color */}
            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Banner Background Color
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  name="bannerBackgroundColor"
                  value={formData.bannerBackgroundColor}
                  onChange={handleChange}
                  className="w-12 h-12 bg-transparent border border-emerald-800/50 rounded-lg cursor-pointer p-1"
                />
                <input
                  type="text"
                  name="bannerBackgroundColor"
                  value={formData.bannerBackgroundColor}
                  onChange={handleChange}
                  placeholder="#012632"
                  className="flex-1 bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                />
              </div>
            </div>

            {/* Number Background Color */}
            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Number Background Color
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  name="numberBackgroundColor"
                  value={formData.numberBackgroundColor}
                  onChange={handleChange}
                  className="w-12 h-12 bg-transparent border border-emerald-800/50 rounded-lg cursor-pointer p-1"
                />
                <input
                  type="text"
                  name="numberBackgroundColor"
                  value={formData.numberBackgroundColor}
                  onChange={handleChange}
                  placeholder="#FFFFFF"
                  className="flex-1 bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                />
              </div>
            </div>

            {/* Number Color */}
            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Number Color
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  name="numberColor"
                  value={formData.numberColor}
                  onChange={handleChange}
                  className="w-12 h-12 bg-transparent border border-emerald-800/50 rounded-lg cursor-pointer p-1"
                />
                <input
                  type="text"
                  name="numberColor"
                  value={formData.numberColor}
                  onChange={handleChange}
                  placeholder="#000000"
                  className="flex-1 bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-4 rounded-xl font-bold cursor-pointer transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Banner"
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
}
