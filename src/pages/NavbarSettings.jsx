// admin/NavbarSettings.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { API_URL } from "../utils/baseURL";

const Container = styled.div`
  padding: 24px;
  background: #f9fafb;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 24px;
  color: #111827;
`;

const Form = styled.form`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin-bottom: 32px;
`;

const Grid = styled.div`
  display: grid;
  gap: 16px;
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 6px;
  color: #374151;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  width: 100%;
  &:focus {
    outline: none;
    border-color: #99ff47;
    box-shadow: 0 0 0 3px rgba(153,255,71,0.2);
  }
`;

const ColorInput = styled.input.attrs({ type: "color" })`
  width: 100%;
  height: 44px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  cursor: pointer;
`;

const FileInput = styled.input.attrs({ type: "file", accept: "image/*" })`
  padding: 10px;
  border: 1px dashed #9ca3af;
  border-radius: 8px;
  background: #f3f4f6;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin-top: 16px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  background: #16a34a;
  color: white;
  &:hover { opacity: 0.9; }
`;

const DeleteButton = styled.button`
  padding: 10px 20px;
  margin-top: 16px;
  margin-left: 8px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  background: #ef4444;
  color: white;
  &:hover { opacity: 0.9; }
`;

// === Styled Components for Links Section ===
const LinksSection = styled.div`
  margin-top: 32px;
`;

const SectionLabel = styled.label`
  display: block;
  font-weight: 500;
  font-size: 14px;
  color: #374151;
  margin-bottom: 12px;
`;

const LinkRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  align-items: center;
`;

const LinkInput = styled.input`
  flex: 1;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  &:focus {
    outline: none;
    border-color: #99ff47;
    box-shadow: 0 0 0 3px rgba(153, 255, 71, 0.2);
  }
`;

const RemoveBtn = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #dc2626;
  }
`;

const AddLinkBtn = styled.button`
  background: #2563eb;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #1d4ed8;
  }
`;

// === Styled Components for Action Buttons ===
const ActionButtons = styled.div`
  margin-top: 24px;
  display: flex;
  gap: 12px;
`;

const SaveBtn = styled.button`
  background: #16a34a;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.9;
  }
`;

const ResetBtn = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.9;
  }
`;

const NavbarSettings = () => {
  const [form, setForm] = useState({
    logo: null,
    links: [],
    registerButton: { text: "", link: "", bgColor: "#99FF47", textColor: "#000000" },
    loginButton: { text: "", link: "", bgColor: "#ffffff", textColor: "#000000", arrow: ">" }
  });

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/navbar/admin`);
        const data = res.data;

        // Safe default values
        setForm({
          logo: null,
          links: Array.isArray(data.links) ? data.links : [],
          registerButton: {
            text: data.registerButton?.text || "সদস্য সাইন ইন",
            link: data.registerButton?.link || "/register",
            bgColor: data.registerButton?.bgColor || "#99FF47",
            textColor: data.registerButton?.textColor || "#000000"
          },
          loginButton: {
            text: data.loginButton?.text || "এখন আবেদন করুন!",
            link: data.loginButton?.link || "/login",
            bgColor: data.loginButton?.bgColor || "#ffffff",
            textColor: data.loginButton?.textColor || "#000000",
            arrow: data.loginButton?.arrow || ">"
          }
        });
      } catch (err) {
        console.log("Failed to load navbar settings");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  const handleLinkChange = (i, field, value) => {
    const newLinks = [...form.links];
    newLinks[i][field] = value;
    setForm({ ...form, links: newLinks });
  };

  const addLink = () => {
    setForm({ ...form, links: [...form.links, { name: "", sectionId: "" }] });
  };

  const removeLink = (i) => {
    setForm({ ...form, links: form.links.filter((_, index) => index !== i) });
  };

  const submit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    if (form.logo instanceof File) data.append("logo", form.logo);
    data.append("links", JSON.stringify(form.links));
    data.append("registerButton", JSON.stringify(form.registerButton));
    data.append("loginButton", JSON.stringify(form.loginButton));

    try {
      await axios.put(`${API_URL}/api/navbar`, data);
      alert("Navbar সফলভাবে আপডেট হয়েছে!");
    } catch (err) {
      alert("ত্রুটি: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async () => {
    if (window.confirm("সবকিছু মুছে ফেলবেন?")) {
      try {
        await axios.delete(`${API_URL}/api/navbar`);
        alert("Navbar রিসেট হয়েছে। ডিফল্ট ডেটা আসবে।");
        window.location.reload();
      } catch (err) {
        alert("মুছতে সমস্যা: " + err.message);
      }
    }
  };

  if (loading) {
    return (
      <Container>
        <Title>লোড হচ্ছে...</Title>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Navbar Settings</Title>

      <Form onSubmit={submit}>
        <Grid>
          <div>
            <Label>Upload Logo</Label>
            <FileInput onChange={e => setForm({ ...form, logo: e.target.files[0] })} />
            {form.logo && typeof form.logo === "string" && (
              <img src={`${API_URL}${form.logo}`} alt="Current Logo" className="mt-2 h-16 rounded" />
            )}
          </div>

          <div>
            <Label>Register Button Text</Label>
            <Input
              value={form.registerButton.text}
              onChange={e => setForm({
                ...form,
                registerButton: { ...form.registerButton, text: e.target.value }
              })}
            />
          </div>
          <div>
            <Label>Register Button Link</Label>
            <Input
              value={form.registerButton.link}
              onChange={e => setForm({
                ...form,
                registerButton: { ...form.registerButton, link: e.target.value }
              })}
            />
          </div>
          <div>
            <Label>Register BG Color</Label>
            <ColorInput
              value={form.registerButton.bgColor}
              onChange={e => setForm({
                ...form,
                registerButton: { ...form.registerButton, bgColor: e.target.value }
              })}
            />
          </div>
          <div>
            <Label>Register Text Color</Label>
            <ColorInput
              value={form.registerButton.textColor}
              onChange={e => setForm({
                ...form,
                registerButton: { ...form.registerButton, textColor: e.target.value }
              })}
            />
          </div>

          <div>
            <Label>Login Button Text</Label>
            <Input
              value={form.loginButton.text}
              onChange={e => setForm({
                ...form,
                loginButton: { ...form.loginButton, text: e.target.value }
              })}
            />
          </div>
          <div>
            <Label>Login Button Link</Label>
            <Input
              value={form.loginButton.link}
              onChange={e => setForm({
                ...form,
                loginButton: { ...form.loginButton, link: e.target.value }
              })}
            />
          </div>
          <div>
            <Label>Login BG Color</Label>
            <ColorInput
              value={form.loginButton.bgColor}
              onChange={e => setForm({
                ...form,
                loginButton: { ...form.loginButton, bgColor: e.target.value }
              })}
            />
          </div>
          <div>
            <Label>Login Text Color</Label>
            <ColorInput
              value={form.loginButton.textColor}
              onChange={e => setForm({
                ...form,
                loginButton: { ...form.loginButton, textColor: e.target.value }
              })}
            />
          </div>
          <div>
            <Label>Arrow Symbol</Label>
            <Input
              value={form.loginButton.arrow}
              onChange={e => setForm({
                ...form,
                loginButton: { ...form.loginButton, arrow: e.target.value }
              })}
            />
          </div>
        </Grid>

       <LinksSection>
  <SectionLabel>Navigation Links</SectionLabel>
  {form.links.map((link, i) => (
    <LinkRow key={i}>
      <LinkInput
        placeholder="Link Name"
        value={link.name}
        onChange={(e) => handleLinkChange(i, "name", e.target.value)}
      />
      <LinkInput
        placeholder="Section ID"
        value={link.sectionId}
        onChange={(e) => handleLinkChange(i, "sectionId", e.target.value)}
      />
      <RemoveBtn type="button" onClick={() => removeLink(i)}>
        X
      </RemoveBtn>
    </LinkRow>
  ))}
  <AddLinkBtn type="button" onClick={addLink}>
    + Add Link
  </AddLinkBtn>
</LinksSection>

<ActionButtons>
  <SaveBtn type="submit">Save Changes</SaveBtn>
  <ResetBtn type="button" onClick={handleDelete}>
    Reset to Default
  </ResetBtn>
</ActionButtons>
      </Form>
    </Container>
  );
};

export default NavbarSettings;