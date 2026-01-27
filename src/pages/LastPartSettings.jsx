// admin/LastPartSettings.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { API_URL } from "../utils/baseURL";

// Styled Components
const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 40px 20px;
  font-family: "Inter", "Segoe UI", sans-serif;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 28px;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.12);
  overflow: hidden;
`;

const Header = styled.div`

  color: #0f172a;
  padding: 40px 20px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 48px;
  font-weight: 900;
  margin: 0;
  letter-spacing: -1px;
`;

const Subtitle = styled.p`
  font-size: 20px;
  opacity: 0.95;
  margin-top: 15px;
  font-weight: 500;
`;

const FormWrapper = styled.div`
  padding: 60px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled.div`
  margin-bottom: 32px;
`;

const Label = styled.label`
  display: block;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 12px;
`;

const Input = styled.input`
  width: 100%;
  padding: 18px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  font-size: 16px;
  transition: all 0.3s;
  background: #f8fafc;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 5px rgba(59, 130, 246, 0.15);
    background: white;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 18px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  font-size: 16px;
  min-height: 180px;
  resize: vertical;
  background: #f8fafc;
  transition: all 0.3s;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 5px rgba(59, 130, 246, 0.15);
    background: white;
  }
`;

const ImageSection = styled.div`
  margin-top: 50px;
`;

const ImageBox = styled.div`
  background: #f8fafc;
  border: 3px dashed #94a3b8;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  transition: all 0.3s;
  cursor: pointer;
  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  max-width: 380px;
  height: 260px;
  object-fit: cover;
  border-radius: 20px;
  margin: 20px 0;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  border: 5px solid #3b82f6;
`;

const FileBox = styled.label`
  background: #3b82f6;
  color: white;
  padding: 16px 40px;
  font-size: 18px;
  font-weight: 700;
  border-radius: 50px;
  cursor: pointer;
  display: inline-block;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
  transition: all 0.4s;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 35px rgba(59, 130, 246, 0.4);
  }
`;

const ButtonGroup = styled.div`
  text-align: center;
  margin-top: 60px;
`;

const SaveButton = styled.button`
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  padding: 22px 80px;
  font-size: 24px;
  font-weight: 800;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 15px 40px rgba(16, 185, 129, 0.4);
  transition: all 0.4s;
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 50px rgba(16, 185, 129, 0.5);
  }
  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingScreen = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #64748b;
  background: #f8fafc;
`;

const LastPartSettings = () => {
  const [form, setForm] = useState({
    titleBn: "",
    titleEn: "",
    subtitle: "",
    description: "",
    buttonText: "",
    buttonLink: "",
    tabletImage: null,
    mobileImage: null,
  });
  const [preview, setPreview] = useState({ tablet: "", mobile: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/lastpart`);
      const d = res.data;
      setForm({
        titleBn: d.titleBn || "",
        titleEn: d.titleEn || "",
        subtitle: d.subtitle || "",
        description: d.description || "",
        buttonText: d.buttonText || "",
        buttonLink: d.buttonLink || "",
        tabletImage: null,
        mobileImage: null,
      });
      setPreview({
        tablet: d.tabletImage ? `${API_URL}${d.tabletImage}` : "",
        mobile: d.mobileImage ? `${API_URL}${d.mobileImage}` : "",
      });
    } catch (err) {
      alert("Failed to load data!");
    } finally {
      setLoading(false);
    }
  };

  const handleImage = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, [type]: file });
      setPreview({ ...preview, [type]: URL.createObjectURL(file) });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const data = new FormData();
    data.append("titleBn", form.titleBn);
    data.append("titleEn", form.titleEn);
    data.append("subtitle", form.subtitle);
    data.append("description", form.description);
    data.append("buttonText", form.buttonText);
    data.append("buttonLink", form.buttonLink);
    if (form.tabletImage) data.append("tabletImage", form.tabletImage);
    if (form.mobileImage) data.append("mobileImage", form.mobileImage);

    try {
      if (preview.tablet.includes("method-icons") || preview.mobile.includes("method-icons")) {
        await axios.put(`${API_URL}/api/lastpart`, data);
      } else {
        await axios.post(`${API_URL}/api/lastpart`, data);
      }
      alert("সফলভাবে সেভ হয়েছে!");
      window.location.reload();
    } catch (err) {
      alert("সেভ করতে সমস্যা হয়েছে!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingScreen>Loading Last Part Settings...</LoadingScreen>;
  }

  return (
    <Page>
      <Container>
        <Header>
          <Title>Last Part Settings</Title>
          <Subtitle>Control everything from here – Text, Image, Button</Subtitle>
        </Header>

        <FormWrapper>
          <Grid>
            <InputGroup>
              <Label>Subtitle</Label>
              <Input
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder="আমাদের অংশ হতে আবেদন করুন"
              />
            </InputGroup>

            <InputGroup>
              <Label>Title (Bangla)</Label>
              <Input
                value={form.titleBn}
                onChange={(e) => setForm({ ...form, titleBn: e.target.value })}
                placeholder="RAJABAJI অ্যাফিলিয়েট প্রোগ্রাম"
              />
            </InputGroup>

            <InputGroup>
              <Label>Title (English)</Label>
              <Input
                value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                placeholder="RAJABAJI Affiliate Program"
              />
            </InputGroup>

            <InputGroup>
              <Label>Button Text</Label>
              <Input
                value={form.buttonText}
                onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                placeholder="যোগাযোগ করুন"
              />
            </InputGroup>

            <InputGroup>
              <Label>Button Link</Label>
              <Input
                value={form.buttonLink}
                onChange={(e) => setForm({ ...form, buttonLink: e.target.value })}
                placeholder="/contact"
              />
            </InputGroup>
          </Grid>

          <InputGroup>
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="আমরা ক্রমাগত আমাদের গ্রাহকদের কাছ থেকে ১০০% বিশ্বস্ততার সাথে বৃদ্ধি পাচ্ছি..."
            />
          </InputGroup>

          <ImageSection>
            <Grid>
              <div>
                <Label>Tablet Image</Label>
                {preview.tablet && <PreviewImage src={preview.tablet} alt="Tablet Preview" />}
                <ImageBox>
                  <FileBox>
                    Change Tablet Image
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={(e) => handleImage(e, "tabletImage")}
                      hidden
                    />
                  </FileBox>
                </ImageBox>
              </div>

              <div>
                <Label>Mobile Image</Label>
                {preview.mobile && <PreviewImage src={preview.mobile} alt="Mobile Preview" />}
                <ImageBox>
                  <FileBox>
                    Change Mobile Image
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={(e) => handleImage(e, "mobileImage")}
                      hidden
                    />
                  </FileBox>
                </ImageBox>
              </div>
            </Grid>
          </ImageSection>

          <ButtonGroup>
            <SaveButton onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save All Changes"}
            </SaveButton>
          </ButtonGroup>
        </FormWrapper>
      </Container>
    </Page>
  );
};

export default LastPartSettings;