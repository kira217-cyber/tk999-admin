import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import { API_URL } from "../utils/baseURL";

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #eef2ff 0%, #f8f0ff 50%, #fff0f8 100%);
  padding: 48px 16px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

const Wrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const FormCard = styled.div`
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(139, 92, 246, 0.15);
  padding: 40px;
  margin-bottom: 60px;
  border: 1px solid #e2d9ff;
`;

const Title = styled.h2`
  font-size: 36px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 40px;
  background: linear-gradient(to right, #9333ea, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const FormGrid = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const FormLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const Label = styled.label`
  font-weight: 700;
  color: #374151;
  font-size: 15px;
  margin-bottom: 8px;
  display: block;
`;

const Input = styled.input`
  padding: 14px 20px;
  border: 2px solid #e5e7eb;
  border-radius: 14px;
  font-size: 16px;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: #a855f7;
    box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.2);
  }
`;

const Select = styled.select`
  padding: 14px 20px;
  border: 2px solid #e5e7eb;
  border-radius: 14px;
  font-size: 16px;
  background: white;

  &:focus {
    outline: none;
    border-color: #a855f7;
    box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.2);
  }
`;

const UploadBox = styled.div`
  border: 4px dashed ${(props) => props.$color || "#c4b5fd"};
  border-radius: 24px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: ${(props) => props.$bg || "#faf5ff"};

  &:hover {
    border-color: ${(props) => props.$hover || "#a855f7"};
    transform: translateY(-4px);
  }
`;

const UploadPreview = styled.img`
  max-height: 280px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  object-fit: cover;
`;

const IconPreview = styled.img`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  object-fit: cover;
  border: 10px solid white;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 20px;
`;

const SubmitButton = styled.button`
  flex: 1;
  padding: 16px;
  background: linear-gradient(to right, #9333ea, #ec4899);
  color: white;
  font-weight: bold;
  font-size: 18px;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(236, 72, 153, 0.4);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  padding: 16px 32px;
  background: #6b7280;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 14px;
  cursor: pointer;

  &:hover {
    background: #4b5563;
  }
`;

const ListSection = styled.div`
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(139, 92, 246, 0.15);
  padding: 40px;
`;

const ListTitle = styled.h3`
  font-size: 32px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 40px;
  color: #6b21a8;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 32px;
`;

const Card = styled.div`
  background: linear-gradient(135deg, #f3e8ff, #fce7f3);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.4s;

  &:hover {
    transform: translateY(-12px);
    box-shadow: 0 20px 40px rgba(139, 92, 246, 0.25);
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const CardBody = styled.div`
  padding: 24px;
  text-align: center;
  position: relative;
`;

const CardIcon = styled.img`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  border: 8px solid white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  margin-top: -60px;
  margin-bottom: 16px;
`;

const CardTitle = styled.h4`
  font-size: 20px;
  font-weight: 700;
  color: #6b21a8;
  margin: 12px 0;
`;

const CardProvider = styled.p`
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 20px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const EditBtn = styled.button`
  padding: 10px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background: #2563eb;
  }
`;

const DeleteBtn = styled.button`
  padding: 10px 20px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background: #dc2626;
  }
`;

const AddProvider = () => {
  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    categoryName: "",
    providerId: "",
    mainImage: null,
    iconImage: null,
  });

  const [previews, setPreviews] = useState({
    mainImage: null,
    iconImage: null,
  });

  // Fetch Providers
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await axios.get(
          "https://apigames.oracleapi.net/api/providers",
          {
            headers: {
              "x-api-key":
                "b4fb7adb955b1078d8d38b54f5ad7be8ded17cfba85c37e4faa729ddd679d379",
            },
          }
        );
        setProviders(res.data.data || []);
      } catch (err) {
        toast.error("প্রোভাইডার লোড করতে সমস্যা হয়েছে");
      }
    };
    fetchProviders();
  }, []);

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/categories`);
      setCategories(res.data.data || []);
    } catch (err) {
      toast.error("ক্যাটেগরি লোড করতে ব্যর্থ");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFile = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, [type]: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews({ ...previews, [type]: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      categoryName: "",
      providerId: "",
      mainImage: null,
      iconImage: null,
    });
    setPreviews({ mainImage: null, iconImage: null });
    setEditMode(false);
    setCurrentId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.categoryName ||
      !formData.providerId ||
      !formData.mainImage ||
      !formData.iconImage
    ) {
      toast.error("সব ফিল্ড পূরণ করুন!");
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("categoryName", formData.categoryName);
    data.append("providerId", formData.providerId);
    data.append("mainImage", formData.mainImage);
    data.append("iconImage", formData.iconImage);

    try {
      if (editMode) {
        await axios.put(
          `${API_URL}/api/categories/${currentId}`,
          data
        );
        toast.success("ক্যাটেগরি আপডেট হয়েছে!");
      } else {
        await axios.post(`${API_URL}/api/categories/add`, data);
        toast.success("নতুন ক্যাটেগরি যোগ হয়েছে!");
      }
      resetForm();
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "কিছু ভুল হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat) => {
    setFormData({
      categoryName: cat.categoryName,
      providerId: cat.providerId,
      mainImage: null,
      iconImage: null,
    });
    setPreviews({
      mainImage: `${API_URL}${cat.mainImage}`,
      iconImage: `${API_URL}{cat.iconImage}`,
    });
    setEditMode(true);
    setCurrentId(cat._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("আপনি কি নিশ্চিত যে এই ক্যাটেগরি মুছে ফেলতে চান?"))
      return;

    try {
      await axios.delete(`${API_URL}/api/categories/${id}`);
      toast.success("ক্যাটেগরি মুছে ফেলা হয়েছে");
      fetchCategories();
    } catch (err) {
      toast.error("ডিলিট করতে ব্যর্থ");
    }
  };

  return (
    <Container>
      <ToastContainer position="top-right" theme="colored" autoClose={3000} />
      <Wrapper>
        {/* Form Section */}
        <FormCard>
          <Title>
            {editMode ? "ক্যাটেগরি এডিট করুন" : "নতুন ক্যাটেগরি যোগ করুন"}
          </Title>
          <FormGrid onSubmit={handleSubmit}>
            <FormLeft>
              <div>
                <Label>ক্যাটেগরি নাম</Label>
                <Input
                  type="text"
                  name="categoryName"
                  value={formData.categoryName}
                  onChange={handleChange}
                  placeholder="যেমন: JILI Slots"
                  required
                />
              </div>

              <div>
                <Label>প্রোভাইডার</Label>
                <Select
                  name="providerId"
                  value={formData.providerId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- প্রোভাইডার নির্বাচন করুন --</option>
                  {providers.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} ({p.parentcategory?.name})
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label>মেইন ইমেজ (ব্যানার)</Label>
                <UploadBox $color="#c4b5fd" $hover="#a855f7" $bg="#faf5ff">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFile(e, "mainImage")}
                    style={{ display: "none" }}
                    id="mainImg"
                  />
                  <label htmlFor="mainImg" style={{ cursor: "pointer" }}>
                    {previews.mainImage ? (
                      <UploadPreview
                        src={previews.mainImage}
                        alt="Main Preview"
                      />
                    ) : (
                      <div>
                        <svg
                          width="80"
                          height="80"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#a855f7"
                          strokeWidth="2"
                        >
                          <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p
                          style={{
                            marginTop: "16px",
                            fontSize: "18px",
                            color: "#9333ea",
                          }}
                        >
                          মেইন ইমেজ আপলোড করুন
                        </p>
                      </div>
                    )}
                  </label>
                </UploadBox>
              </div>

              <div>
                <Label>আইকন ইমেজ (লোগো)</Label>
                <UploadBox $color="#f9a8d4" $hover="#ec4899" $bg="#fdf2f8">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFile(e, "iconImage")}
                    style={{ display: "none" }}
                    id="iconImg"
                  />
                  <label htmlFor="iconImg" style={{ cursor: "pointer" }}>
                    {previews.iconImage ? (
                      <IconPreview
                        src={previews.iconImage}
                        alt="Icon Preview"
                      />
                    ) : (
                      <div>
                        <div
                          style={{
                            width: "120px",
                            height: "120px",
                            background: "#fce7f3",
                            borderRadius: "50%",
                            margin: "0 auto 16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <svg
                            width="60"
                            height="60"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#ec4899"
                            strokeWidth="2"
                          >
                            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p style={{ fontSize: "18px", color: "#d946ef" }}>
                          আইকন ইমেজ আপলোড করুন
                        </p>
                      </div>
                    )}
                  </label>
                </UploadBox>
              </div>

              <ButtonGroup>
                <SubmitButton type="submit" disabled={loading}>
                  {loading
                    ? "প্রসেসিং হচ্ছে..."
                    : editMode
                    ? "আপডেট করুন"
                    : "যোগ করুন"}
                </SubmitButton>
                {editMode && (
                  <CancelButton type="button" onClick={resetForm}>
                    বাতিল
                  </CancelButton>
                )}
              </ButtonGroup>
            </FormLeft>
          </FormGrid>
        </FormCard>

        {/* List Section */}
        <ListSection>
          <ListTitle>সকল ক্যাটেগরি</ListTitle>
          <Grid>
            {categories.map((cat) => (
              <Card key={cat._id}>
                <CardImage
                  src={`${API_URL}${cat.mainImage}`}
                  alt={cat.categoryName}
                />
                <CardBody>
                  <CardIcon
                    src={`${API_URL}${cat.iconImage}`}
                    alt="icon"
                  />
                  <CardTitle>{cat.categoryName}</CardTitle>
                  <CardProvider>
                    {providers.find((p) => p._id === cat.providerId)?.name ||
                      "Unknown Provider"}
                  </CardProvider>
                  <ActionButtons>
                    <EditBtn onClick={() => handleEdit(cat)}>Edit</EditBtn>
                    <DeleteBtn onClick={() => handleDelete(cat._id)}>
                      Delete
                    </DeleteBtn>
                  </ActionButtons>
                </CardBody>
              </Card>
            ))}
          </Grid>
        </ListSection>
      </Wrapper>
    </Container>
  );
};

export default AddProvider;
