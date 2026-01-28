import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaEye,
  FaSpinner,
  FaExclamationTriangle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { API_URL } from "../utils/baseURL";

export default function AllUser() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    axios
      .get(`${API_URL}/api/users`)
      .then((res) => {
        setUsers(res.data.users || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to load users");
        setLoading(false);
      });
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.username
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase().trim());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && user.isActive) ||
      (statusFilter === "inactive" && !user.isActive);
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05 } }),
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950/30 to-black p-4 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-red-950/70 to-rose-950/60 backdrop-blur-md border border-red-800/40 rounded-2xl p-8 max-w-lg text-center shadow-2xl"
        >
          <FaExclamationTriangle className="text-6xl text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-3">Error</h2>
          <p className="text-red-300 text-lg">{error}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950/20 to-black p-4 md:p-6 pb-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
          All Users
        </h1>
        <p className="text-emerald-200/80 mt-2 text-lg">
          Manage and monitor all registered users
        </p>
      </motion.div>

      {/* Filters + Stats */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-6xl"
      >
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400/70 text-xl" />
            <input
              type="text"
              placeholder="Search by username..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // reset to page 1 on search
              }}
              className="w-full bg-gray-800/70 backdrop-blur-sm border border-emerald-800/50 rounded-xl pl-12 pr-5 py-3.5 text-white text-base placeholder:text-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all cursor-text"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-gray-800/70 backdrop-blur-sm border border-emerald-800/50 rounded-xl px-5 py-3.5 text-white text-base focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all cursor-pointer min-w-[200px]"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Deactive</option>
          </select>
        </div>

        {/* Showing results info */}
        <div className="text-emerald-300/90 text-base font-medium">
          Showing {filteredUsers.length} users
        </div>
      </motion.div>

      {/* No results */}
      {filteredUsers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 text-gray-300"
        >
          <p className="text-2xl font-semibold">No users found</p>
          <p className="mt-3 text-lg">
            Try adjusting your search or status filter
          </p>
        </motion.div>
      )}

      {/* Desktop Table */}
      {filteredUsers.length > 0 && (
        <div className="hidden lg:block overflow-x-auto rounded-xl border border-emerald-800/30 bg-gray-900/50 backdrop-blur-sm shadow-2xl mb-8">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="bg-gradient-to-r from-emerald-950/80 to-gray-900/80 border-b border-emerald-800/50">
                <th className="px-7 py-5 font-semibold text-emerald-300 text-lg">
                  Username
                </th>
                <th className="px-7 py-5 font-semibold text-emerald-300 text-lg">
                  Phone
                </th>
                <th className="px-7 py-5 font-semibold text-emerald-300 text-lg">
                  Balance
                </th>
                <th className="px-7 py-5 font-semibold text-emerald-300 text-lg">
                  Status
                </th>
                <th className="px-7 py-5 font-semibold text-emerald-300 text-lg text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((user, idx) => (
                <motion.tr
                  key={user._id}
                  custom={idx}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  className="border-b border-emerald-900/40 hover:bg-emerald-950/40 transition-colors group cursor-pointer"
                  onClick={() => navigate(`/user/${user._id}`)}
                >
                  <td className="px-7 py-5 text-gray-100 text-base group-hover:text-emerald-300 transition-colors font-medium">
                    {user.username || "—"}
                  </td>
                  <td className="px-7 py-5 text-gray-200 text-base">
                    {user.whatsapp || user.phoneNumber || "—"}
                  </td>
                  <td className="px-7 py-5 text-emerald-400 text-base font-semibold">
                    {user.balance !== undefined ? user.balance.toFixed(2) : "—"}
                  </td>
                  <td className="px-7 py-5">
                    <span
                      className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${
                        user.isActive
                          ? "bg-emerald-600/30 text-emerald-200 border border-emerald-500/40"
                          : "bg-rose-600/30 text-rose-200 border border-rose-500/40"
                      }`}
                    >
                      {user.isActive ? "Active" : "Deactive"}
                    </span>
                  </td>
                  <td className="px-7 py-5 text-right">
                    <button
                      className="text-emerald-400 hover:text-emerald-300 text-xl p-3 rounded-lg hover:bg-emerald-950/60 transition-all cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/user/${user._id}`);
                      }}
                    >
                      <FaEye />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mobile / Tablet Cards */}
      {filteredUsers.length > 0 && (
        <div className="lg:hidden space-y-5 mt-6">
          {currentItems.map((user, idx) => (
            <motion.div
              key={user._id}
              custom={idx}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-md border border-emerald-800/40 rounded-2xl p-6 shadow-xl cursor-pointer group"
              onClick={() => navigate(`/user/${user._id}`)}
            >
              <div className="flex justify-between items-start mb-5">
                <div>
                  <p className="text-emerald-400 text-base font-medium">
                    Username
                  </p>
                  <p className="text-white text-lg font-semibold">
                    {user.username || "—"}
                  </p>
                </div>
                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                    user.isActive
                      ? "bg-emerald-600/40 text-emerald-200"
                      : "bg-rose-600/40 text-rose-200"
                  }`}
                >
                  {user.isActive ? "Active" : "Deactive"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-5 text-base mb-6">
                <div>
                  <p className="text-gray-400">Phone</p>
                  <p className="text-gray-100">
                    {user.whatsapp || user.phoneNumber || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Balance</p>
                  <p className="text-emerald-400 font-semibold">
                    {user.balance !== undefined ? user.balance.toFixed(2) : "—"}
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  className="flex items-center gap-2.5 bg-emerald-700/30 hover:bg-emerald-600/50 text-emerald-200 px-5 py-2.5 rounded-lg transition-all cursor-pointer text-base"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/user/${user._id}`);
                  }}
                >
                  <FaEye />
                  <span>View Details</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {filteredUsers.length > 0 && totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-between items-center mt-10 gap-4 text-emerald-300"
        >
          <div className="text-base">
            Showing {indexOfFirstItem + 1} – {Math.min(indexOfLastItem, filteredUsers.length)} of{" "}
            {filteredUsers.length}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-3 rounded-lg bg-gray-800/70 border border-emerald-800/50 hover:bg-emerald-900/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <FaChevronLeft />
            </button>

            <span className="px-4 py-2 text-base font-medium">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-3 rounded-lg bg-gray-800/70 border border-emerald-800/50 hover:bg-emerald-900/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <FaChevronRight />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}