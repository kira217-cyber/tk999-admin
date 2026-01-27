import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseURL, baseURL_For_IMG_UPLOAD } from '../utils/baseURL';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: #f9fafb;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: #1f2937;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border-color 0.2s;
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const FileInput = styled.input`
  padding: 0.5rem;
  font-size: 0.9rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #2563eb;
  }
  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

const ActionButton = styled(Button)`
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
`;

const DeleteButton = styled(ActionButton)`
  background-color: #ef4444;
  &:hover {
    background-color: #dc2626;
  }
`;

const GameList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const GameCard = styled.div`
  background: #ffffff;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const GameImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
`;

const GameInfo = styled.div`
  flex: 1;
`;

const GameActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

export default function FeaturedGame() {
  const [games, setGames] = useState({ title: '', titleBD: '', items: [] });
  const [formData, setFormData] = useState({ title: '', titleBD: '' });
  const [newItem, setNewItem] = useState({ image: '', title: '', titleBD: '', link: '' });
  const [editItem, setEditItem] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await axios.get(`${baseURL}/featured-games`);
      if (response.data.success) {
        setGames(response.data.data);
        setFormData({
          title: response.data.data.title,
          titleBD: response.data.data.titleBD
        });
      }
    } catch (error) {
      toast.error('Failed to fetch Featured Games');
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

  const handleItemChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleEditItemChange = (e) => {
    setEditItem({ ...editItem, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e, isEdit = false) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const imageUrl = await handleImageUpload(file);
        if (isEdit) {
          setEditItem((prev) => ({ ...prev, image: imageUrl }));
        } else {
          setImageFile(file);
          setNewItem((prev) => ({ ...prev, image: imageUrl }));
        }
        toast.success('Image uploaded successfully');
      } catch (error) {
        toast.error('Failed to upload image');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${baseURL}/featured-games`, {
        title: formData.title,
        titleBD: formData.titleBD,
        items: games.items
      });
      if (response.data.success) {
        setGames(response.data.data);
        toast.success('Featured Games updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update Featured Games');
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.image || !newItem.title || !newItem.titleBD || !newItem.link) {
      toast.error('Please fill all item fields');
      return;
    }
    try {
      const response = await axios.post(`${baseURL}/featured-games/item`, newItem);
      if (response.data.success) {
        setGames(response.data.data);
        setNewItem({ image: '', title: '', titleBD: '', link: '' });
        setImageFile(null);
        toast.success('Game item added successfully');
      }
    } catch (error) {
      toast.error('Failed to add game item');
    }
  };

  const handleUpdateItem = async (e) => {
    e.preventDefault();
    if (!editItem.image || !editItem.title || !editItem.titleBD || !editItem.link) {
      toast.error('Please fill all item fields');
      return;
    }
    try {
      const response = await axios.put(`${baseURL}/featured-games/item/${editItem._id}`, {
        image: editItem.image,
        title: editItem.title,
        titleBD: editItem.titleBD,
        link: editItem.link
      });
      if (response.data.success) {
        setGames(response.data.data);
        setIsModalOpen(false);
        setEditItem(null);
        toast.success('Game item updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update game item');
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const response = await axios.delete(`${baseURL}/featured-games/item/${itemId}`);
      if (response.data.success) {
        setGames(response.data.data);
        toast.success('Game item deleted successfully');
      }
    } catch (error) {
      toast.error('Failed to delete game item');
    }
  };

  const openEditModal = (item) => {
    setEditItem({ ...item });
    setIsModalOpen(true);
  };

  return (
    <Container>
      <Title>Featured Games Management</Title>
      <Section>
        <h3>Update Games</h3>
        <Form onSubmit={handleSubmit}>
          <Input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Title"
            required
          />
          <Input
            name="titleBD"
            value={formData.titleBD}
            onChange={handleInputChange}
            placeholder="Title (Bangla)"
            required
          />
          <Button type="submit">Update Games</Button>
        </Form>
      </Section>
      <Section>
        <h3>Add New Game Item</h3>
        <Form onSubmit={handleAddItem}>
          <FileInput
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <Input
            name="title"
            value={newItem.title}
            onChange={handleItemChange}
            placeholder="Item Title"
            required
          />
          <Input
            name="titleBD"
            value={newItem.titleBD}
            onChange={handleItemChange}
            placeholder="Item Title (Bangla)"
            required
          />
          <Input
            name="link"
            value={newItem.link}
            onChange={handleItemChange}
            placeholder="Link URL"
            required
          />
          <Button type="submit">Add Item</Button>
        </Form>
      </Section>
      <Section>
        <h3>Current Games</h3>
        <p>Title: {games.title}</p>
        <p>Title (Bangla): {games.titleBD}</p>
        <GameList>
          {games.items.map((item) => (
            <GameCard key={item._id}>
              <GameImage src={`${baseURL_For_IMG_UPLOAD}s/${item.image}`} alt={item.title} />
              <GameInfo>
                <p><strong>Title:</strong> {item.title}</p>
                <p><strong>Title (Bangla):</strong> {item.titleBD}</p>
                <p><strong>Link:</strong> <a href={item.link} target="_blank" rel="noopener noreferrer">View</a></p>
              </GameInfo>
              <GameActions>
                <ActionButton onClick={() => openEditModal(item)}>Edit</ActionButton>
                <DeleteButton onClick={() => handleDeleteItem(item._id)}>Delete</DeleteButton>
              </GameActions>
            </GameCard>
          ))}
        </GameList>
      </Section>
      {isModalOpen && (
        <Modal>
          <ModalContent>
            <h3>Edit Game Item</h3>
            <Form onSubmit={handleUpdateItem}>
              <FileInput
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, true)}
              />
              <Input
                name="title"
                value={editItem.title}
                onChange={handleEditItemChange}
                placeholder="Item Title"
                required
              />
              <Input
                name="titleBD"
                value={editItem.titleBD}
                onChange={handleEditItemChange}
                placeholder="Item Title (Bangla)"
                required
              />
              <Input
                name="link"
                value={editItem.link}
                onChange={handleEditItemChange}
                placeholder="Link URL"
                required
              />
              <GameActions>
                <Button type="submit">Update Item</Button>
                <DeleteButton type="button" onClick={() => setIsModalOpen(false)}>Cancel</DeleteButton>
              </GameActions>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}