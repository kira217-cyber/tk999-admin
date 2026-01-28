// src/pages/NoticeControl.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getAllNotices,
  updateNotice,
} from "../redux/Frontend Control/Notice Control/noticeControlAPI";
import { FaSpinner } from "react-icons/fa";

export default function NoticeControl() {
  const dispatch = useDispatch();
  const noticeControl = useSelector((state) => state.noticeControl);

  const [title, setTitle] = useState("");
  const [titleBD, setTitleBD] = useState("");
  const [emoji, setEmoji] = useState("");
  const [active, setActive] = useState(false);

  // Fetch notices on mount
  useEffect(() => {
    dispatch(getAllNotices());
  }, [dispatch]);

  // Sync form with Redux store
  useEffect(() => {
    setTitle(noticeControl?.title || "");
    setTitleBD(noticeControl?.titleBD || "");
    setEmoji(noticeControl?.emoji || "");
    setActive(noticeControl?.active || false);
  }, [noticeControl]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(
        updateNotice({
          title,
          titleBD,
          emoji,
          active,
        }),
      ).unwrap();

      toast.success("Notice updated successfully!");
    } catch (error) {
      console.error("Update Error:", error);
      toast.error(error.message || "Failed to update notice");
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
          Notice Control Panel
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title (English) */}
            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Title (English)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter notice title in English"
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                required
              />
            </div>

            {/* Title (Bangla) */}
            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Title (Bangla)
              </label>
              <input
                type="text"
                value={titleBD}
                onChange={(e) => setTitleBD(e.target.value)}
                placeholder="Enter notice title in Bangla"
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
            </div>

            {/* Emoji */}
            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Emoji
              </label>
              <input
                type="text"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                placeholder="Enter emoji (e.g., 😊)"
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
            </div>

            {/* Active Toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-5 h-5 accent-emerald-500 cursor-pointer"
                id="activeCheck"
              />
              <label
                htmlFor="activeCheck"
                className="text-gray-200 font-medium cursor-pointer"
              >
                Active Notice
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={noticeControl.isLoading}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-4 px-10 rounded-xl font-bold cursor-pointer transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {noticeControl.isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Notice"
                )}
              </motion.button>
            </div>
          </form>

          {/* Loading / Error States */}
          {noticeControl.isLoading && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-3 text-emerald-300">
                <FaSpinner className="animate-spin w-6 h-6" />
                <span>Updating notice...</span>
              </div>
            </div>
          )}

          {noticeControl.isError && (
            <div className="mt-8 bg-rose-900/40 border border-rose-700/50 text-rose-300 px-6 py-4 rounded-xl text-center">
              {noticeControl.errorMessage ||
                "An error occurred. Please try again."}
            </div>
          )}
        </motion.div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
}
