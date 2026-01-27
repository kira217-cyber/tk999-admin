import React, { useEffect, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchSubOptions,
  fetchMenuOptionsForSub,
  createSubOption,
  updateSubOption,
  deleteSubOption,
  setSubForm,
  setSubEditingId,
  resetSubForm,
} from "../../redux/Frontend Control/GameNavControl/subOptionSlice";
import { uploadImage } from "../../redux/Frontend Control/GameNavControl/imageSlice";
import styled from "styled-components";
import { motion } from "framer-motion";
import { baseURL_For_IMG_UPLOAD } from "../../utils/baseURL";

// Styled Components
const Container = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 1000px;
  // margin: 2rem auto;
`;

const Title = styled.h2`
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1.8rem;
`;

const FormWrapper = styled(motion.form)`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const InputWrapper = styled.div`
  flex: 1 1 30%;
  min-width: 200px;
`;

const Label = styled.label`
  color: #2c3e50;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  display: block;
`;

const StyledInput = styled.input`
  background-color: #fff;
  border: 1px solid #ced4da;
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  width: 100%;
  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    outline: none;
  }
`;

const StyledSelect = styled.select`
  background-color: #fff;
  border: 1px solid #ced4da;
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  width: 100%;
  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    outline: none;
  }
`;

const FileInputWrapper = styled.div`
  position: relative;
`;

const StyledFileInput = styled.input`
  background-color: #fff;
  border: 1px solid #ced4da;
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 0.9rem;
  width: 100%;
  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    outline: none;
  }
`;

const ImagePreview = styled.img`
  border-radius: 8px;
  margin-top: 0.5rem;
  border: 1px solid #dee2e6;
`;

const SubmitButton = styled(motion.button)`
  background: linear-gradient(90deg, #007bff, #0056b3);
  border: none;
  border-radius: 8px;
  padding: 0.75rem 2rem;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: background 0.3s ease;
  &:hover {
    background: linear-gradient(90deg, #0056b3, #003d80);
  }
  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const ErrorAlert = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  width: 100%;
  text-align: center;
`;

const Card = styled(motion.div)`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba_gradient(0, 0, 0, 0.05);
  margin-bottom: 1rem;
  transition: transform 0.2s ease;
  &:hover {
    transform: translateY(-2px);
  }
`;

const CardBody = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
`;

const CardImage = styled.img`
  border-radius: 4px;
  margin-left: 1rem;
  border: 1px solid #dee2e6;
`;

const EditButton = styled(motion.button)`
  background: #ffc107;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  color: #212529;
  font-size: 0.9rem;
  font-weight: 500;
  margin-right: 0.5rem;
  &:hover {
    background: #e0a800;
  }
  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const DeleteButton = styled(motion.button)`
  background: #dc3545;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  &:hover {
    background: #c82333;
  }
  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const SubOptionManager = () => {
  const dispatch = useDispatch();
  const { subOptions, menuOptionsForSub, form, editingId, loading, error } =
    useSelector((state) => state.subOption);
  const { loading: imageLoading, error: imageError } = useSelector(
    (state) => state.image
  );
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    dispatch(fetchSubOptions());
    dispatch(fetchMenuOptionsForSub());
    const fetchProviders = async () => {
      try {
        const response = await fetch(
          "https://apigames.oracleapi.net/api/providers",
          {
            headers: {
              "x-api-key":
                "300cc0adfcfb041c25c4a8234e3c0e312a44c7570677d64bdb983412f045da67",
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          setProviders(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch providers", error);
      }
    };
    fetchProviders();
  }, [dispatch]);

  const resizeImage = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = 200;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");

        let width = img.width;
        let height = img.height;
        let startX = 0;
        let startY = 0;
        let srcSize = width;

        if (width > height) {
          startX = (width - height) / 2;
          srcSize = height;
        } else if (height > width) {
          startY = (height - width) / 2;
          srcSize = width;
        }

        ctx.drawImage(img, startX, startY, srcSize, srcSize, 0, 0, size, size);

        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, { type: file.type }));
        }, file.type);
      };
      img.onerror = reject;
    });
  }, []);

  const handleImageUpload = useCallback(
    async (file) => {
      const resizedFile = await resizeImage(file);
      const result = await dispatch(uploadImage(resizedFile)).unwrap();
      return result;
    },
    [dispatch, resizeImage]
  );

  const handleChange = (e) => {
    if (e.target.type === "file") {
      const file = e.target.files[0];
      if (file) {
        handleImageUpload(file)
          .then((imageUrl) => {
            dispatch(setSubForm({ image: imageUrl }));
          })
          .catch((err) => {
            console.error("Image upload failed:", err);
          });
      }
    } else {
      dispatch(setSubForm({ [e.target.name]: e.target.value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || imageLoading) return;
    try {
      if (editingId) {
        await dispatch(updateSubOption({ id: editingId, data: form })).unwrap();
      } else {
        await dispatch(createSubOption(form)).unwrap();
      }
      dispatch(resetSubForm());
    } catch (err) {
      console.error("Error saving sub option:", err);
    }
  };

  const handleEdit = (item) => {
    dispatch(setSubForm(item));
    dispatch(setSubEditingId(item._id));
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete sub option?")) {
      try {
        await dispatch(deleteSubOption(id)).unwrap();
      } catch (err) {
        console.error("Error deleting sub option:", err);
      }
    }
  };

  return (
    <Container className="container py-5">
      <Title>Sub Options Manager</Title>
      {(error || imageError) && <ErrorAlert>{error || imageError}</ErrorAlert>}
      <FormWrapper
        onSubmit={handleSubmit}
        className="row g-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <InputWrapper className="col-md-4">
          <Label htmlFor="providerId">Provider</Label>
          <StyledSelect
            id="providerId"
            name="providerId"
            value={form.providerId || ""}
            onChange={handleChange}
            required
          >
            <option value="">Select Provider</option>
            {providers.map((provider) => (
              <option key={provider._id} value={provider._id}>
                {provider.name}
              </option>
            ))}
          </StyledSelect>
        </InputWrapper>
        <InputWrapper className="col-md-4">
          <Label htmlFor="image">Image</Label>
          <FileInputWrapper>
            <StyledFileInput
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleChange}
              required={!form.image}
            />
          </FileInputWrapper>
          {form.image && (
            <ImagePreview
              src={`${baseURL_For_IMG_UPLOAD}s/${form.image}`}
              alt="Preview"
              width={60}
              height={60}
            />
          )}
        </InputWrapper>
        <InputWrapper className="col-md-4">
          <Label htmlFor="parentMenuOption">Parent Menu Option</Label>
          <StyledSelect
            id="parentMenuOption"
            name="parentMenuOption"
            value={form.parentMenuOption || ""}
            onChange={handleChange}
            required
          >
            <option value="">Select Menu Option</option>
            {menuOptionsForSub.map((opt) => (
              <option key={opt._id} value={opt._id}>
                {opt.title} - {opt.titleBD}
              </option>
            ))}
          </StyledSelect>
        </InputWrapper>
        <div className="col-12 text-center">
          <SubmitButton
            type="submit"
            disabled={loading || imageLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading || imageLoading
              ? "Saving..."
              : editingId
              ? "Update"
              : "Create"}
          </SubmitButton>
        </div>
      </FormWrapper>

      <div>
        {subOptions.map((item) => (
          <Card
            key={item._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <CardBody>
              <div className="d-flex align-items-center">
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <strong
                    style={{
                      color: "#343a40",
                      fontSize: "1rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {providers.find((p) => p._id === item.providerId)?.name ||
                      item.providerId}
                  </strong>
                  <span
                    style={{
                      color: "#6c757d",
                      fontSize: "0.875rem",
                      marginTop: "0.25rem",
                    }}
                  >
                    {menuOptionsForSub.find(
                      (opt) => opt._id === item.parentMenuOption
                    )?.title || "No Parent Menu"}
                  </span>
                </div>
                {item.image && (
                  <CardImage
                    src={`${baseURL_For_IMG_UPLOAD}s/${item.image}`}
                    alt={
                      providers.find((p) => p._id === item.providerId)?.name ||
                      item.providerId
                    }
                    width={40}
                    height={40}
                  />
                )}
              </div>
              <div>
                <EditButton
                  onClick={() => handleEdit(item)}
                  disabled={loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Edit
                </EditButton>
                <DeleteButton
                  onClick={() => handleDelete(item._id)}
                  disabled={loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Delete
                </DeleteButton>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </Container>
  );
};

export default SubOptionManager;
