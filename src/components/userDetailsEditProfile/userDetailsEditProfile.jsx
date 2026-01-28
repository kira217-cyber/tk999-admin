import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaSave, FaTimes, FaUpload, FaSpinner } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseURL_For_IMG_UPLOAD, API_URL } from "../../utils/baseURL";

export default function UserDetailsEditProfile({ onCancel }) {
  const { userId } = useParams();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/users/${userId}`);
        const user = res.data;

        setFormData({
          username: user.username || "",
          email: user.email || "",
          whatsapp: user.whatsapp || "",
          password: "",
          role: user.role || "user",
          isActive: user.isActive ?? true,
          balance: user.balance || 0,
          commissionBalance: user.commissionBalance || 0,
          gameLossCommission: user.gameLossCommission || 0,
          depositCommission: user.depositCommission || 0,
          referCommission: user.referCommission || 0,
          gameLossCommissionBalance: user.gameLossCommissionBalance || 0,
          depositCommissionBalance: user.depositCommissionBalance || 0,
          referCommissionBalance: user.referCommissionBalance || 0,
          referralCode: user.referralCode || "",
          profileImage: null,
        });

        setImagePreview(user.profileImage || null);
        setOriginalImage(user.profileImage || null);
      } catch (err) {
        const msg = err.response?.data?.message || "Failed to load user data";
        setError(msg);
        toast.error(msg, {
          position: "top-right",
          autoClose: 4000,
          theme: "dark",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? Number(value)
            : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target.result);
        setFormData((prev) => ({ ...prev, profileImage: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return originalImage;

    setUploading(true);
    const form = new FormData();
    form.append("image", file);

    try {
      const res = await axios.post(baseURL_For_IMG_UPLOAD, form);
      toast.success("Image uploaded successfully!", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });
      return res.data.imageUrl;
    } catch (err) {
      const msg = err.response?.data?.message || "Image upload failed";
      toast.error(msg, {
        position: "top-right",
        autoClose: 5000,
        theme: "dark",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);

    try {
      let finalImageUrl = originalImage;

      if (formData.profileImage instanceof File) {
        finalImageUrl = await handleImageUpload(formData.profileImage);
        if (!finalImageUrl) {
          setSaving(false);
          return;
        }
      }

      const payload = {
        ...formData,
        profileImage: finalImageUrl,
      };

      if (!payload.password?.trim()) {
        delete payload.password;
      }

      await axios.put(`${API_URL}/api/users/${userId}`, payload);

      toast.success("Profile updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
      });

      onCancel(); // Close edit mode
    } catch (err) {
      console.error("Update error:", err);
      const msg = err.response?.data?.message || "Failed to update profile";
      toast.error(msg, {
        position: "top-right",
        autoClose: 5000,
        theme: "dark",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
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

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-950/70 to-rose-950/60 backdrop-blur-md border border-red-800/40 rounded-2xl p-8 sm:p-10 text-center shadow-2xl max-w-lg mx-auto">
        <FaExclamationTriangle className="text-6xl text-red-400 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
        <p className="text-red-300 text-base sm:text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950/20 to-black p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl shadow-2xl p-6 md:p-10"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center">
          Edit User Profile
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Username */}
            <div className="space-y-2">
              <label className="block text-emerald-300 font-medium">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-emerald-300 font-medium">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
            </div>

            {/* Whatsapp */}
            <div className="space-y-2">
              <label className="block text-emerald-300 font-medium">
                Whatsapp / Phone
              </label>
              <input
                type="text"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-emerald-300 font-medium">
                Password (leave blank to keep current)
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="New password (optional)"
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label className="block text-emerald-300 font-medium">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all cursor-pointer"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Active Status */}
            <div className="space-y-2">
              <label className="block text-emerald-300 font-medium">
                Active Status
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-6 h-6 accent-emerald-500 cursor-pointer"
                />
                <span
                  className={`font-semibold text-lg ${
                    formData.isActive ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {formData.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            {/* Balance & Commission Fields */}
            {[
              { label: "Balance", name: "balance" },
              { label: "Commission Balance", name: "commissionBalance" },
              { label: "Game Loss Commission", name: "gameLossCommission" },
              { label: "Deposit Commission", name: "depositCommission" },
              { label: "Refer Commission", name: "referCommission" },
              {
                label: "Game Loss Comm. Balance",
                name: "gameLossCommissionBalance",
              },
              {
                label: "Deposit Comm. Balance",
                name: "depositCommissionBalance",
              },
              { label: "Refer Comm. Balance", name: "referCommissionBalance" },
              { label: "Referral Code", name: "referralCode" },
            ].map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="block text-emerald-300 font-medium">
                  {field.label}
                </label>
                <input
                  type={field.name === "referralCode" ? "text" : "number"}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  min={
                    field.name.includes("Commission") ||
                    field.name === "balance"
                      ? "0"
                      : undefined
                  }
                  step="0.01"
                  className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                />
              </div>
            ))}

            {/* Profile Image */}
            <div className="space-y-3 md:col-span-2 lg:col-span-1">
              <label className="block text-emerald-300 font-medium">
                Profile Image
              </label>
              <div className="flex flex-col items-center gap-4">
                {imagePreview && (
                  <div className="w-40 h-40 rounded-2xl overflow-hidden border-4 border-emerald-600/70 shadow-2xl">
                    <img
                      src={
                        imagePreview.startsWith("data:")
                          ? imagePreview
                          : `${baseURL_For_IMG_UPLOAD}s/${imagePreview}`
                      }
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={saving || uploading}
                  className="flex items-center gap-2 bg-emerald-700/50 hover:bg-emerald-600/70 text-emerald-100 px-6 py-3 rounded-xl border border-emerald-600/50 transition-all cursor-pointer disabled:opacity-50"
                >
                  <FaUpload />
                  {uploading ? "Uploading..." : "Change Image"}
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-6 mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={onCancel}
              disabled={saving || uploading}
              className="flex items-center gap-2 bg-rose-700/50 hover:bg-rose-600/70 text-white px-10 py-4 rounded-xl border border-rose-600/50 transition-all cursor-pointer font-semibold disabled:opacity-50 shadow-lg"
            >
              <FaTimes />
              Cancel
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={saving || uploading}
              className="flex items-center gap-2 bg-emerald-700/50 hover:bg-emerald-600/70 text-white px-10 py-4 rounded-xl border border-emerald-600/50 transition-all cursor-pointer font-semibold disabled:opacity-50 shadow-lg"
            >
              <FaSave />
              {saving ? "Saving..." : "Save Changes"}
            </motion.button>
          </div>
        </form>

        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </motion.div>
    </div>
  );
}
