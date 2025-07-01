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
  Shield,
  Users,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

function Auth() {
  const isRegister = useMatch("/register");
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

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

  // Handle Google Login Success
  const handleGoogleSuccess = async (response) => {
    setIsGoogleLoading(true);
    try {
      const VITE_API_URL = import.meta.env.VITE_BACKEND_URL;
      if (!VITE_API_URL) {
        throw new Error("Backend URL is not defined");
      }

      const { data } = await axios.post(
        `${VITE_API_URL}/api/auth/google`,
        { credential: response.credential },
        { withCredentials: true }
      );

      if (isRegister) {
        toast.success(
          "Please verify your email! Check your inbox for verification.",
          {
            duration: 5000,
            position: "top-right",
          }
        );
      }

      login(data.user);
      navigate("/");
    } catch (error) {
      console.error("Google auth error:", error);
      toast.error(
        error.response?.data?.message || "Failed to authenticate with Google",
        { position: "top-right" }
      );
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    setIsGoogleLoading(false);
    toast.error("Google authentication failed. Please try again.", {
      position: "top-right",
    });
  };

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
          toast.success(
            "Please verify your email! Check your inbox for verification.",
            {
              duration: 5000,
              position: "top-right",
            }
          );
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
    <div className="relative auth-page bg-white flex items-center justify-center p-4 overflow-hidden min-h-screen">
      <div className="absolute top-40 right-20 w-64 h-64 bg-teal-500 blur-[2px] rounded-full opacity-5 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute top-60 right-36 w-32 h-32 bg-[#243635] blur-[2px] rounded-full opacity-5 -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute top-44 right-0 w-20 h-20 bg-cyan-500 blur-[2px] rounded-full opacity-10 translate-y-1/2 -translate-x-1/2"></div>
      <div className="absolute bottom-12 left-12 w-40 h-40 bg-teal-500 blur-[2px] rounded-full opacity-10 translate-y-1/2 -translate-x-1/2"></div>
      <div className="absolute bottom-12 left-32 w-20 h-20 bg-cyan-500 blur-[2px] rounded-full opacity-10 translate-y-1/2 -translate-x-1/2"></div>

      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="mt-24 text-center" data-aos="fade-down">
          <h1 className="text-4xl lg:text-5xl font-bold text-[#243635] mb-4">
            {isRegister ? "Join Writely" : "Welcome Back"}
          </h1>
          {/* <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
            {isRegister
              ? "Start your writing journey with our vibrant community of creators"
              : "Continue your creative journey and share your stories with the world"}
          </p> */}
        </div>

        {/* Main Content */}
        <div
          className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full"
          data-aos="fade-up"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
            {/* Left Column: Form */}
            <div
              className="p-6 lg:p-10 flex flex-col justify-center"
              data-aos="fade-right"
            >
              <div className="max-w-md mx-auto w-full">
                <div className="mb-8">
                  <h2 className="text-2xl lg:text-3xl font-bold text-[#243635] mb-3">
                    {isRegister ? "Create Your Account" : "Sign In"}
                  </h2>
                  <p className="text-gray-600 text-base lg:text-lg">
                    {isRegister
                      ? "Join thousands of writers sharing their stories"
                      : "Access your personalized writing dashboard"}
                  </p>
                </div>

                {/* Google Login Button */}
                <div className="mb-6" data-aos="fade-up" data-aos-delay="100">
                  <div className="w-full max-w-md mx-auto">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      text={isRegister ? "signup_with" : "signin_with"}
                      disabled={isGoogleLoading}
                      theme="outline"
                      size="large"
                      shape="rectangular"
                      logo_alignment="center"
                      useOneTap={false}
                      context="signin"
                      className="w-full"
                    />
                    {isGoogleLoading && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                        <div className="animate-spin h-5 w-5 border-2 border-[#53C7C0] border-t-transparent rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div
                  className="relative my-6"
                  data-aos="fade-up"
                  data-aos-delay="150"
                >
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">
                      Or continue with email
                    </span>
                  </div>
                </div>

                <Formik
                  onSubmit={onSubmit}
                  initialValues={
                    isRegister ? registerInitialValues : loginInitialValues
                  }
                  validationSchema={
                    isRegister
                      ? registerValidationSchema
                      : loginValidationSchema
                  }
                >
                  {({
                    isSubmitting,
                    errors,
                    touched,
                    values,
                    setFieldValue,
                  }) => (
                    <Form className="space-y-4">
                      <fieldset disabled={isSubmitting || isLoading}>
                        {/* Username field - only for register */}
                        {isRegister && (
                          <div
                            className="space-y-2"
                            data-aos="fade-up"
                            data-aos-delay="200"
                          >
                            <label className="block text-[#243635] font-semibold text-base">
                              Username
                            </label>
                            <div className="relative group">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User
                                  size={18}
                                  className="text-gray-400 group-focus-within:text-[#53C7C0] transition-colors"
                                />
                              </div>
                              <Field
                                type="text"
                                name="username"
                                placeholder="Choose a unique username"
                                className={`w-full pl-10 pr-4 py-3 border-2 ${
                                  errors.username && touched.username
                                    ? "border-red-500 focus:ring-red-200"
                                    : "border-gray-200 focus:ring-[#53C7C0]/20 focus:border-[#53C7C0]"
                                } rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 text-base`}
                              />
                              {errors.username && touched.username && (
                                <div className="absolute right-0 top-0 h-full flex items-center pr-3">
                                  <AlertCircle
                                    size={18}
                                    className="text-red-500"
                                  />
                                </div>
                              )}
                            </div>
                            <ErrorMessage
                              name="username"
                              component="div"
                              className="text-red-500 text-sm flex items-center gap-2"
                            />
                          </div>
                        )}

                        {/* Pronouns field - only for register */}
                        {isRegister && (
                          <div
                            className="space-y-2 relative"
                            data-aos="fade-up"
                            data-aos-delay="250"
                          >
                            <label className="block text-[#243635] font-semibold text-base">
                              Pronouns
                            </label>
                            <div className="relative">
                              <div
                                className={`w-full p-3 border-2 relative cursor-pointer flex items-center justify-between rounded-xl transition-all duration-300 group ${
                                  errors.pronouns && touched.pronouns
                                    ? "border-red-500"
                                    : "border-gray-200 hover:border-[#53C7C0]"
                                } ${
                                  isDropdownOpen
                                    ? "ring-4 ring-[#53C7C0]/20 border-[#53C7C0]"
                                    : ""
                                }`}
                                onClick={() =>
                                  setIsDropdownOpen(!isDropdownOpen)
                                }
                              >
                                <span
                                  className={`text-base ${
                                    values.pronouns
                                      ? "text-[#243635]"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {getPronounDisplay(values.pronouns)}
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
                                  <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setIsDropdownOpen(false)}
                                  ></div>
                                  <div className="absolute left-0 right-0 z-20 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl overflow-hidden">
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
                                        className={`px-4 py-3 cursor-pointer flex items-center justify-between hover:bg-[#F0FDFC] transition-colors text-base ${
                                          values.pronouns === option.value
                                            ? "bg-[#F0FDFC] text-[#53C7C0] font-medium"
                                            : "text-gray-700"
                                        }`}
                                        onClick={() => {
                                          setFieldValue(
                                            "pronouns",
                                            option.value
                                          );
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
                            <Field type="hidden" name="pronouns" />
                            <ErrorMessage
                              name="pronouns"
                              component="div"
                              className="text-red-500 text-sm flex items-center gap-2"
                            />
                          </div>
                        )}

                        {/* Email field */}
                        <div
                          className="space-y-2"
                          data-aos="fade-up"
                          data-aos-delay={isRegister ? "300" : "200"}
                        >
                          <label className="block text-[#243635] font-semibold text-base">
                            Email Address
                          </label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail
                                size={18}
                                className="text-gray-400 group-focus-within:text-[#53C7C0] transition-colors"
                              />
                            </div>
                            <Field
                              type="email"
                              name="email"
                              placeholder="Enter your email address"
                              className={`w-full pl-10 pr-4 py-3 border-2 ${
                                errors.email && touched.email
                                  ? "border-red-500 focus:ring-red-200"
                                  : "border-gray-200 focus:ring-[#53C7C0]/20 focus:border-[#53C7C0]"
                              } rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 text-base`}
                            />
                            {errors.email && touched.email && (
                              <div className="absolute right-0 top-0 h-full flex items-center pr-3">
                                <AlertCircle
                                  size={18}
                                  className="text-red-500"
                                />
                              </div>
                            )}
                          </div>
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="text-red-500 text-sm flex items-center gap-2"
                          />
                        </div>

                        {/* Password field */}
                        <div
                          className="space-y-2"
                          data-aos="fade-up"
                          data-aos-delay={isRegister ? "350" : "250"}
                        >
                          <label className="block text-[#243635] font-semibold text-base">
                            Password
                          </label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock
                                size={18}
                                className="text-gray-400 group-focus-within:text-[#53C7C0] transition-colors"
                              />
                            </div>
                            <Field
                              type={showPassword ? "text" : "password"}
                              name="password"
                              placeholder="Enter your password"
                              className={`w-full pl-10 pr-12 py-3 border-2 ${
                                errors.password && touched.password
                                  ? "border-red-500 focus:ring-red-200"
                                  : "border-gray-200 focus:ring-[#53C7C0]/20 focus:border-[#53C7C0]"
                              } rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 text-base`}
                            />
                            <button
                              type="button"
                              onClick={toggleShowPassword}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#53C7C0] transition-colors focus:outline-none"
                            >
                              {showPassword ? (
                                <EyeOff size={18} />
                              ) : (
                                <Eye size={18} />
                              )}
                            </button>
                            {errors.password && touched.password && (
                              <div className="absolute right-10 top-0 h-full flex items-center pr-2">
                                <AlertCircle
                                  size={18}
                                  className="text-red-500"
                                />
                              </div>
                            )}
                          </div>
                          <ErrorMessage
                            name="password"
                            component="div"
                            className="text-red-500 text-sm flex items-center gap-2"
                          />
                        </div>

                        {/* Submit Button */}
                        <div
                          className="pt-4"
                          data-aos="fade-up"
                          data-aos-delay={isRegister ? "400" : "300"}
                        >
                          <button
                            type="submit"
                            disabled={isSubmitting || isLoading}
                            className="w-full bg-gradient-to-r from-[#53C7C0] to-[#4AB3AC] text-white font-semibold py-3 px-6 rounded-xl hover:from-[#4AB3AC] hover:to-[#53C7C0] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-base"
                          >
                            {isLoading ? (
                              <div className="flex items-center justify-center">
                                <div className="animate-spin mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                {isRegister
                                  ? "Creating Your Account..."
                                  : "Signing You In..."}
                              </div>
                            ) : isRegister ? (
                              "Create Account"
                            ) : (
                              "Sign In"
                            )}
                          </button>
                        </div>

                        {/* Switch Link */}
                        <div
                          className="pt-4 text-center"
                          data-aos="fade-up"
                          data-aos-delay={isRegister ? "450" : "350"}
                        >
                          <p className="text-gray-600 mb-2">
                            {isRegister
                              ? "Already have an account?"
                              : "Don't have an account?"}
                          </p>
                          <Link
                            to={isRegister ? "/login" : "/register"}
                            className="inline-flex items-center text-[#53C7C0] hover:text-[#243635] font-semibold transition-colors text-base group"
                          >
                            {isRegister
                              ? "Sign in to existing account"
                              : "Create a new account"}
                            <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </fieldset>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>

            {/* Right Column - Image & Info */}
            <div
              className="bg-gradient-to-br from-[#F0FDFC] via-[#E6F9F8] to-[#DCF5F4] p-6 lg:p-12 flex flex-col items-center justify-center relative overflow-hidden"
              data-aos="fade-left"
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#53C7C0]/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#53C7C0]/15 to-transparent rounded-full translate-y-12 -translate-x-12"></div>

              <div className="max-w-lg relative z-10 text-center">
                <img
                  src={AuthPageImage}
                  alt="Authentication Illustration"
                  className="w-full max-w-sm mx-auto mb-8 drop-shadow-lg"
                />

                <div className="bg-white/80 backdrop-blur-sm p-6 lg:p-8 rounded-2xl shadow-xl border border-white/20">
                  <h3 className="text-xl lg:text-2xl font-bold text-[#243635] mb-6 flex items-center justify-center">
                    {isRegister ? (
                      <>
                        <Users className="w-6 h-6 mr-3 text-[#53C7C0]" />
                        Why Join Writely?
                      </>
                    ) : (
                      <>
                        <Shield className="w-6 h-6 mr-3 text-[#53C7C0]" />
                        Welcome Back!
                      </>
                    )}
                  </h3>

                  {isRegister ? (
                    <ul className="space-y-4 text-gray-700 text-left">
                      <li className="flex items-start group">
                        <div className="bg-gradient-to-r from-[#53C7C0] to-[#4AB3AC] rounded-full h-6 w-6 flex items-center justify-center text-white text-xs font-bold mt-1 mr-4 flex-shrink-0 group-hover:scale-110 transition-transform">
                          1
                        </div>
                        <span className="text-base">
                          Share your ideas with our growing community of writers
                        </span>
                      </li>
                      <li className="flex items-start group">
                        <div className="bg-gradient-to-r from-[#53C7C0] to-[#4AB3AC] rounded-full h-6 w-6 flex items-center justify-center text-white text-xs font-bold mt-1 mr-4 flex-shrink-0 group-hover:scale-110 transition-transform">
                          2
                        </div>
                        <span className="text-base">
                          Connect with like-minded creators and readers
                        </span>
                      </li>
                      <li className="flex items-start group">
                        <div className="bg-gradient-to-r from-[#53C7C0] to-[#4AB3AC] rounded-full h-6 w-6 flex items-center justify-center text-white text-xs font-bold mt-1 mr-4 flex-shrink-0 group-hover:scale-110 transition-transform">
                          3
                        </div>
                        <span className="text-base">
                          Discover content tailored to your interests
                        </span>
                      </li>
                      <li className="flex items-start group">
                        <div className="bg-gradient-to-r from-[#53C7C0] to-[#4AB3AC] rounded-full h-6 w-6 flex items-center justify-center text-white text-xs font-bold mt-1 mr-4 flex-shrink-0 group-hover:scale-110 transition-transform">
                          4
                        </div>
                        <span className="text-base">
                          Build your personal brand and audience
                        </span>
                      </li>
                    </ul>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-base text-gray-700 leading-relaxed">
                        We're glad to see you again! Sign in to continue your
                        creative journey, discover new content, and connect with
                        your community.
                      </p>
                      <div className="flex items-center justify-center text-[#53C7C0] font-semibold">
                        <BookOpen className="w-5 h-5 mr-2" />
                        Continue your writing adventure
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        {/* <div
          className="mt-8 text-center"
          data-aos="fade-up"
          data-aos-delay="600"
        >
          <p className="text-gray-500 text-base">
            Designed with ❤️ by{" "}
            <span className="font-semibold text-[#243635]">
              Jadamal Sangeetha Choudhary
            </span>
          </p>
        </div> */}
      </div>
    </div>
  );
}

export default Auth;
