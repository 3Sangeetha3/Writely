import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link, useMatch, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks";
import AOS from "aos";
import "aos/dist/aos.css";
import AuthPageImage from "../assets/auth_page.svg";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import {
  User,
  Mail,
  Lock,
  AlertCircle,
  Eye,
  EyeOff,
  Check,
  ChevronDown,
} from "lucide-react";

function Auth() {
  const isRegister = useMatch("/register");
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  const passwordValidation = Yup.string()
    .min(6, "Minimum 6 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>_]/,
      "Must contain at least one special character"
    )
    .required("Required");

  const loginValidationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    password: passwordValidation,
  });

  const registerValidationSchema = Yup.object({
    username: Yup.string().min(3, "Minimum 3 characters").required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: passwordValidation,
    pronouns: Yup.string()
      .required("Required")
      .oneOf(["he", "she", "other"], "Please select a valid option"),
  });

  async function onSubmit(values, actions) {
    setIsLoading(true);
    try {
      const VITE_API_URL = import.meta.env.VITE_BACKEND_URL;
      const { data } = await axios.post(
        `${VITE_API_URL}/api/users${isRegister ? "" : "/login"}`,
        { user: values }
      );

      if (isRegister) {
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <img
                    className="h-10 w-10 rounded-full"
                    src="https://cdn.iconscout.com/icon/free/png-256/free-google-mail-logo-icon-download-in-svg-png-gif-file-formats--gmail-productivity-apps-pack-logos-icons-8630400.png"
                    alt=""
                  />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-lg font-medium text-[#475756]">
                    Please verify your email!
                  </p>
                  <p className="mt-1 text-sm text-[#A8AFAF]">
                    Check your inbox. We have sent a verification email.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-[#243635] hover:bg-[#475756] hover:text-white hover:border-[#475756] focus:outline-none focus:ring-2 focus:ring-[#475756] transition duration-200 ease-in-out"
              >
                Close
              </button>
            </div>
          </div>
        ));
      }

      login(data.user);
      navigate("/");
    } catch (error) {
      const { status, data } = error.response;
      if (status && data && data.message) {
        if (data.message.toLowerCase().includes("email")) {
          toast.custom((t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <img
                      className="h-10 w-10 rounded-full"
                      src="https://cdn.iconscout.com/icon/free/png-256/free-google-mail-logo-icon-download-in-svg-png-gif-file-formats--gmail-productivity-apps-pack-logos-icons-8630400.png"
                      alt=""
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-lg font-medium text-[#475756]">
                      Please verify your email!
                    </p>
                    <p className="mt-1 text-sm text-[#A8AFAF]">
                      Check your inbox. We have sent a verification email.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-gray-200">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-[#243635] hover:bg-[#475756] hover:text-white hover:border-[#475756] focus:outline-none focus:ring-2 focus:ring-[#475756] transition duration-200 ease-in-out"
                >
                  Close
                </button>
              </div>
            </div>
          ));
        } else {
          toast.error(data.message, { position: "top-right" });
        }
      } else if (status === 422 && data.errors) {
        const serverErrors = {};
        data.errors.forEach((err) => {
          const parts = err.param.split(".");
          const fieldName = parts[parts.length - 1];
          serverErrors[fieldName] = err.msg;
        });
        actions.setErrors(serverErrors);
      } else {
        toast.error("An error occurred. Please try again.", {
          position: "top-right",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  const loginInitialValues = { email: "", password: "" };
  const registerInitialValues = {
    username: "",
    email: "",
    password: "",
    pronouns: "other",
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Map pronouns value to display text
  const getPronounDisplay = (value) => {
    switch (value) {
      case "he":
        return "He/Him";
      case "she":
        return "She/Her";
      case "other":
        return "Prefer not to say";
      default:
        return "Select your pronouns";
    }
  };

  return (
    <div className="container mt-28 mx-auto px-4 max-w-6xl w-full sm:w-11/12 md:w-full overflow-y-hidden" data-aos="fade-up">
      <h1 className="text-center text-4xl font-bold text-[#243635] mb-6">
        {isRegister ? "Create Account" : "Welcome Back"}
      </h1>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Left Column: Form */}
          <div className="p-8 md:p-10" data-aos="fade-right">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-[#243635] mb-2">
                {isRegister ? "Join Our Community" : "Sign In"}
              </h2>
              <p className="text-gray-600">
                {isRegister
                  ? "Create your account to start sharing your ideas"
                  : "Enter your credentials to access your account"}
              </p>
            </div>
            <Formik
              onSubmit={onSubmit}
              initialValues={
                isRegister ? registerInitialValues : loginInitialValues
              }
              validationSchema={
                isRegister ? registerValidationSchema : loginValidationSchema
              }
            >
              {({ isSubmitting, errors, touched, values, setFieldValue }) => (
                <Form className="space-y-5">
                  <fieldset disabled={isSubmitting || isLoading}>
                    {/* Username field - only for register */}
                    {isRegister && (
                      <div
                        className="mb-5"
                        data-aos="fade-up"
                        data-aos-delay="100"
                      >
                        <label className="block text-gray-700 mb-1 font-medium">
                          Username
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User size={18} className="text-gray-400" />
                          </div>
                          <Field
                            type="text"
                            name="username"
                            placeholder="Choose a username"
                            className={`w-full pl-10 p-3 border ${
                              errors.username && touched.username
                                ? "border-red-500 focus:ring-red-200"
                                : "border-gray-300 focus:ring-[#53C7C0]/30"
                            } rounded-lg focus:outline-none focus:ring-4 transition-all`}
                          />
                          {errors.username && touched.username && (
                            <div className="absolute right-0 top-0 h-full flex items-center pr-3">
                              <AlertCircle size={18} className="text-red-500" />
                            </div>
                          )}
                        </div>
                        <ErrorMessage
                          name="username"
                          component="div"
                          className="text-red-500 text-sm mt-1 flex items-center gap-1"
                        />
                      </div>
                    )}

                    {isRegister && (
                      <div
                        className="mb-5 relative z-40"
                        data-aos="fade-up"
                        data-aos-delay="200"
                      >
                        <label className="block text-gray-700 mb-1 font-medium">
                          Pronouns
                        </label>
                        <div className="relative z-40">
                          <div
                            className={`w-full p-3 border relative cursor-pointer flex items-center justify-between ${
                              errors.pronouns && touched.pronouns
                                ? "border-red-500 focus:ring-red-200"
                                : "border-gray-300"
                            } rounded-lg transition-all hover:border-[#53C7C0] ${
                              isDropdownOpen
                                ? "ring-4 ring-[#53C7C0]/30 border-[#53C7C0]"
                                : ""
                            }`}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          >
                            <span
                              className={`${
                                values.pronouns
                                  ? "text-[#243635]"
                                  : "text-gray-400"
                              }`}
                            >
                              {values.pronouns
                                ? getPronounDisplay(values.pronouns)
                                : "Select your pronouns"}
                            </span>
                            <ChevronDown
                              size={18}
                              className={`text-gray-400 transition-transform duration-300 ${
                                isDropdownOpen ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                          {isDropdownOpen && (
                            <>
                              {/* Overlay to close dropdown when clicking outside */}
                              <div
                                className="fixed inset-0 z-40 bg-transparent"
                                onClick={() => setIsDropdownOpen(false)}
                              ></div>
                              <div
                                className="absolute left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
                                style={{
                                  position: "absolute",
                                  top: "100%",
                                  zIndex: 9999,
                                }}
                              >
                                {[
                                  { value: "he", label: "He/Him" },
                                  { value: "she", label: "She/Her" },
                                  {
                                    value: "other",
                                    label: "Prefer not to say",
                                  },
                                ].map((option) => (
                                  <div
                                    key={option.value}
                                    className={`px-4 py-2 cursor-pointer flex items-center justify-between hover:bg-[#F0FDFC] transition-colors ${
                                      values.pronouns === option.value
                                        ? "bg-[#F0FDFC] text-[#53C7C0]"
                                        : "text-gray-700"
                                    }`}
                                    onClick={() => {
                                      setFieldValue("pronouns", option.value);
                                      setIsDropdownOpen(false);
                                    }}
                                  >
                                    <span>{option.label}</span>
                                    {values.pronouns === option.value && (
                                      <Check
                                        size={16}
                                        className="text-[#53C7C0]"
                                      />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                        {errors.pronouns && touched.pronouns && (
                          <div className="absolute right-0 top-0 h-full flex items-center pr-3">
                            <AlertCircle size={18} className="text-red-500" />
                          </div>
                        )}
                        <Field type="hidden" name="pronouns" />
                        <ErrorMessage
                          name="pronouns"
                          component="div"
                          className="text-red-500 text-sm mt-1 flex items-center gap-1"
                        />
                      </div>
                    )}

                    {/* Email field */}
                    <div
                      className="mb-5"
                      data-aos="fade-up"
                      data-aos-delay={isRegister ? "300" : "100"}
                    >
                      <label className="block text-gray-700 mb-1 font-medium">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail size={18} className="text-gray-400" />
                        </div>
                        <Field
                          type="email"
                          name="email"
                          placeholder="Enter your email"
                          className={`w-full pl-10 p-3 border ${
                            errors.email && touched.email
                              ? "border-red-500 focus:ring-red-200"
                              : "border-gray-300 focus:ring-[#53C7C0]/30"
                          } rounded-lg focus:outline-none focus:ring-4 transition-all`}
                        />
                        {errors.email && touched.email && (
                          <div className="absolute right-0 top-0 h-full flex items-center pr-3">
                            <AlertCircle size={18} className="text-red-500" />
                          </div>
                        )}
                      </div>
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500 text-sm mt-1 flex items-center gap-1"
                      />
                    </div>

                    {/* Password field with improved eye toggle */}
                    <div
                      className="mb-5"
                      data-aos="fade-up"
                      data-aos-delay={isRegister ? "400" : "200"}
                    >
                      <label className="block text-gray-700 mb-1 font-medium">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock size={18} className="text-gray-400" />
                        </div>
                        <Field
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Enter your password"
                          className={`w-full pl-10 pr-10 p-3 border ${
                            errors.password && touched.password
                              ? "border-red-500 focus:ring-red-200"
                              : "border-gray-300 focus:ring-[#53C7C0]/30"
                          } rounded-lg focus:outline-none focus:ring-4 transition-all`}
                        />
                        <button
                          type="button"
                          onClick={toggleShowPassword}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                        {errors.password && touched.password && (
                          <div className="absolute right-8 top-0 h-full flex items-center pr-3">
                            <AlertCircle size={18} className="text-red-500" />
                          </div>
                        )}
                      </div>
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-500 text-sm mt-1 flex items-center gap-1"
                      />
                    </div>

                    {/* Submit Button */}
                    <div
                      className="pt-2"
                      data-aos="fade-up"
                      data-aos-delay={isRegister ? "500" : "300"}
                    >
                      <button
                        type="submit"
                        disabled={isSubmitting || isLoading}
                        className="w-full bg-[#53C7C0] text-white font-medium p-3 rounded-lg hover:opacity-90 transition-all shadow-md"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                            {isRegister
                              ? "Creating Account..."
                              : "Signing In..."}
                          </div>
                        ) : isRegister ? (
                          "Create Account"
                        ) : (
                          "Sign In"
                        )}
                      </button>
                    </div>

                    {/* Divider */}
                    <div
                      className="relative my-6"
                      data-aos="fade-up"
                      data-aos-delay={isRegister ? "600" : "400"}
                    >
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">
                          {isRegister
                            ? "Already have an account?"
                            : "Don't have an account?"}
                        </span>
                      </div>
                    </div>

                    {/* Switch between register and login */}
                    <div
                      className="text-center"
                      data-aos="fade-up"
                      data-aos-delay={isRegister ? "700" : "500"}
                    >
                      <Link
                        to={isRegister ? "/login" : "/register"}
                        className="inline-block text-[#53C7C0] hover:text-[#243635] font-medium transition-colors"
                      >
                        {isRegister
                          ? "Sign in to existing account"
                          : "Create a new account"}
                      </Link>
                    </div>
                  </fieldset>
                </Form>
              )}
            </Formik>
          </div>

          {/* Right Column - Image & Info */}
          <div
            className="bg-[#F0FDFC] p-8 md:p-10 flex flex-col items-center justify-center"
            data-aos="fade-left"
          >
            <div className="max-w-lg">
              <img
                src={AuthPageImage}
                alt="Authentication Illustration"
                className="w-full mb-8"
              />
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-[#243635] mb-3">
                  {isRegister ? "Why Join Us?" : "Welcome Back!"}
                </h3>
                {isRegister ? (
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <div className="bg-[#53C7C0] rounded-full h-5 w-5 flex items-center justify-center text-white text-xs mt-0.5 mr-2">
                        1
                      </div>
                      <span>Share your ideas with our growing community</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-[#53C7C0] rounded-full h-5 w-5 flex items-center justify-center text-white text-xs mt-0.5 mr-2">
                        2
                      </div>
                      <span>Connect with like-minded individuals</span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-[#53C7C0] rounded-full h-5 w-5 flex items-center justify-center text-white text-xs mt-0.5 mr-2">
                        3
                      </div>
                      <span>Discover content tailored to your interests</span>
                    </li>
                  </ul>
                ) : (
                  <p className="text-gray-600">
                    We're glad to see you again! Sign in to continue your
                    journey, discover new content, and connect with your
                    community.
                  </p>
                )}
              </div>
              {/* {!isRegister && (
                <div className="mt-4 text-center text-gray-500 text-sm">
                  <p>
                    Forgot your password?{" "}
                    <a href="#" className="text-[#53C7C0] hover:text-[#243635]">
                      Reset it here
                    </a>
                  </p>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 text-center text-gray-500 text-sm">
        <p className="mt-1">
          Designed with ❤️ by{" "}
          <span className="font-medium">Jadamal Sangeetha Choudhary</span>
        </p>
      </div>
    </div>
  );
}

export default Auth;
