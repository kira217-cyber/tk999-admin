// src/pages/AllUser.jsx
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

// Animation
const pulse = keyframes`
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
`;

// Styled Components (Pink Theme)
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
  font-weight: 800;
  color: #fff;
`;
const Subtitle = styled.p`
  color: #94a3b8;
  font-size: 1.1rem;
`;

const TableContainer = styled.div`
  display: block;
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
  min-width: 1100px;
`;
const Thead = styled.thead`
  background: linear-gradient(to right, #ec4899, #f43f5e);
`;
const Th = styled.th`
  padding: 16px 12px;
  text-align: left;
  color: #fff;
  font-weight: 600;
`;
const Tr = styled.tr`
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;
const Td = styled.td`
  padding: 14px 12px;
  color: #cbd5e1;
`;

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
  border: 1px solid rgba(236, 72, 153, 0.3);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  &:hover {
    transform: translateY(-4px);
  }
`;
const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;
const CardTitle = styled.h3`
  color: #fca5a5;
  font-weight: 700;
  font-size: 1.2rem;
`;
const CardStatus = styled.span`
  padding: 4px 12px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: bold;
  background: ${(p) => (p.active ? "#064e3b" : "#7c2d12")};
  color: ${(p) => (p.active ? "#6ee7b7" : "#fdba74")};
  border: 1px solid ${(p) => (p.active ? "#34d399" : "#fb923c")};
`;
const CardBody = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
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
  gap: 8px;
  margin-top: 12px;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 0.9rem;
  &.toggle {
    background: ${(p) => (p.active ? "#dc2626" : "#16a34a")};
    color: white;
  }
  &.edit {
    background: #1e293b;
    color: #22d3ee;
    border: 1px solid #22d3ee;
  }
  &.commission {
    background: linear-gradient(to right, #ec4899, #f43f5e);
    color: white;
  }
`;

const StatusBadge = styled.span`
  padding: 6px 14px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: bold;
  background: ${(p) => (p.active ? "#064e3b" : "#7c2d12")};
  color: ${(p) => (p.active ? "#6ee7b7" : "#fdba74")};
  border: 1px solid ${(p) => (p.active ? "#34d399" : "#fb923c")};
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  font-size: 26px;
  cursor: pointer;
  color: ${(p) => (p.active ? "#fb923c" : "#94a3b8")};
  &:hover {
    transform: scale(1.15);
  }
`;
const EditButton = styled.button`
  background: none;
  border: none;
  font-size: 22px;
  color: #22d3ee;
  cursor: pointer;
  &:hover {
    color: #67e8f9;
    transform: scale(1.15);
  }
`;
const CommissionButton = styled.button`
  background: linear-gradient(to right, #ec4899, #f43f5e);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 50px;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    transform: translateY(-2px);
  }
`;

// Loading & Error
const LoadingScreen = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: #1e293b;
`;
const PulseText = styled.div`
  font-size: 1.4rem;
  animation: ${pulse} 1.5s infinite;
  color: #fca5a5;
`;
const ErrorScreen = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #7f1d1d, #991b1b);
`;
const ErrorBox = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 20px;
  border: 1px solid #ef4444;
  text-align: center;
  max-width: 500px;
`;
const RetryButton = styled.button`
  margin-top: 20px;
  padding: 12px 30px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
`;
const NoData = styled.div`
  text-align: center;
  padding: 60px;
  color: #94a3b8;
  font-size: 1.2rem;
`;

// Modal
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;
const Modal = styled.div`
  background: linear-gradient(135deg, #1e293b, #334155);
  padding: 24px;
  border-radius: 24px;
  width: 100%;
  max-width: 500px;
  border: 1px solid #ec4899;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
`;
const ModalTitle = styled.h3`
  font-size: 1.8rem;
  color: #fda4af;
  text-align: center;
  margin-bottom: 24px;
`;
const FormGroup = styled.div`
  margin-bottom: 16px;
`;
const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #94a3b8;
  font-weight: 500;
`;
const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid #ec4899;
  border-radius: 12px;
  color: white;
  font-size: 0.95rem;
  &:focus {
    outline: none;
    border-color: #f43f5e;
    box-shadow: 0 0 0 3px rgba(244, 63, 94, 0.2);
  }
`;
const Select = styled.select`
  width: 100%;
  padding: 12px 14px;
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid #ec4899;
  border-radius: 12px;
  color: white;
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
`;
const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;
const PrimaryButton = styled.button`
  flex: 1;
  padding: 12px;
  background: linear-gradient(to right, #ec4899, #f43f5e);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
`;
const SecondaryButton = styled.button`
  flex: 1;
  padding: 12px;
  background: #475569;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
`;
const CreateButton = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 900;
  background: linear-gradient(to right, #ec4899, #f43f5e);
  color: white;
  padding: 14px 20px;
  border-radius: 50px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 8px 20px rgba(236, 72, 153, 0.4);
  &:hover {
    transform: translateY(-3px);
  }
`;

// Main Component
const AllUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [masterAffiliates, setMasterAffiliates] = useState([]);

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [commissionModalOpen, setCommissionModalOpen] = useState(false);
  const [viewUser, setViewUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showCreatePassword, setShowCreatePassword] = useState(false);

  const [createForm, setCreateForm] = useState({
    username: "",
    email: "",
    password: "",
    whatsapp: "",
    referredBy: "",
    gameLossCommission: "",
    depositCommission: "",
    referCommission: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    username: "",
    password: "",
  });
  const [commissionForm, setCommissionForm] = useState({
    gameLossCommission: 0,
    depositCommission: 0,
    referCommission: 0,
  });

  // Fetch Users & Master Affiliates
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/users`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMasterAffiliates = async () => {
    try {
      const res = await fetch(`${API_URL}/api/master-affiliates`);
      const data = await res.json();
      if (res.ok) setMasterAffiliates(data.users || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchMasterAffiliates();
  }, []);

  // Toggle Active
  const handleToggleClick = async (user) => {
    if (!window.confirm(user.isActive ? "Deactivate user?" : "Activate user?"))
      return;
    try {
      await fetch(`${API_URL}/api/toggle-user/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !user.isActive }),
      });
      toast.success("Status updated!");
      fetchUsers();
    } catch {
      toast.error("Failed");
    }
  };

  // Edit Credentials
  const handleViewUser = (user) => {
    setViewUser(user);
    setPasswordForm({ username: user.username, password: "" });
    setViewModalOpen(true);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/api/update-user-credentials/${viewUser._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordForm),
      });
      toast.success("Credentials updated!");
      setViewModalOpen(false);
      fetchUsers();
    } catch {
      toast.error("Failed");
    }
  };

  // Commission Edit
  const handleCommissionClick = (user) => {
    setSelectedUser(user);
    setCommissionForm({
      gameLossCommission: user.gameLossCommission || 0,
      depositCommission: user.depositCommission || 0,
      referCommission: user.referCommission || 0,
    });
    setCommissionModalOpen(true);
  };

  const handleCommissionSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/api/update-user-commission/${selectedUser._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commissionForm),
      });
      toast.success("Commission updated!");
      setCommissionModalOpen(false);
      fetchUsers();
    } catch {
      toast.error("Failed");
    }
  };

  // Create User with Commission
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/create/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...createForm,
          gameLossCommission: parseFloat(createForm.gameLossCommission) || 0,
          depositCommission: parseFloat(createForm.depositCommission) || 0,
          referCommission: parseFloat(createForm.referCommission) || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Creation failed");
      toast.success("User created successfully!");
      setCreateModalOpen(false);
      setCreateForm({
        username: "",
        email: "",
        password: "",
        whatsapp: "",
        referredBy: "",
        gameLossCommission: "",
        depositCommission: "",
        referCommission: "",
      });
      fetchUsers();
    } catch (err) {
      toast.error(err.message || "Failed to create");
    }
  };

  if (loading)
    return (
      <LoadingScreen>
        <PulseText>Loading Users...</PulseText>
      </LoadingScreen>
    );
  if (error)
    return (
      <ErrorScreen>
        <ErrorBox>
          <h2>Error</h2>
          <p>{error}</p>
          <RetryButton onClick={fetchUsers}>Retry</RetryButton>
        </ErrorBox>
      </ErrorScreen>
    );

  return (
    <Container>
      <ContentWrapper>
        <Header>
          <Title>All Users</Title>
          <Subtitle>Manage regular users with full commission control</Subtitle>
        </Header>

        {users.length === 0 ? (
          <NoData>No users found</NoData>
        ) : (
          <>
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
                    {/* <Th>Commission</Th> */}
                  </tr>
                </Thead>
                <tbody>
                  {users.map((u) => (
                    <Tr key={u._id}>
                      <Td style={{ fontWeight: 500, color: "#e2e8f0" }}>
                        {u.username}
                      </Td>
                      <Td>{u.email}</Td>
                      <Td>{u.whatsapp}</Td>
                      <Td style={{ color: "#34d399", fontWeight: "bold" }}>
                        ৳{u.balance || 0}
                      </Td>
                      <Td style={{ textAlign: "center" }}>
                        <StatusBadge active={u.isActive}>
                          {u.isActive ? "Active" : "Inactive"}
                        </StatusBadge>
                      </Td>
                      <Td style={{ textAlign: "center" }}>
                        <ToggleButton
                          onClick={() => handleToggleClick(u)}
                          active={u.isActive}
                        >
                          {u.isActive ? <FaToggleOn /> : <FaToggleOff />}
                        </ToggleButton>
                      </Td>
                      <Td style={{ textAlign: "center" }}>
                        <EditButton onClick={() => handleViewUser(u)}>
                          <FaEye />
                        </EditButton>
                      </Td>
                      {/* <Td style={{textAlign:"center"}}><CommissionButton onClick={()=>handleCommissionClick(u)}>Set Commission</CommissionButton></Td> */}
                    </Tr>
                  ))}
                </tbody>
              </StyledTable>
            </TableContainer>

            <CardsContainer>
              {users.map((u) => (
                <Card key={u._id}>
                  <CardHeader>
                    <CardTitle>{u.username}</CardTitle>
                    <CardStatus active={u.isActive}>
                      {u.isActive ? "Active" : "Inactive"}
                    </CardStatus>
                  </CardHeader>
                  <CardBody>
                    <CardItem>
                      <FaEnvelope /> {u.email}
                    </CardItem>
                    <CardItem>
                      <FaPhone /> {u.whatsapp}
                    </CardItem>
                    <CardItem>
                      <FaDollarSign style={{ color: "#34d399" }} /> ৳
                      {u.balance || 0}
                    </CardItem>
                  </CardBody>
                  <CardActions>
                    <ActionButton
                      className="toggle"
                      active={u.isActive}
                      onClick={() => handleToggleClick(u)}
                    >
                      {u.isActive ? <FaToggleOn /> : <FaToggleOff />}{" "}
                      {u.isActive ? "Deactivate" : "Activate"}
                    </ActionButton>
                    <ActionButton
                      className="edit"
                      onClick={() => handleViewUser(u)}
                    >
                      <FaEdit /> Edit
                    </ActionButton>
                    <ActionButton
                      className="commission"
                      onClick={() => handleCommissionClick(u)}
                    >
                      <FaCogs /> Commission
                    </ActionButton>
                  </CardActions>
                </Card>
              ))}
            </CardsContainer>
          </>
        )}
      </ContentWrapper>

      <CreateButton onClick={() => setCreateModalOpen(true)}>
        <FaPlus /> Create User
      </CreateButton>

      {/* Create User Modal with Commission */}
      {createModalOpen && (
        <ModalOverlay onClick={() => setCreateModalOpen(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Create New User</ModalTitle>
            <form onSubmit={handleCreateSubmit}>
              <FormGroup>
                <Label>Username *</Label>
                <Input
                  value={createForm.username}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, username: e.target.value })
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
                      setCreateForm({ ...createForm, password: e.target.value })
                    }
                    required
                    style={{ paddingRight: "45px" }}
                  />
                  <EyeButton
                    type="button"
                    onClick={() => setShowCreatePassword(!showCreatePassword)}
                  >
                    {showCreatePassword ? <FaEyeSlash /> : <FaEye />}
                  </EyeButton>
                </PasswordWrapper>
              </FormGroup>
              <FormGroup>
                <Label>WhatsApp *</Label>
                <Input
                  value={createForm.whatsapp}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, whatsapp: e.target.value })
                  }
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Referred By *</Label>
                <Select
                  value={createForm.referredBy}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, referredBy: e.target.value })
                  }
                  required
                >
                  <option value="">Select Master Affiliate</option>
                  {masterAffiliates.map((ma) => (
                    <option key={ma._id} value={ma._id}>
                      {ma.username} ({ma.email})
                    </option>
                  ))}
                </Select>
              </FormGroup>
              {/* <FormGroup><Label>Game Loss Commission (%)</Label><Input type="number" step="0.01" placeholder="e.g. 30" value={createForm.gameLossCommission} onChange={e => setCreateForm({...createForm, gameLossCommission: e.target.value})} /></FormGroup>
              <FormGroup><Label>Deposit Commission (%)</Label><Input type="number" step="0.01" placeholder="e.g. 10" value={createForm.depositCommission} onChange={e => setCreateForm({...createForm, depositCommission: e.target.value})} /></FormGroup>
              <FormGroup><Label>Refer Commission (%)</Label><Input type="number" step="0.01" placeholder="e.g. 5" value={createForm.referCommission} onChange={e => setCreateForm({...createForm, referCommission: e.target.value})} /></FormGroup> */}
              <ModalButtons>
                <PrimaryButton type="submit">Create User</PrimaryButton>
                <SecondaryButton
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                >
                  Cancel
                </SecondaryButton>
              </ModalButtons>
            </form>
          </Modal>
        </ModalOverlay>
      )}

      {/* Edit Credentials Modal */}
      {viewModalOpen && viewUser && (
        <ModalOverlay onClick={() => setViewModalOpen(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Edit: {viewUser.username}</ModalTitle>
            <form onSubmit={handlePasswordSubmit}>
              <FormGroup>
                <Label>Username</Label>
                <Input
                  value={passwordForm.username}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      username: e.target.value,
                    })
                  }
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
                  onClick={() => setViewModalOpen(false)}
                >
                  Cancel
                </SecondaryButton>
              </ModalButtons>
            </form>
          </Modal>
        </ModalOverlay>
      )}

      {/* Commission Edit Modal */}
      {/* {commissionModalOpen && selectedUser && (
        <ModalOverlay onClick={() => setCommissionModalOpen(false)}>
          <Modal onClick={e => e.stopPropagation()}>
            <ModalTitle>Commission: {selectedUser.username}</ModalTitle>
            <form onSubmit={handleCommissionSubmit}>
              <FormGroup><Label>Game Loss Commission (%)</Label><Input type="number" step="0.01" value={commissionForm.gameLossCommission} onChange={e => setCommissionForm({...commissionForm, gameLossCommission: e.target.value})} /></FormGroup>
              <FormGroup><Label>Deposit Commission (%)</Label><Input type="number" step="0.01" value={commissionForm.depositCommission} onChange={e => setCommissionForm({...commissionForm, depositCommission: e.target.value})} /></FormGroup>
              <FormGroup><Label>Refer Commission (%)</Label><Input type="number" step="0.01" value={commissionForm.referCommission} onChange={e => setCommissionForm({...commissionForm, referCommission: e.target.value})} /></FormGroup>
              <ModalButtons>
                <PrimaryButton type="submit">Update Commission</PrimaryButton>
                <SecondaryButton type="button" onClick={() => setCommissionModalOpen(false)}>Cancel</SecondaryButton>
              </ModalButtons>
            </form>
          </Modal>
        </ModalOverlay>
      )} */}
    </Container>
  );
};

export default AllUser;
