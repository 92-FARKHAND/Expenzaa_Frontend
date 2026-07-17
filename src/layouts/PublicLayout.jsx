import { Outlet } from "react-router-dom";
import { useState } from "react";
import bg from "/bg.jpg"
const PublicLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-200"
     style={{
         backgroundImage:`linear-gradient(rgba(17,17,17,0.7), rgba(17,17,17,0.7)), url(${bg})`,
      }}
    >
      {/* ===== Header ===== */}
      <header
        className="border-b border-gray-800 bg-gray-900 backdrop-blur-md sticky top-0 z-50 text-center shadow-[0_8px_30px_rgba(255,255,255,0.12)]"
      >
        <h2 className="text-4xl font-semibold tracking-wide p-2">
          Expenzaa
        </h2>
      </header>

      {/* ===== Main Content ===== */}
      <main
        className="flex-grow container mx-auto px-4 py-8 bg-cover bg-center bg-no-repeat"
      >
        <div className="w-full p-4 rounded-2xl bg-gray-900/40 shadow-[0_0_40px_rgba(255,255,255,0.15),0_0_60px_rgba(0,0,0,0.5)] transition-all duration-500">
        <Outlet />
        </div>
      </main>

      {/* ===== Footer ===== */}
      <footer className="bg-gray-900 text-center py-1 text-sm text-gray-400">
        © {new Date().getFullYear()} Expenzaa — All rights reserved.
      </footer>
    </div>
  );
};

export default PublicLayout;
