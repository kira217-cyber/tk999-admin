import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaSync,
  FaEdit,
  FaChevronDown,
  FaUser,
  FaCreditCard,
  FaMoneyBillWave,
  FaClock,
  FaFile,
  FaExclamation,
} from "react-icons/fa";
import styled from "styled-components";
import { API_URL, baseURL, baseURL_For_IMG_UPLOAD } from "../utils/baseURL";

// Styled Components (একদম আগের মতোই)
const DashboardContainer = styled.div`
  padding: 2rem;
  background: linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%);
  min-height: 100vh;
  display: flex;
  gap: 2rem;
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }
`;

const Sidebar = styled.div`
  flex: 0 0 24rem;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  @media (max-width: 768px) {
    flex: none;
    width: 100%;
    padding: 1.5rem;
    ${(props) => !props.isOpen && "display: none;"}
  }
`;

const SidebarToggle = styled.button`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: #ffffff;
    border-radius: 0.5rem;
    border: none;
    width: 100%;
    font-size: 1rem;
    font-weight: 600;
    color: #1e293b;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }
`;

const MainContent = styled.div`
  flex: 1;
  background: #ffffff;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
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
  background: linear-gradient(90deg, #93c5fd 0%, #bfdbfe 100%);
  border-radius: 0.75rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  animation: fadeIn 0.5s ease;
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #1e293b;
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  @media (max-width: 480px) {
    width: 100%;
    justify-content: center;
    gap: 0.5rem;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background: ${({ bgColor }) => bgColor || "#3b82f6"};
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  &:hover {
    background: ${({ hoverBgColor }) => hoverBgColor || "#2563eb"};
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  }
  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    transform: none;
  }
  @media (max-width: 480px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }
`;

const Section = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 0.75rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const DetailCard = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    border: 1px solid #93c5fd;
  }
`;

const DetailLabel = styled.span`
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
`;

const DetailValue = styled.div`
  color: #374151;
  font-size: 0.875rem;
  line-height: 1.6;
  & > p {
    margin-bottom: 0.5rem;
  }
  img {
    max-width: 160px;
    border-radius: 0.5rem;
    margin-top: 0.75rem;
    border: 1px solid #e5e7eb;
  }
`;

const StatusBadge = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  ${({ status }) => {
    switch (status) {
      case "completed":
        return "background: #22c55e;";
      case "pending":
        return "background: #f59e0b;";
      case "failed":
        return "background: #ef4444;";
      case "cancelled":
        return "background: #6b7280;";
      default:
        return "background: #3b82f6;";
    }
  }}
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

const ErrorAlert = styled.div`
  padding: 1.5rem;
  background: #fef2f2;
  color: #dc2626;
  border-radius: 0.75rem;
  text-align: center;
  margin: 2rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  font-weight: 600;
`;

const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: #ffffff;
  padding: 2rem;
  border-radius: 1rem;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.4s ease;
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: #f8fafc;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.2);
  }
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: white;
  min-height: 100px;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: white;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Button = styled.button`
  padding: 0.75rem;
  border-radius: 0.375rem;
  border: none;
  background: ${(props) => props.bgColor || "#3b82f6"};
  color: white;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: ${(props) => props.hoverBgColor || "#2563eb"};
  }
  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
  }
`;

const Message = styled.div`
  padding: 0.75rem;
  border-radius: 0.5rem;
  text-align: center;
  font-size: 0.875rem;
  background: ${(props) => (props.error ? "#fef2f2" : "#f0fdf4")};
  color: ${(props) => (props.error ? "#dc2626" : "#16a34a")};
`;

export default function SingleWithdrawTransaction() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    status: "pending",
    reason: "",
  });
  const [success, setSuccess] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  console.log(transaction)

  const fetchTransaction = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(
        `${API_URL}/api/withdraw-transaction/${id}`
       
      );


      if (!data.success || !data.data) throw new Error("Invalid response");

      setTransaction(data.data);
      
      setFormData({
        amount: data.data.amount,
        status: data.data.status || "pending",
        reason: data.data.reason || "",
      });
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to load transaction");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  const openEditModal = () => {
    setShowModal(true);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const { data } = await axios.put(
        `${API_URL}/api/withdraw-transaction/${id}`,
        formData
    
      );

      setSuccess(data.msg || "Updated successfully!");
      await fetchTransaction();
      setTimeout(() => {
        setShowModal(false);
        setSuccess("");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.msg || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !transaction) {
    return (
      <LoadingContainer>
        <div className="border-4 border-t-blue-500 border-gray-200 rounded-full w-12 h-12 animate-spin"></div>
      </LoadingContainer>
    );
  }

  if (error || !transaction) {
    return (
      <DashboardContainer>
        <MainContent>
          <Header>
            <Title>Withdraw Transaction</Title>
            <ButtonContainer>
              <ActionButton
                onClick={() => navigate("/Withdraw-transaction")}
                bgColor="#3b82f6"
              >
                <FaArrowLeft /> Back
              </ActionButton>
              <ActionButton onClick={fetchTransaction} bgColor="#6b7280">
                <FaSync /> Retry
              </ActionButton>
            </ButtonContainer>
          </Header>
          <ErrorAlert>{error || "Transaction not found"}</ErrorAlert>
        </MainContent>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Sidebar isOpen={showSidebar}>
        <Section>
          <SectionTitle>User Information</SectionTitle>
          <DetailGrid>
            <DetailCard>
              <DetailLabel>Name</DetailLabel>
              <DetailValue>{transaction.userId?.username || "N/A"}</DetailValue>
            </DetailCard>
            <DetailCard>
              <DetailLabel>Phone</DetailLabel>
              <DetailValue>
                {transaction.userId?.whatsapp || "N/A"}
              </DetailValue>
            </DetailCard>
            <DetailCard>
              <DetailLabel>Email</DetailLabel>
              <DetailValue>{transaction.userId?.email || "N/A"}</DetailValue>
            </DetailCard>
          </DetailGrid>
        </Section>
      </Sidebar>

      <MainContent>
        <Header>
          <Title>Withdraw Transaction Details</Title>
          <ButtonContainer>
            <ActionButton
              onClick={() => navigate("/Withdraw-transaction")}
              bgColor="#3b82f6"
            >
              <FaArrowLeft /> Back
            </ActionButton>
            <ActionButton onClick={fetchTransaction} bgColor="#6b7280">
              <FaSync /> Refresh
            </ActionButton>
            <ActionButton
              onClick={openEditModal}
              bgColor="#f59e0b"
              hoverBgColor="#d97706"
              disabled={transaction.status !== "pending"}
            >
              <FaEdit /> Edit Status
            </ActionButton>
            <SidebarToggle onClick={() => setShowSidebar(!showSidebar)}>
              User Info <FaChevronDown />
            </SidebarToggle>
          </ButtonContainer>
        </Header>

        <Section>
          <SectionTitle>Transaction Info</SectionTitle>
          <DetailGrid>
            <DetailCard>
              <DetailLabel>Status</DetailLabel>
              <DetailValue>
                <StatusBadge status={transaction.status}>
                  {transaction.status}
                </StatusBadge>
              </DetailValue>
            </DetailCard>
            <DetailCard>
              <DetailLabel>Amount</DetailLabel>
              <DetailValue>৳{transaction.amount}</DetailValue>
            </DetailCard>
            <DetailCard>
              <DetailLabel>Payment Method</DetailLabel>
              <DetailValue>
                {transaction.paymentMethod?.methodName || "—"}
              </DetailValue>
            </DetailCard>
            <DetailCard>
              <DetailLabel>Channel</DetailLabel>
              <DetailValue>{transaction.channel || "—"}</DetailValue>
            </DetailCard>
            <DetailCard>
              <DetailLabel>Reason</DetailLabel>
              <DetailValue>{transaction.reason || "—"}</DetailValue>
            </DetailCard>
          </DetailGrid>
        </Section>

        <Section>
          <SectionTitle>User Inputs</SectionTitle>
          <DetailGrid>
            {transaction.userInputs?.length > 0 ? (
              transaction.userInputs.map((inp, i) => (
                <DetailCard key={i}>
                  <DetailLabel>{inp.label}</DetailLabel>
                  <DetailValue>
                    {inp.type === "file" ? (
                      <img
                        src={`${API_URL}/uploads/method-icons/${inp.value}`}
                        alt="file"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    ) : (
                      <p>{inp.value}</p>
                    )}
                  </DetailValue>
                </DetailCard>
                
              ))
            ) : (
              <DetailCard>
                <DetailValue>No inputs provided</DetailValue>
              </DetailCard>
            )}
          </DetailGrid>
        </Section>

        <Section>
          <SectionTitle>Timeline</SectionTitle>
          <DetailGrid>
            <DetailCard>
              <DetailLabel>Requested At</DetailLabel>
              <DetailValue>
                {new Date(transaction.createdAt).toLocaleString()}
              </DetailValue>
            </DetailCard>
            <DetailCard>
              <DetailLabel>Updated At</DetailLabel>
              <DetailValue>
                {new Date(transaction.updatedAt).toLocaleString()}
              </DetailValue>
            </DetailCard>
          </DetailGrid>
        </Section>
      </MainContent>

      {/* Edit Modal */}
      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Update Transaction Status</ModalTitle>
            {error && <Message error>{error}</Message>}
            {success && <Message>{success}</Message>}

            <Form onSubmit={handleSubmit}>
              <div>
                <Label>Amount (Cannot change)</Label>
                <Input type="number" value={formData.amount} disabled />
              </div>

              <div>
                <Label>Status</Label>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed (Approve)</option>
                  <option value="failed">Reject</option>
                  <option value="cancelled">Cancel & Refund</option>
                </Select>
              </div>

              {(formData.status === "failed" ||
                formData.status === "cancelled") && (
                <div>
                  <Label>Reason (Required)</Label>
                  <Textarea
                    name="reason"
                    value={formData.reason}
                    onChange={(e) =>
                      setFormData({ ...formData, reason: e.target.value })
                    }
                    placeholder="Enter reason for rejection/cancellation"
                    required
                  />
                </div>
              )}

              <div
                style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}
              >
                <Button type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update Status"}
                </Button>
                <Button
                  bgColor="#6b7280"
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </DashboardContainer>
  );
}
