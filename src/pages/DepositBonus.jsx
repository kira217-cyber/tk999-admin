import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import styled from "styled-components";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../utils/baseURL";

// === তোমার সব Styled Components (একদম আগের মতোই) ===
const Container = styled.div`
  padding: 40px 20px;
  max-width: 1440px;
  margin: 0 auto;
  background: linear-gradient(135deg, #e0e7ff 0%, #dbeafe 100%);
  min-height: 100vh;
  @media (max-width: 768px) {
    padding: 20px 15px;
  }
`;

const Header = styled.div`
  margin-bottom: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #1e1b4b;
  font-weight: 800;
  letter-spacing: -0.5px;
  background: linear-gradient(90deg, #7c3aed, #db2777);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  @media (max-width: 600px) {
    font-size: 1.8rem;
  }
`;

const FormCard = styled.form`
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  margin-bottom: 48px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  }
  @media (max-width: 768px) {
    padding: 24px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border: 2px solid #c3dafe;
  border-radius: 10px;
  font-size: 1rem;
  color: #1e1b4b;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f0ff 100%);
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
  &:focus {
    outline: none;
    border-color: #7c3aed;
    box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.2);
    transform: scale(1.02);
  }
  &::placeholder {
    color: #6b7280;
    opacity: 0.8;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border: 2px solid #c3dafe;
  border-radius: 10px;
  font-size: 1rem;
  color: #1e1b4b;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f0ff 100%);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  &:focus {
    outline: none;
    border-color: #7c3aed;
    box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.2);
  }
`;

const MultiSelectContainer = styled.div`
  margin: 8px 0;
`;

const MultiSelectOption = styled.label`
  display: flex;
  align-items: center;
  margin: 12px 0;
  font-size: 1rem;
  color: #1e1b4b;
  cursor: pointer;
`;

const Checkbox = styled.input`
  margin-right: 10px;
  accent-color: #7c3aed;
  transform: scale(1.2);
`;

const Button = styled.button`
  background: linear-gradient(90deg, #7c3aed 0%, #db2777 100%);
  color: white;
  padding: 12px 28px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(124, 58, 237, 0.4);
  }
  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
    transform: none;
  }
`;

const SecondaryButton = styled(Button)`
  background: linear-gradient(90deg, #f97316 0%, #facc15 100%);
  &:hover {
    box-shadow: 0 8px 20px rgba(249, 115, 22, 0.4);
  }
`;

const PromotionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 32px;
  @media (max-width: 768px) {
    gap: 20px;
  }
`;

const PromotionCard = styled.div`
  background: white;
  padding: 28px;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  }
`;

const ErrorMessage = styled.p`
  color: #dc2626;
  background: #fee2e2;
  padding: 16px;
  border-radius: 10px;
  border-left: 5px solid #dc2626;
  font-weight: 600;
`;

const LoadingMessage = styled.p`
  text-align: center;
  padding: 20px;
  background: #e0e7ff;
  border-radius: 10px;
  color: #4c1d95;
  font-weight: 600;
`;

const FormSection = styled.div`
  margin-bottom: 32px;
  padding: 28px;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border-radius: 12px;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  color: #1e1b4b;
  font-weight: 700;
  margin-bottom: 20px;
  background: linear-gradient(90deg, #7c3aed, #db2777);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const BonusTitle = styled.h4`
  font-size: 1.1rem;
  color: #1e1b4b;
  font-weight: 600;
  margin: 16px 0 10px;
  background: linear-gradient(90deg, #3b82f6, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const CardText = styled.p`
  font-size: 1rem;
  color: #4b5563;
  margin-bottom: 12px;
  line-height: 1.7;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;
  flex-wrap: wrap;
`;

const BonusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 16px;
`;

const BonusField = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #e0e7ff;
`;

// === Main Component ===
export default function DepositBonus() {
  const [promotions, setPromotions] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialForm = {
    payment_methods: [],
    promotion_bonuses: [],
  };

  const [formData, setFormData] = useState(initialForm);

  // Fetch Data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [bonusRes, methodRes] = await Promise.all([
        axios.get(`${API_URL}/api/deposit-bonus`),
        axios.get(`${API_URL}/api/deposit-payment-method/methods`), // তোমার এই API আছে তো?
      ]);

      setPromotions(bonusRes.data.data || []);
      setPaymentMethods(methodRes.data.data || []);
    } catch (err) {
      toast.error("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Payment Method Selection
  const handleMethodChange = (methodId) => {
    setFormData((prev) => {
      const isSelected = prev.payment_methods.includes(methodId);
      const newMethods = isSelected
        ? prev.payment_methods.filter((id) => id !== methodId)
        : [...prev.payment_methods, methodId];

      const newBonuses = newMethods.map((id) => {
        const existing = prev.promotion_bonuses.find(
          (b) => b.payment_method === id
        );
        return existing || { payment_method: id, bonus_type: "Fix", bonus: 0 };
      });

      return { payment_methods: newMethods, promotion_bonuses: newBonuses };
    });
  };

  // Handle Bonus Change
  const handleBonusChange = (methodId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      promotion_bonuses: prev.promotion_bonuses.map((b) =>
        b.payment_method === methodId
          ? { ...b, [field]: field === "bonus" ? Number(value) || 0 : value }
          : b
      ),
    }));
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.payment_methods.length === 0) {
      toast.error("Select at least one payment method");
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/deposit-bonus/${editingId}`, formData);
        toast.success("Bonus updated successfully!");
      } else {
        await axios.post(`${API_URL}/api/deposit-bonus`, formData);
        toast.success("Bonus created successfully!");
      }
      fetchData();
      setFormData(initialForm);
      setEditingId(null);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  // Edit
  const handleEdit = (bonus) => {
    setEditingId(bonus._id);
    setFormData({
      payment_methods: bonus.payment_methods.map((m) => m._id || m),
      promotion_bonuses: bonus.promotion_bonuses.map((b) => ({
        payment_method: b.payment_method._id || b.payment_method,
        bonus_type: b.bonus_type,
        bonus: b.bonus,
      })),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this bonus permanently?")) return;
    try {
      await axios.delete(`${API_URL}/api/deposit-bonus/${id}`);
      toast.success("Deleted successfully");
      fetchData();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // Cancel Edit
  const cancelEdit = () => {
    setEditingId(null);
    setFormData(initialForm);
  };

  return (
    <Container>
      <ToastContainer position="top-right" theme="colored" />

      <Header>
        <Title>Deposit Bonus Management</Title>
      </Header>

      <FormCard onSubmit={handleSubmit}>
        <SectionTitle>
          {editingId ? "Edit Bonus" : "Create New Bonus"}
        </SectionTitle>

        <FormSection>
          <SectionTitle>Select Payment Methods</SectionTitle>
          {paymentMethods.length === 0 ? (
            <LoadingMessage>No payment methods found</LoadingMessage>
          ) : (
            <MultiSelectContainer>
              {paymentMethods.map((method) => (
                <MultiSelectOption key={method._id}>
                  <Checkbox
                    type="checkbox"
                    checked={formData.payment_methods.includes(method._id)}
                    onChange={() => handleMethodChange(method._id)}
                  />
                  {method.methodName}{" "}
                  {method.methodNameBD && `(${method.methodNameBD})`}
                </MultiSelectOption>
              ))}
            </MultiSelectContainer>
          )}
        </FormSection>

        {formData.payment_methods.length > 0 && (
          <FormSection>
            <SectionTitle>Bonus Configuration</SectionTitle>
            <BonusGrid>
              {formData.payment_methods.map((methodId) => {
                const method = paymentMethods.find((m) => m._id === methodId);
                const bonus = formData.promotion_bonuses.find(
                  (b) => b.payment_method === methodId
                ) || {
                  bonus_type: "Fix",
                  bonus: 0,
                };

                return (
                  <BonusField key={methodId}>
                    <BonusTitle>
                      {method?.methodName || "Unknown"} Bonus
                    </BonusTitle>
                    <Select
                      value={bonus.bonus_type}
                      onChange={(e) =>
                        handleBonusChange(
                          methodId,
                          "bonus_type",
                          e.target.value
                        )
                      }
                    >
                      <option value="Fix">Fixed Amount</option>
                      <option value="Percentage">Percentage (%)</option>
                    </Select>
                    <Input
                      type="number"
                      value={bonus.bonus}
                      onChange={(e) =>
                        handleBonusChange(methodId, "bonus", e.target.value)
                      }
                      placeholder="Enter bonus value"
                      min="0"
                      required
                    />
                  </BonusField>
                );
              })}
            </BonusGrid>
          </FormSection>
        )}

        <ButtonGroup>
          <Button type="submit" disabled={submitting || loading}>
            {editingId ? "Update Bonus" : "Create Bonus"}
          </Button>
          {editingId && (
            <SecondaryButton type="button" onClick={cancelEdit}>
              Cancel
            </SecondaryButton>
          )}
        </ButtonGroup>
      </FormCard>

      {loading ? (
        <LoadingMessage>Loading bonuses...</LoadingMessage>
      ) : promotions.length === 0 ? (
        <ErrorMessage>No deposit bonuses created yet.</ErrorMessage>
      ) : (
        <PromotionGrid>
          {promotions.map((bonus) => (
            <PromotionCard key={bonus._id}>
              <CardText>
                <strong>Methods:</strong>{" "}
                {bonus.payment_methods
                  .map((m) => m.methodName || m._id)
                  .join(" • ")}
              </CardText>
              <CardText>
                <strong>Bonuses:</strong>{" "}
                {bonus.promotion_bonuses
                  .map(
                    (b) =>
                      `${b.payment_method?.methodName || "Unknown"}: ${
                        b.bonus
                      } ${b.bonus_type === "Percentage" ? "%" : "৳"} (${
                        b.bonus_type
                      })`
                  )
                  .join(" | ")}
              </CardText>
              <ButtonGroup>
                <Button onClick={() => handleEdit(bonus)}>Edit</Button>
                <SecondaryButton onClick={() => handleDelete(bonus._id)}>
                  Delete
                </SecondaryButton>
              </ButtonGroup>
            </PromotionCard>
          ))}
        </PromotionGrid>
      )}
    </Container>
  );
}
