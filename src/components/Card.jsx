import { useState } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { X } from "lucide-react";

ChartJS.register(
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip
);

const Card = ({
  title,
  value,
  description,
  category, // ✅ new prop for category display
  chartType,
  chartData,
  color,
  image,
  children,
  className = "",
  showModal = false,
  modalContent,
  startDate,   
  endDate,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        data: chartData,
        borderColor: color,
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const doughnutData = {
    datasets: [
      {
        data: chartData,
        backgroundColor: [color, "rgba(75, 85, 99, 0.3)"],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    elements: { point: { radius: 0 } },
    scales:
      chartType === "line"
        ? { x: { display: false }, y: { display: false } }
        : {},
  };

  return (
    <>
      {/* === Card === */}
      <div
        onClick={() => showModal && setIsModalOpen(true)}
        className={`bg-gray-800/90 border border-gray-700 rounded-2xl shadow-[0_0_25px_rgba(255,255,255,0.05)] p-3 sm:p-4 flex items-center gap-3 sm:gap-4 w-full overflow-hidden transition-all duration-300 ${showModal ? "cursor-pointer hover:bg-gray-900" : ""} ${className}`}
      >
        {/* === Left: chart or image === */}
        {(chartType || image) && (
          <div
            className="flex-shrink-0 relative rounded-xl overflow-hidden
                       w-20 h-20 sm:w-24 sm:h-24 md:h-30
                       max-w-[8rem] max-h-[8rem]"
          >

            {chartType === "line" && (
              <div className="w-full h-full">
                <Line data={lineData} options={chartOptions} />
              </div>
            )}
            {chartType === "doughnut" && (
              <div className="w-full h-full">
                <Doughnut data={doughnutData} options={chartOptions} />
              </div>
            )}
            {!chartType && image && (
              <img
                src={image}
                alt={title}
                className="w-full h-full object-contain rounded-xl"
              />
            )}
          </div>
        )}

        {/* === Right: text === */}
        <div className="flex flex-col justify-center flex-1 min-w-0">
          {title && (
            <h3 className="text-sm sm:text-base font-semibold text-gray-100 truncate">
              {title}
            </h3>
          )}

          {/* ✅ Category under title */}
          {category && (
            <p className="text-xs sm:text-sm text-blue-400 truncate">
              {category}
            </p>
          )}

          {value && (
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-50 truncate">
              {value}
            </p>
          )}
          {description && (
            <p className="text-xs sm:text-sm text-gray-400 leading-tight truncate">
              {description}
            </p>
          )}

          {children && <div className="mt-2">{children}</div>}
           {startDate && endDate && (
             <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
               {startDate} → {endDate}
             </p>
            )}
        </div>
      </div>

      {/* === Optional Modal === */}
      {showModal && isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-lg w-[90%] sm:w-[480px] p-2 relative animate-fadeIn flex justify-center items-center">
            <button
              className="absolute top-3 right-3 text-gray-200 bg-red-500 rounded-md hover:text-white"
              onClick={() => setIsModalOpen(false)}
            >
              <X size={20} />
            </button>

            {modalContent ? (
              modalContent
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-gray-100 mb-1">
                  {title}
                </h3>

                {/* ✅ Category inside modal */}
                <p className="text-xs sm:text-sm text-blue-400 truncate">
                  {category ? category : "Uncategorized"}
                </p>


                {description && (
                  <p className="text-sm text-gray-400 mb-2">{description}</p>
                )}
                {value && (
                  <p className="text-sm font-medium text-teal-400">
                    {value}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Card;
