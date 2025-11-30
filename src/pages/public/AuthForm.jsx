import { useState, useEffect } from "react";
import Form from "../../components/Form.jsx";
import { useForm } from "react-hook-form";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  useLoginMutation,
  useSignupMutation,
  useLazyGetProfileQuery,
} from "../../store/features/auth/authApi.js";

const AuthForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reset } = useForm();

  const [errorMessage, setErrorMessage] = useState("");
  const isSignUp = location.pathname.includes("signup");

  // RTK Query hooks
  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [signup, { isLoading: signupLoading }] = useSignupMutation();

  // Automatically check if user is logged in (from cookie)
  const [triggerGetProfile,{ data: user, isSuccess, isFetching }] = useLazyGetProfileQuery();

 
// ✅ navigate automatically when user data appears
useEffect(() => {
  if (isSuccess && user) {
    navigate("/dashboard");
  }
}, [isSuccess, user, navigate]);

 

  const fields = isSignUp
    ? [
        { name: "email", label: "Email", type: "email", placeholder: "Enter email", validation: { required: "Email is required" } },
        { name: "fullName", label: "Full Name", placeholder: "Enter full name", validation: { required: "Full name is required" } },
        { name: "username", label: "Username", placeholder: "Enter username", validation: { required: "Username is required" } },
        { name: "password", label: "Password", type: "password", placeholder: "Enter password", validation: { required: "Password is required" } },
        { name: "avatar", label: "Avatar (optional)", type: "file" },
      ]
    : [
        { name: "username", label: "Username", placeholder: "Enter username", validation: { required: "Username is required" } },
        { name: "password", label: "Password", type: "password", placeholder: "Enter password", validation: { required: "Password is required" } },
      ];

  const handleSubmit = async (data) => {
    setErrorMessage("");

    try {
      if (isSignUp) {
        const formData = new FormData();
        formData.append("username", data.username);
        formData.append("email", data.email);
        formData.append("fullName", data.fullName);
        formData.append("password", data.password);
        if (data.avatar?.[0]) formData.append("avatar", data.avatar[0]);

        await signup(formData).unwrap();
      } else {
        await login({
          username: data.username,
          password: data.password,
        }).unwrap();
      }
      triggerGetProfile();
      reset();
    } catch (err) {
      console.error("Auth error:", err);
      const msg =
        err?.data?.message ||
        err?.error ||
        "An unexpected error occurred. Please try again.";
      setErrorMessage(msg);
    }
  };

  const isLoading = loginLoading || signupLoading || isFetching;

  return (
  <div
    className="
      w-full max-w-sm mx-auto 
      p-4 sm:p-6 
      bg-gray-900 text-white 
      rounded-xl 
      shadow-[0_0_25px_rgba(255,255,255,0.1)]
      overflow-hidden
    "
  >
    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">
      {isSignUp ? "Sign Up" : "Sign In"}
    </h2>

    {errorMessage && (
      <div className="text-red-500 text-sm bg-red-100/10 p-2 rounded text-center mb-3">
        {errorMessage}
      </div>
    )}

    <Form
      fields={fields}
      onSubmit={handleSubmit}
      submitLabel={
        isSignUp
          ? isLoading
            ? "Signing Up..."
            : "Sign Up"
          : isLoading
          ? "Signing In..."
          : "Sign In"
      }
    />

    <p className="mt-4 text-center text-gray-400 text-sm">
      {isSignUp ? (
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-gray-200 hover:text-white">
            Sign in
          </Link>
        </>
      ) : (
        <>
          Don’t have an account?{" "}
          <Link to="/signup" className="text-gray-200 hover:text-white">
            Create new account
          </Link>
        </>
      )}
    </p>
  </div>
);

};

export default AuthForm;
