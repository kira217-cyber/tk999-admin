// admin/WhyChooseUsSettings.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { API_URL } from "../utils/baseURL";

const Container = styled.div`
  padding: 24px;
  background: #f9fafb;
  min-height: 100vh;
  font-family: "Inter", sans-serif;
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 900px;
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
  font-size: 14px;
  margin-bottom: 6px;
  color: #374151;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  width: 100%;
  font-size: 14px;
  &:focus {
    outline: none;
    border-color: #99ff47;
  }
`;

const Textarea = styled.textarea`
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  width: 100%;
  min-height: 100px;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: #99ff47;
  }
`;

const FileInput = styled.input.attrs({ type: "file", accept: "image/*" })`
  padding: 10px;
  border: 1px dashed #9ca3af;
  border-radius: 8px;
  background: #f3f4f6;
  width: 100%;
  cursor: pointer;
`;

const FeatureCard = styled.div`
  border: 1px solid #e5e7eb;
  padding: 16px;
  border-radius: 10px;
  margin-bottom: 16px;
  background: #fcfcfc;
`;

const RemoveBtn = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
  &:hover {
    background: #dc2626;
  }
`;

const AddFeatureBtn = styled.button`
  background: #2563eb;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background: #1d4ed8;
  }
`;

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
  cursor: pointer;
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
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

const ImagePreview = styled.img`
  margin-top: 8px;
  height: 60px;
  width: 60px;
  object-fit: contain;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
`;

const WhyChooseUsSettings = () => {
  const [form, setForm] = useState({
    backgroundImage: null,
    backgroundImageUrl: "",
    heading: "",
    subheading: "",
    features: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/why-choose-us/admin`)
      .then((res) => {
        const data = res.data;
        setForm({
          backgroundImage: null,
          backgroundImageUrl: data.backgroundImage || "",
          heading: data.heading || "",
          subheading: data.subheading || "",
          features: (data.features || []).map((f) => ({
            _id: f._id || null,
            title: f.title || "",
            desc: f.desc || "",
            iconFile: null,
            iconUrl: f.icon || "",
          })),
        });
      })
      .catch((err) => {
        console.error("Load failed:", err);
        alert("ডেটা লোড করতে সমস্যা হয়েছে।");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleFeatureChange = (i, field, value) => {
    const newFeatures = [...form.features];
    newFeatures[i][field] = value;
    setForm({ ...form, features: newFeatures });
  };

  const handleIconChange = (i, file) => {
    const newFeatures = [...form.features];
    newFeatures[i].iconFile = file;
    newFeatures[i].iconUrl = file
      ? URL.createObjectURL(file)
      : newFeatures[i].iconUrl;
    setForm({ ...form, features: newFeatures });
  };

  const addFeature = () => {
    setForm({
      ...form,
      features: [
        ...form.features,
        { _id: null, title: "", desc: "", iconFile: null, iconUrl: "" },
      ],
    });
  };

  const removeFeature = (i) => {
    setForm({
      ...form,
      features: form.features.filter((_, index) => index !== i),
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    // Background Image
    if (form.backgroundImage instanceof File) {
      data.append("backgroundImage", form.backgroundImage);
    }

    data.append("heading", form.heading);
    data.append("subheading", form.subheading);

    // Features JSON with _id
    const featuresPayload = form.features.map((f) => ({
      _id: f._id || undefined,
      title: f.title,
      desc: f.desc,
      icon: f.iconUrl || "",
    }));
    data.append("features", JSON.stringify(featuresPayload));

    // Append icons with index: icons[0], icons[1], ...
    form.features.forEach((f, i) => {
      if (f.iconFile) {
        data.append(`icons[${i}]`, f.iconFile);
      }
    });

    try {
      const method = form.features.length > 0 || form.heading ? "put" : "post";
      await axios[method](`${API_URL}/api/why-choose-us`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("সফলভাবে আপডেট হয়েছে!");
    } catch (err) {
      console.error("Submit Error:", err.response?.data);
      alert("ত্রুটি: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async () => {
    if (window.confirm("সব মুছে ফেলবেন?")) {
      try {
        await axios.delete(`${API_URL}/api/why-choose-us`);
        alert("রিসেট হয়েছে।");
        window.location.reload();
      } catch (err) {
        alert("মুছতে সমস্যা: " + err.message);
      }
    }
  };

  if (loading)
    return (
      <Container>
        <Title>লোড হচ্ছে...</Title>
      </Container>
    );

  return (
    <Container>
      <Title>Why Choose Us Settings</Title>
      <Form onSubmit={submit}>
        <Grid>
          <div>
            <Label>Background Image</Label>
            <FileInput
              onChange={(e) => {
                const file = e.target.files[0];
                setForm({
                  ...form,
                  backgroundImage: file,
                  backgroundImageUrl: file
                    ? URL.createObjectURL(file)
                    : form.backgroundImageUrl,
                });
              }}
            />
            {(form.backgroundImage || form.backgroundImageUrl) && (
              <ImagePreview
                src={
                  form.backgroundImage
                    ? URL.createObjectURL(form.backgroundImage)
                    : `${API_URL}${form.backgroundImageUrl}`
                }
                alt="BG"
              />
            )}
          </div>
          <div>
            <Label>Main Heading</Label>
            <Input
              value={form.heading}
              onChange={(e) => setForm({ ...form, heading: e.target.value })}
            />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <Label>Subheading</Label>
            <Textarea
              value={form.subheading}
              onChange={(e) => setForm({ ...form, subheading: e.target.value })}
            />
          </div>
        </Grid>

        <div style={{ marginTop: "32px" }}>
          <Label>Features</Label>
          {form.features.map((f, i) => (
            <FeatureCard key={f._id || i}>
              <Input
                placeholder="Title"
                value={f.title}
                onChange={(e) =>
                  handleFeatureChange(i, "title", e.target.value)
                }
                style={{ marginBottom: "12px" }}
              />
              <Textarea
                placeholder="Description"
                value={f.desc}
                onChange={(e) => handleFeatureChange(i, "desc", e.target.value)}
                style={{ marginBottom: "12px" }}
              />
              <Label>Icon Image</Label>
              <FileInput
                onChange={(e) => handleIconChange(i, e.target.files[0])}
              />
              {(f.iconFile || f.iconUrl) && (
                <ImagePreview
                  src={
                    f.iconFile
                      ? URL.createObjectURL(f.iconFile)
                      : `${API_URL}${f.iconUrl}`
                  }
                  alt="Icon"
                />
              )}
              <RemoveBtn type="button" onClick={() => removeFeature(i)}>
                Remove
              </RemoveBtn>
            </FeatureCard>
          ))}
          <AddFeatureBtn type="button" onClick={addFeature}>
            + Add Feature
          </AddFeatureBtn>
        </div>

        <ActionButtons>
          <SaveBtn type="submit">Save Changes</SaveBtn>
          <ResetBtn type="button" onClick={handleDelete}>
            Reset
          </ResetBtn>
        </ActionButtons>
      </Form>
    </Container>
  );
};

export default WhyChooseUsSettings;
