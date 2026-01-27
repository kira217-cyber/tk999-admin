import styled, { keyframes } from 'styled-components';

// Define a simple, smooth rotation keyframes
const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// A clean, professional loading spinner
const LoadingWrapper = styled.div`
  display: inline-block;
  width: 1.2em; /* Slightly smaller for subtlety */
  height: 1.2em;
  border-radius: 50%;
  border: 0.2em solid #e5e7eb; /* Light gray base for a neutral tone */
  border-top-color: #6b7280; /* Darker gray for a professional look */
  animation: ${spin} 1s linear infinite; /* Smooth, consistent spin */
`;

const IconWrapper = styled.div`
  font-size: clamp(1.5rem, 4vw, 3rem);
  color: rgb(255, 255, 255);
`;

const Card = styled.div`
  background: ${({ themeColor }) => `linear-gradient(88deg,#231f20 60%,${themeColor})`};
  color: rgb(255, 255, 255);
  padding: clamp(1rem, 2.5vw, 1.5rem);
  border-radius: 12px;
  width: 100%;
  max-width: clamp(200px, 25vw, 300px);
  min-height: clamp(100px, 15vw, 120px);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease-in-out;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  border: 1px solid #e8ecef;
  cursor: 'pointer';

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 7px 14px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08);
  }
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Value = styled.div`
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  font-weight: 700;
  color: rgb(255, 255, 255);
  margin-bottom: clamp(0.25rem, 1vw, 0.375rem);
`;

const Title = styled.div`
  font-size: clamp(0.75rem, 1.5vw, 0.875rem);
  font-weight: 500;
  color: rgb(221, 255, 68);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatCard = ({ title, value, icon, bgColor, textColor, themeColor, onClick }) => (
  <div onClick={onClick} className="col-6 col-md-3 p-2 d-flex justify-content-center">
    <Card
      themeColor={themeColor}
      style={{
        background: bgColor || undefined,
        color: textColor || undefined,
      }}
    >
      <TextWrapper>
        {value === 'Loading...' ? <LoadingWrapper className='mb-2' /> : <Value>{value}</Value>}
        <Title style={{ color: textColor || undefined }}>{title}</Title>
      </TextWrapper>
      <IconWrapper>{icon}</IconWrapper>
    </Card>
  </div>
);

export default StatCard;