import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllNotices, updateNotice } from '../redux/Frontend Control/Notice Control/noticeControlAPI';
import styled from 'styled-components';
import { toast } from 'react-hot-toast';

// Styled Components
const DashboardCard = styled.div`
  border: none;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  background: #ffffff;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-4px);
  }
`;

const StyledButton = styled.button`
  border-radius: 8px;
  padding: 10px 24px;
  font-weight: 600;
  background-color: #0d6efd;
  border: none;
  color: #ffffff;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #0a58ca;
    transform: scale(1.02);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const FormLabel = styled.label`
  font-weight: 500;
  color: #212529;
  font-size: 0.95rem;
`;

const ErrorAlert = styled.div`
  border-radius: 8px;
  font-size: 0.9rem;
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  animation: slideIn 0.3s ease-in-out;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 1.5rem 0;
`;

export default function NoticeControl() {
  const dispatch = useDispatch();
  const noticeControl = useSelector((state) => state.noticeControl);

  const [title, setTitle] = useState('');
  const [titleBD, setTitleBD] = useState('');
  const [emoji, setEmoji] = useState('');
  const [active, setActive] = useState(false);

  // Fetch notices on mount
  useEffect(() => {
    dispatch(getAllNotices());
  }, [dispatch]);

  // Sync form state with Redux store
  useEffect(() => {
    console.log('Notice Control State:', noticeControl);
    setTitle(noticeControl?.title || '');
    setTitleBD(noticeControl?.titleBD || '');
    setEmoji(noticeControl?.emoji || '');
    setActive(noticeControl?.active || false);
  }, [noticeControl]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        updateNotice({
          title,
          titleBD,
          emoji,
          active,
        })
      );
      toast.success('Notice updated successfully.');
    } catch (error) {
      console.error('Update Error:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  // Show loading toast
  useEffect(() => {
    if (noticeControl.isLoading) {
      toast.loading('Updating notice...');
    } else if (noticeControl.isError) {
      toast.error(noticeControl.errorMessage || 'An error occurred. Please try again.');
    } else if (noticeControl.isSuccess) {
      toast.success(noticeControl.successMessage || 'Notice updated successfully.');
    }
  }, [noticeControl]);

  return (
    <div className="container-fluid py-4 py-md-5 bg-light min-vh-100">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-6">
          <DashboardCard className="card p-4 p-md-5">
            <h2 className="text-center mb-4 fw-bold text-dark">
              Notice Control Panel
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <FormLabel>Title (English)</FormLabel>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter notice title"
                  className="form-control rounded-3"
                  required
                />
              </div>

              <div className="mb-3">
                <FormLabel>Title (Bangla)</FormLabel>
                <input
                  type="text"
                  value={titleBD}
                  onChange={(e) => setTitleBD(e.target.value)}
                  placeholder="Enter notice title in Bangla"
                  className="form-control rounded-3"
                />
              </div>

              <div className="mb-3">
                <FormLabel>Emoji</FormLabel>
                <input
                  type="text"
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                  placeholder="Enter emoji (e.g., 😊)"
                  className="form-control rounded-3"
                />
              </div>

              <div className="mb-4 form-check">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="form-check-input"
                  id="activeCheck"
                />
                <label className="form-check-label text-dark" htmlFor="activeCheck">
                  Active
                </label>
              </div>

              <div className="d-flex justify-content-center">
                <StyledButton
                  type="submit"
                  disabled={noticeControl.isLoading}
                  className="btn w-100 w-md-50"
                >
                  {noticeControl.isLoading ? 'Updating...' : 'Update Notice'}
                </StyledButton>
              </div>
            </form>

            {noticeControl.isLoading && (
              <LoadingContainer>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </LoadingContainer>
            )}

            {noticeControl.isError && (
              <ErrorAlert>
                {noticeControl.errorMessage || 'An error occurred. Please try again.'}
              </ErrorAlert>
            )}
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}

