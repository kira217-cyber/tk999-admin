// src/pages/NavbarSettings.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../utils/baseURL.js";
import { FaSpinner } from "react-icons/fa";

export default function NavbarSettings() {
  const [form, setForm] = useState({
    logo: null, // file or null
    currentLogoUrl: "", // for preview if already exists
    links: [],
    registerButton: { text: "", link: "", bgColor: "#99FF47", textColor: "#000000" },
    loginButton: { text: "", link: "", bgColor: "#ffffff", textColor: "#000000", arrow: ">" },
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/navbar/admin`);
        const data = res.data;

        setForm({
          logo: null,
          currentLogoUrl: data.logo || "",
          links: Array.isArray(data.links) ? data.links : [],
          registerButton: {
            text: data.registerButton?.text || "সদস্য সাইন ইন",
            link: data.registerButton?.link || "/register",
            bgColor: data.registerButton?.bgColor || "#99FF47",
            textColor: data.registerButton?.textColor || "#000000",
          },
          loginButton: {
            text: data.loginButton?.text || "এখন আবেদন করুন!",
            link: data.loginButton?.link || "/login",
            bgColor: data.loginButton?.bgColor || "#ffffff",
            textColor: data.loginButton?.textColor || "#000000",
            arrow: data.loginButton?.arrow || ">",
          },
        });
      } catch (err) {
        console.error("Failed to load navbar settings:", err);
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...form.links];
    newLinks[index][field] = value;
    setForm({ ...form, links: newLinks });
  };

  const addLink = () => {
    setForm({ ...form, links: [...form.links, { name: "", sectionId: "" }] });
  };

  const removeLink = (index) => {
    setForm({ ...form, links: form.links.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (form.logo instanceof File) {
      formData.append("logo", form.logo);
    }
    formData.append("links", JSON.stringify(form.links));
    formData.append("registerButton", JSON.stringify(form.registerButton));
    formData.append("loginButton", JSON.stringify(form.loginButton));

    try {
      await axios.put(`${API_URL}/api/navbar`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Navbar settings updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update navbar");
    }
  };

  const handleReset = async () => {
    if (!window.confirm("Reset all navbar settings to default?")) return;

    try {
      await axios.delete(`${API_URL}/api/navbar`);
      toast.success("Navbar reset to default!");
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center">
          Navbar Settings
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl"
        >
          {/* Logo Upload */}
          <div className="mb-8">
            <label className="block text-emerald-300 font-medium mb-3 text-lg">
              Upload Logo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setForm({ ...form, logo: e.target.files[0] || null })}
              className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-700/50 file:text-emerald-100 hover:file:bg-emerald-600/70 cursor-pointer"
            />
            {(form.currentLogoUrl || form.logo) && (
              <div className="mt-4">
                <img
                  src={
                    form.logo instanceof File
                      ? URL.createObjectURL(form.logo)
                      : form.currentLogoUrl.startsWith("http")
                      ? form.currentLogoUrl
                      : `${API_URL}${form.currentLogoUrl}`
                  }
                  alt="Current Logo Preview"
                  className="h-20 sm:h-24 object-contain rounded-lg border border-emerald-700/50 shadow-lg"
                />
              </div>
            )}
          </div>

          {/* Register Button */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div>
              <label className="block text-emerald-300 font-medium mb-2">Register Button Text</label>
              <input
                type="text"
                value={form.registerButton.text}
                onChange={(e) =>
                  setForm({
                    ...form,
                    registerButton: { ...form.registerButton, text: e.target.value },
                  })
                }
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-medium mb-2">Register Button Link</label>
              <input
                type="text"
                value={form.registerButton.link}
                onChange={(e) =>
                  setForm({
                    ...form,
                    registerButton: { ...form.registerButton, link: e.target.value },
                  })
                }
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-medium mb-2">Register BG Color</label>
              <input
                type="color"
                value={form.registerButton.bgColor}
                onChange={(e) =>
                  setForm({
                    ...form,
                    registerButton: { ...form.registerButton, bgColor: e.target.value },
                  })
                }
                className="w-full h-12 bg-gray-900/60 border border-emerald-800/50 rounded-xl cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-medium mb-2">Register Text Color</label>
              <input
                type="color"
                value={form.registerButton.textColor}
                onChange={(e) =>
                  setForm({
                    ...form,
                    registerButton: { ...form.registerButton, textColor: e.target.value },
                  })
                }
                className="w-full h-12 bg-gray-900/60 border border-emerald-800/50 rounded-xl cursor-pointer"
              />
            </div>
          </div>

          {/* Login Button */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div>
              <label className="block text-emerald-300 font-medium mb-2">Login Button Text</label>
              <input
                type="text"
                value={form.loginButton.text}
                onChange={(e) =>
                  setForm({
                    ...form,
                    loginButton: { ...form.loginButton, text: e.target.value },
                  })
                }
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-medium mb-2">Login Button Link</label>
              <input
                type="text"
                value={form.loginButton.link}
                onChange={(e) =>
                  setForm({
                    ...form,
                    loginButton: { ...form.loginButton, link: e.target.value },
                  })
                }
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-medium mb-2">Login BG Color</label>
              <input
                type="color"
                value={form.loginButton.bgColor}
                onChange={(e) =>
                  setForm({
                    ...form,
                    loginButton: { ...form.loginButton, bgColor: e.target.value },
                  })
                }
                className="w-full h-12 bg-gray-900/60 border border-emerald-800/50 rounded-xl cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-medium mb-2">Login Text Color</label>
              <input
                type="color"
                value={form.loginButton.textColor}
                onChange={(e) =>
                  setForm({
                    ...form,
                    loginButton: { ...form.loginButton, textColor: e.target.value },
                  })
                }
                className="w-full h-12 bg-gray-900/60 border border-emerald-800/50 rounded-xl cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-medium mb-2">Arrow Symbol</label>
              <input
                type="text"
                value={form.loginButton.arrow}
                onChange={(e) =>
                  setForm({
                    ...form,
                    loginButton: { ...form.loginButton, arrow: e.target.value },
                  })
                }
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-white mb-4">Navigation Links</h3>

            {form.links.map((link, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-4 mb-4 items-end">
                <div className="flex-1">
                  <label className="block text-emerald-300 font-medium mb-2">Link Name</label>
                  <input
                    type="text"
                    value={link.name}
                    onChange={(e) => handleLinkChange(index, "name", e.target.value)}
                    placeholder="Link Name"
                    className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-emerald-300 font-medium mb-2">Section ID</label>
                  <input
                    type="text"
                    value={link.sectionId}
                    onChange={(e) => handleLinkChange(index, "sectionId", e.target.value)}
                    placeholder="Section ID (e.g. features)"
                    className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeLink(index)}
                  className="bg-rose-700/60 hover:bg-rose-600/70 text-white px-5 py-3 rounded-xl font-medium cursor-pointer transition-all"
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addLink}
              className="bg-emerald-700/60 hover:bg-emerald-600/70 text-white px-6 py-3 rounded-xl font-medium cursor-pointer transition-all mt-4"
            >
              + Add New Link
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
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
        </form>
      </motion.div>

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
}