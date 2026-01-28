// src/pages/FooterSettings.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../utils/baseURL";
import { FaFacebookF, FaInstagram, FaYoutube, FaTwitter, FaSpinner } from "react-icons/fa";

export default function FooterSettings() {
  const [form, setForm] = useState({
    logo: null,
    tagline: "",
    copyright: "",
    paymentMethods: [
      { name: "bKash", image: null },
      { name: "Nagad", image: null },
      { name: "Rocket", image: null },
    ],
    socialLinks: [
      { platform: "facebook", url: "" },
      { platform: "instagram", url: "" },
      { platform: "youtube", url: "" },
      { platform: "twitter", url: "" },
    ],
  });

  const [preview, setPreview] = useState({ logo: "", payments: ["", "", ""] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isExisting, setIsExisting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/footer`);
      const d = res.data;

      if (d && (d.logo || d.tagline || d.paymentMethods?.length > 0)) {
        setIsExisting(true);
      }

      setForm({
        logo: null,
        tagline: d.tagline || "",
        copyright: d.copyright || "",
        paymentMethods: d.paymentMethods || form.paymentMethods,
        socialLinks: d.socialLinks || form.socialLinks,
      });

      setPreview({
        logo: d.logo ? `${API_URL}${d.logo}` : "",
        payments: (d.paymentMethods || []).map((m) =>
          m.image ? `${API_URL}${m.image}` : ""
        ),
      });
    } catch (err) {
      console.error("Failed to load footer settings:", err);
      toast.error("Failed to load footer settings");
    } finally {
      setLoading(false);
    }
  };

  const handleImage = (e, type, index = null) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === "logo") {
      setForm({ ...form, logo: file });
      setPreview({ ...preview, logo: URL.createObjectURL(file) });
    } else {
      const newPayments = [...form.paymentMethods];
      newPayments[index].image = file;
      setForm({ ...form, paymentMethods: newPayments });

      const newPrev = [...preview.payments];
      newPrev[index] = URL.createObjectURL(file);
      setPreview({ ...preview, payments: newPrev });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const data = new FormData();

    data.append("tagline", form.tagline);
    data.append("copyright", form.copyright);
    data.append(
      "paymentMethods",
      JSON.stringify(form.paymentMethods.map((p) => ({ name: p.name })))
    );
    data.append("socialLinks", JSON.stringify(form.socialLinks));

    if (form.logo) data.append("logo", form.logo);
    form.paymentMethods.forEach((method, i) => {
      if (method.image && typeof method.image !== "string") {
        data.append(`payment_${i}`, method.image);
      }
    });

    try {
      if (isExisting) {
        await axios.put(`${API_URL}/api/footer`, data);
      } else {
        await axios.post(`${API_URL}/api/footer`, data);
      }
      toast.success("Footer settings saved successfully!");
      setIsExisting(true);
      loadData();
    } catch (err) {
      console.error("Save error:", err);
      toast.error(err.response?.data?.message || "Failed to save footer");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete footer settings permanently?")) return;

    try {
      await axios.delete(`${API_URL}/api/footer`);
      toast.success("Footer deleted successfully!");
      window.location.reload();
    } catch (err) {
      toast.error("Failed to delete footer");
    }
  };

  const getIcon = (platform) => {
    const icons = {
      facebook: <FaFacebookF size={18} />,
      instagram: <FaInstagram size={18} />,
      youtube: <FaYoutube size={18} />,
      twitter: <FaTwitter size={18} />,
    };
    return icons[platform] || null;
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
          Footer Settings
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left - Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl"
          >
            {/* Logo */}
            <div className="mb-10">
              <label className="block text-emerald-300 font-medium mb-3 text-lg">
                Logo
              </label>

              {preview.logo && (
                <div className="mb-4">
                  <img
                    src={preview.logo}
                    alt="Logo Preview"
                    className="w-full max-h-32 object-contain mx-auto rounded-xl border border-emerald-700/50 shadow-lg"
                  />
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImage(e, "logo")}
                className="hidden"
                id="footer-logo-input"
              />

              <label
                htmlFor="footer-logo-input"
                className="block w-full bg-gray-900/60 border-2 border-dashed border-emerald-700/50 rounded-xl px-6 py-10 text-center cursor-pointer hover:border-emerald-500/70 hover:bg-gray-900/70 transition-all text-gray-300 font-medium"
              >
                {preview.logo ? "Change Logo" : "Upload Logo"}
              </label>
            </div>

            {/* Tagline */}
            <div className="mb-8">
              <label className="block text-emerald-300 font-medium mb-2">
                Tagline
              </label>
              <input
                placeholder="Rajabaji Trusted Casino – Best Online Cricket Betting App"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
            </div>

            {/* Copyright */}
            <div className="mb-10">
              <label className="block text-emerald-300 font-medium mb-2">
                Copyright
              </label>
              <textarea
                placeholder="Copyright © 2025 Rajabaji. All Rights Reserved."
                value={form.copyright}
                onChange={(e) => setForm({ ...form, copyright: e.target.value })}
                rows={3}
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all resize-y"
              />
            </div>

            {/* Payment Methods */}
            <div className="mb-10">
              <h3 className="text-xl font-bold text-white mb-4">
                Payment Methods
              </h3>

              {form.paymentMethods.map((method, i) => (
                <div key={i} className="mb-6">
                  <label className="block text-emerald-300 font-medium mb-2">
                    {method.name}
                  </label>

                  {preview.payments[i] && (
                    <div className="mb-4">
                      <img
                        src={preview.payments[i]}
                        alt={`${method.name} Preview`}
                        className="w-24 h-16 object-contain mx-auto rounded-lg border border-emerald-700/50 shadow-md"
                      />
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImage(e, "payment", i)}
                    className="hidden"
                    id={`payment-${i}-input`}
                  />

                  <label
                    htmlFor={`payment-${i}-input`}
                    className="block w-full bg-gray-900/60 border-2 border-dashed border-emerald-700/50 rounded-xl px-6 py-6 text-center cursor-pointer hover:border-emerald-500/70 hover:bg-gray-900/70 transition-all text-gray-300 font-medium"
                  >
                    Change {method.name} Image
                  </label>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="mb-10">
              <h3 className="text-xl font-bold text-white mb-4">
                Social Links
              </h3>

              {form.socialLinks.map((link, i) => (
                <div key={i} className="mb-4">
                  <label className="block text-emerald-300 font-medium mb-2 capitalize">
                    {link.platform}
                  </label>
                  <input
                    placeholder={`${link.platform} URL`}
                    value={link.url}
                    onChange={(e) => {
                      const newLinks = [...form.socialLinks];
                      newLinks[i].url = e.target.value;
                      setForm({ ...form, socialLinks: newLinks });
                    }}
                    className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                  />
                </div>
              ))}
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
                {saving ? "Saving..." : "Save Footer"}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleDelete}
                className="flex-1 bg-gradient-to-r from-rose-700 to-red-700 hover:from-rose-600 hover:to-red-600 text-white py-4 rounded-xl font-bold cursor-pointer transition-all shadow-lg"
              >
                Delete Footer
              </motion.button>
            </div>
          </motion.div>

          {/* Right - Live Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Live Footer Preview
            </h3>

            <div className="text-center">
              {/* Logo */}
              {preview.logo && (
                <img
                  src={preview.logo}
                  alt="Footer Logo"
                  className="h-20 mx-auto mb-4 object-contain"
                />
              )}

              {/* Tagline */}
              <p className="text-gray-300 text-sm mb-6">
                {form.tagline || "Your tagline here"}
              </p>

              {/* Payment Methods */}
              <div className="mb-8">
                <h4 className="text-emerald-300 font-medium mb-3">
                  Payment Methods
                </h4>
                <div className="flex flex-wrap justify-center gap-4">
                  {preview.payments.map((img, i) =>
                    img ? (
                      <img
                        key={i}
                        src={img}
                        alt={form.paymentMethods[i]?.name}
                        className="w-16 h-10 object-contain rounded-lg border border-emerald-700/50 shadow-md"
                      />
                    ) : (
                      <div
                        key={i}
                        className="w-16 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-xs text-gray-500"
                      >
                        {form.paymentMethods[i]?.name}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Social Links */}
              <div className="mb-8">
                <h4 className="text-emerald-300 font-medium mb-3">
                  Follow Us
                </h4>
                <div className="flex justify-center gap-6">
                  {form.socialLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 transition-colors text-2xl"
                    >
                      {getIcon(link.platform)}
                    </a>
                  ))}
                </div>
              </div>

              {/* Copyright */}
              <p className="text-gray-500 text-sm border-t border-emerald-900/50 pt-6">
                {form.copyright || "Copyright © 2025 Rajabaji. All Rights Reserved."}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
}