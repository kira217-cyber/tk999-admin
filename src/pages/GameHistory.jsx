// src/pages/GameHistory.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSearch, FaSpinner } from "react-icons/fa";
import { API_URL } from "../utils/baseURL";

export default function GameHistory() {
  const [allHistory, setAllHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/users`);
        const users = res.data.users || [];

        // Aggregate game history from all users
        const historyEntries = [];
        users.forEach((user) => {
          if (user.gameHistory && Array.isArray(user.gameHistory)) {
            user.gameHistory.forEach((entry) => {
              historyEntries.push({
                username: user.username,
                ...entry,
                createdAt: new Date(entry.createdAt),
              });
            });
          }
        });

        // Sort by latest first
        historyEntries.sort((a, b) => b.createdAt - a.createdAt);

        setAllHistory(historyEntries);
        setFilteredHistory(historyEntries);
      } catch (err) {
        console.error("Failed to fetch game history:", err);
        toast.error("Failed to load game history");
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

  // Filter by username search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredHistory(allHistory);
      return;
    }

    const q = searchTerm.toLowerCase();
    const filtered = allHistory.filter((entry) =>
      entry.username?.toLowerCase().includes(q),
    );
    setFilteredHistory(filtered);
  }, [searchTerm, allHistory]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950/20 to-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <FaSpinner className="w-12 h-12 text-emerald-400 animate-spin" />
          <p className="text-emerald-300 text-lg font-medium">
            Loading Game History...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950/20 to-black p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Game History
          </h1>

          <div className="relative w-full sm:w-80">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl pl-12 pr-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
            />
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-8 text-center shadow-2xl">
            <p className="text-gray-300 text-xl">
              {searchTerm
                ? "No game history found for this username"
                : "No game history available yet"}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl shadow-2xl">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-950/80 to-gray-900/80 border-b border-emerald-800/50">
                    <th className="px-6 py-5 text-left text-emerald-300 font-semibold text-sm uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-5 text-left text-emerald-300 font-semibold text-sm uppercase tracking-wider">
                      Provider
                    </th>
                    <th className="px-6 py-5 text-left text-emerald-300 font-semibold text-sm uppercase tracking-wider">
                      Game Code
                    </th>
                    <th className="px-6 py-5 text-left text-emerald-300 font-semibold text-sm uppercase tracking-wider">
                      Bet Type
                    </th>
                    <th className="px-6 py-5 text-left text-emerald-300 font-semibold text-sm uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-5 text-left text-emerald-300 font-semibold text-sm uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th className="px-6 py-5 text-left text-emerald-300 font-semibold text-sm uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-5 text-left text-emerald-300 font-semibold text-sm uppercase tracking-wider">
                      Date & Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((entry) => (
                    <tr
                      key={entry._id}
                      className="border-b border-emerald-900/40 hover:bg-emerald-950/40 transition-colors"
                    >
                      <td className="px-6 py-5 text-white font-medium">
                        {entry.username}
                      </td>
                      <td className="px-6 py-5 text-gray-300">
                        {entry.provider_code || "—"}
                      </td>
                      <td className="px-6 py-5 text-gray-300">
                        {entry.game_code || "—"}
                      </td>
                      <td className="px-6 py-5 text-gray-300">
                        {entry.bet_type || "—"}
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-emerald-300 font-medium">
                          {entry.amount || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-gray-300">
                        {entry.transaction_id || "—"}
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                            entry.status === "won"
                              ? "bg-emerald-900/50 text-emerald-300"
                              : "bg-rose-900/50 text-rose-300"
                          }`}
                        >
                          {entry.status === "won" ? "Won" : "Lost"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-gray-300">
                        {formatDate(entry.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden space-y-4">
              {filteredHistory.map((entry) => (
                <motion.div
                  key={entry._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-5 shadow-xl"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-emerald-300">
                      {entry.username}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        entry.status === "won"
                          ? "bg-emerald-900/50 text-emerald-300"
                          : "bg-rose-900/50 text-rose-300"
                      }`}
                    >
                      {entry.status === "won" ? "Won" : "Lost"}
                    </span>
                  </div>

                  <div className="space-y-3 text-gray-300">
                    <div className="flex justify-between">
                      <span>Provider:</span>
                      <span>{entry.provider_code || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Game Code:</span>
                      <span>{entry.game_code || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bet Type:</span>
                      <span>{entry.bet_type || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span className="font-medium text-emerald-300">
                        {entry.amount || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Transaction ID:</span>
                      <span>{entry.transaction_id || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date & Time:</span>
                      <span>{formatDate(entry.createdAt)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
}
