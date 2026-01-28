// src/pages/BalanceTransferController.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../utils/baseURL";

export default function BalanceTransferController() {
  const [data, setData] = useState({});

  const sources = [
    {
      key: "commissionBalance",
      label: "Total Withdraw Balance",
      color: "#ec4899",
    },
    {
      key: "gameLossCommissionBalance",
      label: "Game Loss Commission",
      color: "#06b6d4",
    },
    {
      key: "depositCommissionBalance",
      label: "Deposit Commission",
      color: "#8b5cf6",
    },
    {
      key: "referCommissionBalance",
      label: "Referral Commission",
      color: "#10b981",
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/balance-transfer`);
      setData(res.data.data || {});
    } catch (err) {
      toast.error("Failed to load balance transfer rules");
    }
  };

  const handleSave = async (sourceKey) => {
    const sourceData = data[sourceKey] || {};
    const payload = {
      source: sourceKey,
      enabled: sourceData.enabled ?? true,
      minAmount: sourceData.minAmount || 100,
      maxAmount: sourceData.maxAmount || 50000,
    };

    try {
      await axios.post(`${API_URL}/api/balance-transfer`, payload);
      toast.success(
        `${sources.find((s) => s.key === sourceKey).label} rule saved!`,
      );
      fetchData(); // refresh after save
    } catch (err) {
      toast.error("Failed to save rule");
    }
  };

  const updateField = (sourceKey, field, value) => {
    setData((prev) => ({
      ...prev,
      [sourceKey]: {
        ...prev[sourceKey],
        [field]: value,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950/20 to-black p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-10 text-center bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          Balance Transfer Rules
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sources.map((src) => {
            const sourceData = data[src.key] || {};
            const enabled = sourceData.enabled ?? true;
            const minAmount = sourceData.minAmount ?? 100;
            const maxAmount = sourceData.maxAmount ?? 50000;

            return (
              <motion.div
                key={src.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.random() * 0.3 }}
                className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 shadow-2xl hover:shadow-2xl transition-all"
              >
                <h3
                  className="text-xl font-bold text-center mb-6"
                  style={{ color: src.color }}
                >
                  {src.label}
                </h3>

                {/* Toggle Enabled */}
                <label className="flex items-center gap-3 mb-6 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) =>
                      updateField(src.key, "enabled", e.target.checked)
                    }
                    className="w-5 h-5 accent-emerald-500 cursor-pointer"
                  />
                  <span className="text-gray-200 font-medium">
                    Enable Transfer
                  </span>
                </label>

                {/* Min Amount */}
                <div className="mb-5">
                  <label className="block text-emerald-300 font-medium mb-2">
                    Minimum Amount
                  </label>
                  <input
                    type="number"
                    value={minAmount}
                    onChange={(e) =>
                      updateField(src.key, "minAmount", +e.target.value)
                    }
                    placeholder="Min Amount"
                    className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                  />
                </div>

                {/* Max Amount */}
                <div className="mb-8">
                  <label className="block text-emerald-300 font-medium mb-2">
                    Maximum Amount
                  </label>
                  <input
                    type="number"
                    value={maxAmount}
                    onChange={(e) =>
                      updateField(src.key, "maxAmount", +e.target.value)
                    }
                    placeholder="Max Amount"
                    className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSave(src.key)}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-3 rounded-xl font-bold cursor-pointer transition-all shadow-lg"
                >
                  Save This Rule
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
}
