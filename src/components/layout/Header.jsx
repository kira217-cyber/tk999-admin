import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { FaBell, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import Sidebar from './Sidebar'; // Import Sidebar to control its state

const HeaderWrapper = styled.div`
  background:  #1c2937;
  padding: 15px 30px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: static;

  @media (max-width: 768px) {
    flex-direction: row;
    align-items: center;
    padding: 15px;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
  }
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: row;
    align-items: center;
    gap: 10px;
  }
`;

const Title = styled.h4`
  margin: 0;
  color:rgb(255, 255, 255);
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const SelectedOption = styled.span`
  color:rgb(188, 188, 188);
  font-size: 16px;
  font-weight: 500;

  @media (max-width: 768px) {
    display: none;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    margin-top: 0;
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  color:rgb(255, 255, 255);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: #3498db;
  }

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const Header = ({ toggleSidebar, selectedOption, collapseSidebar, setIsMobileSidebarOpen, isMobileSidebarOpen }) => {
  return (
    <>
      <HeaderWrapper>
        <TitleSection>
          <IconButton onClick={() => {
            window.innerWidth <= 768 ? setIsMobileSidebarOpen(!isMobileSidebarOpen) : collapseSidebar()
          }}>
            <FaBars />
          </IconButton>
          <div>
            <Title>{selectedOption}</Title>
            <SelectedOption>Welcome to Mothers Admin Panel</SelectedOption>
          </div>
        </TitleSection>
        <UserSection>
          <IconButton>
            <FaBell />
          </IconButton>
          <IconButton>
            <FaUserCircle />
          </IconButton>
        </UserSection>
      </HeaderWrapper>
    </>
  );
};

export default Header;

