import React, { useEffect, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchSubOptions,
  fetchMenuOptionsForSub,
  createSubOption,
  updateSubOption,
  deleteSubOption,
  setSubForm,
  setSubEditingId,
  resetSubForm,
} from "../../redux/Frontend Control/GameNavControl/subOptionSlice";
import { uploadImage } from "../../redux/Frontend Control/GameNavControl/imageSlice";
import { motion } from "framer-motion";
import { baseURL_For_IMG_UPLOAD } from "../../utils/baseURL";

export default function SubOptionManager() {
  const dispatch = useDispatch();
  const { subOptions, menuOptionsForSub, form, editingId, loading, error } =
    useSelector((state) => state.subOption);
  const { loading: imageLoading, error: imageError } = useSelector(
    (state) => state.image,
  );

  const [providers, setProviders] = useState([]);

  useEffect(() => {
    dispatch(fetchSubOptions());
    dispatch(fetchMenuOptionsForSub());

    const fetchProviders = async () => {
      try {
        const response = await fetch(
          "https://apigames.oracleapi.net/api/providers",
          {
            headers: {
              "x-api-key":
                "300cc0adfcfb041c25c4a8234e3c0e312a44c7570677d64bdb983412f045da67",
            },
          },
        );
        const data = await response.json();
        if (data.success) {
          setProviders(data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch providers:", err);
      }
    };
    fetchProviders();
  }, [dispatch]);

  const resizeImage = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => (img.src = e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = 200;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");

        let width = img.width;
        let height = img.height;
        let startX = 0;
        let startY = 0;
        let srcSize = Math.min(width, height);

        if (width > height) startX = (width - height) / 2;
        else if (height > width) startY = (height - width) / 2;

        ctx.drawImage(img, startX, startY, srcSize, srcSize, 0, 0, size, size);

        canvas.toBlob(
          (blob) => resolve(new File([blob], file.name, { type: file.type })),
          file.type,
          0.92,
        );
      };
      img.onerror = reject;
    });
  }, []);

  const handleImageUpload = useCallback(
    async (file) => {
      if (!file) return;
      try {
        const resized = await resizeImage(file);
        const result = await dispatch(uploadImage(resized)).unwrap();
        dispatch(setSubForm({ image: result }));
      } catch (err) {
        console.error("Image upload failed:", err);
      }
    },
    [dispatch, resizeImage],
  );

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type === "file") {
      if (files?.[0]) handleImageUpload(files[0]);
    } else {
      dispatch(setSubForm({ [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || imageLoading) return;

    try {
      if (editingId) {
        await dispatch(updateSubOption({ id: editingId, data: form })).unwrap();
      } else {
        await dispatch(createSubOption(form)).unwrap();
      }
      dispatch(resetSubForm());
    } catch (err) {
      console.error("Sub option save failed:", err);
    }
  };

  const handleEdit = (item) => {
    dispatch(setSubForm(item));
    dispatch(setSubEditingId(item._id));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this sub option?")) return;
    try {
      await dispatch(deleteSubOption(id)).unwrap();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="min-h-[600px] bg-gradient-to-b from-gray-900/80 to-black/70 backdrop-blur-sm rounded-2xl border border-emerald-800/30 shadow-2xl shadow-black/40 p-6 md:p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-emerald-300 tracking-tight">
          Sub Options Manager
        </h2>
        <p className="mt-2 text-emerald-200/70 text-sm md:text-base">
          Manage provider sub-options under menu items
        </p>
      </div>

      {/* Errors */}
      {(error || imageError) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-900/40 border border-red-700/50 rounded-xl text-red-200 text-center"
        >
          {error || imageError}
        </motion.div>
      )}

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-10"
      >
        {/* Provider Select */}
        <div className="space-y-2">
          <label
            htmlFor="providerId"
            className="block text-sm font-medium text-emerald-200/90"
          >
            Provider
          </label>
          <select
            id="providerId"
            name="providerId"
            value={form.providerId || ""}
            onChange={handleChange}
            required
            className="
              w-full px-4 py-3 rounded-lg bg-gray-800/60 border border-emerald-800/40
              text-white placeholder-gray-500
              focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30
              transition-all duration-200 appearance-none
            "
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
              backgroundPosition: "right 1rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.5em",
            }}
          >
            <option value="">Select Provider</option>
            {providers.map((provider) => (
              <option key={provider._id} value={provider._id}>
                {provider.name}
              </option>
            ))}
          </select>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <label
            htmlFor="image"
            className="block text-sm font-medium text-emerald-200/90"
          >
            Icon / Image
          </label>
          <div
            className="
              relative w-full h-14 rounded-lg overflow-hidden border-2 border-emerald-800/40
              bg-gray-800/60 hover:bg-gray-700/60 transition-colors
              focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/30
            "
          >
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleChange}
              required={!form.image}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none text-sm px-4 text-center">
              {form.image
                ? "Change Image"
                : "Upload Icon (200×200 recommended)"}
            </div>
          </div>

          {form.image && (
            <div className="mt-3 flex items-center gap-3">
              <div className="w-16 h-16 rounded-lg overflow-hidden border border-emerald-700/50 bg-gray-950/60 flex-shrink-0">
                <img
                  src={`${baseURL_For_IMG_UPLOAD}s/${form.image}`}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm text-emerald-300/80 truncate max-w-[200px]">
                {form.image.split("/").pop()}
              </span>
            </div>
          )}
        </div>

        {/* Parent Menu Option */}
        <div className="space-y-2">
          <label
            htmlFor="parentMenuOption"
            className="block text-sm font-medium text-emerald-200/90"
          >
            Parent Menu Option
          </label>
          <select
            id="parentMenuOption"
            name="parentMenuOption"
            value={form.parentMenuOption || ""}
            onChange={handleChange}
            required
            className="
              w-full px-4 py-3 rounded-lg bg-gray-800/60 border border-emerald-800/40
              text-white placeholder-gray-500
              focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30
              transition-all duration-200 appearance-none
            "
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
              backgroundPosition: "right 1rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.5em",
            }}
          >
            <option value="">Select Parent Menu</option>
            {menuOptionsForSub.map((opt) => (
              <option key={opt._id} value={opt._id}>
                {opt.title} — {opt.titleBD}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <div className="md:col-span-3 flex justify-center mt-6">
          <motion.button
            type="submit"
            disabled={loading || imageLoading}
            whileHover={{ scale: loading || imageLoading ? 1 : 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            className={`
              px-10 py-4 rounded-xl font-semibold text-base tracking-wide
              shadow-lg shadow-emerald-900/30 min-w-[240px]
              transition-all duration-300
              ${
                loading || imageLoading
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
              }
            `}
          >
            {loading || imageLoading ? (
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
                Processing...
              </span>
            ) : editingId ? (
              "Update Sub Option"
            ) : (
              "Create Sub Option"
            )}
          </motion.button>
        </div>
      </motion.form>

      {/* List of Sub Options */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-emerald-300 mb-4">
          Existing Sub Options
        </h3>

        {subOptions.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            No sub options created yet.
          </div>
        ) : (
          subOptions.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="
                bg-gradient-to-r from-gray-800/70 to-gray-900/70
                border border-emerald-800/30 rounded-xl p-4 md:p-5
                flex flex-col sm:flex-row items-start sm:items-center justify-between
                gap-4 hover:border-emerald-600/50 transition-all duration-200
                shadow-md shadow-black/30
              "
            >
              <div className="flex items-center gap-4 flex-1">
                {item.image && (
                  <div className="w-14 h-14 rounded-lg overflow-hidden border border-emerald-700/40 bg-gray-950/60 flex-shrink-0">
                    <img
                      src={`${baseURL_For_IMG_UPLOAD}s/${item.image}`}
                      alt="icon"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <div className="font-medium text-white">
                    {providers.find((p) => p._id === item.providerId)?.name ||
                      item.providerId ||
                      "Unknown Provider"}
                  </div>
                  <div className="text-sm text-emerald-200/80">
                    Parent:{" "}
                    {menuOptionsForSub.find(
                      (opt) => opt._id === item.parentMenuOption,
                    )?.title || "Not assigned"}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 self-end sm:self-center">
                <motion.button
                  onClick={() => handleEdit(item)}
                  disabled={loading || imageLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="
                    px-6 py-2.5 rounded-lg text-sm font-medium
                    bg-amber-600/80 hover:bg-amber-600 text-white
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200
                  "
                >
                  Edit
                </motion.button>

                <motion.button
                  onClick={() => handleDelete(item._id)}
                  disabled={loading || imageLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="
                    px-6 py-2.5 rounded-lg text-sm font-medium
                    bg-red-600/80 hover:bg-red-600 text-white
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200
                  "
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
