import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchNavbar,
  createNavbar,
  updateNavbar,
  setEditing,
  resetForm,
} from '../../redux/Frontend Control/GameNavControl/navbarSlice';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Styled Components
const Container = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 1000px;
  margin: 0 auto;
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

const ColorInput = styled.input`
  height: 44px;
  border: none;
  border-radius: 8px;
  padding: 0.25rem;
  width: 100%;
  cursor: pointer;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
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

const GameNavBarManager = () => {
  const dispatch = useDispatch();
  const navbarState = useSelector((state) => state.navbar || {});
  const { navbar: storedNavbar, editing = false, loading = false, error = null } = navbarState;

  const [form, setFormState] = useState({
    gameBoxMarginTop: '',
    gameNavMenuMarginBottom: '',
    headerBgColor: '#ffffff',
    headerMarginBottom: '',
    headerMenuBgColor: '#ffffff',
    headerMenuBgHoverColor: '#ffffff',
    subOptionBgHoverColor: '#ffffff',
  });

  const fields = [
    { name: 'gameBoxMarginTop', label: 'Game Box Margin Top', placeholder: 'Enter value (0-80)' },
    { name: 'gameNavMenuMarginBottom', label: 'Game Nav Menu Margin Bottom', placeholder: 'Enter value (0-80)' },
    { name: 'headerMarginBottom', label: 'Header Margin Bottom', placeholder: 'Enter value (0-80)' },
  ];

  const colorFields = [
    { name: 'headerBgColor', label: 'Text Color' },
    { name: 'headerMenuBgColor', label: 'Header Menu Background Color' },
    { name: 'headerMenuBgHoverColor', label: 'Header Menu Hover Color' },
   // { name: 'subOptionBgHoverColor', label: 'Sub Option Hover Color' },
  ];

  useEffect(() => {
    dispatch(fetchNavbar());
  }, [dispatch]);

  useEffect(() => {
    if (storedNavbar) {
      setFormState(storedNavbar);
    }
  }, [storedNavbar]);

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    // Allow empty string for user to clear input
    if (value === '') {
      setFormState({ ...form, [name]: '' });
      return;
    }
    // Only allow non-negative numbers between 0 and 80
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 80) {
      setFormState({ ...form, [name]: numValue.toString() });
    }
  };

  const handleColorChange = (e) => {
    setFormState({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    try {
      // Convert empty strings to 0 for submission
      const submitForm = {
        ...form,
        gameBoxMarginTop: form.gameBoxMarginTop === '' ? '0' : form.gameBoxMarginTop,
        gameNavMenuMarginBottom: form.gameNavMenuMarginBottom === '' ? '0' : form.gameNavMenuMarginBottom,
        headerMarginBottom: form.headerMarginBottom === '' ? '0' : form.headerMarginBottom,
      };
      if (storedNavbar) {
        await dispatch(updateNavbar(submitForm)).unwrap();
      } else {
        await dispatch(createNavbar(submitForm)).unwrap();
      }
    } catch (err) {
      console.error('Error saving navbar:', err);
    }
  };

  return (
    <Container className="container">
      <Title>Navbar Manager</Title>
      {error && <ErrorAlert>{error}</ErrorAlert>}
      <FormWrapper
        onSubmit={handleSubmit}
        className="row g-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {fields.map((field) => (
          <InputWrapper key={field.name} className="col-md-4">
            <Label htmlFor={field.name}>{field.label}</Label>
            <StyledInput
              type="number"
              id={field.name}
              name={field.name}
              placeholder={field.placeholder}
              value={form[field.name] || ''}
              onChange={handleNumberChange}
              min="0"
              max="80"
            />
          </InputWrapper>
        ))}
        {colorFields.map((field) => (
          <InputWrapper key={field.name} className="col-md-4">
            <Label htmlFor={field.name}>{field.label}</Label>
            <ColorInput
              type="color"
              id={field.name}
              name={field.name}
              value={form[field.name] || '#ffffff'}
              onChange={handleColorChange}
            />
          </InputWrapper>
        ))}
        <div className="col-12 text-center">
          <SubmitButton
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? 'Saving...' : storedNavbar ? 'Update' : 'Create'}
          </SubmitButton>
        </div>
      </FormWrapper>
    </Container>
  );
};

export default GameNavBarManager;