// src/AdminComponents/DepositPaymentMethods/AddDepositMethods.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import JoditEditor from "jodit-react";
import axios from "axios";
import { API_URL } from "../utils/baseURL";


const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: #f4f7fa;
  min-height: 100vh;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e3a8a;
  margin-bottom: 2rem;
`;

const FormCard = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 3rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #4c51bf;
    box-shadow: 0 0 0 3px rgba(76, 81, 191, 0.1);
  }
  ${({ error }) => error && `border-color: #e53e3e;`}
  ${({ type }) => type === "color" && `height: 50px; padding: 4px;`}
`;

const FileInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
`;

const ImagePreview = styled.img`
  width: 100%;
  max-height: 140px;
  object-fit: cover;
  border-radius: 8px;
  margin-top: 0.5rem;
  border: 2px solid #e2e8f0;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  ${({ primary }) =>
    primary &&
    `background: linear-gradient(45deg,#4c51bf,#7f9cf5); color: white;`}
  ${({ danger }) =>
    danger &&
    `background: linear-gradient(45deg,#e53e3e,#f56565); color: white;`}
  ${({ small }) => small && `padding: 6px 12px; font-size: 0.875rem;`}
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.p`
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const GatewayContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const GatewayTag = styled.div`
  display: flex;
  align-items: center;
  background: #e6fffa;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
`;

const RemoveBtn = styled.button`
  margin-left: 0.5rem;
  background: none;
  border: none;
  color: #e53e3e;
  cursor: pointer;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem 0;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e3a8a;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-top: 1rem;
`;

const TableHead = styled.thead`
  background: linear-gradient(45deg, #4c51bf, #7f9cf5);
  color: white;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e2e8f0;
`;

const TableHeader = styled.th`
  padding: 1rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
`;

const TableCell = styled.td`
  padding: 1rem;
  font-size: 0.875rem;
`;

const MethodsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const MethodCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const MethodImage = styled.img`
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const AddDepositMethods = () => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [gatewayInput, setGatewayInput] = useState("");
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    methodName: "",
    methodNameBD: "",
    agentWalletNumber: "",
    agentWalletText: "",
    methodImage: null,
    paymentPageImage: null,
    gateway: [],
    color: "#000000",
    backgroundColor: "#ffffff",
    buttonColor: "#000000",
    instruction: "",
    instructionBD: "",
    status: "active",
    userInputs: [],
  });

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [newUserInput, setNewUserInput] = useState({
    type: "text",
    isRequired: "false",
    label: "",
    labelBD: "",
    fieldInstruction: "",
    fieldInstructionBD: "",
    name: "",
  });
  const [editingUserInput, setEditingUserInput] = useState(null);
  const [editingUserIndex, setEditingUserIndex] = useState(null);

  // Fetch all methods
  const fetchMethods = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/api/deposit-payment-method/methods`
      );
      setMethods(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load methods");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  const validate = () => {
    const err = {};
    if (!formData.methodName.trim()) err.methodName = "Required";
    if (!formData.methodNameBD.trim()) err.methodNameBD = "Required";
    if (!formData.agentWalletNumber.trim()) err.agentWalletNumber = "Required";
    if (!formData.agentWalletText.trim()) err.agentWalletText = "Required";
    if (!editingId && !formData.methodImage) err.methodImage = "Image required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return toast.error("Please fix errors");

    const data = new FormData();
    data.append("methodName", formData.methodName);
    data.append("methodNameBD", formData.methodNameBD);
    data.append("agentWalletNumber", formData.agentWalletNumber);
    data.append("agentWalletText", formData.agentWalletText);
    data.append("gateway", JSON.stringify(formData.gateway));
    data.append("color", formData.color);
    data.append("backgroundColor", formData.backgroundColor);
    data.append("buttonColor", formData.buttonColor);
    data.append("instruction", formData.instruction);
    data.append("instructionBD", formData.instructionBD);
    data.append("status", formData.status);
    data.append("userInputs", JSON.stringify(formData.userInputs));

    if (formData.methodImage instanceof File)
      data.append("methodImage", formData.methodImage);
    if (formData.paymentPageImage instanceof File)
      data.append("paymentPageImage", formData.paymentPageImage);

    try {
      setLoading(true);
      if (editingId) {
        await axios.put(
          `${API_URL}/api/deposit-payment-method/method/${editingId}`,
          data
        );
        toast.success("Updated successfully");
      } else {
        await axios.post(`${API_URL}/api/deposit-payment-method/method`, data);
        toast.success("Created successfully");
      }
      resetForm();
      fetchMethods();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/api/deposit-payment-method/method/${id}`
      );
      const m = res.data.data;
      setFormData({
        ...m,
        methodImage: m.methodImage || null,
        paymentPageImage: m.paymentPageImage || null,
        gateway: m.gateway || [],
        userInputs: m.userInputs || [],
      });
      setEditingId(id);
      setErrors({});
    } catch (err) {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this method?")) return;
    try {
      await axios.delete(`${API_URL}/api/deposit-payment-method/method/${id}`);
      toast.success("Deleted");
      fetchMethods();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const resetForm = () => {
    setFormData({
      methodName: "",
      methodNameBD: "",
      agentWalletNumber: "",
      agentWalletText: "",
      methodImage: null,
      paymentPageImage: null,
      gateway: [],
      color: "#000000",
      backgroundColor: "#ffffff",
      buttonColor: "#000000",
      instruction: "",
      instructionBD: "",
      status: "active",
      userInputs: [],
    });
    setEditingId(null);
    setGatewayInput("");
    setErrors({});
  };

  // Gateway
  const addGateway = () => {
    const val = gatewayInput.trim();
    if (!val) return;
    if (formData.gateway.includes(val)) return toast.error("Already added");
    setFormData((p) => ({ ...p, gateway: [...p.gateway, val] }));
    setGatewayInput("");
  };

  // User Input Modals
  const openAddModal = () => {
    setNewUserInput({
      type: "text",
      isRequired: "false",
      label: "",
      labelBD: "",
      fieldInstruction: "",
      fieldInstructionBD: "",
      name: "",
    });
    setIsAddModalOpen(true);
  };

  const addUserInput = () => {
    if (!newUserInput.name.trim()) return toast.error("Name required");
    setFormData((p) => ({
      ...p,
      userInputs: [...p.userInputs, { ...newUserInput }],
    }));
    setIsAddModalOpen(false);
    toast.success("Field added");
  };

  const openEditModal = (input, idx) => {
    setEditingUserInput({ ...input });
    setEditingUserIndex(idx);
    setIsUpdateModalOpen(true);
  };

  const updateUserInput = () => {
    if (!editingUserInput.name.trim()) return toast.error("Name required");
    const updated = [...formData.userInputs];
    updated[editingUserIndex] = editingUserInput;
    setFormData((p) => ({ ...p, userInputs: updated }));
    setIsUpdateModalOpen(false);
    toast.success("Updated");
  };

  const deleteUserInput = (idx) => {
    setFormData((p) => ({
      ...p,
      userInputs: p.userInputs.filter((_, i) => i !== idx),
    }));
    toast.success("Deleted");
  };

  return (
    <Container>
      <Title>Manage Deposit Payment Methods</Title>

      <FormCard onSubmit={handleSubmit}>
        <Grid>
          <InputGroup>
            <Label>Method Name (English)</Label>
            <Input
              value={formData.methodName}
              onChange={(e) =>
                setFormData((p) => ({ ...p, methodName: e.target.value }))
              }
              error={errors.methodName}
            />
            {errors.methodName && <ErrorText>{errors.methodName}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <Label>Method Name (Bangla)</Label>
            <Input
              value={formData.methodNameBD}
              onChange={(e) =>
                setFormData((p) => ({ ...p, methodNameBD: e.target.value }))
              }
              error={errors.methodNameBD}
            />
            {errors.methodNameBD && (
              <ErrorText>{errors.methodNameBD}</ErrorText>
            )}
          </InputGroup>

          <InputGroup>
            <Label>Agent Wallet Number</Label>
            <Input
              value={formData.agentWalletNumber}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  agentWalletNumber: e.target.value,
                }))
              }
              error={errors.agentWalletNumber}
            />
            {errors.agentWalletNumber && (
              <ErrorText>{errors.agentWalletNumber}</ErrorText>
            )}
          </InputGroup>

          <InputGroup>
            <Label>Agent Wallet Text</Label>
            <Input
              value={formData.agentWalletText}
              onChange={(e) =>
                setFormData((p) => ({ ...p, agentWalletText: e.target.value }))
              }
              error={errors.agentWalletText}
            />
            {errors.agentWalletText && (
              <ErrorText>{errors.agentWalletText}</ErrorText>
            )}
          </InputGroup>

          {/* Method Image */}
          <InputGroup>
            <Label>Method Image {editingId && "(leave blank to keep)"}</Label>
            <FileInput
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  methodImage: e.target.files[0] || null,
                }))
              }
            />
            {formData.methodImage &&
              typeof formData.methodImage === "string" && (
                <ImagePreview
                  src={`${API_URL}${formData.methodImage}`}
                  alt="current"
                />
              )}
            {formData.methodImage instanceof File && (
              <ImagePreview
                src={URL.createObjectURL(formData.methodImage)}
                alt="preview"
              />
            )}
            {errors.methodImage && <ErrorText>{errors.methodImage}</ErrorText>}
          </InputGroup>

          {/* Payment Page Image */}
          <InputGroup>
            <Label>Payment Page Image (optional)</Label>
            <FileInput
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  paymentPageImage: e.target.files[0] || null,
                }))
              }
            />
            {formData.paymentPageImage &&
              typeof formData.paymentPageImage === "string" && (
                <ImagePreview
                  src={`${API_URL}${formData.paymentPageImage}`}
                  alt="current"
                />
              )}
            {formData.paymentPageImage instanceof File && (
              <ImagePreview
                src={URL.createObjectURL(formData.paymentPageImage)}
                alt="preview"
              />
            )}
          </InputGroup>

          {/* Gateways */}
          <InputGroup>
            <Label>Gateways</Label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Input
                value={gatewayInput}
                onChange={(e) => setGatewayInput(e.target.value)}
                placeholder="Type gateway name"
              />
              <Button type="button" small primary onClick={addGateway}>
                Add
              </Button>
            </div>
            <GatewayContainer>
              {formData.gateway.map((g, i) => (
                <GatewayTag key={i}>
                  {g}
                  <RemoveBtn
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        gateway: p.gateway.filter((_, x) => x !== i),
                      }))
                    }
                  >
                    ×
                  </RemoveBtn>
                </GatewayTag>
              ))}
            </GatewayContainer>
          </InputGroup>

          <InputGroup>
            <Label>Text Color</Label>
            <Input
              type="color"
              value={formData.color}
              onChange={(e) =>
                setFormData((p) => ({ ...p, color: e.target.value }))
              }
            />
          </InputGroup>

          <InputGroup>
            <Label>Background Color</Label>
            <Input
              type="color"
              value={formData.backgroundColor}
              onChange={(e) =>
                setFormData((p) => ({ ...p, backgroundColor: e.target.value }))
              }
            />
          </InputGroup>

          <InputGroup>
            <Label>Button Color</Label>
            <Input
              type="color"
              value={formData.buttonColor}
              onChange={(e) =>
                setFormData((p) => ({ ...p, buttonColor: e.target.value }))
              }
            />
          </InputGroup>

          <InputGroup>
            <Label>Status</Label>
            <Select
              value={formData.status}
              onChange={(e) =>
                setFormData((p) => ({ ...p, status: e.target.value }))
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </InputGroup>
        </Grid>

        <InputGroup>
          <Label>Instruction (English)</Label>
          <JoditEditor
            value={formData.instruction}
            onChange={(c) => setFormData((p) => ({ ...p, instruction: c }))}
          />
        </InputGroup>

        <InputGroup>
          <Label>Instruction (Bangla)</Label>
          <JoditEditor
            value={formData.instructionBD}
            onChange={(c) => setFormData((p) => ({ ...p, instructionBD: c }))}
          />
        </InputGroup>

        {/* User Inputs Section */}
        <InputGroup>
          <Label>User Input Fields</Label>
          <ButtonWrapper>
            <Button type="button" primary onClick={openAddModal}>
              Add New Field
            </Button>
          </ButtonWrapper>
        </InputGroup>

        {formData.userInputs.length > 0 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Name</TableHeader>
                <TableHeader>Type</TableHeader>
                <TableHeader>Required</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <tbody>
              {formData.userInputs.map((inp, i) => (
                <TableRow key={i}>
                  <TableCell>{inp.name}</TableCell>
                  <TableCell>{inp.type}</TableCell>
                  <TableCell>
                    {inp.isRequired === "true" ? "Yes" : "No"}
                  </TableCell>
                  <TableCell>
                    <Button small primary onClick={() => openEditModal(inp, i)}>
                      Edit
                    </Button>{" "}
                    <Button small danger onClick={() => deleteUserInput(i)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        )}

        <ButtonWrapper>
          <Button type="submit" primary disabled={loading}>
            {loading ? "Saving..." : editingId ? "Update" : "Create"}
          </Button>
          {editingId && (
            <Button type="button" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </ButtonWrapper>
      </FormCard>

      {/* ==================== ADD USER INPUT MODAL ==================== */}
      {isAddModalOpen && (
        <ModalOverlay onClick={() => setIsAddModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Add New User Input Field</ModalTitle>
              <CloseButton onClick={() => setIsAddModalOpen(false)}>
                ×
              </CloseButton>
            </ModalHeader>
            <Grid>
              <InputGroup>
                <Label>Field Name (code)</Label>
                <Input
                  value={newUserInput.name}
                  onChange={(e) =>
                    setNewUserInput((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="e.g. transaction_id"
                />
              </InputGroup>
              <InputGroup>
                <Label>Type</Label>
                <Select
                  value={newUserInput.type}
                  onChange={(e) =>
                    setNewUserInput((p) => ({ ...p, type: e.target.value }))
                  }
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="file">File Upload</option>
                </Select>
              </InputGroup>
              <InputGroup>
                <Label>Label (English)</Label>
                <Input
                  value={newUserInput.label}
                  onChange={(e) =>
                    setNewUserInput((p) => ({ ...p, label: e.target.value }))
                  }
                />
              </InputGroup>
              <InputGroup>
                <Label>Label (Bangla)</Label>
                <Input
                  value={newUserInput.labelBD}
                  onChange={(e) =>
                    setNewUserInput((p) => ({ ...p, labelBD: e.target.value }))
                  }
                />
              </InputGroup>
              <InputGroup>
                <Label>Field Instruction (English)</Label>
                <Input
                  value={newUserInput.fieldInstruction}
                  onChange={(e) =>
                    setNewUserInput((p) => ({
                      ...p,
                      fieldInstruction: e.target.value,
                    }))
                  }
                  placeholder="e.g. Enter your transaction ID"
                />
              </InputGroup>
              <InputGroup>
                <Label>Field Instruction (Bangla)</Label>
                <Input
                  value={newUserInput.fieldInstructionBD}
                  onChange={(e) =>
                    setNewUserInput((p) => ({
                      ...p,
                      fieldInstructionBD: e.target.value,
                    }))
                  }
                  placeholder="আপনার ট্রানজেকশন আইডি দিন"
                />
              </InputGroup>
              <InputGroup>
                <Label>Required?</Label>
                <Select
                  value={newUserInput.isRequired}
                  onChange={(e) =>
                    setNewUserInput((p) => ({
                      ...p,
                      isRequired: e.target.value,
                    }))
                  }
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Select>
              </InputGroup>
            </Grid>
            <ButtonWrapper>
              <Button primary onClick={addUserInput}>
                Add Field
              </Button>
              <Button onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            </ButtonWrapper>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* ==================== EDIT USER INPUT MODAL ==================== */}
      {isUpdateModalOpen && editingUserInput && (
        <ModalOverlay onClick={() => setIsUpdateModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Edit User Input Field</ModalTitle>
              <CloseButton onClick={() => setIsUpdateModalOpen(false)}>
                ×
              </CloseButton>
            </ModalHeader>
            <Grid>
              <InputGroup>
                <Label>Field Name</Label>
                <Input
                  value={editingUserInput.name}
                  onChange={(e) =>
                    setEditingUserInput((p) => ({ ...p, name: e.target.value }))
                  }
                />
              </InputGroup>
              <InputGroup>
                <Label>Type</Label>
                <Select
                  value={editingUserInput.type}
                  onChange={(e) =>
                    setEditingUserInput((p) => ({ ...p, type: e.target.value }))
                  }
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                  <option value="file">File Upload</option>
                </Select>
              </InputGroup>
              <InputGroup>
                <Label>Label (English)</Label>
                <Input
                  value={editingUserInput.label}
                  onChange={(e) =>
                    setEditingUserInput((p) => ({
                      ...p,
                      label: e.target.value,
                    }))
                  }
                />
              </InputGroup>
              <InputGroup>
                <Label>Label (Bangla)</Label>
                <Input
                  value={editingUserInput.labelBD}
                  onChange={(e) =>
                    setEditingUserInput((p) => ({
                      ...p,
                      labelBD: e.target.value,
                    }))
                  }
                />
              </InputGroup>
              <InputGroup>
                <Label>Field Instruction (English)</Label>
                <Input
                  value={editingUserInput.fieldInstruction}
                  onChange={(e) =>
                    setEditingUserInput((p) => ({
                      ...p,
                      fieldInstruction: e.target.value,
                    }))
                  }
                />
              </InputGroup>
              <InputGroup>
                <Label>Field Instruction (Bangla)</Label>
                <Input
                  value={editingUserInput.fieldInstructionBD}
                  onChange={(e) =>
                    setEditingUserInput((p) => ({
                      ...p,
                      fieldInstructionBD: e.target.value,
                    }))
                  }
                />
              </InputGroup>
              <InputGroup>
                <Label>Required?</Label>
                <Select
                  value={editingUserInput.isRequired}
                  onChange={(e) =>
                    setEditingUserInput((p) => ({
                      ...p,
                      isRequired: e.target.value,
                    }))
                  }
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </Select>
              </InputGroup>
            </Grid>
            <ButtonWrapper>
              <Button primary onClick={updateUserInput}>
                Save Changes
              </Button>
              <Button onClick={() => setIsUpdateModalOpen(false)}>
                Cancel
              </Button>
            </ButtonWrapper>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* ==================== LIST OF METHODS ==================== */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          All Deposit Methods
        </h2>
        {loading ? (
          <p>Loading...</p>
        ) : methods.length === 0 ? (
          <p>No methods found</p>
        ) : (
          <MethodsGrid>
            {methods.map((m) => (
              <MethodCard key={m._id}>
                {m.methodImage && (
                  <MethodImage
                    src={`${API_URL}${m.methodImage}`}
                    alt={m.methodName}
                  />
                )}
                <h3 className="text-lg font-bold mt-3">{m.methodName}</h3>
                <p className="text-sm text-gray-600">{m.methodNameBD}</p>
                <p className="text-sm">Wallet: {m.agentWalletNumber}</p>
                <p className="text-sm">Status: {m.status}</p>
                <div className="mt-4 flex justify-end gap-3">
                  <Button
                    onClick={() => handleEdit(m._id)}
                    style={{ background: "#3b82f6", color: "white" }}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(m._id)}
                    style={{ background: "#ef4444", color: "white" }}
                  >
                    Delete
                  </Button>
                </div>
              </MethodCard>
            ))}
          </MethodsGrid>
        )}
      </div>
    </Container>
  );
};

export default AddDepositMethods;
