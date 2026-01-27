import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaMoneyBill,
  FaEdit,
  FaUserShield,
  FaChartLine,
  FaChevronRight,
} from "react-icons/fa";
import UserDetailsEditProfile from "../components/userDetailsEditProfile/userDetailsEditProfile";
import { baseURL_For_IMG_UPLOAD, API_URL } from "../utils/baseURL";

// Colorful & Modern Styled Components
const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  padding: 2rem;
  gap: 1.5rem;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%);
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
  }
`;

const Sidebar = styled.div`
  flex: 0 0 22rem;
  background: #ffffff;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 15px 35px rgba(99, 86, 246, 0.15);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  @media (max-width: 768px) {
    flex: none;
    width: 100%;
    padding: 1.5rem;
  }
`;

const MainContent = styled.div`
  flex: 1;
  background: #ffffff;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 15px 35px rgba(99, 86, 246, 0.15);
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  margin-bottom: 2rem;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  border-radius: 1rem;
  color: #ffffff;
  box-shadow: 0 10px 20px rgba(99, 86, 246, 0.2);
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SummaryCard = styled.div`
  padding: 1.25rem;
  background: linear-gradient(135deg, #1e293b, #334155);
  border-radius: 1rem;
  text-align: center;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(30, 41, 59, 0.2);
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(30, 41, 59, 0.3);
  }
`;

const SummaryLabel = styled.div`
  font-size: 0.925rem;
  font-weight: 500;
  opacity: 0.9;
`;

const SummaryValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
`;

const ProfileImage = styled.div`
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #6366f1;
  box-shadow: 0 10px 25px rgba(99, 86, 246, 0.3);
`;

const StatusBadge = styled.span`
  padding: 0.5rem 1.25rem;
  border-radius: 9999px;
  font-size: 0.925rem;
  font-weight: 600;
  text-transform: capitalize;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  ${({ status }) => {
    switch (status) {
      case "active":
        return `background: linear-gradient(90deg, #10b981, #34d399);`;
      case "inactive":
        return `background: linear-gradient(90deg, #ef4444, #f87171);`;
      default:
        return `background: linear-gradient(90deg, #6b7280, #9ca3af);`;
    }
  }}
  color: #ffffff;
`;

const InfoSection = styled.div`
  margin-bottom: 2.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.375rem;
  font-weight: 700;
  color: #4f46e5;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InfoGrid = styled.div`
  display: grid;
  gap: 1.25rem;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 1rem;
  background: linear-gradient(135deg, #f8fafc, #e0e7ff);
  border: 2px solid #c7d2fe;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(99, 86, 246, 0.2);
  }
`;

const IconWrapper = styled.span`
  color: #6366f1;
  font-size: 1.5rem;
  padding: 0.75rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #eef2ff, #c7d2fe);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 15px rgba(99, 86, 246, 0.2);
`;

const Label = styled.span`
  font-weight: 700;
  color: #4f46e5;
  min-width: 1rem;
`;

const Value = styled.span`
  color: #334155;
  word-break: break-word;
  font-weight: 500;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 3rem;
  padding: 0 1.75rem;
  border-radius: 0.75rem;
  background: linear-gradient(90deg, #dc2626, #ef4444);
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  outline: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(220, 38, 38, 0.3);
  svg {
    margin-right: 0.75rem;
  }
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(220, 38, 38, 0.4);
    background: linear-gradient(90deg, #b91c1c, #dc2626);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: #6366f1;
  font-size: 1.5rem;
  font-weight: 600;
  background: linear-gradient(135deg, #f8fafc, #e0e7ff);
  gap: 1rem;
`;

const StyledSpinner = styled.div`
  border: 6px solid #e0e7ff;
  border-top: 6px solid #6366f1;
  border-right: 6px solid #ec4899;
  border-radius: 50%;
  width: 4rem;
  height: 4rem;
  animation: spin 1s linear infinite;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ErrorAlert = styled.div`
  padding: 2rem;
  background: linear-gradient(90deg, #fee2e2, #fecaca);
  color: #dc2626;
  border-radius: 1rem;
  text-align: center;
  margin: 2rem;
  font-weight: 700;
  font-size: 1.125rem;
  box-shadow: 0 15px 35px rgba(220, 38, 38, 0.15);
  border: 2px solid #fca5a5;
`;

const PhoneNumberContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PhoneNumberWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  padding: 4px;
  border-radius: 0.75rem;
  border: 2px solid #86efac;
`;

const PhoneNumber = styled.span`
  font-size: 1.125rem;
  font-weight: 600;
  color: #166534;
`;

const HistoryTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 1rem;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);

  th {
    background: linear-gradient(90deg, #4f46e5, #7c3aed);
    color: #ffffff;
    padding: 1rem 1.25rem;
    text-align: left;
    font-weight: 600;
  }

  td {
    padding: 1rem 1.25rem;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
  }

  tr:hover td {
    background: linear-gradient(90deg, #eef2ff, #fdf4ff);
  }
`;

const NoHistoryMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6366f1;
  font-size: 1.25rem;
  font-weight: 600;
  background: linear-gradient(135deg, #f8fafc, #e0e7ff);
  border-radius: 1rem;
  border: 2px dashed #a78bfa;
`;

export default function UserDetails() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/api/users/${userId}`)
      .then((res) => {
        setUserInfo(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load user data");
        setLoading(false);
      });
  }, [userId]);

  useEffect(() => {
    if (userInfo?.profileImage) {
      console.log(`${baseURL_For_IMG_UPLOAD}s/${userInfo.profileImage}`);
    }
  }, [userInfo]);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (loading) {
    return (
      <LoadingContainer>
        <StyledSpinner />
        <div>Loading User Data...</div>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <ErrorAlert>
          <strong>Error:</strong> {error}
        </ErrorAlert>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Sidebar>
        <SummaryCard>
          <SummaryLabel>Profile Image</SummaryLabel>
          <ProfileImage>
            {userInfo?.profileImage ? (
              <img
                src={`${baseURL_For_IMG_UPLOAD}s/${userInfo.profileImage}`}
                alt="Profile"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  e.target.src =
                    "https://cdn-icons-png.freepik.com/512/8532/8532963.png";
                }}
              />
            ) : (
              <FaUser size={48} color="#6366f1" />
            )}
          </ProfileImage>
        </SummaryCard>

        <SummaryCard>
          <SummaryLabel>Username</SummaryLabel>
          <SummaryValue>{userInfo?.username || "-"}</SummaryValue>
        </SummaryCard>

        <SummaryCard>
          <SummaryLabel>Balance</SummaryLabel>
          <SummaryValue>
            {userInfo?.balance !== undefined
              ? userInfo.balance.toFixed(2)
              : "-"}
          </SummaryValue>
        </SummaryCard>

        <SummaryCard>
          <SummaryLabel>Status</SummaryLabel>
          <StatusBadge status={userInfo?.isActive ? "active" : "inactive"}>
            {userInfo?.isActive ? "Active" : "Deactive"}
          </StatusBadge>
        </SummaryCard>
      </Sidebar>

      <MainContent>
        {isEditing ? (
          <UserDetailsEditProfile
            userInfo={userInfo}
            onCancel={handleCancelEdit}
          />
        ) : (
          <>
            <Header>
              <Title>
                <FaChartLine /> User Dashboard
              </Title>
              <ButtonContainer>
                <ActionButton onClick={handleEditProfile}>
                  <FaEdit /> Edit Profile
                </ActionButton>
              </ButtonContainer>
            </Header>

            <InfoSection>
              <SectionTitle>Personal Information</SectionTitle>
              <InfoGrid>
                <InfoItem>
                  <IconWrapper>
                    <FaUser />
                  </IconWrapper>
                  <Label>ID:</Label>
                  <Value>{userInfo?._id || "-"}</Value>
                </InfoItem>
                <InfoItem>
                  <IconWrapper>
                    <FaUser />
                  </IconWrapper>
                  <Label>Username:</Label>
                  <Value>{userInfo?.username || "-"}</Value>
                </InfoItem>
                <InfoItem>
                  <IconWrapper>
                    <FaEnvelope />
                  </IconWrapper>
                  <Label>Email:</Label>
                  <Value>{userInfo?.email || "-"}</Value>
                </InfoItem>
                <InfoItem>
                  <IconWrapper>
                    <FaPhone />
                  </IconWrapper>
                  <Label>Phone:</Label>
                  <Value>
                    <PhoneNumberContainer>
                      <PhoneNumberWrapper>
                        <PhoneNumber>{userInfo?.whatsapp || "-"}</PhoneNumber>
                      </PhoneNumberWrapper>
                    </PhoneNumberContainer>
                  </Value>
                </InfoItem>
                <InfoItem>
                  <IconWrapper>
                    <FaUserShield />
                  </IconWrapper>
                  <Label>Role:</Label>
                  <Value>{userInfo?.role || "-"}</Value>
                </InfoItem>
                <InfoItem>
                  <IconWrapper>
                    <FaUserShield />
                  </IconWrapper>
                  <Label>Status:</Label>
                  <Value>{userInfo?.isActive ? "Active" : "Inactive"}</Value>
                </InfoItem>
                <InfoItem>
                  <IconWrapper>
                    <FaUser />
                  </IconWrapper>
                  <Label>Referral Code:</Label>
                  <Value>{userInfo?.referralCode || "-"}</Value>
                </InfoItem>
                <InfoItem>
                  <IconWrapper>
                    <FaUser />
                  </IconWrapper>
                  <Label>Referred By:</Label>
                  <Value>{userInfo?.referredBy?.$oid || "-"}</Value>
                </InfoItem>
              </InfoGrid>
            </InfoSection>

            <InfoSection>
              <SectionTitle>Financial Information</SectionTitle>
              <InfoGrid>
                <InfoItem>
                  <IconWrapper>
                    <FaMoneyBill />
                  </IconWrapper>
                  <Label>Balance:</Label>
                  <Value>
                    {userInfo?.balance !== undefined
                      ? userInfo.balance.toFixed(2)
                      : "-"}
                  </Value>
                </InfoItem>
                <InfoItem>
                  <IconWrapper>
                    <FaMoneyBill />
                  </IconWrapper>
                  <Label>Commission Balance:</Label>
                  <Value>
                    {userInfo?.commissionBalance !== undefined
                      ? userInfo.commissionBalance.toFixed(2)
                      : "-"}
                  </Value>
                </InfoItem>
              </InfoGrid>
            </InfoSection>

            <InfoSection>
              <SectionTitle>Commissions</SectionTitle>
              <InfoGrid>
                <InfoItem>
                  <IconWrapper>
                    <FaMoneyBill />
                  </IconWrapper>
                  <Label>Game Loss Commission:</Label>
                  <Value>
                    {userInfo?.gameLossCommission !== undefined
                      ? userInfo.gameLossCommission.toFixed(2)
                      : "-"}
                  </Value>
                </InfoItem>
                <InfoItem>
                  <IconWrapper>
                    <FaMoneyBill />
                  </IconWrapper>
                  <Label>Deposit Commission:</Label>
                  <Value>
                    {userInfo?.depositCommission !== undefined
                      ? userInfo.depositCommission.toFixed(2)
                      : "-"}
                  </Value>
                </InfoItem>
                <InfoItem>
                  <IconWrapper>
                    <FaMoneyBill />
                  </IconWrapper>
                  <Label>Refer Commission:</Label>
                  <Value>
                    {userInfo?.referCommission !== undefined
                      ? userInfo.referCommission.toFixed(2)
                      : "-"}
                  </Value>
                </InfoItem>
                <InfoItem>
                  <IconWrapper>
                    <FaMoneyBill />
                  </IconWrapper>
                  <Label>Game Loss Comm. Balance:</Label>
                  <Value>
                    {userInfo?.gameLossCommissionBalance !== undefined
                      ? userInfo.gameLossCommissionBalance.toFixed(2)
                      : "-"}
                  </Value>
                </InfoItem>
                <InfoItem>
                  <IconWrapper>
                    <FaMoneyBill />
                  </IconWrapper>
                  <Label>Deposit Comm. Balance:</Label>
                  <Value>
                    {userInfo?.depositCommissionBalance !== undefined
                      ? userInfo.depositCommissionBalance.toFixed(2)
                      : "-"}
                  </Value>
                </InfoItem>
                <InfoItem>
                  <IconWrapper>
                    <FaMoneyBill />
                  </IconWrapper>
                  <Label>Refer Comm. Balance:</Label>
                  <Value>
                    {userInfo?.referCommissionBalance !== undefined
                      ? userInfo.referCommissionBalance.toFixed(2)
                      : "-"}
                  </Value>
                </InfoItem>
              </InfoGrid>
            </InfoSection>

            <InfoSection>
              <SectionTitle>Activity</SectionTitle>
              <InfoGrid>
                <InfoItem>
                  <IconWrapper>
                    <FaUser />
                  </IconWrapper>
                  <Label>Created At:</Label>
                  <Value>
                    {userInfo?.createdAt
                      ? new Date(userInfo.createdAt).toLocaleString()
                      : "-"}
                  </Value>
                </InfoItem>
                <InfoItem>
                  <IconWrapper>
                    <FaUser />
                  </IconWrapper>
                  <Label>Updated At:</Label>
                  <Value>
                    {userInfo?.updatedAt
                      ? new Date(userInfo.updatedAt).toLocaleString()
                      : "-"}
                  </Value>
                </InfoItem>
              </InfoGrid>
            </InfoSection>

            <InfoSection>
              <SectionTitle>Game History</SectionTitle>
              {userInfo?.gameHistory && userInfo.gameHistory.length > 0 ? (
                <HistoryTable>
                  <thead>
                    <tr>
                      <th>Provider Code</th>
                      <th>Game Code</th>
                      <th>Bet Type</th>
                      <th>Amount</th>
                      <th>Transaction ID</th>
                      <th>Status</th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userInfo.gameHistory.map((history, index) => (
                      <tr key={index}>
                        <td>{history.provider_code || "-"}</td>
                        <td>{history.game_code || "-"}</td>
                        <td>{history.bet_type || "-"}</td>
                        <td>{history.amount || "-"}</td>
                        <td>{history.transaction_id || "-"}</td>
                        <td>{history.status || "-"}</td>
                        <td>
                          {history.createdAt
                            ? new Date(history.createdAt).toLocaleString()
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </HistoryTable>
              ) : (
                <NoHistoryMessage>No game history available</NoHistoryMessage>
              )}
            </InfoSection>
          </>
        )}
      </MainContent>
    </DashboardContainer>
  );
}
