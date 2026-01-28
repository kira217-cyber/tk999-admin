// src/pages/WhyChooseUsSettings.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../utils/baseURL";
import { FaSpinner } from "react-icons/fa";

export default function WhyChooseUsSettings() {
  const [form, setForm] = useState({
    backgroundImage: null,
    backgroundImageUrl: "",
    heading: "",
    subheading: "",
    features: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/why-choose-us/admin`);
        const data = res.data;

        setForm({
          backgroundImage: null,
          backgroundImageUrl: data.backgroundImage || "",
          heading: data.heading || "",
          subheading: data.subheading || "",
          features: (data.features || []).map((f) => ({
            _id: f._id || null,
            title: f.title || "",
            desc: f.desc || "",
            iconFile: null,
            iconUrl: f.icon || "",
          })),
        });
      } catch (err) {
        console.error("Failed to load Why Choose Us settings:", err);
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFeatureChange = (index, field, value) => {
    const newFeatures = [...form.features];
    newFeatures[index][field] = value;
    setForm({ ...form, features: newFeatures });
  };

  const handleIconChange = (index, file) => {
    const newFeatures = [...form.features];
    newFeatures[index].iconFile = file;
    newFeatures[index].iconUrl = file
      ? URL.createObjectURL(file)
      : newFeatures[index].iconUrl;
    setForm({ ...form, features: newFeatures });
  };

  const addFeature = () => {
    setForm({
      ...form,
      features: [
        ...form.features,
        { _id: null, title: "", desc: "", iconFile: null, iconUrl: "" },
      ],
    });
  };

  const removeFeature = (index) => {
    setForm({
      ...form,
      features: form.features.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Background Image
    if (form.backgroundImage instanceof File) {
      formData.append("backgroundImage", form.backgroundImage);
    }

    formData.append("heading", form.heading);
    formData.append("subheading", form.subheading);

    // Features JSON (keep _id for updates)
    const featuresPayload = form.features.map((f) => ({
      _id: f._id || undefined,
      title: f.title,
      desc: f.desc,
      icon: f.iconUrl || "",
    }));
    formData.append("features", JSON.stringify(featuresPayload));

    // Append new icon files with index
    form.features.forEach((f, i) => {
      if (f.iconFile) {
        formData.append(`icons[${i}]`, f.iconFile);
      }
    });

    try {
      await axios.put(`${API_URL}/api/why-choose-us`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Why Choose Us settings updated successfully!");
    } catch (err) {
      console.error("Submit error:", err);
      toast.error(err.response?.data?.message || "Failed to update");
    }
  };

  const handleReset = async () => {
    if (!window.confirm("Reset all Why Choose Us settings to default?")) return;

    try {
      await axios.delete(`${API_URL}/api/why-choose-us`);
      toast.success("Settings reset to default!");
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset");
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
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center">
          Why Choose Us Settings
        </h1>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl mb-12"
        >
          {/* Background Image */}
          <div className="mb-10">
            <label className="block text-emerald-300 font-medium mb-3 text-lg">
              Background Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                setForm({
                  ...form,
                  backgroundImage: file || null,
                  backgroundImageUrl: file
                    ? URL.createObjectURL(file)
                    : form.backgroundImageUrl,
                });
              }}
              className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-700/50 file:text-emerald-100 hover:file:bg-emerald-600/70 cursor-pointer"
            />
            {(form.backgroundImage || form.backgroundImageUrl) && (
              <div className="mt-4">
                <img
                  src={
                    form.backgroundImage instanceof File
                      ? URL.createObjectURL(form.backgroundImage)
                      : form.backgroundImageUrl.startsWith("http")
                        ? form.backgroundImageUrl
                        : `${API_URL}${form.backgroundImageUrl}`
                  }
                  alt="Background Preview"
                  className="w-full max-h-48 object-cover rounded-xl border border-emerald-700/50 shadow-lg"
                />
              </div>
            )}
          </div>

          {/* Heading & Subheading */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Main Heading
              </label>
              <input
                type="text"
                value={form.heading}
                onChange={(e) => setForm({ ...form, heading: e.target.value })}
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-emerald-300 font-medium mb-2">
                Subheading
              </label>
              <textarea
                value={form.subheading}
                onChange={(e) =>
                  setForm({ ...form, subheading: e.target.value })
                }
                rows={4}
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all resize-y"
              />
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-white mb-4">Features</h3>

            {form.features.map((feature, index) => (
              <motion.div
                key={feature._id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900/50 border border-emerald-800/50 rounded-xl p-5 mb-6 shadow-lg"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-emerald-300 font-medium mb-2">
                      Feature Title
                    </label>
                    <input
                      type="text"
                      value={feature.title}
                      onChange={(e) =>
                        handleFeatureChange(index, "title", e.target.value)
                      }
                      placeholder="e.g. Best Support"
                      className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-emerald-300 font-medium mb-2">
                      Description
                    </label>
                    <textarea
                      value={feature.desc}
                      onChange={(e) =>
                        handleFeatureChange(index, "desc", e.target.value)
                      }
                      placeholder="Short description..."
                      rows={3}
                      className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all resize-y"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-emerald-300 font-medium mb-2">
                      Feature Icon
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleIconChange(index, e.target.files[0])
                      }
                      className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-700/50 file:text-emerald-100 hover:file:bg-emerald-600/70 cursor-pointer"
                    />
                    {(feature.iconFile || feature.iconUrl) && (
                      <div className="mt-4">
                        <img
                          src={
                            feature.iconFile instanceof File
                              ? URL.createObjectURL(feature.iconFile)
                              : feature.iconUrl.startsWith("http")
                                ? feature.iconUrl
                                : `${API_URL}${feature.iconUrl}`
                          }
                          alt="Feature Icon Preview"
                          className="w-16 h-16 object-contain rounded-lg border border-emerald-700/50 shadow-md"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="mt-4 bg-rose-700/60 hover:bg-rose-600/70 text-white px-6 py-2 rounded-xl font-medium cursor-pointer transition-all"
                >
                  Remove Feature
                </button>
              </motion.div>
            ))}

            <button
              type="button"
              onClick={addFeature}
              className="bg-emerald-700/60 hover:bg-emerald-600/70 text-white px-6 py-3 rounded-xl font-medium cursor-pointer transition-all mt-4"
            >
              + Add New Feature
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-4 rounded-xl font-bold cursor-pointer transition-all shadow-lg"
            >
              Save Changes
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={handleReset}
              className="flex-1 bg-gradient-to-r from-rose-700 to-red-700 hover:from-rose-600 hover:to-red-600 text-white py-4 rounded-xl font-bold cursor-pointer transition-all shadow-lg"
            >
              Reset to Default
            </motion.button>
          </div>
        </motion.form>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
}
