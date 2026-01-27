import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchMenuOptions,
  createMenuOption,
  updateMenuOption,
  deleteMenuOption,
  setMenuForm,
  setMenuEditingId,
  resetMenuForm,
} from '../../redux/Frontend Control/GameNavControl/menuOptionSlice';
import { uploadImage } from '../../redux/Frontend Control/GameNavControl/imageSlice';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { baseURL_For_IMG_UPLOAD } from '../../utils/baseURL';

// Styled Components
const Container = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 1000px;
`;

const Title = styled.h2`
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1.8rem;
`;

const FormWrapper = styled(motion.form)`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const InputWrapper = styled.div`
  flex: 1 1 30%;
  min-width: 200px;
`;

const Label = styled.label`
  color: #2c3e50;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  display: block;
`;

const StyledInput = styled.input`
  background-color: #fff;
  border: 1px solid #ced4da;
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  width: 100%;
  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    outline: none;
  }
`;

const FileInputWrapper = styled.div`
  position: relative;
`;

const StyledFileInput = styled.input`
  background-color: #fff;
  border: 1px solid #ced4da;
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 0.9rem;
  width: 100%;
  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    outline: none;
  }
`;

const ImagePreview = styled.img`
  border-radius: 8px;
  margin-top: 0.5rem;
  border: 1px solid #dee2e6;
`;

const SubmitButton = styled(motion.button)`
  background: linear-gradient(90deg, #007bff, #0056b3);
  border: none;
  border-radius: 8px;
  padding: 0.75rem 2rem;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: background 0.3s ease;
  &:hover {
    background: linear-gradient(90deg, #0056b3, #003d80);
  }
  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const ErrorAlert = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  width: 100%;
  text-align: center;
`;

const Card = styled(motion.div)`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 1rem;
  transition: transform 0.2s ease;
  &:hover {
    transform: translateY(-2px);
  }
`;

const CardBody = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
`;

const CardImage = styled.img`
  border-radius: 4px;
  margin-left: 1rem;
  border: 1px solid #dee2e6;
`;

const EditButton = styled(motion.button)`
  background: #ffc107;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  color: #212529;
  font-size: 0.9rem;
  font-weight: 500;
  margin-right: 0.5rem;
  &:hover {
    background: #e0a800;
  }
  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const DeleteButton = styled(motion.button)`
  background: #dc3545;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  &:hover {
    background: #c82333;
  }
  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const MenuOptionManager = () => {
  const dispatch = useDispatch();
  const { menuOptions, form, editingId, loading, error } = useSelector((state) => state.menuOption);
  const { loading: imageLoading, error: imageError } = useSelector((state) => state.image);

  useEffect(() => {
    dispatch(fetchMenuOptions());
  }, [dispatch]);

  const resizeImage = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 200;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        let width = img.width;
        let height = img.height;
        let startX = 0;
        let startY = 0;
        let srcSize = width;

        if (width > height) {
          startX = (width - height) / 2;
          srcSize = height;
        } else if (height > width) {
          startY = (height - width) / 2;
          srcSize = width;
        }

        ctx.drawImage(img, startX, startY, srcSize, srcSize, 0, 0, size, size);

        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, { type: file.type }));
        }, file.type);
      };
      img.onerror = reject;
    });
  }, []);

  const handleImageUpload = useCallback(
    async (file) => {
      const resizedFile = await resizeImage(file);
      const result = await dispatch(uploadImage(resizedFile)).unwrap();
      return result;
    },
    [dispatch, resizeImage]
  );

  const handleChange = (e) => {
    if (e.target.type === 'file') {
      const file = e.target.files[0];
      if (file) {
        handleImageUpload(file)
          .then((imageUrl) => {
            dispatch(setMenuForm({ image: imageUrl }));
          })
          .catch((err) => {
            console.error('Image upload failed:', err);
          });
      }
    } else {
      dispatch(setMenuForm({ [e.target.name]: e.target.value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || imageLoading) return;
    try {
      if (editingId) {
        await dispatch(updateMenuOption({ id: editingId, data: form })).unwrap();
      } else {
        await dispatch(createMenuOption(form)).unwrap();
      }
      dispatch(resetMenuForm());
    } catch (err) {
      console.error('Error saving menu option:', err);
    }
  };

  const handleEdit = (item) => {
    dispatch(setMenuForm(item));
    dispatch(setMenuEditingId(item._id));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete menu option?')) {
      try {
        await dispatch(deleteMenuOption(id)).unwrap();
      } catch (err) {
        console.error('Error deleting menu option:', err);
      }
    }
  };

  return (
    <Container className="container py-5">
      <Title>Menu Options Manager</Title>
      {(error || imageError) && <ErrorAlert>{error || imageError}</ErrorAlert>}
      <FormWrapper
        onSubmit={handleSubmit}
        className="row g-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <InputWrapper className="col-md-4">
          <Label htmlFor="title">Title (EN)</Label>
          <StyledInput
            type="text"
            id="title"
            name="title"
            placeholder="Enter menu title"
            value={form.title || ''}
            onChange={handleChange}
            required
          />
        </InputWrapper>
        <InputWrapper className="col-md-4">
          <Label htmlFor="titleBD">Title (BD)</Label>
          <StyledInput
            type="text"
            id="titleBD"
            name="titleBD"
            placeholder="Enter menu title in BD"
            value={form.titleBD || ''}
            onChange={handleChange}
            required
          />
        </InputWrapper>
        <InputWrapper className="col-md-4">
          <Label htmlFor="image">Image</Label>
          <FileInputWrapper>
            <StyledFileInput
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleChange}
              required={!form.image}
            />
          </FileInputWrapper>
          {form.image && (
            <ImagePreview src={`${baseURL_For_IMG_UPLOAD}s/${form.image}`} alt="Preview" width={60} height={60} />
          )}
        </InputWrapper>
        <div className="col-12 text-center">
          <SubmitButton
            type="submit"
            disabled={loading || imageLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading || imageLoading ? 'Saving...' : editingId ? 'Update' : 'Create'}
          </SubmitButton>
        </div>
      </FormWrapper>

      <div>
        {menuOptions.map((item) => (
          <Card
            key={item._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <CardBody>
              <div className="d-flex align-items-center">
                <strong style={{ color: '#343a40', fontWeight: 'bold' }}>{item.title}</strong>
                <strong style={{ color: '#343a40', fontWeight: 'bold', marginLeft: '10px' }}>{item.titleBD}</strong>
                {item.image && (
                  <CardImage src={`${baseURL_For_IMG_UPLOAD}s/${item.image}`} alt={item.title} width={40} height={40} />
                )}
              </div>
              <div className="mt-2">
                <EditButton
                  onClick={() => handleEdit(item)}
                  disabled={loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Edit
                </EditButton>
                <DeleteButton
                  onClick={() => handleDelete(item._id)}
                  disabled={loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Delete
                </DeleteButton>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </Container>
  );
};

export default MenuOptionManager;


