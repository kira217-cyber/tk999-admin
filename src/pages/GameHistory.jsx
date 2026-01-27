import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { API_URL } from "../utils/baseURL"; // Adjust path if needed

// Styled Components
const Container = styled.div`
  padding: 1rem;
  max-width: 90rem;
  margin: 0 auto;
  background: #f9fafb;
  min-height: 100vh;
  @media (min-width: 768px) {
    padding: 1.5rem;
  }
`;

const Header = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #000000;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 24rem;
`;

const SearchInput = styled.input`
  height: 2.5rem;
  width: 100%;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  background: #ffffff;
  padding: 0.5rem 0.75rem 0.5rem 2.5rem;
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s ease;
  &::placeholder {
    color: #6b7280;
  }
  &:focus {
    border-color: #1c2937;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  font-size: 1.125rem;
`;

// Desktop Table
const TableWrapper = styled.div`
  background: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
  border: 1px solid #d1d5db;
  margin-bottom: 1rem;
  @media (max-width: 767px) {
    display: none;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
  th {
    background: #1c2937;
    color: #ffffff;
    padding: 0.75rem 1rem;
    text-align: left;
    font-weight: 600;
    white-space: nowrap;
  }
  td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #e5e7eb;
    color: #374151;
  }
  tr:hover {
    background: #f3f4f6;
  }
`;

// Mobile Cards
const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  @media (min-width: 768px) {
    display: none;
  }
`;

const HistoryCard = styled.div`
  background: #ffffff;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #d1d5db;
`;

const CardHeader = styled.div`
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.75rem;
  color: #1c2937;
`;

const CardItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

const Label = styled.span`
  font-weight: 600;
  color: #000000;
`;

const Value = styled.span`
  color: #374151;
  word-break: break-all;
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  ${({ status }) =>
    status === "won"
      ? "background: #16a34a; color: #ffffff;"
      : "background: #dc2626; color: #ffffff;"}
`;

// Common
const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
  font-size: 1.125rem;
  color: #4b5563;
`;

const NoData = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  background: #f3f4f6;
  border-radius: 0.5rem;
  border: 1px dashed #93c5fd;
`;

const GameHistory = () => {
  const [allHistory, setAllHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all users to get their gameHistory
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/users`);
        const users = res.data.users || [];

        // Extract game history from all users
        const historyEntries = [];
        users.forEach((user) => {
          if (user.gameHistory && Array.isArray(user.gameHistory)) {
            user.gameHistory.forEach((entry) => {
              historyEntries.push({
                username: user.username,
                ...entry,
                createdAt: new Date(entry.createdAt), // For sorting
              });
            });
          }
        });

        // Sort by latest first
        historyEntries.sort((a, b) => b.createdAt - a.createdAt);

        setAllHistory(historyEntries);
      } catch (err) {
        console.error("Failed to fetch game history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

  // Filter by username
  const filteredHistory = allHistory.filter((entry) =>
    entry.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return <Loading>Loading game history...</Loading>;
  }

  if (filteredHistory.length === 0) {
    return (
      <Container>
        <Header>
          <Title>Game History</Title>
          <SearchContainer>
            <SearchIcon>🔍</SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search by username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
        </Header>
        <NoData>
          {searchTerm
            ? "No game history found for this username"
            : "No game history available"}
        </NoData>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Game History</Title>
        <SearchContainer>
          <SearchIcon>🔍</SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search by username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
      </Header>

      {/* Desktop Table */}
      <TableWrapper>
        <StyledTable>
          <thead>
            <tr>
              <th>Username</th>
              <th>Provider</th>
              <th>Game Code</th>
              <th>Bet Type</th>
              <th>Amount</th>
              <th>Transaction ID</th>
              <th>Status</th>
              <th>Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.map((entry) => (
              <tr key={entry._id}>
                <td>{entry.username}</td>
                <td>{entry.provider_code || "-"}</td>
                <td>{entry.game_code || "-"}</td>
                <td>{entry.bet_type || "-"}</td>
                <td>{entry.amount || "-"}</td>
                <td>{entry.transaction_id || "-"}</td>
                <td>
                  <StatusBadge status={entry.status}>
                    {entry.status === "won" ? "Won" : "Lost"}
                  </StatusBadge>
                </td>
                <td>{formatDate(entry.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </TableWrapper>

      {/* Mobile Cards */}
      <CardContainer>
        {filteredHistory.map((entry) => (
          <HistoryCard key={entry._id}>
            <CardHeader>{entry.username}'s Game</CardHeader>
            <CardItem>
              <Label>Provider:</Label>
              <Value>{entry.provider_code || "-"}</Value>
            </CardItem>
            <CardItem>
              <Label>Game Code:</Label>
              <Value>{entry.game_code || "-"}</Value>
            </CardItem>
            <CardItem>
              <Label>Bet Type:</Label>
              <Value>{entry.bet_type || "-"}</Value>
            </CardItem>
            <CardItem>
              <Label>Amount:</Label>
              <Value>{entry.amount || "-"}</Value>
            </CardItem>
            <CardItem>
              <Label>Transaction ID:</Label>
              <Value>{entry.transaction_id || "-"}</Value>
            </CardItem>
            <CardItem>
              <Label>Status:</Label>
              <Value>
                <StatusBadge status={entry.status}>
                  {entry.status === "won" ? "Won" : "Lost"}
                </StatusBadge>
              </Value>
            </CardItem>
            <CardItem>
              <Label>Date & Time:</Label>
              <Value>{formatDate(entry.createdAt)}</Value>
            </CardItem>
          </HistoryCard>
        ))}
      </CardContainer>
    </Container>
  );
};

export default GameHistory;
