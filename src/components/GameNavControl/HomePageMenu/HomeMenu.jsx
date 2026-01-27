import React, { useState } from 'react';
import styled from 'styled-components';
import home_menu_1 from "../../../assets/home_menu_1.png";
import home_menu_1_blue from "../../../assets/home_menu_1_blue.png";
import HomePageMenuOption from './HomePageMenuOption.jsx';



const MenuContainer = styled.div`
margin-top: 20px;
  width: 100%;
  height: 70px; // Ensure consistent height
  padding: 0 16px;  // Remove extra padding on top/bottom
  background-color: #F7B704;
  overflow-x: auto;
  overflow-y: hidden; // Prevent vertical scroll
  scrollbar-width: thin;
  scrollbar-color: #054EA1 #F7B704;
  display: flex;
  align-items: center;  // Center items vertically
  border-radius: 5px;
  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #F7B704;
  }

  &::-webkit-scrollbar-thumb {
    background: #054EA1;
    border-radius: 3px;
  }

  @media (max-width: 768px) {
    height: auto;
    border-radius: 5px;
  }
`;


const MenuWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 0rem;
  max-width: 1200px;
  margin: 0;
  flex-wrap: nowrap;
  white-space: nowrap; // Prevents items from wrapping


  @media (max-width: 768px) {
    justify-content: flex-start;
    gap: 0.5rem;

  }
`;

const MenuItem = styled.div`
  padding: 20px;
  margin: 5px;
  height: 100%; // Ensure it takes full height
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: ${props => props.isActive ? '#054EA1' : '#F7B704'};
  color: ${props => props.isActive ? '#F7B704' : '#054EA1'};
  padding: 0 12px; // Adjust horizontal padding only
  border-radius: 6px;
  min-width: 90px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    background-color: ${props => props.isActive ? '#0861d6' : '#F7B704'};
  }

  @media (max-width: 768px) {
    padding: 10px;
  }

  @media (max-width: 480px) {
    min-width: 60px;
  }
`;



const MenuImage = styled.img`
  width: 24px;  // Increase for desktop
  height: 24px;
  display: block;
  margin: 0 auto 0.4rem;

  @media (max-width: 768px) {
    width: 24px;  
    height: 24px;
  }

  @media (max-width: 480px) {
    width: 20px;
    height: 20px;
    margin-bottom: 0.2rem;
  }
`;


const MenuText = styled.div`
  font-size: 12px;  // Make it larger on desktop
  font-family: 'Arial', sans-serif;
  font-weight: 700;
  white-space: nowrap;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 12px;
    font-weight: 700;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    font-weight: 700;
  }
`;


export default function HomeMenu() {
  const [activeIndex, setActiveIndex] = useState(0);

  const menuItems = [
    { title: "Dashboard" },
    { title: "Analytics" },
    { title: "Reports" },
    { title: "Settings" },
    { title: "Users" },
    { title: "Projects" },
    { title: "Tasks" },
    { title: "Calendar" },
   ];

  const handleItemClick = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div>
    <MenuContainer>
    <MenuWrapper>
      {menuItems.map((item, index) => (
        <MenuItem 
          key={index}
          isActive={index === activeIndex}
          onClick={() => handleItemClick(index)}
        >
          <MenuImage 
            src={index === activeIndex ? home_menu_1 : home_menu_1_blue}
            alt={`${item.title} icon`}
          />
          <MenuText>{item.title}</MenuText>
        </MenuItem>
      ))}
    </MenuWrapper>
  </MenuContainer>
  <HomePageMenuOption />
    </div>

  );
}