import { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { FaSave, FaTimes, FaUpload } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseURL_For_IMG_UPLOAD, API_URL } from "../../utils/baseURL";

// Colorful & Modern Styled Components
const EditContainer = styled.div`
  padding: 2.5rem;
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 15px 40px rgba(99, 86, 246, 0.2);
  max-width: 1200px;
  margin: 0 auto;
`;

const EditTitle = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  color: #4f46e5;
  margin-bottom: 2rem;
  text-align: center;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const FormGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`;

const FormItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FormLabel = styled.label`
  font-weight: 700;
  color: #4f46e5;
  font-size: 1rem;
`;

const FormInput = styled.input`
  height: 3rem;
  padding: 0 1rem;
  border: 2px solid #e0e7ff;
  border-radius: 0.75rem;
  font-size: 1rem;
  background: #f8fafc;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(99, 86, 246, 0.1);

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 4px rgba(99, 86, 246, 0.3);
    background: #ffffff;
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const FormSelect = styled.select`
  height: 3rem;
  padding: 0 1rem;
  border: 2px solid #e0e7ff;
  border-radius: 0.75rem;
  background: #f8fafc;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(99, 86, 246, 0.1);

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 4px rgba(99, 86, 246, 0.3);
  }
`;

const FormCheckbox = styled.input`
  width: 24px;
  height: 24px;
  accent-color: #6366f1;
  cursor: pointer;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 3rem;
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: linear-gradient(90deg, #10b981, #34d399);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 35px rgba(16, 185, 129, 0.4);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const CancelButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: linear-gradient(90deg, #ef4444, #f87171);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 25px rgba(239, 68, 68, 0.3);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 35px rgba(239, 68, 68, 0.4);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const ImageUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
`;

const ImagePreview = styled.img`
  width: 140px;
  height: 140px;
  object-fit: cover;
  border-radius: 1rem;
  border: 4px solid #6366f1;
  box-shadow: 0 15px 30px rgba(99, 86, 246, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const UploadButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(99, 86, 246, 0.3);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(99, 86, 246, 0.4);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 70vh;
  font-size: 1.5rem;
  font-weight: 600;
  color: #6366f1;
  gap: 1.5rem;
`;

const StyledSpinner = styled.div`
  border: 6px solid #e0e7ff;
  border-top: 6px solid #6366f1;
  border-right: 6px solid #ec4899;
  border-radius: 50%;
  width: 4.5rem;
  height: 4.5rem;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ErrorAlert = styled.div`
  padding: 2rem;
  background: linear-gradient(90deg, #fee2e2, #fecaca);
  color: #dc2626;
  border-radius: 1rem;
  text-align: center;
  font-weight: 700;
  font-size: 1.25rem;
  box-shadow: 0 15px 35px rgba(220, 38, 38, 0.15);
  border: 2px solid #fca5a5;
  margin: 2rem;
`;

const UserDetailsEditProfile = ({ onCancel }) => {
  const { userId } = useParams();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/users/${userId}`);
        const user = res.data;

        setFormData({
          username: user.username || "",
          email: user.email || "",
          whatsapp: user.whatsapp || "",
          password: "",
          role: user.role || "user",
          isActive: user.isActive ?? true,
          balance: user.balance || 0,
          commissionBalance: user.commissionBalance || 0,
          gameLossCommission: user.gameLossCommission || 0,
          depositCommission: user.depositCommission || 0,
          referCommission: user.referCommission || 0,
          gameLossCommissionBalance: user.gameLossCommissionBalance || 0,
          depositCommissionBalance: user.depositCommissionBalance || 0,
          referCommissionBalance: user.referCommissionBalance || 0,
          referralCode: user.referralCode || "",
          profileImage: null,
        });

        setImagePreview(user.profileImage || null);
        setOriginalImage(user.profileImage || null);
      } catch (err) {
        const msg = err.response?.data?.message || "Failed to load user";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target.result);
        setFormData((prev) => ({ ...prev, profileImage: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return originalImage;

    setUploading(true);
    const form = new FormData();
    form.append("image", file);

    try {
      const res = await axios.post(baseURL_For_IMG_UPLOAD, form);
      return res.data.imageUrl;
    } catch (err) {
      toast.error("Image upload failed");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);

    try {
      let finalImageUrl = originalImage;

      if (formData.profileImage instanceof File) {
        finalImageUrl = await handleImageUpload(formData.profileImage);
        if (!finalImageUrl) {
          setSaving(false);
          return;
        }
      }

      const payload = {
        ...formData,
        profileImage: finalImageUrl,
      };

      if (!payload.password?.trim()) {
        delete payload.password;
      }

      await axios.put(`${API_URL}/api/users/${userId}`, payload);

      toast.success("Profile updated successfully!");
      onCancel();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to update profile";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <StyledSpinner />
        <div>Loading user data...</div>
      </LoadingContainer>
    );
  }

  if (error) {
    return <ErrorAlert>{error}</ErrorAlert>;
  }

  return (
    <>
      <EditContainer>
        <EditTitle>Edit User Profile</EditTitle>

        <form onSubmit={handleSubmit}>
          <FormGrid>
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormInput
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </FormItem>

            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormInput
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </FormItem>

            <FormItem>
              <FormLabel>Whatsapp (Phone)</FormLabel>
              <FormInput
                type="text"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
              />
            </FormItem>

            <FormItem>
              <FormLabel>Password (leave blank to keep current)</FormLabel>
              <FormInput
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="New password only"
              />
            </FormItem>

            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormSelect
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </FormSelect>
            </FormItem>

            <FormItem>
              <FormLabel>Active Status</FormLabel>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <FormCheckbox
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                <span
                  style={{
                    color: formData.isActive ? "#10b981" : "#ef4444",
                    fontWeight: "600",
                  }}
                >
                  {formData.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </FormItem>

            <FormItem>
              <FormLabel>Balance</FormLabel>
              <FormInput
                type="number"
                name="balance"
                value={formData.balance}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </FormItem>

            <FormItem>
              <FormLabel>Commission Balance</FormLabel>
              <FormInput
                type="number"
                name="commissionBalance"
                value={formData.commissionBalance}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </FormItem>

            <FormItem>
              <FormLabel>Game Loss Commission</FormLabel>
              <FormInput
                type="number"
                name="gameLossCommission"
                value={formData.gameLossCommission}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </FormItem>

            <FormItem>
              <FormLabel>Deposit Commission</FormLabel>
              <FormInput
                type="number"
                name="depositCommission"
                value={formData.depositCommission}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </FormItem>

            <FormItem>
              <FormLabel>Refer Commission</FormLabel>
              <FormInput
                type="number"
                name="referCommission"
                value={formData.referCommission}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </FormItem>

            <FormItem>
              <FormLabel>Game Loss Comm. Balance</FormLabel>
              <FormInput
                type="number"
                name="gameLossCommissionBalance"
                value={formData.gameLossCommissionBalance}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </FormItem>

            <FormItem>
              <FormLabel>Deposit Comm. Balance</FormLabel>
              <FormInput
                type="number"
                name="depositCommissionBalance"
                value={formData.depositCommissionBalance}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </FormItem>

            <FormItem>
              <FormLabel>Refer Comm. Balance</FormLabel>
              <FormInput
                type="number"
                name="referCommissionBalance"
                value={formData.referCommissionBalance}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </FormItem>

            <FormItem>
              <FormLabel>Referral Code</FormLabel>
              <FormInput
                type="text"
                name="referralCode"
                value={formData.referralCode}
                onChange={handleChange}
              />
            </FormItem>

            <FormItem>
              <FormLabel>Profile Image</FormLabel>
              <ImageUploadContainer>
                {imagePreview && (
                  <ImagePreview
                    src={
                      imagePreview.startsWith("data:")
                        ? imagePreview
                        : `${baseURL_For_IMG_UPLOAD}s/${imagePreview}`
                    }
                    alt="Profile Preview"
                  />
                )}
                <UploadButton
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={saving || uploading}
                >
                  <FaUpload /> {uploading ? "Uploading..." : "Change Image"}
                </UploadButton>
                <HiddenFileInput
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </ImageUploadContainer>
            </FormItem>
          </FormGrid>

          <ButtonContainer>
            <CancelButton
              type="button"
              onClick={onCancel}
              disabled={saving || uploading}
            >
              <FaTimes /> Cancel
            </CancelButton>
            <SaveButton type="submit" disabled={saving || uploading}>
              <FaSave /> {saving ? "Saving..." : "Save Changes"}
            </SaveButton>
          </ButtonContainer>
        </form>
      </EditContainer>

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </>
  );
};

export default UserDetailsEditProfile;
