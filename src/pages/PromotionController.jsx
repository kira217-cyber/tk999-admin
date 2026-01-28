// src/pages/PromotionController.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Upload, Edit, Trash2, Loader2 } from "lucide-react";
import { API_URL } from "../utils/baseURL";

export default function PromotionController() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState("");
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title_en: "",
    title_bn: "",
    description_en: "",
    description_bn: "",
    footer_en: "",
    footer_bn: "",
    category: "All",
    image: null,
  });

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/promotions`);
      setPromotions(res.data || []);
    } catch (err) {
      toast.error("Failed to load promotions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image && !editId) {
      toast.error("Please select an image");
      return;
    }

    setSubmitting(true);
    const fd = new FormData();
    fd.append("title_en", form.title_en);
    fd.append("title_bn", form.title_bn);
    fd.append("description_en", form.description_en);
    fd.append("description_bn", form.description_bn);
    fd.append("footer_en", form.footer_en);
    fd.append("footer_bn", form.footer_bn);
    fd.append("category", form.category);
    if (form.image) fd.append("image", form.image);

    try {
      if (editId) {
        await axios.put(`${API_URL}/api/promotions/${editId}`, fd);
        toast.success("Promotion updated successfully!");
      } else {
        await axios.post(`${API_URL}/api/promotions`, fd);
        toast.success("Promotion added successfully!");
      }
      resetForm();
      fetchPromotions();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({
      title_en: "",
      title_bn: "",
      description_en: "",
      description_bn: "",
      footer_en: "",
      footer_bn: "",
      category: "All",
      image: null,
    });
    setPreview("");
    setEditId(null);
  };

  const handleEdit = (promo) => {
    setForm({
      title_en: promo.title_en || "",
      title_bn: promo.title_bn || "",
      description_en: promo.description_en || "",
      description_bn: promo.description_bn || "",
      footer_en: promo.footer_en || "",
      footer_bn: promo.footer_bn || "",
      category: promo.category || "All",
      image: null,
    });
    setPreview(`${API_URL}${promo.image}`);
    setEditId(promo._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this promotion?")) return;

    try {
      await axios.delete(`${API_URL}/api/promotions/${id}`);
      toast.success("Promotion deleted successfully!");
      fetchPromotions();
    } catch (err) {
      toast.error("Delete failed!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950/20 to-black p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-10 text-center bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          Promotion Controller (Admin)
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl mb-12"
        >
          <h2 className="text-2xl font-bold text-emerald-300 mb-8 flex items-center gap-3">
            <Upload size={28} />
            {editId ? "Edit Promotion" : "Add New Promotion"}
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* English */}
            <div className="space-y-4">
              <input
                placeholder="Title (English)"
                value={form.title_en}
                onChange={(e) => setForm({ ...form, title_en: e.target.value })}
                required
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
              <textarea
                placeholder="Description (English)"
                value={form.description_en}
                onChange={(e) => setForm({ ...form, description_en: e.target.value })}
                required
                rows={4}
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all resize-y"
              />
              <input
                placeholder="Footer Text (English) - Optional"
                value={form.footer_en}
                onChange={(e) => setForm({ ...form, footer_en: e.target.value })}
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
            </div>

            {/* Bangla */}
            <div className="space-y-4">
              <input
                placeholder="টাইটেল (বাংলা)"
                value={form.title_bn}
                onChange={(e) => setForm({ ...form, title_bn: e.target.value })}
                required
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
              <textarea
                placeholder="বিবরণ (বাংলা)"
                value={form.description_bn}
                onChange={(e) => setForm({ ...form, description_bn: e.target.value })}
                required
                rows={4}
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all resize-y"
              />
              <input
                placeholder="ফুটার টেক্সট (বাংলা) - ঐচ্ছিক"
                value={form.footer_bn}
                onChange={(e) => setForm({ ...form, footer_bn: e.target.value })}
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
            </div>

            {/* Category & Image */}
            <div className="md:col-span-2 space-y-6">
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
              >
                {[
                  "All",
                  "Deposit",
                  "Slots",
                  "Fishing",
                  "APP Download",
                  "Newbie",
                  "Rebate",
                  "Ranking",
                  "Poker",
                  "Live Casino",
                  "Sports",
                ].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <div>
                <label className="block text-emerald-300 font-medium mb-3 text-lg">
                  Upload Promotion Image *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required={!editId}
                  className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-700/50 file:text-emerald-100 hover:file:bg-emerald-600/70 cursor-pointer"
                />

                {preview && (
                  <div className="mt-6">
                    <img
                      src={preview}
                      alt="Promotion Preview"
                      className="w-full max-h-80 object-contain rounded-xl border-4 border-emerald-700/50 shadow-2xl mx-auto"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Submit / Cancel */}
            <div className="md:col-span-2 flex flex-col sm:flex-row gap-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={submitting}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-4 rounded-xl font-bold cursor-pointer transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {submitting && <Loader2 size={20} className="animate-spin" />}
                {submitting
                  ? editId
                    ? "Updating..."
                    : "Adding..."
                  : editId
                  ? "Update Promotion"
                  : "Add Promotion"}
              </motion.button>

              {editId && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-4 rounded-xl font-bold cursor-pointer transition-all border border-gray-600"
                >
                  Cancel Edit
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>

        {/* Promotions List */}
        {loading ? (
          <div className="text-center py-20">
            <Loader2 size={64} className="animate-spin mx-auto text-emerald-400" />
          </div>
        ) : promotions.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-2xl">
            No promotions yet. Add your first one above!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-12">
            {promotions.map((promo) => (
              <motion.div
                key={promo._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.random() * 0.3 }}
                className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all group"
              >
                <img
                  src={promo.image}
                  alt={promo.title_en}
                  className="w-full h-48 object-cover"
                />

                <div className="p-5">
                  <h3 className="text-lg font-bold text-emerald-300 mb-2 line-clamp-1">
                    {promo.title_en}
                  </h3>
                  <p className="text-sm text-gray-300 mb-3 line-clamp-1">
                    {promo.title_bn}
                  </p>
                  <span className="inline-block bg-emerald-900/50 text-emerald-300 text-xs font-medium px-3 py-1 rounded-full">
                    {promo.category}
                  </span>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => handleEdit(promo)}
                      className="flex-1 bg-emerald-700/60 hover:bg-emerald-600/70 text-white py-2 rounded-xl font-medium cursor-pointer transition-all flex items-center justify-center gap-2"
                    >
                      <Edit size={16} />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(promo._id)}
                      className="flex-1 bg-rose-700/60 hover:bg-rose-600/70 text-white py-2 rounded-xl font-medium cursor-pointer transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
}