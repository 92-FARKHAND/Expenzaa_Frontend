import { useState } from "react";
import { Edit3, Trash2, X } from "lucide-react";
import Card from "../../components/Card.jsx";
import ExpenseForm from "../../Forms/ExpenseForm.jsx";
import {
  useGetExpensesQuery,
  useDeleteExpenseMutation,
} from "../../store/features/expenseApi.js";
import {
  useGetCategoriesQuery
} from "../../store/features/categoryApi.js"
import Loader from "../../components/Loader.jsx";

const Expenses = () => {
  // Fetch expenses from API
  const { data: expenses = [], isLoading, isError } = useGetExpensesQuery();
  const [deleteExpense] = useDeleteExpenseMutation();

  // 🔹 For modal form state
  const [editingExpense, setEditingExpense] = useState(null);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  // ✅ Truncate long description text
  const truncateText = (text = "", limit = 70) =>
    text.length > limit ? text.substring(0, limit) + "..." : text;

  // ✅ Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await deleteExpense(id).unwrap();
        console.log("✅ Expense deleted successfully");
      } catch (err) {
        console.error("❌ Delete failed:", err);
      }
    }
  };

  if (isLoading)
    return <Loader text="Loading expenses..." />;
  if (isError)
    return (
      <p className="text-red-400 text-center mt-10">
        Failed to load expenses. Please try again.
      </p>
    );

  return (
    <div className="flex flex-col w-full gap-4 relative">
      <h2 className="text-xl font-semibold text-gray-100 mb-1">All Expenses</h2>

      {expenses.length === 0 ? (
        <p className="text-gray-500 text-center mt-4">No expenses found.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {expenses.map((expense) => {
            // 🔹 Default safe values for missing fields
            const {
              _id,
              title = "Untitled Expense",
              description = "No description provided.",
              amount = "0.00",
              currency = "$",
              image = "/src/assets/bg.jpg",
              createdAt,
              category = "Uncategorized", // from backend populate or fallback
            } = expense || {};

            const formattedDate = createdAt
              ? new Date(createdAt).toLocaleDateString()
              : "N/A";

            return (
              <Card
                key={expense._id}
                title={expense.title}
                description={truncateText(expense.description)}
                value={`${expense.currency}${expense.amount}`}
                image={expense.categoryImage}
                category={expense.category || "Uncategorized"} // ✅ Added here
                showModal={true}
                className="cursor-pointer hover:bg-gray-800/80 transition"
                modalContent={
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="w-full h-[160px] rounded-lg overflow-hidden">
                      <img
                        src={expense.categoryImage}
                        alt={title}
                        className="w-fit h-full object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-100 mb-1">
                        {title}
                      </h3>
                      <p className="text-sm text-gray-400 mb-2">
                        {description}
                      </p>

                      {/* ✅ Category Display */}
                      <p className="text-sm text-blue-400 mb-1">
                        Category: <span className="font-medium">{category}</span>
                      </p>

                      <p className="text-sm font-medium text-teal-400 mb-1">
                        Amount: {currency}
                        {amount}
                      </p>

                      <p className="text-xs text-gray-500">
                        Created At: {formattedDate}
                      </p>
                    </div>
                  </div>
                }
              >
                {/* Action buttons under description */}
                <div
                  className="flex justify-between items-center mt-1"
                  onClick={(e) => e.stopPropagation()} // prevent modal open on buttons
                >
                  <p className="text-[10px] text-gray-500">{formattedDate}</p>
                  <div className="flex gap-1">
                    {/* 🔹 EDIT BUTTON */}
                    <button
                      className="p-1.5 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition"
                      title="Edit"
                      onClick={() => {
                        setEditingExpense(expense);
                        setShowExpenseForm(true);
                      }}
                    >
                      <Edit3 size={14} />
                    </button>

                    {/* 🔹 DELETE BUTTON */}
                    <button
                      className="p-1.5 rounded-md bg-red-600/20 hover:bg-red-600/40 text-red-400 hover:text-red-300 transition"
                      title="Delete"
                      onClick={() => handleDelete(_id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ✅ Expense Form Modal (for editing) */}
      {showExpenseForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 animate-fadeIn">
          <div className="relative w-[90%] sm:w-[85%] md:w-[50%] lg:w-[40%] xl:w-[30%] max-w-4xl">
            <ExpenseForm
              mode="edit"
              defaultValues={editingExpense || {}}
              onSuccess={() => {
                setShowExpenseForm(false);
                setEditingExpense(null);
              }}
              onClose={() => {
                setShowExpenseForm(false);
                setEditingExpense(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
