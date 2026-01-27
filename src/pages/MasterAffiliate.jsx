// src/pages/MasterAffiliate.jsx
import React, { useState, useEffect } from "react";
import {
  FaToggleOn,
  FaToggleOff,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaDollarSign,
  FaEdit,
  FaCogs,
  FaPlus,
} from "react-icons/fa";
import toast from "react-hot-toast";
import styled, { keyframes } from "styled-components";
import { API_URL } from "../utils/baseURL";

// Keyframes
const pulse = keyframes`
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
`;

// Styled Components (আগের সব অপরিবর্তিত)
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%);
  color: #e2e8f0;
  padding: 12px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;
const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;
const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;
const Title = styled.h1`
  font-size: 2.8rem;
  margin-top: 0px;
  font-weight: 800;
  color: #ffffff;
`;
const Subtitle = styled.p`
  color: #94a3b8;
  margin-top: 8px;
  font-size: 1.1rem;
`;

// Desktop Table
const TableContainer = styled.div`
  display: block;
  width: 100%;
  overflow-x: auto;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  @media (max-width: 768px) {
    display: none;
  }
`;
const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
`;
const Thead = styled.thead`
  background: linear-gradient(to right, #7acc39, #7acc39);
`;
const Th = styled.th`
  padding: 16px 12px;
  text-align: left;
  font-weight: 600;
  font-size: 1rem;
  color: #ffffff;
`;
const Tr = styled.tr`
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;
  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;
const Td = styled.td`
  padding: 14px 12px;
  font-size: 0.95rem;
  color: #cbd5e1;
`;

// Mobile Cards
const CardsContainer = styled.div`
  display: none;
  flex-direction: column;
  gap: 16px;
  @media (max-width: 768px) {
    display: flex;
  }
`;
const Card = styled.div`
  background: rgba(30, 41, 59, 0.6);
  border-radius: 16px;
  padding: 16px;
  border: 1px solid rgba(20, 184, 166, 0.3);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
  }
`;
const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;
const CardTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: #fbbf24;
`;
const CardStatus = styled.span`
  padding: 4px 12px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: bold;
  background: ${(props) => (props.active ? "#064e3b" : "#7c2d12")};
  color: ${(props) => (props.active ? "#6ee7b7" : "#fdba74")};
  border: 1px solid ${(props) => (props.active ? "#34d399" : "#fb923c")};
`;
const CardBody = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  font-size: 0.9rem;
  color: #94a3b8;
  margin-bottom: 12px;
`;
const CardItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #cbd5e1;
`;
const CardActions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-top: 12px;
`;
const ActionButton = styled.button`
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  &.toggle {
    background: ${(props) => (props.active ? "#dc2626" : "#16a34a")};
    color: white;
    &:hover {
      background: ${(props) => (props.active ? "#b91c1c" : "#15803d")};
      transform: translateY(-2px);
    }
  }
  &.edit {
    background: #1e293b;
    color: #22d3ee;
    border: 1px solid #22d3ee;
    &:hover {
      background: #22d3ee;
      color: #0f172a;
    }
  }
  &.commission {
    background: linear-gradient(to right, #a78bfa, #c084fc);
    color: white;
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(167, 139, 250, 0.3);
    }
  }
`;

// Shared Components
const StatusBadge = styled.span`
  display: inline-block;
  padding: 6px 14px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: bold;
  text-align: center;
  min-width: 80px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  background: ${(props) => (props.active ? "#064e3b" : "#7c2d12")};
  color: ${(props) => (props.active ? "#6ee7b7" : "#fdba74")};
  border: 1px solid ${(props) => (props.active ? "#34d399" : "#fb923c")};
`;
const ToggleButton = styled.button`
  background: none;
  border: none;
  font-size: 26px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8px;
  border-radius: 50%;
  color: ${(props) => (props.active ? "#fb923c" : "#94a3b8")};
  &:hover {
    transform: scale(1.15);
    background: rgba(255, 255, 255, 0.1);
  }
`;
const EditButton = styled.button`
  background: none;
  border: none;
  font-size: 22px;
  color: #22d3ee;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8px;
  border-radius: 50%;
  &:hover {
    color: #67e8f9;
    transform: scale(1.15);
    background: rgba(34, 211, 238, 0.1);
  }
`;
const CommissionButton = styled.button`
  background: linear-gradient(to right, #a78bfa, #c084fc);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(167, 139, 250, 0.3);
  }
`;

// Loading & Error
const LoadingScreen = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
`;
const PulseText = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
  animation: ${pulse} 1.5s ease-in-out infinite;
  color: #fbbf24;
`;
const ErrorScreen = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%);
`;
const ErrorBox = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 30px;
  border-radius: 20px;
  max-width: 500px;
  width: 100%;
  border: 1px solid #ef4444;
  text-align: center;
`;
const RetryButton = styled.button`
  margin-top: 20px;
  padding: 12px 30px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background: #b91c1c;
    transform: translateY(-2px);
  }
`;
const NoData = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #94a3b8;
  font-size: 1.2rem;
`;

// Modal Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;
const Modal = styled.div`
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  padding: 24px;
  border-radius: 24px;
  width: 100%;
  max-width: 500px;
  border: 1px solid #14b8a6;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
`;
const ModalTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  color: #fbbf24;
  text-align: center;
  margin-bottom: 24px;
`;
const FormGroup = styled.div`
  margin-bottom: 12px;
`;
const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #94a3b8;
  font-size: 0.95rem;
  font-weight: 500;
`;
const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid #14b8a6;
  border-radius: 12px;
  color: white;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  &:focus {
    outline: none;
    border-color: #06b6d4;
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.2);
  }
`;
const Select = styled.select`
  width: 100%;
  padding: 12px 14px;
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid #14b8a6;
  border-radius: 12px;
  color: white;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  &:focus {
    outline: none;
    border-color: #06b6d4;
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.2);
  }
`;
const PasswordWrapper = styled.div`
  position: relative;
`;
const EyeButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  font-size: 18px;
  transition: color 0.3s ease;
  &:hover {
    color: #06b6d4;
  }
`;
const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;
const PrimaryButton = styled.button`
  flex: 1;
  padding: 12px;
  background: linear-gradient(to right, #06b6d4, #22d3ee);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(6, 182, 212, 0.3);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
const SecondaryButton = styled.button`
  flex: 1;
  padding: 12px;
  background: linear-gradient(to right, #475569, #64748b);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  &:hover {
    background: linear-gradient(to right, #334155, #475569);
    transform: translateY(-2px);
  }
`;

// NEW: Create Button
const CreateButton = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: linear-gradient(to right, #f59e0b, #f97316);
  color: white;
  border: none;
  padding: 14px 20px;
  border-radius: 50px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 8px 20px rgba(249, 115, 22, 0.4);
  transition: all 0.3s ease;
  z-index: 900;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 25px rgba(249, 115, 22, 0.5);
  }

  @media (max-width: 768px) {
    bottom: 16px;
    right: 16px;
    padding: 12px 16px;
    font-size: 0.9rem;
  }
`;

// Main Component
const MasterAffiliate = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit Modal
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewUser, setViewUser] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // Commission Modal
  const [commissionModalOpen, setCommissionModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [commissionForm, setCommissionForm] = useState({
    gameLossCommission: 0,
    depositCommission: 0,
    referCommission: 0,
  });

  // CREATE MODAL
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    username: "",
    email: "",
    password: "",
    whatsapp: "",
    gameLossCommission: "",
    depositCommission: "",
    referCommission: "",
    referredBy: "",
  });
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [superAffiliates, setSuperAffiliates] = useState([]);

  // Fetch Master Affiliates
  const fetchMasterAffiliates = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/master-affiliates`);
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error("Server returned HTML. Check backend.");
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load");
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Super Affiliates for Dropdown
  const fetchSuperAffiliates = async () => {
    try {
      const res = await fetch(`${API_URL}/api/super-affiliates`);
      const data = await res.json();
      if (res.ok) {
        setSuperAffiliates(data.users || []);
      }
    } catch (err) {
      console.error("Failed to load Super Affiliates");
    }
  };

  useEffect(() => {
    fetchMasterAffiliates();
    fetchSuperAffiliates();
  }, []);

  const handleToggleClick = (user) => {
    const isActive = user.isActive ?? false;
    if (isActive) {
      if (window.confirm("Deactivate this user?")) {
        deactivateUser(user._id);
      }
    } else {
      setSelectedUser(user);
      setCommissionForm({
        gameLossCommission: user.gameLossCommission || 0,
        depositCommission: user.depositCommission || 0,
        referCommission: user.referCommission || 0,
      });
      setCommissionModalOpen(true);
    }
  };

  const deactivateUser = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/api/deactivate-user/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Deactivate failed");
      }
      toast.success("User deactivated!");
      fetchMasterAffiliates();
    } catch (err) {
      toast.error(err.message || "Deactivate failed");
    }
  };

  const handleCommissionSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${API_URL}/api/approve-user/${selectedUser._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(commissionForm),
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Update failed");
      }
      toast.success("User activated & commission updated!");
      setCommissionModalOpen(false);
      setSelectedUser(null);
      fetchMasterAffiliates();
    } catch (err) {
      toast.error(err.message || "Update failed");
    }
  };

  const handleViewUser = (user) => {
    setViewUser(user);
    setPasswordForm({ username: user.username, password: "" });
    setShowPassword(false);
    setViewModalOpen(true);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordForm.password) {
      toast.warn("Password is required!");
      return;
    }
    try {
      const res = await fetch(
        `${API_URL}/api/update-master-affiliate-credentials/${viewUser._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: passwordForm.username,
            password: passwordForm.password,
          }),
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Update failed");
      }
      toast.success("Credentials updated!");
      setViewModalOpen(false);
      fetchMasterAffiliates();
    } catch (err) {
      toast.error(err.message || "Update failed");
    }
  };

  const handleCommissionClick = (user) => {
    setSelectedUser(user);
    setCommissionForm({
      gameLossCommission: user.gameLossCommission || 0,
      depositCommission: user.depositCommission || 0,
      referCommission: user.referCommission || 0,
    });
    setCommissionModalOpen(true);
  };

  // CREATE MASTER AFFILIATE
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (
      !createForm.username ||
      !createForm.email ||
      !createForm.password ||
      !createForm.whatsapp ||
      !createForm.referredBy
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/create/master-affiliates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: createForm.username,
          email: createForm.email,
          password: createForm.password,
          whatsapp: createForm.whatsapp,
          gameLossCommission: createForm.gameLossCommission || 0,
          depositCommission: createForm.depositCommission || 0,
          referCommission: createForm.referCommission || 0,
          referredBy: createForm.referredBy,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Creation failed");

      toast.success("Master Affiliate created successfully!");
      setCreateModalOpen(false);
      setCreateForm({
        username: "",
        email: "",
        password: "",
        whatsapp: "",
        gameLossCommission: "",
        depositCommission: "",
        referCommission: "",
        referredBy: "",
      });
      fetchMasterAffiliates();
    } catch (err) {
      toast.error(err.message || "Failed to create user");
    }
  };

  return (
    <>
      {loading && (
        <LoadingScreen>
          <PulseText>Loading Master Affiliates...</PulseText>
        </LoadingScreen>
      )}
      {error && (
        <ErrorScreen>
          <ErrorBox>
            <h2
              style={{
                color: "#fca5a5",
                marginBottom: "16px",
                fontSize: "1.8rem",
              }}
            >
              Error
            </h2>
            <p style={{ marginBottom: "20px", color: "#fecaca" }}>{error}</p>
            <RetryButton onClick={fetchMasterAffiliates}>Retry</RetryButton>
          </ErrorBox>
        </ErrorScreen>
      )}
      {!loading && !error && (
        <Container>
          <ContentWrapper>
            <Header>
              <Title>Master Affiliate Users</Title>
              <Subtitle>Manage your Master affiliates with ease</Subtitle>
            </Header>

            {users.length === 0 ? (
              <NoData>No Master Affiliates found</NoData>
            ) : (
              <>
                {/* Desktop Table */}
                <TableContainer>
                  <StyledTable>
                    <Thead>
                      <tr>
                        <Th>Username</Th>
                        <Th>Email</Th>
                        <Th>WhatsApp</Th>
                        <Th>Balance</Th>
                        <Th>Status</Th>
                        <Th>Toggle</Th>
                        <Th>Edit</Th>
                        <Th>Set Commission</Th>
                      </tr>
                    </Thead>
                    <tbody>
                      {users.map((user) => {
                        const isActive = user.isActive ?? false;
                        return (
                          <Tr key={user._id}>
                            <Td style={{ fontWeight: "500", color: "#e2e8f0" }}>
                              {user.username}
                            </Td>
                            <Td
                              style={{
                                fontSize: "0.9rem",
                                wordBreak: "break-all",
                                color: "#94a3b8",
                              }}
                            >
                              {user.email}
                            </Td>
                            <Td
                              style={{ fontSize: "0.9rem", color: "#94a3b8" }}
                            >
                              {user.whatsapp}
                            </Td>
                            <Td
                              style={{ fontWeight: "bold", color: "#34d399" }}
                            >
                              ৳{user.balance || 0}
                            </Td>
                            <Td style={{ textAlign: "center" }}>
                              <StatusBadge active={isActive}>
                                {isActive ? "Active" : "Inactive"}
                              </StatusBadge>
                            </Td>
                            <Td style={{ textAlign: "center" }}>
                              <ToggleButton
                                onClick={() => handleToggleClick(user)}
                                active={isActive}
                              >
                                {isActive ? <FaToggleOn /> : <FaToggleOff />}
                              </ToggleButton>
                            </Td>
                            <Td style={{ textAlign: "center" }}>
                              <EditButton onClick={() => handleViewUser(user)}>
                                <FaEye />
                              </EditButton>
                            </Td>
                            <Td style={{ textAlign: "center" }}>
                              <CommissionButton
                                onClick={() => handleCommissionClick(user)}
                              >
                                Edit Commission
                              </CommissionButton>
                            </Td>
                          </Tr>
                        );
                      })}
                    </tbody>
                  </StyledTable>
                </TableContainer>

                {/* Mobile Cards */}
                <CardsContainer>
                  {users.map((user) => {
                    const isActive = user.isActive ?? false;
                    return (
                      <Card key={user._id}>
                        <CardHeader>
                          <CardTitle>{user.username}</CardTitle>
                          <CardStatus active={isActive}>
                            {isActive ? "Active" : "Inactive"}
                          </CardStatus>
                        </CardHeader>
                        <CardBody>
                          <CardItem>
                            <FaEnvelope /> {user.email}
                          </CardItem>
                          <CardItem>
                            <FaPhone /> {user.whatsapp}
                          </CardItem>
                          <CardItem>
                            <FaDollarSign style={{ color: "#34d399" }} /> ৳
                            {user.balance || 0}
                          </CardItem>
                        </CardBody>
                        <CardActions>
                          <ActionButton
                            className="toggle"
                            active={isActive}
                            onClick={() => handleToggleClick(user)}
                          >
                            {isActive ? <FaToggleOn /> : <FaToggleOff />}
                            {isActive ? "Deactivate" : "Activate"}
                          </ActionButton>
                          <ActionButton
                            className="edit"
                            onClick={() => handleViewUser(user)}
                          >
                            <FaEdit /> Edit
                          </ActionButton>
                          <ActionButton
                            className="commission"
                            onClick={() => handleCommissionClick(user)}
                          >
                            <FaCogs /> Commission
                          </ActionButton>
                        </CardActions>
                      </Card>
                    );
                  })}
                </CardsContainer>
              </>
            )}
          </ContentWrapper>

          {/* CREATE BUTTON */}
          <CreateButton onClick={() => setCreateModalOpen(true)}>
            <FaPlus /> Create Master Affiliate
          </CreateButton>

          {/* CREATE MODAL */}
          {createModalOpen && (
            <ModalOverlay onClick={() => setCreateModalOpen(false)}>
              <Modal onClick={(e) => e.stopPropagation()}>
                <ModalTitle>Create Master Affiliate</ModalTitle>
                <form onSubmit={handleCreateSubmit}>
                  <FormGroup>
                    <Label>Username *</Label>
                    <Input
                      type="text"
                      value={createForm.username}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          username: e.target.value,
                        })
                      }
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      value={createForm.email}
                      onChange={(e) =>
                        setCreateForm({ ...createForm, email: e.target.value })
                      }
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Password *</Label>
                    <PasswordWrapper>
                      <Input
                        type={showCreatePassword ? "text" : "password"}
                        value={createForm.password}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            password: e.target.value,
                          })
                        }
                        required
                        style={{ paddingRight: "45px" }}
                      />
                      <EyeButton
                        type="button"
                        onClick={() =>
                          setShowCreatePassword(!showCreatePassword)
                        }
                      >
                        {showCreatePassword ? <FaEyeSlash /> : <FaEye />}
                      </EyeButton>
                    </PasswordWrapper>
                  </FormGroup>
                  <FormGroup>
                    <Label>WhatsApp *</Label>
                    <Input
                      type="text"
                      value={createForm.whatsapp}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          whatsapp: e.target.value,
                        })
                      }
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Referred By (Super Affiliate) *</Label>
                    <Select
                      value={createForm.referredBy}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          referredBy: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select Super Affiliate</option>
                      {superAffiliates.map((sa) => (
                        <option key={sa._id} value={sa._id}>
                          {sa.username} ({sa.email})
                        </option>
                      ))}
                    </Select>
                  </FormGroup>
                  <FormGroup>
                    <Label>Game Loss Commission (%)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={createForm.gameLossCommission}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          gameLossCommission: e.target.value,
                        })
                      }
                      placeholder="0.00"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Deposit Commission (%)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={createForm.depositCommission}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          depositCommission: e.target.value,
                        })
                      }
                      placeholder="0.00"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Refer Commission (%)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={createForm.referCommission}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          referCommission: e.target.value,
                        })
                      }
                      placeholder="0.00"
                    />
                  </FormGroup>

                  <ModalButtons>
                    <PrimaryButton type="submit">Create User</PrimaryButton>
                    <SecondaryButton
                      type="button"
                      onClick={() => {
                        setCreateModalOpen(false);
                        setCreateForm({
                          username: "",
                          email: "",
                          password: "",
                          whatsapp: "",
                          gameLossCommission: "",
                          depositCommission: "",
                          referCommission: "",
                          referredBy: "",
                        });
                      }}
                    >
                      Cancel
                    </SecondaryButton>
                  </ModalButtons>
                </form>
              </Modal>
            </ModalOverlay>
          )}

          {/* Edit Modal */}
          {viewModalOpen && viewUser && (
            <ModalOverlay onClick={() => setViewModalOpen(false)}>
              <Modal onClick={(e) => e.stopPropagation()}>
                <ModalTitle>Edit: {viewUser.username}</ModalTitle>
                <form onSubmit={handlePasswordSubmit}>
                  <FormGroup>
                    <Label>Username</Label>
                    <Input
                      type="text"
                      value={passwordForm.username}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          username: e.target.value,
                        })
                      }
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>New Password</Label>
                    <PasswordWrapper>
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={passwordForm.password}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            password: e.target.value,
                          })
                        }
                        placeholder="Leave blank to keep current"
                        style={{ paddingRight: "45px" }}
                      />
                      <EyeButton
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </EyeButton>
                    </PasswordWrapper>
                  </FormGroup>
                  <ModalButtons>
                    <PrimaryButton type="submit">Save Changes</PrimaryButton>
                    <SecondaryButton
                      type="button"
                      onClick={() => {
                        setViewModalOpen(false);
                        setViewUser(null);
                        setPasswordForm({ username: "", password: "" });
                      }}
                    >
                      Cancel
                    </SecondaryButton>
                  </ModalButtons>
                </form>
              </Modal>
            </ModalOverlay>
          )}

          {/* Commission Modal */}
          {commissionModalOpen && selectedUser && (
            <ModalOverlay onClick={() => setCommissionModalOpen(false)}>
              <Modal onClick={(e) => e.stopPropagation()}>
                <ModalTitle>
                  {selectedUser.isActive ? "Update" : "Set"} Commission:{" "}
                  {selectedUser.username}
                </ModalTitle>
                <form onSubmit={handleCommissionSubmit}>
                  <FormGroup>
                    <Label>Game Loss Commission (%)</Label>
                    <Input
                      type="number"
                      value={commissionForm.gameLossCommission}
                      onChange={(e) =>
                        setCommissionForm({
                          ...commissionForm,
                          gameLossCommission: e.target.value,
                        })
                      }
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Deposit Commission (%)</Label>
                    <Input
                      type="number"
                      value={commissionForm.depositCommission}
                      onChange={(e) =>
                        setCommissionForm({
                          ...commissionForm,
                          depositCommission: e.target.value,
                        })
                      }
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Refer Commission (%)</Label>
                    <Input
                      type="number"
                      value={commissionForm.referCommission}
                      onChange={(e) =>
                        setCommissionForm({
                          ...commissionForm,
                          referCommission: e.target.value,
                        })
                      }
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </FormGroup>
                  <ModalButtons>
                    <PrimaryButton type="submit">
                      {selectedUser.isActive
                        ? "Update Commission"
                        : "Update & Activate"}
                    </PrimaryButton>
                    <SecondaryButton
                      type="button"
                      onClick={() => {
                        setCommissionModalOpen(false);
                        setSelectedUser(null);
                      }}
                    >
                      Cancel
                    </SecondaryButton>
                  </ModalButtons>
                </form>
              </Modal>
            </ModalOverlay>
          )}
        </Container>
      )}
    </>
  );
};

export default MasterAffiliate;
