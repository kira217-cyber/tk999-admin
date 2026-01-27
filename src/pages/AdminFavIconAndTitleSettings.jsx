// admin/FavIconAndTitleSettings.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { API_URL } from "../utils/baseURL";

// 🌤️ Light Theme Styling
const Page = styled.div`
  min-height: 100vh;
  background: #f9fafb;
  padding: 40px 20px;
  font-family: "Inter", sans-serif;
  color: #111827;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const Header = styled.div`
  background: white;
  padding: 40px 20px;
  text-align: center;
  color: white;
`;

const Title = styled.h1`
   color: #111827;
  font-size: 42px;
  font-weight: 900;
  margin: 0;
`;

const Content = styled.div`
  padding: 60px;
`;

const Section = styled.div`
  margin-bottom: 50px;
`;

const Label = styled.label`
  display: block;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #1e3a8a;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px 20px;
  background: #f1f5f9;
  border: 2px solid #cbd5e1;
  border-radius: 14px;
  color: #111827;
  font-size: 16px;
  transition: 0.3s ease;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    background: #fff;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
  }
`;

const UploadBox = styled.label`
  display: block;
  padding: 60px;
  border: 3px dashed #94a3b8;
  border-radius: 20px;
  text-align: center;
  cursor: pointer;
  background: #f8fafc;
  font-weight: 700;
  font-size: 18px;
  transition: 0.3s;
  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
    color: #1e40af;
  }
`;

const PreviewBox = styled.div`
  margin-top: 25px;
  text-align: center;
`;

const FaviconPreview = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 18px;
  border: 4px solid #3b82f6;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.25);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 40px;
`;

const SaveBtn = styled.button`
  background: linear-gradient(135deg, #10b981, #059669);
  padding: 16px 45px;
  border: none;
  border-radius: 50px;
  color: white;
  font-size: 18px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.3s ease;
  &:hover {
    transform: translateY(-3px);
  }
  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
  }
`;

const ResetBtn = styled.button`
  background: linear-gradient(135deg, #ef4444, #dc2626);
  padding: 16px 40px;
  border: none;
  border-radius: 50px;
  color: white;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.3s ease;
  &:hover {
    transform: translateY(-3px);
  }
`;


const AdminFavIconAndTitleSettings = () => {
  const [title, setTitle] = useState("");
  const [favicon, setFavicon] = useState(null);
  const [previewFavicon, setPreviewFavicon] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin-site-settings`);
      setTitle(res.data.title || "Rajabaji - Best Online Casino");
      if (res.data.favicon) {
        setPreviewFavicon(`${API_URL}${res.data.favicon}?t=${Date.now()}`);
      }
    } catch (err) {
      console.log("Using default");
      setTitle("Affiliate Admin");
    } finally {
      setLoading(false);
    }
  };

  const handleFaviconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFavicon(file);
      setPreviewFavicon(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Title cannot be empty!");
      return;
    }

    setSaving(true);
    const formData = new FormData();
    formData.append("title", title);
    if (favicon) formData.append("favicon", favicon);

    try {
      await axios.put(`${API_URL}/api/admin-site-settings`, formData);
      alert("✅ Saved to Database! Refresh main site to see changes.");
      loadSettings();
    } catch (err) {
      alert("❌ Save Failed!");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm("Reset to default?")) return;
    try {
      await axios.delete(`${API_URL}/api/admin-site-settings`);
      alert("✅ Reset Done!");
      loadSettings();
      window.location.reload();
    } catch (err) {
      alert("❌ Reset Failed!");
    }
  };

  if (loading) {
    return (
      <Page className="flex items-center justify-center">
        <div className="text-3xl">Loading...</div>
      </Page>
    );
  }

  return (
    <Page>
      <Container>
        <Header>
          <Title>Affiliate Admin Favicon & Title Settings</Title>
        </Header>

        <Content>
          <Section>
            <Label>Website Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Affiliate Admin"
            />
          </Section>

          <Section>
            <Label>Favicon (32x32 or 64x64 recommended)</Label>
            <UploadBox>
              {previewFavicon ? "Change Favicon" : "Upload Favicon"}
              <input
                type="file"
                accept=".png,.ico,.jpg,.jpeg,.svg,.webp"
                onChange={handleFaviconChange}
                hidden
              />
            </UploadBox>

            {previewFavicon && (
              <PreviewBox>
                <p style={{ margin: "15px 0", color: "#374151" }}>
                  Current Favicon:
                </p>
                <FaviconPreview src={previewFavicon} alt="Favicon" />
              </PreviewBox>
            )}
          </Section>

          <ButtonGroup>
            <SaveBtn onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save to Database"}
            </SaveBtn>
            <ResetBtn onClick={handleReset}>Reset</ResetBtn>
          </ButtonGroup>

          <div
            style={{
              marginTop: "40px",
              padding: "25px",
              background: "#f3f4f6",
              borderRadius: "16px",
              textAlign: "center",
              fontSize: "16px",
              color: "#374151",
              border: "1px solid #e5e7eb",
            }}
          >
            <p>
              🗂️ Favicon saved in:{" "}
              <code style={{ color: "#2563eb" }}>
                uploads/method-icons/favicon.png
              </code>
            </p>
            <p>
              🌐 Access:{" "}
              <code style={{ color: "#2563eb" }}>
                {API_URL}/uploads/method-icons/favicon.png
              </code>
            </p>
            <p>🔄 Refresh main site to see changes.</p>
          </div>
        </Content>
      </Container>
    </Page>
  );
};

export default AdminFavIconAndTitleSettings;
