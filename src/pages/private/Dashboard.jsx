import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";
import Card from "../../components/Card.jsx";
import { Edit3, Trash2 } from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import SummaryCards from "../../components/SummaryCards.jsx";
import { useGetExpensesQuery,useGetMonthlyExpensesQuery } from "../../store/features/expenseApi.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Dashboard = () => {
  // 🔹 Redux placeholder (replace with your slice later)
  const { data: expenses = [], isLoading, isError } = useGetExpensesQuery();
  const { data: expensesMon = [] } = useGetMonthlyExpensesQuery();
  const visibleExpenses = expenses.slice(0, 3);
console.log("Dashboard");

const chartData = expensesMon.map((expense)=>{return expense.amount;})
  // 🔹 Chart Data
  const monthlyExpenseData = {
    labels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
    datasets: [
      {
        label: "Expenses ($)",
        data: chartData,
        backgroundColor: "rgba(248, 113, 113, 0.7)",
        borderRadius: 6,
      },
    ],
  };

  const monthlyExpenseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: "#d1d5db", font: { size: 11 } },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#9ca3af", font: { size: 11 } },
        grid: { color: "rgba(75, 85, 99, 0.15)" },
      },
    },
    plugins: {
      legend: { labels: { color: "#d1d5db", font: { size: 11 } } },
    },
  };

  return (
    <div className="flex flex-col justify-between min-h-[calc(100vh-4rem)] max-w-[1300px] mx-auto px-3 sm:px-6 lg:px-8 space-y-4">
      <SummaryCards/>
      {/* ===== 2. Monthly Expense Chart ===== */}
      <div className="bg-gray-800/90 border border-gray-700 rounded-2xl p-4 shadow-[0_0_20px_rgba(255,255,255,0.05)] flex-shrink-0">
        <h2 className="text-lg font-semibold text-gray-100 mb-3">
          Monthly Expense Overview
        </h2>
        <div className="h-56 sm:h-64 w-full">
          <Bar data={monthlyExpenseData} options={monthlyExpenseOptions} />
        </div>
      </div>

      {/* ===== 3. Recent Expenses ===== */}
      <div className="relative flex-shrink-0 mb-4">
        <h2 className="text-lg font-semibold text-gray-100 mb-3">
          Recent Expenses
        </h2>

        <div className="flex flex-wrap gap-3 justify-start">
          {visibleExpenses.length > 0 ? (
  visibleExpenses.map((expense) => (
    <div
      key={expense._id}
      className="w-full sm:w-[48%] lg:w-[31%] bg-gray-800/70 border border-gray-700 rounded-xl shadow-sm 
                 hover:shadow-[0_0_25px_rgba(255,255,255,0.08)] transition-all duration-300 
                 p-3 flex items-center gap-3 h-[90px]"
    >
      {/* Image */}
      <img
        src={expense.categoryImage}
        alt={expense.title}
        className="w-14 h-14 rounded-lg object-cover border border-gray-700 flex-shrink-0"
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-gray-100 truncate">
          {expense.title}
        </h3>
        <p className="text-xs text-gray-400 truncate">
          {expense.description}
        </p>
        <p className="text-sm text-teal-400 font-medium mt-0.5">
          {expense.amount}
        </p>
      </div>
    </div>
  ))
) : (
  <div className="w-full flex justify-center items-center py-10">
    <p className="text-gray-400 text-lg">
      No expenses found.
    </p>
  </div>
)}
        </div>

        {/* ===== See More Button ===== */}
        {expenses.length > 3 && (
          <div className="flex justify-center mt-6">
            <Link
              to="/expenses"
              className="inline-flex items-center justify-center px-6 py-2 rounded-lg text-sm font-medium
                         text-gray-100 border border-gray-700 bg-gray-800/60 
                         hover:bg-gray-700/70 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] 
                         transition-all duration-300"
            >
              See More →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
