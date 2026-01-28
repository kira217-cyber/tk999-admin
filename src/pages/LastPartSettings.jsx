// src/pages/LastPartSettings.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../utils/baseURL";
import { FaSpinner } from "react-icons/fa";

export default function LastPartSettings() {
  const [form, setForm] = useState({
    titleBn: "",
    titleEn: "",
    subtitle: "",
    description: "",
    buttonText: "",
    buttonLink: "",
    tabletImage: null,
    mobileImage: null,
  });

  const [preview, setPreview] = useState({ tablet: "", mobile: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/lastpart`);
        const d = res.data;

        setForm({
          titleBn: d.titleBn || "",
          titleEn: d.titleEn || "",
          subtitle: d.subtitle || "",
          description: d.description || "",
          buttonText: d.buttonText || "",
          buttonLink: d.buttonLink || "",
          tabletImage: null,
          mobileImage: null,
        });

        setPreview({
          tablet: d.tabletImage ? `${API_URL}${d.tabletImage}` : "",
          mobile: d.mobileImage ? `${API_URL}${d.mobileImage}` : "",
        });
      } catch (err) {
        toast.error("Failed to load Last Part settings");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleImage = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, [type]: file });
      setPreview({ ...preview, [type]: URL.createObjectURL(file) });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const data = new FormData();

    data.append("titleBn", form.titleBn);
    data.append("titleEn", form.titleEn);
    data.append("subtitle", form.subtitle);
    data.append("description", form.description);
    data.append("buttonText", form.buttonText);
    data.append("buttonLink", form.buttonLink);

    if (form.tabletImage) data.append("tabletImage", form.tabletImage);
    if (form.mobileImage) data.append("mobileImage", form.mobileImage);

    try {
      // If images already exist (preview has URL), use PUT; else POST
      if (preview.tablet.includes("http") || preview.mobile.includes("http")) {
        await axios.put(`${API_URL}/api/lastpart`, data);
      } else {
        await axios.post(`${API_URL}/api/lastpart`, data);
      }

      toast.success("Last Part settings saved successfully!");
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
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
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 text-center">
          Last Part Settings
        </h1>
        <p className="text-emerald-300/80 text-lg sm:text-xl text-center mb-10">
          Control everything from here – Text, Image, Button
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl"
        >
          {/* Grid for Titles & Button */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Subtitle
              </label>
              <input
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder="আমাদের অংশ হতে আবেদন করুন"
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Title (Bangla)
              </label>
              <input
                value={form.titleBn}
                onChange={(e) => setForm({ ...form, titleBn: e.target.value })}
                placeholder="RAJABAJI অ্যাফিলিয়েট প্রোগ্রাম"
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Title (English)
              </label>
              <input
                value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                placeholder="RAJABAJI Affiliate Program"
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Button Text
              </label>
              <input
                value={form.buttonText}
                onChange={(e) =>
                  setForm({ ...form, buttonText: e.target.value })
                }
                placeholder="যোগাযোগ করুন"
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Button Link
              </label>
              <input
                value={form.buttonLink}
                onChange={(e) =>
                  setForm({ ...form, buttonLink: e.target.value })
                }
                placeholder="/contact"
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
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="আমরা ক্রমাগত আমাদের গ্রাহকদের কাছ থেকে ১০০% বিশ্বস্ততার সাথে বৃদ্ধি পাচ্ছি..."
              rows={6}
              className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all resize-y"
            />
          </div>

          {/* Images - Tablet & Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tablet Image */}
            <div>
              <label className="block text-emerald-300 font-medium mb-3 text-lg">
                Tablet Image
              </label>

              {(preview.tablet || form.tabletImage) && (
                <div className="mb-4">
                  <img
                    src={
                      form.tabletImage instanceof File
                        ? URL.createObjectURL(form.tabletImage)
                        : preview.tablet
                    }
                    alt="Tablet Preview"
                    className="w-full max-h-64 object-contain rounded-xl border border-emerald-700/50 shadow-lg"
                  />
                </div>
              )}

              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={(e) => handleImage(e, "tabletImage")}
                className="hidden"
                id="tablet-image-input"
              />

              <label
                htmlFor="tablet-image-input"
                className="block w-full bg-gray-900/60 border-2 border-dashed border-emerald-700/50 rounded-xl px-6 py-10 text-center cursor-pointer hover:border-emerald-500/70 hover:bg-gray-900/70 transition-all text-gray-300 font-medium"
              >
                {form.tabletImage
                  ? "Change Tablet Image"
                  : "Upload Tablet Image"}
              </label>
            </div>

            {/* Mobile Image */}
            <div>
              <label className="block text-emerald-300 font-medium mb-3 text-lg">
                Mobile Image
              </label>

              {(preview.mobile || form.mobileImage) && (
                <div className="mb-4">
                  <img
                    src={
                      form.mobileImage instanceof File
                        ? URL.createObjectURL(form.mobileImage)
                        : preview.mobile
                    }
                    alt="Mobile Preview"
                    className="w-full max-h-64 object-contain rounded-xl border border-emerald-700/50 shadow-lg"
                  />
                </div>
              )}

              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={(e) => handleImage(e, "mobileImage")}
                className="hidden"
                id="mobile-image-input"
              />

              <label
                htmlFor="mobile-image-input"
                className="block w-full bg-gray-900/60 border-2 border-dashed border-emerald-700/50 rounded-xl px-6 py-10 text-center cursor-pointer hover:border-emerald-500/70 hover:bg-gray-900/70 transition-all text-gray-300 font-medium"
              >
                {form.mobileImage
                  ? "Change Mobile Image"
                  : "Upload Mobile Image"}
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-12 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              disabled={saving}
              className="w-full max-w-md mx-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-5 rounded-xl font-bold text-xl cursor-pointer transition-all shadow-2xl disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save All Changes"}
            </motion.button>
          </div>
        </motion.div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
}
