import React from "react";
import { io } from "socket.io-client";
import { SOCKET_URL, baseURL } from "../utils/baseURL";
import { useSelector } from "react-redux";
import { selectToken } from "../redux/auth/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import styled, { keyframes, css } from "styled-components";

// Soft pulse for online status
const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
`;

const floatOrb = keyframes`
  0% { transform: translateY(0) rotate(0deg); }
  100% { transform: translateY(-30px) rotate(5deg); }
`;

// Styled Components
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
  background: radial-gradient(circle at 30% 30%, #7b2cbf 0%, transparent 60%);
  top: -200px;
  right: -200px;
  opacity: 0.3;
  animation: ${floatOrb} 20s ease-in-out infinite alternate;
  pointer-events: none;
  z-index: 0;

  @media (max-width: 768px) {
    width: 400px;
    height: 400px;
    top: -100px;
    right: -100px;
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
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(90deg, #00d4ff, #7b2cbf, #ff6bcb);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: -1px;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  color: #a0a0ff;
  font-size: 1.2rem;
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
  border: 1px solid rgba(123, 44, 191, 0.4);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  transition: all 0.4s ease;

  &:hover {
    transform: translateY(-10px);
    border-color: #7b2cbf;
    box-shadow: 0 20px 40px rgba(123, 44, 191, 0.3);
  }
`;

const StatNumber = styled.div`
  font-size: 4rem;
  font-weight: 900;
  color: ${props => props.online ? "#00ff9d" : "#ff3366"};
  text-shadow: 0 0 30px ${props => props.online ? "rgba(0,255,157,0.6)" : "rgba(255,51,102,0.6)"};
  animation: ${props => props.online ? css`${pulse} 2s infinite` : "none"};
`;

const StatLabel = styled.div`
  color: #bb86fc;
  font-size: 1.1rem;
  margin-top: 0.5rem;
  font-weight: 500;
`;

const DevicesSection = styled.div`
  background: rgba(15, 10, 40, 0.5);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(123, 44, 191, 0.5);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
`;

const SectionHeader = styled.div`
  background: linear-gradient(90deg, #7b2cbf, #9d4edd);
  padding: 1.5rem 2rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 640px) {
    font-size: 1.3rem;
    padding: 1.2rem 1.5rem;
  }
`;

const DeviceList = styled.div`
  padding: 1rem;

  @media (min-width: 769px) {
    display: none; /* Hide on desktop */
  }
`;

const DeviceCard = styled(motion.div)`
  background: rgba(30, 20, 70, 0.4);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(123, 44, 191, 0.3);
  transition: all 0.3s;

  &:hover {
    border-color: #7b2cbf;
    background: rgba(123, 44, 191, 0.15);
  }
`;

const DeviceInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0.8rem 0;
  font-size: 1rem;
`;

const Label = styled.span`
  color: #888;
`;

const Value = styled.span`
  color: #e0e0ff;
  font-weight: 600;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  background: ${props => props.active ? "rgba(0,255,157,0.2)" : "rgba(100,100,100,0.3)"};
  color: ${props => props.active ? "#00ff9d" : "#aaa"};
  border: 1px solid ${props => props.active ? "#00ff9d" : "#555"};
`;

const DesktopTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Th = styled.th`
  text-align: left;
  padding: 1.5rem 1.8rem;
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
  padding: 1.5rem 1.8rem;
  border-bottom: 1px solid rgba(123, 44, 191, 0.2);
`;

const StatusDot = styled.span`
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.active ? "#00ff9d" : "#666"};
  box-shadow: 0 0 15px ${props => props.active ? "#00ff9d" : "#666"};
  animation: ${props => props.active ? css`${pulse} 1.5s infinite` : "none"};
`;

const ConnectionBadge = styled.div`
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  background: ${props => props.connected ? "rgba(0,255,157,0.15)" : "rgba(255,51,102,0.15)"};
  color: ${props => props.connected ? "#00ff9d" : "#ff3366"};
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.95rem;
  border: 1px solid ${props => props.connected ? "#00ff9d" : "#ff3366"};
  backdrop-filter: blur(10px);
  z-index: 100;
  box-shadow: 0 8px 30px rgba(0,0,0,0.5);

  @media (max-width: 640px) {
    top: 1rem;
    right: 1rem;
    font-size: 0.85rem;
    padding: 0.6rem 1.2rem;
  }
`;

const OpayDeviceMonitoring = () => {
  const token = useSelector(selectToken);
  const [connected, setConnected] = React.useState(false);
  const [viewerDevices, setViewerDevices] = React.useState([]);

  React.useEffect(() => {
    let socket = null;
    let viewerKey = "";

    const init = async () => {
      try {
        const res = await fetch(`${baseURL}/opay/config`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        viewerKey = data?.data?.viewerApiKey || data?.data?.apiKey || "";

        if (viewerKey && SOCKET_URL) {
          socket = io(SOCKET_URL, { transports: ['websocket'] });

          socket.on('connect', () => {
            setConnected(true);
            socket.emit('viewer:registerApiKey', { apiKey: viewerKey });
          });

          socket.on('disconnect', () => setConnected(false));

          socket.on('viewer:devices', (list) => {
            if (Array.isArray(list)) setViewerDevices(list);
          });

          socket.on('viewer:device', (item) => {
            if (!item?.deviceId) return;
            setViewerDevices(prev => {
              const map = new Map(prev.map(d => [d.deviceId, d]));
              map.set(item.deviceId, { ...map.get(item.deviceId), ...item });
              return Array.from(map.values());
            });
          });
        }
      } catch (err) {}
    };

    init();

    return () => {
      if (socket) socket.disconnect();
    };
  }, [token]);

  const activeCount = viewerDevices.filter(d => d.active).length;

  return (
    <Page>
      <Orb />
      <ConnectionBadge connected={connected}>
        {connected ? "LIVE • CONNECTED" : "OFFLINE"}
      </ConnectionBadge>

      <Container>
        <Header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Title>Device Monitoring</Title>
          <Subtitle>Real-time tracking of your Opay connected devices</Subtitle>
        </Header>

        <StatsGrid>
          <StatCard
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div style={{ color: "#bb86fc", fontSize: "1.2rem" }}>Online Now</div>
            <StatNumber online={activeCount > 0}>{activeCount}</StatNumber>
            <StatLabel>Active Devices</StatLabel>
          </StatCard>

          <StatCard
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div style={{ color: "#bb86fc", fontSize: "1.2rem" }}>Total Registered</div>
            <StatNumber online={viewerDevices.length > 0}>{viewerDevices.length}</StatNumber>
            <StatLabel>Known Devices</StatLabel>
          </StatCard>
        </StatsGrid>

        <DevicesSection>
          <SectionHeader>
            <span>Your Opay Devices</span>
            <span>{activeCount} Online</span>
          </SectionHeader>

          {/* Desktop Table */}
          <DesktopTable>
            <thead>
              <tr>
                <Th>Status</Th>
                <Th>Device ID</Th>
                <Th>Name</Th>
                <Th>User</Th>
                <Th>Last Seen</Th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {viewerDevices.length === 0 ? (
                  <Tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Td colSpan="5" style={{ textAlign: "center", padding: "4rem", color: "#666" }}>
                      No devices connected yet.<br />
                      <span style={{ color: "#7b2cbf" }}>Waiting for connection...</span>
                    </Td>
                  </Tr>
                ) : (
                  viewerDevices.map((device) => (
                    <Tr
                      key={device.deviceId}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <Td>
                        <StatusDot active={device.active} />
                        {device.active ? "Online" : "Offline"}
                      </Td>
                      <Td style={{ fontFamily: "monospace", color: "#ff6bcb" }}>
                        {device.deviceId}
                      </Td>
                      <Td>{device.deviceName || "—"}</Td>
                      <Td>{device.deviceUserName || "—"}</Td>
                      <Td>{device.lastSeen ? new Date(device.lastSeen).toLocaleString() : "—"}</Td>
                    </Tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </DesktopTable>

          {/* Mobile Cards */}
          <DeviceList>
            <AnimatePresence>
              {viewerDevices.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem", color: "#666" }}>
                  No devices yet.<br /><span style={{ color: "#7b2cbf" }}>Waiting...</span>
                </div>
              ) : (
                viewerDevices.map((device) => (
                  <DeviceCard
                    key={device.deviceId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                      <StatusBadge active={device.active}>
                        <StatusDot active={device.active} />
                        {device.active ? "ONLINE" : "OFFLINE"}
                      </StatusBadge>
                      <span style={{ fontSize: "0.9rem", color: "#aaa" }}>
                        {new Date(device.lastSeen).toLocaleTimeString()}
                      </span>
                    </div>

                    <DeviceInfoRow>
                      <Label>Device ID</Label>
                      <Value style={{ fontFamily: "monospace", fontSize: "0.95rem" }}>
                        {device.deviceId}
                      </Value>
                    </DeviceInfoRow>

                    <DeviceInfoRow>
                      <Label>Name</Label>
                      <Value>{device.deviceName || "Unknown"}</Value>
                    </DeviceInfoRow>

                    <DeviceInfoRow>
                      <Label>User</Label>
                      <Value>{device.deviceUserName || "—"}</Value>
                    </DeviceInfoRow>
                  </DeviceCard>
                ))
              )}
            </AnimatePresence>
          </DeviceList>
        </DevicesSection>
      </Container>
    </Page>
  );
};

export default OpayDeviceMonitoring;