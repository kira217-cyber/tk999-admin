// src/pages/SocialLinksController.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../utils/baseURL";
import { FaSpinner } from "react-icons/fa";

export default function SocialLinksController() {
  const [links, setLinks] = useState([]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [iconFile, setIconFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/social-links`);
      setLinks(res.data || []);
    } catch (err) {
      toast.error("Failed to load social links");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !url.trim()) {
      toast.error("Name and URL are required!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("url", url);
    if (iconFile) formData.append("icon", iconFile);

    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/social-links/${editingId}`, formData);
        toast.success("Social link updated!");
      } else {
        await axios.post(`${API_URL}/api/social-links`, formData);
        toast.success("Social link added!");
      }

      resetForm();
      fetchLinks();
    } catch (err) {
      toast.error("Failed to save social link!");
    }
  };

  const resetForm = () => {
    setName("");
    setUrl("");
    setIconFile(null);
    setEditingId(null);
  };

  const handleEdit = (link) => {
    setName(link.name);
    setUrl(link.url);
    setEditingId(link._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this social link?")) return;

    try {
      await axios.delete(`${API_URL}/api/social-links/${id}`);
      toast.success("Social link deleted!");
      fetchLinks();
    } catch (err) {
      toast.error("Failed to delete social link!");
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
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center">
          Social Links Controller
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl mb-12"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-emerald-300 font-medium mb-2">
                  Name (e.g. WhatsApp)
                </label>
                <input
                  type="text"
                  placeholder="Name (e.g. WhatsApp)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-medium mb-2">
                  URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Icon (optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setIconFile(e.target.files[0] || null)}
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-700/50 file:text-emerald-100 hover:file:bg-emerald-600/70 cursor-pointer"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-4 rounded-xl font-bold cursor-pointer transition-all shadow-lg"
              >
                {editingId ? "Update Link" : "Add Link"}
              </motion.button>

              {editingId && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-4 rounded-xl font-bold cursor-pointer transition-all border border-gray-600"
                >
                  Cancel
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Links List */}
        {links.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {links.map((link) => (
              <motion.div
                key={link._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.random() * 0.2 }}
                className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-5 shadow-xl hover:shadow-2xl transition-all group"
              >
                <div className="flex items-center gap-4 mb-4">
                  {link.icon ? (
                    <img
                      src={`${link.icon}`}
                      alt={link.name}
                      className="w-16 h-16 object-contain rounded-lg border border-emerald-700/50"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
                      No Icon
                    </div>
                  )}

                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {link.name}
                    </h3>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors break-all"
                    >
                      {link.url}
                    </a>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(link)}
                    className="flex-1 bg-emerald-700/60 hover:bg-emerald-600/70 text-white py-2 rounded-xl font-medium cursor-pointer transition-all"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(link._id)}
                    className="flex-1 bg-rose-700/60 hover:bg-rose-600/70 text-white py-2 rounded-xl font-medium cursor-pointer transition-all"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400 text-xl">
            No social links added yet. Add your first link above.
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
}
