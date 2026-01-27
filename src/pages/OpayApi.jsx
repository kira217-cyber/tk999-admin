import React from "react";
import { useSelector } from "react-redux";
import { selectToken } from "../redux/auth/authSlice";
import { baseURL, baseURL_For_DOMAIN } from "../utils/baseURL";
import { motion } from "framer-motion";
import styled, { keyframes } from "styled-components";

// Keyframes for animations
const glow = keyframes`
  from { box-shadow: 0 0 20px rgba(0, 255, 255, 0.6); }
  to { box-shadow: 0 0 40px rgba(255, 0, 255, 0.9); }
`;

const pulse = keyframes`
  from { transform: scale(1); }
  to { transform: scale(1.05); }
`;

const float = keyframes`
  from { transform: translateY(0px); }
  to { transform: translateY(-20px); }
`;

// Styled Components
const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f1e 0%, #1a0033 50%, #000428 100%);
  color: white;
  font-family: 'Orbitron', 'Segoe UI', sans-serif;
  overflow: hidden;
  position: relative;
`;

const BackgroundGlow = styled.div`
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(138,43,226,0.6) 0%, transparent 70%);
  top: -200px;
  right: -200px;
  animation: ${float} 8s ease-in-out infinite alternate;
`;

const Container = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  position: relative;
  z-index: 10;
`;

const Title = styled(motion.h1)`
  text-align: center;
  font-size: 4.5rem;
  font-weight: 900;
  background: linear-gradient(90deg, #00ffff, #ff00ff, #ffff00, #ff00ff);
  background-size: 300%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: gradient 6s ease infinite;
  margin-bottom: 60px;

  @keyframes gradient {
    0% { background-position: 0%; }
    100% { background-position: 300%; }
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: start;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled(motion.div)`
  background: rgba(20, 20, 40, 0.7);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  border: 1px solid rgba(138, 43, 226, 0.4);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(138,43,226,0.1) 50%, transparent 70%);
    );
    transform: translateX(-100%);
    transition: transform 0.6s;
  }

  &:hover::before {
    transform: translateX(100%);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 20px;
  font-size: 1.2rem;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid #8a2be2;
  border-radius: 16px;
  color: white;
  outline: none;
  transition: all 0.4s;

  &:focus {
    border-color: #00ffff;
    box-shadow: 0 0 30px rgba(0, 255, 255, 0.6);
  }

  &::placeholder {
    color: #888;
  }
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: 20px;
  margin-top: 30px;
  font-size: 1.5rem;
  font-weight: bold;
  background: linear-gradient(45deg, #8a2be2, #ff00ff, #00ffff);
  background-size: 300%;
  color: white;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  animation: gradient 4s ease infinite;
  box-shadow: 0 10px 30px rgba(138, 43, 226, 0.6);

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    animation: none;
  }
`;

const StatusCard = styled(Card)`
  border-color: ${props => props.valid ? "#00ff88" : "#ff0044"};
  background: ${props => props.valid 
    ? "linear-gradient(135deg, rgba(0,255,100,0.1), rgba(0,100,50,0.3))" 
    : "linear-gradient(135deg, rgba(255,0,100,0.1), rgba(100,0,50,0.3))"};
`;

const StatusText = styled(motion.div)`
  font-size: 6rem;
  font-weight: 900;
  text-align: center;
  margin: 40px 0;
  background: ${props => props.valid 
    ? "linear-gradient(45deg, #00ff88, #00ffff)" 
    : "linear-gradient(45deg, #ff0044, #ff00ff)"};
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const ToggleWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  font-size: 1.4rem;
`;

const ToggleSwitch = styled.div`
  position: relative;
  width: 100px;
  height: 50px;
  background: ${props => props.active ? "#8a2be2" : "#333"};
  border-radius: 50px;
  transition: 0.4s;

  &::before {
    content: '';
    position: absolute;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    top: 3px;
    left: ${props => props.active ? "53px" : "3px"};
    background: white;
    transition: 0.4s;
    box-shadow: 0 0 20px rgba(138,43,226,0.8);
  }
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 20px;
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  margin: 15px 0;
  font-size: 1.3rem;
  border: 1px solid rgba(138,43,226,0.3);
`;

const PlanBadge = styled.div`
  display: inline-block;
  padding: 16px 40px;
  background: linear-gradient(45deg, #ff00ff, #8a2be2, #00ffff);
  border-radius: 50px;
  font-weight: bold;
  font-size: 1.5rem;
  margin-top: 30px;
  box-shadow: 0 0 40px rgba(138,43,226,0.8);
  animation: ${glow} 2s ease-in-out infinite alternate;
`;

const OpayApi = () => {
  const [apiKey, setApiKey] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [active, setActive] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [savedMsg, setSavedMsg] = React.useState("");
  const [shouldAutoSubmit, setShouldAutoSubmit] = React.useState(false);
  const [autoSubmitted, setAutoSubmitted] = React.useState(false);

  const token = useSelector(selectToken);
  const expectedDomain = baseURL_For_DOMAIN || "";

  // Helpers
  const saveToServer = async (payload) => {
    const res = await fetch(`${baseURL}/opay/config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });
    return res.json();
  };

  const toggleActiveRequest = async (next) => {
    const res = await fetch(`${baseURL}/opay/config/active`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ active: next }),
    });
    return res.json();
  };

  // Load existing config on mount
  React.useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${baseURL}/opay/config`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const data = await res.json();
        if (data?.success && data?.data) {
          setActive(Boolean(data.data.active));
          if (data.data.apiKey) {
            setApiKey(data.data.apiKey);
            setShouldAutoSubmit(true);
          }
        }
      } catch (e) {
        // ignore load errors
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Auto-submit once when a saved key is present
  React.useEffect(() => {
    if (shouldAutoSubmit && !autoSubmitted && apiKey) {
      handleValidate();
      setAutoSubmitted(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldAutoSubmit, autoSubmitted, apiKey]);

  // Validate flow
  const handleValidate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setSavedMsg("");
    try {
      const res = await fetch(`${baseURL}/opay/key/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ apiKey }),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        const msg =
          data?.error?.reason ||
          data?.error?.message ||
          data?.reason ||
          data?.message ||
          'Validation failed';
        setError(msg);
      } else {
        const ext = data.external;
        setResult(ext);
        // Derived checks
        const now = Date.now();
        const end = ext.endDate ? new Date(ext.endDate).getTime() : 0;
        const validOk = !!ext.valid;
        const timeOk = end > now;
        const domains = Array.isArray(ext.domains) ? ext.domains.map(d => String(d).toLowerCase()) : [];
        const primary = (ext.primaryDomain || "").toLowerCase();
        const expected = String(expectedDomain).toLowerCase();
        const domainOk = expected && (domains.includes(expected) || primary === expected);
        const allOk = validOk && timeOk && domainOk;
        if (allOk) {
          try {
            setSaving(true);
            const payload = { apiKey, active: true, lastValidation: ext };
            const resp = await saveToServer(payload);
            if (resp?.success) {
              setActive(true);
              setSavedMsg('API key saved and activated');
            } else {
              setError(resp?.message || 'Failed to auto-save API key');
            }
          } finally {
            setSaving(false);
          }
        }
      }
    } catch (e) {
      setError(e.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const isValid = result && result.valid && new Date(result.endDate) > new Date() &&
    (!expectedDomain || 
      (Array.isArray(result.domains) && result.domains.some(d => String(d).toLowerCase() === expectedDomain.toLowerCase())) ||
      (result.primaryDomain || "").toLowerCase() === expectedDomain.toLowerCase()
    );

  return (
    <PageWrapper>
      <BackgroundGlow />
      
      <Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Title>OPAY API CONFIGURATION</Title>

        <Grid>
          {/* Input Card */}
          <Card
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h2 style={{ fontSize: "2rem", marginBottom: "30px", color: "#8a2be2" }}>
              Enter API Key
            </h2>
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk_live_xxxxxxxxxxxxxxxxxxxx"
            />
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleValidate}
              disabled={loading || !apiKey}
            >
                {loading ? "VALIDATING..." : "SUBMIT"}
            </Button>

            {error && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                style={{ color: "#ff3366", marginTop: "20px", fontSize: "1.2rem" }}
              >
                Error: {error}
              </motion.div>
            )}

            {savedMsg && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{ color: "#00ff88", textAlign: "center", marginTop: "20px", fontSize: "1.4rem", fontWeight: "bold" }}
              >
                {savedMsg}
              </motion.div>
            )}
          </Card>

          {/* Result Card */}
          {result && (
            <StatusCard valid={isValid}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "2.2rem", color: "#8a2be2" }}>Status</h3>
                <ToggleWrapper>
                  <span>{active ? "ACTIVE" : "INACTIVE"}</span>
                  <ToggleSwitch
                    active={active}
                    onClick={async () => {
                      try {
                        setSaving(true);
                        setSavedMsg("");
                        const next = !active;
                        const resp = await toggleActiveRequest(next);
                        if (resp?.success) {
                          setActive(next);
                          setSavedMsg(next ? 'Activated' : 'Deactivated');
                        } else {
                          setError(resp?.message || 'Failed to toggle');
                        }
                      } finally {
                        setSaving(false);
                      }
                    }}
                  />
                </ToggleWrapper>
              </div>

              <StatusText valid={isValid}>
                {isValid ? "VALID" : "INVALID"}
              </StatusText>

              <InfoRow>
                <span>Key Status</span>
                <span style={{ color: result.valid ? "#00ff88" : "#ff3366" }}>
                  {result.valid ? "Valid" : "Invalid"}
                </span>
              </InfoRow>

              <InfoRow>
                <span>Expiry Date</span>
                <span style={{ color: new Date(result.endDate) > new Date() ? "#00ff88" : "#ff3366" }}>
                  {result.endDate ? new Date(result.endDate).toLocaleString() : "Unknown"}
                </span>
              </InfoRow>

              {result.plan?.name && (
                <div style={{ textAlign: "center" }}>
                  <PlanBadge>{result.plan.name.toUpperCase()}</PlanBadge>
                </div>
              )}

              {/* Device and number counts */}
              {typeof result.deviceCount !== 'undefined' && (
                <InfoRow>
                  <span>Devices</span>
                  <span style={{ color: "#00ffff" }}>{result.deviceCount}</span>
                </InfoRow>
              )}
              {typeof result.activeNumberCount !== 'undefined' && (
                <InfoRow>
                  <span>Active Numbers</span>
                  <span style={{ color: "#00ffff" }}>{result.activeNumberCount}</span>
                </InfoRow>
              )}
            </StatusCard>
          )}
        </Grid>
      </Container>
    </PageWrapper>
  );
};

export default OpayApi;