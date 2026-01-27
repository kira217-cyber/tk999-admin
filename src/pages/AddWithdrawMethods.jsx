import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import JoditEditor from "jodit-react";
import axios from "axios";
import { API_URL } from "../utils/baseURL";

// === Styled Components (অপরিবর্তিত) ===
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: #f4f7fa;
  min-height: 100vh;
  @media (max-width: 640px) {
    padding: 1rem;
  }
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
  margin-bottom: 2rem;
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
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
  ${({ error }) => error && `border-color:#e53e3e;`}${({ type }) =>
    type === "color" && `height:50px;`}
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
  max-height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-top: 0.5rem;
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
  font-size: 1rem;
  cursor: pointer;
  ${({ primary }) =>
    primary &&
    `background:linear-gradient(45deg,#4c51bf,#7f9cf5);color:white;`}${({
    danger,
  }) =>
    danger &&
    `background:linear-gradient(45deg,#e53e3e,#f56565);color:white;`}${({
    small,
  }) => small && `padding:0.5rem 1rem;font-size:0.875rem;`}&:disabled {
    background: #e2e8f0;
    cursor: not-allowed;
    opacity: 0.7;
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
const RemoveGatewayButton = styled.button`
  margin-left: 0.5rem;
  background: none;
  border: none;
  color: #e53e3e;
  cursor: pointer;
`;
const GatewayInputWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
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
  font-size: 1.5rem;
  color: #2d3748;
  cursor: pointer;
`;
const UserInputCard = styled.div`
  background: #f7fafc;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;
const TableHead = styled.thead`
  background: linear-gradient(45deg, #4c51bf, #7f9cf5);
  color: white;
`;
const TableRow = styled.tr`
  border-bottom: 1px solid #e2e8f0;
  &:hover {
    background: rgba(167, 169, 202, 0.26);
  }
`;
const TableHeader = styled.th`
  padding: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: left;
`;
const TableCell = styled.td`
  padding: 1rem;
  font-size: 0.875rem;
  color: #2d3748;
`;
const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;
const MethodsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;
const MethodCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  &:hover {
    transform: translateY(-5px);
  }
`;
const MethodImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const AddWithdrawMethods = () => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [gatewayInput, setGatewayInput] = useState("");
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
  const [editingIndex, setEditingIndex] = useState(null);

  const [formData, setFormData] = useState({
    methodName: "",
    methodNameBD: "",
    methodImage: null,
    gateway: [],
    color: "#000000",
    backgroundColor: "#ffffff",
    buttonColor: "#000000",
    instruction: "",
    instructionBD: "",
    status: "active",
    userInputs: [],
  });


  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/api/withdraw-payment-methods/methods`
      );
      setMethods(res.data.data);
    } catch {
      toast.error("Failed to load methods");
    }
    setLoading(false);
  };

  const validate = () => {
    const err = {};
    if (!formData.methodName.trim()) err.methodName = "Required";
    if (!formData.methodNameBD.trim()) err.methodNameBD = "Required";
    if (!formData.methodImage && !editingId) err.methodImage = "Image required";
    if (formData.gateway.length === 0) err.gateway = "Add at least one gateway";
    if (formData.userInputs.length === 0)
      err.userInputs = "Add at least one field";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setFormData((prev) => ({ ...prev, methodImage: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = new FormData();
    payload.append("methodName", formData.methodName);
    payload.append("methodNameBD", formData.methodNameBD);
    payload.append("gateway", JSON.stringify(formData.gateway));
    payload.append("color", formData.color);
    payload.append("backgroundColor", formData.backgroundColor);
    payload.append("buttonColor", formData.buttonColor);
    payload.append("instruction", formData.instruction || "");
    payload.append("instructionBD", formData.instructionBD || "");
    payload.append("status", formData.status);
    payload.append("userInputs", JSON.stringify(formData.userInputs));

    // ইমেজ (create এ বাধ্যতামূলক, update এ অপশনাল)
    if (formData.methodImage) {
      payload.append("methodImage", formData.methodImage);
    }

    try {
      setLoading(true);
      if (editingId) {
        await axios.put(
          `${API_URL}/api/withdraw-payment-methods/method/${editingId}`,
          payload
        );
        toast.success("Updated successfully!");
      } else {
        await axios.post(`${API_URL}/api/withdraw-payment-methods/method`, payload);
        toast.success("Created successfully!");
      }
      resetForm();
      fetchMethods();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (method) => {
    setFormData({
      ...method,
      methodImage: null, // নতুন ইমেজ চাইলে আবার আপলোড করবে
    });
    setEditingId(method._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this method?")) return;
    try {
      await axios.delete(`${API_URL}/api/withdraw-payment-methods/method/${id}`);
      toast.success("Deleted");
      fetchMethods();
    } catch {
      toast.error("Delete failed");
    }
  };

  const resetForm = () => {
    setFormData({
      methodName: "",
      methodNameBD: "",
      methodImage: null,
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
    setErrors({});
  };

  // Gateway & User Input functions
  const addGateway = () => {
    const t = gatewayInput.trim();
    if (!t || formData.gateway.includes(t)) return;
    setFormData((p) => ({ ...p, gateway: [...p.gateway, t] }));
    setGatewayInput("");
  };
  const removeGateway = (g) =>
    setFormData((p) => ({ ...p, gateway: p.gateway.filter((x) => x !== g) }));

  const addUserInput = () => {
    if (!newUserInput.name.trim()) return toast.error("Name required");
    setFormData((p) => ({
      ...p,
      userInputs: [...p.userInputs, { ...newUserInput }],
    }));
    setNewUserInput({
      type: "text",
      isRequired: "false",
      label: "",
      labelBD: "",
      fieldInstruction: "",
      fieldInstructionBD: "",
      name: "",
    });
    setIsAddModalOpen(false);
  };

  const updateUserInput = () => {
    if (!editingUserInput.name.trim()) return toast.error("Name required");
    const updated = [...formData.userInputs];
    updated[editingIndex] = editingUserInput;
    setFormData((p) => ({ ...p, userInputs: updated }));
    setIsUpdateModalOpen(false);
  };

  const deleteUserInput = (i) =>
    setFormData((p) => ({
      ...p,
      userInputs: p.userInputs.filter((_, idx) => idx !== i),
    }));

  return (
    <Container>
      <Title>Manage Withdraw Payment Methods</Title>

      <FormCard onSubmit={handleSubmit}>
        <Grid>
          <InputGroup>
            <Label>Method Name (EN)</Label>
            <Input
              type="text"
              value={formData.methodName}
              onChange={(e) =>
                setFormData((p) => ({ ...p, methodName: e.target.value }))
              }
              error={errors.methodName}
            />
            {errors.methodName && <ErrorText>{errors.methodName}</ErrorText>}
          </InputGroup>
          <InputGroup>
            <Label>Method Name (BD)</Label>
            <Input
              type="text"
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
            <Label>Method Image {editingId && "(Optional on update)"}</Label>
            <FileInput
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {formData.methodImage &&
              typeof formData.methodImage === "string" && (
                <ImagePreview
                  src={`${API_URL}${formData.methodImage}`}
                  alt="preview"
                />
              )}
            {errors.methodImage && <ErrorText>{errors.methodImage}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <Label>Gateways</Label>
            <GatewayInputWrapper>
              <Input
                type="text"
                value={gatewayInput}
                onChange={(e) => setGatewayInput(e.target.value)}
                placeholder="Obay"
              />
              <Button type="button" onClick={addGateway} small primary>
                Add
              </Button>
            </GatewayInputWrapper>
            {errors.gateway && <ErrorText>{errors.gateway}</ErrorText>}
            <GatewayContainer>
              {formData.gateway.map((g, i) => (
                <GatewayTag key={i}>
                  {g}
                  <RemoveGatewayButton onClick={() => removeGateway(g)}>
                    ×
                  </RemoveGatewayButton>
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
          <Label>Instruction (EN)</Label>
          <JoditEditor
            value={formData.instruction}
            onChange={(c) => setFormData((p) => ({ ...p, instruction: c }))}
          />
        </InputGroup>
        <InputGroup>
          <Label>Instruction (BD)</Label>
          <JoditEditor
            value={formData.instructionBD}
            onChange={(c) => setFormData((p) => ({ ...p, instructionBD: c }))}
          />
        </InputGroup>

        <InputGroup>
          <Label>User Input Fields</Label>
          <ButtonWrapper>
            <Button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              primary
            >
              Add New Field
            </Button>
          </ButtonWrapper>
          {errors.userInputs && <ErrorText>{errors.userInputs}</ErrorText>}
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
              {formData.userInputs.map((input, idx) => (
                <TableRow key={idx}>
                  <TableCell>{input.name}</TableCell>
                  <TableCell>{input.type}</TableCell>
                  <TableCell>
                    {input.isRequired === "true" ? "Yes" : "No"}
                  </TableCell>
                  <TableCell>
                    <ActionButtons>
                      <Button
                        small
                        primary
                        onClick={() => {
                          setEditingUserInput({ ...input });
                          setEditingIndex(idx);
                          setIsUpdateModalOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button small danger onClick={() => deleteUserInput(idx)}>
                        Delete
                      </Button>
                    </ActionButtons>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        )}

        <ButtonWrapper>
          <Button type="submit" primary disabled={loading}>
            {loading
              ? "Saving..."
              : editingId
              ? "Update Method"
              : "Create Method"}
          </Button>
          {editingId && (
            <Button type="button" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </ButtonWrapper>
      </FormCard>

      {/* Add / Edit User Input Modals (আগের মতোই) */}
      {isAddModalOpen && (
        <ModalOverlay onClick={() => setIsAddModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Add Field</ModalTitle>
              <CloseButton onClick={() => setIsAddModalOpen(false)}>
                ×
              </CloseButton>
            </ModalHeader>
            <UserInputCard>
              <Grid>
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
                    <option value="file">File</option>
                  </Select>
                </InputGroup>
                <InputGroup>
                  <Label>Name (key)</Label>
                  <Input
                    type="text"
                    value={newUserInput.name}
                    onChange={(e) =>
                      setNewUserInput((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                </InputGroup>
                <InputGroup>
                  <Label>Label (EN)</Label>
                  <Input
                    type="text"
                    value={newUserInput.label}
                    onChange={(e) =>
                      setNewUserInput((p) => ({ ...p, label: e.target.value }))
                    }
                  />
                </InputGroup>
                <InputGroup>
                  <Label>Label (BD)</Label>
                  <Input
                    type="text"
                    value={newUserInput.labelBD}
                    onChange={(e) =>
                      setNewUserInput((p) => ({
                        ...p,
                        labelBD: e.target.value,
                      }))
                    }
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
                <InputGroup>
                  <Label>Instruction (EN)</Label>
                  <Input
                    type="text"
                    value={newUserInput.fieldInstruction}
                    onChange={(e) =>
                      setNewUserInput((p) => ({
                        ...p,
                        fieldInstruction: e.target.value,
                      }))
                    }
                  />
                </InputGroup>
                <InputGroup>
                  <Label>Instruction (BD)</Label>
                  <Input
                    type="text"
                    value={newUserInput.fieldInstructionBD}
                    onChange={(e) =>
                      setNewUserInput((p) => ({
                        ...p,
                        fieldInstructionBD: e.target.value,
                      }))
                    }
                  />
                </InputGroup>
              </Grid>
            </UserInputCard>
            <ButtonWrapper>
              <Button primary onClick={addUserInput}>
                Add
              </Button>
              <Button onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            </ButtonWrapper>
          </ModalContent>
        </ModalOverlay>
      )}

      {isUpdateModalOpen && editingUserInput && (
        <ModalOverlay onClick={() => setIsUpdateModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Edit Field</ModalTitle>
              <CloseButton onClick={() => setIsUpdateModalOpen(false)}>
                ×
              </CloseButton>
            </ModalHeader>
            <UserInputCard>
              <Grid>
                <InputGroup>
                  <Label>Type</Label>
                  <Select
                    value={editingUserInput.type}
                    onChange={(e) =>
                      setEditingUserInput((p) => ({
                        ...p,
                        type: e.target.value,
                      }))
                    }
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="file">File</option>
                  </Select>
                </InputGroup>
                <InputGroup>
                  <Label>Name</Label>
                  <Input
                    type="text"
                    value={editingUserInput.name}
                    onChange={(e) =>
                      setEditingUserInput((p) => ({
                        ...p,
                        name: e.target.value,
                      }))
                    }
                  />
                </InputGroup>
                <InputGroup>
                  <Label>Label (EN)</Label>
                  <Input
                    type="text"
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
                  <Label>Label (BD)</Label>
                  <Input
                    type="text"
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
                <InputGroup>
                  <Label>Instruction (EN)</Label>
                  <Input
                    type="text"
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
                  <Label>Instruction (BD)</Label>
                  <Input
                    type="text"
                    value={editingUserInput.fieldInstructionBD}
                    onChange={(e) =>
                      setEditingUserInput((p) => ({
                        ...p,
                        fieldInstructionBD: e.target.value,
                      }))
                    }
                  />
                </InputGroup>
              </Grid>
            </UserInputCard>
            <ButtonWrapper>
              <Button primary onClick={updateUserInput}>
                Save
              </Button>
              <Button onClick={() => setIsUpdateModalOpen(false)}>
                Cancel
              </Button>
            </ButtonWrapper>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Existing Methods */}
      <div>
        <h2
          style={{
            fontSize: "1.5rem",
            margin: "2rem 0 1rem",
            color: "#1e3a8a",
          }}
        >
          Existing Methods
        </h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <MethodsGrid>
            {methods.map((m) => (
              <MethodCard key={m._id}>
                <MethodImage
                  src={`${API_URL}${m.methodImage}`}
                  alt={m.methodName}
                />
                <h3 style={{ fontSize: "1.25rem", margin: "0.5rem 0" }}>
                  {m.methodName} ({m.methodNameBD})
                </h3>
                <p>
                  <strong>Status:</strong> {m.status}
                </p>
                <p>
                  <strong>Gateways:</strong> {m.gateway.join(", ")}
                </p>
                <div
                  style={{
                    marginTop: "1rem",
                    display: "flex",
                    gap: "0.5rem",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button small primary onClick={() => handleEdit(m)}>
                    Edit
                  </Button>
                  <Button small danger onClick={() => handleDelete(m._id)}>
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

export default AddWithdrawMethods;
