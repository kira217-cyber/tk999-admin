import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaEye,
  FaSync,
  FaFilter,
  FaChevronDown,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL, baseURL } from "../utils/baseURL";

// Styled Components
const Container = styled.div`
  padding: 1.5rem;
  background: #f8fafc;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  @media (max-width: 640px) {
    padding: 1rem;
    gap: 1rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  color: #1e293b;
  @media (max-width: 640px) {
    font-size: 1.5rem;
  }
`;

const ControlWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  @media (max-width: 640px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const SearchFilterWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 0.75rem;
  margin-bottom: 1rem;
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    display: ${(props) => (props.isOpen ? "grid" : "none")};
  }
`;

const FilterToggle = styled.button`
  display: none;
  @media (max-width: 640px) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    border: 1px solid #e2e8f0;
    background: white;
    font-size: 0.875rem;
    color: #1e293b;
    cursor: pointer;
  }
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: border-color 0.2s;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  @media (max-width: 640px) {
    padding: 0.5rem;
    font-size: 0.875rem;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  @media (max-width: 640px) {
    padding: 0.5rem;
  }
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: white;
  resize: vertical;
  min-height: 100px;
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
  margin-left:8px;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  &:hover {
    background: ${(props) => props.hoverBgColor || "#2563eb"};
    transform: translateY(-1px);
  }
  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    transform: none;
  }
  @media (max-width: 640px) {
    padding: 0.5rem;
    font-size: 0.75rem;
  }
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: white;
  background: ${(props) => {
    switch (props.status) {
      case "completed":
        return "#22c55e";
      case "pending":
        return "#f59e0b";
      case "failed":
        return "#ef4444";
      case "cancelled":
        return "#6b7280";
      default:
        return "#3b82f6";
    }
  }};
`;

const TableWrapper = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  @media (max-width: 640px) {
    display: none;
  }
`;

const Th = styled.th`
  padding: 0.75rem 1rem;
  background: #f1f5f9;
  color: #1e293b;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Td = styled.td`
  padding: 0.75rem 1rem;
  border-top: 1px solid #e5e7eb;
  font-size: 0.875rem;
  color: #374151;
`;

const MobileCard = styled.div`
  display: none;
  @media (max-width: 640px) {
    display: block;
    background: white;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
`;

const MobileCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const MobileCardTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
`;

const MobileCardContent = styled.div`
  display: grid;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #374151;
`;

const MobileCardRow = styled.div`
  display: flex;
  justify-content: space-between;
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
  @media (max-width: 640px) {
    align-items: flex-end;
  }
`;

const ModalContent = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  text-align: center;
  background: ${(props) => (props.error ? "#fee2e2" : "#dcfce7")};
  color: ${(props) => (props.error ? "#991b1b" : "#166534")};
`;

const LoadingSpinner = styled.div`
  border: 4px solid #f3f4f6;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 2rem auto;
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export default function DepositTransaction() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    status: "pending",
    reason: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const { filter } = useParams(); // URL থেকে filter নেওয়া হচ্ছে

  // URL থেকে ফিল্টার সেট করা
  useEffect(() => {
    if (filter === "success") setFilterStatus("completed");
    else if (filter === "reject") setFilterStatus("failed");
    else if (filter === "pending") setFilterStatus("pending");
    else setFilterStatus("");
  }, [filter]);

  // ডাটা ফেচ করা
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/api/deposit/deposit-transaction`
      
      );

      if (res.data.success) {
        const data = res.data.data.reverse();
        setTransactions(data);
      }
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Failed to load transactions",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // ফিল্টার + সার্চ
  const applyFilters = () => {
    let filtered = [...transactions];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.userId?.name?.toLowerCase().includes(q) ||
          t.userId?.phoneNumber?.includes(q) ||
          t.userId?.email?.toLowerCase().includes(q)
      );
    }

    if (filterStatus) {
      filtered = filtered.filter((t) => t.status === filterStatus);
    }

    setFilteredTransactions(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [transactions, searchQuery, filterStatus]);

  const openModal = (trx) => {
    setEditId(trx._id);
    setFormData({
      amount: trx.amount,
      status: trx.status,
      reason: trx.reason || "",
    });
    setMessage({ text: "", type: "" });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      ["failed", "cancelled"].includes(formData.status) &&
      !formData.reason.trim()
    ) {
      setMessage({
        text: "Reason is required for Failed/Cancelled",
        type: "error",
      });
      return;
    }

    setLoading(true);
    try {
      await axios.put(
        `${API_URL}/api/deposit/deposit-transaction/${editId}`,
        formData
       
      );
      setMessage({ text: "Updated successfully!", type: "success" });
      fetchTransactions();
      setTimeout(() => setShowModal(false), 1500);
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Update failed",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete permanently?")) return;
    try {
      await axios.delete(`${API_URL}/api/deposit/deposit-transaction/${id}`);
      setMessage({ text: "Deleted successfully", type: "success" });
      fetchTransactions();
    } catch (err) {
      setMessage({ text: "Delete failed", type: "error" });
    }
  };

  const viewDetails = (id) => navigate(`/transaction/${id}`);

  return (
    <Container>
      <Header>
        <Title>Deposit Transactions</Title>
        <ControlWrapper>
          <FilterToggle onClick={() => setShowFilters(!showFilters)}>
            <FaFilter /> Filters <FaChevronDown />
          </FilterToggle>
          <Button onClick={fetchTransactions} disabled={loading}>
            <FaSync /> Refresh
          </Button>
        </ControlWrapper>
      </Header>

      <SearchFilterWrapper isOpen={showFilters}>
        <Input
          type="text"
          placeholder="Search by name, phone, email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && applyFilters()}
        />
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="cancelled">Cancelled</option>
        </Select>
        <Button onClick={applyFilters} disabled={loading}>
          <FaSearch /> Search
        </Button>
      </SearchFilterWrapper>

      {message.text && (
        <Message error={message.type === "error"}>{message.text}</Message>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Desktop Table */}
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <Th>User</Th>
                  <Th>Method</Th>
                  <Th>Channel</Th>
                  <Th>Amount</Th>
                  <Th>Total</Th>
                  <Th>Promotion</Th>
                  <Th>Status</Th>
                  <Th>Reason</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((t) => (
                  <tr key={t._id}>
                    <Td>
                      {t.userId?.username || "N/A"}
                      <br />({t.userId?.whatsapp})
                    </Td>
                    <Td>
                      {t.paymentMethod?.methodNameBD ||
                        t.paymentMethod?.methodName}
                    </Td>
                    <Td>{t.channel}</Td>
                    <Td>৳{t.amount}</Td>
                    <Td>৳{t.totalAmount || t.amount}</Td>
                    <Td title={t.promotionId?.title}>
                      {t.promotionId?.title?.slice(0, 15) || "—"}
                    </Td>
                    <Td>
                      <StatusBadge status={t.status}>{t.status}</StatusBadge>
                    </Td>
                    <Td title={t.reason}>{t.reason?.slice(0, 20) || "—"}</Td>
                    <Td>
                      <Button
                        bgColor="#22c55e"
                        onClick={() => viewDetails(t._id)}
                      >
                        <FaEye />
                      </Button>
                      <Button
                        bgColor="#f59e0b"
                        onClick={() => openModal(t)}
                        disabled={t.status === "completed"}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        bgColor="#ef4444"
                        onClick={() => handleDelete(t._id)}
                        disabled={t.status === "completed"}
                      >
                        <FaTrash />
                      </Button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrapper>

          {/* Mobile View */}
          {filteredTransactions.map((t) => (
            <MobileCard key={t._id}>
              <MobileCardHeader>
                <MobileCardTitle>{t.userId?.name || "Unknown"}</MobileCardTitle>
                <StatusBadge status={t.status}>{t.status}</StatusBadge>
              </MobileCardHeader>
              <MobileCardContent>
                <MobileCardRow>
                  <span>Phone:</span>
                  <span>{t.userId?.phoneNumber}</span>
                </MobileCardRow>
                <MobileCardRow>
                  <span>Method:</span>
                  <span>{t.paymentMethod?.methodNameBD}</span>
                </MobileCardRow>
                <MobileCardRow>
                  <span>Amount:</span>
                  <span>৳{t.amount}</span>
                </MobileCardRow>
                <MobileCardRow>
                  <span>Total:</span>
                  <span>৳{t.totalAmount || t.amount}</span>
                </MobileCardRow>
              </MobileCardContent>
              <div
                style={{
                  marginTop: "0.75rem",
                  display: "flex",
                  gap: "0.5rem",
                  justifyContent: "flex-end",
                }}
              >
                <Button bgColor="#22c55e" onClick={() => viewDetails(t._id)}>
                  <FaEye />
                </Button>
                <Button
                  bgColor="#f59e0b"
                  onClick={() => openModal(t)}
                  disabled={t.status === "completed"}
                >
                  <FaEdit />
                </Button>
                <Button
                  bgColor="#ef4444"
                  onClick={() => handleDelete(t._id)}
                  disabled={t.status === "completed"}
                >
                  <FaTrash />
                </Button>
              </div>
            </MobileCard>
          ))}
        </>
      )}

      {/* Edit Modal */}
      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Edit Transaction</ModalTitle>
            {message.text && (
              <Message error={message.type === "error"}>{message.text}</Message>
            )}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "1rem" }}>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  required
                  min="1"
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label className="block text-sm font-medium mb-1">Status</label>
                <Select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value,
                      reason: ["failed", "cancelled"].includes(e.target.value)
                        ? formData.reason
                        : "",
                    })
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="cancelled">Cancelled</option>
                </Select>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label className="block text-sm font-medium mb-1">
                  Reason{" "}
                  {["failed", "cancelled"].includes(formData.status) && (
                    <span className="text-red-600">*</span>
                  )}
                </label>
                <Textarea
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  placeholder={
                    ["failed", "cancelled"].includes(formData.status)
                      ? "Required"
                      : "Optional"
                  }
                  required={["failed", "cancelled"].includes(formData.status)}
                />
              </div>
              <div
                style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}
              >
                <Button type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update"}
                </Button>
                <Button
                  type="button"
                  bgColor="#6b7280"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}
