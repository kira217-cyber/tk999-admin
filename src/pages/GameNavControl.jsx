import React, { useState } from 'react';
import GameNavBarManager from '../components/GameNavControl/GameNavBarManager';
import MenuOptionManager from '../components/GameNavControl/MenuOptionManager';
import SubOptionManager from '../components/GameNavControl/SubOptionManager';
import HomeMenu from '../components/GameNavControl/HomePageMenu/HomeMenu.jsx';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEye, FaTimes } from 'react-icons/fa'; // Only for preview toggle

// Styled Components
const Container = styled.div`
  background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
  min-height: 100vh;
  padding: 1rem;
  font-family: 'Inter', sans-serif;

  @media (min-width: 768px) {
    padding: 1.5rem;
  }
`;

const Header = styled.header`
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
  padding: 1rem;
  margin-bottom: 1rem;
  text-align: center;

  @media (min-width: 768px) {
    padding: 1.25rem;
    margin-bottom: 1.5rem;
  }
`;

const Title = styled.h1`
  color: #1a237e;
  font-weight: 700;
  font-size: 1.5rem;
  margin: 0;

  @media (min-width: 768px) {
    font-size: 1.75rem;
  }
`;

const MainContent = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const PreviewToggle = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  background: linear-gradient(90deg, #0288d1, #01579b);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  text-transform: uppercase;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: background 0.3s ease;

  &:hover {
    background: linear-gradient(90deg, #01579b, #013966);
  }

  @media (min-width: 768px) {
    max-width: 300px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const PreviewSection = styled(motion.div)`
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
  padding: 1rem;
  margin-bottom: 1rem;
  overflow-x: auto;

  @media (min-width: 768px) {
    padding: 1.5rem;
  }
`;

const PreviewTitle = styled.h2`
  color: #1a237e;
  font-weight: 600;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  text-align: center;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const TabList = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0 0 1rem 0;
  border-bottom: 2px solid #dee2e6;
  overflow-x: auto;
  white-space: nowrap;
  justify-content: flex-start;
  margin-bottom: 0px;

  @media (min-width: 768px) {
    justify-content: center;
  }
`;

const TabItem = styled(motion.li)`
  margin: 0 0.25rem;

  @media (min-width: 768px) {
    margin: 0 0.5rem;
  }
`;

const TabButton = styled.button`
  background: ${(props) =>
    props.active ? 'linear-gradient(90deg, #0288d1, #01579b)' : '#fff'};
  color: ${(props) => (props.active ? '#fff' : '#1a237e')};
  border: none;
  border-radius: 8px 8px 0 0;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${(props) =>
      props.active
        ? 'linear-gradient(90deg, #01579b, #013966)'
        : '#f5f7fa'};
  }

  @media (min-width: 768px) {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }
`;

const TabContent = styled(motion.div)`
  background: transparent;
`;

export default function GameNavControl() {
  const [activeTab, setActiveTab] = useState('navbar');
  const [isPreviewOpen, setIsPreviewOpen] = useState(true); // Open by default on desktop

  const renderContent = () => {
    switch (activeTab) {
      case 'navbar':
        return <GameNavBarManager />;
      case 'menu':
        return <MenuOptionManager />;
      case 'sub':
        return <SubOptionManager />;
      default:
        return null;
    }
  };

  return (
    <Container>
      <Header>
        <Title>Navigation Control Panel</Title>
      </Header>
      <MainContent className="container">
        <AnimatePresence>
          {window.innerWidth >= 768 && (
            <>
              <PreviewToggle
              style={{display:"none"}}
                onClick={() => setIsPreviewOpen(!isPreviewOpen)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {isPreviewOpen ? (
                  <>
                    <FaTimes /> Hide Preview
                  </>
                ) : (
                  <>
                    <FaEye /> Show Preview
                  </>
                )}
              </PreviewToggle>
              {isPreviewOpen && (
                <PreviewSection
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{display:"none"}}
                >
                  <PreviewTitle>Live Preview</PreviewTitle>
                  <HomeMenu  />
                </PreviewSection>
              )}
            </>
          )}
        </AnimatePresence>
        <TabList>
          <TabItem 
          //whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          >
            <TabButton
              active={activeTab === 'navbar'}
              onClick={() => setActiveTab('navbar')}
            >
              Navbar
            </TabButton>
          </TabItem>
          <TabItem 
        //  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          >
            <TabButton
              active={activeTab === 'menu'}
              onClick={() => setActiveTab('menu')}
            >
              Menus
            </TabButton>
          </TabItem>
          <TabItem 
         // whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          >
            <TabButton
              active={activeTab === 'sub'}
              onClick={() => setActiveTab('sub')}
            >
              Sub Menus
            </TabButton>
          </TabItem>
        </TabList>
        <TabContent
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </TabContent>
      </MainContent>
    </Container>
  );
}