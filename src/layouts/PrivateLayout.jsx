import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Menu,
  X,
  User,
  PlusCircle,
  ChevronDown,
  Loader,
} from "lucide-react";

import { getErrorMessage } from "../utils/errorParser.js";
import ExpenseForm from "../Forms/ExpenseForm.jsx";
import OrgForm from "../Forms/CreateOrgForm.jsx";
import ProfileMenu from "../components/ProfileMenu";

import {
  useGetUserOrganizationsQuery,
} from "../store/features/organizationApi.js";

import { useLazyExportExpensesQuery } from "../store/features/expenseApi.js";

import {
  selectUser,
} from "../store/features/auth/authSlice.js";

import { useSwitchContextMutation } from "../store/features/auth/authApi.js";


const PrivateLayout = () => {

  const navigate = useNavigate();


  // ========================
  // 🔹 LOCAL STATE
  // ========================

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const [showCreateOrgForm, setShowCreateOrgForm] = useState(false);


  const profileRef = useRef(null);
  const orgDropdownRef = useRef(null);


  // ========================
  // 🔹 ORGANIZATIONS
  // ========================

  console.log(
 "PRIVATE LAYOUT MOUNTED"
);
  const {
    data: orgsResponse,
    isLoading: orgsLoading,
  } = useGetUserOrganizationsQuery(
  );


  const organizations = orgsResponse?.data || [];

  console.log(organizations);
  

  // ========================
  // 🔹 USER CONTEXT
  // ========================

  const {currentContext} = useSelector(selectUser);


  const [
    switchContext,
    {
      isLoading: isSwitching
    }
  ] = useSwitchContextMutation();



  const handleSwitchContext = async (e, organizationId) => {

    e.stopPropagation();

    try {

      if (organizationId) {
        await switchContext({
          organizationId
        }).unwrap();

      } else {

        await switchContext({}).unwrap();

      }

    } catch(err) {

      console.error(
        "Failed to switch context:",
        getErrorMessage(err)
      );

    }

  };



  // ========================
  // 🔹 CLOSE MENUS
  // ========================

  useEffect(() => {

    const handleClickOutside = (e) => {

      if (
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setIsProfileOpen(false);
      }


      if (
        orgDropdownRef.current &&
        !orgDropdownRef.current.contains(e.target)
      ) {
        setIsOrgDropdownOpen(false);
      }

    };


    document.addEventListener(
      "mousedown",
      handleClickOutside
    );


    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );


  }, []);



  // ========================
  // 🔹 NAVIGATION
  // ========================

  const handleOrgClick = (organizationId) => {

    navigate(`/organization?id=${organizationId}`);

    setIsOrgDropdownOpen(false);
    setIsSidebarOpen(false);

  };



  // ========================
  // 🔹 EXPORT
  // ========================

  const [
    triggerExport,
    {
      isLoading: exportLoading
    }
  ] = useLazyExportExpensesQuery();



  const handleExport = async () => {

    await triggerExport().unwrap();

  };



  // ========================
  // 🔹 NAV LINKS
  // ========================

  const navLinks = [
    {
      name: "Dashboard",
      to: "/dashboard"
    },
    {
      name: "Expenses",
      to: "/expenses"
    },
    {
      name: "Categories",
      to: "/categories"
    },
  ];



  // ========================
  // 🔹 RENDER
  // ========================


  return (
    <div className="h-screen flex flex-col bg-gray-900 text-gray-200 overflow-hidden">
      {/* ==================== HEADER ==================== */}
      <header className="relative z-30 flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900 shadow-sm">
        {/* Hamburger Menu Button */}
        <button
          className="xl:hidden text-gray-300 hover:text-white transition"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
        >
          {isSidebarOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Logo */}
        <h1 className="text-2xl font-bold text-gray-100">Expenzaa</h1>

        {/* Profile Button */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition"
          >
            <User size={22} />
            <span className="hidden xl:inline font-medium">Profile</span>
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 z-50">
              <ProfileMenu closeMenu={() => setIsProfileOpen(false)} />
            </div>
          )}
        </div>
      </header>

      {/* ==================== MAIN LAYOUT ==================== */}
      <div className="flex flex-1 relative overflow-hidden">
        
        {/* ==================== SIDEBAR ==================== */}
        <aside
          className={`xl:static absolute inset-y-0 left-0 z-40 flex flex-col w-64 bg-gray-900 border-r border-gray-700
            shadow-[4px_0_20px_rgba(0,0,0,0.6)] transform transition-transform duration-300
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0"}`}
        >
          <nav className="flex-1 overflow-y-hidden px-4 py-6 space-y-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
            
            {/* Navigation Links */}
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
<button
  onClick={handleExport}
  className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-200 cursor-pointer"
>
  Export CSV
</button>            {/* ==================== ORGANIZATION DROPDOWN ==================== */}
            <div ref={orgDropdownRef} className="mt-6 relative border-t border-gray-700 pt-6">
              {(() => {
                const currentOrg = organizations.find((org) => org._id === currentContext?.organizationId);
                const displayContextName =
                  currentContext?.type === "organization" && currentOrg
                    ? `Org: ${currentOrg.name}`
                    : "Solo Mode";

                return (
                  <div className="px-4 py-3 rounded-lg bg-gray-800  hover:bg-gray-700">
                  <button
                    onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
                    className="w-full flex items-center justify-between text-gray-100 font-medium transition-all duration-200"
                  >
                    <div className="text-[9px] truncate flex flex-row justify-between font-semibold">
                      <span className="text-gray-400 uppercase">Current Context</span>
                      <span className="ml-2 uppercase text-emerald-400 truncate max-w-[150px]">
                        {displayContextName}
                      </span>
                    </div>
                    <ChevronDown 
                      size={16} 
                      className={`transition-transform duration-200 ${
                        isOrgDropdownOpen ? "rotate-0" : "rotate-180"
                      }`}
                    />
                  </button>
                  <span className="text-white">Organization</span>
                  </div>
                );
              })()}

              {/* Organization Dropdown Menu */}
              {isOrgDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto h-30">
                  {orgsLoading ? (
                    <div className="px-4 py-3 text-gray-400 text-sm text-center flex items-center justify-center gap-2">
                      <Loader size={16} className="animate-spin" />
                      Loading...
                    </div>
                  ) : (
                    <>
                                          {/* Create Organization Button */}
                      <div className="p-2 border-t border-gray-700 bg-gray-900/40">
                        <button
                          onClick={() => {
                            setShowCreateOrgForm(true);
                            setIsOrgDropdownOpen(false);
                          }}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-white text-xs font-semibold border border-blue-500/25 transition-all cursor-pointer"
                        >
                          <PlusCircle size={14} />
                          Create Organization
                        </button>
                      </div>
                      {organizations.length > 0 ? (
                        organizations.map((organization) => {
                          const isCurrentOrgContext =
                            currentContext?.type === "organization" &&
                            currentContext?.organizationId === organization._id;

                          return (
                            <div
                              key={organization._id}
                              className="flex items-center justify-between px-4 py-3 hover:bg-gray-700/50 transition-colors border-b border-gray-700 last:border-b-0 text-sm text-gray-300"
                            >
                              <button
                                onClick={() => handleOrgClick(organization._id)}
                                className="flex-1 text-left hover:text-white transition-colors focus:outline-none pr-2"
                              >
                                <div className="font-medium text-gray-200 truncate max-w-[120px]" title={organization.name}>
                                  {organization.name}
                                </div>
                              </button>

                              {/* Context Switch Button */}
                              {organization.status === "invited" ? (
                                <span className="px-2 py-1 rounded text-xs font-semibold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                                  Invited
                                </span>
                              ) : (
                                <button
                                  onClick={(e) => handleSwitchContext(e, isCurrentOrgContext ? null : organization._id)}
                                  disabled={isSwitching}
                                  className={`px-2 py-1 rounded text-xs font-semibold border transition-all duration-200 hover:scale-105 active:scale-95 ${
                                    isCurrentOrgContext
                                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30 hover:border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                                      : "bg-blue-600/10 text-blue-400 border-blue-500/20 hover:bg-blue-600/20 hover:border-blue-500/40"
                                  }`}
                                >
                                  {isCurrentOrgContext ? "Go Solo" : "Switch"}
                                </button>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <div className="px-4 py-3 text-gray-400 text-sm text-center">
                          No organizations
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </nav>

          {/* Sidebar Footer */}
          <div className="text-xs text-gray-500 text-center py-3 border-t border-gray-700 bg-gray-900">
            © {new Date().getFullYear()} Expenzaa
          </div>
        </aside>

        {/* ==================== MAIN CONTENT ==================== */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 xl:p-8 rounded-2xl bg-gray-900/95 border border-gray-800 shadow-[0_0_25px_rgba(255,255,255,0.06)] transition-all duration-300 m-4">
          {/* Page Content */}
          <Outlet />

          {/* ==================== FLOATING CREATE EXPENSE BUTTON ==================== */}
          <button
            onClick={() => setShowExpenseForm(true)}
            className="fixed bottom-8 right-10 bg-blue-600 hover:bg-blue-500 text-white rounded-full p-4 shadow-lg shadow-blue-900/40 transition-all z-50 hover:scale-110"
          >
            <PlusCircle size={28} />
          </button>

          {/* ==================== EXPENSE FORM MODAL ==================== */}
          {showExpenseForm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 animate-fadeIn">
              <div className="relative w-[90%] sm:w-[85%] md:w-[50%] lg:w-[40%] xl:w-[30%] max-w-4xl">
                <ExpenseForm
                  onSuccess={() => setShowExpenseForm(false)}
                  onClose={() => setShowExpenseForm(false)}
                />
              </div>
            </div>
          )}

          {/* ==================== CREATE ORGANIZATION MODAL ==================== */}
          {showCreateOrgForm && (
  <OrgForm
    onClose={() => setShowCreateOrgForm(false)}
    onSuccess={() => {
      setShowCreateOrgForm(false);
    }}
  />
)}
        </main>
      </div>
    </div>

  );
};


export default PrivateLayout;

