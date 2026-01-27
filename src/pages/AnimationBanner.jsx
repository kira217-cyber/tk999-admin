import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { baseURL } from '../utils/baseURL';

const Container = styled.div`
  min-height: 100vh;
  background-color: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const FormCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 24px;
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #1f2937;
  text-align: center;
  margin-bottom: 24px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 4px;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  color: #111827;
  background-color: #ffffff;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
`;

const ColorPickerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ColorPicker = styled.input`
  width: 40px;
  height: 40px;
  padding: 4px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
  background-color: transparent;

  &::-webkit-color-swatch {
    border: none;
    border-radius: 2px;
  }
  &::-moz-color-swatch {
    border: none;
    border-radius: 2px;
  }
`;

const SubmitButton = styled.button`
  padding: 8px 16px;
  background-color: #4f46e5;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s, opacity 0.2s;

  &:hover {
    background-color: #4338ca;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Message = styled.p`
  font-size: 14px;
  text-align: center;
  margin-bottom: 16px;

  ${({ type }) =>
    type === 'error' &&
    `
    color: #dc2626;
  `}
  ${({ type }) =>
    type === 'success' &&
    `
    color: #16a34a;
  `}
  ${({ type }) =>
    type === 'loading' &&
    `
    color: #2563eb;
  `}
`;

export default function AnimationBanner() {
  const [formData, setFormData] = useState({
    titleEN: 'Jackpot',
    titleBD: 'জ্যাকপট',
    titleColor: '#FFFF00',
    bannerBackgroundColor: '#012632',
    numberBackgroundColor: '#FFFFFF',
    numberColor: '#000000',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch AnimationBanner data from backend
  useEffect(() => {
    const fetchBannerData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${baseURL}/animation-banner`);
        if (!response.ok) {
          throw new Error('Failed to fetch AnimationBanner data');
        }
        const data = await response.json();
        setFormData({
          titleEN: data.titleEN || 'Jackpot',
          titleBD: data.titleBD || 'জ্যাকপট',
          titleColor: data.titleColor || '#FFFF00',
          bannerBackgroundColor: data.bannerBackgroundColor || '#012632',
          numberBackgroundColor: data.numberBackgroundColor || '#FFFFFF',
          numberColor: data.numberColor || '#000000',
        });
      } catch (err) {
        setError(err.message);
        console.error('Error fetching AnimationBanner:', err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBannerData();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${baseURL}/animation-banner`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update AnimationBanner');
      }

      const data = await response.json();
      setSuccess('AnimationBanner updated successfully!');
      setFormData({
        titleEN: data.banner.titleEN,
        titleBD: data.banner.titleBD,
        titleColor: data.banner.titleColor,
        bannerBackgroundColor: data.banner.bannerBackgroundColor,
        numberBackgroundColor: data.banner.numberBackgroundColor,
        numberColor: data.banner.numberColor,
      });
    } catch (err) {
      setError(err.message);
      console.error('Error updating AnimationBanner:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <FormCard>
        <Title>Manage Animation Banner</Title>

        {isLoading && <Message type="loading">Loading...</Message>}
        {error && <Message type="error">{error}</Message>}
        {success && <Message type="success">{success}</Message>}

        <Form onSubmit={handleSubmit}>
          {/* Title EN */}
          <FormGroup>
            <Label htmlFor="titleEN">Title (English)</Label>
            <Input
              type="text"
              id="titleEN"
              name="titleEN"
              value={formData.titleEN}
              onChange={handleChange}
              placeholder="Enter English title"
            />
          </FormGroup>

          {/* Title BD */}
          <FormGroup>
            <Label htmlFor="titleBD">Title (Bangla)</Label>
            <Input
              type="text"
              id="titleBD"
              name="titleBD"
              value={formData.titleBD}
              onChange={handleChange}
              placeholder="Enter Bangla title"
            />
          </FormGroup>

          {/* Title Color */}
          <FormGroup>
            <Label htmlFor="titleColor">Title Color</Label>
            <ColorPickerWrapper>
              <ColorPicker
                type="color"
                id="titleColor"
                name="titleColor"
                value={formData.titleColor}
                onChange={handleChange}
              />
              <Input
                type="text"
                value={formData.titleColor}
                onChange={handleChange}
                name="titleColor"
                placeholder="#FFFF00"
              />
            </ColorPickerWrapper>
          </FormGroup>

          {/* Banner Background Color */}
          <FormGroup>
            <Label htmlFor="bannerBackgroundColor">Banner Background Color</Label>
            <ColorPickerWrapper>
              <ColorPicker
                type="color"
                id="bannerBackgroundColor"
                name="bannerBackgroundColor"
                value={formData.bannerBackgroundColor}
                onChange={handleChange}
              />
              <Input
                type="text"
                value={formData.bannerBackgroundColor}
                onChange={handleChange}
                name="bannerBackgroundColor"
                placeholder="#012632"
              />
            </ColorPickerWrapper>
          </FormGroup>

          {/* Number Background Color */}
          <FormGroup>
            <Label htmlFor="numberBackgroundColor">Number Background Color</Label>
            <ColorPickerWrapper>
              <ColorPicker
                type="color"
                id="numberBackgroundColor"
                name="numberBackgroundColor"
                value={formData.numberBackgroundColor}
                onChange={handleChange}
              />
              <Input
                type="text"
                value={formData.numberBackgroundColor}
                onChange={handleChange}
                name="numberBackgroundColor"
                placeholder="#FFFFFF"
              />
            </ColorPickerWrapper>
          </FormGroup>

          {/* Number Color */}
          <FormGroup>
            <Label htmlFor="numberColor">Number Color</Label>
            <ColorPickerWrapper>
              <ColorPicker
                type="color"
                id="numberColor"
                name="numberColor"
                value={formData.numberColor}
                onChange={handleChange}
              />
              <Input
                type="text"
                value={formData.numberColor}
                onChange={handleChange}
                name="numberColor"
                placeholder="#000000"
              />
            </ColorPickerWrapper>
          </FormGroup>

          {/* Submit Button */}
          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Banner'}
          </SubmitButton>
        </Form>
      </FormCard>
    </Container>
  );
}