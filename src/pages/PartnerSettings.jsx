// admin/PartnerSettings.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { API_URL } from "../utils/baseURL";

// Styled Components
const Page = styled.div`
  min-height: 100vh;
  background: #f1f5f9;
  padding: 20px;
  font-family: "Inter", "Segoe UI", sans-serif;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Header = styled.div`
  color: #1e293b;
  padding: 40px 20px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 800;
  margin: 0;
`;



const FormWrapper = styled.div`
  padding: 40px;
`;

const InputGroup = styled.div`
  margin-bottom: 28px;
`;

const Label = styled.label`
  display: block;
  font-size: 17px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  min-height: 130px;
  resize: vertical;
  transition: all 0.3s;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
  }
`;

const FileBox = styled.label`
  display: block;
  padding: 50px 20px;
  border: 3px dashed #94a3b8;
  border-radius: 16px;
  text-align: center;
  cursor: pointer;
  background: #f8faff;
  transition: all 0.3s;
  font-size: 18px;
  font-weight: 600;
  color: #475569;
  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
    color: #1d4ed8;
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  max-width: 400px;
  height: 200px;
  object-fit: cover;
  border-radius: 16px;
  margin: 15px auto;
  display: block;
  border: 4px solid #3b82f6;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const RemoveBtn = styled.button`
  background: #ef4444;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 10px;
  &:hover {
    background: #dc2626;
  }
`;

const FileName = styled.p`
  margin-top: 12px;
  color: #10b981;
  font-weight: 600;
  font-size: 15px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 28px;
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 40px;
  flex-wrap: wrap;
  justify-content: center;
`;

const SaveButton = styled.button`
  flex: 1;
  min-width: 250px;
  padding: 20px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  font-size: 22px;
  font-weight: 800;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
  transition: all 0.4s;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 35px rgba(16, 185, 129, 0.4);
  }
  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
    transform: none;
  }
`;

const DeleteAllButton = styled.button`
  flex: 1;
  min-width: 250px;
  padding: 20px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  font-size: 22px;
  font-weight: 800;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(239, 68, 68, 0.3);
  transition: all 0.4s;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 35px rgba(239, 68, 68, 0.4);
  }
`;

// Custom Confirm Modal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const Modal = styled.div`
  background: white;
  padding: 30px;
  border-radius: 20px;
  text-align: center;
  max-width: 400px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
`;

const ModalButtons = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 15px;
  justify-content: center;
`;

const ConfirmBtn = styled.button`
  padding: 12px 30px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background: #dc2626;
  }
`;

const CancelBtn = styled.button`
  padding: 12px 30px;
  background: #6b7280;
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background: #4b5563;
  }
`;

const LoadingScreen = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #64748b;
`;

const PartnerSettings = () => {
  const [form, setForm] = useState({
    titleBn: "",
    titleEn: "",
    description: "",
    highlightText: "",
    buttonText: "",
    leftImage: "",
    bgImage: "",
    leftImageFile: null,
    bgImageFile: null,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/partner/admin`)
      .then((res) => {
        const d = res.data;
        setForm({
          titleBn: d.titleBn || "",
          titleEn: d.titleEn || "",
          description: d.description || "",
          highlightText: d.highlightText || "",
          buttonText: d.buttonText || "",
          leftImage: d.leftImage ? `${API_URL}${d.leftImage}` : "",
          bgImage: d.bgImage ? `${API_URL}${d.bgImage}` : "",
          leftImageFile: null,
          bgImageFile: null,
        });
      })
      .catch(() => alert("Failed to load data! Check server."))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!form.titleBn.trim() || !form.description.trim()) {
      alert("Bangla Title and Description are required!");
      return;
    }

    setSaving(true);
    const data = new FormData();
    data.append("titleBn", form.titleBn);
    data.append("titleEn", form.titleEn);
    data.append("description", form.description);
    data.append("highlightText", form.highlightText);
    data.append("buttonText", form.buttonText);
    if (form.leftImageFile) data.append("leftImage", form.leftImageFile);
    if (form.bgImageFile) data.append("bgImage", form.bgImageFile);

    try {
      await axios.put(`${API_URL}/api/partner`, data);
      alert("Saved successfully!");
      window.location.reload();
    } catch (err) {
      alert("Save failed: " + (err.response?.data?.message || "Server error"));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAll = async () => {
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    setShowConfirm(false);
    try {
      await axios.delete(`${API_URL}/api/partner`);
      alert("All data deleted successfully!");
      window.location.reload();
    } catch (err) {
      alert(
        "Delete failed: " + (err.response?.data?.message || "Error occurred")
      );
    } finally {
      setDeleting(false);
    }
  };

  const removeLeftImage = () => {
    setForm({ ...form, leftImageFile: null, leftImage: "" });
  };

  const removeBgImage = () => {
    setForm({ ...form, bgImageFile: null, bgImage: "" });
  };

  if (loading) {
    return <LoadingScreen>Loading... Please wait</LoadingScreen>;
  }

  return (
    <Page>
      <Container>
        <Header>
          <Title>Partner Section Settings</Title>
        </Header>

        <FormWrapper>
          <Grid>
            <InputGroup>
              <Label>Bangla Title</Label>
              <Input
                type="text"
                placeholder="Special Partner"
                value={form.titleBn}
                onChange={(e) => setForm({ ...form, titleBn: e.target.value })}
              />
            </InputGroup>

            <InputGroup>
              <Label>English Title</Label>
              <Input
                type="text"
                placeholder="Special Partner"
                value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
              />
            </InputGroup>
          </Grid>

          <InputGroup>
            <Label>Description</Label>
            <Textarea
              placeholder="Register now and earn up to 50% revenue share..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </InputGroup>

          <Grid>
            <InputGroup>
              <Label>Highlight Text (e.g. 50%)</Label>
              <Input
                type="text"
                placeholder="Up to 50% revenue share"
                value={form.highlightText}
                onChange={(e) =>
                  setForm({ ...form, highlightText: e.target.value })
                }
              />
            </InputGroup>

            <InputGroup>
              <Label>Button Text</Label>
              <Input
                type="text"
                placeholder="Become Our Partner"
                value={form.buttonText}
                onChange={(e) =>
                  setForm({ ...form, buttonText: e.target.value })
                }
              />
            </InputGroup>
          </Grid>

          <Grid>
            <InputGroup>
              <Label>Left Side Image</Label>
              {(form.leftImageFile || form.leftImage) && (
                <PreviewImage
                  src={
                    form.leftImageFile
                      ? URL.createObjectURL(form.leftImageFile)
                      : form.leftImage
                  }
                  alt="Left Preview"
                />
              )}
              <FileBox>
                {form.leftImageFile ? "New image selected" : "Upload new image"}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) =>
                    setForm({ ...form, leftImageFile: e.target.files[0] })
                  }
                />
                Lewandowski
              </FileBox>
              {form.leftImageFile && (
                <FileName>{form.leftImageFile.name}</FileName>
              )}
              {(form.leftImageFile || form.leftImage) && (
                <RemoveBtn onClick={removeLeftImage}>Remove Image</RemoveBtn>
              )}
            </InputGroup>

            <InputGroup>
              <Label>Background Image</Label>
              {(form.bgImageFile || form.bgImage) && (
                <PreviewImage
                  src={
                    form.bgImageFile
                      ? URL.createObjectURL(form.bgImageFile)
                      : form.bgImage
                  }
                  alt="BG Preview"
                />
              )}
              <FileBox>
                {form.bgImageFile
                  ? "New background selected"
                  : "Upload new background"}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) =>
                    setForm({ ...form, bgImageFile: e.target.files[0] })
                  }
                />
              </FileBox>
              {form.bgImageFile && <FileName>{form.bgImageFile.name}</FileName>}
              {(form.bgImageFile || form.bgImage) && (
                <RemoveBtn onClick={removeBgImage}>Remove Background</RemoveBtn>
              )}
            </InputGroup>
          </Grid>

          <ButtonGroup>
            <SaveButton onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save All Changes"}
            </SaveButton>

            <DeleteAllButton onClick={handleDeleteAll} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete All Data"}
            </DeleteAllButton>
          </ButtonGroup>
        </FormWrapper>
      </Container>

      {/* Custom Confirm Modal */}
      {showConfirm && (
        <ModalOverlay onClick={() => setShowConfirm(false)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <h3
              style={{
                fontSize: "22px",
                fontWeight: "bold",
                marginBottom: "15px",
              }}
            >
              Delete All Data?
            </h3>
            <p style={{ color: "#666", marginBottom: "20px" }}>
              This action cannot be undone. All partner data and images will be
              permanently deleted.
            </p>
            <ModalButtons>
              <CancelBtn onClick={() => setShowConfirm(false)}>
                Cancel
              </CancelBtn>
              <ConfirmBtn onClick={confirmDelete}>Yes, Delete</ConfirmBtn>
            </ModalButtons>
          </Modal>
        </ModalOverlay>
      )}
    </Page>
  );
};

export default PartnerSettings;
