// admin/PromotionController.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import {
  Upload,
  Edit,
  Trash2,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { API_URL } from "../utils/baseURL";

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  color: white;
  padding: 24px;
  font-family: "Segoe UI", sans-serif;
`;

const Wrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 48px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 40px;
  background: linear-gradient(to right, #06b6d4, #0d9488);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const FormCard = styled.div`
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  padding: 32px;
  margin-bottom: 48px;
  border: 1px solid rgba(6, 182, 212, 0.3);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
`;

const FormTitle = styled.h2`
  font-size: 28px;
  color: #06b6d4;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FormGrid = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const StyledInput = styled.input`
  padding: 16px;
  background: rgba(15, 23, 42, 0.8);
  border: none;
  border-radius: 16px;
  color: white;
  font-size: 16px;
  outline: none;
  transition: all 0.3s;

  &:focus {
    ring: 4px solid #06b6d4;
    box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.3);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const StyledTextarea = styled.textarea`
  padding: 16px;
  background: rgba(15, 23, 42, 0.8);
  border: none;
  border-radius: 16px;
  color: white;
  font-size: 16px;
  min-height: 120px;
  resize: vertical;
  outline: none;

  &:focus {
    box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.3);
  }
`;

const StyledSelect = styled.select`
  padding: 16px;
  background: rgba(15, 23, 42, 0.8);
  border: none;
  border-radius: 16px;
  color: white;
  font-size: 16px;
  outline: none;
`;

const FileInputWrapper = styled.div`
  margin-top: 20px;
`;

const FileLabel = styled.label`
  display: block;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #e2e8f0;
`;

const FileInput = styled.input`
  width: 100%;
  padding: 16px;
  background: rgba(15, 23, 42, 0.8);
  border-radius: 16px;
  color: white;
  cursor: pointer;

  &::-webkit-file-upload-button {
    background: #06b6d4;
    color: black;
    padding: 12px 24px;
    border: none;
    border-radius: 50px;
    font-weight: bold;
    margin-right: 16px;
    cursor: pointer;
  }
`;

const PreviewWrapper = styled.div`
  margin-top: 24px;
  position: relative;
  display: inline-block;
  border-radius: 16px;
  overflow: hidden;
  border: 4px solid rgba(6, 182, 212, 0.5);
`;

const PreviewImage = styled.img`
  width: 100%;
  max-width: 600px;
  display: block;
`;

const ButtonGroup = styled.div`
  grid-column: span 2;
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 32px;

  @media (max-width: 768px) {
    grid-column: span 1;
    flex-direction: column;
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(to right, #06b6d4, #0d9488);
  color: black;
  font-weight: bold;
  font-size: 20px;
  padding: 20px 48px;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s;
  box-shadow: 0 10px 30px rgba(6, 182, 212, 0.4);

  &:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: 0 20px 40px rgba(6, 182, 212, 0.6);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const CancelButton = styled.button`
  background: #475569;
  color: white;
  padding: 20px 40px;
  border-radius: 50px;
  border: none;
  font-weight: bold;
  cursor: pointer;
`;

// Promotions Grid
const PromoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 32px;
`;

const PromoCard = styled.div`
  background: rgba(30, 41, 59, 0.7);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(6, 182, 212, 0.2);
  transition: all 0.3s;

  &:hover {
    transform: translateY(-10px);
    border-color: #06b6d4;
  }
`;

const PromoImage = styled.img`
  width: 100%;
  height: 240px;
  object-fit: cover;
`;

const PromoContent = styled.div`
  padding: 24px;
`;

const PromoTitle = styled.h3`
  font-size: 20px;
  font-weight: bold;
  color: #fbbf24;
  margin-bottom: 8px;
`;

const PromoBangla = styled.p`
  font-size: 14px;
  color: #cbd5e1;
  margin-bottom: 16px;
`;

const CategoryTag = styled.span`
  font-size: 12px;
  color: #06b6d4;
  background: rgba(6, 182, 212, 0.2);
  padding: 6px 12px;
  border-radius: 20px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`;

const EditBtn = styled.button`
  flex: 1;
  background: #3b82f6;
  color: white;
  padding: 12px;
  border-radius: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const DeleteBtn = styled.button`
  flex: 1;
  background: #ef4444;
  color: white;
  padding: 12px;
  border-radius: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

// Main Component
const PromotionController = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState("");
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title_en: "",
    title_bn: "",
    description_en: "",
    description_bn: "",
    footer_en: "",
    footer_bn: "",
    category: "All",
    image: null,
  });

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/promotions`);
      setPromotions(res.data);
    } catch (err) {
      alert("Failed to load promotions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image && !editId) {
      alert("Please select an image");
      return;
    }

    setSubmitting(true);
    const fd = new FormData();
    fd.append("title_en", form.title_en);
    fd.append("title_bn", form.title_bn);
    fd.append("description_en", form.description_en);
    fd.append("description_bn", form.description_bn);
    fd.append("footer_en", form.footer_en);
    fd.append("footer_bn", form.footer_bn);
    fd.append("category", form.category);
    if (form.image) fd.append("image", form.image);

    try {
      if (editId) {
        await axios.put(`${API_URL}/api/promotions/${editId}`, fd);
      } else {
        await axios.post(`${API_URL}/api/promotions`, fd);
      }
      resetForm();
      fetchPromotions();
      alert(editId ? "Updated Successfully!" : "Added Successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({
      title_en: "",
      title_bn: "",
      description_en: "",
      description_bn: "",
      footer_en: "",
      footer_bn: "",
      category: "All",
      image: null,
    });
    setPreview("");
    setEditId(null);
  };

  const handleEdit = (promo) => {
    setForm({
      title_en: promo.title_en,
      title_bn: promo.title_bn,
      description_en: promo.description_en,
      description_bn: promo.description_bn,
      footer_en: promo.footer_en || "",
      footer_bn: promo.footer_bn || "",
      category: promo.category,
      image: null,
    });
    setPreview(promo.image);
    setEditId(promo._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("এই প্রমোশন ডিলিট করবেন?")) return;
    try {
      await axios.delete(`${API_URL}/api/promotions/${id}`);
      fetchPromotions();
      alert("Deleted Successfully!");
    } catch (err) {
      alert("Delete failed!");
    }
  };

  return (
    <Container>
      <Wrapper>
        <Title>Promotion Controller (Admin)</Title>

        <FormCard>
          <FormTitle>
            <Upload size={32} />
            {editId ? "Edit Promotion" : "Add New Promotion"}
          </FormTitle>

          <FormGrid onSubmit={handleSubmit}>
            <InputGroup>
              <StyledInput
                placeholder="Title (English)"
                value={form.title_en}
                onChange={(e) => setForm({ ...form, title_en: e.target.value })}
                required
              />
              <StyledTextarea
                placeholder="Description (English)"
                value={form.description_en}
                onChange={(e) =>
                  setForm({ ...form, description_en: e.target.value })
                }
                required
              />
              <StyledInput
                placeholder="Footer Text (English) - Optional"
                value={form.footer_en}
                onChange={(e) =>
                  setForm({ ...form, footer_en: e.target.value })
                }
              />
            </InputGroup>

            <InputGroup>
              <StyledInput
                placeholder="টাইটেল (বাংলা)"
                value={form.title_bn}
                onChange={(e) => setForm({ ...form, title_bn: e.target.value })}
                required
              />
              <StyledTextarea
                placeholder="বিবরণ (বাংলা)"
                value={form.description_bn}
                onChange={(e) =>
                  setForm({ ...form, description_bn: e.target.value })
                }
                required
              />
              <StyledInput
                placeholder="ফুটার টেক্সট (বাংলা) - ঐচ্ছিক"
                value={form.footer_bn}
                onChange={(e) =>
                  setForm({ ...form, footer_bn: e.target.value })
                }
              />
            </InputGroup>

            <div style={{ gridColumn: "span 2" }}>
              <StyledSelect
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {[
                  "All",
                  "Deposit",
                  "Slots",
                  "Fishing",
                  "APP Download",
                  "Newbie",
                  "Rebate",
                  "Ranking",
                  "Poker",
                  "Live Casino",
                  "Sports",
                ].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </StyledSelect>

              <FileInputWrapper>
                <FileLabel>Upload Promotion Image *</FileLabel>
                <FileInput
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required={!editId}
                />
                {preview && (
                  <PreviewWrapper>
                    <PreviewImage src={preview} alt="Preview" />
                  </PreviewWrapper>
                )}
              </FileInputWrapper>
            </div>

            <ButtonGroup>
              <SubmitButton type="submit" disabled={submitting}>
                {submitting ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : null}
                {submitting
                  ? editId
                    ? "Updating..."
                    : "Adding..."
                  : editId
                  ? "Update Promotion"
                  : "Add Promotion"}
              </SubmitButton>
              {editId && (
                <CancelButton type="button" onClick={resetForm}>
                  Cancel Edit
                </CancelButton>
              )}
            </ButtonGroup>
          </FormGrid>
        </FormCard>

        {loading ? (
          <div style={{ textAlign: "center", padding: "80px" }}>
            <Loader2
              size={64}
              className="animate-spin"
              style={{ color: "#06b6d4" }}
            />
          </div>
        ) : (
          <PromoGrid>
            {promotions.length === 0 ? (
              <div
                style={{
                  gridColumn: "1 / -1",
                  textAlign: "center",
                  fontSize: "24px",
                  color: "#94a3b8",
                  padding: "80px",
                }}
              >
                No promotions yet. Add your first one!
              </div>
            ) : (
              promotions.map((promo) => (
                <PromoCard key={promo._id}>
                  <PromoImage src={promo.image} alt={promo.title_en} />
                  <PromoContent>
                    <PromoTitle>{promo.title_en}</PromoTitle>
                    <PromoBangla>{promo.title_bn}</PromoBangla>
                    <CategoryTag>{promo.category}</CategoryTag>
                    <ActionButtons>
                      <EditBtn onClick={() => handleEdit(promo)}>
                        <Edit size={18} /> Edit
                      </EditBtn>
                      <DeleteBtn onClick={() => handleDelete(promo._id)}>
                        <Trash2 size={18} /> Delete
                      </DeleteBtn>
                    </ActionButtons>
                  </PromoContent>
                </PromoCard>
              ))
            )}
          </PromoGrid>
        )}
      </Wrapper>
    </Container>
  );
};

export default PromotionController;
