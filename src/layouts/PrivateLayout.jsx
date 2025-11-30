import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Menu, X ,User,PlusCircle } from "lucide-react";
import ExpenseForm from "../Forms/ExpenseForm.jsx";
import ProfileMenu from "../components/ProfileMenu";



const PrivateLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false); 
  const profileRefMobile = useRef(null);
  const profileRefDesktop = useRef(null);

  const navLinks = [
    { name: "Dashboard", to: "/dashboard" },
    { name: "Expenses", to: "/expenses" },
    { name: "Categories", to: "/categories" },
  ];

  // ✅ Click outside only closes mobile menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRefMobile.current && !profileRefMobile.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  return (
    <div className="h-screen flex flex-col bg-gray-900 text-gray-200 overflow-hidden">
      {/* ===== HEADER ===== */}
      <header className="relative z-30 flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900 shadow-sm">
        {/* Sidebar toggle (mobile) */}
        <button
          className="xl:hidden text-gray-300 hover:text-white transition"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
        >
          {isSidebarOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        <h1 className="text-2xl font-bold text-gray-100">Expenzaa</h1>

        {/* Profile (mobile/tablet) */}
        <div ref={profileRefMobile} className="relative xl:hidden">
          <button
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition"
          >
            <User size={22} />
          </button>
          {isProfileOpen && (
            <ProfileMenu closeMenu={() => setIsProfileOpen(false)} />
          )}
        </div>
      </header>

      {/* ===== MAIN LAYOUT ===== */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* ===== SIDEBAR ===== */}
        <aside
          className={`xl:static absolute inset-y-0 left-0 z-40 flex flex-col w-64 bg-gray-900 border-r border-gray-700
              shadow-[4px_0_20px_rgba(0,0,0,0.6)] transform transition-transform duration-300
              ${isSidebarOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0"}`}
        >
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gray-700 text-white shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                      : "text-gray-400 hover:text-gray-100 hover:bg-gray-700/60 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                  }`
                }
                onClick={() => setIsSidebarOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Profile (desktop only) */}
{/* Profile (desktop only) */}
<div
  ref={profileRefDesktop}
  className="hidden xl:block relative border-t border-gray-700 py-3 px-4 bg-gray-900"
>
  <button
    onClick={() => setIsProfileOpen((prev) => !prev)}
    className="flex items-center gap-2 text-gray-300 hover:text-white transition w-full"
  >
    <User size={20} />
    <span className="font-medium text-sm">Profile</span>
  </button>
</div>

{/* Dropdown fixed so it's not clipped */}
{isProfileOpen && (
  <div className="hidden xl:block fixed bottom-50 left-80 z[-100] cursor-pointer">
    <div className="pointer-events-auto">
    <ProfileMenu closeMenu={() => setIsProfileOpen(false)} />
      </div>
  </div>
)}
          <div className="text-xs text-gray-500 text-center py-3 border-t border-gray-700 bg-gray-900">
            © {new Date().getFullYear()} Expenzaa
          </div>
        </aside>

        {/* ===== MAIN CONTENT ===== */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 xl:p-8 rounded-2xl bg-gray-900/95 border border-gray-800 shadow-[0_0_25px_rgba(255,255,255,0.06)] transition-all duration-300 m-4">
          <Outlet />
            {/* ✅ Floating “Create Expense” Button */}
           <button
             onClick={() => setShowExpenseForm(true)}
             className="fixed bottom-8 right-10 bg-blue-600 hover:bg-blue-500 text-white rounded-full p-4 shadow-lg shadow-blue-900/40 transition-all z-50"
           >
             <PlusCircle size={28} />
           </button>
         
           {/* ✅ Expense Form Modal */}
           {showExpenseForm && (
           <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 animate-fadeIn">
             <div className="relative w-[90%] sm:w-[85%] md:w-[50%] lg:w-[40%] xl:w-[30%] max-w-4xl">
      {/* Close Button */}
      <button
        onClick={() => setShowExpenseForm(false)}
        className="absolute -top-10 right-0 text-gray-400 hover:text-white transition"
      >
        <X size={24} />
      </button>

      {/* Responsive Expense Form */}
      <ExpenseForm
        onSuccess={() => {
       setShowExpenseForm(false);   // ✅ closes the modal
      }}
      />
             </div>
           </div>
            )}
         </main>
      </div>
    </div>
  );
};

export default PrivateLayout;
