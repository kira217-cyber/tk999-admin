// src/pages/AdminFavIconAndTitleSettings.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../utils/baseURL";
import { FaSpinner } from "react-icons/fa";

export default function AdminFavIconAndTitleSettings() {
  const [title, setTitle] = useState("");
  const [favicon, setFavicon] = useState(null);
  const [previewFavicon, setPreviewFavicon] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/admin-site-settings`);
      setTitle(res.data.title || "Affiliate Admin");
      if (res.data.favicon) {
        setPreviewFavicon(`${API_URL}${res.data.favicon}?t=${Date.now()}`);
      }
    } catch (err) {
      console.log("Using default title");
      setTitle("Affiliate Admin");
    } finally {
      setLoading(false);
    }
  };

  const handleFaviconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFavicon(file);
      setPreviewFavicon(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title cannot be empty!");
      return;
    }

    setSaving(true);
    const formData = new FormData();
    formData.append("title", title);
    if (favicon) formData.append("favicon", favicon);

    try {
      await axios.put(`${API_URL}/api/admin-site-settings`, formData);
      toast.success("Settings saved! Refresh main site to see changes.");
      loadSettings();
    } catch (err) {
      toast.error("Save failed!");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm("Reset to default settings?")) return;

    try {
      await axios.delete(`${API_URL}/api/admin-site-settings`);
      toast.success("Settings reset successfully!");
      loadSettings();
      window.location.reload();
    } catch (err) {
      toast.error("Reset failed!");
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center">
          Affiliate Admin Favicon & Title Settings
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl"
        >
          {/* Website Title */}
          <div className="mb-10">
            <label className="block text-emerald-300 font-medium mb-3 text-lg">
              Website Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Affiliate Admin"
              className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
            />
          </div>

          {/* Favicon Upload */}
          <div className="mb-10">
            <label className="block text-emerald-300 font-medium mb-3 text-lg">
              Favicon (32×32 or 64×64 recommended)
            </label>

            {previewFavicon && (
              <div className="mb-6 text-center">
                <p className="text-gray-400 mb-3">Current / Selected Favicon:</p>
                <img
                  src={previewFavicon}
                  alt="Favicon Preview"
                  className="w-24 h-24 object-contain mx-auto rounded-xl border-4 border-emerald-700/50 shadow-xl"
                />
              </div>
            )}

            <input
              type="file"
              accept=".png,.ico,.jpg,.jpeg,.svg,.webp"
              onChange={handleFaviconChange}
              className="hidden"
              id="favicon-input"
            />

            <label
              htmlFor="favicon-input"
              className="block w-full bg-gray-900/60 border-2 border-dashed border-emerald-700/50 rounded-xl px-6 py-16 text-center cursor-pointer hover:border-emerald-500/70 hover:bg-gray-900/70 transition-all text-gray-300 font-medium"
            >
              {previewFavicon ? "Change Favicon" : "Upload Favicon"}
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-4 rounded-xl font-bold cursor-pointer transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save to Database"}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleReset}
              className="flex-1 bg-gradient-to-r from-rose-700 to-red-700 hover:from-rose-600 hover:to-red-600 text-white py-4 rounded-xl font-bold cursor-pointer transition-all shadow-lg"
            >
              Reset
            </motion.button>
          </div>

          {/* Info Box */}
          <div className="mt-12 p-6 bg-gray-900/50 border border-emerald-800/50 rounded-xl text-center text-gray-300 text-sm">
            <p className="mb-2">
              Favicon saved in:{" "}
              <code className="text-emerald-400">uploads/method-icons/favicon.png</code>
            </p>
            <p className="mb-2">
              Access:{" "}
              <code className="text-emerald-400">
                {API_URL}/uploads/method-icons/favicon.png
              </code>
            </p>
            <p>Refresh main site / clear browser cache to see changes.</p>
          </div>
        </motion.div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
}