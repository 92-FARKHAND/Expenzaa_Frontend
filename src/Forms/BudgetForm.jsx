// src/components/BudgetForm.jsx

import Form from "../components/Form.jsx";
import {
  useGetUserBudgetQuery,
  useEditBudgetMutation,
} from "../store/features/budgetApi.js";

const BudgetForm = ({ onSuccess }) => {
  const { data, isLoading } = useGetUserBudgetQuery();
  const [editBudget, { isLoading: updating }] = useEditBudgetMutation();

  // Extract budget fields
  const budget = data?.data?.budget || {};

  const defaultValues = {
    totalAmount: budget.totalAmount || "",
    startDate: budget.startDate?.slice(0, 10) || "",
    endDate: budget.endDate?.slice(0, 10) || "",
    currency: budget.currency || "PKR",
  };

  const handleSubmit = async (values) => {
    try {
      await editBudget(values).unwrap();
      console.log("✅ Budget updated successfully");

      if (onSuccess) onSuccess();
    } catch (error) {
      console.log("❌ Error updating budget:", error);
    }
  };

  const fields = [
    {
      name: "totalAmount",
      label: "Total Monthly Budget",
      type: "number",
      placeholder: "Enter your monthly budget",
      validation: {
        required: "Budget amount is required",
        min: { value: 1, message: "Amount must be at least 1" },
      },
    },

    // Currency selection (same as expense form)
    {
      name: "currency",
      label: "Currency",
      type: "select",
      options: [{ value: "PKR", label: "PKR" }],
      defaultValue: "PKR",
      validation: { required: "Currency is required" },
    },

    {
      name: "startDate",
      label: "Start Date",
      type: "date",
      validation: { required: "Start date is required" },
    },

    {
      name: "endDate",
      label: "End Date",
      type: "date",
      validation: { required: "End date is required" },
    },
  ];

  return (
    <>
      <h2 className="text-xl font-semibold text-gray-100 mb-4 text-center">
        Edit Budget
      </h2>

      <Form
        fields={fields}
        onSubmit={handleSubmit}
        defaultValues={defaultValues}
        submitLabel={updating ? "Saving..." : "Save Budget"}
      />
    </>
  );
};

export default BudgetForm;
