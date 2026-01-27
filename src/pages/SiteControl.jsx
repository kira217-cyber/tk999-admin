import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { FaTimes, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseURL, baseURL_For_IMG_UPLOAD } from '../utils/baseURL';

// Styled Components
const Container = styled.div`
  padding: 1rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f0 100%);
  min-height: 100vh;
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
`;

const DialogBox = styled.div`
  background: #ffffff;
  width: 90%;
  max-width: 600px;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
  border: 2px solid ${(props) => props.theme['--primary-color']};

  @media (min-width: 768px) {
    padding: 2rem;
    max-width: 800px;
    border-radius: 20px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: ${(props) => props.theme['--secondary-color']};
  border: none;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #ffffff;
  font-size: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }

  @media (min-width: 768px) {
    top: 1rem;
    right: 1rem;
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
`;

const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  background: #ffffff;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  border-left: 4px solid ${(props) => props.theme['--primary-color']};

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    padding: 1.5rem;
    border-radius: 15px;
    margin-bottom: 2rem;
  }
`;

const GridItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 6px;
  background: ${(props) => (props.highlight ? 'rgba(255, 87, 51, 0.05)' : 'transparent')};

  @media (min-width: 768px) {
    gap: 1rem;
    padding: 0.75rem;
    border-radius: 8px;
  }
`;

const Label = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${(props) => props.theme['--sidebar-header-color']};
  min-width: 100px;

  @media (min-width: 768px) {
    font-size: 0.9rem;
    min-width: 120px;
  }
`;

const Value = styled.span`
  font-size: 0.8rem;
  color: #212529;

  @media (min-width: 768px) {
    font-size: 0.9rem;
  }
`;

const ColorSwatch = styled.div`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  border: 2px solid #ffffff;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);

  @media (min-width: 768px) {
    width: 30px;
    height: 30px;
  }
`;

const ImagePreview = styled.img`
  width: 50px;
  height: auto;
  object-fit: cover;
  border-radius: 6px;
  border: 2px solid ${(props) => props.theme['--secondary-color']};

  @media (min-width: 768px) {
    width: 60px;
    border-radius: 8px;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 2fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const FormLabel = styled.label`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${(props) => props.theme['--sidebar-header-color']};
  display: flex;
  align-items: center;

  @media (min-width: 768px) {
    font-size: 0.85rem;
  }
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 2px solid ${(props) => props.theme['--sidebar-body-color']};
  border-radius: 8px;
  font-size: 0.8rem;
  color: #212529;
  background: #ffffff;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme['--primary-color']};
    box-shadow: 0 0 10px rgba(255, 87, 51, 0.3);
  }

  @media (min-width: 768px) {
    padding: 0.6rem;
    border-radius: 10px;
    font-size: 0.85rem;
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.5rem;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${(props) => (props.primary ? '#FF5733' : '#1C2937')};
  color: #ffffff;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
    background: ${(props) => (props.primary ? '#E64A2A' : '#0F1B29')};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  @media (min-width: 768px) {
    padding: 0.8rem 2rem;
    border-radius: 12px;
    font-size: 0.9rem;
  }
`;

const ActionBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
  }
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${(props) => props.theme['--sidebar-header-color']};
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  @media (min-width: 768px) {
    font-size: 2.2rem;
    margin-bottom: 2rem;
  }
`;

const SiteControl = () => {
  const [theme, setTheme] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingThemeId, setEditingThemeId] = useState(null);
  const [formData, setFormData] = useState({
    primaryColor: '#FF5733',
    secondaryColor: '#C70039',
    sidebarHeaderColor: '#1C2937',
    sidebarBodyColor: '#34495E',
    sidebarTitle: 'roni',
    sidebarTitleBD: 'roni',
    websiteTitle: 'roni',
    favicon: '',
    websiteLogoWhite: '',
    websiteLogoDark: '',
  });

  useEffect(() => {
    fetchTheme();
  }, []);

  const fetchTheme = async () => {
    try {
      const response = await fetch(`${baseURL}/admin-home-control`);
      const data = await response.json();
      if (response.ok && Object.keys(data).length > 0) {
        setTheme(data);
        setFormData({
          primaryColor: data.primaryColor,
          secondaryColor: data.secondaryColor,
          sidebarHeaderColor: data.sidebarHeaderColor,
          sidebarBodyColor: data.sidebarBodyColor,
          sidebarTitle: data.sidebarTitle,
          sidebarTitleBD: data.sidebarTitleBD,
          websiteTitle: data.websiteTitle,
          favicon: data.favicon || '',
          websiteLogoWhite: data.websiteLogoWhite || '',
          websiteLogoDark: data.websiteLogoDark || '',
        });
      } else {
        setTheme(null);
      }
    } catch (error) {
      console.error('Fetch Theme Error:', error);
      toast.error('Failed to fetch theme');
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = useCallback(
    async (e, field) => {
      const file = e.target.files[0];
      if (!file) return;

      setIsUploading(true);
      try {
        const imageUrl = await handleImageUpload(file);
        setFormData((prev) => ({ ...prev, [field]: imageUrl }));
      } catch (error) {
        toast.error('Failed to upload image');
      } finally {
        setIsUploading(false);
        e.target.value = null;
      }
    },
    [handleImageUpload]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      primaryColor,
      secondaryColor,
      sidebarHeaderColor,
      sidebarBodyColor,
      sidebarTitle,
      sidebarTitleBD,
      websiteTitle,
      favicon,
      websiteLogoWhite,
      websiteLogoDark,
    } = formData;

    if (
      !primaryColor ||
      !secondaryColor ||
      !sidebarHeaderColor ||
      !sidebarBodyColor ||
      !sidebarTitle ||
      !sidebarTitleBD ||
      !websiteTitle
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (sidebarTitle.length > 10) {
      toast.error('Sidebar title must be 10 characters or less');
      return;
    }

    try {
      if (editingThemeId) {
        const response = await fetch(`${baseURL}/admin-home-control/${editingThemeId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            primaryColor,
            secondaryColor,
            sidebarHeaderColor,
            sidebarBodyColor,
            sidebarTitle,
            sidebarTitleBD,
            websiteTitle,
            favicon,
            websiteLogoWhite,
            websiteLogoDark,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          toast.success('Theme updated successfully');
          fetchTheme();
          closeDialog();
        } else {
          toast.error(data.message || 'Failed to update theme');
        }
      } else {
        const response = await fetch(`${baseURL}/admin-home-control`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            primaryColor,
            secondaryColor,
            sidebarHeaderColor,
            sidebarBodyColor,
            sidebarTitle,
            sidebarTitleBD,
            websiteTitle,
            favicon,
            websiteLogoWhite,
            websiteLogoDark,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          toast.success('Theme created successfully');
          fetchTheme();
          closeDialog();
        } else {
          toast.error(data.message || 'Failed to create theme');
        }
      }
    } catch (error) {
      console.error('Submit Error:', error);
      toast.error('Failed to save theme');
    }
  };

  const handleEdit = () => {
    if (theme) {
      setEditingThemeId(theme._id);
      setIsDialogOpen(true);
    }
  };

  const openDialog = () => {
    setEditingThemeId(null);
    setFormData({
      primaryColor: '#FF5733',
      secondaryColor: '#C70039',
      sidebarHeaderColor: '#1C2937',
      sidebarBodyColor: '#34495E',
      sidebarTitle: 'roni',
      sidebarTitleBD: 'roni',
      websiteTitle: 'roni',
      favicon: '',
      websiteLogoWhite: '',
      websiteLogoDark: '',
    });
    setIsDialogOpen(true);
  };

  const closeDialog = () => setIsDialogOpen(false);

  const dynamicStyles = {
    '--primary-color': theme?.primaryColor || '#FF5733',
    '--secondary-color': theme?.secondaryColor || '#C70039',
    '--sidebar-header-color': theme?.sidebarHeaderColor || '#1C2937',
    '--sidebar-body-color': theme?.sidebarBodyColor || '#34495E',
  };

  return (
    <Container style={dynamicStyles}>
      <Title>Theme Dashboard</Title>
      <ActionBar>
        {!theme && (
          <Button primary onClick={openDialog}>
            Create New Theme
          </Button>
        )}
      </ActionBar>

      {theme ? (
        <ThemeGrid>
          <GridItem>
            <Label>Website Title</Label>
            <Value>{theme.websiteTitle}</Value>
          </GridItem>
          <GridItem>
            <Label>Sidebar Title</Label>
            <Value>{theme.sidebarTitle}</Value>
          </GridItem>
          <GridItem>
            <Label>Sidebar Title (BD)</Label>
            <Value>{theme.sidebarTitleBD}</Value>
          </GridItem>
          <GridItem highlight>
            <Label>Primary Color</Label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ColorSwatch color={theme.primaryColor} />
              <Value>{theme.primaryColor}</Value>
            </div>
          </GridItem>
          <GridItem highlight>
            <Label>Secondary Color</Label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ColorSwatch color={theme.secondaryColor} />
              <Value>{theme.secondaryColor}</Value>
            </div>
          </GridItem>
          <GridItem highlight>
            <Label>Sidebar Header Color</Label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ColorSwatch color={theme.sidebarHeaderColor} />
              <Value>{theme.sidebarHeaderColor}</Value>
            </div>
          </GridItem>
          <GridItem highlight>
            <Label>Menu Text Color</Label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ColorSwatch color={theme.sidebarBodyColor} />
              <Value>{theme.sidebarBodyColor}</Value>
            </div>
          </GridItem>
          {theme.favicon && (
            <GridItem>
              <Label>Favicon</Label>
              <ImagePreview src={`${baseURL_For_IMG_UPLOAD}s/${theme.favicon}`} alt="Favicon" />
            </GridItem>
          )}
          {theme.websiteLogoWhite && (
            <GridItem>
              <Label>White Logo</Label>
              <ImagePreview src={`${baseURL_For_IMG_UPLOAD}s/${theme.websiteLogoWhite}`} alt="White Logo" />
            </GridItem>
          )}
          {theme.websiteLogoDark && (
            <GridItem>
              <Label>Dark Logo</Label>
              <ImagePreview src={`${baseURL_For_IMG_UPLOAD}s/${theme.websiteLogoDark}`} alt="Dark Logo" />
            </GridItem>
          )}
          <GridItem style={{ gridColumn: 'span 1', justifyContent: 'center' }}>
            <Button primary onClick={handleEdit}>
              <FaEdit /> Edit Theme
            </Button>
          </GridItem>
        </ThemeGrid>
      ) : (
        <p style={{ color: '#212529', fontSize: '1rem', textAlign: 'center' }}>
          No theme available. Create a vibrant theme now!
        </p>
      )}

      {isDialogOpen && (
        <DialogOverlay onClick={closeDialog}>
          <DialogBox onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={closeDialog} aria-label="Close dialog">
              <FaTimes />
            </CloseButton>
            <Title>{editingThemeId ? 'Edit Theme' : 'Create Theme'}</Title>
            <form onSubmit={handleSubmit}>
              <FormGrid>
                <FormLabel htmlFor="websiteTitle">Website Title</FormLabel>
                <Input
                  type="text"
                  id="websiteTitle"
                  name="websiteTitle"
                  value={formData.websiteTitle}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter website title"
                  aria-label="Website title"
                />
                <FormLabel htmlFor="sidebarTitle">Sidebar Title</FormLabel>
                <Input
                  type="text"
                  id="sidebarTitle"
                  name="sidebarTitle"
                  value={formData.sidebarTitle}
                  onChange={handleInputChange}
                  required
                  maxLength={10}
                  placeholder="Max 10 chars"
                  aria-label="Sidebar title"
                />
                <FormLabel htmlFor="sidebarTitleBD">Sidebar Title (BD)</FormLabel>
                <Input
                  type="text"
                  id="sidebarTitleBD"
                  name="sidebarTitleBD"
                  value={formData.sidebarTitleBD}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter BD title"
                  aria-label="Sidebar title (BD)"
                />
                <FormLabel htmlFor="primaryColor">Primary Color</FormLabel>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Input
                    type="color"
                    id="primaryColor"
                    name="primaryColor"
                    value={formData.primaryColor}
                    onChange={handleInputChange}
                    style={{ width: '45px', height: '35px', padding: '0' }}
                    required
                    aria-label="Primary color picker"
                  />
                  <ColorSwatch color={formData.primaryColor} />
                </div>
                <FormLabel htmlFor="secondaryColor">Secondary Color</FormLabel>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Input
                    type="color"
                    id="secondaryColor"
                    name="secondaryColor"
                    value={formData.secondaryColor}
                    onChange={handleInputChange}
                    style={{ width: '45px', height: '35px', padding: '0' }}
                    required
                    aria-label="Secondary color picker"
                  />
                  <ColorSwatch color={formData.secondaryColor} />
                </div>
                <FormLabel htmlFor="sidebarHeaderColor">Sidebar Header Color</FormLabel>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Input
                    type="color"
                    id="sidebarHeaderColor"
                    name="sidebarHeaderColor"
                    value={formData.sidebarHeaderColor}
                    onChange={handleInputChange}
                    style={{ width: '45px', height: '35px', padding: '0' }}
                    required
                    aria-label="Sidebar header color picker"
                  />
                  <ColorSwatch color={formData.sidebarHeaderColor} />
                </div>
                <FormLabel htmlFor="sidebarBodyColor">Sidebar Body Color</FormLabel>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Input
                    type="color"
                    id="sidebarBodyColor"
                    name="sidebarBodyColor"
                    value={formData.sidebarBodyColor}
                    onChange={handleInputChange}
                    style={{ width: '45px', height: '35px', padding: '0' }}
                    required
                    aria-label="Menu Text Color picker"
                  />
                  <ColorSwatch color={formData.sidebarBodyColor} />
                </div>
                <FormLabel htmlFor="favicon">Favicon</FormLabel>
                <div>
                  {formData.favicon && <ImagePreview src={`${baseURL_For_IMG_UPLOAD}s/${formData.favicon}`} alt="Favicon Preview" />}
                  <Input
                    type="file"
                    id="favicon"
                    accept=".ico, image/*"
                    onChange={(e) => handleImageChange(e, 'favicon')}
                    disabled={isUploading}
                    style={{ border: 'none' }}
                  />
                </div>
                <FormLabel htmlFor="websiteLogoWhite">White Logo</FormLabel>
                <div>
                  {formData.websiteLogoWhite && (
                    <ImagePreview src={`${baseURL_For_IMG_UPLOAD}s/${formData.websiteLogoWhite}`} alt="White Logo Preview" />
                  )}
                  <Input
                    type="file"
                    id="websiteLogoWhite"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'websiteLogoWhite')}
                    disabled={isUploading}
                    style={{ border: 'none' }}
                  />
                </div>
                <FormLabel htmlFor="websiteLogoDark">Dark Logo</FormLabel>
                <div>
                  {formData.websiteLogoDark && (
                    <ImagePreview src={`${baseURL_For_IMG_UPLOAD}s/${formData.websiteLogoDark}`} alt="Dark Logo Preview" />
                  )}
                  <Input
                    type="file"
                    id="websiteLogoDark"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'websiteLogoDark')}
                    disabled={isUploading}
                    style={{ border: 'none' }}
                  />
                </div>
              </FormGrid>
              <ActionBar>
                <Button type="submit" primary disabled={isUploading}>
                  {editingThemeId ? 'Update Theme' : 'Create Theme'}
                </Button>
                <Button type="button" onClick={closeDialog}>
                  Cancel
                </Button>
              </ActionBar>
            </form>
          </DialogBox>
        </DialogOverlay>
      )}
    </Container>
  );
};

export default SiteControl;