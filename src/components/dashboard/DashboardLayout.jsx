import React, { useEffect, useState } from "react";
import {
  FaClock,
  FaGamepad,
  FaHourglass,
  FaMoneyBill,
  FaMoneyBillWave,
  FaMoneyCheck,
  FaMoneyCheckAlt,
  FaPlay,
  FaRobot,
  FaShieldAlt,
  FaStop,
  FaUserCheck,
  FaUserFriends,
  FaUserPlus,
  FaUsers,
  FaArrowUp,
  FaArrowDown,
  FaDollarSign,
  FaPercentage,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { API_URL, baseURL } from "../../utils/baseURL.js";
import axios from "axios";
import { motion } from "framer-motion";

export default function DashboardLayout() {
  const navigate = useNavigate();

  // User & Affiliate Counts
  const [allUserValue, setAllUserValue] = useState("Loading...");
  const [totalAffiliator, setTotalAffiliator] = useState("Loading...");

  // Deposit Stats
  const [totalDeposit, setTotalDeposit] = useState("Loading...");
  const [todayDeposit, setTodayDeposit] = useState("Loading...");
  const [pendingDepositTransactions, setPendingDepositTransactions] =
    useState("Loading...");

  // Withdraw Stats
  const [totalWithdraw, setTotalWithdraw] = useState("Loading...");
  const [todayWithdraw, setTodayWithdraw] = useState("Loading...");
  const [pendingWithdrawTransactions, setPendingWithdrawTransactions] =
    useState("Loading...");
  const [pendingAffiliates, setPendingAffiliates] = useState("Loading...");
  const [pendingWithdrawals, setPendingWithdrawals] = useState("Loading...");
  const [totalOpayDeposits, setTotalOpayDeposits] = useState("Loading...");
  const [todayOpayDeposits, setTodayOpayDeposits] = useState("Loading...");

  // Game Stats
  const [gameStats, setGameStats] = useState({
    totalGames: "0",
    hotGames: "0",
    lobbyGames: "0",
    newGames: "0",
  });

  // Format currency function
  const formatCurrency = (value) => {
    if (value === "Loading..." || value === "Error") return value;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(parseFloat(value));
  };

  // Format number function
  const formatNumber = (value) => {
    if (value === "Loading..." || value === "Error") return value;
    return new Intl.NumberFormat("en-US").format(parseFloat(value));
  };

  // Fetch User & Affiliate Counts
  useEffect(() => {
    const fetchUserCounts = async () => {
      try {
        const [userRes, affiliateRes] = await Promise.all([
          axios.get(`${API_URL}/api/count-users`),
          axios.get(`${API_URL}/api/count-affiliates`),
        ]);

        setAllUserValue(userRes.data.success ? userRes.data.count : "Error");
        setTotalAffiliator(
          affiliateRes.data.success ? affiliateRes.data.count : "Error",
        );
      } catch (err) {
        console.error(err);
        setAllUserValue("Error");
        setTotalAffiliator("Error");
      }
    };
    fetchUserCounts();
  }, []);

  // Fetch Deposit Stats
  useEffect(() => {
    const fetchDepositStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/deposit/stats`);

        if (res.data.success) {
          const d = res.data.data;
          setTotalDeposit(d.totalDeposit);
          setTodayDeposit(d.todayDeposit);
          setPendingDepositTransactions(d.pendingDepositRequests);
        } else {
          throw new Error("Failed");
        }
      } catch (err) {
        console.error(err);
        setTotalDeposit("Error");
        setTodayDeposit("Error");
        setPendingDepositTransactions("Error");
      }
    };

    fetchDepositStats();
  }, []);

  // Fetch Withdraw Stats
  useEffect(() => {
    const fetchWithdrawStats = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/withdraw-transaction/stats`,
        );

        if (res.data.success) {
          const w = res.data.data;
          setTotalWithdraw(w.totalWithdraw);
          setTodayWithdraw(w.todayWithdraw);
          setPendingWithdrawTransactions(w.pendingWithdrawRequests);
        } else {
          throw new Error("Failed");
        }
      } catch (err) {
        console.error(err);
        setTotalWithdraw("Error");
        setTodayWithdraw("Error");
        setPendingWithdrawTransactions("Error");
      }
    };

    fetchWithdrawStats();
  }, []);

  useEffect(() => {
    const fetchPendingAffiliates = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/pending-affiliates-count`);

        if (res.data.success) {
          setPendingAffiliates(res.data.totalPending);
        } else {
          setPendingAffiliates("Error");
        }
      } catch (err) {
        console.error(err);
        setPendingAffiliates("Error");
      }
    };

    fetchPendingAffiliates();
  }, []);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/admin-withdraw/pending-count`,
        );

        if (res.data.success) {
          setPendingWithdrawals(res.data.count);
        } else {
          setPendingWithdrawals("Error");
        }
      } catch (err) {
        console.error(err);
        setPendingWithdrawals("Error");
      }
    };

    fetchPending();
  }, []);

  // Fetch Game Statistics
  useEffect(() => {
    const fetchGameStats = async () => {
      try {
        const res = await axios.get(`${baseURL}/game-stats`);

        if (res.data.success) {
          const stats = res.data.data;
          setGameStats({
            totalGames: stats[0]?.value || "0",
            hotGames: stats[1]?.value || "0",
            lobbyGames: stats[2]?.value || "0",
            newGames: stats[3]?.value || "0",
          });
        } else {
          throw new Error("Failed to fetch game stats");
        }
      } catch (err) {
        console.error("Game stats fetch error:", err);
        setGameStats({
          totalGames: "Error",
          hotGames: "Error",
          lobbyGames: "Error",
          newGames: "Error",
        });
      }
    };

    fetchGameStats();
  }, []);

  useEffect(() => {
    const fetchOpayDeposit = async () => {
      try {
        const res = await axios.get(`${baseURL}/total-amount/opay`);

        if (res.data.success) {
          const stats = res.data;
          setTotalOpayDeposits(stats.totalAmount || "0");
        } else {
          throw new Error("Failed to fetch");
        }
      } catch (err) {
        console.error("Failed error:", err);
        setTotalOpayDeposits("Error");
      }
    };

    fetchOpayDeposit();
  }, []);

  useEffect(() => {
    const fetchOpayDepositToday = async () => {
      try {
        const res = await axios.get(`${baseURL}/today-total/opay`);

        if (res.data.success) {
          const stats = res.data;
          setTodayOpayDeposits(stats.totalAmount || "0");
        } else {
          throw new Error("Failed to fetch");
        }
      } catch (err) {
        console.error("Failed error:", err);
        setTodayOpayDeposits("Error");
      }
    };

    fetchOpayDepositToday();
  }, []);

  // Calculate percentage growth (example calculation)
  const calculateGrowth = (today, total) => {
    if (
      today === "Loading..." ||
      total === "Loading..." ||
      today === "Error" ||
      total === "Error"
    )
      return null;
    const todayNum = parseFloat(today);
    const totalNum = parseFloat(total);
    if (totalNum === 0) return { value: "100%", isPositive: true };
    const percentage = ((todayNum / totalNum) * 100).toFixed(1);
    return { value: `${percentage}%`, isPositive: parseFloat(percentage) >= 0 };
  };

  const handleCardClick = (route) => {
    navigate(route);
  };

  // Stat cards data
  const statCards = [
    // Row 1: User Statistics
    {
      title: "Total Users",
      value: formatNumber(allUserValue),
      icon: <FaUsers className="text-3xl" />,
      color: "from-emerald-500 to-green-500",
      iconBg: "bg-emerald-500/20",
      textColor: "text-emerald-400",
      route: "/all-user",
      growth: null,
    },
    {
      title: "Total Affiliators",
      value: formatNumber(totalAffiliator),
      icon: <FaUserFriends className="text-3xl" />,
      color: "from-cyan-500 to-blue-500",
      iconBg: "bg-cyan-500/20",
      textColor: "text-cyan-400",
      route: "/super-affiliate",
      growth: null,
    },
    {
      title: "Pending Affiliate Signups",
      value: formatNumber(pendingAffiliates),
      icon: <FaUserCheck className="text-3xl" />,
      color: "from-amber-500 to-orange-500",
      iconBg: "bg-amber-500/20",
      textColor: "text-amber-400",
      route: "/super-affiliate",
      growth: null,
    },
    {
      title: "Super Affiliate Withdrawals",
      value: formatNumber(pendingWithdrawals),
      icon: <FaShieldAlt className="text-3xl" />,
      color: "from-purple-500 to-pink-500",
      iconBg: "bg-purple-500/20",
      textColor: "text-purple-400",
      route: "/withdraw-request",
      growth: null,
    },

    // Row 2: Game Statistics
    {
      title: "Total Games",
      value: formatNumber(gameStats.totalGames),
      icon: <FaGamepad className="text-3xl" />,
      color: "from-violet-500 to-purple-500",
      iconBg: "bg-violet-500/20",
      textColor: "text-violet-400",
      route: "/game-control",
      growth: null,
    },
    {
      title: "Hot Games",
      value: formatNumber(gameStats.hotGames),
      icon: <FaPlay className="text-3xl" />,
      color: "from-red-500 to-rose-500",
      iconBg: "bg-red-500/20",
      textColor: "text-red-400",
      route: "/game-control",
      growth: null,
    },
    {
      title: "Lobby Games",
      value: formatNumber(gameStats.lobbyGames),
      icon: <FaStop className="text-3xl" />,
      color: "from-sky-500 to-cyan-500",
      iconBg: "bg-sky-500/20",
      textColor: "text-sky-400",
      route: "/game-control",
      growth: null,
    },
    {
      title: "New Games",
      value: formatNumber(gameStats.newGames),
      icon: <FaRobot className="text-3xl" />,
      color: "from-lime-500 to-emerald-500",
      iconBg: "bg-lime-500/20",
      textColor: "text-lime-400",
      route: "/game-control",
      growth: null,
    },

    // Row 3: Financial Statistics
    {
      title: "Total Deposit",
      value: formatCurrency(totalDeposit),
      icon: <FaMoneyCheck className="text-3xl" />,
      color: "from-green-500 to-emerald-500",
      iconBg: "bg-green-500/20",
      textColor: "text-green-400",
      route: "/deposit-transaction",
      growth: calculateGrowth(todayDeposit, totalDeposit),
    },
    {
      title: "Today's Deposit",
      value: formatCurrency(todayDeposit),
      icon: <FaMoneyCheckAlt className="text-3xl" />,
      color: "from-teal-500 to-cyan-500",
      iconBg: "bg-teal-500/20",
      textColor: "text-teal-400",
      route: "/deposit-transaction",
      growth: null,
    },
    {
      title: "Total Withdraw",
      value: formatCurrency(totalWithdraw),
      icon: <FaMoneyBill className="text-3xl" />,
      color: "from-blue-500 to-indigo-500",
      iconBg: "bg-blue-500/20",
      textColor: "text-blue-400",
      route: "/Withdraw-transaction",
      growth: calculateGrowth(todayWithdraw, totalWithdraw),
    },
    {
      title: "Today's Withdraw",
      value: formatCurrency(todayWithdraw),
      icon: <FaMoneyBillWave className="text-3xl" />,
      color: "from-indigo-500 to-purple-500",
      iconBg: "bg-indigo-500/20",
      textColor: "text-indigo-400",
      route: "/Withdraw-transaction",
      growth: null,
    },

    // Row 4: Pending & Opay Statistics
    {
      title: "Pending Deposit Requests",
      value: formatNumber(pendingDepositTransactions),
      icon: <FaClock className="text-3xl" />,
      color: "from-amber-500 to-yellow-500",
      iconBg: "bg-amber-500/20",
      textColor: "text-amber-400",
      route: "/deposit-transaction/filter/pending",
      growth: null,
    },
    {
      title: "Pending Withdraw Requests",
      value: formatNumber(pendingWithdrawTransactions),
      icon: <FaHourglass className="text-3xl" />,
      color: "from-orange-500 to-red-500",
      iconBg: "bg-orange-500/20",
      textColor: "text-orange-400",
      route: "/Withdraw-transaction/filter/pending",
      growth: null,
    },
    {
      title: "Total Opay Deposits",
      value: formatCurrency(totalOpayDeposits),
      icon: <FaDollarSign className="text-3xl" />,
      color: "from-emerald-600 to-green-600",
      iconBg: "bg-emerald-600/20",
      textColor: "text-emerald-500",
      route: "/opay/deposit",
      growth: calculateGrowth(todayOpayDeposits, totalOpayDeposits),
    },
    {
      title: "Today's Opay Deposits",
      value: formatCurrency(todayOpayDeposits),
      icon: <FaUserPlus className="text-3xl" />,
      color: "from-green-600 to-emerald-600",
      iconBg: "bg-green-600/20",
      textColor: "text-green-500",
      route: "/opay/deposit",
      growth: null,
    },
  ];

  // Group cards into rows of 4
  const cardRows = [];
  for (let i = 0; i < statCards.length; i += 4) {
    cardRows.push(statCards.slice(i, i + 4));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950/20 to-black p-4 md:p-6">
      {/* Header Section */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Dashboard Overview
        </h1>
        <p className="text-emerald-200/70">
          Welcome to your admin dashboard. Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="space-y-6">
        {cardRows.map((row, rowIndex) => (
          <motion.div
            key={rowIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: rowIndex * 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {row.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCardClick(stat.route)}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-5 md:p-6 border border-emerald-800/30 shadow-2xl hover:shadow-emerald-900/30 transition-all duration-300 cursor-pointer group relative overflow-hidden"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                <div className="relative z-10">
                  {/* Icon and Title Row */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl ${stat.iconBg} ${stat.textColor}`}
                    >
                      {stat.icon}
                    </div>

                    {/* Growth Indicator */}
                    {stat.growth && (
                      <div
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                          stat.growth.isPositive
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {stat.growth.isPositive ? (
                          <FaArrowUp className="text-xs" />
                        ) : (
                          <FaArrowDown className="text-xs" />
                        )}
                        <span>{stat.growth.value}</span>
                      </div>
                    )}
                  </div>

                  {/* Value */}
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {stat.value}
                  </h3>

                  {/* Title */}
                  <p className="text-gray-300 font-medium mb-1">{stat.title}</p>

                  {/* Description */}
                  <p className="text-gray-400 text-sm">
                    {stat.route === "/all-user" && "Total registered users"}
                    {stat.route === "/all-active-affiliator" &&
                      "Active affiliate partners"}
                    {stat.route === "/pending-affiliates" &&
                      "Awaiting approval"}
                    {stat.route === "/super-affiliate-withdrawals" &&
                      "Pending super affiliate withdrawals"}
                    {stat.route.includes("game") && "Various game categories"}
                    {stat.route.includes("deposit") &&
                      !stat.route.includes("opay") &&
                      "Financial transactions"}
                    {stat.route.includes("Withdraw") && "Withdrawal activities"}
                    {stat.route.includes("opay") && "Opay payment gateway"}
                    {stat.route.includes("pending") &&
                      "Requests awaiting action"}
                  </p>

                  {/* View Details Link */}
                  <div className="mt-4 pt-3 border-t border-emerald-800/30">
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-400 text-sm font-medium">
                        View Details
                      </span>
                      <div className={`p-1.5 rounded-lg ${stat.iconBg}`}>
                        <div
                          className={`w-5 h-5 rounded-full ${stat.textColor} flex items-center justify-center`}
                        >
                          →
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ))}
      </div>

      {/* Quick Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 md:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Summary Card 1 */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-emerald-800/30">
          <h3 className="text-lg font-semibold text-white mb-4">
            Financial Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Total Deposit</span>
              <span className="text-emerald-400 font-bold">
                {formatCurrency(totalDeposit)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Total Withdraw</span>
              <span className="text-blue-400 font-bold">
                {formatCurrency(totalWithdraw)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Opay Total</span>
              <span className="text-green-400 font-bold">
                {formatCurrency(totalOpayDeposits)}
              </span>
            </div>
          </div>
        </div>

        {/* Summary Card 2 */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-emerald-800/30">
          <h3 className="text-lg font-semibold text-white mb-4">
            User Statistics
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Total Users</span>
              <span className="text-emerald-400 font-bold">
                {formatNumber(allUserValue)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Affiliators</span>
              <span className="text-cyan-400 font-bold">
                {formatNumber(totalAffiliator)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Pending Affiliates</span>
              <span className="text-amber-400 font-bold">
                {formatNumber(pendingAffiliates)}
              </span>
            </div>
          </div>
        </div>

        {/* Summary Card 3 */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-emerald-800/30">
          <h3 className="text-lg font-semibold text-white mb-4">
            Pending Actions
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Deposit Requests</span>
              <span className="text-amber-400 font-bold">
                {formatNumber(pendingDepositTransactions)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Withdraw Requests</span>
              <span className="text-orange-400 font-bold">
                {formatNumber(pendingWithdrawTransactions)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Super Affiliate Withdrawals</span>
              <span className="text-purple-400 font-bold">
                {formatNumber(pendingWithdrawals)}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-center text-emerald-200/50 text-sm"
      >
      </motion.div>
    </div>
  );
}
