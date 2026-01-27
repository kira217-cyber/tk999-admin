import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectToken } from "../redux/auth/authSlice";
import { baseURL } from "../utils/baseURL";
import styled, { keyframes, css } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
`;

const floatOrb = keyframes`
  0% { transform: translateY(0) rotate(0deg); }
  100% { transform: translateY(-30px) rotate(5deg); }
`;

const Page = styled.div`
  min-height: 100vh;
  background: #0d0b14;
  color: #e0e0ff;
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  position: relative;
  overflow-x: hidden;
`;

const Orb = styled.div`
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #00d4ff 0%, transparent 60%);
  top: -220px;
  left: -220px;
  opacity: 0.25;
  animation: ${floatOrb} 20s ease-in-out infinite alternate;
  pointer-events: none;
  z-index: 0;

  @media (max-width: 768px) {
    width: 400px;
    height: 400px;
    top: -120px;
    left: -120px;
  }
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  position: relative;
  z-index: 10;
`;

const Header = styled(motion.div)`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 3.2rem;
  font-weight: 800;
  background: linear-gradient(90deg, #00d4ff, #7b2cbf, #ff6bcb);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: -1px;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 2.4rem;
  }
`;

const Subtitle = styled.p`
  color: #a0a0ff;
  font-size: 1.1rem;
  margin-top: 0.8rem;
  opacity: 0.9;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.8rem;
  margin-bottom: 3rem;
`;

const StatCard = styled(motion.div)`
  background: rgba(20, 15, 45, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(0, 212, 255, 0.35);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  transition: all 0.4s ease;

  &:hover {
    transform: translateY(-8px);
    border-color: #00d4ff;
    box-shadow: 0 18px 36px rgba(0, 212, 255, 0.25);
  }
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 900;
  color: #00ff9d;
  text-shadow: 0 0 30px rgba(0,255,157,0.6);
  animation: ${css`${pulse} 2s infinite`};
`;

const StatLabel = styled.div`
  color: #bb86fc;
  font-size: 1.05rem;
  margin-top: 0.5rem;
  font-weight: 500;
`;

const TableWrap = styled.div`
  background: rgba(15, 10, 40, 0.5);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(123, 44, 191, 0.5);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
`;

const DesktopTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;

const Th = styled.th`
  text-align: left;
  padding: 1.2rem 1.6rem;
  background: rgba(123, 44, 191, 0.2);
  color: #bb86fc;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 1px;
`;

const Tr = styled(motion.tr)`
  &:nth-child(even) {
    background: rgba(123, 44, 191, 0.05);
  }
`;

const Td = styled.td`
  padding: 1.1rem 1.6rem;
  border-bottom: 1px solid rgba(123, 44, 191, 0.2);
`;

const ErrorBox = styled.div`
  margin-bottom: 1rem;
  padding: 0.9rem 1rem;
  border-radius: 12px;
  background: rgba(255, 51, 102, 0.15);
  color: #ff99aa;
  border: 1px solid rgba(255, 51, 102, 0.35);
`;

const OpayDepositAdmin = () => {
  const token = useSelector(selectToken);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [sumAmount, setSumAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const run = async () => {
      if (!token) return;
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${baseURL}/opay/verified?page=1&limit=20`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.message || "Failed to load");
        setItems(json.data.items || []);
        setTotal(json.data.total || 0);
        setSumAmount(json.data.sumAmount || 0);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [token]);

  return (
    <Page>
      <Orb />
      <Container>
        <Header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Title>Opay Verified Deposits</Title>
          <Subtitle>Live summary of successful OraclePay deposits</Subtitle>
        </Header>

        {error && <ErrorBox>{error}</ErrorBox>}

        <StatsGrid>
          <StatCard whileHover={{ scale: 1.03 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ color: "#bb86fc", fontSize: "1.1rem" }}>Total Deposits</div>
            <StatNumber>{total}</StatNumber>
            <StatLabel>Records</StatLabel>
          </StatCard>
          <StatCard whileHover={{ scale: 1.03 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <div style={{ color: "#bb86fc", fontSize: "1.1rem" }}>Sum Amount</div>
            <StatNumber>৳{sumAmount}</StatNumber>
            <StatLabel>Total BDT</StatLabel>
          </StatCard>
          <StatCard whileHover={{ scale: 1.03 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div style={{ color: "#bb86fc", fontSize: "1.1rem" }}>Page Size</div>
            <StatNumber>{items.length}</StatNumber>
            <StatLabel>Loaded Rows</StatLabel>
          </StatCard>
        </StatsGrid>

        <TableWrap>
          <DesktopTable>
            <thead>
              <tr>
                <Th>Time</Th>
                <Th>User</Th>
                <Th>Method</Th>
                <Th>Amount</Th>
                <Th>TRXID</Th>
                <Th>Device</Th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {loading ? (
                  <Tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Td colSpan="6" style={{ textAlign: "center", padding: "2.5rem", color: "#888" }}>Loading...</Td>
                  </Tr>
                ) : items.length === 0 ? (
                  <Tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Td colSpan="6" style={{ textAlign: "center", padding: "3rem", color: "#666" }}>No records</Td>
                  </Tr>
                ) : (
                  items.map((it) => (
                    <Tr key={it._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                      <Td>{it.time ? new Date(it.time).toLocaleString() : new Date(it.createdAt).toLocaleString()}</Td>
                      <Td>{it.userIdentifyAddress || '-'}</Td>
                      <Td style={{ textTransform: 'uppercase' }}>{it.method || '-'}</Td>
                      <Td>৳{it.amount ?? '-'}</Td>
                      <Td style={{ fontFamily: 'monospace', color: '#ff6bcb' }}>{it.trxid || '-'}</Td>
                      <Td>{it.deviceName || it.deviceId || '-'}</Td>
                    </Tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </DesktopTable>
        </TableWrap>
      </Container>
    </Page>
  );
};

export default OpayDepositAdmin;
