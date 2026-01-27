// src/AdminComponents/WithdrawSystem/AdminWithdrawMethods.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  X,
  Save,
  Loader2,
  Smartphone,
  Building2,
  User,
  Store,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "react-toastify";
import styled, { css } from "styled-components";
import { API_URL } from "../utils/baseURL";

// ==================== Styled Components ====================

const Container = styled(motion.div)`
  min-height: 100vh;
  padding: 2rem 1.5rem;
  background: #0f172a;
  font-family: "Poppins", sans-serif;
  color: white;
`;

const Header = styled(motion.div)`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(to right, #a855f7, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  opacity: 0.8;
`;

const AddButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: white;
  color: #9333ea;
  font-weight: 600;
  padding: 1rem 2rem;
  border-radius: 1.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  margin: 0 auto 3rem;
`;

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`;

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1.5rem;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const IconWrapper = styled.div`
  background: white;
  padding: 0.5rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s;
  ${Card}:hover & {
    opacity: 1;
  }
`;

const ActionBtn = styled.button`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  padding: 0.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const DeleteBtn = styled(ActionBtn)`
  background: rgba(239, 68, 68, 0.3);
  &:hover {
    background: rgba(239, 68, 68, 0.5);
  }
`;

const MethodName = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const InfoRow = styled.p`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  opacity: 0.9;
`;

const ChipContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Chip = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  ${({ color }) => color && css`
    background: ${color};
    color: ${color.replace("100", "700").replace("bg-", "#")};
  `}
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  background: white;
  color: #1f2937;
  border-radius: 1.5rem;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  max-height: 95vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Input = styled(motion.input)`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  outline: none;
  font-size: 1rem;
  &:focus {
    border-color: #9333ea;
    box-shadow: 0 0 0 4px rgba(147, 51, 234, 0.1);
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
`;

const PreviewImg = styled.img`
  width: 64px;
  height: 64px;
  object-fit: contain;
  border-radius: 0.5rem;
  border: 2px solid #e5e7eb;
`;

const SubmitBtn = styled(motion.button)`
  width: 100%;
  background: linear-gradient(to right, #9333ea, #ec4899);
  color: white;
  font-weight: 600;
  padding: 1rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
`;

// ==================== Component ====================

const AddWithdrawMethod = () => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    methodName: "",
    paymentTypes: "",
    minAmount: "",
    maxAmount: "",
    methodIcon: null,
  });

  // Fetch all methods (global)
  const fetchMethods = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/admin-withdraw/methods`);
      setMethods(res.data);
    } catch (err) {
      toast.error("Failed to load methods");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, methodIcon: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setForm({
      methodName: "",
      paymentTypes: "",
      minAmount: "",
      maxAmount: "",
      methodIcon: null,
    });
    setPreview(null);
    setEditId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    resetForm();
  };

  const openEdit = (method) => {
    setForm({
      methodName: method.methodName,
      paymentTypes: method.paymentTypes.join(", "),
      minAmount: method.minAmount,
      maxAmount: method.maxAmount,
      methodIcon: null,
    });
    setPreview(method.methodIcon ? `${API_URL}${method.methodIcon}` : null);
    setEditId(method._id);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.append("methodName", form.methodName.trim());
    formData.append("paymentTypes", form.paymentTypes);
    formData.append("minAmount", form.minAmount);
    formData.append("maxAmount", form.maxAmount);
    if (form.methodIcon) formData.append("methodIcon", form.methodIcon);

    try {
      if (editId) {
        await axios.put(
          `${API_URL}/api/admin-withdraw/method/${editId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success("Method updated successfully");
      } else {
        await axios.post(
          `${API_URL}/api/admin-withdraw/method`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success("New method added");
      }
      fetchMethods();
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${API_URL}/api/admin-withdraw/method/${deleteId}`);
      toast.success("Method deleted");
      fetchMethods();
      setDeleteModal(false);
      setDeleteId(null);
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const getMethodIcon = (method) => {
    if (method.methodIcon) {
      return (
        <img
          src={`${API_URL}${method.methodIcon}`}
          alt={method.methodName}
          className="w-16 h-16 object-contain rounded-lg"
        />
      );
    }
    const name = method.methodName.toLowerCase();
    if (name.includes("bkash") || name.includes("nagad") || name.includes("rocket"))
      return <Smartphone className="w-8 h-8" />;
    if (name.includes("bank")) return <Building2 className="w-8 h-8" />;
    return <Smartphone className="w-8 h-8" />;
  };

  const getTypeChip = (type) => {
    const t = type.toLowerCase();
    if (t === "personal") return { icon: <User size={14} />, color: "bg-blue-100 text-blue-700" };
    if (t === "agent") return { icon: <Store size={14} />, color: "bg-green-100 text-green-700" };
    if (t === "merchant") return { icon: <Building2 size={14} />, color: "bg-purple-100 text-purple-700" };
    return { icon: <User size={14} />, color: "bg-gray-100 text-gray-700" };
  };

  return (
    <Container initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="max-w-7xl mx-auto">
        <Header initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <Title>Admin Withdraw Methods</Title>
          <Subtitle>Manage global payment methods</Subtitle>
        </Header>

        <AddButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openModal}
        >
          <Plus size={24} />
          Add New Method
        </AddButton>

        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          </div>
        )}

        <Grid layout>
          <AnimatePresence>
            {methods.map((method, i) => (
              <Card
                key={method._id}
                layout
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <CardHeader>
                  <IconWrapper>{getMethodIcon(method)}</IconWrapper>
                  <ActionButtons>
                    <ActionBtn onClick={() => openEdit(method)}>
                      <Edit2 size={18} />
                    </ActionBtn>
                    <DeleteBtn onClick={() => { setDeleteId(method._id); setDeleteModal(true); }}>
                      <Trash2 size={18} />
                    </DeleteBtn>
                  </ActionButtons>
                </CardHeader>

                <MethodName>{method.methodName}</MethodName>

                <InfoRow>
                  <span>Minimum:</span>
                  <span className="font-bold">৳{method.minAmount}</span>
                </InfoRow>
                <InfoRow>
                  <span>Maximum:</span>
                  <span className="font-bold">৳{method.maxAmount}</span>
                </InfoRow>

                <ChipContainer>
                  {method.paymentTypes.map((type) => {
                    const chip = getTypeChip(type);
                    return (
                      <Chip key={type} color={chip.color}>
                        {chip.icon} {type}
                      </Chip>
                    );
                  })}
                </ChipContainer>
              </Card>
            ))}
          </AnimatePresence>
        </Grid>

        {/* Empty State */}
        {!loading && methods.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-white/10 backdrop-blur rounded-3xl p-12 max-w-md mx-auto">
              <div className="bg-white/20 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Plus size={48} className="text-white/60" />
              </div>
              <p className="text-white/80 text-lg">No payment methods yet</p>
              <p className="text-white/60 text-sm mt-2">Click the button above to add</p>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <ModalContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <h2 className="text-3xl font-bold">{editId ? "Edit" : "Add New"} Method</h2>
                <button onClick={closeModal}>
                  <X size={28} />
                </button>
              </ModalHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label>Method Name</Label>
                  <Input
                    whileFocus={{ scale: 1.02 }}
                    name="methodName"
                    type="text"
                    required
                    value={form.methodName}
                    onChange={handleChange}
                    placeholder="bKash, Nagad, Bank..."
                  />
                </div>

                <div>
                  <Label>Payment Types (comma separated)</Label>
                  <Input
                    whileFocus={{ scale: 1.02 }}
                    name="paymentTypes"
                    type="text"
                    required
                    value={form.paymentTypes}
                    onChange={handleChange}
                    placeholder="personal, agent, merchant"
                  />
                </div>

                <div>
                  <Label>Method Icon (optional)</Label>
                  <div className="flex items-center gap-4">
                    {preview && <PreviewImg src={preview} alt="preview" />}
                    <label className="cursor-pointer">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200">
                        <Upload size={18} />
                        Upload
                      </div>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Min Amount</Label>
                    <Input
                      whileFocus={{ scale: 1.02 }}
                      name="minAmount"
                      type="number"
                      required
                      value={form.minAmount}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label>Max Amount</Label>
                    <Input
                      whileFocus={{ scale: 1.02 }}
                      name="maxAmount"
                      type="number"
                      required
                      value={form.maxAmount}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <SubmitBtn
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={saving}
                >
                  {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  {saving ? "Saving..." : editId ? "Update" : "Save"}
                </SubmitBtn>
              </form>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal && (
          <ModalOverlay onClick={() => setDeleteModal(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <div className="text-center py-8">
                <div className="bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Trash2 size={32} className="text-red-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Delete Method?</h3>
                <p className="text-gray-600 mb-6">This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteModal(false)}
                    className="flex-1 py-3 border border-gray-300 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={deleting}
                    className="flex-1 py-3 bg-red-600 text-white rounded-xl flex items-center justify-center gap-2"
                  >
                    {deleting ? <Loader2 className="animate-spin" /> : "Delete"}
                  </button>
                </div>
              </div>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default AddWithdrawMethod;