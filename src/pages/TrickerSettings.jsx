// admin/TrickerSettings.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { API_URL } from "../utils/baseURL";

// Styled Components
const Page = styled.div`
  min-height: 100vh;
  background: #f9fafb;
  padding: 40px 20px;
  font-family: "Inter", "Segoe UI", sans-serif;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
  padding: 50px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 42px;
  font-weight: 800;
  color: #1f2937;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: #6b7280;
  margin-top: 12px;
`;

const UploadSection = styled.div`
  background: #f3f4f6;
  border: 3px dashed #9ca3af;
  border-radius: 20px;
  padding: 50px;
  text-align: center;
  transition: all 0.3s;
  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const ChooseButton = styled.label`
  background: #3b82f6;
  color: white;
  padding: 16px 40px;
  font-size: 18px;
  font-weight: 700;
  border-radius: 12px;
  cursor: pointer;
  display: inline-block;
  transition: all 0.3s;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
  &:hover {
    background: #2563eb;
    transform: translateY(-3px);
  }
`;

const PreviewBox = styled.div`
  margin-top: 30px;
`;

const PreviewText = styled.p`
  font-size: 18px;
  color: #374151;
  margin-bottom: 15px;
`;

const PreviewImage = styled.img`
  max-height: 280px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const UploadButton = styled.button`
  margin-top: 20px;
  background: #10b981;
  color: white;
  padding: 14px 40px;
  font-size: 18px;
  font-weight: 700;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    background: #059669;
  }
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 24px;
  margin-top: 50px;
`;

const ImageCard = styled.div`
  position: relative;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 160px;
  object-fit: contain;
  background: white;
  padding: 20px;
`;

const DeleteBtn = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ef4444;
  color: white;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  opacity: 0;
  transition: all 0.3s;
  ${ImageCard}:hover & {
    opacity: 1;
  }
  &:hover {
    background: #dc2626;
  }
`;

const DeleteAllButton = styled.button`
  display: block;
  margin: 50px auto 0;
  background: #dc2626;
  color: white;
  padding: 18px 50px;
  font-size: 20px;
  font-weight: 800;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(220, 38, 38, 0.4);
  transition: all 0.4s;
  &:hover {
    transform: translateY(-5px);
    background: #b91c1c;
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  margin-top: 80px;
  font-size: 22px;
  color: #6b7280;
`;

const LoadingScreen = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #6b7280;
`;

const TrickerSettings = () => {
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    axios
      .get(`${API_URL}/api/tricker`)
      .then((res) => {
        setImages(res.data.images || []);
        setLoading(false);
      })
      .catch(() => {
        alert("Failed to load images!");
        setLoading(false);
      });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, JPEG, PNG, WebP allowed!");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB!");
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("icons", selectedFile);

    try {
      if (images.length === 0) {
        await axios.post(`${API_URL}/api/tricker`, formData);
      } else {
        await axios.put(`${API_URL}/api/tricker`, formData);
      }
      alert("Uploaded successfully!");
      setSelectedFile(null);
      setPreview(null);
      loadData();
    } catch (err) {
      alert("Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (index) => {
    if (!window.confirm("Delete this image?")) return;
    await axios.delete(`${API_URL}/api/tricker/${index}`);
    loadData();
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Delete ALL images?")) return;
    await axios.delete(`${API_URL}/api/tricker`);
    loadData();
  };

  if (loading) {
    return <LoadingScreen>Loading Tricker Images...</LoadingScreen>;
  }

  return (
    <Page>
      <Container>
        <Header>
          <Title>Tricker Settings</Title>
          <Subtitle>
            Add one image at a time (JPG, PNG, WebP - Max 5MB)
          </Subtitle>
        </Header>

        <UploadSection>
          <FileInput
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileChange}
            id="file-input"
          />
          <ChooseButton htmlFor="file-input">Choose Image</ChooseButton>

          {preview && (
            <PreviewBox>
              <PreviewText>Preview:</PreviewText>
              <PreviewImage src={preview} alt="Preview" />
              <UploadButton onClick={handleUpload} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload Image"}
              </UploadButton>
            </PreviewBox>
          )}
        </UploadSection>

        {images.length > 0 && (
          <>
            <ImageGrid>
              {images.map((img, i) => (
                <ImageCard key={i}>
                  <CardImage src={`${API_URL}${img.url}`} alt={img.alt} />
                  <DeleteBtn onClick={() => handleDelete(i)}>×</DeleteBtn>
                </ImageCard>
              ))}
            </ImageGrid>

            <DeleteAllButton onClick={handleDeleteAll}>
              Delete All Images
            </DeleteAllButton>
          </>
        )}

        {images.length === 0 && !preview && (
          <EmptyMessage>
            No images added yet. Click "Choose Image" to start.
          </EmptyMessage>
        )}
      </Container>
    </Page>
  );
};

export default TrickerSettings;
