// src/pages/SiteControl.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTimes, FaEdit, FaUpload, FaSpinner } from "react-icons/fa";
import { baseURL, baseURL_For_IMG_UPLOAD } from "../utils/baseURL";

export default function SiteControl() {
  const [theme, setTheme] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingThemeId, setEditingThemeId] = useState(null);

  const [formData, setFormData] = useState({
    primaryColor: "#FF5733",
    secondaryColor: "#C70039",
    sidebarHeaderColor: "#1C2937",
    sidebarBodyColor: "#34495E",
    sidebarTitle: "roni",
    sidebarTitleBD: "roni",
    websiteTitle: "roni",
    favicon: "",
    websiteLogoWhite: "",
    websiteLogoDark: "",
  });

  useEffect(() => {
    fetchTheme();
  }, []);

  const fetchTheme = async () => {
    try {
      const response = await fetch(`${baseURL}/admin-home-control`);
      const data = await response.json();
      if (response.ok && Object.keys(data).length > 0) {
        setTheme(data);
        setFormData({
          primaryColor: data.primaryColor || "#FF5733",
          secondaryColor: data.secondaryColor || "#C70039",
          sidebarHeaderColor: data.sidebarHeaderColor || "#1C2937",
          sidebarBodyColor: data.sidebarBodyColor || "#34495E",
          sidebarTitle: data.sidebarTitle || "roni",
          sidebarTitleBD: data.sidebarTitleBD || "roni",
          websiteTitle: data.websiteTitle || "roni",
          favicon: data.favicon || "",
          websiteLogoWhite: data.websiteLogoWhite || "",
          websiteLogoDark: data.websiteLogoDark || "",
        });
      }
    } catch (error) {
      console.error("Fetch Theme Error:", error);
      toast.error("Failed to load current theme");
    }
  };

  const handleImageUpload = async (file, field) => {
    if (!file) return;
    const uploadData = new FormData();
    uploadData.append("image", file);

    setIsUploading(true);
    try {
      const res = await fetch(baseURL_For_IMG_UPLOAD, {
        method: "POST",
        body: uploadData,
      });

      const data = await res.json();
      if (!res.ok || !data.imageUrl) throw new Error("Upload failed");

      setFormData((prev) => ({ ...prev, [field]: data.imageUrl }));
      toast.success(`${field.replace(/([A-Z])/g, " $1").trim()} uploaded`);
    } catch (error) {
      toast.error(`Failed to upload ${field}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = [
      "primaryColor",
      "secondaryColor",
      "sidebarHeaderColor",
      "sidebarBodyColor",
      "sidebarTitle",
      "sidebarTitleBD",
      "websiteTitle",
    ];

    if (requiredFields.some((f) => !formData[f])) {
      toast.error("Please fill all required fields");
      return;
    }

    if (formData.sidebarTitle.length > 10) {
      toast.error("Sidebar title must be ≤ 10 characters");
      return;
    }

    try {
      const payload = { ...formData };

      const url = editingThemeId
        ? `${baseURL}/admin-home-control/${editingThemeId}`
        : `${baseURL}/admin-home-control`;

      const method = editingThemeId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(editingThemeId ? "Theme updated!" : "Theme created!");
        fetchTheme();
        setIsDialogOpen(false);
      } else {
        toast.error(data.message || "Failed to save theme");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleEdit = () => {
    if (theme) {
      setEditingThemeId(theme._id);
      setIsDialogOpen(true);
    }
  };

  const openCreateDialog = () => {
    setEditingThemeId(null);
    setFormData({
      primaryColor: "#FF5733",
      secondaryColor: "#C70039",
      sidebarHeaderColor: "#1C2937",
      sidebarBodyColor: "#34495E",
      sidebarTitle: "roni",
      sidebarTitleBD: "roni",
      websiteTitle: "roni",
      favicon: "",
      websiteLogoWhite: "",
      websiteLogoDark: "",
    });
    setIsDialogOpen(true);
  };

  const closeDialog = () => setIsDialogOpen(false);

  const dynamicStyles = {
    "--primary-color": theme?.primaryColor || "#FF5733",
    "--secondary-color": theme?.secondaryColor || "#C70039",
    "--sidebar-header-color": theme?.sidebarHeaderColor || "#1C2937",
    "--sidebar-body-color": theme?.sidebarBodyColor || "#34495E",
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-black text-white p-5 sm:p-8"
      style={dynamicStyles}
    >
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-10 text-center text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          Theme Control
        </h1>

        {!theme ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="mb-6 text-lg text-gray-400">
              No theme has been created yet
            </p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={openCreateDialog}
              className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-10 py-4 font-semibold shadow-lg hover:from-emerald-500 hover:to-teal-500"
            >
              Create Your First Theme
            </motion.button>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800/60 bg-gradient-to-br from-slate-900/70 to-slate-950/70 p-6 backdrop-blur-sm sm:p-8 shadow-2xl">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[
                { label: "Website Title", value: theme.websiteTitle },
                { label: "Sidebar Title", value: theme.sidebarTitle },
                { label: "Sidebar Title (BD)", value: theme.sidebarTitleBD },
                {
                  label: "Primary Color",
                  value: theme.primaryColor,
                  color: true,
                },
                {
                  label: "Secondary Color",
                  value: theme.secondaryColor,
                  color: true,
                },
                {
                  label: "Sidebar Header Color",
                  value: theme.sidebarHeaderColor,
                  color: true,
                },
                {
                  label: "Sidebar Body Color",
                  value: theme.sidebarBodyColor,
                  color: true,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-slate-800/50 bg-slate-900/40 p-5"
                >
                  <div className="mb-2 text-sm text-slate-400">
                    {item.label}
                  </div>
                  {item.color ? (
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 rounded-full border-2 border-white/30 shadow-inner"
                        style={{ backgroundColor: item.value }}
                      />
                      <span className="font-mono text-slate-200">
                        {item.value}
                      </span>
                    </div>
                  ) : (
                    <div className="font-medium text-white">{item.value}</div>
                  )}
                </div>
              ))}

              {["favicon", "websiteLogoWhite", "websiteLogoDark"].map((key) =>
                theme[key] ? (
                  <div
                    key={key}
                    className="rounded-xl border border-slate-800/50 bg-slate-900/40 p-5"
                  >
                    <div className="mb-3 text-sm text-slate-400 capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </div>
                    <img
                      src={`${baseURL_For_IMG_UPLOAD}s/${theme[key]}`}
                      alt={key}
                      className="mx-auto h-20 w-auto rounded-lg object-contain shadow-md"
                    />
                  </div>
                ) : null,
              )}
            </div>

            <div className="mt-10 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleEdit}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-10 py-4 font-semibold shadow-lg hover:from-emerald-500 hover:to-teal-500"
              >
                <FaEdit className="text-lg" />
                Edit Theme
              </motion.button>
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────── */}
        {/*               DIALOG / MODAL                   */}
        {/* ────────────────────────────────────────────── */}
        {isDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-700/60 bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-700/60 bg-slate-900/60 px-6 py-5">
                <h2 className="text-xl font-semibold text-white sm:text-2xl">
                  {editingThemeId ? "Edit Theme" : "Create Theme"}
                </h2>
                <button
                  onClick={closeDialog}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-800/60 hover:text-white transition-colors"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {/* Scrollable content with hidden scrollbar */}
              <div
                className="custom-scrollbar max-h-[70vh] overflow-y-auto px-6 py-8 sm:px-8"
                style={{
                  scrollbarWidth: "none", // Firefox
                  msOverflowStyle: "none", // IE + Edge
                }}
              >
                <style jsx>{`
                  .custom-scrollbar::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>

                <form onSubmit={handleSubmit} className="space-y-7">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Text fields */}
                    {[
                      { label: "Website Title", name: "websiteTitle" },
                      {
                        label: "Sidebar Title (max 10 chars)",
                        name: "sidebarTitle",
                        maxLength: 10,
                      },
                      {
                        label: "Sidebar Title (Bangla)",
                        name: "sidebarTitleBD",
                      },
                    ].map((field) => (
                      <div key={field.name}>
                        <label className="mb-2 block text-sm font-medium text-emerald-300/90">
                          {field.label}
                        </label>
                        <input
                          type="text"
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleInputChange}
                          maxLength={field.maxLength}
                          required
                          className="w-full rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                        />
                      </div>
                    ))}

                    {/* Color pickers */}
                    {[
                      { label: "Primary Color", name: "primaryColor" },
                      { label: "Secondary Color", name: "secondaryColor" },
                      {
                        label: "Sidebar Header Color",
                        name: "sidebarHeaderColor",
                      },
                      { label: "Sidebar Body Color", name: "sidebarBodyColor" },
                    ].map((field) => (
                      <div key={field.name}>
                        <label className="mb-2 block text-sm font-medium text-emerald-300/90">
                          {field.label}
                        </label>
                        <div className="flex gap-3">
                          <input
                            type="color"
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleInputChange}
                            className="h-10 w-12 cursor-pointer rounded border border-slate-600 bg-transparent p-1"
                          />
                          <input
                            type="text"
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleInputChange}
                            className="flex-1 rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-3 font-mono text-white focus:border-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                          />
                        </div>
                      </div>
                    ))}

                    {/* Image uploads */}
                    {[
                      { label: "Favicon", name: "favicon", size: "w-16 h-16" },
                      {
                        label: "Website Logo (White)",
                        name: "websiteLogoWhite",
                        size: "w-32 h-auto",
                      },
                      {
                        label: "Website Logo (Dark)",
                        name: "websiteLogoDark",
                        size: "w-32 h-auto",
                      },
                    ].map((field) => (
                      <div key={field.name} className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-emerald-300/90">
                          {field.label}
                        </label>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                          {(formData[field.name] ||
                            (theme && theme[field.name])) && (
                            <div className="flex-shrink-0">
                              <img
                                src={`${baseURL_For_IMG_UPLOAD}s/${formData[field.name] || theme?.[field.name]}`}
                                alt={field.label}
                                className={`${field.size} rounded-lg border border-slate-700 object-contain shadow-sm`}
                              />
                            </div>
                          )}

                          <label className="group flex-1 cursor-pointer">
                            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-600 p-8 text-center transition-all hover:border-emerald-500/50 hover:bg-slate-800/30">
                              <input
                                type="file"
                                accept="image/*,.ico"
                                onChange={(e) =>
                                  handleImageUpload(
                                    e.target.files?.[0],
                                    field.name,
                                  )
                                }
                                className="hidden"
                                disabled={isUploading}
                              />
                              {isUploading ? (
                                <FaSpinner className="mb-3 animate-spin text-4xl text-emerald-500" />
                              ) : (
                                <FaUpload className="mb-3 text-4xl text-emerald-500/70 group-hover:text-emerald-400 transition-colors" />
                              )}
                              <p className="text-slate-300 group-hover:text-white">
                                {isUploading
                                  ? "Uploading..."
                                  : "Click or drag image"}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                PNG, JPG, ICO • Recommended favicon 32×32
                              </p>
                            </div>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isUploading}
                      className="flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-4 font-semibold text-white shadow-lg hover:from-emerald-500 hover:to-teal-500 disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {isUploading && <FaSpinner className="animate-spin" />}
                      {editingThemeId ? "Update Theme" : "Create Theme"}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={closeDialog}
                      className="flex-1 rounded-xl border border-slate-600 bg-slate-800 py-4 font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      <ToastContainer position="top-center" theme="dark" limit={3} />
    </div>
  );
}
