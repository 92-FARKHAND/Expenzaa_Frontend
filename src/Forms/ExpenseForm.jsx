// src/components/ExpenseForm.jsx - FIXED & DEFENSIVE VERSION
import { useState } from "react";
import { useSelector } from "react-redux";
import Form from "../components/Form.jsx";
import {
  useCreateExpenseMutation,
  useEditExpenseMutation,
} from "../store/features/expenseApi.js";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
} from "../store/features/categoryApi.js";
import { selectUser } from "../store/features/auth/authSlice.js";
import { getErrorMessage } from "../utils/errorParser.js";

const ExpenseForm = ({ defaultValues = {}, mode, onSuccess, onClose }) => {
  const isEdit = mode === "edit" || !!defaultValues?._id;
  
  // Get user from Redux
  const user = useSelector(selectUser);

  const [createExpense, { isLoading: creating }] = useCreateExpenseMutation();
  const [editExpense, { isLoading: editing }] = useEditExpenseMutation();
  const [errorMessage, setErrorMessage] = useState("");
  
  // Fetch categories
  const { data: categories = [], isLoading: catLoading } = useGetCategoriesQuery();



  const handleSubmit = async (data) => {
    setErrorMessage("");
    
    // DEFENSIVE: Check if user exists
    if (!user) {
      setErrorMessage("User not found. Please log in again.");
      console.error(" No user in Redux state");
      return;
    }

    // DEFENSIVE: Check if user has ID
    if (!user._id) {
      setErrorMessage("User ID not found. Please log in again.");
      console.error(" User missing _id");
      return;
    }

    // DEFENSIVE: Check if currentContext exists, use default if not
    const currentContext = user.currentContext || {
      type: "solo",
      organizationId: null,
    };

    try {
      const contextData = {
        ...data,
      };

      // Add userId or organizationId based on context
      if (currentContext.type === "solo") {
        contextData.userId = user._id;
        console.log(" Submitting solo expense with userId:", user._id);
      } else if (currentContext.type === "organization") {
        // DEFENSIVE: Validate organizationId exists
        if (!currentContext.organizationId) {
          setErrorMessage(
            "Organization ID not found. Please switch contexts and try again."
          );
          console.error(" Organization context missing organizationId");
          return;
        }
        contextData.organizationId = currentContext.organizationId;

      } else {
        setErrorMessage(`Invalid context type: ${currentContext.type}`);
        console.error(" Unknown context type:", currentContext.type);
        return;
      }

      if (isEdit) {
        console.log(" Editing expense with data:", contextData);
        await editExpense({ 
          ...contextData, 
          expenseId: defaultValues._id 
        }).unwrap();
        console.log("Expense updated successfully");
      } else {
        console.log(" Creating expense with data:", contextData);
        await createExpense(contextData).unwrap();
        console.log(" Expense created successfully");
      }
      
      if (onSuccess) onSuccess();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  };

  const categoryOptions = [
    ...categories.map((cat) => ({
      value: cat._id,
      label: cat.name.charAt(0).toUpperCase() + cat.name.slice(1),
    })),
  ];

 const fields = [
  {
    name: "title",
    label: "Expense Title",
    type: "text",
    placeholder: "Enter expense title",
    validation: {
      required: "Title is required",
      minLength: { value: 3, message: "Title must be at least 3 characters" },
    },
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Describe the expense",
    validation: {
      maxLength: { value: 200, message: "Description is too long" },
    },
  },
  {
    type: "row",
    fields: [
      {
        name: "currency",
        label: "Currency",
        type: "select",
        options: [{ value: "PKR", label: "PKR" }],
        validation: { required: "Currency is required" },
        defaultValue: "PKR",
      },
      {
        name: "amount",
        label: "Amount",
        type: "number",
        placeholder: "Enter amount",
        validation: {
          required: "Amount is required",
          min: { value: 1, message: "Amount must be at least 1" },
        },
      },
    ],
  },
  {
    name: "categoryId",
    label: "Category",
    type: "select",
    options: categoryOptions,
    validation: { required: "Please select a category" },
  },
];

  // DEFENSIVE: Check if form can be rendered
  if (!user) {
    return (
      <div className="bg-gray-900 border border-red-600 rounded-xl p-6">
        <p className="text-red-400">⚠️ Please log in to create an expense</p>
      </div>
    );
  }

  const currentContext = user.currentContext || {
    type: "solo",
    organizationId: null,
  };

  return (
    <div
      className="
        bg-gray-900 border border-gray-700 rounded-xl shadow-xl 
        p-6 w-full sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl 
        mx-auto transition-all
      "
    >
      <h2 className="text-xl font-semibold text-gray-100 mb-4 text-center">
        {isEdit ? "Edit Expense" : "Create Expense"}
      </h2>
      
      {/* Display current context indicator */}
      <div className="mb-4 p-3 bg-gray-800 border border-gray-700 rounded-lg text-center">
        {currentContext.type === "solo" ? (
          <span className="text-sm text-blue-400">
            📝 Personal Expense
            <br />
          </span>
        ) : currentContext.type === "organization" ? (
          <span className="text-sm text-green-400">
            🏢 Organization Expense
            <br />
          </span>
        ) : (
          <span className="text-sm text-yellow-400">
            ⚠️ Unknown context: {currentContext.type}
          </span>
        )}
      </div>

      <Form
        fields={fields}
        onSubmit={handleSubmit}
        defaultValues={defaultValues}
        submitLabel={
          isEdit
            ? editing
              ? "Saving..."
              : "Save Changes"
            : creating
              ? "Creating..."
              : "Save Expense"
        }
        onClose={onClose}
        apiError={errorMessage}
      />
    </div>
  );
};

export default ExpenseForm;