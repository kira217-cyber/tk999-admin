import React, { useEffect, useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import Auth from './pages/Auth';
import { authAPI } from './redux/auth/authAPI';
import { checkTokenStart, checkTokenSuccess, checkTokenFailure } from './redux/auth/authSlice';
import { ProSidebarProvider } from 'react-pro-sidebar';
import DemoSidebar from './components/layout/DemoSidebar';
import { baseURL, baseURL_For_IMG_UPLOAD } from './utils/baseURL';
// Loading animation keyframes
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// Styled components for loading screen
const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${fadeIn} 0.3s ease-in;
`;

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 6px solid #e2e8f0;
  border-top: 6px solid #5a67d8;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  margin-top: 1.5rem;
  color: #4a5568;
  font-size: 1.1rem;
  font-weight: 500;
`;

export default function App() {
  const { token, user, isLoading } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    if (token) {
      authAPI.checkToken(token, dispatch)
        .then(() => {
          // Optional: Handle success if needed
        })
        .catch(() => {
          // Optional: Handle error if needed
        });
    }
  }, [token]);


  


  if (isLoading) {
    return (
      <LoadingOverlay>
        <Spinner />
        <LoadingText>Loading Application...</LoadingText>
      </LoadingOverlay>
    );
  }

  return (
    <div>
      {token && user ?  <ProSidebarProvider>
        <DemoSidebar />
      </ProSidebarProvider> : <Auth />}
    </div>
  );
}