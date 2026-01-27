import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/baseURL";

// Styled Components - Colorful Design
const DashboardContainer = styled.div`
  padding: 1rem;
  margin: 0 auto;
  max-width: 90rem;
  width: 100%;
  box-sizing: border-box;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%);
  min-height: 100vh;
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const Header = styled.div`
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(99, 86, 246, 0.2);
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const Title = styled.h1`
  font-size: 1.75rem;
  color: #ffffff;
  margin: 0;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  @media (min-width: 768px) {
    flex-direction: row;
    gap: 1rem;
    max-width: 32rem;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 24rem;
`;

const SearchInput = styled.input`
  height: 2.75rem;
  width: 100%;
  border-radius: 0.75rem;
  border: 2px solid #e0e7ff;
  background: #ffffff;
  padding: 0.5rem 0.75rem 0.5rem 2.75rem;
  font-size: 0.925rem;
  color: #1e293b;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(99, 86, 246, 0.1);

  &::placeholder {
    color: #94a3b8;
  }
  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 4px rgba(99, 86, 246, 0.3);
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6366f1;
  font-size: 1.25rem;
`;

const StatusFilter = styled.select`
  height: 2.75rem;
  width: 100%;
  max-width: 14rem;
  border-radius: 0.75rem;
  border: 2px solid #e0e7ff;
  background: #ffffff;
  padding: 0 1rem;
  font-size: 0.925rem;
  color: #1e293b;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(99, 86, 246, 0.1);

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 4px rgba(99, 86, 246, 0.3);
  }
`;

const TableWrapper = styled.div`
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin: 0 0.5rem 1.5rem;
  overflow-x: auto;
  border: 1px solid #e0e7ff;
  @media (max-width: 767px) {
    display: none;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 640px;

  th {
    background: linear-gradient(90deg, #4f46e5, #7c3aed);
    padding: 1rem 1.25rem;
    text-align: left;
    font-weight: 600;
    color: #ffffff;
    border-bottom: 4px solid #a78bfa;
    white-space: nowrap;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  td {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #e2e8f0;
    vertical-align: middle;
    color: #334155;
  }

  tr:hover {
    background: linear-gradient(90deg, #eef2ff, #fdf4ff);
    transition: background 0.3s ease;
  }

  @media (min-width: 1024px) {
    th,
    td {
      padding: 1.25rem 1.5rem;
    }
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin: 0 0.5rem;
  @media (min-width: 768px) {
    display: none;
  }
`;

const UserCard = styled.div`
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(99, 86, 246, 0.15);
  padding: 1.25rem;
  display: grid;
  gap: 1rem;
  font-size: 0.925rem;
  border: 2px solid transparent;
  background-clip: padding-box;
  position: relative;
  transition: all 0.3s ease;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    padding: 2px;
    border-radius: 1rem;
    background: linear-gradient(45deg, #6366f1, #ec4899);
    mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    mask-composite: exclude;
    -webkit-mask-composite: destination-out;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(99, 86, 246, 0.25);
  }

  @media (min-width: 640px) {
    padding: 1.75rem;
    gap: 1.25rem;
  }
`;

const CardLabel = styled.span`
  font-weight: 700;
  color: #4f46e5;
`;

const CardValue = styled.span`
  color: #334155;
  word-break: break-word;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
`;

const StyledSpinner = styled.div`
  border: 6px solid #e0e7ff;
  border-top: 6px solid #6366f1;
  border-right: 6px solid #ec4899;
  border-radius: 50%;
  width: 4rem;
  height: 4rem;
  animation: spin 0.8s linear infinite;

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
  padding: 1.5rem;
  background: linear-gradient(90deg, #fee2e2, #fecaca);
  color: #dc2626;
  border-radius: 1rem;
  text-align: center;
  margin: 0 0.75rem;
  font-weight: 600;
  box-shadow: 0 10px 20px rgba(220, 38, 38, 0.1);
  border: 1px solid #fca5a5;
`;

const StatusBadge = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  display: inline-block;
  text-transform: capitalize;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  ${({ status }) => {
    switch (status) {
      case "active":
        return `
          background: linear-gradient(90deg, #10b981, #34d399);
          color: #ffffff;
        `;
      case "inactive":
        return `
          background: linear-gradient(90deg, #ef4444, #f87171);
          color: #ffffff;
        `;
      default:
        return `
          background: linear-gradient(90deg, #6b7280, #9ca3af);
          color: #ffffff;
        `;
    }
  }}
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 3rem 1.5rem;
  color: #6366f1;
  font-size: 1.25rem;
  font-weight: 600;
  background: linear-gradient(135deg, #f8fafc, #e0e7ff);
  border-radius: 1rem;
  border: 2px dashed #a78bfa;
  margin: 1rem;
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 2.75rem;
  padding: 0 1.5rem;
  border-radius: 0.75rem;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  color: #ffffff;
  font-size: 0.925rem;
  font-weight: 600;
  outline: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 15px rgba(99, 86, 246, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 25px rgba(99, 86, 246, 0.4);
    background: linear-gradient(90deg, #5b21b6, #7c3aed);
  }
`;

export default function AllUser() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    axios
      .get(`${API_URL}/api/users`)
      .then((res) => {
        setUsers(res.data.users || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(true);
        setErrorMessage(
          err.response?.data?.message || err.message || "Failed to load users"
        );
        setLoading(false);
      });
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.username
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && user.isActive) ||
      (statusFilter === "inactive" && !user.isActive);
    return matchesSearch && matchesStatus;
  });

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleStatusChange = (e) => setStatusFilter(e.target.value);
  const handleViewUser = (userId) => navigate(`/user/${userId}`);

  if (loading) {
    return (
      <DashboardContainer>
        <LoadingContainer>
          <StyledSpinner />
        </LoadingContainer>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <ErrorAlert>
          <strong>Error:</strong> {errorMessage}
        </ErrorAlert>
      </DashboardContainer>
    );
  }

  const renderUserCard = (user) => (
    <UserCard key={user._id}>
      <div>
        <CardLabel>Username:</CardLabel>{" "}
        <CardValue>{user.username || "-"}</CardValue>
      </div>
      <div>
        <CardLabel>Email:</CardLabel> <CardValue>{user.email || "-"}</CardValue>
      </div>
      <div>
        <CardLabel>Phone:</CardLabel>{" "}
        <CardValue>{user.whatsapp || user.phoneNumber || "-"}</CardValue>
      </div>
      <div>
        <CardLabel>Balance:</CardLabel>{" "}
        <CardValue>
          {user.balance !== undefined ? user.balance.toFixed(2) : "-"}
        </CardValue>
      </div>
      <div>
        <CardLabel>Status:</CardLabel>{" "}
        <StatusBadge status={user.isActive ? "active" : "inactive"}>
          {user.isActive ? "Active" : "Deactive"}
        </StatusBadge>
      </div>
      <ActionButton onClick={() => handleViewUser(user._id)}>
        View User
      </ActionButton>
    </UserCard>
  );

  return (
    <DashboardContainer>
      <Header>
        <Title>All Users</Title>
        <FilterContainer>
          <SearchContainer>
            <SearchIcon>🔍</SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search by username..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </SearchContainer>
          <StatusFilter value={statusFilter} onChange={handleStatusChange}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Deactive</option>
          </StatusFilter>
        </FilterContainer>
      </Header>

      {/* Desktop Table View */}
      <TableWrapper>
        <StyledTable>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Balance</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.username || "-"}</td>
                  <td>{user.email || "-"}</td>
                  <td>{user.whatsapp || user.phoneNumber || "-"}</td>
                  <td>
                    {user.balance !== undefined ? user.balance.toFixed(2) : "-"}
                  </td>
                  <td>
                    <StatusBadge status={user.isActive ? "active" : "inactive"}>
                      {user.isActive ? "Active" : "Deactive"}
                    </StatusBadge>
                  </td>
                  <td>
                    <ActionButton onClick={() => handleViewUser(user._id)}>
                      View User
                    </ActionButton>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">
                  <NoDataMessage>
                    {searchTerm || statusFilter !== "all"
                      ? "No users found matching your filters"
                      : "No users available"}
                  </NoDataMessage>
                </td>
              </tr>
            )}
          </tbody>
        </StyledTable>
      </TableWrapper>

      {/* Mobile Card View */}
      <CardContainer>
        {filteredUsers.length > 0 ? (
          filteredUsers.map(renderUserCard)
        ) : (
          <NoDataMessage>
            {searchTerm || statusFilter !== "all"
              ? "No users found matching your filters"
              : "No users available"}
          </NoDataMessage>
        )}
      </CardContainer>
    </DashboardContainer>
  );
}
