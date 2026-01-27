// BalanceTransferController.jsx (Styled-Components)
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import styled, { keyframes } from "styled-components";
import { API_URL } from "../utils/baseURL";

const fadeIn = keyframes` from { opacity: 0; } to { opacity: 1; }`;

const Container = styled.div`
  min-height: 100vh;
  background: #0f172a;
  color: white;
  padding: 3rem 1rem;
`;
const Wrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;
const Title = styled.h1`
  font-size: 3.5rem;
  text-align: center;
  margin-bottom: 3rem;
  background: linear-gradient(to right, #06b6d4, #8b5cf6);
  -webkit-background-clip: text;
  color: transparent;
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
`;

const Card = styled.div`
  background: rgba(30, 41, 59, 0.9);
  border-radius: 20px;
  padding: 2rem;
  border: 2px solid rgba(100, 100, 255, 0.3);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
`;

const CardTitle = styled.h3`
  font-size: 1.6rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #06b6d4;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
  background: #1e293b;
  border: 2px solid #334155;
  border-radius: 12px;
  color: white;
  font-size: 1.1rem;
  &:focus {
    outline: none;
    border-color: #06b6d4;
  }
`;

const Toggle = styled.label`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  cursor: pointer;
  font-size: 1.3rem;
`;

const SaveBtn = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(90deg, #06b6d4, #3b82f6);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  cursor: pointer;
  &:hover {
    transform: translateY(-3px);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const BalanceTransferController = () => {
  const [data, setData] = useState({});

  const sources = [
    {
      key: "commissionBalance",
      label: "Total Withdraw Balance",
      color: "#ec4899",
    },
    {
      key: "gameLossCommissionBalance",
      label: "Game Loss Commission",
      color: "#06b6d4",
    },
    {
      key: "depositCommissionBalance",
      label: "Deposit Commission",
      color: "#8b5cf6",
    },
    {
      key: "referCommissionBalance",
      label: "Referral Commission",
      color: "#10b981",
    },
  ];

  useEffect(() => {
    axios
      .get(`${API_URL}/api/balance-transfer`)
      .then((res) => setData(res.data.data || {}))
      .catch(() => toast.error("Failed to load"));
  }, []);

  const handleSave = async (sourceKey) => {
    const formData = {
      source: sourceKey,
      enabled: data[sourceKey]?.enabled ?? true,
      minAmount: data[sourceKey]?.minAmount || 100,
      maxAmount: data[sourceKey]?.maxAmount || 50000,
    };

    try {
      await axios.post(`${API_URL}/api/balance-transfer`, formData);
      toast.success(`${sources.find((s) => s.key === sourceKey).label} saved!`);
    } catch {
      toast.error("Failed to save");
    }
  };

  const updateField = (source, field, value) => {
    setData((prev) => ({
      ...prev,
      [source]: { ...prev[source], [field]: value },
    }));
  };

  return (
    <Container>
      <Wrapper>
        <Title>Balance Transfer Rules</Title>
        <Grid>
          {sources.map((src) => (
            <Card key={src.key}>
              <CardTitle style={{ color: src.color }}>{src.label}</CardTitle>

              <Toggle>
                <input
                  type="checkbox"
                  checked={data[src.key]?.enabled ?? true}
                  onChange={(e) =>
                    updateField(src.key, "enabled", e.target.checked)
                  }
                />
                Enable Transfer
              </Toggle>

              <Input
                type="number"
                placeholder="Min Amount"
                value={data[src.key]?.minAmount || ""}
                onChange={(e) =>
                  updateField(src.key, "minAmount", +e.target.value)
                }
              />

              <Input
                type="number"
                placeholder="Max Amount"
                value={data[src.key]?.maxAmount || ""}
                onChange={(e) =>
                  updateField(src.key, "maxAmount", +e.target.value)
                }
              />

              <SaveBtn onClick={() => handleSave(src.key)}>
                Save This Rule
              </SaveBtn>
            </Card>
          ))}
        </Grid>
      </Wrapper>
    </Container>
  );
};

export default BalanceTransferController;
