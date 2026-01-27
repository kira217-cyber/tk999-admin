// admin/CommissionsSettings.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { API_URL } from "../utils/baseURL";

// Mobile-friendly White Design
const Page = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  padding: 40px 20px;
  font-family: "Inter", "Segoe UI", sans-serif;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 38px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 40px;
`;

const Section = styled.div`
  background: #f1f5f9;
  padding: 25px;
  border-radius: 16px;
  margin-bottom: 35px;
  border: 1px solid #cbd5e1;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  color: #0f172a;
  margin-bottom: 20px;
  font-weight: 700;
  border-bottom: 3px solid #3b82f6;
  display: inline-block;
  padding-bottom: 6px;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  color: #1e293b;
  font-size: 16px;
  margin-bottom: 16px;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 14px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  color: #1e293b;
  font-size: 16px;
  min-height: 120px;
  resize: vertical;
  margin-bottom: 16px;
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const FileBox = styled.label`
  display: block;
  padding: 40px;
  background: white;
  border: 3px dashed #94a3b8;
  border-radius: 16px;
  text-align: center;
  cursor: pointer;
  margin-bottom: 16px;
  font-size: 17px;
  color: #64748b;
  font-weight: 600;
  &:hover {
    border-color: #3b82f6;
    background: #f0f7ff;
  }
`;

const Preview = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 14px;
  border: 4px solid #3b82f6;
  margin: 10px auto;
  display: block;
`;

// Mobile Scrollable Table Wrapper
const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: 12px;
  margin: 20px 0;
  border: 2px solid #e2e8f0;
  background: white;
`;

const Table = styled.table`
  width: 100%;
  min-width: 800px; /* Force horizontal scroll on mobile */
  border-collapse: collapse;
`;

const Th = styled.th`
  background: #3b82f6;
  color: white;
  padding: 16px 12px;
  text-align: center;
  font-weight: 700;
  font-size: 15px;
`;

const Td = styled.td`
  padding: 14px 12px;
  text-align: center;
  border-bottom: 1px solid #e2e8f0;
`;

const DeleteBtn = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background: #dc2626;
  }
`;

const AddBtn = styled.button`
  background: #3b82f6;
  color: white;
  padding: 14px 28px;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
  &:hover {
    background: #2563eb;
  }
`;

// Small Save Button
const SaveBtn = styled.button`
  width: 100%;
  max-width: 400px;
  margin: 40px auto 0;
  display: block;
  padding: 18px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  font-size: 22px;
  font-weight: 800;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
  transition: all 0.3s;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 30px rgba(16, 185, 129, 0.4);
  }
`;

const CommissionsSettings = () => {
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    leftTitle: "",
    leftDesc: "",
    buttonText: "",
    calcTitle: "",
    calcItems: [],
    tierNetLoss: "",
    tierPlayers: "",
    tierRate: "",
    formulaTitle: "",
    formulaPercent: "",
    formulaSubtitle: "",
    tableData: [],
    totalCommission: 0,
    leftImage: "",
    leftImageFile: null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/commission/admin`)
      .then((res) => {
        const d = res.data;
        setForm({
          title: d.title || "",
          subtitle: d.subtitle || "",
          leftTitle: d.leftTitle || "",
          leftDesc: d.leftDesc || "",
          buttonText: d.buttonText || "",
          calcTitle: d.calcTitle || "",
          calcItems: (d.calcItems || []).map((item) => ({
            text: item.text || "",
            icon: item.icon || "",
            file: null,
          })),
          tierNetLoss: d.tierNetLoss || "",
          tierPlayers: d.tierPlayers || "",
          tierRate: d.tierRate || "",
          formulaTitle: d.formulaTitle || "",
          formulaPercent: d.formulaPercent || "",
          formulaSubtitle: d.formulaSubtitle || "",
          tableData: d.tableData || [],
          totalCommission: d.totalCommission || 0,
          leftImage: d.leftImage || "",
          leftImageFile: null,
        });
      })
      .catch(() => alert("Failed to load data!"))
      .finally(() => setLoading(false));
  }, []);

  const saveAll = async () => {
    const data = new FormData();
    data.append("title", form.title);
    data.append("subtitle", form.subtitle);
    data.append("leftTitle", form.leftTitle);
    data.append("leftDesc", form.leftDesc);
    data.append("buttonText", form.buttonText);
    data.append("calcTitle", form.calcTitle);
    data.append("tierNetLoss", form.tierNetLoss);
    data.append("tierPlayers", form.tierPlayers);
    data.append("tierRate", form.tierRate);
    data.append("formulaTitle", form.formulaTitle);
    data.append("formulaPercent", form.formulaPercent);
    data.append("formulaSubtitle", form.formulaSubtitle);
    data.append("totalCommission", form.totalCommission);
    data.append("tableData", JSON.stringify(form.tableData));
    data.append(
      "calcItems",
      JSON.stringify(
        form.calcItems.map((i) => ({ text: i.text, icon: i.icon }))
      )
    );

    if (form.leftImageFile) data.append("leftImage", form.leftImageFile);
    form.calcItems.forEach((item, i) => {
      if (item.file) data.append(`calcIcon[${i}]`, item.file);
    });

    try {
      await axios.put(`${API_URL}/api/commission`, data);
      alert("Successfully Saved!");
    } catch (err) {
      alert("Save Failed: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <Page className="flex items-center justify-center">
        <Title>Loading... Please wait</Title>
      </Page>
    );
  }

  return (
    <Page>
      <Container>
        <Title>Commission Settings Panel</Title>

        {/* Main Title */}
        <Section>
          <SectionTitle>Main Title & Subtitle</SectionTitle>
          <Input
            placeholder="e.g. Best Commission Rate!"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <Textarea
            placeholder="Write subtitle here..."
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
          />
        </Section>

        {/* Left Content */}
        <Section>
          <SectionTitle>Left Section Content</SectionTitle>
          <Input
            placeholder="Title"
            value={form.leftTitle}
            onChange={(e) => setForm({ ...form, leftTitle: e.target.value })}
          />
          <Textarea
            placeholder="Write description..."
            value={form.leftDesc}
            onChange={(e) => setForm({ ...form, leftDesc: e.target.value })}
          />
          <Input
            placeholder="Button Text"
            value={form.buttonText}
            onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
          />
          <FileBox>
            Upload Image (Click Here)
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) =>
                setForm({ ...form, leftImageFile: e.target.files[0] })
              }
            />
          </FileBox>
          {form.leftImageFile ? (
            <Preview src={URL.createObjectURL(form.leftImageFile)} />
          ) : form.leftImage ? (
            <Preview src={`${API_URL}${form.leftImage}`} />
          ) : null}
        </Section>

        {/* Calculation Items */}
        <Section>
          <SectionTitle>How Commission is Calculated</SectionTitle>
          {form.calcItems.map((item, i) => (
            <div key={i} style={{ marginBottom: "25px" }}>
              <Textarea
                placeholder="e.g. % Commission: (Profit - Bonus) × 50%"
                value={item.text}
                onChange={(e) => {
                  const items = [...form.calcItems];
                  items[i].text = e.target.value;
                  setForm({ ...form, calcItems: items });
                }}
              />
              <FileBox style={{ padding: "25px" }}>
                Upload Icon
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const items = [...form.calcItems];
                    items[i].file = e.target.files[0];
                    setForm({ ...form, calcItems: items });
                  }}
                />
              </FileBox>
              {item.file ? (
                <Preview src={URL.createObjectURL(item.file)} />
              ) : item.icon ? (
                <Preview src={`${API_URL}${item.icon}`} />
              ) : null}
              <DeleteBtn
                onClick={() =>
                  setForm({
                    ...form,
                    calcItems: form.calcItems.filter((_, idx) => idx !== i),
                  })
                }
              >
                X
              </DeleteBtn>
            </div>
          ))}
          <AddBtn
            onClick={() =>
              setForm({
                ...form,
                calcItems: [
                  ...form.calcItems,
                  { text: "", icon: "", file: null },
                ],
              })
            }
          >
            + Add New Item
          </AddBtn>
        </Section>

        {/* Commission Table - Mobile Friendly */}
        <Section>
          <SectionTitle>Commission Table</SectionTitle>
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <Th>Member</Th>
                  <Th>Win/Loss</Th>
                  <Th>Operation Fee</Th>
                  <Th>Bonus</Th>
                  <Th>Action</Th>
                </tr>
              </thead>
              <tbody>
                {form.tableData.map((row, i) => (
                  <tr key={i}>
                    <Td>
                      <Input
                        placeholder="Name"
                        value={row.member}
                        onChange={(e) => {
                          const newData = [...form.tableData];
                          newData[i].member = e.target.value;
                          setForm({ ...form, tableData: newData });
                        }}
                      />
                    </Td>
                    <Td>
                      <Input
                        type="number"
                        value={row.win}
                        onChange={(e) => {
                          const newData = [...form.tableData];
                          newData[i].win = Number(e.target.value);
                          setForm({ ...form, tableData: newData });
                        }}
                      />
                    </Td>
                    <Td>
                      <Input
                        type="number"
                        value={row.operation}
                        onChange={(e) => {
                          const newData = [...form.tableData];
                          newData[i].operation = Number(e.target.value);
                          setForm({ ...form, tableData: newData });
                        }}
                      />
                    </Td>
                    <Td>
                      <Input
                        type="number"
                        value={row.bonus}
                        onChange={(e) => {
                          const newData = [...form.tableData];
                          newData[i].bonus = Number(e.target.value);
                          setForm({ ...form, tableData: newData });
                        }}
                      />
                    </Td>
                    <Td>
                      <DeleteBtn
                        onClick={() =>
                          setForm({
                            ...form,
                            tableData: form.tableData.filter(
                              (_, idx) => idx !== i
                            ),
                          })
                        }
                      >
                        X
                      </DeleteBtn>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrapper>
          <AddBtn
            onClick={() =>
              setForm({
                ...form,
                tableData: [
                  ...form.tableData,
                  { member: "", win: 0, operation: 0, bonus: 0 },
                ],
              })
            }
          >
            + Add New Member
          </AddBtn>
          <Input
            style={{ marginTop: "20px" }}
            placeholder="Total Commission"
            type="number"
            value={form.totalCommission}
            onChange={(e) =>
              setForm({ ...form, totalCommission: Number(e.target.value) })
            }
          />
        </Section>

        {/* Small Save Button */}
        <SaveBtn onClick={saveAll}>SAVE ALL CHANGES</SaveBtn>
      </Container>
    </Page>
  );
};

export default CommissionsSettings;
