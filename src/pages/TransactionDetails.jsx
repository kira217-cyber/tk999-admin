// src/pages/TransactionDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaArrowLeft,
  FaSync,
  FaEdit,
  FaChevronDown,
  FaUser,
  FaCreditCard,
  FaMoneyBillWave,
  FaGift,
  FaClock,
  FaFile,
  FaExclamation,
  FaPhoneAlt,
  FaEnvelope,
  FaSpinner,
} from "react-icons/fa";
import { API_URL, baseURL_For_IMG_UPLOAD } from "../utils/baseURL";

export default function TransactionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    amount: "",
    status: "pending",
    reason: "",
  });

  const fetchTransaction = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${API_URL}/api/deposit/deposit-transaction/${id}`,
      );

      if (response.data.success && response.data.data) {
        const data = response.data.data;
        setTransaction(data);
        setFormData({
          amount: data.amount || "",
          status: data.status || "pending",
          reason: data.reason || "",
        });
      } else {
        throw new Error("No transaction data received from server");
      }
    } catch (err) {
      console.error("Fetch Error:", err.response || err);
      const message =
        err.response?.data?.message ||
        `Failed to fetch transaction details (ID: ${id}). Please check the transaction ID or try again.`;
      setError(message);
      toast.error(message);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, [id, navigate]);

  const openEditModal = () => {
    setShowModal(true);
    setError("");
    setSuccess("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || "" : value,
      ...(name === "status" && !["failed", "cancelled"].includes(value)
        ? { reason: "" }
        : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      ["failed", "cancelled"].includes(formData.status) &&
      !formData.reason.trim()
    ) {
      setError("Reason is required for Failed or Cancelled status");
      toast.error("Reason is required");
      return;
    }

    if (!formData.amount || formData.amount < 200 || formData.amount > 30000) {
      setError("Amount must be between ৳200 and ৳30,000");
      toast.error("Amount must be between ৳200 and ৳30,000");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `${API_URL}/api/deposit/deposit-transaction/${id}`,
        formData,
      );

      if (response.data.success) {
        setSuccess("Transaction updated successfully");
        toast.success("Transaction updated successfully!");
        await fetchTransaction();
        setTimeout(() => {
          setShowModal(false);
          setSuccess("");
        }, 1500);
      } else {
        throw new Error(response.data.message || "Update failed");
      }
    } catch (err) {
      console.error("Update Error:", err.response || err);
      const msg = err.response?.data?.message || "Failed to update transaction";
      setError(msg);
      toast.error(msg);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !transaction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950/20 to-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <FaSpinner className="w-16 h-16 text-emerald-400 animate-spin" />
          <p className="text-emerald-300 text-lg font-medium">
            Loading Transaction ID: {id}
          </p>
        </div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950/20 to-black p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-rose-800/50 rounded-2xl p-8 shadow-2xl text-center">
          <h1 className="text-3xl font-bold text-white mb-6">
            Transaction Details
          </h1>
          <div className="bg-rose-900/40 border border-rose-700/50 text-rose-300 px-6 py-8 rounded-xl">
            {error || "Transaction not found"}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button
              onClick={() => navigate("/deposit-transaction")}
              className="bg-emerald-700/60 hover:bg-emerald-600/70 text-white px-8 py-3 rounded-xl font-medium cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <FaArrowLeft /> Back to List
            </button>

            <button
              onClick={fetchTransaction}
              className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-xl font-medium cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <FaSync /> Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950/20 to-black p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Deposit Transaction Details
          </h1>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/deposit-transaction")}
              className="bg-emerald-700/60 hover:bg-emerald-600/70 text-white px-6 py-3 rounded-xl font-medium cursor-pointer transition-all flex items-center gap-2"
            >
              <FaArrowLeft /> Back
            </button>

            <button
              onClick={fetchTransaction}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium cursor-pointer transition-all flex items-center gap-2"
            >
              <FaSync /> Refresh
            </button>

            <button
              onClick={openEditModal}
              disabled={transaction.status !== "pending"}
              className="bg-amber-700/60 hover:bg-amber-600/70 text-white px-6 py-3 rounded-xl font-medium cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <FaEdit /> Edit Status
            </button>

            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="sm:hidden bg-emerald-700/60 hover:bg-emerald-600/70 text-white px-6 py-3 rounded-xl font-medium cursor-pointer transition-all flex items-center gap-2"
            >
              User Info{" "}
              <FaChevronDown className={showSidebar ? "rotate-180" : ""} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - User Info */}
          <div
            className={`${showSidebar ? "block" : "hidden"} lg:block lg:col-span-1`}
          >
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-emerald-300 mb-6 flex items-center gap-2">
                <FaUser /> User Information
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    Username
                  </label>
                  <p className="text-white font-medium">
                    {transaction.userId?.username || "N/A"}
                  </p>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    Phone / WhatsApp
                  </label>
                  <p className="text-white font-medium flex items-center gap-2">
                    <FaPhoneAlt className="text-emerald-400" />
                    {transaction.userId?.whatsapp ||
                      transaction.userId?.phone ||
                      "N/A"}
                  </p>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    Email
                  </label>
                  <p className="text-white font-medium flex items-center gap-2">
                    <FaEnvelope className="text-emerald-400" />
                    {transaction.userId?.email || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Transaction Info */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-emerald-300 mb-6 flex items-center gap-2">
                <FaMoneyBillWave /> Transaction Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-900/50 rounded-xl p-5 border border-emerald-900/50">
                  <div className="text-sm text-gray-400 mb-1">Status</div>
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                      transaction.status === "completed"
                        ? "bg-emerald-900/50 text-emerald-300"
                        : transaction.status === "pending"
                          ? "bg-amber-900/50 text-amber-300"
                          : transaction.status === "failed"
                            ? "bg-rose-900/50 text-rose-300"
                            : "bg-gray-800/50 text-gray-300"
                    }`}
                  >
                    {transaction.status.charAt(0).toUpperCase() +
                      transaction.status.slice(1)}
                  </span>
                </div>

                <div className="bg-gray-900/50 rounded-xl p-5 border border-emerald-900/50">
                  <div className="text-sm text-gray-400 mb-1">Amount</div>
                  <div className="text-2xl font-bold text-emerald-300">
                    ৳{transaction.amount?.toLocaleString()}
                  </div>
                </div>

                <div className="bg-gray-900/50 rounded-xl p-5 border border-emerald-900/50">
                  <div className="text-sm text-gray-400 mb-1">
                    Payment Method
                  </div>
                  <div className="text-white font-medium">
                    {transaction.paymentMethod?.methodName || "—"}
                  </div>
                </div>

                <div className="bg-gray-900/50 rounded-xl p-5 border border-emerald-900/50">
                  <div className="text-sm text-gray-400 mb-1">Channel</div>
                  <div className="text-white">{transaction.channel || "—"}</div>
                </div>

                <div className="bg-gray-900/50 rounded-xl p-5 border border-emerald-900/50">
                  <div className="text-sm text-gray-400 mb-1">Promotion</div>
                  <div className="text-white">
                    {transaction.promotionId?.title || "No Promotion"}
                  </div>
                </div>

                <div className="bg-gray-900/50 rounded-xl p-5 border border-emerald-900/50">
                  <div className="text-sm text-gray-400 mb-1">
                    Promotion Bonus
                  </div>
                  <div className="text-white">
                    {transaction.promotionBonus ? (
                      <>
                        {transaction.promotionBonus.bonus_type}:{" "}
                        {transaction.promotionBonus.bonus}{" "}
                        {transaction.promotionBonus.bonus_type === "Percentage"
                          ? "%"
                          : "৳"}
                      </>
                    ) : (
                      "No Bonus"
                    )}
                  </div>
                </div>

                <div className="bg-gray-900/50 rounded-xl p-5 border border-emerald-900/50 sm:col-span-2 lg:col-span-1">
                  <div className="text-sm text-gray-400 mb-1">Reason</div>
                  <div className="text-gray-300">
                    {transaction.reason || "—"}
                  </div>
                </div>
              </div>
            </div>

            {/* Total Amount */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-emerald-300 mb-6 flex items-center gap-2">
                <FaMoneyBillWave /> Total Amount
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gray-900/50 rounded-xl p-5 border border-emerald-900/50">
                  <div className="text-sm text-gray-400 mb-1">
                    Total (incl. bonus)
                  </div>
                  <div className="text-3xl font-bold text-emerald-300">
                    ৳
                    {(
                      transaction.amount +
                      (transaction.promotionBonus?.bonus || 0)
                    ).toLocaleString()}
                  </div>
                </div>

                <div className="bg-gray-900/50 rounded-xl p-5 border border-emerald-900/50">
                  <div className="text-sm text-gray-400 mb-1">Reason</div>
                  <div className="text-gray-300">
                    {transaction.reason || "—"}
                  </div>
                </div>
              </div>
            </div>

            {/* User Inputs */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-emerald-300 mb-6 flex items-center gap-2">
                <FaFile /> User Provided Inputs
              </h2>

              {transaction.userInputs?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {transaction.userInputs.map((input, index) => (
                    <div
                      key={index}
                      className="bg-gray-900/50 rounded-xl p-5 border border-emerald-900/50"
                    >
                      <div className="text-sm text-emerald-300 mb-2 font-medium">
                        {input.label}
                      </div>

                      {input.type === "file" ? (
                        <div className="mt-3">
                          <img
                            src={`${baseURL_For_IMG_UPLOAD}${input.value}`}
                            alt={input.label}
                            className="max-h-40 object-contain rounded-lg border border-emerald-700/50 shadow-md mx-auto"
                            onError={(e) => {
                              e.target.src = "/placeholder-image.png"; // fallback
                              e.target.alt = "Image failed to load";
                            }}
                          />
                        </div>
                      ) : (
                        <div className="text-white break-words">
                          {input.value}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  No additional inputs provided by user
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-xl font-bold text-emerald-300 mb-6 flex items-center gap-2">
                <FaClock /> Timeline
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gray-900/50 rounded-xl p-5 border border-emerald-900/50">
                  <div className="text-sm text-gray-400 mb-1">Created At</div>
                  <div className="text-white">
                    {new Date(transaction.createdAt).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </div>
                </div>

                <div className="bg-gray-900/50 rounded-xl p-5 border border-emerald-900/50">
                  <div className="text-sm text-gray-400 mb-1">Updated At</div>
                  <div className="text-white">
                    {transaction.updatedAt
                      ? new Date(transaction.updatedAt).toLocaleString(
                          "en-US",
                          {
                            dateStyle: "medium",
                            timeStyle: "short",
                          },
                        )
                      : "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Status Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-lg border border-emerald-800/50 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                Edit Transaction Status
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white text-3xl"
              >
                ×
              </button>
            </div>

            {error && (
              <div className="bg-rose-900/40 border border-rose-700/50 text-rose-300 px-6 py-4 rounded-xl mb-6">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-emerald-900/40 border border-emerald-700/50 text-emerald-300 px-6 py-4 rounded-xl mb-6">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-emerald-300 font-medium mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  min="200"
                  max="30000"
                  className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-medium mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {(formData.status === "failed" ||
                formData.status === "cancelled") && (
                <div>
                  <label className="block text-emerald-300 font-medium mb-2">
                    Reason (Required)
                  </label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    placeholder="Enter reason for rejection/cancellation"
                    required
                    rows="4"
                    className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all resize-y"
                  />
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-4 rounded-xl font-bold cursor-pointer transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Status"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-4 rounded-xl font-bold cursor-pointer transition-all border border-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
}
