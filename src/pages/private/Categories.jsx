import { useState } from "react";
import Card from "../../components/Card.jsx";
import SubBudgetForm from "../../Forms/SubBudgetForm.jsx";
import {
  useGetUserCategoriesQuery,
} from "../../store/features/categoryApi.js";

import { Pencil } from "lucide-react";

const Categories = () => {
  const { data: categories = [], isLoading, isError } = useGetUserCategoriesQuery();
  const [editingCategory, setEditingCategory] = useState(null); // Track category being edited

  const generateRandomColor = () => {
    const chars = "0123456789abcdef";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return color;
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-40 text-gray-300">
        Loading categories...
      </div>
    );

  if (isError)
    return (
      <div className="flex justify-center items-center h-40 text-gray-300">
        Failed to load categories...
      </div>
    );

  return (
    <div className="flex flex-col gap-4 w-full">
      <h2 className="text-xl font-semibold text-gray-100 mb-2">
        Insights by Category
      </h2>

      <div className="flex flex-col gap-4">
        {categories.length === 0 ? (
          <p className="text-gray-400 text-center">No categories found.</p>
        ) : (
          categories.map((category) => {
            const { _id, name, subBudget = {} } = category;

            const allocated = Number(subBudget.allocatedAmount) || 0;
            const spent = Number(subBudget.spentAmount) || 0;
            const remaining = Number(subBudget.remainingAmount) || allocated - spent;

            const doughnutData = [spent, remaining];

            return (
              <div key={_id} className="relative">
                {/* Edit Icon */}
                <button
                  onClick={() => setEditingCategory(category)} // Open the form for this category
                  className="absolute top-3 right-3 z-20 bg-gray-700 p-1 rounded-full hover:bg-gray-600 transition"
                >
                  <Pencil size={16} className="text-gray-200" />
                </button>

                {/* If this category is being edited, show the form */}
                {editingCategory?._id === _id ? (
                  <SubBudgetForm
                    category={editingCategory}
                    onSuccess={() => setEditingCategory(null)} // Close form after success
                  />
                ) : (
                  <Card
                    title={name}
                    value={`${subBudget.currency || "PKR"} ${spent}`}
                    description={
                      <>
                        Budget: {allocated} <br />
                        Remaining: {remaining}
                      </>
                    }
                    chartType="doughnut"
                    chartData={doughnutData}
                    color={generateRandomColor()}
                    className="w-full p-4 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                  >
                    <p className="text-sm text-gray-400 mt-1">
                      Used: {allocated > 0 ? ((spent / allocated) * 100).toFixed(1) : 0}%
                    </p>
                  </Card>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Categories;
