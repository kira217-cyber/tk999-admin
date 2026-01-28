// src/pages/AddDepositMethods.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JoditEditor from "jodit-react";
import { API_URL } from "../utils/baseURL";
import { Loader2 } from "lucide-react";

export default function AddDepositMethods() {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [gatewayInput, setGatewayInput] = useState("");
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    methodName: "",
    methodNameBD: "",
    agentWalletNumber: "",
    agentWalletText: "",
    methodImage: null,
    paymentPageImage: null,
    gateway: [],
    color: "#000000",
    backgroundColor: "#ffffff",
    buttonColor: "#000000",
    instruction: "",
    instructionBD: "",
    status: "active",
    userInputs: [],
  });

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [newUserInput, setNewUserInput] = useState({
    type: "text",
    isRequired: "false",
    label: "",
    labelBD: "",
    fieldInstruction: "",
    fieldInstructionBD: "",
    name: "",
  });
  const [editingUserInput, setEditingUserInput] = useState(null);
  const [editingUserIndex, setEditingUserIndex] = useState(null);

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/api/deposit-payment-method/methods`,
      );
      setMethods(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load deposit methods");
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const err = {};
    if (!formData.methodName.trim()) err.methodName = "Required";
    if (!formData.methodNameBD.trim()) err.methodNameBD = "Required";
    if (!formData.agentWalletNumber.trim()) err.agentWalletNumber = "Required";
    if (!formData.agentWalletText.trim()) err.agentWalletText = "Required";
    if (!editingId && !formData.methodImage) err.methodImage = "Image required";
    if (formData.gateway.length === 0) err.gateway = "Add at least one gateway";
    if (formData.userInputs.length === 0)
      err.userInputs = "Add at least one field";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = new FormData();
    payload.append("methodName", formData.methodName);
    payload.append("methodNameBD", formData.methodNameBD);
    payload.append("agentWalletNumber", formData.agentWalletNumber);
    payload.append("agentWalletText", formData.agentWalletText);
    payload.append("gateway", JSON.stringify(formData.gateway));
    payload.append("color", formData.color);
    payload.append("backgroundColor", formData.backgroundColor);
    payload.append("buttonColor", formData.buttonColor);
    payload.append("instruction", formData.instruction || "");
    payload.append("instructionBD", formData.instructionBD || "");
    payload.append("status", formData.status);
    payload.append("userInputs", JSON.stringify(formData.userInputs));

    if (formData.methodImage)
      payload.append("methodImage", formData.methodImage);
    if (formData.paymentPageImage)
      payload.append("paymentPageImage", formData.paymentPageImage);

    setLoading(true);
    try {
      if (editingId) {
        await axios.put(
          `${API_URL}/api/deposit-payment-method/method/${editingId}`,
          payload,
        );
        toast.success("Deposit method updated successfully!");
      } else {
        await axios.post(
          `${API_URL}/api/deposit-payment-method/method`,
          payload,
        );
        toast.success("Deposit method created successfully!");
      }
      resetForm();
      fetchMethods();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/api/deposit-payment-method/method/${id}`,
      );
      const m = res.data.data;
      setFormData({
        ...m,
        methodImage: null,
        paymentPageImage: null,
        gateway: m.gateway || [],
        userInputs: m.userInputs || [],
      });
      setEditingId(id);
      setErrors({});
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      toast.error("Failed to load method details");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this deposit method?")) return;

    try {
      await axios.delete(`${API_URL}/api/deposit-payment-method/method/${id}`);
      toast.success("Method deleted!");
      fetchMethods();
    } catch (err) {
      toast.error("Delete failed!");
    }
  };

  const resetForm = () => {
    setFormData({
      methodName: "",
      methodNameBD: "",
      agentWalletNumber: "",
      agentWalletText: "",
      methodImage: null,
      paymentPageImage: null,
      gateway: [],
      color: "#000000",
      backgroundColor: "#ffffff",
      buttonColor: "#000000",
      instruction: "",
      instructionBD: "",
      status: "active",
      userInputs: [],
    });
    setEditingId(null);
    setGatewayInput("");
    setErrors({});
  };

  // Gateway helpers
  const addGateway = () => {
    const trimmed = gatewayInput.trim();
    if (!trimmed) return;
    if (formData.gateway.includes(trimmed)) return toast.error("Already added");
    setFormData((prev) => ({ ...prev, gateway: [...prev.gateway, trimmed] }));
    setGatewayInput("");
  };

  // User Input helpers
  const openAddModal = () => {
    setNewUserInput({
      type: "text",
      isRequired: "false",
      label: "",
      labelBD: "",
      fieldInstruction: "",
      fieldInstructionBD: "",
      name: "",
    });
    setIsAddModalOpen(true);
  };

  const addUserInput = () => {
    if (!newUserInput.name.trim()) return toast.error("Name is required");
    setFormData((prev) => ({
      ...prev,
      userInputs: [...prev.userInputs, { ...newUserInput }],
    }));
    setIsAddModalOpen(false);
    toast.success("Field added!");
  };

  const openEditModal = (input, idx) => {
    setEditingUserInput({ ...input });
    setEditingUserIndex(idx);
    setIsUpdateModalOpen(true);
  };

  const updateUserInput = () => {
    if (!editingUserInput.name.trim()) return toast.error("Name is required");
    const updated = [...formData.userInputs];
    updated[editingUserIndex] = editingUserInput;
    setFormData((prev) => ({ ...prev, userInputs: updated }));
    setIsUpdateModalOpen(false);
    toast.success("Field updated!");
  };

  const deleteUserInput = (idx) => {
    setFormData((prev) => ({
      ...prev,
      userInputs: prev.userInputs.filter((_, i) => i !== idx),
    }));
    toast.success("Field deleted!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950/20 to-black p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center">
          Manage Deposit Payment Methods
        </h1>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Method Name EN */}
            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Method Name (English)
              </label>
              <input
                type="text"
                value={formData.methodName}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, methodName: e.target.value }))
                }
                className={`w-full bg-gray-900/60 border ${
                  errors.methodName
                    ? "border-rose-500"
                    : "border-emerald-800/50"
                } rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all`}
              />
              {errors.methodName && (
                <p className="text-rose-400 text-sm mt-1">
                  {errors.methodName}
                </p>
              )}
            </div>

            {/* Method Name BD */}
            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Method Name (Bangla)
              </label>
              <input
                type="text"
                value={formData.methodNameBD}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, methodNameBD: e.target.value }))
                }
                className={`w-full bg-gray-900/60 border ${
                  errors.methodNameBD
                    ? "border-rose-500"
                    : "border-emerald-800/50"
                } rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all`}
              />
              {errors.methodNameBD && (
                <p className="text-rose-400 text-sm mt-1">
                  {errors.methodNameBD}
                </p>
              )}
            </div>

            {/* Agent Wallet Number */}
            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Agent Wallet Number
              </label>
              <input
                type="text"
                value={formData.agentWalletNumber}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    agentWalletNumber: e.target.value,
                  }))
                }
                className={`w-full bg-gray-900/60 border ${
                  errors.agentWalletNumber
                    ? "border-rose-500"
                    : "border-emerald-800/50"
                } rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all`}
              />
              {errors.agentWalletNumber && (
                <p className="text-rose-400 text-sm mt-1">
                  {errors.agentWalletNumber}
                </p>
              )}
            </div>

            {/* Agent Wallet Text */}
            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Agent Wallet Text
              </label>
              <input
                type="text"
                value={formData.agentWalletText}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    agentWalletText: e.target.value,
                  }))
                }
                className={`w-full bg-gray-900/60 border ${
                  errors.agentWalletText
                    ? "border-rose-500"
                    : "border-emerald-800/50"
                } rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all`}
              />
              {errors.agentWalletText && (
                <p className="text-rose-400 text-sm mt-1">
                  {errors.agentWalletText}
                </p>
              )}
            </div>

            {/* Method Image */}
            <div className="md:col-span-3 lg:col-span-1">
              <label className="block text-emerald-300 font-medium mb-2">
                Method Image {editingId && "(leave blank to keep current)"}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    methodImage: e.target.files[0] || null,
                  }))
                }
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-700/50 file:text-emerald-100 hover:file:bg-emerald-600/70 cursor-pointer"
              />
              {(formData.methodImage ||
                (typeof formData.methodImage === "string" &&
                  formData.methodImage)) && (
                <div className="mt-4">
                  <img
                    src={
                      formData.methodImage instanceof File
                        ? URL.createObjectURL(formData.methodImage)
                        : `${API_URL}${formData.methodImage}`
                    }
                    alt="Method Preview"
                    className="w-full max-h-40 object-contain rounded-xl border-2 border-emerald-700/50 shadow-lg"
                  />
                </div>
              )}
              {errors.methodImage && (
                <p className="text-rose-400 text-sm mt-1">
                  {errors.methodImage}
                </p>
              )}
            </div>

            {/* Payment Page Image */}
            <div className="md:col-span-3 lg:col-span-1">
              <label className="block text-emerald-300 font-medium mb-2">
                Payment Page Image (optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    paymentPageImage: e.target.files[0] || null,
                  }))
                }
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-700/50 file:text-emerald-100 hover:file:bg-emerald-600/70 cursor-pointer"
              />
              {(formData.paymentPageImage ||
                (typeof formData.paymentPageImage === "string" &&
                  formData.paymentPageImage)) && (
                <div className="mt-4">
                  <img
                    src={
                      formData.paymentPageImage instanceof File
                        ? URL.createObjectURL(formData.paymentPageImage)
                        : `${API_URL}${formData.paymentPageImage}`
                    }
                    alt="Payment Page Preview"
                    className="w-full max-h-40 object-contain rounded-xl border-2 border-emerald-700/50 shadow-lg"
                  />
                </div>
              )}
            </div>

            {/* Gateways */}
            <div className="md:col-span-2 lg:col-span-1">
              <label className="block text-emerald-300 font-medium mb-2">
                Gateways
              </label>
              <div className="flex gap-3 mb-3">
                <input
                  type="text"
                  value={gatewayInput}
                  onChange={(e) => setGatewayInput(e.target.value)}
                  placeholder="e.g. bKash"
                  className="flex-1 bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                />
                <button
                  type="button"
                  onClick={addGateway}
                  className="bg-emerald-700/60 hover:bg-emerald-600/70 text-white px-6 py-3 rounded-xl font-medium cursor-pointer transition-all"
                >
                  Add
                </button>
              </div>
              {errors.gateway && (
                <p className="text-rose-400 text-sm mb-2">{errors.gateway}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {formData.gateway.map((g, i) => (
                  <div
                    key={i}
                    className="bg-emerald-900/50 text-emerald-200 px-4 py-2 rounded-full text-sm flex items-center gap-2"
                  >
                    {g}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((p) => ({
                          ...p,
                          gateway: p.gateway.filter((_, x) => x !== i),
                        }))
                      }
                      className="text-rose-400 hover:text-rose-300"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Text Color
              </label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, color: e.target.value }))
                }
                className="w-full h-12 bg-gray-900/60 border border-emerald-800/50 rounded-xl cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Background Color
              </label>
              <input
                type="color"
                value={formData.backgroundColor}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    backgroundColor: e.target.value,
                  }))
                }
                className="w-full h-12 bg-gray-900/60 border border-emerald-800/50 rounded-xl cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Button Color
              </label>
              <input
                type="color"
                value={formData.buttonColor}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, buttonColor: e.target.value }))
                }
                className="w-full h-12 bg-gray-900/60 border border-emerald-800/50 rounded-xl cursor-pointer"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, status: e.target.value }))
                }
                className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Instruction (English)
              </label>
              <JoditEditor
                value={formData.instruction}
                onChange={(newContent) =>
                  setFormData((p) => ({ ...p, instruction: newContent }))
                }
                className="bg-gray-900/60 border border-emerald-800/50 rounded-xl text-black min-h-[200px]"
              />
            </div>

            <div>
              <label className="block text-emerald-300 font-medium mb-2">
                Instruction (Bangla)
              </label>
              <JoditEditor
                value={formData.instructionBD}
                onChange={(newContent) =>
                  setFormData((p) => ({ ...p, instructionBD: newContent }))
                }
                className="bg-gray-900/60 border border-emerald-800/50 rounded-xl text-black min-h-[200px]"
              />
            </div>
          </div>

          {/* User Input Fields */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">
                User Input Fields
              </h3>
              <button
                type="button"
                onClick={openAddModal}
                className="bg-emerald-700/60 hover:bg-emerald-600/70 text-white px-6 py-2 rounded-xl font-medium cursor-pointer transition-all"
              >
                Add New Field
              </button>
            </div>

            {errors.userInputs && (
              <p className="text-rose-400 text-sm mb-4">{errors.userInputs}</p>
            )}

            {formData.userInputs.length > 0 && (
              <div className="overflow-x-auto rounded-xl border border-emerald-800/50 bg-gray-900/40 backdrop-blur-md shadow-lg">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="bg-gradient-to-r from-emerald-950/80 to-gray-900/80 border-b border-emerald-800/50">
                      <th className="px-6 py-4 text-left text-emerald-300 font-semibold">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-emerald-300 font-semibold">
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-emerald-300 font-semibold">
                        Required
                      </th>
                      <th className="px-6 py-4 text-left text-emerald-300 font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.userInputs.map((inp, i) => (
                      <tr
                        key={i}
                        className="border-b border-emerald-900/40 hover:bg-emerald-950/40 transition-colors"
                      >
                        <td className="px-6 py-4 text-gray-200">{inp.name}</td>
                        <td className="px-6 py-4 text-gray-300 capitalize">
                          {inp.type}
                        </td>
                        <td className="px-6 py-4 text-gray-300">
                          {inp.isRequired === "true" ? "Yes" : "No"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => openEditModal(inp, i)}
                              className="bg-emerald-700/60 hover:bg-emerald-600/70 text-white px-4 py-2 rounded-xl text-sm cursor-pointer transition-all"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteUserInput(i)}
                              className="bg-rose-700/60 hover:bg-rose-600/70 text-white px-4 py-2 rounded-xl text-sm cursor-pointer transition-all"
                            >
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
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-4 rounded-xl font-bold cursor-pointer transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading
                ? "Saving..."
                : editingId
                  ? "Update Method"
                  : "Create Method"}
            </motion.button>

            {editingId && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-4 rounded-xl font-bold cursor-pointer transition-all border border-gray-600"
              >
                Cancel
              </motion.button>
            )}
          </div>
        </motion.form>

        {/* Existing Methods */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-6">
            All Deposit Methods
          </h2>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-12 h-12 text-emerald-400 animate-spin" />
            </div>
          ) : methods.length === 0 ? (
            <div className="text-center py-20 text-gray-400 text-xl">
              No deposit methods added yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {methods.map((m) => (
                <motion.div
                  key={m._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all group"
                >
                  {m.methodImage && (
                    <img
                      src={`${API_URL}${m.methodImage}`}
                      alt={m.methodName}
                      className="w-full h-48 object-cover"
                    />
                  )}

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-emerald-300 mb-2">
                      {m.methodName} ({m.methodNameBD})
                    </h3>

                    <p className="text-sm text-gray-300 mb-2">
                      Wallet:{" "}
                      <span className="font-medium">{m.agentWalletNumber}</span>
                    </p>

                    <p className="text-sm text-gray-300 mb-4">
                      Status:{" "}
                      <span
                        className={
                          m.status === "active"
                            ? "text-emerald-400"
                            : "text-rose-400"
                        }
                      >
                        {m.status}
                      </span>
                    </p>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(m._id)}
                        className="flex-1 bg-emerald-700/60 hover:bg-emerald-600/70 text-white py-2 rounded-xl font-medium cursor-pointer transition-all"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(m._id)}
                        className="flex-1 bg-rose-700/60 hover:bg-rose-600/70 text-white py-2 rounded-xl font-medium cursor-pointer transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add User Input Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-lg border border-emerald-800/50 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">
                Add New User Input Field
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-white text-3xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-emerald-300 font-medium mb-2">
                  Field Name (code)
                </label>
                <input
                  type="text"
                  value={newUserInput.name}
                  onChange={(e) =>
                    setNewUserInput((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="e.g. transaction_id"
                  className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-medium mb-2">
                  Type
                </label>
                <select
                  value={newUserInput.type}
                  onChange={(e) =>
                    setNewUserInput((p) => ({ ...p, type: e.target.value }))
                  }
                  className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="file">File Upload</option>
                </select>
              </div>

              <div>
                <label className="block text-emerald-300 font-medium mb-2">
                  Label (English)
                </label>
                <input
                  type="text"
                  value={newUserInput.label}
                  onChange={(e) =>
                    setNewUserInput((p) => ({ ...p, label: e.target.value }))
                  }
                  className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-medium mb-2">
                  Label (Bangla)
                </label>
                <input
                  type="text"
                  value={newUserInput.labelBD}
                  onChange={(e) =>
                    setNewUserInput((p) => ({ ...p, labelBD: e.target.value }))
                  }
                  className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-medium mb-2">
                  Field Instruction (English)
                </label>
                <input
                  type="text"
                  value={newUserInput.fieldInstruction}
                  onChange={(e) =>
                    setNewUserInput((p) => ({
                      ...p,
                      fieldInstruction: e.target.value,
                    }))
                  }
                  placeholder="e.g. Enter your transaction ID"
                  className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-medium mb-2">
                  Field Instruction (Bangla)
                </label>
                <input
                  type="text"
                  value={newUserInput.fieldInstructionBD}
                  onChange={(e) =>
                    setNewUserInput((p) => ({
                      ...p,
                      fieldInstructionBD: e.target.value,
                    }))
                  }
                  placeholder="আপনার ট্রানজেকশন আইডি দিন"
                  className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-medium mb-2">
                  Required?
                </label>
                <select
                  value={newUserInput.isRequired}
                  onChange={(e) =>
                    setNewUserInput((p) => ({
                      ...p,
                      isRequired: e.target.value,
                    }))
                  }
                  className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={addUserInput}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-3 rounded-xl font-bold cursor-pointer transition-all shadow-lg"
              >
                Add Field
              </button>

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-bold cursor-pointer transition-all border border-gray-600"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit User Input Modal */}
      {isUpdateModalOpen && editingUserInput && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-lg border border-emerald-800/50 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">
                Edit User Input Field
              </h3>
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="text-gray-400 hover:text-white text-3xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-emerald-300 font-medium mb-2">
                  Field Name
                </label>
                <input
                  type="text"
                  value={editingUserInput.name}
                  onChange={(e) =>
                    setEditingUserInput((p) => ({ ...p, name: e.target.value }))
                  }
                  className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-medium mb-2">
                  Type
                </label>
                <select
                  value={editingUserInput.type}
                  onChange={(e) =>
                    setEditingUserInput((p) => ({ ...p, type: e.target.value }))
                  }
                  className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="file">File Upload</option>
                </select>
              </div>

              <div>
                <label className="block text-emerald-300 font-medium mb-2">
                  Label (English)
                </label>
                <input
                  type="text"
                  value={editingUserInput.label}
                  onChange={(e) =>
                    setEditingUserInput((p) => ({
                      ...p,
                      label: e.target.value,
                    }))
                  }
                  className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-medium mb-2">
                  Label (Bangla)
                </label>
                <input
                  type="text"
                  value={editingUserInput.labelBD}
                  onChange={(e) =>
                    setEditingUserInput((p) => ({
                      ...p,
                      labelBD: e.target.value,
                    }))
                  }
                  className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-medium mb-2">
                  Field Instruction (English)
                </label>
                <input
                  type="text"
                  value={editingUserInput.fieldInstruction}
                  onChange={(e) =>
                    setEditingUserInput((p) => ({
                      ...p,
                      fieldInstruction: e.target.value,
                    }))
                  }
                  className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-medium mb-2">
                  Field Instruction (Bangla)
                </label>
                <input
                  type="text"
                  value={editingUserInput.fieldInstructionBD}
                  onChange={(e) =>
                    setEditingUserInput((p) => ({
                      ...p,
                      fieldInstructionBD: e.target.value,
                    }))
                  }
                  className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-medium mb-2">
                  Required?
                </label>
                <select
                  value={editingUserInput.isRequired}
                  onChange={(e) =>
                    setEditingUserInput((p) => ({
                      ...p,
                      isRequired: e.target.value,
                    }))
                  }
                  className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={updateUserInput}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-3 rounded-xl font-bold cursor-pointer transition-all shadow-lg"
              >
                Save Changes
              </button>

              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-bold cursor-pointer transition-all border border-gray-600"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
}
