// src/pages/CommissionsSettings.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../utils/baseURL";
import { FaSpinner } from "react-icons/fa";

export default function CommissionsSettings() {
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    leftTitle: "",
    leftDesc: "",
    buttonText: "",
    calcTitle: "",
    calcItems: [],
    tierNetLoss: "",
    tierPlayers: "",
    tierRate: "",
    formulaTitle: "",
    formulaPercent: "",
    formulaSubtitle: "",
    tableData: [],
    totalCommission: 0,
    leftImage: "",
    leftImageFile: null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/commission/admin`);
        const d = res.data;

        setForm({
          title: d.title || "",
          subtitle: d.subtitle || "",
          leftTitle: d.leftTitle || "",
          leftDesc: d.leftDesc || "",
          buttonText: d.buttonText || "",
          calcTitle: d.calcTitle || "",
          calcItems: (d.calcItems || []).map((item) => ({
            text: item.text || "",
            icon: item.icon || "",
            file: null,
          })),
          tierNetLoss: d.tierNetLoss || "",
          tierPlayers: d.tierPlayers || "",
          tierRate: d.tierRate || "",
          formulaTitle: d.formulaTitle || "",
          formulaPercent: d.formulaPercent || "",
          formulaSubtitle: d.formulaSubtitle || "",
          tableData: d.tableData || [],
          totalCommission: d.totalCommission || 0,
          leftImage: d.leftImage || "",
          leftImageFile: null,
        });
      } catch (err) {
        console.error("Failed to load commission settings:", err);
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const saveAll = async () => {
    const data = new FormData();

    data.append("title", form.title);
    data.append("subtitle", form.subtitle);
    data.append("leftTitle", form.leftTitle);
    data.append("leftDesc", form.leftDesc);
    data.append("buttonText", form.buttonText);
    data.append("calcTitle", form.calcTitle);
    data.append("tierNetLoss", form.tierNetLoss);
    data.append("tierPlayers", form.tierPlayers);
    data.append("tierRate", form.tierRate);
    data.append("formulaTitle", form.formulaTitle);
    data.append("formulaPercent", form.formulaPercent);
    data.append("formulaSubtitle", form.formulaSubtitle);
    data.append("totalCommission", form.totalCommission);
    data.append("tableData", JSON.stringify(form.tableData));
    data.append(
      "calcItems",
      JSON.stringify(
        form.calcItems.map((i) => ({ text: i.text, icon: i.icon }))
      )
    );

    if (form.leftImageFile) data.append("leftImage", form.leftImageFile);
    form.calcItems.forEach((item, i) => {
      if (item.file) data.append(`calcIcon[${i}]`, item.file);
    });

    try {
      await axios.put(`${API_URL}/api/commission`, data);
      toast.success("Commission settings saved successfully!");
    } catch (err) {
      console.error("Save error:", err);
      toast.error(err.response?.data?.message || "Failed to save");
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950/20 to-black p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center">
          Commission Settings Panel
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl"
        >
          {/* Main Title & Subtitle */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-white mb-4">Main Title & Subtitle</h3>
            <input
              placeholder="e.g. Best Commission Rate!"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all mb-4"
            />
            <textarea
              placeholder="Write subtitle here..."
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              rows={3}
              className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all resize-y"
            />
          </div>

          {/* Left Section */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-white mb-4">Left Section Content</h3>
            <input
              placeholder="Title"
              value={form.leftTitle}
              onChange={(e) => setForm({ ...form, leftTitle: e.target.value })}
              className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all mb-4"
            />
            <textarea
              placeholder="Write description..."
              value={form.leftDesc}
              onChange={(e) => setForm({ ...form, leftDesc: e.target.value })}
              rows={4}
              className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all resize-y mb-4"
            />
            <input
              placeholder="Button Text"
              value={form.buttonText}
              onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
              className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all mb-4"
            />

            <label className="block text-emerald-300 font-medium mb-2">Left Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setForm({ ...form, leftImageFile: e.target.files[0] || null })
              }
              className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-700/50 file:text-emerald-100 hover:file:bg-emerald-600/70 cursor-pointer"
            />
            {(form.leftImageFile || form.leftImage) && (
              <div className="mt-4">
                <img
                  src={
                    form.leftImageFile instanceof File
                      ? URL.createObjectURL(form.leftImageFile)
                      : form.leftImage.startsWith("http")
                      ? form.leftImage
                      : `${API_URL}${form.leftImage}`
                  }
                  alt="Left Section Preview"
                  className="w-full max-h-48 object-cover rounded-xl border border-emerald-700/50 shadow-lg"
                />
              </div>
            )}
          </div>

          {/* How Commission is Calculated */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-white mb-4">How Commission is Calculated</h3>

            {form.calcItems.map((item, i) => (
              <div key={i} className="bg-gray-900/50 border border-emerald-800/50 rounded-xl p-5 mb-6">
                <textarea
                  placeholder="e.g. % Commission: (Profit - Bonus) × 50%"
                  value={item.text}
                  onChange={(e) => {
                    const items = [...form.calcItems];
                    items[i].text = e.target.value;
                    setForm({ ...form, calcItems: items });
                  }}
                  rows={3}
                  className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all resize-y mb-4"
                />

                <label className="block text-emerald-300 font-medium mb-2">Icon</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const items = [...form.calcItems];
                    items[i].file = e.target.files[0] || null;
                    setForm({ ...form, calcItems: items });
                  }}
                  className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-700/50 file:text-emerald-100 hover:file:bg-emerald-600/70 cursor-pointer"
                />

                {(item.file || item.icon) && (
                  <div className="mt-4">
                    <img
                      src={
                        item.file instanceof File
                          ? URL.createObjectURL(item.file)
                          : item.icon.startsWith("http")
                          ? item.icon
                          : `${API_URL}${item.icon}`
                      }
                      alt="Calc Icon"
                      className="w-16 h-16 object-contain rounded-lg border border-emerald-700/50 shadow-md"
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      calcItems: form.calcItems.filter((_, idx) => idx !== i),
                    })
                  }
                  className="mt-4 bg-rose-700/60 hover:bg-rose-600/70 text-white px-6 py-2 rounded-xl font-medium cursor-pointer transition-all"
                >
                  Remove Item
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  calcItems: [...form.calcItems, { text: "", icon: "", file: null }],
                })
              }
              className="bg-emerald-700/60 hover:bg-emerald-600/70 text-white px-6 py-3 rounded-xl font-medium cursor-pointer transition-all"
            >
              + Add New Item
            </button>
          </div>

          {/* Commission Table */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-white mb-4">Commission Table</h3>

            <div className="overflow-x-auto rounded-xl border border-emerald-800/50 bg-gray-900/40 backdrop-blur-md shadow-lg">
              <table className="w-full min-w-[800px] text-left">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-950/80 to-gray-900/80 border-b border-emerald-800/50">
                    <th className="px-6 py-4 text-emerald-300 font-semibold">Member</th>
                    <th className="px-6 py-4 text-emerald-300 font-semibold">Win/Loss</th>
                    <th className="px-6 py-4 text-emerald-300 font-semibold">Operation Fee</th>
                    <th className="px-6 py-4 text-emerald-300 font-semibold">Bonus</th>
                    <th className="px-6 py-4 text-emerald-300 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {form.tableData.map((row, i) => (
                    <tr key={i} className="border-b border-emerald-900/40 hover:bg-emerald-950/40 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          placeholder="Name"
                          value={row.member}
                          onChange={(e) => {
                            const newData = [...form.tableData];
                            newData[i].member = e.target.value;
                            setForm({ ...form, tableData: newData });
                          }}
                          className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={row.win}
                          onChange={(e) => {
                            const newData = [...form.tableData];
                            newData[i].win = Number(e.target.value);
                            setForm({ ...form, tableData: newData });
                          }}
                          className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={row.operation}
                          onChange={(e) => {
                            const newData = [...form.tableData];
                            newData[i].operation = Number(e.target.value);
                            setForm({ ...form, tableData: newData });
                          }}
                          className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={row.bonus}
                          onChange={(e) => {
                            const newData = [...form.tableData];
                            newData[i].bonus = Number(e.target.value);
                            setForm({ ...form, tableData: newData });
                          }}
                          className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30"
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            setForm({
                              ...form,
                              tableData: form.tableData.filter((_, idx) => idx !== i),
                            })
                          }
                          className="bg-rose-700/60 hover:bg-rose-600/70 text-white px-4 py-2 rounded-xl font-medium cursor-pointer transition-all"
                        >
                          X
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  tableData: [...form.tableData, { member: "", win: 0, operation: 0, bonus: 0 }],
                })
              }
              className="bg-emerald-700/60 hover:bg-emerald-600/70 text-white px-6 py-3 rounded-xl font-medium cursor-pointer transition-all mt-4"
            >
              + Add New Member
            </button>

            <div className="mt-6">
              <label className="block text-emerald-300 font-medium mb-2">Total Commission</label>
              <input
                type="number"
                value={form.totalCommission}
                onChange={(e) => setForm({ ...form, totalCommission: Number(e.target.value) })}
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
            </div>
          </div>

          {/* Save Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={saveAll}
            className="w-full max-w-md mx-auto mt-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-5 rounded-xl font-bold text-xl cursor-pointer transition-all shadow-2xl"
          >
            SAVE ALL CHANGES
          </motion.button>
        </motion.div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
}