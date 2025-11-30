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

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Dashboard = () => {
  // 🔹 Redux placeholder (replace with your slice later)
  // const { budgets, expenses } = useSelector((state) => state.finance);

  const recentExpenses = [
    {
      id: 1,
      title: "Groceries",
      description: "Walmart - Weekly grocery run",
      amount: "$120.50",
      createdAt: "2025-10-10",
      image: "/src/assets/bg.jpg",
    },
    {
      id: 2,
      title: "Internet Bill",
      description: "Fiber 200 Mbps monthly plan",
      amount: "$45.00",
      createdAt: "2025-10-09",
      image: "/src/assets/bg.jpg",
    },
    {
      id: 3,
      title: "Electricity",
      description: "October usage",
      amount: "$85.30",
      createdAt: "2025-10-07",
      image: "/src/assets/bg.jpg",
    },
    {
      id: 4,
      title: "Transport",
      description: "Uber rides this week",
      amount: "$40.20",
      createdAt: "2025-10-05",
      image: "/src/assets/bg.jpg",
    },
  ];

  const visibleExpenses = recentExpenses.slice(0, 3);

  // 🔹 Chart Data
  const monthlyExpenseData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
    datasets: [
      {
        label: "Expenses ($)",
        data: [500, 700, 800, 650, 900, 750, 820, 870, 920, 880],
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
          {visibleExpenses.map((expense) => (
            <div
              key={expense.id}
              className="w-full sm:w-[48%] lg:w-[31%] bg-gray-800/70 border border-gray-700 rounded-xl shadow-sm 
                         hover:shadow-[0_0_25px_rgba(255,255,255,0.08)] transition-all duration-300 
                         p-3 flex items-center gap-3 h-[90px]"
            >
              {/* Image */}
              <img
                src={expense.image}
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

              {/* Actions */}
              <div className="flex flex-col items-end gap-1">
                <p className="text-[10px] text-gray-500">{expense.createdAt}</p>
                <div className="flex gap-1">
                  <button
                    className="p-1.5 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white"
                    title="Edit"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    className="p-1.5 rounded-md bg-red-600/20 hover:bg-red-600/40 text-red-400 hover:text-red-300"
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ===== See More Button ===== */}
        {recentExpenses.length > 3 && (
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
