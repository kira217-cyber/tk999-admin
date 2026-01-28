// src/pages/MasterAffiliate.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaToggleOn,
  FaToggleOff,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaDollarSign,
  FaEdit,
  FaCogs,
  FaPlus,
  FaSpinner,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { API_URL } from "../utils/baseURL";

export default function MasterAffiliate() {
  const [users, setUsers] = useState([]);
  const [superAffiliates, setSuperAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // View/Edit Modal
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewUser, setViewUser] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // Commission Modal
  const [commissionModalOpen, setCommissionModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [commissionForm, setCommissionForm] = useState({
    gameLossCommission: 0,
    depositCommission: 0,
    referCommission: 0,
  });

  // Create Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    username: "",
    email: "",
    password: "",
    whatsapp: "",
    gameLossCommission: "",
    depositCommission: "",
    referCommission: "",
    referredBy: "",
  });
  const [showCreatePassword, setShowCreatePassword] = useState(false);

  const fetchMasterAffiliates = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/master-affiliates`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to load master affiliates");
      }
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuperAffiliates = async () => {
    try {
      const res = await fetch(`${API_URL}/api/super-affiliates`);
      if (!res.ok) throw new Error("Failed to load super affiliates");
      const data = await res.json();
      setSuperAffiliates(data.users || []);
    } catch (err) {
      console.error("Failed to load Super Affiliates for dropdown");
    }
  };

  useEffect(() => {
    fetchMasterAffiliates();
    fetchSuperAffiliates();
  }, []);

  const handleToggleClick = (user) => {
    const isActive = user.isActive ?? false;
    if (isActive) {
      if (window.confirm("Deactivate this master affiliate?")) {
        deactivateUser(user._id);
      }
    } else {
      setSelectedUser(user);
      setCommissionForm({
        gameLossCommission: user.gameLossCommission || 0,
        depositCommission: user.depositCommission || 0,
        referCommission: user.referCommission || 0,
      });
      setCommissionModalOpen(true);
    }
  };

  const deactivateUser = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/api/deactivate-user/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Deactivate failed");
      toast.success("User deactivated!");
      fetchMasterAffiliates();
    } catch (err) {
      toast.error(err.message || "Deactivate failed");
    }
  };

  const handleCommissionSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${API_URL}/api/approve-user/${selectedUser._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(commissionForm),
        },
      );
      if (!res.ok) throw new Error("Update failed");
      toast.success("User activated & commission updated!");
      setCommissionModalOpen(false);
      setSelectedUser(null);
      fetchMasterAffiliates();
    } catch (err) {
      toast.error(err.message || "Update failed");
    }
  };

  const handleViewUser = (user) => {
    setViewUser(user);
    setPasswordForm({ username: user.username, password: "" });
    setShowPassword(false);
    setViewModalOpen(true);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordForm.password) {
      toast.error("Password is required!");
      return;
    }
    try {
      const res = await fetch(
        `${API_URL}/api/update-master-affiliate-credentials/${viewUser._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: passwordForm.username,
            password: passwordForm.password,
          }),
        },
      );
      if (!res.ok) throw new Error("Update failed");
      toast.success("Credentials updated!");
      setViewModalOpen(false);
      fetchMasterAffiliates();
    } catch (err) {
      toast.error(err.message || "Update failed");
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (
      !createForm.username ||
      !createForm.email ||
      !createForm.password ||
      !createForm.whatsapp ||
      !createForm.referredBy
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/create/master-affiliates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: createForm.username,
          email: createForm.email,
          password: createForm.password,
          whatsapp: createForm.whatsapp,
          gameLossCommission: Number(createForm.gameLossCommission) || 0,
          depositCommission: Number(createForm.depositCommission) || 0,
          referCommission: Number(createForm.referCommission) || 0,
          referredBy: createForm.referredBy,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Creation failed");

      toast.success("Master Affiliate created successfully!");
      setCreateModalOpen(false);
      setCreateForm({
        username: "",
        email: "",
        password: "",
        whatsapp: "",
        gameLossCommission: "",
        depositCommission: "",
        referCommission: "",
        referredBy: "",
      });
      fetchMasterAffiliates();
    } catch (err) {
      toast.error(err.message || "Failed to create user");
    }
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05 } }),
  };

  const modalVariants = {
    hidden: { scale: 0.85, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950/30 to-black flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-red-950/70 to-rose-950/60 backdrop-blur-md border border-red-800/50 rounded-2xl p-8 max-w-lg text-center shadow-2xl">
          <FaExclamationTriangle className="text-6xl text-red-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-red-300 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950/20 to-black p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
            Master Affiliate Users
          </h1>
          <p className="text-emerald-300/80 text-lg sm:text-xl">
            Manage your master affiliates with ease
          </p>
        </div>

        {/* Create Button */}
        <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white px-5 sm:px-6 py-3 sm:py-4 rounded-full font-bold shadow-2xl cursor-pointer"
          >
            <FaPlus className="text-xl" />
            Create Master Affiliate
          </motion.button>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-xl">
            No Master Affiliates found
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto rounded-2xl border border-emerald-800/40 bg-gray-900/40 backdrop-blur-md shadow-2xl mb-10">
              <table className="w-full min-w-[1000px] text-left">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-950/80 to-gray-900/80 border-b border-emerald-800/50">
                    <th className="px-6 py-5 text-emerald-300 font-semibold cursor-default">
                      Username
                    </th>
                    <th className="px-6 py-5 text-emerald-300 font-semibold cursor-default">
                      Email
                    </th>
                    <th className="px-6 py-5 text-emerald-300 font-semibold cursor-default">
                      WhatsApp
                    </th>
                    <th className="px-6 py-5 text-emerald-300 font-semibold cursor-default">
                      Balance
                    </th>
                    <th className="px-6 py-5 text-emerald-300 font-semibold cursor-default">
                      Status
                    </th>
                    <th className="px-6 py-5 text-emerald-300 font-semibold cursor-default">
                      Toggle
                    </th>
                    <th className="px-6 py-5 text-emerald-300 font-semibold cursor-default">
                      Edit
                    </th>
                    <th className="px-6 py-5 text-emerald-300 font-semibold cursor-default">
                      Commission
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, idx) => {
                    const isActive = user.isActive ?? false;
                    return (
                      <motion.tr
                        key={user._id}
                        custom={idx}
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        className="border-b border-emerald-900/40 hover:bg-emerald-950/40 transition-colors cursor-pointer group"
                      >
                        <td className="px-6 py-5 text-gray-200 font-medium group-hover:text-emerald-300 transition-colors">
                          {user.username}
                        </td>
                        <td className="px-6 py-5 text-gray-300 break-all">
                          {user.email}
                        </td>
                        <td className="px-6 py-5 text-gray-300">
                          {user.whatsapp}
                        </td>
                        <td className="px-6 py-5 text-emerald-400 font-bold">
                          ৳{user.balance || 0}
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span
                            className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${
                              isActive
                                ? "bg-emerald-700/50 text-emerald-200 border border-emerald-600/50"
                                : "bg-rose-700/50 text-rose-200 border border-rose-600/50"
                            }`}
                          >
                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <button
                            onClick={() => handleToggleClick(user)}
                            className="text-3xl text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer p-2 rounded-full hover:bg-emerald-950/50"
                          >
                            {isActive ? <FaToggleOn /> : <FaToggleOff />}
                          </button>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <button
                            onClick={() => handleViewUser(user)}
                            className="text-emerald-400 hover:text-emerald-300 text-2xl transition-colors cursor-pointer p-2 rounded-full hover:bg-emerald-950/50"
                          >
                            <FaEdit />
                          </button>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <button
                            onClick={() => handleToggleClick(user)}
                            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white px-5 py-2 rounded-xl font-medium shadow-lg cursor-pointer transition-all hover:shadow-xl"
                          >
                            Edit Commission
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-5 mt-6">
              {users.map((user, idx) => {
                const isActive = user.isActive ?? false;
                return (
                  <motion.div
                    key={user._id}
                    custom={idx}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-5 shadow-xl cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                          {user.username}
                        </h3>
                        <p className="text-emerald-400 text-sm mt-1">
                          ৳{user.balance || 0}
                        </p>
                      </div>
                      <span
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                          isActive
                            ? "bg-emerald-700/50 text-emerald-200 border border-emerald-600/50"
                            : "bg-rose-700/50 text-rose-200 border border-rose-600/50"
                        }`}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-5 text-gray-300">
                      <div>
                        <p className="text-gray-400">Email</p>
                        <p className="break-all">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">WhatsApp</p>
                        <p>{user.whatsapp}</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => handleToggleClick(user)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium cursor-pointer transition-all ${
                          isActive
                            ? "bg-rose-700/60 hover:bg-rose-600/70 text-white"
                            : "bg-emerald-700/60 hover:bg-emerald-600/70 text-white"
                        }`}
                      >
                        {isActive ? <FaToggleOn /> : <FaToggleOff />}
                        {isActive ? "Deactivate" : "Activate"}
                      </button>

                      <button
                        onClick={() => handleViewUser(user)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-800/70 hover:bg-gray-700/70 text-emerald-300 rounded-xl font-medium border border-emerald-700/50 cursor-pointer transition-all"
                      >
                        <FaEdit />
                        Edit
                      </button>

                      <button
                       onClick={() => handleToggleClick(user)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-xl font-medium cursor-pointer transition-all"
                      >
                        <FaCogs />
                        Commission
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Create Modal - Scrollable on Mobile */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-lg border border-emerald-800/50 rounded-2xl p-6 sm:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl my-4"
          >
            <h3 className="text-2xl font-bold text-white mb-6 text-center sticky top-0 bg-gradient-to-br from-gray-800/95 to-gray-900/95 z-10 py-2">
              Create Master Affiliate
            </h3>

            <form onSubmit={handleCreateSubmit} className="space-y-5">
              <div>
                <label className="block text-emerald-300 font-medium mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  value={createForm.username}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, username: e.target.value })
                  }
                  required
                  className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 cursor-text"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={createForm.email}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, email: e.target.value })
                  }
                  required
                  className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 cursor-text"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-medium mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showCreatePassword ? "text" : "password"}
                    value={createForm.password}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, password: e.target.value })
                    }
                    required
                    className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 cursor-text pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCreatePassword(!showCreatePassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-300 cursor-pointer"
                  >
                    {showCreatePassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-emerald-300 font-medium mb-2">
                  WhatsApp *
                </label>
                <input
                  type="text"
                  value={createForm.whatsapp}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, whatsapp: e.target.value })
                  }
                  required
                  className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 cursor-text"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-medium mb-2">
                  Referred By (Super Affiliate) *
                </label>
                <select
                  value={createForm.referredBy}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, referredBy: e.target.value })
                  }
                  required
                  className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
                >
                  <option value="">Select Super Affiliate</option>
                  {superAffiliates.map((sa) => (
                    <option key={sa._id} value={sa._id}>
                      {sa.username} ({sa.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-emerald-300 font-medium mb-2">
                    Game Loss (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={createForm.gameLossCommission}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        gameLossCommission: e.target.value,
                      })
                    }
                    className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 cursor-text"
                  />
                </div>
                <div>
                  <label className="block text-emerald-300 font-medium mb-2">
                    Deposit (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={createForm.depositCommission}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        depositCommission: e.target.value,
                      })
                    }
                    className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 cursor-text"
                  />
                </div>
                <div>
                  <label className="block text-emerald-300 font-medium mb-2">
                    Refer (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={createForm.referCommission}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        referCommission: e.target.value,
                      })
                    }
                    className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 cursor-text"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8 sticky bottom-0 bg-gradient-to-t from-gray-900/95 to-transparent pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white py-3 rounded-xl font-bold cursor-pointer transition-all shadow-lg"
                >
                  Create Master Affiliate
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCreateModalOpen(false);
                    setCreateForm({
                      username: "",
                      email: "",
                      password: "",
                      whatsapp: "",
                      gameLossCommission: "",
                      depositCommission: "",
                      referCommission: "",
                      referredBy: "",
                    });
                  }}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-bold cursor-pointer transition-all border border-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Edit/View Modal */}
      {viewModalOpen && viewUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Edit: {viewUser.username}
            </h3>

            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div>
                <label className="block text-emerald-300 font-medium mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={passwordForm.username}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      username: e.target.value,
                    })
                  }
                  required
                  className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 cursor-text"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-medium mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordForm.password}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        password: e.target.value,
                      })
                    }
                    placeholder="Leave blank to keep current"
                    className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 cursor-text pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-300 cursor-pointer"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-3 rounded-xl font-bold cursor-pointer transition-all shadow-lg"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setViewModalOpen(false);
                    setViewUser(null);
                    setPasswordForm({ username: "", password: "" });
                  }}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-bold cursor-pointer transition-all border border-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Commission Modal */}
      {commissionModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              {selectedUser.isActive ? "Update" : "Set"} Commission:{" "}
              {selectedUser.username}
            </h3>

            <form onSubmit={handleCommissionSubmit} className="space-y-5">
              <div>
                <label className="block text-emerald-300 font-medium mb-2">
                  Game Loss Commission (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={commissionForm.gameLossCommission}
                  onChange={(e) =>
                    setCommissionForm({
                      ...commissionForm,
                      gameLossCommission: Number(e.target.value),
                    })
                  }
                  min="0"
                  className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 cursor-text"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-medium mb-2">
                  Deposit Commission (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={commissionForm.depositCommission}
                  onChange={(e) =>
                    setCommissionForm({
                      ...commissionForm,
                      depositCommission: Number(e.target.value),
                    })
                  }
                  min="0"
                  className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 cursor-text"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-medium mb-2">
                  Refer Commission (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={commissionForm.referCommission}
                  onChange={(e) =>
                    setCommissionForm({
                      ...commissionForm,
                      referCommission: Number(e.target.value),
                    })
                  }
                  min="0"
                  className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 cursor-text"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-3 rounded-xl font-bold cursor-pointer transition-all shadow-lg"
                >
                  {selectedUser.isActive
                    ? "Update Commission"
                    : "Update & Activate"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCommissionModalOpen(false);
                    setSelectedUser(null);
                  }}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-bold cursor-pointer transition-all border border-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
