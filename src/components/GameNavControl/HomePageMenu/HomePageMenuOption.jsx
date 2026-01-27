import React from 'react';
import styled from 'styled-components';
import home_menu_option_1 from "../../../assets/home_menu_option_1.png"



const OptionWrapper = styled.div`
 // height: 50px;
  background-color: white;
  border-radius: 5px;
  margin-bottom: 5px; 
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media (max-width: 768px) {
    padding: 10px;
    img {
      width: 50px;
    }
  }
  @media (min-width: 769px) {
    padding: 10px;
    img {
      width: 30px;
    }
  }
`;

const OptionText = styled.span`
  text-align: center;
`;

export default function HomePageMenuOption() {
  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // Example array to map over

  return (
    <div className='row mt-2 m-0 p-0'>
      {items.map((item, index) => (
        <div className='col-4 col-md-2 p-1 m-0' key={index}>
          <OptionWrapper>
            <img src={home_menu_option_1} alt={`Menu option ${item}`} />
            <OptionText>Item {item}</OptionText>
          </OptionWrapper>
        </div>
      ))}
    </div>
  );
}

