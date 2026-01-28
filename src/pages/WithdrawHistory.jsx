// src/pages/WithdrawHistory.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { format } from "date-fns";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { API_URL } from "../utils/baseURL";

export default function WithdrawHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/api/admin-withdraw/admin-all-history`,
      );
      setHistory(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load withdraw history");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return {
          bg: "bg-emerald-900/40",
          color: "text-emerald-300",
          border: "border-emerald-700/50",
          icon: <CheckCircle className="w-4 h-4" />,
          text: "Approved",
        };
      case "rejected":
        return {
          bg: "bg-rose-900/40",
          color: "text-rose-300",
          border: "border-rose-700/50",
          icon: <XCircle className="w-4 h-4" />,
          text: "Rejected",
        };
      case "pending":
        return {
          bg: "bg-amber-900/40",
          color: "text-amber-300",
          border: "border-amber-700/50",
          icon: <Clock className="w-4 h-4" />,
          text: "Pending",
        };
      default:
        return {
          bg: "bg-gray-800/40",
          color: "text-gray-300",
          border: "border-gray-700/50",
          icon: <AlertCircle className="w-4 h-4" />,
          text: "Unknown",
        };
    }
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
            All Withdraw History
          </h1>
          <p className="text-emerald-300/80 text-lg sm:text-xl">
            Complete history of all withdrawal requests from super affiliates
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-14 h-14 text-emerald-400 animate-spin" />
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-950/80 to-gray-900/80 border-b border-emerald-800/50">
                    <th className="px-6 py-5 text-left text-emerald-300 font-semibold text-sm uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-5 text-left text-emerald-300 font-semibold text-sm uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-5 text-left text-emerald-300 font-semibold text-sm uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-5 text-left text-emerald-300 font-semibold text-sm uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-5 text-left text-emerald-300 font-semibold text-sm uppercase tracking-wider">
                      Account
                    </th>
                    <th className="px-6 py-5 text-left text-emerald-300 font-semibold text-sm uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-5 text-left text-emerald-300 font-semibold text-sm uppercase tracking-wider">
                      Requested
                    </th>
                    <th className="px-6 py-5 text-left text-emerald-300 font-semibold text-sm uppercase tracking-wider">
                      Processed
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="py-20 text-center">
                        <div className="flex flex-col items-center gap-4 text-gray-400">
                          <Clock className="w-16 h-16 opacity-30" />
                          <h3 className="text-xl font-semibold">
                            No withdraw requests found
                          </h3>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    history.map((item) => {
                      const badge = getStatusBadge(item.status);
                      return (
                        <tr
                          key={item._id}
                          className="border-b border-emerald-900/40 hover:bg-emerald-950/40 transition-colors"
                        >
                          <td className="px-6 py-5">
                            <span
                              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.color} border ${badge.border}`}
                            >
                              {badge.icon}
                              {item.status.charAt(0).toUpperCase() +
                                item.status.slice(1)}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            <div>
                              <div className="font-medium text-white">
                                {item.requester?.username || "Unknown"}
                              </div>
                              <div className="text-sm text-gray-400 mt-1">
                                {item.requester?.phone || "N/A"}
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <div className="text-xl font-bold text-emerald-300">
                              ৳{item.amount?.toLocaleString()}
                            </div>
                          </td>

                          <td className="px-6 py-5 text-gray-300">
                            {item.method?.methodName || "Unknown"}
                          </td>

                          <td className="px-6 py-5 font-mono text-sm text-gray-300 break-all">
                            {item.accountNumber}
                          </td>

                          <td className="px-6 py-5">
                            <span className="capitalize text-gray-300">
                              {item.paymentType || "—"}
                            </span>
                          </td>

                          <td className="px-6 py-5 text-gray-400 text-sm">
                            {format(new Date(item.createdAt), "dd MMM yyyy")}
                            <br />
                            <span className="text-gray-500">
                              {format(new Date(item.createdAt), "hh:mm a")}
                            </span>
                          </td>

                          <td className="px-6 py-5 text-gray-400 text-sm">
                            {item.updatedAt && item.status !== "pending" ? (
                              <>
                                {format(
                                  new Date(item.updatedAt),
                                  "dd MMM yyyy",
                                )}
                                <br />
                                <span className="text-gray-500">
                                  {format(new Date(item.updatedAt), "hh:mm a")}
                                </span>
                              </>
                            ) : (
                              "—"
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
}
