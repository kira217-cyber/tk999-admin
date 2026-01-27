import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseURL, baseURL_For_IMG_UPLOAD } from '../utils/baseURL';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components'; // Import styled-components

// --- Styled Components ---

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom right, #1a202c, #2d3748, #4a5568);
  padding: 2.5rem; /* p-10 */
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ContentCard = styled.div`
  width: 100%;
  max-width: 7xl; /* Equivalent to max-w-7xl */
  background-color: #ffffff;
  border-radius: 1.5rem; /* rounded-3xl */
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); /* shadow-2xl */
  padding: 2.5rem; /* p-10 */
`;

const Header = styled.h2`
  font-size: 2.5rem; /* text-4xl */
  font-weight: 700; /* font-bold */
  color: #1a202c; /* text-gray-900 */
  margin-bottom: 2.5rem; /* mb-10 */
  text-align: center;
  letter-spacing: -0.025em; /* tracking-tight */
`;

const Form = styled.form`
  margin-bottom: 3rem; /* mb-12 */
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem; /* gap-6 */

  @media (min-width: 1024px) { /* lg */
    grid-template-columns: repeat(4, 1fr);
  }
`;

const FormSection = styled.div`
  @media (min-width: 1024px) { /* lg */
    grid-column: span 2 / span 2;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem; /* text-sm */
  font-weight: 500; /* font-medium */
  color: #4a5568; /* text-gray-700 */
  margin-bottom: 0.5rem; /* mb-2 */
`;

const Dropzone = styled.div`
  position: relative;
  border: 2px dashed #cbd5e0; /* border-2 border-dashed border-gray-300 */
  border-radius: 0.5rem; /* rounded-lg */
  padding: 1.5rem; /* p-6 */
  text-align: center;
  transition: border-color 0.2s ease-in-out; /* transition-colors */

  &:hover {
    border-color: #38b2ac; /* hover:border-teal-500 */
  }
`;

const FileInput = styled.input`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
`;

const DropzoneText = styled.p`
  font-size: 0.875rem; /* text-sm */
  color: #a0aec0; /* text-gray-500 */
`;

const ImagePreview = styled.img`
  margin-top: 1rem; /* mt-4 */
  margin-left: auto;
  margin-right: auto;
  max-height: 10rem; /* max-h-40 */
  object-fit: contain;
  border-radius: 0.375rem; /* rounded-md */
`;

const Select = styled.select`
  display: block;
  width: 100%;
  border-radius: 0.5rem; /* rounded-lg */
  border-color: #cbd5e0; /* border-gray-300 */
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
  &:focus {
    border-color: #319795; /* focus:border-teal-600 */
    box-shadow: 0 0 0 3px rgba(49, 151, 149, 0.5); /* focus:ring-teal-600 */
  }
  font-size: 0.875rem; /* text-sm */
  padding: 0.75rem; /* p-3 */
  &:disabled {
    background-color: #f7fafc; /* disabled:bg-gray-100 */
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 1rem; /* space-x-4 */
`;

const PrimaryButton = styled.button`
  width: 100%;
  padding: 0.75rem 1.5rem; /* py-3 px-6 */
  background-color: #38b2ac; /* bg-teal-600 */
  color: #ffffff;
  font-weight: 600; /* font-semibold */
  border-radius: 0.5rem; /* rounded-lg */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
  &:hover {
    background-color: #319795; /* hover:bg-teal-700 */
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(56, 178, 172, 0.5), 0 0 0 6px rgba(56, 178, 172, 0.3); /* focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 */
  }
  transition: all 0.2s ease-in-out;
  &:disabled {
    background-color: #81e6d9; /* disabled:bg-teal-400 */
    cursor: not-allowed;
  }
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SecondaryButton = styled(PrimaryButton)`
  background-color: #4a5568; /* bg-gray-600 */
  &:hover {
    background-color: #2d3748; /* hover:bg-gray-700 */
  }
  &:focus {
    box-shadow: 0 0 0 3px rgba(74, 85, 104, 0.5), 0 0 0 6px rgba(74, 85, 104, 0.3); /* focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 */
  }
`;

const ErrorMessage = styled.p`
  margin-top: 1rem; /* mt-4 */
  font-size: 0.875rem; /* text-sm */
  color: #c53030; /* text-red-600 */
  background-color: #fed7d7; /* bg-red-50 */
  padding: 0.75rem; /* p-3 */
  border-radius: 0.5rem; /* rounded-lg */
`;

const BannerListGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem; /* gap-6 */

  @media (min-width: 768px) { /* md */
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1024px) { /* lg */
    grid-template-columns: repeat(3, 1fr);
  }
`;

const EmptyBannerMessage = styled.p`
  text-align: center;
  color: #a0aec0; /* text-gray-500 */
  grid-column: span 1 / span 1; /* col-span-full for smaller screens */

  @media (min-width: 768px) { /* md */
     grid-column: span 2 / span 2;
  }
   @media (min-width: 1024px) { /* lg */
     grid-column: span 3 / span 3;
  }

  font-size: 1.125rem; /* text-lg */
`;

const BannerCard = styled.div`
  position: relative;
  background-color: #ffffff;
  border-radius: 0.75rem; /* rounded-xl */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-lg */
  overflow: hidden;
  transform: scale(1);
  transition: transform 0.3s ease-in-out; /* transition-transform duration-300 */

  &:hover {
    transform: scale(1.05);
  }
`;

const BannerImageContainer = styled.div`
  position: relative;
`;

const BannerImage = styled.img`
  width: 100%;
  height: 16rem; /* h-64 */
  object-fit: cover;
`;

const BannerTypeBadge = styled.span`
  position: absolute;
  top: 1rem; /* top-4 */
  left: 1rem; /* left-4 */
  padding: 0.25rem 0.75rem; /* px-3 py-1 */
  font-size: 0.75rem; /* text-xs */
  font-weight: 600; /* font-semibold */
  color: #ffffff;
  border-radius: 9999px; /* rounded-full */
  background-color: ${(props) => (props.type === 'login_banner' ? '#38b2ac' : '#5a67d8')}; /* bg-teal-600 or bg-indigo-600 */
`;

const CardActions = styled.div`
  padding: 1.25rem; /* p-5 */
  display: flex;
  gap: 0.75rem; /* gap-3 */
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.5rem 1rem; /* py-2 px-4 */
  font-weight: 600; /* font-semibold */
  border-radius: 0.5rem; /* rounded-lg */
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1), 0 0 0 6px rgba(0, 0, 0, 0.05); /* focus:ring-2 focus:ring-offset-2 */
  }
  transition: all 0.2s ease-in-out;
`;

const EditButton = styled(ActionButton)`
  background-color: #4299e1; /* bg-blue-600 */
  color: #ffffff;
  &:hover {
    background-color: #3182ce; /* hover:bg-blue-700 */
  }
  &:focus {
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5), 0 0 0 6px rgba(66, 153, 225, 0.3); /* focus:ring-blue-600 */
  }
`;

const DeleteButton = styled(ActionButton)`
  background-color: #e53e3e; /* bg-red-600 */
  color: #ffffff;
  &:hover {
    background-color: #c53030; /* hover:bg-red-700 */
  }
  &:focus {
    box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.5), 0 0 0 6px rgba(229, 62, 62, 0.3); /* focus:ring-red-600 */
  }
`;


// --- React Component ---

const ImageControlPanel = () => {
  const [banners, setBanners] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [type, setType] = useState('login_banner');
  const [editingBanner, setEditingBanner] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

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

  // Fetch banners
  const fetchBanners = async () => {
    try {
      const response = await axios.get(`${baseURL}/bannersRegistration`);
      if (response.data.success) {
        setBanners(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch banners', { position: 'top-right', autoClose: 3000 });
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Handle file selection and preview
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  // Handle drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
      setError(null);
    } else {
      setError('Please drop a valid image file');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Clean up preview URL
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Handle image upload and save to database
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select or drop an image');
      return;
    }
    setLoading(true);
    try {
      const imageUrl = await handleImageUpload(file);
      const existingBanner = banners.find((banner) => banner.type === type);
      if (existingBanner) {
        await axios.put(`${baseURL}/bannersRegistration/${existingBanner._id}`, { url: imageUrl, type });
        toast.success('Banner updated successfully', { position: 'top-right', autoClose: 3000 });
      } else {
        await axios.post(`${baseURL}/bannersRegistration`, { url: imageUrl, type });
        toast.success('Banner created successfully', { position: 'top-right', autoClose: 3000 });
      }
      setError(null);
      setFile(null);
      setPreview(null);
      setType('login_banner');
      setEditingBanner(null);
      fetchBanners();
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create or update banner');
      toast.error(error.response?.data?.error || 'Failed to create or update banner', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle banner update
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!file && !editingBanner) {
      setError('Please select an image to update');
      return;
    }
    setLoading(true);
    try {
      let imageUrl = editingBanner.url;
      if (file) {
        imageUrl = await handleImageUpload(file);
      }
      const existingBanner = banners.find((banner) => banner.type === type && banner._id !== editingBanner._id);
      if (existingBanner) {
        setError(`A banner with type ${type} already exists`);
        toast.error(`A banner with type ${type} already exists`, { position: 'top-right', autoClose: 3000 });
        setLoading(false);
        return;
      }
      await axios.put(`${baseURL}/bannersRegistration/${editingBanner._id}`, { url: imageUrl, type });
      setError(null);
      setFile(null);
      setPreview(null);
      setType('login_banner');
      setEditingBanner(null);
      fetchBanners();
      if (fileInputRef.current) fileInputRef.current.value = '';
      toast.success('Banner updated successfully', { position: 'top-right', autoClose: 3000 });
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update banner');
      toast.error(error.response?.data?.error || 'Failed to update banner', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle banner delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseURL}/bannersRegistration/${id}`);
      fetchBanners();
      toast.success('Banner deleted successfully', { position: 'top-right', autoClose: 3000 });
    } catch (error) {
      toast.error('Failed to delete banner', { position: 'top-right', autoClose: 3000 });
    }
  };

  // Start editing a banner
  const startEditing = (banner) => {
    setEditingBanner(banner);
    setType(banner.type);
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <DashboardContainer>
      <ContentCard>
        <Header>
          {editingBanner ? 'Edit Banner' : 'Image Control Panel'}
        </Header>

        <Form onSubmit={editingBanner ? handleUpdate : handleSubmit}>
          <FormGrid>
            <FormSection>
              <Label>Upload Image</Label>
              <Dropzone onDrop={handleDrop} onDragOver={handleDragOver}>
                <FileInput
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
                <DropzoneText>
                  {file ? 'Image selected' : 'Drag & drop an image here or click to select'}
                </DropzoneText>
                {preview && (
                  <ImagePreview
                    src={preview}
                    alt="Preview"
                  />
                )}
              </Dropzone>
            </FormSection>
            <div>
              <Label>Banner Type</Label>
              <Select
                value={type}
                onChange={(e) => setType(e.target.value)}
                disabled={editingBanner}
              >
                <option value="login_banner">Login Banner</option>
                <option value="registration_banner">Registration Banner</option>
              </Select>
            </div>
            <ButtonGroup>
              <PrimaryButton
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : editingBanner ? (
                  'Update Banner'
                ) : banners.find((banner) => banner.type === type) ? (
                  'Replace Banner'
                ) : (
                  'Upload Banner'
                )}
              </PrimaryButton>
              {editingBanner && (
                <SecondaryButton
                  type="button"
                  onClick={() => startEditing(null)}
                >
                  Cancel
                </SecondaryButton>
              )}
            </ButtonGroup>
          </FormGrid>
          {error && (
            <ErrorMessage>{error}</ErrorMessage>
          )}
        </Form>

        <BannerListGrid>
          {banners.length === 0 && (
            <EmptyBannerMessage>
              No banners available. Upload one to get started!
            </EmptyBannerMessage>
          )}
          {banners.map((banner) => (
            <BannerCard
              key={banner._id}
            >
              <BannerImageContainer>
                <BannerImage
                  src={`http://localhost:8000/uploads/${banner.url}`}
                  alt={banner.type}
                />
                <BannerTypeBadge type={banner.type}>
                  {banner.type.replace('_', ' ').toUpperCase()}
                </BannerTypeBadge>
              </BannerImageContainer>
              <CardActions>
                <EditButton
                  onClick={() => startEditing(banner)}
                  aria-label={`Edit ${banner.type} banner`}
                >
                  Edit
                </EditButton>
                <DeleteButton
                  onClick={() => handleDelete(banner._id)}
                  aria-label={`Delete ${banner.type} banner`}
                >
                  Delete
                </DeleteButton>
              </CardActions>
            </BannerCard>
          ))}
        </BannerListGrid>
      </ContentCard>
    </DashboardContainer>
  );
};

export default ImageControlPanel;