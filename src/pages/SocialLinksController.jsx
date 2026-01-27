// src/admin/SocialLinksController.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { API_URL } from "../utils/baseURL";

// Styled Components
const Container = styled.div`
  padding: 24px;
  background: #111827;
  min-height: 100vh;
  color: white;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 32px;
  color: #e0f2fe;
`;

const FormWrapper = styled.form`
  background: #1f2937;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 40px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
`;

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const Input = styled.input`
  padding: 12px 16px;
  background: #374151;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1rem;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #22d3ee;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const SaveButton = styled(Button)`
  background: #10b981;
  color: white;

  &:hover {
    background: #059669;
  }
`;

const CancelButton = styled(Button)`
  background: #6b7280;
  color: white;

  &:hover {
    background: #4b5563;
  }
`;

const LinksGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const LinkCard = styled.div`
  background: #1f2937;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
`;

const LinkInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Icon = styled.img`
  width: 64px;
  height: 64px;
  object-fit: contain;
  border-radius: 8px;
`;

const InfoText = styled.div`
  h3 {
    font-size: 1.1rem;
    font-weight: bold;
    margin-bottom: 4px;
  }
  a {
    color: #60a5fa;
    font-size: 0.875rem;
    text-decoration: underline;
    word-break: break-all;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const EditButton = styled.button`
  background: #f59e0b;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background: #d97706;
  }
`;

const DeleteButton = styled.button`
  background: #ef4444;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background: #dc2626;
  }
`;

// Main Component
const SocialLinksController = () => {
  const [links, setLinks] = useState([]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [iconFile, setIconFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [game, setGame] = useState(null);

  useEffect(() => {
    fetchLinks();
  }, []);

  useEffect(() => {
    // This runs only once when the component mounts
    const fetchProviders = async () => {
      try {
        const response = await axios.get(
          "https://apigames.oracleapi.net/api/providers",
          {
            headers: {
              "x-api-key":
                "b4fb7adb955b1078d8d38b54f5ad7be8ded17cfba85c37e4faa729ddd679d379",
            },
          }
        );

        // This will show the data in browser console
        console.log("Providers API Response:", response.data);
      } catch (error) {
        console.error(
          "Error fetching providers:",
          error.response?.data || error.message
        );
      }
    };

    fetchProviders();
  }, []); // Empty dependency array → runs only on mount


  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get(
          "https://apigames.oracleapi.net/api/games/pagination",
          {
            params: {
              page: 1,
              limit: 50,
              provider: "000000000000000000000008",
            },
            headers: {
              "x-api-key":
                "b4fb7adb955b1078d8d38b54f5ad7be8ded17cfba85c37e4faa729ddd679d379", // ← your key (demo only!)
            },
          }
        );

        // THIS IS WHAT YOU ASKED FOR → data in console
        console.log("Full API Response:", response);
        console.log("Games Data (50 items):", response.data);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching games:", err.response || err);
        setError(err.response?.data || err.message);
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const GAME_ID = "0000000000000000000000bd";

  useEffect(() => {
    const fetchSingleGame = async () => {
      try {
        const response = await axios.get(
          `https://apigames.oracleapi.net/api/games/${GAME_ID}`, // Correct URL with ID
          {
            headers: {
              "x-api-key":
                "b4fb7adb955b1078d8d38b54f5ad7be8ded17cfba85c37e4faa729ddd679d379",
            },
          }
        );

        // This will show the single game in console
        console.log("Single Game API Response:", response);
        console.log("Game Data:", response.data);

        setGame(response.data); // Usually { id, name, thumbnail, provider, etc. }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching single game:", err.response || err);
        setError(
          err.response?.data?.message || err.message || "Game not found"
        );
        setLoading(false);
      }
    };

    fetchSingleGame();
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/social-links`);
      setLinks(res.data);
    } catch (err) {
      alert("লিংক লোড করতে সমস্যা হয়েছে");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("url", url);
    if (iconFile) formData.append("icon", iconFile);

    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/social-links/${editingId}`, formData);
      } else {
        await axios.post(`${API_URL}/api/social-links`, formData);
      }
      resetForm();
      fetchLinks();
    } catch (err) {
      alert("সেভ করতে সমস্যা হয়েছে");
    }
  };

  const resetForm = () => {
    setName("");
    setUrl("");
    setIconFile(null);
    setEditingId(null);
  };

  const handleEdit = (link) => {
    setName(link.name);
    setUrl(link.url);
    setEditingId(link._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("আপনি কি নিশ্চিত যে ডিলিট করতে চান?")) {
      await axios.delete(`${API_URL}/api/social-links/${id}`);
      fetchLinks();
    }
  };

  if (loading) return <div>Loading game...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!game) return <div>No game data</div>;

  return (
    <Container>
      <Title>সোশ্যাল লিংক ম্যানেজ করুন</Title>

      <FormWrapper onSubmit={handleSubmit}>
        <InputGrid>
          <Input
            type="text"
            placeholder="নাম (যেমন: WhatsApp)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            type="url"
            placeholder="লিংক[](https://...)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setIconFile(e.target.files[0])}
          />
        </InputGrid>

        <ButtonGroup>
          <SaveButton type="submit">
            {editingId ? "আপডেট করুন" : "যোগ করুন"}
          </SaveButton>
          {editingId && (
            <CancelButton type="button" onClick={resetForm}>
              ক্যানসেল
            </CancelButton>
          )}
        </ButtonGroup>
      </FormWrapper>

      <LinksGrid>
        {links.map((link) => (
          <LinkCard key={link._id}>
            <LinkInfo>
              <Icon src={link.icon} alt={link.name} />
              <InfoText>
                <h3>{link.name}</h3>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.url}
                </a>
              </InfoText>
            </LinkInfo>
            <ActionButtons>
              <EditButton onClick={() => handleEdit(link)}>এডিট</EditButton>
              <DeleteButton onClick={() => handleDelete(link._id)}>
                ডিলিট
              </DeleteButton>
            </ActionButtons>
          </LinkCard>
        ))}
      </LinksGrid>
    </Container>
  );
};

export default SocialLinksController;
