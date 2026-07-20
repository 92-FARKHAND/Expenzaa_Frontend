import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout.jsx";
import PrivateLayout from "./layouts/PrivateLayout.jsx";
import AuthForm from "./pages/public/AuthForm.jsx";
import Dashboard from "./pages/private/Dashboard.jsx";
import Expenses from "./pages/private/Expenses.jsx";
import Profile from "./pages/private/Profile.jsx";
import Categories from "./pages/private/Categories.jsx";
import WelcomePage from "./pages/public/WelcomePage.jsx";
import Organization from "./pages/private/Organization.jsx";
import AuthInitializer from "./components/AuthInitializer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import NotFound from "./pages/public/NotFound.jsx"

function App() {
  
  return (
<Routes>

  {/* Authentication check runs once */}
  <Route element={<AuthInitializer />}>

    {/* ------------------ Public Routes ------------------ */}
    <Route element={<PublicLayout />}>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<AuthForm />} />
      <Route path="/signup" element={<AuthForm />} />
    </Route>


    {/* ------------------ Private Routes ------------------ */}
    {/* <Route element={<ProtectedRoute />}> */}
      <Route element={<PrivateLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/organization" element={<Organization />} />
      </Route>
    {/* </Route> */}


    {/* ------------------ Fallback ------------------ */}
    <Route path="*" element={<NotFound />} />

  </Route>

</Routes>
  );
}

export default App;
