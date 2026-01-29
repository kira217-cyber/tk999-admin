// src/pages/DepositBonus.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loader2 } from "lucide-react";
import { API_URL } from "../utils/baseURL";

export default function DepositBonus() {
  const [promotions, setPromotions] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialForm = {
    payment_methods: [],
    promotion_bonuses: [],
  };

  const [formData, setFormData] = useState(initialForm);

  // Fetch Data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [bonusRes, methodRes] = await Promise.all([
        axios.get(`${API_URL}/api/deposit-bonus`),
        axios.get(`${API_URL}/api/deposit-payment-method/methods`),
      ]);
      setPromotions(bonusRes.data.data || []);
      setPaymentMethods(methodRes.data.data || []);
    } catch (err) {
      toast.error("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Payment Method Selection
  const handleMethodChange = (methodId) => {
    setFormData((prev) => {
      const isSelected = prev.payment_methods.includes(methodId);
      const newMethods = isSelected
        ? prev.payment_methods.filter((id) => id !== methodId)
        : [...prev.payment_methods, methodId];

      const newBonuses = newMethods.map((id) => {
        const existing = prev.promotion_bonuses.find(
          (b) => b.payment_method === id,
        );
        return (
          existing || {
            payment_method: id,
            bonus_type: "Fix",
            bonus: 0,
            turnover_multiplier: 0, // ← changed field name + default
          }
        );
      });

      return { payment_methods: newMethods, promotion_bonuses: newBonuses };
    });
  };

  // Handle Bonus / Turnover Change
  const handleBonusChange = (methodId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      promotion_bonuses: prev.promotion_bonuses.map((b) =>
        b.payment_method === methodId
          ? {
              ...b,
              [field]:
                field === "bonus" || field === "turnover_multiplier"
                  ? Number(value) || 0
                  : value,
            }
          : b,
      ),
    }));
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.payment_methods.length === 0) {
      toast.error("Select at least one payment method");
      return;
    }
    setSubmitting(true);
    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/deposit-bonus/${editingId}`, formData);
        toast.success("Deposit bonus updated successfully!");
      } else {
        await axios.post(`${API_URL}/api/deposit-bonus`, formData);
        toast.success("Deposit bonus created successfully!");
      }
      fetchData();
      setFormData(initialForm);
      setEditingId(null);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  // Edit
  const handleEdit = (bonus) => {
    setEditingId(bonus._id);
    setFormData({
      payment_methods: bonus.payment_methods.map((m) => m._id || m),
      promotion_bonuses: bonus.promotion_bonuses.map((b) => ({
        payment_method: b.payment_method._id || b.payment_method,
        bonus_type: b.bonus_type,
        bonus: b.bonus,
        turnover_multiplier: b.turnover_multiplier || 0, // ← updated field name
      })),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this deposit bonus permanently?")) return;
    try {
      await axios.delete(`${API_URL}/api/deposit-bonus/${id}`);
      toast.success("Deposit bonus deleted!");
      fetchData();
    } catch (err) {
      toast.error("Delete failed!");
    }
  };

  // Cancel Edit
  const cancelEdit = () => {
    setEditingId(null);
    setFormData(initialForm);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950/20 to-black p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Deposit Bonus Management
          </h1>
          <p className="text-emerald-300/80 text-lg sm:text-xl">
            Configure bonuses & turnover requirements (× times)
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl mb-12"
        >
          <h2 className="text-2xl font-bold text-emerald-300 mb-8 flex items-center gap-3">
            {editingId ? "Edit Deposit Bonus" : "Create New Deposit Bonus"}
          </h2>

          {/* Payment Methods Selection */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-white mb-4">
              Select Payment Methods
            </h3>
            {paymentMethods.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                No payment methods found. Add some first.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paymentMethods.map((method) => (
                  <label
                    key={method._id}
                    className="flex items-center gap-3 p-4 bg-gray-900/50 border border-emerald-800/50 rounded-xl cursor-pointer hover:bg-gray-900/70 transition-all"
                  >
                    <input
                      type="checkbox"
                      checked={formData.payment_methods.includes(method._id)}
                      onChange={() => handleMethodChange(method._id)}
                      className="w-5 h-5 accent-emerald-500 cursor-pointer"
                    />
                    <span className="text-gray-200 font-medium">
                      {method.methodName}{" "}
                      {method.methodNameBD && `(${method.methodNameBD})`}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Bonus & Turnover Configuration */}
          {formData.payment_methods.length > 0 && (
            <div className="mb-10">
              <h3 className="text-xl font-bold text-white mb-4">
                Bonus & Turnover Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {formData.payment_methods.map((methodId) => {
                  const method = paymentMethods.find((m) => m._id === methodId);
                  const bonusObj = formData.promotion_bonuses.find(
                    (b) => b.payment_method === methodId,
                  ) || {
                    bonus_type: "Fix",
                    bonus: 0,
                    turnover_multiplier: 0,
                  };

                  return (
                    <div
                      key={methodId}
                      className="bg-gray-900/50 border border-emerald-800/50 rounded-xl p-6"
                    >
                      <h4 className="text-lg font-bold text-emerald-300 mb-4">
                        {method?.methodName || "Unknown"} Bonus
                      </h4>

                      <select
                        value={bonusObj.bonus_type}
                        onChange={(e) =>
                          handleBonusChange(
                            methodId,
                            "bonus_type",
                            e.target.value,
                          )
                        }
                        className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 cursor-pointer mb-4"
                      >
                        <option value="Fix">Fixed Amount</option>
                        <option value="Percentage">Percentage (%)</option>
                      </select>

                      <input
                        type="number"
                        value={bonusObj.bonus}
                        onChange={(e) =>
                          handleBonusChange(methodId, "bonus", e.target.value)
                        }
                        placeholder="Enter bonus value"
                        min="0"
                        required
                        className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all mb-4"
                      />

                      <input
                        type="number"
                        value={bonusObj.turnover_multiplier}
                        onChange={(e) =>
                          handleBonusChange(
                            methodId,
                            "turnover_multiplier",
                            e.target.value,
                          )
                        }
                        placeholder="Turnover requirement (×)"
                        min="0"
                        step="0.1"
                        className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Required turnover: {bonusObj.turnover_multiplier || 0}×
                        deposit amount
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={submitting || loading}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-4 rounded-xl font-bold cursor-pointer transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
              {submitting
                ? "Saving..."
                : editingId
                  ? "Update Bonus"
                  : "Create Bonus"}
            </motion.button>

            {editingId && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={cancelEdit}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-4 rounded-xl font-bold cursor-pointer transition-all border border-gray-600"
              >
                Cancel
              </motion.button>
            )}
          </div>
        </motion.form>

        {/* Existing Promotions */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-emerald-400 animate-spin" />
          </div>
        ) : promotions.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-xl">
            No deposit bonuses created yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map((bonus) => (
              <motion.div
                key={bonus._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all group"
              >
                <h3 className="text-lg font-bold text-emerald-300 mb-4">
                  Deposit Bonus Configuration
                </h3>
                <div className="space-y-3 text-gray-300 mb-6">
                  <div>
                    <span className="text-emerald-400 font-medium">
                      Methods:
                    </span>{" "}
                    {bonus.payment_methods
                      .map((m) => m.methodName || m._id)
                      .join(" • ")}
                  </div>
                  <div>
                    <span className="text-emerald-400 font-medium">
                      Bonuses:
                    </span>{" "}
                    {bonus.promotion_bonuses
                      .map(
                        (b) =>
                          `${b.payment_method?.methodName || "Unknown"}: ${b.bonus} ${
                            b.bonus_type === "Percentage" ? "%" : "৳"
                          } (${b.bonus_type}) • Turnover: ${b.turnover_multiplier || 0}×`,
                      )
                      .join(" | ")}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(bonus)}
                    className="flex-1 bg-emerald-700/60 hover:bg-emerald-600/70 text-white py-3 rounded-xl font-medium cursor-pointer transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(bonus._id)}
                    className="flex-1 bg-rose-700/60 hover:bg-rose-600/70 text-white py-3 rounded-xl font-medium cursor-pointer transition-all"
                  >
                    Delete
                  </button>
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
