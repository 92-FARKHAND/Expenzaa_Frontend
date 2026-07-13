import { useState } from "react";
import Card from "./Card";
import { useGetBudgetQuery } from "../store/features/budgetApi.js";
import { Edit } from "lucide-react";
import BudgetForm from "../Forms/BudgetForm.jsx";

const SummaryCards = () => {
  const { data, isLoading } = useGetBudgetQuery();
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  const budget = data?.data?.budget || {};

  // Format ISO date to YYYY-MM-DD
  const formatDate = (iso) => {
    if (!iso) return "Not Set";
    return iso.split("T")[0];
  };

  const total = Number(budget.totalAmount || 0);
  const spent = Number(budget.spentAmount || 0);
  const remaining = Number(budget.remainingAmount || 0);
  const percentage = total ? (spent / total) * 100 : 0;

  return (
    <>
      <div className="flex flex-wrap gap-2 justify-center items-center">

        {/* ===== First Card with Edit Icon + Dates ===== */}
        <div className="w-full sm:w-[48%] lg:w-[32%] relative">

          {/* --- Edit Icon --- */}
          <button
            onClick={() => setIsBudgetModalOpen(true)}
            className="absolute top-2 right-2 z-10 bg-gray-900/70 backdrop-blur-sm 
                       p-1.5 rounded-full border border-gray-700 hover:bg-gray-700 transition"
          >
            <Edit size={16} className="text-gray-200" />
          </button>

          <Card
            title="Total Budget"
            value={`${total}`}
            description="Current monthly limit"
            chartType="line"
            chartData={[1200, 1350, 1500, 1450, 1600]}
            color="#22d3ee"
            startDate={formatDate(budget.startDate)}
            endDate={formatDate(budget.endDate)}
          />
        </div>

        {/* ===== 2nd Card ===== */}
        <div className="w-full sm:w-[48%] lg:w-[32%]">
          <Card
            title="Expenses Used"
            value={`${spent}`}
            description={`${percentage.toFixed(2)}% of your budget spent`}
            chartType="doughnut"
            chartData={[spent, remaining]}
            color="#f87171"
          />
        </div>

        {/* ===== 3rd Card ===== */}
        <div className="w-full sm:w-[48%] lg:w-[32%]">
          <Card
            title="Savings Goal"
            value={`${remaining}`}
            description="Remaining balance"
            chartType="none"
            image="/src/assets/bg.jpg"
          />
        </div>
      </div>

      {/* ===== Budget Form Modal ===== */}
      {isBudgetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-lg w-[90%] sm:w-[480px] p-4 relative animate-fadeIn">
            <BudgetForm
              onSuccess={() => setIsBudgetModalOpen(false)}
              onClose={() => setIsBudgetModalOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default SummaryCards;
