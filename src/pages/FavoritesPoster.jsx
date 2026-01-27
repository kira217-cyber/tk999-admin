import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseURL, baseURL_For_IMG_UPLOAD } from '../utils/baseURL';

const Container = styled.div`
  padding: 3rem;
  max-width: 1280px;
  margin: 2rem auto;
  background: linear-gradient(145deg, #ffffff, #f0f4f8);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 1rem;
  }
`;

const Title = styled.h2`
  font-size: 2.2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 2rem;
  text-align: center;
  letter-spacing: -0.025em;
`;

const Section = styled.section`
  margin-bottom: 3rem;
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
  background: #fafafa;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Input = styled.input`
  padding: 0.875rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #1e293b;
  background: #ffffff;
  transition: all 0.2s ease;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  &::placeholder {
    color: #94a3b8;
  }
`;

const FileInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  transition: all 0.2s ease;
  &:hover {
    border-color: #3b82f6;
  }
`;

const FileInput = styled.input`
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  cursor: pointer;
`;

const FileInputLabel = styled.label`
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background: #2563eb;
  }
`;

const Button = styled.button`
  padding: 0.875rem 2rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background: #2563eb;
    transform: translateY(-1px);
  }
  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
  }
`;

const DeleteButton = styled.button`
  padding: 0.5rem 1rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background: #dc2626;
    transform: translateY(-1px);
  }
`;

const ImageList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
`;

const ImageCard = styled.div`
  position: relative;
  background: #ffffff;
  border-radius: 12px;
  padding: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
  &:hover {
    transform: translateY(-4px);
  }
`;

const ImageItem = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const PreviewList = styled(ImageList)`
  margin-top: 2rem;
`;

const PreviewCard = styled(ImageCard)`
  border: 2px dashed #cbd5e1;
  background: #f8fafc;
`;

const ImageInfo = styled.div`
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #64748b;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export default function FavoritesPoster() {
  const [poster, setPoster] = useState({ title: '', titleBD: '', images: [] });
  const [formData, setFormData] = useState({ title: '', titleBD: '', images: [] });
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    fetchPoster();
  }, []);

  const fetchPoster = async () => {
    try {
      const response = await axios.get(`${baseURL}/favorites-poster`);
      if (response.data.success) {
        setPoster(response.data.data);
        setFormData({
          title: response.data.data.title,
          titleBD: response.data.data.titleBD,
          images: response.data.data.images
        });
      }
    } catch (error) {
      toast.error('Failed to fetch Favorites Poster');
    }
  };

  const handleImageUpload = useCallback(async (file) => {
    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const res = await fetch(baseURL_For_IMG_UPLOAD, {
        method: 'POST',
        body: uploadData,
      });

      const data = await res.json();
      if (!res.ok || !data.imageUrl) {
        throw new Error('Image upload failed');
      }
      return data.imageUrl;
    } catch (error) {
      console.error('Upload Error:', error);
      throw error;
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          const url = await handleImageUpload(file);
          return { file, url };
        })
      );
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls.map(item => item.url)]
      }));
      setPreviewImages((prev) => [
        ...prev,
        ...uploadedUrls.map(item => ({ url: item.url, fileName: item.file.name }))
      ]);
      toast.success('Images uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload images');
    }
  };

  const handleRemovePreviewImage = (url) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter(imageUrl => imageUrl !== url)
    }));
    setPreviewImages((prev) => prev.filter(image => image.url !== url));
    toast.info('Preview image removed');
  };

  const handleDeleteImage = async (imageUrl) => {
    try {
      const response = await axios.delete(`${baseURL}/favorites-poster/image/${encodeURIComponent(imageUrl)}`);
      if (response.data.success) {
        setPoster(response.data.data);
        setFormData((prev) => ({
          ...prev,
          images: response.data.data.images
        }));
        toast.success('Image deleted successfully');
      }
    } catch (error) {
      toast.error('Failed to delete image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${baseURL}/favorites-poster`, {
        title: formData.title,
        titleBD: formData.titleBD,
        images: formData.images
      });
      if (response.data.success) {
        setPoster(response.data.data);
        setPreviewImages([]);
        toast.success('Favorites Poster updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update Favorites Poster');
    }
  };

  return (
    <Container>
      <Title>Favorites Poster Management</Title>
      <Section>
        <SectionTitle>Update Poster Details</SectionTitle>
        <Form onSubmit={handleSubmit}>
          <Input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter Title"
            required
          />
          <Input
            name="titleBD"
            value={formData.titleBD}
            onChange={handleInputChange}
            placeholder="Enter Title (Bangla)"
            required
          />
          <FileInputWrapper>
            <FileInput
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              id="file-upload"
            />
            <FileInputLabel htmlFor="file-upload">Choose Images</FileInputLabel>
          </FileInputWrapper>
          <Button type="submit">Save Changes</Button>
        </Form>
      </Section>
      {previewImages.length > 0 && (
        <Section>
          <SectionTitle>Preview Uploaded Images</SectionTitle>
          <PreviewList>
            {previewImages.map((image, index) => (
              <PreviewCard key={index}>
                <ImageItem src={`${baseURL_For_IMG_UPLOAD}s/${image.url}`} alt={`Preview ${image.fileName}`} />
                <ImageInfo>{image.fileName}</ImageInfo>
                <DeleteButton onClick={() => handleRemovePreviewImage(image.url)}>
                  Remove
                </DeleteButton>
              </PreviewCard>
            ))}
          </PreviewList>
        </Section>
      )}
      <Section>
        <SectionTitle>Current Poster</SectionTitle>
        <p><strong>Title:</strong> {poster.title}</p>
        <p><strong>Title (Bangla):</strong> {poster.titleBD}</p>
        {poster.images.length > 0 ? (
          <ImageList>
            {poster.images.map((url, index) => (
              <ImageCard key={index}>
                <ImageItem src={`${baseURL_For_IMG_UPLOAD}s/${url}`} alt={`Poster ${index}`} />
                <DeleteButton onClick={() => handleDeleteImage(url)}>Delete</DeleteButton>
              </ImageCard>
            ))}
          </ImageList>
        ) : (
          <p>No images available.</p>
        )}
      </Section>
    </Container>
  );
}