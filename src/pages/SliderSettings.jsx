// admin/SliderSettings.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { API_URL } from "../utils/baseURL";

// Styled Components (same as before)
const Container = styled.div`
  padding: 24px;
  background-color: #f9fafb;
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
  grid-template-columns: 1fr;
  gap: 16px;
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  width: 100%;
  &:focus {
    outline: none;
    border-color: #99ff47;
    box-shadow: 0 0 0 3px rgba(153,255,71,0.2);
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  width: 100%;
  background: white;
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
  transition: all 0.2s;
  &:hover { transform: translateY(-1px); }
`;

const SubmitBtn = styled(Button)`
  background-color: #16a34a;
  color: white;
  margin-right: ${props => props.$hasCancel ? "8px" : "0"};
`;

const CancelBtn = styled(Button)`
  background-color: #6b7280;
  color: white;
`;

const SliderGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const SliderCard = styled.div`
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SliderImage = styled.img`
  width: 100%;
  height: 128px;
  object-fit: cover;
  border-radius: 8px;
`;

const CardTitle = styled.p`
  font-weight: bold;
  color: #111827;
  margin: 0;
  font-size: 15px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: auto;
`;

const EditBtn = styled.button`
  flex: 1;
  padding: 8px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  &:hover { background-color: #2563eb; }
`;

const DeleteBtn = styled.button`
  flex: 1;
  padding: 8px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  &:hover { background-color: #dc2626; }
`;

// Main Component
const SliderSettings = () => {
  const [sliders, setSliders] = useState([]);
  const [form, setForm] = useState({
    title: "", subtitle: "", button1Text: "", button1Link: "#",
    button2Text: "", button2Link: "#", titleColor: "#99FF47",
    subtitleColor: "#e5e7eb", button1Color: "#99FF47", button1TextColor: "#000000",
    button2Color: "#7c3aed", button2TextColor: "#ffffff",
    titleSize: "text-5xl", subtitleSize: "text-xl", isActive: true, order: 0
  });
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null);


  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = () => {
    axios.get(`${API_URL}/api/sliders/admin`)
      .then(res => setSliders(res.data))
      .catch(() => console.log("Failed to load sliders"));
  };

  const submit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(form).forEach(k => data.append(k, form[k]));
    if (image) data.append("image", image);

    try {
      if (editId) {
        await axios.put(`${API_URL}/api/sliders/${editId}`, data);
      } else {
        await axios.post(`${API_URL}/api/sliders`, data);
      }
      reset();
      fetchSliders();
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const edit = (s) => {
    setForm({ ...s });
    setEditId(s._id);
    setImage(null);
  };

  const del = async (id) => {
    if (window.confirm("Delete this slider?")) {
      await axios.delete(`${API_URL}/api/sliders/${id}`);
      setSliders(prev => prev.filter(x => x._id !== id));
    }
  };

  const reset = () => {
    setForm({
      title: "", subtitle: "", button1Text: "", button1Link: "#",
      button2Text: "", button2Link: "#", titleColor: "#99FF47",
      subtitleColor: "#e5e7eb", button1Color: "#99FF47", button1TextColor: "#000000",
      button2Color: "#7c3aed", button2TextColor: "#ffffff",
      titleSize: "text-5xl", subtitleSize: "text-xl", isActive: true, order: 0
    });
    setImage(null);
    setEditId(null);
  };

  // Size Options
  const titleSizeOptions = [
    { value: "text-3xl", label: "Small (text-3xl)" },
    { value: "text-4xl", label: "Medium (text-4xl)" },
    { value: "text-5xl", label: "Large (text-5xl)" },
  ];

  const subtitleSizeOptions = [
    { value: "text-lg", label: "Small (text-lg)" },
    { value: "text-xl", label: "Medium (text-xl)" },
    { value: "text-2xl", label: "Large (text-2xl)" },
  ];

  return (
    <Container>
      <Title>Slider Settings</Title>

      <Form onSubmit={submit}>
        <Grid>
          <div>
            <Label>Title</Label>
            <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} required />
          </div>

          {/* Title Size */}
          <div>
            <Label>Title Text Size</Label>
            <Select value={form.titleSize} onChange={e => setForm({ ...form, titleSize: e.target.value })}>
              {titleSizeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Select>
          </div>

          {/* Subtitle Size */}
          <div>
            <Label>Subtitle Text Size</Label>
            <Select value={form.subtitleSize} onChange={e => setForm({ ...form, subtitleSize: e.target.value })}>
              {subtitleSizeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </Select>
          </div>

          <div>
            <Label>Button 1 Text</Label>
            <Input value={form.button1Text} onChange={e => setForm({ ...form, button1Text: e.target.value })} required />
          </div>
          <div>
            <Label>Button 1 Link</Label>
            <Input value={form.button1Link} onChange={e => setForm({ ...form, button1Link: e.target.value })} />
          </div>
          <div>
            <Label>Button 2 Text</Label>
            <Input value={form.button2Text} onChange={e => setForm({ ...form, button2Text: e.target.value })} required />
          </div>
          <div>
            <Label>Button 2 Link</Label>
            <Input value={form.button2Link} onChange={e => setForm({ ...form, button2Link: e.target.value })} />
          </div>
          <div>
            <Label>Upload Image</Label>
            <FileInput onChange={e => setImage(e.target.files[0])} />
          </div>
          <div>
            <Label>Order (Lower = Top)</Label>
            <Input type="number" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} />
          </div>

          {/* Colors */}
          <div>
            <Label>Title Color</Label>
            <ColorInput value={form.titleColor} onChange={e => setForm({ ...form, titleColor: e.target.value })} />
          </div>
          <div>
            <Label>Subtitle Color</Label>
            <ColorInput value={form.subtitleColor} onChange={e => setForm({ ...form, subtitleColor: e.target.value })} />
          </div>
          <div>
            <Label>Button 1 BG Color</Label>
            <ColorInput value={form.button1Color} onChange={e => setForm({ ...form, button1Color: e.target.value })} />
          </div>
          <div>
            <Label>Button 1 Text Color</Label>
            <ColorInput value={form.button1TextColor} onChange={e => setForm({ ...form, button1TextColor: e.target.value })} />
          </div>
          <div>
            <Label>Button 2 BG Color</Label>
            <ColorInput value={form.button2Color} onChange={e => setForm({ ...form, button2Color: e.target.value })} />
          </div>
          <div>
            <Label>Button 2 Text Color</Label>
            <ColorInput value={form.button2TextColor} onChange={e => setForm({ ...form, button2TextColor: e.target.value })} />
          </div>
        </Grid>

        <div style={{ display: 'flex', gap: '8px' }}>
          <SubmitBtn type="submit" $hasCancel={editId}>
            {editId ? "Update" : "Add Slider"}
          </SubmitBtn>
          {editId && <CancelBtn type="button" onClick={reset}>Cancel</CancelBtn>}
        </div>
      </Form>

      <SliderGrid>
        {sliders.map(s => (
          <SliderCard key={s._id}>
            <SliderImage src={`${API_URL}${s.image}`} alt={s.title} />
            <CardTitle>{s.title}</CardTitle>
            <ButtonGroup>
              <EditBtn onClick={() => edit(s)}>Edit</EditBtn>
              <DeleteBtn onClick={() => del(s._id)}>Delete</DeleteBtn>
            </ButtonGroup>
          </SliderCard>
        ))}
      </SliderGrid>
    </Container>
  );
};

export default SliderSettings;