// src/pages/SliderSettings.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../utils/baseURL";
import { FaSpinner } from "react-icons/fa";

export default function SliderSettings() {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    button1Text: "",
    button1Link: "#",
    button2Text: "",
    button2Link: "#",
    titleColor: "#99FF47",
    subtitleColor: "#e5e7eb",
    button1Color: "#99FF47",
    button1TextColor: "#000000",
    button2Color: "#7c3aed",
    button2TextColor: "#ffffff",
    titleSize: "text-5xl",
    subtitleSize: "text-xl",
    isActive: true,
    order: 0,
  });

  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/sliders/admin`);
      setSliders(res.data || []);
    } catch (err) {
      console.error("Failed to load sliders:", err);
      toast.error("Failed to load sliders");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    if (image) formData.append("image", image);

    try {
      if (editId) {
        await axios.put(`${API_URL}/api/sliders/${editId}`, formData);
        toast.success("Slider updated successfully!");
      } else {
        await axios.post(`${API_URL}/api/sliders`, formData);
        toast.success("Slider added successfully!");
      }

      resetForm();
      fetchSliders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save slider");
    }
  };

  const handleEdit = (slider) => {
    setEditId(slider._id);
    setForm({
      title: slider.title || "",
      subtitle: slider.subtitle || "",
      button1Text: slider.button1Text || "",
      button1Link: slider.button1Link || "#",
      button2Text: slider.button2Text || "",
      button2Link: slider.button2Link || "#",
      titleColor: slider.titleColor || "#99FF47",
      subtitleColor: slider.subtitleColor || "#e5e7eb",
      button1Color: slider.button1Color || "#99FF47",
      button1TextColor: slider.button1TextColor || "#000000",
      button2Color: slider.button2Color || "#7c3aed",
      button2TextColor: slider.button2TextColor || "#ffffff",
      titleSize: slider.titleSize || "text-5xl",
      subtitleSize: slider.subtitleSize || "text-xl",
      isActive: slider.isActive ?? true,
      order: slider.order || 0,
    });
    setImage(null);
    setImagePreview(`${API_URL}${slider.image}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this slider?")) return;

    try {
      await axios.delete(`${API_URL}/api/sliders/${id}`);
      toast.success("Slider deleted!");
      fetchSliders();
    } catch (err) {
      toast.error("Failed to delete slider");
    }
  };

  const resetForm = () => {
    setEditId(null);
    setForm({
      title: "",
      subtitle: "",
      button1Text: "",
      button1Link: "#",
      button2Text: "",
      button2Link: "#",
      titleColor: "#99FF47",
      subtitleColor: "#e5e7eb",
      button1Color: "#99FF47",
      button1TextColor: "#000000",
      button2Color: "#7c3aed",
      button2TextColor: "#ffffff",
      titleSize: "text-5xl",
      subtitleSize: "text-xl",
      isActive: true,
      order: 0,
    });
    setImage(null);
    setImagePreview(null);
  };

  const titleSizeOptions = [
    { value: "text-3xl", label: "Small (text-3xl)" },
    { value: "text-4xl", label: "Medium (text-4xl)" },
    { value: "text-5xl", label: "Large (text-5xl)" },
  ];

  const subtitleSizeOptions = [
    { value: "text-lg", label: "Small (text-lg)" },
    { value: "text-xl", label: "Medium (text-xl)" },
    { value: "text-2xl", label: "Large (text-2xl)" },
  ];

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
          Slider Settings
        </h1>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Subtitle
              </label>
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                required
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
            </div>

            {/* Title Size */}
            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Title Text Size
              </label>
              <select
                value={form.titleSize}
                onChange={(e) =>
                  setForm({ ...form, titleSize: e.target.value })
                }
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
              >
                {titleSizeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Subtitle Size */}
            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Subtitle Text Size
              </label>
              <select
                value={form.subtitleSize}
                onChange={(e) =>
                  setForm({ ...form, subtitleSize: e.target.value })
                }
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
              >
                {subtitleSizeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Button 1 */}
            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Button 1 Text
              </label>
              <input
                type="text"
                value={form.button1Text}
                onChange={(e) =>
                  setForm({ ...form, button1Text: e.target.value })
                }
                required
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Button 1 Link
              </label>
              <input
                type="text"
                value={form.button1Link}
                onChange={(e) =>
                  setForm({ ...form, button1Link: e.target.value })
                }
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
            </div>

            {/* Button 2 */}
            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Button 2 Text
              </label>
              <input
                type="text"
                value={form.button2Text}
                onChange={(e) =>
                  setForm({ ...form, button2Text: e.target.value })
                }
                required
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Button 2 Link
              </label>
              <input
                type="text"
                value={form.button2Link}
                onChange={(e) =>
                  setForm({ ...form, button2Link: e.target.value })
                }
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-emerald-300 font-medium mb-2">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-700/50 file:text-emerald-100 hover:file:bg-emerald-600/70 cursor-pointer"
              />
              {(imagePreview || form.currentImageUrl) && (
                <div className="mt-4">
                  <img
                    src={imagePreview || `${API_URL}${form.currentImageUrl}`}
                    alt="Preview"
                    className="w-full max-h-48 object-cover rounded-xl border border-emerald-700/50 shadow-lg"
                  />
                </div>
              )}
            </div>

            {/* Order */}
            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Order (Lower = Top)
              </label>
              <input
                type="number"
                value={form.order}
                onChange={(e) =>
                  setForm({ ...form, order: Number(e.target.value) })
                }
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
            </div>
          </div>

          {/* Color Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-10">
            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Title Color
              </label>
              <input
                type="color"
                value={form.titleColor}
                onChange={(e) =>
                  setForm({ ...form, titleColor: e.target.value })
                }
                className="w-full h-12 bg-gray-900/60 border border-emerald-800/50 rounded-xl cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Subtitle Color
              </label>
              <input
                type="color"
                value={form.subtitleColor}
                onChange={(e) =>
                  setForm({ ...form, subtitleColor: e.target.value })
                }
                className="w-full h-12 bg-gray-900/60 border border-emerald-800/50 rounded-xl cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Button 1 BG
              </label>
              <input
                type="color"
                value={form.button1Color}
                onChange={(e) =>
                  setForm({ ...form, button1Color: e.target.value })
                }
                className="w-full h-12 bg-gray-900/60 border border-emerald-800/50 rounded-xl cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Button 1 Text
              </label>
              <input
                type="color"
                value={form.button1TextColor}
                onChange={(e) =>
                  setForm({ ...form, button1TextColor: e.target.value })
                }
                className="w-full h-12 bg-gray-900/60 border border-emerald-800/50 rounded-xl cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Button 2 BG
              </label>
              <input
                type="color"
                value={form.button2Color}
                onChange={(e) =>
                  setForm({ ...form, button2Color: e.target.value })
                }
                className="w-full h-12 bg-gray-900/60 border border-emerald-800/50 rounded-xl cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Button 2 Text
              </label>
              <input
                type="color"
                value={form.button2TextColor}
                onChange={(e) =>
                  setForm({ ...form, button2TextColor: e.target.value })
                }
                className="w-full h-12 bg-gray-900/60 border border-emerald-800/50 rounded-xl cursor-pointer"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-4 rounded-xl font-bold cursor-pointer transition-all shadow-lg"
            >
              {editId ? "Update Slider" : "Add Slider"}
            </motion.button>

            {editId && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white py-4 rounded-xl font-bold cursor-pointer transition-all border border-gray-600"
              >
                Cancel Edit
              </motion.button>
            )}
          </div>
        </motion.form>

        {/* Existing Sliders Grid */}
        <h2 className="text-2xl font-bold text-white mb-6">Existing Sliders</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sliders.map((slider, idx) => (
            <motion.div
              key={slider._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-5 shadow-xl hover:shadow-2xl transition-all group cursor-pointer"
            >
              <img
                src={`${API_URL}${slider.image}`}
                alt={slider.title}
                className="w-full h-40 object-cover rounded-xl mb-4 border border-emerald-700/50"
              />
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors mb-2">
                {slider.title}
              </h3>

              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(slider)}
                  className="flex-1 bg-emerald-700/60 hover:bg-emerald-600/70 text-white py-2 rounded-xl font-medium cursor-pointer transition-all"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(slider._id)}
                  className="flex-1 bg-rose-700/60 hover:bg-rose-600/70 text-white py-2 rounded-xl font-medium cursor-pointer transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
}
