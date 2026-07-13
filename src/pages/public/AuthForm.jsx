import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { AlertCircle, LogIn, UserPlus, Loader } from "lucide-react";
import Form from "../../components/Form.jsx";
import {
  useLoginMutation,
  useSignupMutation,
} from "../../store/features/auth/authApi.js";
import { selectIsAuthenticated } from "../../store/features/auth/authSlice.js";
import { useEffect } from "react";
import { getErrorMessage } from "../../utils/errorParser.js";

const AuthForm = () => {
  // ========================
  // 🔹 ROUTING & NAVIGATION
  // ========================
  const navigate = useNavigate();
  const location = useLocation();
  const isSignUp = location.pathname.includes("signup");

  // ========================
  // 🔹 REDUX STATE
  // ========================
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // ========================
  // 🔹 FORM & MUTATIONS
  // ========================
  const { reset } = useForm();
  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [signup, { isLoading: signupLoading }] = useSignupMutation();

  // ========================
  // 🔹 LOCAL STATE
  // ========================
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // ========================
  // 🔹 REDIRECT IF ALREADY AUTHENTICATED
  // ========================
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // ========================
  // 🔹 FORM FIELDS CONFIG
  // ========================
  const fields = isSignUp
    ? [
        // ── Email ──────────────────────────────────────────
        {
          name: "email",
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
          validation: {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Please enter a valid email address",
            },
            maxLength: {
              value: 100,
              message: "Email must be under 100 characters",
            },
          },
        },
        // ── Full Name ──────────────────────────────────────
        {
          name: "fullName",
          label: "Full Name",
          placeholder: "Enter your full name",
          validation: {
            required: "Full name is required",
            minLength: {
              value: 2,
              message: "Full name must be at least 2 characters",
            },
            maxLength: {
              value: 50,
              message: "Full name must be under 50 characters",
            },
            pattern: {
              value: /^[a-zA-Z\s'-]+$/,
              message: "Full name can only contain letters, spaces, hyphens, or apostrophes",
            },
          },
        },
        // ── Username ───────────────────────────────────────
        {
          name: "username",
          label: "Username",
          placeholder: "Enter a unique username",
          validation: {
            required: "Username is required",
            minLength: {
              value: 3,
              message: "Username must be at least 3 characters",
            },
            maxLength: {
              value: 30,
              message: "Username must be under 30 characters",
            },
            pattern: {
              value: /^[a-zA-Z0-9_]+$/,
              message: "Username can only contain letters, numbers, and underscores",
            },
          },
        },
        // ── Password ───────────────────────────────────────
        {
          name: "password",
          label: "Password",
          type: "password",
          placeholder: "Minimum 6 characters",
          validation: {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
            maxLength: {
              value: 100,
              message: "Password must be under 100 characters",
            },
          },
        },
        // ── Avatar (optional) ──────────────────────────────
        {
          name: "avatar",
          label: "Avatar (optional)",
          type: "file",
          validation: {
            validate: {
              fileSize: (files) => {
                if (!files || files.length === 0) return true;
                return (
                  files[0].size <= 5 * 1024 * 1024 ||
                  "Avatar must be under 5MB"
                );
              },
              fileType: (files) => {
                if (!files || files.length === 0) return true;
                const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
                return (
                  validTypes.includes(files[0].type) ||
                  "Only JPEG, PNG, GIF, or WebP images are allowed"
                );
              },
            },
          },
        },
      ]
    : [
        // ── Username ───────────────────────────────────────
        {
          name: "username",
          label: "Username",
          placeholder: "Enter your username",
          validation: {
            required: "Username is required",
            minLength: {
              value: 3,
              message: "Username must be at least 3 characters",
            },
          },
        },
        // ── Password ───────────────────────────────────────
        {
          name: "password",
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
          validation: {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          },
        },
      ];

  // ========================
  // 🔹 HANDLE FORM SUBMISSION
  // ========================
  const handleSubmit = async (data) => {
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (isSignUp) {
        // ──────────────────────────────
        // SIGNUP FLOW
        // ──────────────────────────────
        const formData = new FormData();
        formData.append("username", data.username.trim().toLowerCase());
        formData.append("email", data.email.trim().toLowerCase());
        formData.append("fullName", data.fullName.trim());
        formData.append("password", data.password);

        // ✅ Avatar is optional — only append if provided
        if (data.avatar?.[0]) {
          formData.append("avatar", data.avatar[0]);
        }

        // ✅ Backend auto-sets role as "user" if not provided, but send it explicitly
        formData.append("role", "user");

        await signup(formData).unwrap();
        // ✅ Backend returns accessToken + refreshToken in cookies on signup
        // authApi's onQueryStarted handles dispatching setAccessToken + setUser
        // useEffect above will detect isAuthenticated → true and redirect

        reset();
        setSuccessMessage("Account created! Redirecting to dashboard...");

      } else {
        // ──────────────────────────────
        // LOGIN FLOW
        // ──────────────────────────────
        await login({
          username: data.username.trim().toLowerCase(),
          password: data.password,
        }).unwrap();
        // ✅ authApi's onQueryStarted dispatches setAccessToken + setUser
        // useEffect above will detect isAuthenticated → true and redirect

        reset();
      }
    } catch (err) {
      console.error("Auth error:", err);

      setErrorMessage(getErrorMessage(err));
    }
  };

  // ========================
  // 🔹 LOADING STATE
  // ========================
  const isLoading = loginLoading || signupLoading;

  // ========================
  // 🔹 RENDER
  // ========================
  return (
    <div className="w-full max-w-sm mx-auto p-4 sm:p-6">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-xl shadow-2xl border border-gray-700 overflow-hidden">

        {/* Header */}
          <div className="pt-3 text-xl font-bold text-center text-blue-500">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </div>

        {/* Body */}
        <div className="px-4 py-2">

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{errorMessage}</p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex gap-2">
              <div className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5">✓</div>
              <p className="text-green-300 text-sm">{successMessage}</p>
            </div>
          )}

          {/* Form */}
          <Form
            fields={fields}
            onSubmit={handleSubmit}
            submitLabel={
              isSignUp
                ? isLoading ? "Creating Account..." : "Create Account"
                : isLoading ? "Signing In..." : "Sign In"
            }
            isSubmitting={isLoading}
            disabled={isLoading}
          />

          {/* Loading spinner */}
          {isLoading && (
            <div className="mt-4 flex items-center justify-center gap-2 text-gray-400">
              <Loader className="w-4 h-4 animate-spin" />
              <span className="text-sm">
                {isSignUp ? "Setting up your account..." : "Signing you in..."}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-gray-900/50 border-t border-gray-700">
          <p className="text-center text-gray-400 text-sm">
            {isSignUp ? (
              <>
                Already have an account?{" "}
                <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                  Sign in
                </Link>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                  Create one
                </Link>
              </>
            )}
          </p>
        </div>
      </div>

      <p className="text-center text-gray-500 text-xs mt-6">
        {isSignUp
          ? "Your data is secure and encrypted"
          : "Protected by industry-standard security"}
      </p>
    </div>
  );
};

export default AuthForm;