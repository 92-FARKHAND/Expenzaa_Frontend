import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import CategoryForm from "../../Forms/CategoryFrom.jsx";
import Card from "../../components/Card.jsx";
import SubBudgetForm from "../../Forms/SubBudgetForm.jsx";
import {
  useGetCategoriesQuery,
  useDeleteCategoryMutation
} from "../../store/features/categoryApi.js";

import { Pencil } from "lucide-react";

const Categories = () => {
  const [showCategoryForm, setShowCategoryForm] = useState(false);
const { data: categories = [], isLoading, isError } =
  useGetCategoriesQuery();
const [deleteCategory, { isLoading: isDeleting }] =
  useDeleteCategoryMutation();
    const [editingCategory, setEditingCategory] = useState(null); // Track category being edited

  const generateRandomColor = () => {
    const chars = "0123456789abcdef";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return color;
  };

  //Delete Category
 const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this category?"
  );

  if (!confirmDelete) return;
  try {
    await deleteCategory(id).unwrap();
    alert("Category deleted successfully.");
  } catch (error) {
    console.error(error);
    alert("Failed to delete category.");
  }
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
          <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-gray-100">
        Insights by Category
      </h2>

      <button
        onClick={() => setShowCategoryForm(!showCategoryForm)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
      >
        <Plus size={18} />
        Create Category
      </button>
    </div>


      {showCategoryForm && (
      <CategoryForm
        onSuccess={() => {
          setShowCategoryForm(false);
        }}
        onClose={() => setShowCategoryForm(false)}
      />
    )}

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
                <div className="absolute top-2 right-2 z-20 flex gap-2">
                  {!category.isGeneral && (
  <button
    onClick={() => handleDelete(_id)}
    className="bg-red-600 p-2 rounded-full hover:bg-red-700"
    title="Delete Category"
  >
    <Trash2 size={13} className="text-white" />
  </button>
)}
                 
                   
                   {/* Edit */}
                   <button
                     onClick={() => setEditingCategory(category)}
                     className="bg-blue-600 p-2 rounded-full hover:bg-blue-700 transition"
                     title="Edit Category"
                   >
                     <Pencil size={13} className="text-white" />
                   </button>
                 
                 </div>

                {/* If this category is being edited, show the form */}
                {editingCategory?._id === _id ? (
                  <SubBudgetForm
                    category={editingCategory}
                    onSuccess={() => setEditingCategory(null)} // Close form after success
                    onClose={() => setEditingCategory(null)} // Close form on X click
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
