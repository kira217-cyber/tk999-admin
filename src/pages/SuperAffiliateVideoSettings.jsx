// src/pages/SuperAffiliateVideoSettings.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../utils/baseURL";
import { FaSpinner } from "react-icons/fa";

export default function SuperAffiliateVideoSettings() {
  const [videos, setVideos] = useState([]);
  const [url, setUrl] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/super-affiliate-video`);
      setVideos(res.data || []);
    } catch (err) {
      console.log("No videos yet");
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdate = async () => {
    if (!url.trim() || !url.includes("http")) {
      toast.error("Please enter a valid video URL!");
      return;
    }

    try {
      if (editIndex !== null) {
        await axios.put(`${API_URL}/api/super-affiliate-video/${editIndex}`, {
          url,
        });
        toast.success("Video URL updated!");
        setEditIndex(null);
      } else {
        await axios.post(`${API_URL}/api/super-affiliate-video`, { url });
        toast.success("Video URL added!");
      }
      setUrl("");
      loadVideos();
    } catch (err) {
      toast.error("Failed to save video URL!");
    }
  };

  const handleDelete = async (index) => {
    if (!window.confirm("Delete this video URL?")) return;

    try {
      await axios.delete(`${API_URL}/api/super-affiliate-video/${index}`);
      toast.success("Video URL deleted!");
      loadVideos();
    } catch (err) {
      toast.error("Failed to delete video URL!");
    }
  };

  const handleEdit = (index) => {
    setUrl(videos[index].url);
    setEditIndex(index);
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
          Super Affiliate Video Settings
        </h1>
        <p className="text-emerald-300/80 text-lg sm:text-xl text-center mb-10">
          Add video URLs for Super Affiliate section (MP4 recommended)
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl"
        >
          {/* URL Input & Add/Update Button */}
          <div className="mb-12">
            <input
              type="text"
              placeholder="Paste Video URL here (e.g. https://api.dstgamevideo.live/....mp4)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all mb-4"
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleAddOrUpdate}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-4 rounded-xl font-bold cursor-pointer transition-all shadow-lg"
            >
              {editIndex !== null ? "Update Video URL" : "Add Video URL"}
            </motion.button>
          </div>

          {/* Video List */}
          {videos.length > 0 ? (
            <>
              <h3 className="text-xl font-bold text-white mb-6">
                Current Video URLs
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative bg-gray-900/50 border border-emerald-800/50 rounded-xl overflow-hidden shadow-xl group hover:shadow-2xl transition-all"
                  >
                    <video
                      controls
                      className="w-full h-48 object-cover bg-black"
                    >
                      <source src={video.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>

                    <div className="absolute top-3 right-3 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(i)}
                        className="bg-emerald-700/90 hover:bg-emerald-600/90 text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
                      >
                        ✎
                      </button>

                      <button
                        onClick={() => handleDelete(i)}
                        className="bg-rose-700/90 hover:bg-rose-600/90 text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
                      >
                        ×
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-gray-400 text-xl">
              No video URLs added yet. Paste a URL and click "Add Video URL".
            </div>
          )}
        </motion.div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
}
