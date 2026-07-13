// src/components/CategoryForm.jsx

import { useState } from "react";
import Form from "../components/Form";
import { useCreateCategoryMutation } from "../store/features/categoryApi";
import { getErrorMessage } from "../utils/errorParser";

const CategoryForm = ({ onSuccess, onClose }) => {
  const [createCategory, { isLoading }] = useCreateCategoryMutation();
  const [error, setError] = useState("");

  const handleSubmit = async (data) => {
    setError("");

    try {
      await createCategory({
        name: data.name,
        isGeneral: false,
      }).unwrap();
      console.log("category created");
      
      onSuccess?.();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const fields = [
    {
      name: "name",
      label: "Category Name",
      type: "text",
      placeholder: "Food",
      validation: {
        required: "Category name is required",
        minLength: {
          value: 2,
          message: "Minimum 2 characters",
        },
        maxLength: {
          value: 50,
          message: "Maximum 50 characters",
        },
      },
    },
  ];

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 mb-5">
      <h2 className="text-xl font-semibold text-white mb-3">
        Create Category
      </h2>

      <Form
        fields={fields}
        onSubmit={handleSubmit}
        submitLabel={isLoading ? "Creating..." : "Create Category"}
        onClose={onClose}
        apiError={error}
      />
    </div>
  );
};

export default CategoryForm;