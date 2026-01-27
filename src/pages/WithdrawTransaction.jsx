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
import { API_URL } from "../utils/baseURL";

// Styled Components
const Container = styled.div`
  padding: 1.5rem;
  background: #f8fafc;
  min-height: 100vh;
  @media (max-width: 640px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  color: #1e293b;
`;

const ControlWrapper = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`;

const FilterToggle = styled.button`
  display: none;
  @media (max-width: 640px) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    cursor: pointer;
  }
`;

const SearchFilterWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 0.75rem;
  margin-bottom: 1rem;
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    display: ${(props) => (props.isOpen ? "grid" : "none")};
    gap: 0.5rem;
  }
`;

const Input = styled.input`
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

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background: white;
`;

const Button = styled.button`
  padding: 0.75rem 1rem;
  background: ${(props) => props.bg || "#3b82f6"};
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  &:hover {
    opacity: 0.9;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TableWrapper = styled.div`
  background: white;
  border-radius: 0.5rem;
  overflow-x: auto;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  background: #f8fafc;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Td = styled.td`
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
  font-size: 0.875rem;
`;

const StatusBadge = styled.span`
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
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

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const MobileCard = styled.div`
  display: none;
  @media (max-width: 640px) {
    display: block;
    background: white;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
`;

const MobileCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-weight: 600;
`;

const Message = styled.div`
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
  background: ${(props) => (props.error ? "#fee2e2" : "#f0fdf4")};
  color: ${(props) => (props.error ? "#dc2626" : "#16a34a")};
  font-weight: 500;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 3rem;
  .spinner {
    border: 4px solid #f3f4f6;
    border-top: 4px solid #3b82f6;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
    margin: 0 auto;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

// Modal Styles
const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

export default function WithdrawTransaction() {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    status: "pending",
    reason: "",
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();
  const { filter } = useParams();

  // Handle URL filter (success → completed, reject → failed)
  useEffect(() => {
    if (filter === "success") setFilterStatus("completed");
    else if (filter === "reject") setFilterStatus("failed");
    else if (["pending", "completed", "failed", "cancelled"].includes(filter)) {
      setFilterStatus(filter);
    } else {
      setFilterStatus("");
    }
  }, [filter]);

  // Fetch all transactions once
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Apply filter
  useEffect(() => {
    if (filterStatus) {
      setFiltered(transactions.filter((t) => t.status === filterStatus));
    } else {
      setFiltered(transactions);
    }
  }, [transactions, filterStatus]);

  const fetchTransactions = async (query = "") => {
    setLoading(true);
    setError("");
    try {
      const url = query
        ? `${API_URL}/api/withdraw-search-transaction/search?query=${encodeURIComponent(
            query
          )}`
        : `${API_URL}/api/withdraw-transaction`;

      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!data.success) throw new Error(data.message || "Failed");

      const reversed = data.data.reverse();
      setTransactions(reversed);
      setFiltered(reversed);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setError("Enter something to search");
      return;
    }
    fetchTransactions(searchQuery);
  };

  const handleRefresh = () => {
    setSearchQuery("");
    setFilterStatus("");
    setShowFilters(false);
    setError("");
    fetchTransactions();
  };

  const openModal = (txn) => {
    setEditId(txn._id);
    setFormData({
      amount: txn.amount,
      status: txn.status,
      reason: txn.reason || "",
    });
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (
      ["failed", "cancelled"].includes(formData.status) &&
      !formData.reason.trim()
    ) {
      setError("Reason is required");
      return;
    }

    setLoading(true);
    try {
      await axios.put(
        `${API_URL}/api/withdraw-transaction/${editId}`,
        formData
      );
      setSuccess("Updated successfully!");
      fetchTransactions();
      setTimeout(() => {
        setShowModal(false);
        setSuccess("");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await axios.delete(`${API_URL}/api/withdraw-transaction/${id}`);
      setSuccess("Deleted!");
      fetchTransactions();
      setTimeout(() => setSuccess(""), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <Container>
      {/* Header */}
      <Header>
        <Title>Withdraw Transactions</Title>
        <ControlWrapper>
          <FilterToggle onClick={() => setShowFilters(!showFilters)}>
            <FaFilter /> Filters <FaChevronDown />
          </FilterToggle>
          <Button onClick={handleRefresh} disabled={loading}>
            <FaSync /> {loading ? "Loading..." : "Refresh"}
          </Button>
        </ControlWrapper>
      </Header>

      {/* Search & Filter */}
      <SearchFilterWrapper isOpen={showFilters}>
        <Input
          type="text"
          placeholder="Search by name, phone, email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Success</option>
          <option value="failed">Reject</option>
          <option value="cancelled">Cancelled</option>
        </Select>
        <Button
          onClick={handleSearch}
          disabled={loading || !searchQuery.trim()}
        >
          <FaSearch /> Search
        </Button>
      </SearchFilterWrapper>

      {/* Messages */}
      {error && <Message error>{error}</Message>}
      {success && <Message>{success}</Message>}

      {/* Loading */}
      {loading && (
        <LoadingSpinner>
          <div className="spinner"></div>
        </LoadingSpinner>
      )}

      {/* Table - Desktop */}
      {!loading && filtered.length > 0 && (
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <Th>User</Th>
                <Th>Method</Th>
                <Th>Channel</Th>
                <Th>Amount</Th>
                <Th>Status</Th>
                <Th>Reason</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t._id}>
                  <Td>
                    {t.userId?.username || "N/A"}
                    {console.log(t)}
                    <br />
                    <small>
                      {t.userInputs.map((input, index) => (
                        <span key={index}>{input.value}</span>
                      ))}
                    </small>
                    {/*  */}
                  </Td>
                  <Td>{t.paymentMethod?.methodName || "—"}</Td>
                  <Td>{t.channel || "—"}</Td>
                  <Td>৳{t.amount}</Td>
                  <Td>
                    <StatusBadge status={t.status}>{t.status}</StatusBadge>
                  </Td>
                  <Td>{t.reason ? t.reason.slice(0, 20) + "..." : "—"}</Td>
                  <Td>
                    <ActionButtons>
                      <Button
                        bg="#22c55e"
                        onClick={() =>
                          navigate(`/Withdraw-transaction/${t._id}`)
                        }
                      >
                        <FaEye />
                      </Button>
                      <Button
                        bg="#f59e0b"
                        onClick={() => openModal(t)}
                        disabled={t.status === "completed"}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        bg="#ef4444"
                        onClick={() => handleDelete(t._id)}
                        disabled={t.status === "completed"}
                      >
                        <FaTrash />
                      </Button>
                    </ActionButtons>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      )}

      {/* Mobile Cards */}
      {!loading &&
        filtered.map((t) => (
          <MobileCard key={t._id}>
            <MobileCardHeader>
              <div>
                <div>{t.userId?.name || "Unknown"}</div>
                <small>{t.userId?.phoneNumber}</small>
              </div>
              <StatusBadge status={t.status}>{t.status}</StatusBadge>
            </MobileCardHeader>
            <div>
              <strong>Method:</strong> {t.paymentMethod?.methodName || "—"}
            </div>
            <div>
              <strong>Amount:</strong> ৳{t.amount}
            </div>
            <ActionButtons style={{ marginTop: "1rem" }}>
              <Button
                bg="#22c55e"
                onClick={() => navigate(`/Withdraw-transaction/${t._id}`)}
              >
                <FaEye />
              </Button>
              <Button
                bg="#f59e0b"
                onClick={() => openModal(t)}
                disabled={t.status === "completed"}
              >
                <FaEdit />
              </Button>
              <Button
                bg="#ef4444"
                onClick={() => handleDelete(t._id)}
                disabled={t.status === "completed"}
              >
                <FaTrash />
              </Button>
            </ActionButtons>
          </MobileCard>
        ))}

      {/* Edit Modal */}
      {showModal && (
        <Modal onClick={() => setShowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: "1.5rem", marginBottom: "1.5rem" }}>
              Edit Transaction
            </h3>
            {error && <Message error>{error}</Message>}
            {success && <Message>{success}</Message>}
            <form onSubmit={handleUpdate}>
              <div style={{ marginBottom: "1rem" }}>
                <label>Amount</label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  min="200"
                  max="30000"
                  required
                />
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label>Status</label>
                <Select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="cancelled">Cancelled</option>
                </Select>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label>
                  Reason{" "}
                  {["failed", "cancelled"].includes(formData.status) &&
                    "(Required)"}
                </label>
                <textarea
                  rows="4"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "0.375rem",
                    border: "1px solid #e2e8f0",
                  }}
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  required={["failed", "cancelled"].includes(formData.status)}
                />
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <Button type="submit" disabled={loading}>
                  Update
                </Button>
                <Button
                  type="button"
                  bg="#6b7280"
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
