import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FaUpload, FaTrash } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { getCarouselImages, updateCarouselImages } from '../redux/Frontend Control/CarouselControl/carouselControlAPI';
import { baseURL_For_IMG_DELETE, baseURL_For_IMG_UPLOAD } from '../utils/baseURL';

// Styled Components
const Container = styled.div.attrs({
  className: 'space-y-6 p-6',
})`
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  min-height: calc(100vh - 4rem);
  max-width: 1280px;
  margin: 0 auto;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

  @media (max-width: 1024px) {
    padding: 1.5rem;
  }
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.h1`
  font-size: 1.875rem;
  font-weight: 600;
  color: #1f2937;
  letter-spacing: -0.025em;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Card = styled.section`
  background: #ffffff;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Input = styled.input`
  width: 100%;
  height: 2.5rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  background: #f9fafb;
  padding: 0 0.75rem;
  font-size: 0.875rem;
  color: #1f2937;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  }

  &:disabled {
    background: #e5e7eb;
    cursor: not-allowed;
    opacity: 0.7;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.625rem 1rem;
  transition: all 0.3s ease;
  background: ${({ bg = '#6366f1' }) => bg};
  color: ${({ color = '#ffffff' }) => color};
  border: none;

  &:hover:not(:disabled) {
    background: ${({ hoverBg = '#4f46e5' }) => hoverBg};
    transform: scale(1.05);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
  }

  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    opacity: 0.7;
  }

  &.btn-icon {
    width: 2rem;
    height: 2rem;
    padding: 0;
  }

  &.btn-destructive {
    background: #ef4444;
    &:hover:not(:disabled) {
      background: #dc2626;
    }
  }
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin: 1rem 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ImageContainer = styled.div`
  flex: 1;
  text-align: center;
`;

const DeleteButton = styled(Button)`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 10;
`;

const UploadButton = styled(Button)`
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(90deg, #34d399 0%, #6ee7b7 100%);
  color: #1f2937;
  font-weight: 600;
  border-radius: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover:not(:disabled) {
    background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:focus {
    box-shadow: 0 0 0 3px rgba(52, 211, 153, 0.3);
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
    font-size: 0.85rem;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ControlPanel = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin: 1rem 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
`;

const Switch = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #1f2937;
  cursor: pointer;

  input {
    accent-color: #6366f1;
    width: 2rem;
    height: 1rem;
  }
`;

const UpdateButton = styled(Button)`
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%);
  color: #ffffff;
  font-weight: 600;
  border-radius: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover:not(:disabled) {
    background: linear-gradient(90deg, #4338ca 0%, #6d28d9 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:focus {
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.3);
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
    font-size: 0.85rem;
  }
`;

const ErrorMessage = styled.div`
  color: #b91c1c;
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: #fef2f2;
  border-radius: 0.5rem;
  border: 1px solid #fee2e2;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
`;

const Spinner = styled.div`
  border: 4px solid #e5e7eb;
  border-top: 4px solid #6366f1;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ImagePair = styled.article`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #f9fafb;
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  position: relative;
  transition: background 0.3s ease;

  &:hover {
    background: #f1f5f9;
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  max-width: 100%;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const CarouselControl = () => {
  const {
    images = [],
    isActive: storeIsActive = false,
    interval: storeInterval = 3000,
    infiniteLoop: storeInfiniteLoop = true,
    autoPlay: storeAutoPlay = true,
    isLoading,
    isError,
    errorMessage = 'An error occurred',
    _id,
  } = useSelector((state) => state.homePageCarousel);

  const dispatch = useDispatch();

  const [currentImages, setCurrentImages] = useState(images);
  const [imageFiles, setImageFiles] = useState({ mobile: [], desktop: [] });
  const [previews, setPreviews] = useState({ mobile: [], desktop: [] });
  const [isActive, setIsActive] = useState(storeIsActive);
  const [interval, setInterval] = useState(storeInterval);
  const [infiniteLoop, setInfiniteLoop] = useState(storeInfiniteLoop);
  const [autoPlay, setAutoPlay] = useState(storeAutoPlay);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const mobileInputRef = useRef(null);
  const desktopInputRef = useRef(null);

  useEffect(() => {
    dispatch(getCarouselImages());
  }, [dispatch]);

  useEffect(() => {
    setIsActive(storeIsActive);
    setInterval(storeInterval);
    setInfiniteLoop(storeInfiniteLoop);
    setAutoPlay(storeAutoPlay);
    setCurrentImages(images);
  }, [storeIsActive, storeInterval, storeInfiniteLoop, storeAutoPlay, images]);

  // Validate files for type and size only
  const validateFiles = useCallback((files) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validatedFiles = [];
    const errors = [];

    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        errors.push(`${file.name}: Invalid file type. Only JPG/PNG allowed.`);
        continue;
      }
      if (file.size > maxSize) {
        errors.push(`${file.name}: File size exceeds 5MB.`);
        continue;
      }
      validatedFiles.push(file);
    }

    return { validatedFiles, errors };
  }, []);

  // Handle file change
  const handleFileChange = useCallback(
    (type) => async (e) => {
      const files = Array.from(e.target.files);
      if (!files.length) return;

      const { validatedFiles, errors } = validateFiles(files);
      if (errors.length > 0) {
        setError(errors.join(' '));
        return;
      }

      setError(null);
      setImageFiles((prev) => ({
        ...prev,
        [type]: [...prev[type], ...validatedFiles],
      }));

      const newPreviews = await Promise.all(
        validatedFiles.map(
          (file) =>
            new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(file);
            })
        )
      );

      setPreviews((prev) => ({
        ...prev,
        [type]: [...prev[type], ...newPreviews],
      }));
    },
    [validateFiles]
  );

  // Delete image from server
  const deleteImageFromServer = useCallback(async (filename) => {
    try {
      const response = await fetch(baseURL_For_IMG_DELETE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete image');
      }
      return true;
    } catch (error) {
      console.error('Image deletion error:', error);
      throw error;
    }
  }, []);

  // Handle removing current image
  const handleRemoveCurrentImage = useCallback(
    async (index) => {
      try {
        const imageToRemove = currentImages[index];
        // Delete both mobile and desktop images from server
        await Promise.all([
          imageToRemove.mobile ? deleteImageFromServer(imageToRemove.mobile) : Promise.resolve(),
          imageToRemove.desktop ? deleteImageFromServer(imageToRemove.desktop) : Promise.resolve(),
        ]);

        // Update local state
        const updatedImages = currentImages.filter((_, i) => i !== index);
        setCurrentImages(updatedImages);

        // Update database
        await dispatch(
          updateCarouselImages({
            id: _id,
            images: updatedImages,
            isActive,
            interval: Number(interval),
            infiniteLoop,
            autoPlay,
          })
        ).unwrap();

        alert('Image pair deleted successfully');
      } catch (error) {
        setError(error.message || 'Failed to delete image pair');
      }
    },
    [currentImages, _id, isActive, interval, infiniteLoop, autoPlay, dispatch, deleteImageFromServer]
  );

  // Handle removing new (preview) image
  const handleRemoveNewImage = useCallback((index) => {
    setImageFiles((prev) => ({
      mobile: prev.mobile.filter((_, i) => i !== index),
      desktop: prev.desktop.filter((_, i) => i !== index),
    }));
    setPreviews((prev) => ({
      mobile: prev.mobile.filter((_, i) => i !== index),
      desktop: prev.desktop.filter((_, i) => i !== index),
    }));
  }, []);

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

  const handleUpdate = useCallback(
    async (e) => {
      e.preventDefault();
      setUploading(true);
      setError(null);

      try {
        let updatedImages = [...currentImages];

        if (imageFiles.mobile.length || imageFiles.desktop.length) {
          if (imageFiles.mobile.length !== imageFiles.desktop.length) {
            throw new Error('Please upload an equal number of mobile and desktop images');
          }

          const [mobileUrls, desktopUrls] = await Promise.all([
            Promise.all(imageFiles.mobile.map(handleImageUpload)),
            Promise.all(imageFiles.desktop.map(handleImageUpload)),
          ]);

          const newImages = mobileUrls
            .map((mobileUrl, index) => ({
              mobile: mobileUrl,
              desktop: desktopUrls[index],
            }))
            .filter((img) => img.mobile && img.desktop);

          updatedImages = [...updatedImages, ...newImages];
        }

        await dispatch(
          updateCarouselImages({
            id: _id,
            images: updatedImages,
            isActive,
            interval: Number(interval),
            infiniteLoop,
            autoPlay,
          })
        ).unwrap();

        setImageFiles({ mobile: [], desktop: [] });
        setPreviews({ mobile: [], desktop: [] });
        alert('Carousel updated successfully');
      } catch (error) {
        setError(error.message || 'Failed to update carousel');
      } finally {
        setUploading(false);
      }
    },
    [
      currentImages,
      imageFiles,
      isActive,
      interval,
      infiniteLoop,
      autoPlay,
      _id,
      dispatch,
      handleImageUpload,
    ]
  );

  if (isLoading) {
    return (
      <Container>
        <LoadingContainer>
          <Spinner aria-label="Loading" />
        </LoadingContainer>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container>
        <ErrorMessage role="alert">{errorMessage}</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Slider Images
        </h2>
        <ImageGrid>
          {currentImages.map((image, index) => (
            <ImagePair key={`current-${index}`}>
              <ImageContainer>
                <small className="text-xs text-gray-600 block mb-1.5">
                  Mobile
                </small>
                <PreviewImage
                  src={`${baseURL_For_IMG_UPLOAD}s/${image.mobile}`}
                  alt={`Mobile image ${index + 1}`}
                />
              </ImageContainer>
              <ImageContainer>
                <small className="text-xs text-gray-600 block mb-1.5">
                  Desktop
                </small>
                <PreviewImage
                  src={`${baseURL_For_IMG_UPLOAD}s/${image.desktop}`}
                  alt={`Desktop image ${index + 1}`}
                />
              </ImageContainer>
              <DeleteButton
                className="btn-icon btn-destructive"
                onClick={() => handleRemoveCurrentImage(index)}
                aria-label={`Remove image pair ${index + 1}`}
                title="Remove image pair"
              >
                <FaTrash size={12} />
              </DeleteButton>
            </ImagePair>
          ))}
        </ImageGrid>
      </Card>

      <form onSubmit={handleUpdate} aria-label="Carousel settings form">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Carousel Settings
          </h2>
          <ControlPanel>
            <ControlGroup>
              <Label htmlFor="interval">
                Interval (ms) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="interval"
                type="number"
                value={interval}
                onChange={(e) => setInterval(Number(e.target.value))}
                min="1000"
                step="100"
                required
                aria-describedby="interval-desc"
              />
              <small id="interval-desc" className="text-xs text-gray-600">
                Time between slides
              </small>
            </ControlGroup>
            <ControlGroup>
              <Switch>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  id="isActive"
                  aria-label="Toggle carousel active state"
                />
                <Label htmlFor="isActive">Active</Label>
              </Switch>
            </ControlGroup>
            <ControlGroup>
              <Switch>
                <input
                  type="checkbox"
                  checked={infiniteLoop}
                  onChange={(e) => setInfiniteLoop(e.target.checked)}
                  id="infiniteLoop"
                  aria-label="Toggle infinite loop"
                />
                <Label htmlFor="infiniteLoop">Infinite Loop</Label>
              </Switch>
            </ControlGroup>
            <ControlGroup>
              <Switch>
                <input
                  type="checkbox"
                  checked={autoPlay}
                  onChange={(e) => setAutoPlay(e.target.checked)}
                  id="autoPlay"
                  aria-label="Toggle auto play"
                />
                <Label htmlFor="autoPlay">Auto Play</Label>
              </Switch>
            </ControlGroup>
          </ControlPanel>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Upload New Images
          </h2>
          <ImageGrid>
            {previews.mobile.map((mobilePreview, index) => (
              <ImagePair key={`preview-${index}`}>
                <ImageContainer>
                  <small className="text-xs text-gray-600 block mb-1.5">
                    Mobile Preview
                  </small>
                  <PreviewImage
                    src={mobilePreview}
                    alt={`Mobile preview ${index + 1}`}
                  />
                </ImageContainer>
                <ImageContainer>
                  <small className="text-xs text-gray-600 block mb-1.5">
                    Desktop Preview
                  </small>
                  <PreviewImage
                    src={previews.desktop[index]}
                    alt={`Desktop preview ${index + 1}`}
                  />
                </ImageContainer>
                <DeleteButton
                  className="btn-icon btn-destructive"
                  onClick={() => handleRemoveNewImage(index)}
                  aria-label={`Remove preview pair ${index + 1}`}
                  title="Remove preview pair"
                >
                  <FaTrash size={12} />
                </DeleteButton>
              </ImagePair>
            ))}
          </ImageGrid>

          <div className="d-flex justify-content-between">
            <div>
              <UploadButton
                type="button"
                onClick={() => mobileInputRef.current.click()}
                disabled={uploading}
                aria-label="Upload mobile images"
              >
                <FaUpload size={14} />
                {uploading ? 'Uploading...' : 'Mobile Images'}
              </UploadButton>
              <HiddenFileInput
                type="file"
                ref={mobileInputRef}
                accept="image/jpeg,image/png,image/jpg"
                multiple
                onChange={handleFileChange('mobile')}
                disabled={uploading}
                aria-label="Mobile image file input"
              />
            </div>
            <div>
              <UploadButton
                type="button"
                onClick={() => desktopInputRef.current.click()}
                disabled={uploading}
                aria-label="Upload desktop images"
              >
                <FaUpload size={14} />
                {uploading ? 'Uploading...' : 'Desktop Images'}
              </UploadButton>
              <HiddenFileInput
                type="file"
                ref={desktopInputRef}
                accept="image/jpeg,image/png,image/jpg"
                multiple
                onChange={handleFileChange('desktop')}
                disabled={uploading}
                aria-label="Desktop image file input"
              />
            </div>
          </div>
          <div className='mb-5 mt-3'>
            <UpdateButton
              type="submit"
              disabled={uploading}
              aria-label="Update carousel settings"
            >
              {uploading ? 'Updating...' : 'Update Carousel'}
            </UpdateButton>
          </div>

          {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
        </Card>
      </form>
    </Container>
  );
};

export default CarouselControl;