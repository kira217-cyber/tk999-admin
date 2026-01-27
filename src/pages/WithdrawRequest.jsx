// src/AdminComponents/WithdrawSystem/WithdrawRequest.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import styled, { css } from "styled-components";
import { API_URL } from "../utils/baseURL";

// ==================== Styled Components (একই রেখেছি) ====================

const Container = styled(motion.div)`
  min-height: 100vh;
  padding: 2rem 1.5rem;
  background: #0f172a;
  font-family: "Poppins", sans-serif;
  color: white;
`;

const Header = styled(motion.div)`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(to right, #a855f7, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  opacity: 0.8;
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;
`;

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1.5rem;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  ${({ $processed }) =>
    $processed &&
    css`
      box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
      border-color: rgba(255, 255, 255, 0.6);
    `}
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const IconName = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconWrapper = styled.div`
  background: white;
  padding: 0.5rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Username = styled.p`
  font-size: 0.875rem;
  opacity: 0.7;
  margin-top: 0.25rem;
`;

const StatusBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  ${({ $bg }) => $bg && css`background: ${$bg};`}
  ${({ $color }) => $color && css`color: ${$color};`}
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 1rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
`;

const ActionBtn = styled(motion.button)`
  flex: 1;
  padding: 0.75rem;
  border-radius: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
  ${({ $type }) =>
    $type === "approve"
      ? css`
          background: #10b981;
          color: white;
          &:hover { background: #059669; }
        `
      : css`
          background: #ef4444;
          color: white;
          &:hover { background: #dc2626; }
        `}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 5rem 1rem;
`;

const EmptyCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border-radius: 1.5rem;
  padding: 3rem;
  max-width: 420px;
  margin: 0 auto;
`;

// ==================== Main Component (সব ঠিক করা) ====================

const WithdrawRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [processedRequests, setProcessedRequests] = useState({});

  const adminId = localStorage.getItem("userId");

  const fetchRequests = async () => {
    if (!API_URL) {
      toast.error("API URL not configured");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/admin-withdraw/requests`);
      setRequests(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err.response || err);
      toast.error(err.response?.data?.msg || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminId) fetchRequests();
    const interval = setInterval(fetchRequests, 10000);
    return () => clearInterval(interval);
  }, [adminId]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setProcessedRequests((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((id) => {
          if (now - updated[id].timestamp > 60000) delete updated[id];
        });
        return updated;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (requestId) => {
    setProcessingId(requestId);
    try {
      await axios.put(`${API_URL}/api/admin-withdraw/approve/${requestId}`);

      setRequests((prev) =>
        prev.map((r) => (r._id === requestId ? { ...r, status: "approved" } : r))
      );

      setProcessedRequests((prev) => ({
        ...prev,
        [requestId]: { status: "approved", timestamp: Date.now() },
      }));

      toast.success("Approved Successfully!");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Approve failed");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId) => {
    setProcessingId(requestId);
    try {
      await axios.put(`${API_URL}/api/admin-withdraw/reject/${requestId}`);

      setRequests((prev) =>
        prev.map((r) => (r._id === requestId ? { ...r, status: "rejected" } : r))
      );

      setProcessedRequests((prev) => ({
        ...prev,
        [requestId]: { status: "rejected", timestamp: Date.now() },
      }));

      toast.error("Rejected – Money Refunded");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Reject failed");
    } finally {
      setProcessingId(null);
    }
  };

  const getMethodIcon = (method) => {
    if (!method) return <Smartphone size={36} />;
    if (method.methodIcon)
      return (
        <img
          src={`${API_URL}${method.methodIcon}`}
          alt={method.methodName}
          style={{ width: 64, height: 64, objectFit: "contain", borderRadius: 12 }}
        />
      );
    const name = (method.methodName || "").toLowerCase();
    if (name.includes("bkash") || name.includes("nagad") || name.includes("rocket"))
      return <Smartphone size={36} />;
    if (name.includes("bank")) return <Building2 size={36} />;
    return <Smartphone size={36} />;
  };

  const getStatusBadge = (status, reqId) => {
    const processed = processedRequests[reqId];
    const currentStatus = processed?.status || status;

    if (currentStatus === "pending")
      return { icon: <Clock size={16} />, bg: "rgba(251, 191, 36, 0.2)", color: "#f59e0b", text: "Pending" };
    if (currentStatus === "approved")
      return { icon: <CheckCircle size={16} />, bg: "rgba(34, 197, 94, 0.2)", color: "#22c55e", text: "Approved" };
    if (currentStatus === "rejected")
      return { icon: <XCircle size={16} />, bg: "rgba(239, 68, 68, 0.2)", color: "#ef4444", text: "Rejected" };
    return { icon: <Clock size={16} />, bg: "rgba(156, 163, 175, 0.2)", color: "#9ca3af", text: "Unknown" };
  };

  const displayedRequests = requests.filter((req) => {
    if (req.status === "pending") return true;
    const processed = processedRequests[req._id];
    return processed && Date.now() - processed.timestamp <= 60000;
  });

  if (!adminId) {
    return (
      <div style={{ textAlign: "center", paddingTop: "5rem", fontSize: "1.8rem", color: "white" }}>
        Please Login as Admin
      </div>
    );
  }

  return (
    <Container initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="max-w-7xl mx-auto">
        <Header initial={{ y: -50 }} animate={{ y: 0 }}>
          <Title>Withdraw Requests</Title>
          <Subtitle>Review and process Super-Affiliate withdrawals</Subtitle>
        </Header>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "6rem 0" }}>
            <Loader2 size={56} className="animate-spin text-white" />
          </div>
        ) : (
          <>
            <Grid layout>
              <AnimatePresence>
                {displayedRequests.map((req, i) => {
                  const status = getStatusBadge(req.status, req._id);
                  const isProcessed = !!processedRequests[req._id];

                  return (
                    <Card
                      key={req._id}
                      layout
                      initial={{ opacity: 0, y: 60 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -10 }}
                      $processed={isProcessed}
                    >
                      <CardHeader>
                        <IconName>
                          <IconWrapper>{getMethodIcon(req.methodId)}</IconWrapper>
                          <div>
                            <h3 style={{ fontSize: "1.3rem", fontWeight: 700 }}>
                              {req.methodId?.methodName || "Unknown Method"}
                            </h3>
                            <Username>{req.requesterId?.username || "Unknown User"}</Username>
                          </div>
                        </IconName>
                        <StatusBadge $bg={status.bg} $color={status.color}>
                          {status.icon} {status.text}
                        </StatusBadge>
                      </CardHeader>

                      <div style={{ marginTop: "1rem" }}>
                        <InfoRow>
                          <span>Amount:</span>
                          <strong>৳{req.amount?.toLocaleString()}</strong>
                        </InfoRow>
                        <InfoRow>
                          <span>Account:</span>
                          <span style={{ fontFamily: "monospace", fontSize: "0.9rem" }}>
                            {req.accountNumber}
                          </span>
                        </InfoRow>
                        <InfoRow>
                          <span>Type:</span>
                          <span
                            style={{
                              padding: "0.35rem 0.9rem",
                              borderRadius: "9999px",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              background:
                                req.paymentType === "personal"
                                  ? "#dbeafe"
                                  : req.paymentType === "agent"
                                  ? "#d1fae5"
                                  : "#f3e8ff",
                              color:
                                req.paymentType === "personal"
                                  ? "#1e40af"
                                  : req.paymentType === "agent"
                                  ? "#065f46"
                                  : "#9333ea",
                            }}
                          >
                            {req.paymentType || "N/A"}
                          </span>
                        </InfoRow>
                      </div>

                      {req.status === "pending" && (
                        <ActionButtons>
                          <ActionBtn
                            $type="approve"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleApprove(req._id)}
                            disabled={processingId === req._id}
                          >
                            {processingId === req._id ? (
                              <Loader2 size={18} className="animate-spin" />
                            ) : (
                              <CheckCircle size={18} />
                            )}
                            Approve
                          </ActionBtn>

                          <ActionBtn
                            $type="reject"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleReject(req._id)}
                            disabled={processingId === req._id}
                          >
                            {processingId === req._id ? (
                              <Loader2 size={18} className="animate-spin" />
                            ) : (
                              <XCircle size={18} />
                            )}
                            Reject
                          </ActionBtn>
                        </ActionButtons>
                      )}

                      {isProcessed && (
                        <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.8rem", opacity: 0.7 }}>
                          This card will disappear in 1 minute
                        </p>
                      )}
                    </Card>
                  );
                })}
              </AnimatePresence>
            </Grid>

            {displayedRequests.length === 0 && (
              <EmptyState>
                <EmptyCard>
                  <div
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      borderRadius: "9999px",
                      width: 120,
                      height: 120,
                      margin: "0 auto 1.5rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <AlertCircle size={64} style={{ opacity: 0.6 }} />
                  </div>
                  <p style={{ fontSize: "1.6rem", opacity: 0.9, marginBottom: "0.5rem" }}>
                    No Pending Requests
                  </p>
                  <p style={{ opacity: 0.7 }}>
                    All withdrawal requests will appear here automatically
                  </p>
                </EmptyCard>
              </EmptyState>
            )}
          </>
        )}
      </div>
    </Container>
  );
};

export default WithdrawRequest;