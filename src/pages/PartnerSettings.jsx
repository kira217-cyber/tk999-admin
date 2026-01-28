// admin/PartnerSettings.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../utils/baseURL";
import { FaSpinner } from "react-icons/fa";

export default function PartnerSettings() {
  const [form, setForm] = useState({
    titleBn: "",
    titleEn: "",
    description: "",
    highlightText: "",
    buttonText: "",
    leftImage: "",
    bgImage: "",
    leftImageFile: null,
    bgImageFile: null,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/partner/admin`)
      .then((res) => {
        const d = res.data;
        setForm({
          titleBn: d.titleBn || "",
          titleEn: d.titleEn || "",
          description: d.description || "",
          highlightText: d.highlightText || "",
          buttonText: d.buttonText || "",
          leftImage: d.leftImage ? `${API_URL}${d.leftImage}` : "",
          bgImage: d.bgImage ? `${API_URL}${d.bgImage}` : "",
          leftImageFile: null,
          bgImageFile: null,
        });
      })
      .catch(() => {
        toast.error("Failed to load partner settings");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!form.titleBn.trim() || !form.description.trim()) {
      toast.error("Bangla Title and Description are required!");
      return;
    }

    setSaving(true);
    const data = new FormData();
    data.append("titleBn", form.titleBn);
    data.append("titleEn", form.titleEn);
    data.append("description", form.description);
    data.append("highlightText", form.highlightText);
    data.append("buttonText", form.buttonText);
    if (form.leftImageFile) data.append("leftImage", form.leftImageFile);
    if (form.bgImageFile) data.append("bgImage", form.bgImageFile);

    try {
      await axios.put(`${API_URL}/api/partner`, data);
      toast.success("Partner settings saved successfully!");
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAll = async () => {
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    setShowConfirm(false);
    try {
      await axios.delete(`${API_URL}/api/partner`);
      toast.success("All partner data deleted successfully!");
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const removeLeftImage = () => {
    setForm({ ...form, leftImageFile: null, leftImage: "" });
  };

  const removeBgImage = () => {
    setForm({ ...form, bgImageFile: null, bgImage: "" });
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
          Partner Section Settings
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Bangla Title */}
            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Bangla Title
              </label>
              <input
                type="text"
                placeholder="Special Partner"
                value={form.titleBn}
                onChange={(e) => setForm({ ...form, titleBn: e.target.value })}
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
            </div>

            {/* English Title */}
            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                English Title
              </label>
              <input
                type="text"
                placeholder="Special Partner"
                value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-10">
            <label className="block text-emerald-300 font-medium mb-2">
              Description
            </label>
            <textarea
              placeholder="Register now and earn up to 50% revenue share..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={5}
              className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all resize-y"
            />
          </div>

          {/* Highlight Text & Button */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Highlight Text (e.g. 50%)
              </label>
              <input
                type="text"
                placeholder="Up to 50% revenue share"
                value={form.highlightText}
                onChange={(e) =>
                  setForm({ ...form, highlightText: e.target.value })
                }
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Button Text
              </label>
              <input
                type="text"
                placeholder="Become Our Partner"
                value={form.buttonText}
                onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
            </div>
          </div>

          {/* Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Left Side Image */}
            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Left Side Image
              </label>
              {(form.leftImageFile || form.leftImage) && (
                <div className="mb-4">
                  <img
                    src={
                      form.leftImageFile instanceof File
                        ? URL.createObjectURL(form.leftImageFile)
                        : form.leftImage
                    }
                    alt="Left Preview"
                    className="w-full max-h-48 object-cover rounded-xl border border-emerald-700/50 shadow-lg"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm({ ...form, leftImageFile: e.target.files[0] || null })
                }
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-700/50 file:text-emerald-100 hover:file:bg-emerald-600/70 cursor-pointer"
              />
              {(form.leftImageFile || form.leftImage) && (
                <button
                  type="button"
                  onClick={removeLeftImage}
                  className="mt-3 bg-rose-700/60 hover:bg-rose-600/70 text-white px-6 py-2 rounded-xl font-medium cursor-pointer transition-all"
                >
                  Remove Left Image
                </button>
              )}
            </div>

            {/* Background Image */}
            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Background Image
              </label>
              {(form.bgImageFile || form.bgImage) && (
                <div className="mb-4">
                  <img
                    src={
                      form.bgImageFile instanceof File
                        ? URL.createObjectURL(form.bgImageFile)
                        : form.bgImage
                    }
                    alt="Background Preview"
                    className="w-full max-h-48 object-cover rounded-xl border border-emerald-700/50 shadow-lg"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm({ ...form, bgImageFile: e.target.files[0] || null })
                }
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-700/50 file:text-emerald-100 hover:file:bg-emerald-600/70 cursor-pointer"
              />
              {(form.bgImageFile || form.bgImage) && (
                <button
                  type="button"
                  onClick={removeBgImage}
                  className="mt-3 bg-rose-700/60 hover:bg-rose-600/70 text-white px-6 py-2 rounded-xl font-medium cursor-pointer transition-all"
                >
                  Remove Background
                </button>
              )}
            </div>
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
              {saving ? "Saving..." : "Save All Changes"}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleDeleteAll}
              disabled={deleting}
              className="flex-1 bg-gradient-to-r from-rose-700 to-red-700 hover:from-rose-600 hover:to-red-600 text-white py-4 rounded-xl font-bold cursor-pointer transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {deleting ? "Deleting..." : "Delete All Data"}
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Custom Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-lg border border-rose-800/50 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center"
          >
            <h3 className="text-2xl font-bold text-white mb-6">
              Delete All Data?
            </h3>
            <p className="text-gray-300 mb-8">
              This action cannot be undone. All partner data and images will be
              permanently deleted.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-bold cursor-pointer transition-all border border-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="flex-1 bg-gradient-to-r from-rose-700 to-red-700 hover:from-rose-600 hover:to-red-600 text-white py-3 rounded-xl font-bold cursor-pointer transition-all shadow-lg"
              >
                Yes, Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
}