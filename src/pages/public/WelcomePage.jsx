// src/pages/public/Welcome.jsx
import React from "react";
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <main className="min-h-screen w-full p-2 text-gray-100">

      {/* ===================== HERO SECTION (Flex) ===================== */}
      <div
        className="max-w-6xl mx-auto flex flex-wrap md:flex-nowrap items-center justify-between gap-10"
      >
        {/* -------- LEFT HERO TEXT -------- */}
        <div className="flex-1 min-w-[280px]">
          <h1 className="text-2xl  md:text-5xl font-extrabold leading-tight mb-4">
            Expenzaa — Smart Role-Based Expense Tracking
          </h1>

          <p className="text-gray-400 text-sm sm:text-base max-w-xl mb-6">
            Manage personal and organizational expenses in one secure dashboard.
            Track budgets, categories, reports, and insights with real-time data
            visualization—built for users and admins.
          </p>

          <div className="flex gap-3">
            <Link
              to="/login"
              className="px-5 py-2.5 bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-700 transition"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="px-5 py-2.5 bg-white text-gray-900 rounded-xl hover:bg-gray-200 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* -------- RIGHT MOCKUP -------- */}
        <div
          className="flex-1 min-w-[280px] bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-xl"
        >
            <div className="flex items-center justify-between text-gray-200 mb-3">
              <div>
                <p className="text-xs text-gray-400">Dashboard</p>
                <h3 className="text-lg font-semibold">Organization Insights</h3>
              </div>
              <p className="text-xs text-gray-400">Acme Inc.</p>
            </div>

            {/* Mock chart + stats */}
            <div className="space-y-3">
              <div className="h-28 bg-gray-700/40 border border-gray-700 rounded-lg flex items-center justify-center">
                <p className="text-gray-300 text-sm">Chart.js Preview</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800/70 rounded-lg p-3 border border-gray-700">
                  <p className="text-xs text-gray-400">Budget</p>
                  <p className="text-gray-100 font-semibold mt-1">Remaining: $1,250</p>
                  <p className="text-xs text-gray-500">Limit: $5,000</p>
                </div>

                <div className="bg-gray-800/70 rounded-lg p-3 border border-gray-700">
                  <p className="text-xs text-gray-400">Top Category</p>
                  <p className="text-gray-100 font-semibold mt-1">Travel</p>
                  <p className="text-xs text-gray-500">23% of spend</p>
                </div>
              </div>

              <div className="flex gap-3 mt-1">
                <button className="flex-1 px-3 py-2 text-sm border border-gray-600 rounded-md hover:bg-gray-700 transition">
                  Explore Features
                </button>
                <button className="flex-1 px-3 py-2 text-sm bg-indigo-600 rounded-md hover:bg-indigo-500 transition">
                  Pricing
                </button>
              </div>
            </div>
        </div>
      </div>

      {/* ===================== CONTENT BELOW HERO (CENTERED) ===================== */}
      <div className="max-w-4xl mx-auto mt-16 text-center">

        <h2 className="text-2xl font-bold mb-4">Why Choose Expenzaa?</h2>

        <p className="text-gray-400 max-w-2xl mx-auto mb-8">
          Built for individuals, teams, and organizations. Enjoy secure access,
          smart budgeting, analytics, and seamless switching between solo and
          organization mode.
        </p>

        {/* Feature Cards Section */}
        <div className="flex flex-wrap justify-center gap-6 mt-8">

          <div className="w-full sm:w-[45%] md:w-[30%] bg-gray-900 border-2 border-gray-700 p-5 rounded-xl">
            <h3 className="font-semibold text-lg mb-2">Role-Based Control</h3>
            <p className="text-gray-400 text-sm">
              Admins manage the organization, users track personal & shared expenses.
            </p>
          </div>

          <div className="w-full sm:w-[45%] md:w-[30%] bg-gray-900 border-2 border-gray-700 p-5 rounded-xl">
            <h3 className="font-semibold text-lg mb-2">Smart Budgets</h3>
            <p className="text-gray-400 text-sm">
              Automatic budget creation + alerts when spending increases.
            </p>
          </div>

          <div className="w-full sm:w-[45%] md:w-[30%] bg-gray-900 border-2 border-gray-700 p-5 rounded-xl">
            <h3 className="font-semibold text-lg mb-2">Advanced Insights</h3>
            <p className="text-gray-400 text-sm">
              View charts, category breakdowns, and spending comparisons.
            </p>
          </div>
        </div>
      </div>

    </main>
  );
};

export default Welcome;
