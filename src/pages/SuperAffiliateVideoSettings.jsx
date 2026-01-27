// admin/SuperAffiliateVideoSettings.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { API_URL } from "../utils/baseURL";

const Page = styled.div`
  min-height: 100vh;
  background: #f9fafb; /* light white/gray background */
  padding: 40px 20px;
  color: #111827; /* dark text for white background */
  font-family: "Inter", sans-serif;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  background: #ffffff; /* white card background */
  border-radius: 24px;
  padding: 50px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1); /* lighter shadow */
`;

const Title = styled.h1`
  font-size: 42px;
  font-weight: 900;
  text-align: center;
  color: #111827;
  margin-bottom: 40px;
`;

const Input = styled.input`
  width: 100%;
  padding: 18px 24px;
  background: #f3f4f6; /* light gray input */
  border: 2px solid #d1d5db; /* light border */
  border-radius: 16px;
  color: #111827;
  font-size: 18px;
  margin-bottom: 20px;
  &:focus {
    outline: none;
    border-color: #3b82f6; /* blue focus border */
  }
`;

const AddBtn = styled.button`
  background: #3b82f6;
  padding: 16px 40px;
  border: none;
  border-radius: 50px;
  color: white;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  &:hover {
    background: #2563eb;
  }
`;

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
  margin-top: 50px;
`;

const VideoCard = styled.div`
  background: #f3f4f6; /* light gray card */
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08); /* lighter shadow */
  position: relative;
`;

const Video = styled.video`
  width: 100%;
  height: 200px;
  object-fit: cover;
  background: #000;
`;

const Actions = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 10px;
`;

const EditBtn = styled.button`
  background: #3b82f6;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 18px;
`;

const DeleteBtn = styled.button`
  background: #ef4444;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 18px;
`;

const SuperAffiliateVideoSettings = () => {
  const [videos, setVideos] = useState([]);
  const [url, setUrl] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/super-affiliate-video`);
      setVideos(res.data || []);
    } catch (err) {
      console.log("No videos yet");
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdate = async () => {
    if (!url.trim() || !url.includes("http")) {
      alert("Please enter a valid video URL!");
      return;
    }

    try {
      if (editIndex !== null) {
        await axios.put(`${API_URL}/api/super-affiliate-video/${editIndex}`, {
          url,
        });
        setEditIndex(null);
      } else {
        await axios.post(`${API_URL}/api/super-affiliate-video`, { url });
      }
      setUrl("");
      loadVideos();
      alert("Video URL saved!");
    } catch (err) {
      alert("Failed to save!");
    }
  };

  const handleDelete = async (index) => {
    if (!window.confirm("Delete this video URL?")) return;
    await axios.delete(`${API_URL}/api/super-affiliate-video/${index}`);
    loadVideos();
  };

  const handleEdit = (index) => {
    setUrl(videos[index].url);
    setEditIndex(index);
  };

  if (loading)
    return <div className="text-center py-20 text-3xl">Loading...</div>;

  return (
    <Page>
      <Container>
        <Title>Super Affiliate Video URLs</Title>

        <div>
          <Input
            type="text"
            placeholder="Paste Video URL here (e.g. https://api.dstgamevideo.live/....mp4)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <div className="text-center">
            <AddBtn onClick={handleAddOrUpdate}>
              {editIndex !== null ? "Update URL" : "Add Video URL"}
            </AddBtn>
          </div>
        </div>

        <VideoGrid>
          {videos.map((video, i) => (
            <VideoCard key={i}>
              <Video controls>
                <source src={video.url} type="video/mp4" />
              </Video>
              <Actions>
                <EditBtn onClick={() => handleEdit(i)}>Edit</EditBtn>
                <DeleteBtn onClick={() => handleDelete(i)}>X</DeleteBtn>
              </Actions>
            </VideoCard>
          ))}
        </VideoGrid>

        {videos.length === 0 && (
          <div className="text-center py-20 text-2xl text-gray-500">
            No video URLs added yet. Paste a URL and click "Add Video URL".
          </div>
        )}
      </Container>
    </Page>
  );
};

export default SuperAffiliateVideoSettings;
