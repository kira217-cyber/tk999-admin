// src/pages/GameControl.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createGame,
  fetchGames,
  updateGame,
  deleteGame,
} from "../redux/Frontend Control/GameControl/GameControlAPI";
import { FaTrash, FaStar, FaSpinner } from "react-icons/fa";
import { baseURL, baseURL_For_IMG_UPLOAD } from "../utils/baseURL";
import axios from "axios";

export default function GameControl() {
  const dispatch = useDispatch();
  const { gameControl, isLoading, isError, errorMessage } = useSelector(
    (state) => state.gameControl,
  );

  const [submenuProviders, setSubmenuProviders] = useState([]);
  const [apiGames, setApiGames] = useState([]);
  const [selectedSubmenu, setSelectedSubmenu] = useState("");
  const [apiGamesState, setApiGamesState] = useState({});

  const API_KEY =
    "300cc0adfcfb041c25c4a8234e3c0e312a44c7570677d64bdb983412f045da67";

  useEffect(() => {
    const fetchSubmenuProviders = async () => {
      try {
        const response = await axios.get(`${baseURL}/submenu-providers`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });
        if (response.data.success) {
          setSubmenuProviders(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch submenu providers:", error);
        toast.error("Failed to fetch providers.");
      }
    };

    fetchSubmenuProviders();
    dispatch(fetchGames());
  }, [dispatch]);

  const handleProviderChange = async (submenuId) => {
    setSelectedSubmenu(submenuId);
    setApiGames([]);
    setApiGamesState({});

    if (submenuId) {
      const selected = submenuProviders.find((s) => s._id === submenuId);
      if (selected && selected.providerId) {
        try {
          const response = await axios.get(
            `https://apigames.oracleapi.net/api/games/pagination?page=1&limit=50&provider=${selected.providerId}`,
            { headers: { "x-api-key": API_KEY } },
          );
          if (response.data.success) {
            setApiGames(response.data.data);
          }
        } catch (error) {
          console.error("Failed to fetch games:", error);
          toast.error("Failed to fetch games for this provider.");
        }
      }
    }
  };

  const handleApiGameHotToggle = (gameAPIID) => {
    setApiGamesState((prev) => ({
      ...prev,
      [gameAPIID]: {
        ...prev[gameAPIID],
        isHotGame: !prev[gameAPIID]?.isHotGame,
      },
    }));
  };

  const handleSaveApiGame = async (gameAPIID) => {
    const gameState = apiGamesState[gameAPIID] || {};
    if (!selectedSubmenu) {
      toast.error("Please select a Provider (Submenu) first.");
      return;
    }
    try {
      await dispatch(
        createGame({
          gameAPIID,
          subOptions: selectedSubmenu,
          isHotGame: gameState.isHotGame || false,
        }),
      ).unwrap();
      toast.success("Game selected and saved!");
      dispatch(fetchGames());
    } catch (error) {
      toast.error(error.message || "Failed to save selection.");
    }
  };

  const handleDeleteGame = async (gameId, imageFilename) => {
    try {
      if (imageFilename) {
        await fetch(baseURL_For_IMG_DELETE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: imageFilename }),
        });
      }
      await dispatch(deleteGame(gameId)).unwrap();
      toast.success("Game unselected successfully!");
      dispatch(fetchGames());
    } catch (error) {
      toast.error(error.message || "Failed to unselect game.");
    }
  };

  const handleSavedHotToggle = async (savedGame) => {
    try {
      await dispatch(
        updateGame({
          id: savedGame._id,
          data: { isHotGame: !savedGame.isHotGame },
        }),
      ).unwrap();
      toast.success("Hot Game status updated!");
      dispatch(fetchGames());
    } catch (error) {
      toast.error(error.message || "Failed to update Hot Game status.");
    }
  };

  const getSavedGameData = (gameAPIID) => {
    return gameControl.find((savedGame) => savedGame.gameAPIID === gameAPIID);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-950/20 to-black p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-10 text-center bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          Featured Games Control
        </h1>

        {/* Provider Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl mb-12"
        >
          <h2 className="text-2xl font-bold text-emerald-300 mb-6">
            Select Provider (Submenu)
          </h2>

          <select
            value={selectedSubmenu}
            onChange={(e) => handleProviderChange(e.target.value)}
            className="w-full bg-gray-900/60 border border-emerald-800/50 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
          >
            <option value="">-- Select Provider --</option>
            {submenuProviders.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.providerName}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Games List */}
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-emerald-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-emerald-300 mb-6">
            Games from Provider
          </h2>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <FaSpinner className="w-12 h-12 text-emerald-400 animate-spin" />
            </div>
          ) : isError ? (
            <div className="bg-rose-900/40 border border-rose-700/50 text-rose-300 px-6 py-8 rounded-xl text-center">
              {errorMessage || "Failed to load games"}
            </div>
          ) : apiGames.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-lg">
              Select a provider to see available games
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {apiGames.map((game) => {
                const savedGame = getSavedGameData(game._id);
                const isSaved = !!savedGame;
                const displayGame = isSaved ? savedGame : game;

                // Prefer Tk999 project image if available
                const tk999ProjectImage = (() => {
                  const docs =
                    displayGame?.projectImageDocs ||
                    game?.projectImageDocs ||
                    [];
                  const match = docs.find(
                    (d) => d?.projectName?.title === "Tk999" && d?.image,
                  );
                  return match?.image || null;
                })();

                const displayImage = tk999ProjectImage
                  ? `https://apigames.oracleapi.net/${tk999ProjectImage}`
                  : isSaved
                    ? `https://apigames.oracleapi.net/${displayGame.image}`
                    : apiGamesState[game._id]?.imageUrl
                      ? `https://apigames.oracleapi.net/${apiGamesState[game._id].imageUrl}`
                      : game.image;

                const isHotGame = isSaved
                  ? displayGame.isHotGame
                  : apiGamesState[game._id]?.isHotGame || false;

                return (
                  <motion.div
                    key={game._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-900/50 border border-emerald-800/50 rounded-xl overflow-hidden shadow-lg group relative"
                  >
                    <img
                      src={displayImage}
                      alt={game.name}
                      className="w-full h-48 object-cover"
                    />

                    <div className="p-5 space-y-4">
                      <h3 className="text-lg font-bold text-emerald-300 truncate">
                        {game.name}
                      </h3>

                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isHotGame}
                            onChange={() =>
                              isSaved
                                ? handleSavedHotToggle(savedGame)
                                : handleApiGameHotToggle(game._id)
                            }
                            className="w-5 h-5 accent-emerald-500 cursor-pointer"
                          />
                          <span className="text-gray-200 font-medium">
                            Hot Game
                          </span>
                        </label>
                      </div>

                      {!isSaved ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleSaveApiGame(game._id)}
                          disabled={isLoading}
                          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-3 rounded-xl font-bold cursor-pointer transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          Select This Game
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() =>
                            handleDeleteGame(savedGame._id, savedGame.image)
                          }
                          className="w-full bg-rose-700/60 hover:bg-rose-600/70 text-white py-3 rounded-xl font-bold cursor-pointer transition-all flex items-center justify-center gap-2"
                        >
                          <FaTrash />
                          Unselect Game
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
}
