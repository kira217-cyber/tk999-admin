// src/pages/AdminWithdrawMethods.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  X,
  Save,
  Loader2,
  Smartphone,
  Building2,
  User,
  Store,
  Trash2,
  Upload,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../utils/baseURL";

export default function AdminWithdrawMethods() {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    methodName: "",
    paymentTypes: "",
    minAmount: "",
    maxAmount: "",
    methodIcon: null,
  });

  // Fetch all methods
  const fetchMethods = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/admin-withdraw/methods`);
      setMethods(res.data || []);
    } catch (err) {
      toast.error("Failed to load withdraw methods");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, methodIcon: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setForm({
      methodName: "",
      paymentTypes: "",
      minAmount: "",
      maxAmount: "",
      methodIcon: null,
    });
    setPreview(null);
    setEditId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    resetForm();
  };

  const openEdit = (method) => {
    setForm({
      methodName: method.methodName,
      paymentTypes: method.paymentTypes.join(", "),
      minAmount: method.minAmount,
      maxAmount: method.maxAmount,
      methodIcon: null,
    });
    setPreview(method.methodIcon ? `${API_URL}${method.methodIcon}` : null);
    setEditId(method._id);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.append("methodName", form.methodName.trim());
    formData.append("paymentTypes", form.paymentTypes);
    formData.append("minAmount", form.minAmount);
    formData.append("maxAmount", form.maxAmount);
    if (form.methodIcon) formData.append("methodIcon", form.methodIcon);

    try {
      if (editId) {
        await axios.put(
          `${API_URL}/api/admin-withdraw/method/${editId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success("Method updated successfully");
      } else {
        await axios.post(
          `${API_URL}/api/admin-withdraw/method`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success("New method added");
      }
      fetchMethods();
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${API_URL}/api/admin-withdraw/method/${deleteId}`);
      toast.success("Method deleted");
      fetchMethods();
      setDeleteModal(false);
      setDeleteId(null);
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const getMethodIcon = (method) => {
    if (method.methodIcon) {
      return (
        <img
          src={`${API_URL}${method.methodIcon}`}
          alt={method.methodName}
          className="w-16 h-16 object-contain rounded-lg border border-emerald-700/50"
        />
      );
    }
    const name = method.methodName.toLowerCase();
    if (name.includes("bkash") || name.includes("nagad") || name.includes("rocket"))
      return <Smartphone className="w-8 h-8 text-emerald-400" />;
    if (name.includes("bank")) return <Building2 className="w-8 h-8 text-teal-400" />;
    return <Smartphone className="w-8 h-8 text-gray-400" />;
  };

  const getTypeChip = (type) => {
    const t = type.toLowerCase();
    if (t === "personal") return { icon: <User size={14} />, color: "bg-emerald-900/50 text-emerald-300" };
    if (t === "agent") return { icon: <Store size={14} />, color: "bg-teal-900/50 text-teal-300" };
    if (t === "merchant") return { icon: <Building2 size={14} />, color: "bg-purple-900/50 text-purple-300" };
    return { icon: <User size={14} />, color: "bg-gray-800/50 text-gray-300" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950/20 to-black p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Admin Withdraw Methods
          </h1>
          <p className="text-emerald-300/80 text-lg sm:text-xl">
            Manage global payment methods for withdrawals
          </p>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openModal}
          className="flex items-center justify-center gap-3 mx-auto mb-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-8 py-4 rounded-xl font-bold cursor-pointer transition-all shadow-2xl"
        >
          <Plus size={24} />
          Add New Method
        </motion.button>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-emerald-400 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {methods.map((method, i) => (
                <motion.div
                  key={method._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-4">
                      {getMethodIcon(method)}
                      <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {method.methodName}
                      </h3>
                    </div>

                    <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(method)}
                        className="bg-emerald-700/70 hover:bg-emerald-600/80 text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
                      >
                        <Edit2 size={18} />
                      </button>

                      <button
                        onClick={() => {
                          setDeleteId(method._id);
                          setDeleteModal(true);
                        }}
                        className="bg-rose-700/70 hover:bg-rose-600/80 text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 text-gray-300">
                    <div className="flex justify-between">
                      <span>Minimum:</span>
                      <span className="font-bold text-emerald-300">৳{method.minAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Maximum:</span>
                      <span className="font-bold text-emerald-300">৳{method.maxAmount}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {method.paymentTypes.map((type) => {
                        const chip = getTypeChip(type);
                        return (
                          <div
                            key={type}
                            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${chip.color}`}
                          >
                            {chip.icon}
                            {type}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Empty State */}
        {!loading && methods.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-gray-800/50 backdrop-blur rounded-3xl p-12 max-w-md mx-auto border border-emerald-800/50">
              <div className="bg-emerald-900/30 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Plus size={48} className="text-emerald-400/60" />
              </div>
              <p className="text-white/80 text-xl mb-3">No withdraw methods yet</p>
              <p className="text-gray-400 text-lg">Click the button above to add one</p>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-lg border border-emerald-800/50 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editId ? "Edit Withdraw Method" : "Add New Withdraw Method"}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white text-3xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-emerald-300 font-medium mb-2">
                    Method Name
                  </label>
                  <input
                    name="methodName"
                    type="text"
                    required
                    value={form.methodName}
                    onChange={handleChange}
                    placeholder="bKash, Nagad, Bank Transfer..."
                    className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-emerald-300 font-medium mb-2">
                    Payment Types (comma separated)
                  </label>
                  <input
                    name="paymentTypes"
                    type="text"
                    required
                    value={form.paymentTypes}
                    onChange={handleChange}
                    placeholder="personal, agent, merchant"
                    className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-emerald-300 font-medium mb-2">
                      Minimum Amount
                    </label>
                    <input
                      name="minAmount"
                      type="number"
                      required
                      value={form.minAmount}
                      onChange={handleChange}
                      placeholder="100"
                      className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-emerald-300 font-medium mb-2">
                      Maximum Amount
                    </label>
                    <input
                      name="maxAmount"
                      type="number"
                      required
                      value={form.maxAmount}
                      onChange={handleChange}
                      placeholder="50000"
                      className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-emerald-300 font-medium mb-2">
                    Method Icon (optional)
                  </label>
                  <div className="flex items-center gap-4">
                    {preview && (
                      <img
                        src={preview}
                        alt="preview"
                        className="w-16 h-16 object-contain rounded-lg border border-emerald-700/50"
                      />
                    )}
                    <label className="cursor-pointer">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <div className="flex items-center gap-2 px-5 py-3 bg-emerald-700/60 hover:bg-emerald-600/70 text-white rounded-xl transition-all">
                        <Upload size={18} />
                        Upload Icon
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-10">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-4 rounded-xl font-bold cursor-pointer transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {saving && <Loader2 className="animate-spin" size={20} />}
                    {saving ? "Saving..." : editId ? "Update Method" : "Save Method"}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-4 rounded-xl font-bold cursor-pointer transition-all border border-gray-600"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-lg border border-rose-800/50 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center"
            >
              <div className="mb-6">
                <div className="bg-rose-900/30 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                  <Trash2 size={40} className="text-rose-400" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">
                Delete Withdraw Method?
              </h3>
              <p className="text-gray-300 mb-8">
                This action cannot be undone. The method will be permanently removed.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setDeleteModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-bold cursor-pointer transition-all border border-gray-600"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex-1 bg-gradient-to-r from-rose-700 to-red-700 hover:from-rose-600 hover:to-red-600 text-white py-3 rounded-xl font-bold cursor-pointer transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {deleting && <Loader2 className="animate-spin" size={20} />}
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
}