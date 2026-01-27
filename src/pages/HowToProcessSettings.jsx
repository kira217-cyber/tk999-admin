// admin/HowToProcessSettings.jsx (ঠিক করা ভার্সন)
import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { API_URL } from "../utils/baseURL";

const Container = styled.div`
  padding: 24px;
  background: #f9fafb;
  min-height: 100vh;
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
const StepCard = styled.div`
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
const AddStepBtn = styled.button`
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

const HowToProcessSettings = () => {
  const [form, setForm] = useState({
    mainHeading: "",
    buttonText: "",
    steps: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/how-to-process/admin`)
      .then((res) => {
        setForm({
          mainHeading: res.data.mainHeading || "",
          buttonText: res.data.buttonText || "",
          steps: (res.data.steps || []).map((s) => ({
            _id: s._id,
            title: s.title || "",
            desc: s.desc || "",
            iconFile: null,
            iconUrl: s.icon || "",
            previewUrl: null,
          })),
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleIconChange = (index, file) => {
    const newSteps = [...form.steps];
    newSteps[index] = {
      ...newSteps[index],
      iconFile: file,
      previewUrl: file ? URL.createObjectURL(file) : null,
    };
    setForm({ ...form, steps: newSteps });
  };

  const addStep = () => {
    setForm({
      ...form,
      steps: [
        ...form.steps,
        { title: "", desc: "", iconFile: null, iconUrl: "", previewUrl: null },
      ],
    });
  };

  const removeStep = (index) => {
    setForm({
      ...form,
      steps: form.steps.filter((_, i) => i !== index),
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    data.append("mainHeading", form.mainHeading);
    data.append("buttonText", form.buttonText);

    // JSON payload
    const stepsPayload = form.steps.map((s) => ({
      _id: s._id,
      title: s.title,
      desc: s.desc,
      icon: s.iconUrl, // পুরানো URL
    }));
    data.append("steps", JSON.stringify(stepsPayload));

    // ফাইলগুলো অর্ডার অনুযায়ী পাঠানো হবে → icons[0], icons[1], icons[2]
    form.steps.forEach((step, index) => {
      if (step.iconFile) {
        data.append(`icons[${index}]`, step.iconFile);
      }
    });

    // ডিবাগ: কনসোলে দেখুন
    console.log("FormData entries:");
    for (let [key, value] of data.entries()) {
      console.log(key, value);
    }

    try {
      await axios.put(`${API_URL}/api/how-to-process`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("সফলভাবে আপডেট হয়েছে!");
      window.location.reload();
    } catch (err) {
      console.error("Error:", err.response?.data);
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async () => {
    if (window.confirm("সব মুছে ফেলবেন?")) {
      await axios.delete(`${API_URL}/api/how-to-process`);
      alert("রিসেট হয়েছে।");
      window.location.reload();
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
      <Title>How To Process Settings</Title>
      <Form onSubmit={submit}>
        <Label>Main Heading</Label>
        <Input
          value={form.mainHeading}
          onChange={(e) => setForm({ ...form, mainHeading: e.target.value })}
        />

        <Label className="mt-4">Button Text</Label>
        <Input
          value={form.buttonText}
          onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
        />

        <Label className="mt-6">Steps</Label>
        {form.steps.map((step, i) => (
          <StepCard key={i}>
            <Input
              placeholder="Title"
              value={step.title}
              onChange={(e) => {
                const newSteps = [...form.steps];
                newSteps[i].title = e.target.value;
                setForm({ ...form, steps: newSteps });
              }}
              style={{ marginBottom: "12px" }}
            />
            <Textarea
              placeholder="Description"
              value={step.desc}
              onChange={(e) => {
                const newSteps = [...form.steps];
                newSteps[i].desc = e.target.value;
                setForm({ ...form, steps: newSteps });
              }}
              style={{ marginBottom: "12px" }}
            />
            <Label>Icon Image</Label>
            <FileInput
              onChange={(e) => handleIconChange(i, e.target.files[0])}
            />
            {(step.previewUrl || step.iconUrl) && (
              <ImagePreview
                src={
                  step.previewUrl ||
                  (step.iconUrl.includes("http")
                    ? step.iconUrl
                    : `${API_URL}${step.iconUrl}`)
                }
                alt="icon"
              />
            )}
            <RemoveBtn type="button" onClick={() => removeStep(i)}>
              Remove
            </RemoveBtn>
          </StepCard>
        ))}
        <AddStepBtn type="button" onClick={addStep}>
          + Add Step
        </AddStepBtn>

        <ActionButtons>
          <SaveBtn type="submit">Save Changes</SaveBtn>
          <ResetBtn type="button" onClick={handleDelete}>
            Reset All
          </ResetBtn>
        </ActionButtons>
      </Form>
    </Container>
  );
};

export default HowToProcessSettings;
