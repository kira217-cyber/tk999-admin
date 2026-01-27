import React, { useLayoutEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from '../Sidebar.jsx';
import Header from '../Header.jsx';
import MobileSidebar from '../MobileSidebar.js';
import AppRoutes from '../../../routes/AppRoutes.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import styled from 'styled-components';
import DemoSidebar from '../DemoSidebar.jsx';

const AppWrapper = styled.div`
  height: 100vh;
  background: #f5f7fa;
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
`;

const MainLayout = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

const SidebarWrapper = styled.div`
  height: 100%;
  width: ${props => (props.collapsed ? '80px' : '260px')};
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  transition: width 0.3s ease;
  background: #ffffff;

  @media (max-width: 768px) {
    display: none;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-left: ${props => (props.collapsed ? '80px' : '260px')};
  margin: 1rem;
  overflow: hidden;
  transition: margin-left 0.3s ease;

  @media (max-width: 768px) {
    margin: 0;
    border-radius: 0;
  }
`;

const ContentBody = styled.div`
  flex: 1;
  padding: 1.5rem;
  background: #f5f5f5;
  overflow-y: auto;
  overflow-x: hidden;
`;

const Layout = () => {
  const [selectedOption, setSelectedOption] = useState('Dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileClosed, setMobileClosed] = useState(true);

  const handleMenuSelect = (option) => {
    setSelectedOption(option);
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    if (window.innerWidth <= 768) {
      setMobileClosed(!mobileClosed);
    }
  };

  useLayoutEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setCollapsed(false);
        setMobileClosed(true);
      } else {
        setMobileClosed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <AppWrapper>
      <Router>
        <MainLayout>
          {/* Desktop Sidebar */}
          <SidebarWrapper collapsed={collapsed}>
            <DemoSidebar />
          </SidebarWrapper>

          {/* Mobile Sidebar */}
          <MobileSidebar
            open={!mobileClosed}
            onClose={() => setMobileClosed(true)}
            handleMenuSelect={handleMenuSelect}
          />

          {/* Main Content */}
          <ContentArea collapsed={collapsed}>
            <Header
              toggleSidebar={toggleSidebar}
              handleMenuSelect={handleMenuSelect}
              selectedOption={selectedOption}
              collapsed={collapsed}
              mobileClosed={mobileClosed}
            />
            <ContentBody>
              <AppRoutes />
            </ContentBody>
          </ContentArea>
        </MainLayout>
      </Router>
    </AppWrapper>
  );
};

export default Layout;