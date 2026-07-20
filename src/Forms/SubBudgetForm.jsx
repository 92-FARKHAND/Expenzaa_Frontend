import { useState } from "react";
import Form from "../components/Form.jsx";
import { useSetSubBudgetMutation } from "../store/features/subBudgetApi.js";
import { getErrorMessage } from "../utils/errorParser.js";

const SubBudgetForm = ({ category, onSuccess, onClose }) => {
  const [setSubBudget, { isLoading: isUpdating }] = useSetSubBudgetMutation();
  const [errorMessage, setErrorMessage] = useState("");

  // Use subBudget data from the parent category prop (already fetched)
  const subBudgetData = category.subBudget || {};

  const handleSubmit = async (data) => {
    setErrorMessage("");
    try {
      const payload = {
        allocatedAmount: parseFloat(data.allocatedAmount),
        currency: data.currency,
      };


      await setSubBudget({
        categoryId: category._id,
        data: payload,
      }).unwrap();

      if (onSuccess) onSuccess();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  };

  const defaultValues = {
    allocatedAmount: subBudgetData?.allocatedAmount || 0,
    currency: subBudgetData?.currency || "PKR",
  };

  const fields = [
    {
      name: "allocatedAmount",
      label: "Allocated Amount",
      type: "number",
      placeholder: "Enter allocated amount",
      validation: {
        required: "Amount is required",
        min: {
          value: 0,
          message: "Amount must be greater than 0",
        },
      },
    },
    {
      name: "currency",
      label: "Currency",
      type: "select",
      options: [{ value: "PKR", label: "PKR" }],
    },
  ];

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
      <h2 className="text-lg text-gray-100 font-semibold mb-4 text-center">
        Edit Budget for {category.name}
      </h2>
      <Form
        fields={fields}
        onSubmit={handleSubmit}
        defaultValues={defaultValues}
        submitLabel={isUpdating ? "Saving..." : "Save Changes"}
        onClose={onClose}
        apiError={errorMessage}
      />
    </div>
  );
};

export default SubBudgetForm;