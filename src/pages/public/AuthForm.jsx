import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { AlertCircle, Loader } from "lucide-react";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/features/auth/authSlice";
import Form from "../../components/Form.jsx";

import {
  useLoginMutation,
  useSignupMutation,
} from "../../store/features/auth/authApi.js";

import { getErrorMessage } from "../../utils/errorParser.js";


const AuthForm = () => {

const user = useSelector(selectUser);
  const navigate = useNavigate();
  const location = useLocation();

  const isSignUp = location.pathname.includes("signup");


  const { reset } = useForm();


  const [
    login,
    {
      isLoading: loginLoading
    }
  ] = useLoginMutation();


  const [
    signup,
    {
      isLoading: signupLoading
    }
  ] = useSignupMutation();



  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");



  const fields = isSignUp
    ? [
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
          },
        },

        {
          name: "fullName",
          label: "Full Name",
          placeholder: "Enter your full name",
          validation: {
            required: "Full name is required",
          },
        },

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

        {
          name: "password",
          label: "Password",
          type: "password",
          placeholder: "Enter password",
          validation: {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          },
        },

        {
          name: "avatar",
          label: "Avatar (optional)",
          type: "file",
        },
      ]

    : [

        {
          name: "username",
          label: "Username",
          placeholder: "Enter username",
          validation: {
            required: "Username is required",
          },
        },

        {
          name: "password",
          label: "Password",
          type: "password",
          placeholder: "Enter password",
          validation: {
            required: "Password is required",
          },
        },

      ];


useEffect(() => {
  if (user) {
    navigate("/dashboard", {
      replace: true,
    });
  }
}, [user, navigate]);

  const handleSubmit = async (data) => {
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (isSignUp) {
        const formData = new FormData();
        formData.append(
          "username",
          data.username.trim().toLowerCase()
        );
        formData.append(
          "email",
          data.email.trim().toLowerCase()
        );
        formData.append(
          "fullName",
          data.fullName.trim()
        );
        formData.append(
          "password",
          data.password
        );
        formData.append(
          "role",
          "user"
        );
        if (data.avatar?.[0]) {
          formData.append(
            "avatar",
            data.avatar[0]
          );
        }
        await signup(formData).unwrap();
        reset();
        setSuccessMessage(
          "Account created! Redirecting..."
        );

      } else {

        await login({
          username:
            data.username.trim().toLowerCase(),
          password:
            data.password,
        }).unwrap();
        reset();

      }



    } catch(err) {

      console.error(
        "Auth error:",
        err
      );


      setErrorMessage(
        getErrorMessage(err)
      );

    }

  };

  const isLoading =
    loginLoading ||
    signupLoading;



  return (

    <div className="w-full max-w-sm mx-auto p-4 sm:p-6">


      <div className="
        bg-gradient-to-br
        from-gray-800
        to-gray-900
        text-white
        rounded-xl
        shadow-2xl
        border
        border-gray-700
        overflow-hidden
      ">


        <div className="
          pt-3
          text-xl
          font-bold
          text-center
          text-blue-500
        ">
          {
            isSignUp
              ? "Create Account"
              : "Welcome Back"
          }
        </div>



        <div className="px-4 py-4">


          {
            errorMessage &&
            (
              <div className="
                mb-4
                p-3
                bg-red-500/10
                border
                border-red-500/30
                rounded-lg
                flex
                gap-2
              ">

                <AlertCircle
                  className="
                    w-5
                    h-5
                    text-red-400
                  "
                />

                <p className="text-red-300 text-sm">
                  {errorMessage}
                </p>

              </div>
            )
          }



          {
            successMessage &&
            (
              <div className="
                mb-4
                p-3
                bg-green-500/10
                border
                border-green-500/30
                rounded-lg
              ">

                <p className="text-green-300 text-sm">
                  {successMessage}
                </p>

              </div>
            )
          }




          <Form
            fields={fields}
            onSubmit={handleSubmit}
            submitLabel={
              isSignUp
                ? isLoading
                  ? "Creating Account..."
                  : "Create Account"
                :
                  isLoading
                    ? "Signing In..."
                    : "Sign In"
            }
            isSubmitting={isLoading}
            disabled={isLoading}
          />



          {
            isLoading &&
            (
              <div className="
                mt-4
                flex
                items-center
                justify-center
                gap-2
                text-gray-400
              ">

                <Loader
                  className="
                    w-4
                    h-4
                    animate-spin
                  "
                />

                <span className="text-sm">
                  Processing...
                </span>

              </div>
            )
          }


        </div>




        <div className="
          px-4
          py-3
          bg-gray-900/50
          border-t
          border-gray-700
        ">


          <p className="
            text-center
            text-gray-400
            text-sm
          ">


            {
              isSignUp
              ?
              <>
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="
                    text-blue-400
                    hover:text-blue-300
                    font-semibold
                  "
                >
                  Sign in
                </Link>
              </>
              :
              <>
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="
                    text-blue-400
                    hover:text-blue-300
                    font-semibold
                  "
                >
                  Create one
                </Link>
              </>
            }


          </p>


        </div>


      </div>


    </div>

  );

};


export default AuthForm;