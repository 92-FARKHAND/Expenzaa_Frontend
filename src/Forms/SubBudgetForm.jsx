// src/components/SubBudgetForm.jsx
import Form from "../components/Form.jsx";
import {
  useGetSubBudgetQuery,
  useSetSubBudgetMutation,
} from "../store/features/subBudgetApi.js";

const SubBudgetForm = ({ category, onSuccess }) => {
  const { data: subBudget, isLoading: isFetching } = useGetSubBudgetQuery(category._id);
  const [setSubBudget, { isLoading: isUpdating }] = useSetSubBudgetMutation();
  
  const handleSubmit = async (data) => {
    try {
      // Convert allocatedAmount to number before sending
      const payload = {
        allocatedAmount: parseFloat(data.allocatedAmount),
        currency: data.currency,
      };
      
      console.log("Sending payload:", payload);
      console.log("Current subBudget:", subBudget);
      
      await setSubBudget({
        categoryId: category._id,
        data: payload,
      }).unwrap();
      
      console.log("✅ Subbudget updated");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("❌ Error updating subbudget:", error);
      // Log the full error details
      console.error("Error details:", error?.data || error?.message);
    }
  };
  
  const fields = [
    {
      name: "allocatedAmount",
      label: "Allocated Amount",
      type: "number",
      placeholder: "Enter allocated amount",
      defaultValue: subBudget?.data?.allocatedAmount || 0,
    },
    {
      name: "currency",
      label: "Currency",
      type: "select",
      options: [{ value: "PKR", label: "PKR" }],
      defaultValue: subBudget?.data?.currency || "PKR",
    },
  ];
  
  if (isFetching) return <p>Loading sub-budget...</p>;
  
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
      <h2 className="text-lg text-gray-100 font-semibold mb-4 text-center">
        Edit Budget for {category.name}
      </h2>
      <Form
        fields={fields}
        onSubmit={handleSubmit}
        submitLabel={isUpdating ? "Saving..." : "Save Changes"}
      />
    </div>
  );
};

export default SubBudgetForm;