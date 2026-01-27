// admin/FooterSettings.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { API_URL } from "../utils/baseURL";
import { FaFacebookF, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa";

const Page = styled.div`
  min-height: 100vh;
  background: #f9fafb;
  padding: 40px 20px;
  font-family: "Inter", sans-serif;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const Header = styled.div`
  padding: 40px;
  text-align: center;
  color: #1e293b;
`;

const Title = styled.h1`
  font-size: 42px;
  font-weight: 800;
  margin: 0;
`;

const Content = styled.div`
  padding: 50px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const Left = styled.div``;
const Right = styled.div`
  background: #f1f5f9;
  border-radius: 16px;
  padding: 30px;
  border: 1px solid #e2e8f0;
`;

const Section = styled.div`
  margin-bottom: 35px;
`;

const Label = styled.label`
  display: block;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #cbd5e1;
  border-radius: 12px;
  font-size: 16px;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #cbd5e1;
  border-radius: 12px;
  min-height: 110px;
  font-size: 16px;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const UploadBox = styled.label`
  display: block;
  padding: 40px;
  border: 2px dashed #94a3b8;
  border-radius: 16px;
  text-align: center;
  cursor: pointer;
  background: #f8fafc;
  font-weight: 600;
  color: #475569;
  transition: all 0.3s;
  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
    color: #3b82f6;
  }
`;

const PreviewImg = styled.img`
  width: 100%;
  max-width: 180px;
  height: auto;
  border-radius: 12px;
  margin: 15px 0;
  border: 3px solid #3b82f6;
`;

const Button = styled.button`
  padding: 14px 32px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin: 10px;
`;

const SaveBtn = styled(Button)`
  background: #10b981;
  color: white;
  &:hover {
    background: #059669;
  }
  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
  }
`;

const DeleteBtn = styled(Button)`
  background: #ef4444;
  color: white;
  &:hover {
    background: #dc2626;
  }
`;

const PreviewFooter = styled.div`
  background: #000;
  color: white;
  padding: 35px;
  border-radius: 16px;
  text-align: center;
`;

const FooterSettings = () => {
  const [form, setForm] = useState({
    logo: null,
    tagline: "",
    copyright: "",
    paymentMethods: [
      { name: "bKash", image: null },
      { name: "Nagad", image: null },
      { name: "Rocket", image: null },
    ],
    socialLinks: [
      { platform: "facebook", url: "" },
      { platform: "instagram", url: "" },
      { platform: "youtube", url: "" },
      { platform: "twitter", url: "" },
    ],
  });

  const [preview, setPreview] = useState({ logo: "", payments: ["", "", ""] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isExisting, setIsExisting] = useState(false); // এটাই ম্যাজিক!

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/footer`);
      const d = res.data;

      // যদি ডাটা থাকে → isExisting = true
      if (d && (d.logo || d.tagline || d.paymentMethods?.length > 0)) {
        setIsExisting(true);
      }

      setForm({
        tagline: d.tagline || "",
        copyright: d.copyright || "",
        paymentMethods: d.paymentMethods || form.paymentMethods,
        socialLinks: d.socialLinks || form.socialLinks,
        logo: null,
      });

      setPreview({
        logo: d.logo ? `${API_URL}${d.logo}` : "",
        payments: (d.paymentMethods || []).map((m) =>
          m.image ? `${API_URL}${m.image}` : ""
        ),
      });
    } catch (err) {
      console.error("Load failed:", err);
      setIsExisting(false);
    } finally {
      setLoading(false);
    }
  };

  const handleImage = (e, type, index = null) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === "logo") {
      setForm({ ...form, logo: file });
      setPreview({ ...preview, logo: URL.createObjectURL(file) });
    } else {
      const newPayments = [...form.paymentMethods];
      newPayments[index].image = file;
      setForm({ ...form, paymentMethods: newPayments });
      const newPrev = [...preview.payments];
      newPrev[index] = URL.createObjectURL(file);
      setPreview({ ...preview, payments: newPrev });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const data = new FormData();
    data.append("tagline", form.tagline);
    data.append("copyright", form.copyright);
    data.append(
      "paymentMethods",
      JSON.stringify(form.paymentMethods.map((p) => ({ name: p.name })))
    );
    data.append("socialLinks", JSON.stringify(form.socialLinks));

    if (form.logo) data.append("logo", form.logo);
    form.paymentMethods.forEach((method, i) => {
      if (method.image && typeof method.image !== "string") {
        data.append(`payment_${i}`, method.image);
      }
    });

    try {
      if (isExisting) {
        // আগে থেকে আছে → PUT
        await axios.put(`${API_URL}/api/footer`, data);
      } else {
        // প্রথমবার → POST
        await axios.post(`${API_URL}/api/footer`, data);
      }
      alert("Footer Saved Successfully!");
      setIsExisting(true); // পরেরবার PUT হবে
      loadData();
    } catch (err) {
      console.error("Save Error:", err.response?.data || err.message);
      alert("Save Failed! Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete footer permanently?")) return;
    try {
      await axios.delete(`${API_URL}/api/footer`);
      alert("Footer Deleted!");
      window.location.reload();
    } catch (err) {
      alert("Delete Failed!");
    }
  };

  const getIcon = (platform) => {
    const icons = {
      facebook: <FaFacebookF size={18} />,
      instagram: <FaInstagram size={18} />,
      youtube: <FaYoutube size={18} />,
      twitter: <FaTwitter size={18} />,
    };
    return icons[platform] || null;
  };

  if (loading) {
    return (
      <Page className="flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading...</div>
      </Page>
    );
  }

  return (
    <Page>
      <Container>
        <Header>
          <Title>Footer Settings</Title>
        </Header>

        <Content>
          <Left>
            <Section>
              <Label>Logo</Label>
              {preview.logo && <PreviewImg src={preview.logo} alt="Logo" />}
              <UploadBox>
                {preview.logo ? "Change Logo" : "Upload Logo"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImage(e, "logo")}
                  hidden
                />
              </UploadBox>
            </Section>

            <Section>
              <Label>Tagline</Label>
              <Input
                placeholder="Rajabaji Trusted Casino – Best Online Cricket Betting App"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              />
            </Section>

            <Section>
              <Label>Copyright</Label>
              <Textarea
                placeholder="Copyright © 2025 Rajabaji. All Rights Reserved."
                value={form.copyright}
                onChange={(e) =>
                  setForm({ ...form, copyright: e.target.value })
                }
              />
            </Section>

            <Section>
              <Label>Payment Methods</Label>
              {form.paymentMethods.map((method, i) => (
                <div key={i} style={{ marginBottom: "20px" }}>
                  <Input
                    value={method.name}
                    readOnly
                    style={{ marginBottom: "8px" }}
                  />
                  {preview.payments[i] && (
                    <PreviewImg src={preview.payments[i]} alt={method.name} />
                  )}
                  <UploadBox>
                    Change {method.name} Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImage(e, "payment", i)}
                      hidden
                    />
                  </UploadBox>
                </div>
              ))}
            </Section>

            <Section>
              <Label>Social Links</Label>
              {form.socialLinks.map((link, i) => (
                <Input
                  key={i}
                  placeholder={`${link.platform} URL`}
                  value={link.url}
                  onChange={(e) => {
                    const newLinks = [...form.socialLinks];
                    newLinks[i].url = e.target.value;
                    setForm({ ...form, socialLinks: newLinks });
                  }}
                />
              ))}
            </Section>

            <div style={{ textAlign: "center" }}>
              <SaveBtn onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Footer"}
              </SaveBtn>
              <DeleteBtn onClick={handleDelete}>Delete Footer</DeleteBtn>
            </div>
          </Left>

          <Right>
            <h3
              style={{
                fontSize: "24px",
                fontWeight: "700",
                marginBottom: "20px",
                color: "#1e293b",
              }}
            >
              Live Preview
            </h3>
            <PreviewFooter>
              <div style={{ marginBottom: "20px" }}>
                {preview.logo && (
                  <img
                    src={preview.logo}
                    alt="Logo"
                    style={{ width: "140px" }}
                  />
                )}
                <p
                  style={{
                    color: "#94a3b8",
                    fontSize: "14px",
                    marginTop: "10px",
                  }}
                >
                  {form.tagline || "Your tagline here"}
                </p>
              </div>

              <div style={{ margin: "25px 0" }}>
                <h4 style={{ color: "#e2e8f0" }}>Payment Methods</h4>
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    justifyContent: "center",
                    marginTop: "10px",
                  }}
                >
                  {preview.payments.map((img, i) =>
                    img ? (
                      <img
                        key={i}
                        src={img}
                        alt="payment"
                        style={{
                          width: "50px",
                          height: "35px",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <div
                        key={i}
                        style={{
                          width: "50px",
                          height: "35px",
                          background: "#333",
                          borderRadius: "6px",
                        }}
                      />
                    )
                  )}
                </div>
              </div>

              <div>
                <h4 style={{ color: "#e2e8f0" }}>Follow Us</h4>
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    justifyContent: "center",
                    marginTop: "10px",
                  }}
                >
                  {form.socialLinks.map((link, i) => (
                    <div
                      key={i}
                      style={{
                        background: "white",
                        color: "black",
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {getIcon(link.platform)}
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  marginTop: "25px",
                  paddingTop: "20px",
                  borderTop: "1px solid #374151",
                }}
              >
                <p style={{ color: "#6b7280", fontSize: "13px" }}>
                  {form.copyright || "Copyright © 2025 Your Site"}
                </p>
              </div>
            </PreviewFooter>
          </Right>
        </Content>
      </Container>
    </Page>
  );
};

export default FooterSettings;
