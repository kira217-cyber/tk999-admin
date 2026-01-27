import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { FaTrash } from "react-icons/fa";
import {
  createGame,
  fetchGames,
  updateGame,
  deleteGame,
} from "../redux/Frontend Control/GameControl/GameControlAPI";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  baseURL,
  baseURL_For_IMG_DELETE,
} from "../utils/baseURL";
import axios from "axios";

// Styled Components
const Container = styled.div`
  padding: 20px;
`;
// Dialog removed in selection-only flow
const FormGroup = styled.div`
  margin-bottom: 1rem;
`;
const GameList = styled.div`
  margin-top: 20px;
`;
const GameCard = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-5px);
  }
`;
const GameImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
`;
const GameContent = styled.div`
  padding: 15px;
`;
const GameTitle = styled.h5`
  margin-bottom: 10px;
  font-size: 1.25rem;
`;

const GameControl = () => {
  const dispatch = useDispatch();
  const { gameControl, isLoading, isError, errorMessage } = useSelector(
    (state) => state.gameControl
  );

  // Edit dialog state removed

  const [submenuProviders, setSubmenuProviders] = useState([]);
  const [apiGames, setApiGames] = useState([]);
  const [selectedSubmenu, setSelectedSubmenu] = useState("");
  const [isUploading] = useState(false);
  // No editing in selection-only flow
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
            { headers: { "x-api-key": API_KEY } }
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

  // Admin will not upload extra images now; selection-only flow
  // Image upload disabled in selection-only flow

  const handleApiGameHotToggle = (gameAPIID) => {
    setApiGamesState((prev) => ({
      ...prev,
      [gameAPIID]: {
        ...prev[gameAPIID],
        isHotGame: !prev[gameAPIID]?.isHotGame,
      },
    }));
  };

  // Removed New Tab toggle

  // Lobby selection handled via explicit buttons; toggle helper removed

  // Removed Lobby Game select/unselect

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
        })
      ).unwrap();
      toast.success("Game selected and saved!");
      dispatch(fetchGames());
    } catch (error) {
      toast.error(error.message || "Failed to save selection.");
    }
  };

  // Editing removed

  const handleDeleteGame = useCallback(
    async (gameId, imageFilename) => {
      try {
        if (imageFilename) {
          await fetch(baseURL_For_IMG_DELETE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filename: imageFilename }),
          });
        }
        await dispatch(deleteGame(gameId)).unwrap();
        toast.success("Game deleted successfully!");
        dispatch(fetchGames());
      } catch (error) {
        toast.error(error.message || "Failed to delete game.");
      }
    },
    [dispatch]
  );

  // No edit handler in selection-only flow

  // No dialog to close

  const handleSavedHotToggle = useCallback(
    async (savedGame) => {
      try {
        await dispatch(
          updateGame({ id: savedGame._id, data: { isHotGame: !savedGame.isHotGame } })
        ).unwrap();
        toast.success("Hot Game status updated!");
        dispatch(fetchGames());
      } catch (error) {
        toast.error(error.message || "Failed to update Hot Game status.");
      }
    },
    [dispatch]
  );

  // Removed saved New Tab toggle handler

  // Find saved game data for a provider game
  const getSavedGameData = (gameAPIID) => {
    return gameControl.find((savedGame) => savedGame.gameAPIID === gameAPIID);
  };

  return (
    <Container className="container">
      <FormGroup>
        <label htmlFor="provider" className="form-label">
          Select a Provider (Submenu)
        </label>
        <select
          id="provider"
          value={selectedSubmenu}
          onChange={(e) => handleProviderChange(e.target.value)}
          className="form-select"
        >
          <option value="">-- Select Provider --</option>
          {submenuProviders.map((sub) => (
            <option key={sub._id} value={sub._id}>
              {sub.providerName}
            </option>
          ))}
        </select>
      </FormGroup>

      <hr />
      <h2>Games from Provider</h2>
      <GameList className="row g-4">
        {isLoading && (
          <div className="col-12 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        {isError && (
          <div className="col-12">
            <div className="alert alert-danger" role="alert">
              {errorMessage || "Failed to load games"}
            </div>
          </div>
        )}
        {apiGames.length === 0 && !isLoading && !isError && (
          <p>Select a provider to see available games.</p>
        )}
        {apiGames.map((game) => {
          const savedGame = getSavedGameData(game._id);
          const isSaved = !!savedGame;
          const displayGame = isSaved ? savedGame : game;
          // Prefer project image belonging to Tk999 if present
          const tk999ProjectImage = (() => {
            const docs = (displayGame?.projectImageDocs || game?.projectImageDocs || []);
            const match = docs.find(
              (d) => d?.projectName?.title === "Tk999" && d?.image
            );
            return match?.image || null;
          })();

          const displayImage = (() => {
            if (tk999ProjectImage) {
              return `${"https://apigames.oracleapi.net"}/${tk999ProjectImage}`;
            }
            if (isSaved) {
              return `${"https://apigames.oracleapi.net"}/${displayGame.image}`;
            }
            if (apiGamesState[game._id]?.imageUrl) {
              return `${"https://apigames.oracleapi.net"}/${apiGamesState[game._id].imageUrl}`;
            }
            return game.image;
          })();
          const isHotGame = isSaved
            ? displayGame.isHotGame
            : apiGamesState[game._id]?.isHotGame || false;
          // New Tab and Lobby Game removed

          return (
            <div key={game._id} className="col-md-6 col-lg-3">
              <GameCard className="card h-100">
                <GameImage src={displayImage} alt={game.name} />
                <GameContent>
                  <GameTitle className="card-title">{game.name}</GameTitle>
                  <p className="card-text">
                    Hot Game: {isHotGame ? "Yes" : "No"}
                  </p>
                  {/* New Tab and Lobby Game removed */}
                  {!isSaved && (
                    <>
                      <FormGroup className="form-check">
                        <input
                          type="checkbox"
                          id={`hot-toggle-${game._id}`}
                          className="form-check-input"
                          checked={apiGamesState[game._id]?.isHotGame || false}
                          onChange={() => handleApiGameHotToggle(game._id)}
                        />
                        <label
                          htmlFor={`hot-toggle-${game._id}`}
                          className="form-check-label"
                        >
                          Hot Game
                        </label>
                      </FormGroup>
                      {/* Lobby Game selection removed */}
                      {/* New Tab toggle removed */}
                      {/* Saved Lobby Game buttons removed */}
                      <button
                        className="btn btn-primary w-100"
                        onClick={() => handleSaveApiGame(game._id)}
                        disabled={isUploading}
                      >
                        Select This Game
                      </button>
                    </>
                  )}
                  {isSaved && (
                    <div className="mt-2">
                      <FormGroup className="form-check">
                        <input
                          type="checkbox"
                          id={`saved-hot-toggle-${savedGame._id}`}
                          className="form-check-input"
                          checked={!!savedGame.isHotGame}
                          onChange={() => handleSavedHotToggle(savedGame)}
                        />
                        <label
                          htmlFor={`saved-hot-toggle-${savedGame._id}`}
                          className="form-check-label"
                        >
                          Hot Game
                        </label>
                      </FormGroup>
                      {/* Saved New Tab toggle removed */}
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            handleDeleteGame(savedGame._id, savedGame.image)
                          }
                        >
                          <FaTrash /> Unselect
                        </button>
                      </div>
                    </div>
                  )}
                </GameContent>
              </GameCard>
            </div>
          );
        })}
      </GameList>

      {/* Edit dialog removed */}
    </Container>
  );
};

export default GameControl;
