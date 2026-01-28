// src/pages/WithdrawTransaction.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaEye,
  FaSync,
  FaFilter,
  FaChevronDown,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../utils/baseURL";
import { Loader2 } from "lucide-react";

export default function WithdrawTransaction() {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    status: "pending",
    reason: "",
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();
  const { filter } = useParams();

  // Handle URL filter params
  useEffect(() => {
    if (filter === "success") setFilterStatus("completed");
    else if (filter === "reject") setFilterStatus("failed");
    else if (["pending", "completed", "failed", "cancelled"].includes(filter)) {
      setFilterStatus(filter);
    } else {
      setFilterStatus("");
    }
  }, [filter]);

  // Fetch transactions
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Apply search & status filter
  useEffect(() => {
    let result = transactions;

    if (filterStatus) {
      result = result.filter((t) => t.status === filterStatus);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.userId?.username?.toLowerCase().includes(query) ||
          t.userId?.phone?.includes(query) ||
          t.userId?.email?.toLowerCase().includes(query)
      );
    }

    setFiltered(result);
  }, [transactions, filterStatus, searchQuery]);

  const fetchTransactions = async (query = "") => {
    setLoading(true);
    setError("");
    try {
      const url = query
        ? `${API_URL}/api/withdraw-search-transaction/search?query=${encodeURIComponent(query)}`
        : `${API_URL}/api/withdraw-transaction`;

      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!data.success) throw new Error(data.message || "Failed");

      const reversed = data.data.reverse();
      setTransactions(reversed);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load transactions");
      toast.error(err.response?.data?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error("Enter something to search");
      return;
    }
    fetchTransactions(searchQuery);
  };

  const handleRefresh = () => {
    setSearchQuery("");
    setFilterStatus("");
    setShowFilters(false);
    setError("");
    fetchTransactions();
  };

  const openModal = (txn) => {
    setEditId(txn._id);
    setFormData({
      amount: txn.amount,
      status: txn.status,
      reason: txn.reason || "",
    });
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (["failed", "cancelled"].includes(formData.status) && !formData.reason.trim()) {
      setError("Reason is required");
      toast.error("Reason is required for failed/cancelled status");
      return;
    }

    setLoading(true);
    try {
      await axios.put(`${API_URL}/api/withdraw-transaction/${editId}`, formData);
      setSuccess("Updated successfully!");
      toast.success("Transaction updated!");
      fetchTransactions();
      setTimeout(() => {
        setShowModal(false);
        setSuccess("");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;

    try {
      await axios.delete(`${API_URL}/api/withdraw-transaction/${id}`);
      setSuccess("Deleted!");
      toast.success("Transaction deleted!");
      fetchTransactions();
      setTimeout(() => setSuccess(""), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950/20 to-black p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Withdraw Transactions
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-700/60 hover:bg-emerald-600/70 text-white rounded-xl font-medium cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSync className={loading ? "animate-spin" : ""} />
              {loading ? "Loading..." : "Refresh"}
            </button>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium cursor-pointer transition-all"
            >
              <FaFilter />
              Filters
              <FaChevronDown className={showFilters ? "rotate-180" : ""} />
            </button>
          </div>
        </div>

        {/* Search & Filter (desktop always visible, mobile toggle) */}
        <div className={`${showFilters ? "block" : "hidden"} sm:block mb-6`}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <input
                type="text"
                placeholder="Search by name, phone, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
            </div>

            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Success</option>
                <option value="failed">Reject</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSearch}
                disabled={loading || !searchQuery.trim()}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-3 rounded-xl font-bold cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <FaSearch />
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
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

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-emerald-400 animate-spin" />
          </div>
        )}

        {/* Desktop Table */}
        {!loading && filtered.length > 0 && (
          <div className="hidden sm:block overflow-x-auto bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl shadow-2xl">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="bg-gradient-to-r from-emerald-950/80 to-gray-900/80 border-b border-emerald-800/50">
                  <th className="px-6 py-5 text-left text-emerald-300 font-semibold text-sm uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-5 text-left text-emerald-300 font-semibold text-sm uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-5 text-left text-emerald-300 font-semibold text-sm uppercase tracking-wider">
                    Channel
                  </th>
                  <th className="px-6 py-5 text-left text-emerald-300 font-semibold text-sm uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-5 text-left text-emerald-300 font-semibold text-sm uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-5 text-left text-emerald-300 font-semibold text-sm uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-5 text-left text-emerald-300 font-semibold text-sm uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr
                    key={t._id}
                    className="border-b border-emerald-900/40 hover:bg-emerald-950/40 transition-colors"
                  >
                    <td className="px-6 py-5">
                      <div className="font-medium text-white">
                        {t.userId?.username || "N/A"}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        {t.userId?.phoneNumber || ""}
                      </div>
                      {/* Show user inputs if any */}
                      {t.userInputs?.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {t.userInputs.map((input, idx) => (
                            <div key={idx}>
                              {input.label}: {input.value}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-5 text-gray-300">
                      {t.paymentMethod?.methodName || "—"}
                    </td>

                    <td className="px-6 py-5 text-gray-300">
                      {t.channel || "—"}
                    </td>

                    <td className="px-6 py-5">
                      <span className="text-xl font-bold text-emerald-300">
                        ৳{t.amount?.toLocaleString()}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                          t.status === "completed"
                            ? "bg-emerald-900/50 text-emerald-300"
                            : t.status === "pending"
                            ? "bg-amber-900/50 text-amber-300"
                            : t.status === "failed"
                            ? "bg-rose-900/50 text-rose-300"
                            : "bg-gray-800/50 text-gray-300"
                        }`}
                      >
                        {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-gray-300">
                      {t.reason ? t.reason.slice(0, 30) + "..." : "—"}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex gap-3">
                        <button
                          onClick={() => navigate(`/Withdraw-transaction/${t._id}`)}
                          className="bg-emerald-700/60 hover:bg-emerald-600/70 text-white px-4 py-2 rounded-xl text-sm cursor-pointer transition-all flex items-center gap-2"
                        >
                          <FaEye />
                          View
                        </button>

                        <button
                          onClick={() => openModal(t)}
                          disabled={t.status === "completed"}
                          className="bg-amber-700/60 hover:bg-amber-600/70 text-white px-4 py-2 rounded-xl text-sm cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <FaEdit />
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(t._id)}
                          disabled={t.status === "completed"}
                          className="bg-rose-700/60 hover:bg-rose-600/70 text-white px-4 py-2 rounded-xl text-sm cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <FaTrash />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile Cards */}
        {!loading &&
          filtered.map((t) => (
            <div
              key={t._id}
              className="sm:hidden bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-5 mb-4 shadow-xl"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {t.userId?.username || "N/A"}
                  </h3>
                  <p className="text-sm text-gray-400">{t.userId?.phoneNumber}</p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    t.status === "completed"
                      ? "bg-emerald-900/50 text-emerald-300"
                      : t.status === "pending"
                      ? "bg-amber-900/50 text-amber-300"
                      : t.status === "failed"
                      ? "bg-rose-900/50 text-rose-300"
                      : "bg-gray-800/50 text-gray-300"
                  }`}
                >
                  {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                </span>
              </div>

              <div className="space-y-3 text-gray-300">
                <div className="flex justify-between">
                  <span>Method:</span>
                  <span>{t.paymentMethod?.methodName || "—"}</span>
                </div>

                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-bold text-emerald-300">
                    ৳{t.amount?.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Channel:</span>
                  <span>{t.channel || "—"}</span>
                </div>

                {t.reason && (
                  <div>
                    <span className="block text-gray-400">Reason:</span>
                    <p className="text-sm">{t.reason}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-5 pt-4 border-t border-emerald-900/50">
                <button
                  onClick={() => navigate(`/Withdraw-transaction/${t._id}`)}
                  className="flex-1 bg-emerald-700/60 hover:bg-emerald-600/70 text-white py-2 rounded-xl text-sm cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  <FaEye size={14} />
                  View
                </button>

                <button
                  onClick={() => openModal(t)}
                  disabled={t.status === "completed"}
                  className="flex-1 bg-amber-700/60 hover:bg-amber-600/70 text-white py-2 rounded-xl text-sm cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <FaEdit size={14} />
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(t._id)}
                  disabled={t.status === "completed"}
                  className="flex-1 bg-rose-700/60 hover:bg-rose-600/70 text-white py-2 rounded-xl text-sm cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <FaTrash size={14} />
                  Delete
                </button>
              </div>
            </div>
          ))}

        {/* Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-lg border border-emerald-800/50 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Edit Transaction</h2>
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

              <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                  <label className="block text-emerald-300 font-medium mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    min="200"
                    max="30000"
                    required
                    className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-emerald-300 font-medium mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-emerald-300 font-medium mb-2">
                    Reason{" "}
                    {["failed", "cancelled"].includes(formData.status) && "(Required)"}
                  </label>
                  <textarea
                    rows="4"
                    value={formData.reason}
                    onChange={(e) =>
                      setFormData({ ...formData, reason: e.target.value })
                    }
                    required={["failed", "cancelled"].includes(formData.status)}
                    className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all resize-y"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-3 rounded-xl font-bold cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? "Updating..." : "Update Transaction"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-bold cursor-pointer transition-all border border-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
}