// src/pages/HowToProcessSettings.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../utils/baseURL";
import { FaSpinner } from "react-icons/fa";

export default function HowToProcessSettings() {
  const [form, setForm] = useState({
    mainHeading: "",
    buttonText: "",
    steps: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/how-to-process/admin`);
        const data = res.data;

        setForm({
          mainHeading: data.mainHeading || "",
          buttonText: data.buttonText || "",
          steps: (data.steps || []).map((s) => ({
            _id: s._id,
            title: s.title || "",
            desc: s.desc || "",
            iconFile: null,
            iconUrl: s.icon || "",
            previewUrl: null,
          })),
        });
      } catch (err) {
        console.error("Failed to load How To Process settings:", err);
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleIconChange = (index, file) => {
    const newSteps = [...form.steps];
    newSteps[index] = {
      ...newSteps[index],
      iconFile: file,
      previewUrl: file ? URL.createObjectURL(file) : null,
    };
    setForm({ ...form, steps: newSteps });
  };

  const addStep = () => {
    setForm({
      ...form,
      steps: [
        ...form.steps,
        { _id: null, title: "", desc: "", iconFile: null, iconUrl: "", previewUrl: null },
      ],
    });
  };

  const removeStep = (index) => {
    setForm({
      ...form,
      steps: form.steps.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("mainHeading", form.mainHeading);
    formData.append("buttonText", form.buttonText);

    // Steps JSON (keep _id for updates)
    const stepsPayload = form.steps.map((s) => ({
      _id: s._id,
      title: s.title,
      desc: s.desc,
      icon: s.iconUrl || "",
    }));
    formData.append("steps", JSON.stringify(stepsPayload));

    // Append new icon files with index
    form.steps.forEach((step, index) => {
      if (step.iconFile) {
        formData.append(`icons[${index}]`, step.iconFile);
      }
    });

    try {
      await axios.put(`${API_URL}/api/how-to-process`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("How To Process settings updated successfully!");
    } catch (err) {
      console.error("Submit error:", err);
      toast.error(err.response?.data?.message || "Failed to update");
    }
  };

  const handleReset = async () => {
    if (!window.confirm("Reset all How To Process settings to default?")) return;

    try {
      await axios.delete(`${API_URL}/api/how-to-process`);
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
          How To Process Settings
        </h1>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl mb-12"
        >
          {/* Main Heading */}
          <div className="mb-8">
            <label className="block text-emerald-300 font-medium mb-3 text-lg">
              Main Heading
            </label>
            <input
              type="text"
              value={form.mainHeading}
              onChange={(e) => setForm({ ...form, mainHeading: e.target.value })}
              className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
            />
          </div>

          {/* Button Text */}
          <div className="mb-10">
            <label className="block text-emerald-300 font-medium mb-3 text-lg">
              Button Text
            </label>
            <input
              type="text"
              value={form.buttonText}
              onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
              className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
            />
          </div>

          {/* Steps Section */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-white mb-4">Process Steps</h3>

            {form.steps.map((step, index) => (
              <motion.div
                key={step._id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900/50 border border-emerald-800/50 rounded-xl p-5 mb-6 shadow-lg"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-emerald-300 font-medium mb-2">Step Title</label>
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => {
                        const newSteps = [...form.steps];
                        newSteps[index].title = e.target.value;
                        setForm({ ...form, steps: newSteps });
                      }}
                      placeholder="e.g. Step 1 - Register"
                      className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-emerald-300 font-medium mb-2">Description</label>
                    <textarea
                      value={step.desc}
                      onChange={(e) => {
                        const newSteps = [...form.steps];
                        newSteps[index].desc = e.target.value;
                        setForm({ ...form, steps: newSteps });
                      }}
                      placeholder="Detailed step description..."
                      rows={4}
                      className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all resize-y"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-emerald-300 font-medium mb-2">Step Icon</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleIconChange(index, e.target.files[0])}
                      className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-700/50 file:text-emerald-100 hover:file:bg-emerald-600/70 cursor-pointer"
                    />
                    {(step.previewUrl || step.iconUrl) && (
                      <div className="mt-4">
                        <img
                          src={
                            step.previewUrl ||
                            (step.iconUrl.startsWith("http")
                              ? step.iconUrl
                              : `${API_URL}${step.iconUrl}`)
                          }
                          alt="Step Icon Preview"
                          className="w-16 h-16 object-contain rounded-lg border border-emerald-700/50 shadow-md"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="mt-4 bg-rose-700/60 hover:bg-rose-600/70 text-white px-6 py-2 rounded-xl font-medium cursor-pointer transition-all"
                >
                  Remove Step
                </button>
              </motion.div>
            ))}

            <button
              type="button"
              onClick={addStep}
              className="bg-emerald-700/60 hover:bg-emerald-600/70 text-white px-6 py-3 rounded-xl font-medium cursor-pointer transition-all mt-4"
            >
              + Add New Step
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