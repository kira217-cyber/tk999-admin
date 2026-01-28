// src/pages/WithdrawRequest.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../utils/baseURL";

export default function WithdrawRequest() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [processedRequests, setProcessedRequests] = useState({});

  const adminId = localStorage.getItem("userId");

  const fetchRequests = async () => {
    if (!adminId) return;

    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/admin-withdraw/requests`);
      setRequests(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err.response || err);
      toast.error(err.response?.data?.msg || "Failed to load withdraw requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminId) {
      fetchRequests();
      const interval = setInterval(fetchRequests, 10000);
      return () => clearInterval(interval);
    }
  }, [adminId]);

  // Auto-remove processed cards after 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setProcessedRequests((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((id) => {
          if (now - updated[id].timestamp > 60000) delete updated[id];
        });
        return updated;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (requestId) => {
    setProcessingId(requestId);
    try {
      await axios.put(`${API_URL}/api/admin-withdraw/approve/${requestId}`);

      setRequests((prev) =>
        prev.map((r) => (r._id === requestId ? { ...r, status: "approved" } : r))
      );

      setProcessedRequests((prev) => ({
        ...prev,
        [requestId]: { status: "approved", timestamp: Date.now() },
      }));

      toast.success("Withdrawal approved successfully!");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Approve failed");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId) => {
    setProcessingId(requestId);
    try {
      await axios.put(`${API_URL}/api/admin-withdraw/reject/${requestId}`);

      setRequests((prev) =>
        prev.map((r) => (r._id === requestId ? { ...r, status: "rejected" } : r))
      );

      setProcessedRequests((prev) => ({
        ...prev,
        [requestId]: { status: "rejected", timestamp: Date.now() },
      }));

      toast.error("Withdrawal rejected – amount refunded");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Reject failed");
    } finally {
      setProcessingId(null);
    }
  };

  const getMethodIcon = (method) => {
    if (!method) return <Smartphone className="w-10 h-10 text-emerald-400" />;
    if (method.methodIcon) {
      return (
        <img
          src={`${API_URL}${method.methodIcon}`}
          alt={method.methodName}
          className="w-12 h-12 object-contain rounded-lg border border-emerald-700/50"
        />
      );
    }
    const name = (method.methodName || "").toLowerCase();
    if (name.includes("bkash") || name.includes("nagad") || name.includes("rocket"))
      return <Smartphone className="w-10 h-10 text-emerald-400" />;
    if (name.includes("bank")) return <Building2 className="w-10 h-10 text-teal-400" />;
    return <Smartphone className="w-10 h-10 text-gray-400" />;
  };

  const getStatusBadge = (status, reqId) => {
    const processed = processedRequests[reqId];
    const currentStatus = processed?.status || status;

    if (currentStatus === "pending")
      return {
        icon: <Clock className="w-4 h-4" />,
        bg: "bg-amber-900/40",
        color: "text-amber-300",
        text: "Pending",
      };
    if (currentStatus === "approved")
      return {
        icon: <CheckCircle className="w-4 h-4" />,
        bg: "bg-emerald-900/40",
        color: "text-emerald-300",
        text: "Approved",
      };
    if (currentStatus === "rejected")
      return {
        icon: <XCircle className="w-4 h-4" />,
        bg: "bg-rose-900/40",
        color: "text-rose-300",
        text: "Rejected",
      };
    return {
      icon: <Clock className="w-4 h-4" />,
      bg: "bg-gray-800/40",
      color: "text-gray-300",
      text: "Unknown",
    };
  };

  const displayedRequests = requests.filter((req) => {
    if (req.status === "pending") return true;
    const processed = processedRequests[req._id];
    return processed && Date.now() - processed.timestamp <= 60000;
  });

  if (!adminId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-2xl">
        Please Login as Admin
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950/20 to-black p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Withdraw Requests
          </h1>
          <p className="text-emerald-300/80 text-lg sm:text-xl">
            Review and process Super-Affiliate withdrawals
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-14 h-14 text-emerald-400 animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {displayedRequests.map((req, i) => {
                  const status = getStatusBadge(req.status, req._id);
                  const isProcessed = !!processedRequests[req._id];

                  return (
                    <motion.div
                      key={req._id}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: i * 0.08 }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className={`bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all relative overflow-hidden ${
                        isProcessed ? "ring-2 ring-emerald-500/50" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between mb-5">
                        <div className="flex items-center gap-4">
                          {getMethodIcon(req.methodId)}
                          <div>
                            <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                              {req.methodId?.methodName || "Unknown Method"}
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">
                              {req.requesterId?.username || "Unknown User"}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.color}`}
                        >
                          {status.icon} {status.text}
                        </span>
                      </div>

                      <div className="space-y-4 text-gray-300">
                        <div className="flex justify-between items-center">
                          <span>Amount:</span>
                          <span className="text-xl font-bold text-emerald-300">
                            ৳{req.amount?.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span>Account:</span>
                          <span className="font-mono text-sm break-all">
                            {req.accountNumber}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span>Type:</span>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              req.paymentType === "personal"
                                ? "bg-blue-900/50 text-blue-300"
                                : req.paymentType === "agent"
                                ? "bg-emerald-900/50 text-emerald-300"
                                : "bg-purple-900/50 text-purple-300"
                            }`}
                          >
                            {req.paymentType?.toUpperCase() || "N/A"}
                          </span>
                        </div>
                      </div>

                      {req.status === "pending" && (
                        <div className="flex gap-4 mt-6 pt-5 border-t border-emerald-900/50">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleApprove(req._id)}
                            disabled={processingId === req._id}
                            className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-3 rounded-xl font-bold cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            {processingId === req._id ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <CheckCircle className="w-5 h-5" />
                            )}
                            Approve
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => handleReject(req._id)}
                            disabled={processingId === req._id}
                            className="flex-1 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white py-3 rounded-xl font-bold cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            {processingId === req._id ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <XCircle className="w-5 h-5" />
                            )}
                            Reject
                          </motion.button>
                        </div>
                      )}

                      {isProcessed && (
                        <p className="text-center mt-4 text-sm text-emerald-400/70">
                          This request will disappear in 1 minute
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {displayedRequests.length === 0 && (
              <div className="text-center py-20">
                <div className="bg-gray-800/50 backdrop-blur rounded-3xl p-12 max-w-lg mx-auto border border-emerald-800/50">
                  <div className="bg-emerald-900/30 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <AlertCircle size={48} className="text-emerald-400/60" />
                  </div>
                  <p className="text-white text-2xl font-bold mb-3">No Pending Requests</p>
                  <p className="text-gray-400 text-lg">
                    All withdrawal requests will appear here automatically
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
}