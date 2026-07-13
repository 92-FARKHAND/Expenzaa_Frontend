import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout.jsx";
import PrivateLayout from "./layouts/PrivateLayout.jsx";
import AuthForm from "./pages/public/AuthForm.jsx";
import Dashboard from "./pages/private/Dashborad.jsx";
import Expenses from "./pages/private/Expenses.jsx";
import Profile from "./pages/private/Profile.jsx";
import AuthInitializer from "./components/AuthInitializer.jsx";
import Categories from "./pages/private/Categories.jsx";
import WelcomePage from "./pages/public/WelcomePage.jsx";
import Organization from "./pages/private/Organization.jsx";

function App() {
  return (
    <Routes>
      {/* ------------------ Public Routes ------------------ */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<WelcomePage/>}/>
        <Route path="/login" element={<AuthForm />} />
        <Route path="/signup" element={<AuthForm />} />
      </Route>

      {/* ------------------ Private Routes ------------------ */}
      <Route
        element={
          <AuthInitializer>
            <PrivateLayout />
          </AuthInitializer>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/organization" element={<Organization />} />
      </Route>

      {/* ------------------ Fallback ------------------ */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
