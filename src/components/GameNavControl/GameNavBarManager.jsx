import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchNavbar,
  createNavbar,
  updateNavbar,
} from "../../redux/Frontend Control/GameNavControl/navbarSlice";
import { motion } from "framer-motion";

export default function GameNavBarManager() {
  const dispatch = useDispatch();
  const navbarState = useSelector((state) => state.navbar || {});
  const { navbar: storedNavbar, loading = false, error = null } = navbarState;

  const [form, setForm] = useState({
    gameBoxMarginTop: "",
    gameNavMenuMarginBottom: "",
    headerBgColor: "#ffffff",
    headerMarginBottom: "",
    headerMenuBgColor: "#ffffff",
    headerMenuBgHoverColor: "#ffffff",
    subOptionBgHoverColor: "#ffffff",
  });

  const fields = [
    {
      name: "gameBoxMarginTop",
      label: "Game Box Margin Top",
      placeholder: "0–80 px",
    },
    {
      name: "gameNavMenuMarginBottom",
      label: "Game Nav Menu Margin Bottom",
      placeholder: "0–80 px",
    },
    {
      name: "headerMarginBottom",
      label: "Header Margin Bottom",
      placeholder: "0–80 px",
    },
  ];

  const colorFields = [
    { name: "headerBgColor", label: "Header Background Color" },
    { name: "headerMenuBgColor", label: "Header Menu Background" },
    { name: "headerMenuBgHoverColor", label: "Header Menu Hover" },
    // { name: "subOptionBgHoverColor", label: "Sub Option Hover Color" },
  ];

  useEffect(() => {
    dispatch(fetchNavbar());
  }, [dispatch]);

  useEffect(() => {
    if (storedNavbar) {
      setForm((prev) => ({
        ...prev,
        ...storedNavbar,
        // Ensure we keep empty string if backend returns null/undefined
        gameBoxMarginTop: storedNavbar.gameBoxMarginTop ?? "",
        gameNavMenuMarginBottom: storedNavbar.gameNavMenuMarginBottom ?? "",
        headerMarginBottom: storedNavbar.headerMarginBottom ?? "",
      }));
    }
  }, [storedNavbar]);

  const handleNumberChange = (e) => {
    const { name, value } = e.target;

    // Allow empty input (user clearing the field)
    if (value === "") {
      setForm((prev) => ({ ...prev, [name]: "" }));
      return;
    }

    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const num = Number(value);

    // Enforce 0–80 range
    if (num >= 0 && num <= 80) {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    // If >80 or invalid → ignore (don't update)
  };

  const handleColorChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const submitData = {
      ...form,
      gameBoxMarginTop:
        form.gameBoxMarginTop === "" ? "0" : form.gameBoxMarginTop,
      gameNavMenuMarginBottom:
        form.gameNavMenuMarginBottom === ""
          ? "0"
          : form.gameNavMenuMarginBottom,
      headerMarginBottom:
        form.headerMarginBottom === "" ? "0" : form.headerMarginBottom,
    };

    try {
      if (storedNavbar) {
        await dispatch(updateNavbar(submitData)).unwrap();
      } else {
        await dispatch(createNavbar(submitData)).unwrap();
      }
    } catch (err) {
      console.error("Navbar save failed:", err);
    }
  };

  return (
    <div className="min-h-[500px] bg-gradient-to-b from-gray-900/80 to-black/70 backdrop-blur-sm rounded-2xl border border-emerald-800/30 shadow-2xl shadow-black/40 p-6 md:p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-emerald-300 tracking-tight">
          Navbar Manager
        </h2>
        <p className="mt-2 text-emerald-200/70 text-sm md:text-base">
          Customize header appearance and spacing
        </p>
      </div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-900/40 border border-red-700/50 rounded-xl text-red-200 text-center"
        >
          {error}
        </motion.div>
      )}

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
      >
        {fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-emerald-200/90"
            >
              {field.label}
            </label>
            <input
              type="text" // ← Changed from "number" to "text" → solves most typing issues
              inputMode="numeric" // Shows numeric keyboard on mobile
              pattern="[0-9]*" // Restricts to digits only
              id={field.name}
              name={field.name}
              placeholder={field.placeholder}
              value={form[field.name] ?? ""}
              onChange={handleNumberChange}
              className="
                w-full px-4 py-3 rounded-lg 
                bg-gray-800/60 border border-emerald-800/40
                text-white placeholder-gray-500 caret-emerald-400
                focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30
                transition-all duration-200
              "
            />
          </div>
        ))}

        {colorFields.map((field) => (
          <div key={field.name} className="space-y-2">
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-emerald-200/90"
            >
              {field.label}
            </label>
            <div
              className="
                w-full h-14 rounded-lg overflow-hidden 
                border-2 border-emerald-800/40
                focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/30
                transition-all duration-200 relative
              "
            >
              <input
                type="color"
                id={field.name}
                name={field.name}
                value={form[field.name] || "#ffffff"}
                onChange={handleColorChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div
                className="w-full h-full"
                style={{ backgroundColor: form[field.name] || "#ffffff" }}
              />
            </div>
            <div className="text-xs text-gray-400 mt-1 font-mono tracking-wide">
              {form[field.name] || "#ffffff"}
            </div>
          </div>
        ))}

        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-center mt-6">
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.04, y: loading ? 0 : -2 }}
            whileTap={{ scale: loading ? 1 : 0.96 }}
            className={`
              px-10 py-4 rounded-xl font-semibold text-base tracking-wide
              shadow-lg shadow-emerald-900/30
              transition-all duration-300 min-w-[220px]
              ${
                loading
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
              }
            `}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                </svg>
                Saving...
              </span>
            ) : storedNavbar ? (
              "Update Navbar Settings"
            ) : (
              "Create Navbar Settings"
            )}
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
}
