// src/pages/CarouselControl.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUpload, FaTrash, FaSpinner } from "react-icons/fa";
import {
  getCarouselImages,
  updateCarouselImages,
} from "../redux/Frontend Control/CarouselControl/carouselControlAPI";
import {
  baseURL_For_IMG_DELETE,
  baseURL_For_IMG_UPLOAD,
} from "../utils/baseURL";

export default function CarouselControl() {
  const {
    images = [],
    isActive: storeIsActive = false,
    interval: storeInterval = 3000,
    infiniteLoop: storeInfiniteLoop = true,
    autoPlay: storeAutoPlay = true,
    isLoading,
    isError,
    errorMessage = "An error occurred",
    _id,
  } = useSelector((state) => state.homePageCarousel);

  const dispatch = useDispatch();

  const [currentImages, setCurrentImages] = useState(images);
  const [imageFiles, setImageFiles] = useState({ mobile: [], desktop: [] });
  const [previews, setPreviews] = useState({ mobile: [], desktop: [] });
  const [isActive, setIsActive] = useState(storeIsActive);
  const [interval, setInterval] = useState(storeInterval);
  const [infiniteLoop, setInfiniteLoop] = useState(storeInfiniteLoop);
  const [autoPlay, setAutoPlay] = useState(storeAutoPlay);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const mobileInputRef = useRef(null);
  const desktopInputRef = useRef(null);

  useEffect(() => {
    dispatch(getCarouselImages());
  }, [dispatch]);

  useEffect(() => {
    setIsActive(storeIsActive);
    setInterval(storeInterval);
    setInfiniteLoop(storeInfiniteLoop);
    setAutoPlay(storeAutoPlay);
    setCurrentImages(images);
  }, [storeIsActive, storeInterval, storeInfiniteLoop, storeAutoPlay, images]);

  // Validate files (type + size)
  const validateFiles = useCallback((files) => {
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validatedFiles = [];
    const errors = [];

    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        errors.push(`${file.name}: Invalid file type. Only JPG/PNG allowed.`);
        continue;
      }
      if (file.size > maxSize) {
        errors.push(`${file.name}: File size exceeds 5MB.`);
        continue;
      }
      validatedFiles.push(file);
    }

    return { validatedFiles, errors };
  }, []);

  // Handle file selection
  const handleFileChange = useCallback(
    (type) => async (e) => {
      const files = Array.from(e.target.files);
      if (!files.length) return;

      const { validatedFiles, errors } = validateFiles(files);
      if (errors.length > 0) {
        setError(errors.join(" "));
        toast.error(errors.join(" "));
        return;
      }

      setError(null);
      setImageFiles((prev) => ({
        ...prev,
        [type]: [...prev[type], ...validatedFiles],
      }));

      const newPreviews = await Promise.all(
        validatedFiles.map(
          (file) =>
            new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(file);
            }),
        ),
      );

      setPreviews((prev) => ({
        ...prev,
        [type]: [...prev[type], ...newPreviews],
      }));
    },
    [validateFiles],
  );

  // Delete image from server
  const deleteImageFromServer = useCallback(async (filename) => {
    try {
      const response = await fetch(baseURL_For_IMG_DELETE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete image");
      }
      return true;
    } catch (error) {
      console.error("Image deletion error:", error);
      throw error;
    }
  }, []);

  // Remove existing image pair
  const handleRemoveCurrentImage = useCallback(
    async (index) => {
      try {
        const imageToRemove = currentImages[index];
        await Promise.all([
          imageToRemove.mobile
            ? deleteImageFromServer(imageToRemove.mobile)
            : Promise.resolve(),
          imageToRemove.desktop
            ? deleteImageFromServer(imageToRemove.desktop)
            : Promise.resolve(),
        ]);

        const updatedImages = currentImages.filter((_, i) => i !== index);
        setCurrentImages(updatedImages);

        await dispatch(
          updateCarouselImages({
            id: _id,
            images: updatedImages,
            isActive,
            interval: Number(interval),
            infiniteLoop,
            autoPlay,
          }),
        ).unwrap();

        toast.success("Image pair deleted successfully!");
      } catch (error) {
        setError(error.message || "Failed to delete image pair");
        toast.error(error.message || "Failed to delete image pair");
      }
    },
    [
      currentImages,
      _id,
      isActive,
      interval,
      infiniteLoop,
      autoPlay,
      dispatch,
      deleteImageFromServer,
    ],
  );

  // Remove new preview image pair
  const handleRemoveNewImage = useCallback((index) => {
    setImageFiles((prev) => ({
      mobile: prev.mobile.filter((_, i) => i !== index),
      desktop: prev.desktop.filter((_, i) => i !== index),
    }));
    setPreviews((prev) => ({
      mobile: prev.mobile.filter((_, i) => i !== index),
      desktop: prev.desktop.filter((_, i) => i !== index),
    }));
  }, []);

  // Upload single image
  const handleImageUpload = useCallback(async (file) => {
    const uploadData = new FormData();
    uploadData.append("image", file);

    try {
      const res = await fetch(baseURL_For_IMG_UPLOAD, {
        method: "POST",
        body: uploadData,
      });

      const data = await res.json();
      if (!res.ok || !data.imageUrl) {
        throw new Error("Image upload failed");
      }
      return data.imageUrl;
    } catch (error) {
      console.error("Upload Error:", error);
      throw error;
    }
  }, []);

  // Update carousel
  const handleUpdate = useCallback(
    async (e) => {
      e.preventDefault();
      setUploading(true);
      setError(null);

      try {
        let updatedImages = [...currentImages];

        if (imageFiles.mobile.length || imageFiles.desktop.length) {
          if (imageFiles.mobile.length !== imageFiles.desktop.length) {
            throw new Error(
              "Please upload an equal number of mobile and desktop images",
            );
          }

          const [mobileUrls, desktopUrls] = await Promise.all([
            Promise.all(imageFiles.mobile.map(handleImageUpload)),
            Promise.all(imageFiles.desktop.map(handleImageUpload)),
          ]);

          const newImages = mobileUrls
            .map((mobileUrl, index) => ({
              mobile: mobileUrl,
              desktop: desktopUrls[index],
            }))
            .filter((img) => img.mobile && img.desktop);

          updatedImages = [...updatedImages, ...newImages];
        }

        await dispatch(
          updateCarouselImages({
            id: _id,
            images: updatedImages,
            isActive,
            interval: Number(interval),
            infiniteLoop,
            autoPlay,
          }),
        ).unwrap();

        setImageFiles({ mobile: [], desktop: [] });
        setPreviews({ mobile: [], desktop: [] });
        toast.success("Carousel updated successfully!");
      } catch (error) {
        setError(error.message || "Failed to update carousel");
        toast.error(error.message || "Failed to update carousel");
      } finally {
        setUploading(false);
      }
    },
    [
      currentImages,
      imageFiles,
      isActive,
      interval,
      infiniteLoop,
      autoPlay,
      _id,
      dispatch,
      handleImageUpload,
    ],
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950/20 to-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <FaSpinner className="w-16 h-16 text-emerald-400 animate-spin" />
          <p className="text-emerald-300 text-lg font-medium">
            Loading Carousel Settings...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950/20 to-black p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-rose-800/50 rounded-2xl p-8 shadow-2xl text-center">
          <h1 className="text-3xl font-bold text-white mb-6">
            Carousel Control
          </h1>
          <div className="bg-rose-900/40 border border-rose-700/50 text-rose-300 px-6 py-8 rounded-xl">
            {errorMessage}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950/20 to-black p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          Carousel Control
        </h1>

        {/* Current Images */}
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl mb-12">
          <h2 className="text-2xl font-bold text-emerald-300 mb-6">
            Current Slider Images
          </h2>

          {currentImages.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-lg">
              No images uploaded yet
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentImages.map((image, index) => (
                <motion.div
                  key={`current-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-900/50 border border-emerald-800/50 rounded-xl p-4 relative overflow-hidden group"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-emerald-400 mb-2 font-medium">
                        Mobile
                      </div>
                      <img
                        src={`${baseURL_For_IMG_UPLOAD}s/${image.mobile}`}
                        alt={`Mobile image ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg border border-emerald-700/50"
                      />
                    </div>

                    <div>
                      <div className="text-xs text-emerald-400 mb-2 font-medium">
                        Desktop
                      </div>
                      <img
                        src={`${baseURL_For_IMG_UPLOAD}s/${image.desktop}`}
                        alt={`Desktop image ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg border border-emerald-700/50"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveCurrentImage(index)}
                    className="absolute top-3 right-3 bg-rose-700/80 hover:bg-rose-600/90 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    aria-label={`Remove image pair ${index + 1}`}
                  >
                    <FaTrash size={16} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Settings & Upload Form */}
        <form onSubmit={handleUpdate}>
          {/* Carousel Settings */}
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl mb-8">
            <h2 className="text-2xl font-bold text-emerald-300 mb-6">
              Carousel Settings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-emerald-300 font-medium mb-2">
                  Interval (ms)
                </label>
                <input
                  type="number"
                  value={interval}
                  onChange={(e) => setInterval(Number(e.target.value))}
                  min="1000"
                  step="100"
                  required
                  className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 transition-all"
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-5 h-5 accent-emerald-500 cursor-pointer"
                  />
                  <span className="text-gray-200 font-medium">Active</span>
                </label>
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={infiniteLoop}
                    onChange={(e) => setInfiniteLoop(e.target.checked)}
                    className="w-5 h-5 accent-emerald-500 cursor-pointer"
                  />
                  <span className="text-gray-200 font-medium">
                    Infinite Loop
                  </span>
                </label>
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoPlay}
                    onChange={(e) => setAutoPlay(e.target.checked)}
                    className="w-5 h-5 accent-emerald-500 cursor-pointer"
                  />
                  <span className="text-gray-200 font-medium">Auto Play</span>
                </label>
              </div>
            </div>
          </div>

          {/* Upload New Images */}
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-emerald-300 mb-6">
              Upload New Images
            </h2>

            {previews.mobile.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {previews.mobile.map((mobilePreview, index) => (
                  <motion.div
                    key={`preview-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-900/50 border border-emerald-800/50 rounded-xl p-4 relative overflow-hidden group"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-emerald-400 mb-2 font-medium">
                          Mobile Preview
                        </div>
                        <img
                          src={mobilePreview}
                          alt={`Mobile preview ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg border border-emerald-700/50"
                        />
                      </div>

                      <div>
                        <div className="text-xs text-emerald-400 mb-2 font-medium">
                          Desktop Preview
                        </div>
                        <img
                          src={previews.desktop[index]}
                          alt={`Desktop preview ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg border border-emerald-700/50"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveNewImage(index)}
                      className="absolute top-3 right-3 bg-rose-700/80 hover:bg-rose-600/90 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      aria-label={`Remove preview pair ${index + 1}`}
                    >
                      <FaTrash size={16} />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                type="button"
                onClick={() => mobileInputRef.current.click()}
                disabled={uploading}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-4 rounded-xl font-bold cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
              >
                <FaUpload />
                {uploading ? "Uploading..." : "Upload Mobile Images"}
              </button>

              <input
                type="file"
                ref={mobileInputRef}
                accept="image/jpeg,image/png,image/jpg"
                multiple
                onChange={handleFileChange("mobile")}
                disabled={uploading}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => desktopInputRef.current.click()}
                disabled={uploading}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-4 rounded-xl font-bold cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
              >
                <FaUpload />
                {uploading ? "Uploading..." : "Upload Desktop Images"}
              </button>

              <input
                type="file"
                ref={desktopInputRef}
                accept="image/jpeg,image/png,image/jpg"
                multiple
                onChange={handleFileChange("desktop")}
                disabled={uploading}
                className="hidden"
              />
            </div>

            {/* Update Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={uploading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-4 rounded-xl font-bold cursor-pointer transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {uploading && <FaSpinner className="animate-spin" />}
              {uploading ? "Updating Carousel..." : "Update Carousel"}
            </motion.button>

            {error && (
              <div className="mt-6 bg-rose-900/40 border border-rose-700/50 text-rose-300 px-6 py-4 rounded-xl text-center">
                {error}
              </div>
            )}
          </div>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
}
