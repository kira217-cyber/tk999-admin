import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMoneyBill,
  FaEdit,
  FaUserShield,
  FaChartLine,
  FaSpinner,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaGamepad,
  FaArrowLeft,
} from "react-icons/fa";
import UserDetailsEditProfile from "../components/userDetailsEditProfile/userDetailsEditProfile.jsx"; // adjust path
import { baseURL_For_IMG_UPLOAD, API_URL } from "../utils/baseURL";

export default function UserDetails() {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setError("No user ID in URL");
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get(`${API_URL}/api/users/${userId}`)
      .then((res) => {
        setUserInfo(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to load user data");
        setLoading(false);
      });
  }, [userId]);

  const handleEditProfile = () => setIsEditing(true);
  const handleCancelEdit = () => setIsEditing(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950/30 to-black flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-red-950/70 to-rose-950/60 backdrop-blur-md border border-red-800/50 rounded-2xl p-8 sm:p-10 max-w-lg text-center shadow-2xl"
        >
          <FaExclamationTriangle className="text-6xl text-red-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-red-300 text-base sm:text-lg">{error}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950/20 to-black p-4 sm:p-6 md:p-8">
      <motion.div
        variants={containerVariants}
        className="max-w-7xl mx-auto"
      >
        {/* Back Button + Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-emerald-300 hover:text-emerald-200 transition-colors cursor-pointer text-lg font-medium"
          >
            <FaArrowLeft className="text-xl" />
            Back
          </motion.button>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 w-full sm:w-auto">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
                <FaChartLine className="text-emerald-400" />
                User Dashboard
              </h1>
              <p className="text-emerald-300/80 mt-1 text-base sm:text-lg">
                {userInfo?.username ? userInfo.username : "User Profile"}
              </p>
            </div>

            {!isEditing && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleEditProfile}
                className="flex items-center justify-center gap-2 bg-emerald-700/50 hover:bg-emerald-600/70 text-emerald-100 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl border border-emerald-600/50 transition-all cursor-pointer font-medium shadow-lg w-full sm:w-auto"
              >
                <FaEdit className="text-lg" />
                Edit Profile
              </motion.button>
            )}
          </div>
        </div>

        {isEditing ? (
          <UserDetailsEditProfile onCancel={handleCancelEdit} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 sm:gap-6">
            {/* Sidebar - Quick Stats */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-1 space-y-5 sm:space-y-6"
            >
              {/* Profile Image */}
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-5 sm:p-6 shadow-2xl text-center">
                <p className="text-emerald-400 text-sm font-medium mb-3 sm:mb-4">Profile</p>
                <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-full overflow-hidden border-4 border-emerald-600/70 shadow-xl">
                  {userInfo?.profileImage ? (
                    <img
                      src={`${baseURL_For_IMG_UPLOAD}s/${userInfo.profileImage}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => (e.target.src = "https://cdn-icons-png.freepik.com/512/8532/8532963.png")}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <FaUser className="text-4xl sm:text-5xl text-emerald-500/70" />
                    </div>
                  )}
                </div>
                <p className="mt-4 text-xl sm:text-2xl font-bold text-white">
                  {userInfo?.username || "—"}
                </p>
              </div>

              {/* Balance */}
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-5 sm:p-6 shadow-2xl text-center">
                <p className="text-emerald-400 text-sm font-medium mb-2">Balance</p>
                <p className="text-3xl sm:text-4xl font-bold text-emerald-300">
                  {userInfo?.balance?.toFixed(2) ?? "0.00"}
                </p>
              </div>

              {/* Status */}
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-5 sm:p-6 shadow-2xl text-center">
                <p className="text-emerald-400 text-sm font-medium mb-3">Status</p>
                <span
                  className={`inline-block px-6 sm:px-8 py-2 rounded-full text-sm sm:text-base font-semibold ${
                    userInfo?.isActive
                      ? "bg-emerald-700/50 text-emerald-100 border border-emerald-600/50"
                      : "bg-rose-700/50 text-rose-100 border border-rose-600/50"
                  }`}
                >
                  {userInfo?.isActive ? "Active" : "Deactive"}
                </span>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div variants={itemVariants} className="lg:col-span-3 space-y-6 sm:space-y-8">
              {/* Personal Information */}
              <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-md border border-emerald-800/40 rounded-2xl p-5 sm:p-6 md:p-8 shadow-2xl">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-5 sm:mb-6 flex items-center gap-3">
                  <FaUser className="text-emerald-400" /> Personal Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {[
                    { icon: FaUser, label: "ID", value: userInfo?._id ?? "—" },
                    { icon: FaUser, label: "Username", value: userInfo?.username ?? "—" },
                    { icon: FaEnvelope, label: "Email", value: userInfo?.email ?? "—" },
                    { icon: FaPhone, label: "Phone / WhatsApp", value: userInfo?.whatsapp ?? "—" },
                    { icon: FaUserShield, label: "Role", value: userInfo?.role ?? "—" },
                    {
                      icon: FaUserShield,
                      label: "Status",
                      value: userInfo?.isActive ? "Active" : "Inactive",
                    },
                    { icon: FaUser, label: "Referral Code", value: userInfo?.referralCode ?? "—" },
                    {
                      icon: FaUser,
                      label: "Referred By",
                      value: userInfo?.referredBy ?? "—",
                    },
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      variants={itemVariants}
                      className="flex items-center gap-3 sm:gap-4 bg-gray-900/50 p-4 sm:p-5 rounded-xl border border-emerald-900/40 hover:border-emerald-600/60 transition-all group"
                    >
                      <div className="p-3 rounded-xl bg-emerald-900/40 text-emerald-400">
                        <item.icon className="text-xl sm:text-2xl" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-400 font-medium">{item.label}</p>
                        <p className="text-sm sm:text-base md:text-lg text-gray-100 font-semibold break-all">
                          {item.value}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Financial & Commissions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-md border border-emerald-800/40 rounded-2xl p-5 sm:p-6 md:p-8 shadow-2xl">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-5 sm:mb-6 flex items-center gap-3">
                    <FaMoneyBill className="text-emerald-400" /> Financial
                  </h2>
                  <div className="space-y-5 sm:space-y-6">
                    <div className="flex justify-between items-center py-3 sm:py-4 border-b border-emerald-900/50">
                      <span className="text-gray-300 text-base sm:text-lg">Main Balance</span>
                      <span className="text-xl sm:text-2xl font-bold text-emerald-300">
                        {userInfo?.balance?.toFixed(2) ?? "0.00"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 sm:py-4">
                      <span className="text-gray-300 text-base sm:text-lg">Commission Balance</span>
                      <span className="text-xl sm:text-2xl font-bold text-emerald-300">
                        {userInfo?.commissionBalance?.toFixed(2) ?? "0.00"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-md border border-emerald-800/40 rounded-2xl p-5 sm:p-6 md:p-8 shadow-2xl">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-5 sm:mb-6 flex items-center gap-3">
                    <FaMoneyBill className="text-emerald-400" /> Commissions
                  </h2>
                  <div className="grid grid-cols-2 gap-4 sm:gap-5">
                    {[
                      ["Game Loss", userInfo?.gameLossCommission],
                      ["Deposit", userInfo?.depositCommission],
                      ["Referral", userInfo?.referCommission],
                      ["Game Loss Bal.", userInfo?.gameLossCommissionBalance],
                      ["Deposit Bal.", userInfo?.depositCommissionBalance],
                      ["Refer Bal.", userInfo?.referCommissionBalance],
                    ].map(([label, val], idx) => (
                      <div key={idx} className="bg-gray-900/50 p-4 sm:p-5 rounded-xl border border-emerald-900/40">
                        <p className="text-xs sm:text-sm text-gray-400">{label}</p>
                        <p className="text-base sm:text-lg md:text-xl font-bold text-emerald-300 mt-1 sm:mt-2">
                          {Number(val ?? 0).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Activity */}
              <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-md border border-emerald-800/40 rounded-2xl p-5 sm:p-6 md:p-8 shadow-2xl">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-5 sm:mb-6 flex items-center gap-3">
                  <FaCalendarAlt className="text-emerald-400" /> Activity
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                  <div className="bg-gray-900/50 p-5 sm:p-6 rounded-xl border border-emerald-900/40">
                    <p className="text-sm sm:text-base text-gray-400">Created At</p>
                    <p className="text-base sm:text-lg text-gray-100 mt-2 font-medium">
                      {userInfo?.createdAt ? new Date(userInfo.createdAt).toLocaleString() : "—"}
                    </p>
                  </div>
                  <div className="bg-gray-900/50 p-5 sm:p-6 rounded-xl border border-emerald-900/40">
                    <p className="text-sm sm:text-base text-gray-400">Updated At</p>
                    <p className="text-base sm:text-lg text-gray-100 mt-2 font-medium">
                      {userInfo?.updatedAt ? new Date(userInfo.updatedAt).toLocaleString() : "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Game History */}
              <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-md border border-emerald-800/40 rounded-2xl p-5 sm:p-6 shadow-2xl overflow-hidden">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-5 sm:mb-6 flex items-center gap-3">
                  <FaGamepad className="text-emerald-400" /> Game History
                </h2>

                {(userInfo?.gameHistory?.length ?? 0) > 0 ? (
                  <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full min-w-[800px] sm:min-w-[900px] text-left">
                      <thead>
                        <tr className="bg-emerald-950/70 border-b border-emerald-800/60">
                          <th className="px-4 sm:px-6 py-3 sm:py-4 text-emerald-300 font-medium text-sm sm:text-base">Provider</th>
                          <th className="px-4 sm:px-6 py-3 sm:py-4 text-emerald-300 font-medium text-sm sm:text-base">Game</th>
                          <th className="px-4 sm:px-6 py-3 sm:py-4 text-emerald-300 font-medium text-sm sm:text-base">Bet Type</th>
                          <th className="px-4 sm:px-6 py-3 sm:py-4 text-emerald-300 font-medium text-sm sm:text-base">Amount</th>
                          <th className="px-4 sm:px-6 py-3 sm:py-4 text-emerald-300 font-medium text-sm sm:text-base">Tx ID</th>
                          <th className="px-4 sm:px-6 py-3 sm:py-4 text-emerald-300 font-medium text-sm sm:text-base">Status</th>
                          <th className="px-4 sm:px-6 py-3 sm:py-4 text-emerald-300 font-medium text-sm sm:text-base">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userInfo.gameHistory.map((h, i) => (
                          <tr
                            key={i}
                            className="border-b border-emerald-900/50 hover:bg-emerald-950/40 transition-colors"
                          >
                            <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-200 text-sm sm:text-base">{h?.provider_code || "—"}</td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-200 text-sm sm:text-base">{h?.game_code || "—"}</td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-200 text-sm sm:text-base">{h?.bet_type || "—"}</td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 text-emerald-400 font-medium text-sm sm:text-base">
                              {h?.amount || "—"}
                            </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-300 break-all text-sm sm:text-base">
                              {h?.transaction_id || "—"}
                            </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4">
                              <span
                                className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium ${
                                  h?.status?.toLowerCase() === "win"
                                    ? "bg-emerald-700/40 text-emerald-200"
                                    : h?.status?.toLowerCase() === "loss"
                                    ? "bg-rose-700/40 text-rose-200"
                                    : "bg-gray-700/40 text-gray-200"
                                }`}
                              >
                                {h?.status || "—"}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-400 text-xs sm:text-sm">
                              {h?.createdAt ? new Date(h.createdAt).toLocaleString() : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 sm:py-16 text-gray-400 text-lg sm:text-xl">
                    No game history available
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}