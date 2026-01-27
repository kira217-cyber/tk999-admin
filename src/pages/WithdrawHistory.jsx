// src/AdminComponents/WithdrawHistory/WithdrawHistory.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import styled, { keyframes } from "styled-components";
import { format } from "date-fns";
import { API_URL } from "../utils/baseURL";

// Icons (you can use lucide-react or any SVG)
const ClockIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);
const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const XIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const AlertIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Container = styled.div`
  min-height: 100vh;
  background: #0f172a;
  color: white;
  font-family: "Poppins", sans-serif;
  padding: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(to right, #a855f7, #ec4899);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #94a3b8;
  font-size: 1.1rem;
`;

const TableWrapper = styled.div`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border-radius: 1.5rem;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 1.5rem 1rem;
  text-align: left;
  background: rgba(255, 255, 255, 0.1);
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #cbd5e1;
`;

const Td = styled.td`
  padding: 1.2rem 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.85rem;
  font-weight: 600;
  background: ${(props) => props.bg};
  color: ${(props) => props.color};
  border: 1px solid ${(props) => props.border};
`;

const Amount = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
`;

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 6px solid rgba(168, 85, 247, 0.3);
  border-top: 6px solid #a855f7;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin: 4rem auto;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #64748b;
`;

const WithdrawHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/api/admin-withdraw/admin-all-history`
      );
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return {
          bg: "rgba(34, 197, 94, 0.2)",
          color: "#86efac",
          border: "rgba(34, 197, 94, 0.5)",
          icon: <CheckIcon />,
        };
      case "rejected":
        return {
          bg: "rgba(239, 68, 68, 0.2)",
          color: "#fca5a5",
          border: "rgba(239, 68, 68, 0.5)",
          icon: <XIcon />,
        };
      case "pending":
        return {
          bg: "rgba(251, 191, 36, 0.2)",
          color: "#fde047",
          border: "rgba(251, 191, 36, 0.5)",
          icon: <ClockIcon />,
        };
      default:
        return {
          bg: "rgba(100, 100, 100, 0.2)",
          color: "#e2e8f0",
          border: "rgba(100, 100, 100, 0.5)",
          icon: <AlertIcon />,
        };
    }
  };

  return (
    <Container>
      <Header>
        <Title>All Withdraw History</Title>
        <Subtitle>
          Complete history of all withdrawal requests from super affiliates
        </Subtitle>
      </Header>

      {loading ? (
        <Spinner />
      ) : (
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <Th>Status</Th>
                <Th>User</Th>
                <Th>Amount</Th>
                <Th>Method</Th>
                <Th>Account</Th>
                <Th>Type</Th>
                <Th>Requested</Th>
                <Th>Processed</Th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    <EmptyState>
                      <ClockIcon
                        style={{
                          width: 64,
                          height: 64,
                          opacity: 0.3,
                          marginBottom: "1rem",
                        }}
                      />
                      <h3>No withdraw requests found</h3>
                    </EmptyState>
                  </td>
                </tr>
              ) : (
                history.map((item) => {
                  const badge = getStatusBadge(item.status);
                  return (
                    <tr key={item._id} style={{ transition: "0.3s" }}>
                      <Td>
                        <StatusBadge
                          bg={badge.bg}
                          color={badge.color}
                          border={badge.border}
                        >
                          {badge.icon}
                          {item.status.charAt(0).toUpperCase() +
                            item.status.slice(1)}
                        </StatusBadge>
                      </Td>
                      <Td>
                        <div>
                          <div style={{ fontWeight: "600" }}>
                            {item.requester?.username || "Unknown"}
                          </div>
                          <div
                            style={{ fontSize: "0.85rem", color: "#94a3b8" }}
                          >
                            {item.requester?.phone || "N/A"}
                          </div>
                        </div>
                      </Td>
                      <Td>
                        <Amount>৳{item.amount?.toLocaleString()}</Amount>
                      </Td>
                      <Td>{item.method?.methodName || "Unknown"}</Td>
                      <Td style={{ fontFamily: "monospace" }}>
                        {item.accountNumber}
                      </Td>
                      <Td>
                        <span
                          style={{
                            textTransform: "capitalize",
                            fontSize: "0.9rem",
                          }}
                        >
                          {item.paymentType || "—"}
                        </span>
                      </Td>
                      <Td style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                        {format(new Date(item.createdAt), "dd MMM yyyy")}
                        <br />
                        <span style={{ color: "#64748b" }}>
                          {format(new Date(item.createdAt), "hh:mm a")}
                        </span>
                      </Td>
                      <Td style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                        {item.updatedAt && item.status !== "pending" ? (
                          <>
                            {format(new Date(item.updatedAt), "dd MMM yyyy")}
                            <br />
                            <span style={{ color: "#64748b" }}>
                              {format(new Date(item.updatedAt), "hh:mm a")}
                            </span>
                          </>
                        ) : (
                          "—"
                        )}
                      </Td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </TableWrapper>
      )}
    </Container>
  );
};

export default WithdrawHistory;
