// src/components/ExpenseForm.jsx
import Form from "../components/Form.jsx";
import {
  useCreateExpenseMutation,
  useEditExpenseMutation,
} from "../store/features/expenseApi.js";
import {
  useGetUserCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
} from "../store/features/categoryApi.js";

const ExpenseForm = ({ defaultValues = {}, mode, onSuccess }) => {
  const isEdit = mode === "edit" || !!defaultValues?._id;

  const [createExpense, { isLoading: creating }] = useCreateExpenseMutation();
  const [editExpense, { isLoading: editing }] = useEditExpenseMutation();

  // Fetch categories
  const { data: categories = [], isLoading: catLoading } = useGetUserCategoriesQuery();

  const handleSubmit = async (data) => {
    try {
      if (isEdit) {
        console.log(data);
        await editExpense({ ...data, expenseId: defaultValues._id }).unwrap();
        console.log("✅ Expense updated successfully");
      } else {
        console.log(data);
        await createExpense(data).unwrap();
        console.log("✅ Expense created successfully");
      }
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("❌ Error submitting expense:", error);
    }
  };

  const categoryOptions = [
    ...categories.map((cat) => ({
      value: cat._id,
      label: cat.name.charAt(0).toUpperCase() + cat.name.slice(1),
    })),
    { value: "__create__", label: "+ Create new category" }, // ✅ extra "create" option
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
      placeholder: "Describe the expense (optional)",
      validation: {
        maxLength: { value: 200, message: "Description is too long" },
      },
    },
    {
      name: "categoryId",
      label: "Category",
      type: "select",
      options: categoryOptions,
      validation: { required: "Please select a category" },
    },
    // ✅ New Currency Field
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
  ];

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
      />
    </div>
  );
};

export default ExpenseForm;
