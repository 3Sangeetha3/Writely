import React, { useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { Link, useMatch, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks";
import AOS from "aos";
import "aos/dist/aos.css";
import AuthPageImage from "../assets/auth_page.svg";
import * as Yup from "yup";
import { toast } from "react-hot-toast";

function Auth() {
  const isRegister = useMatch("/register");
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    AOS.init({
      duration: 1000,
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
  });

  async function onSubmit(values, actions) {
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
    }
  }

  const loginInitialValues = { email: "", password: "" };
  const registerInitialValues = { username: "", email: "", password: "" };

  return (
    <div className="auth-page" data-aos="fade-up">
      <div className="container mx-auto">
        <h1 className="text-center text-[40px] font-semibold text-[#475756] m-8">
          Sign {isRegister ? "up" : "in"}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Header & Form */}
          <div className="md:pr-8" data-aos="fade-right">
            {/* Header */}
            <div className="mb-8 text-center">
              <h2 className="text-[32px] text-[#475756] font-medium font-['Roboto Serif']">
                Your details
              </h2>
              <p className="text-sm text-[#243635]/80 font-light font-['Roboto Serif']">
                Please provide your Name, Email and Password.
              </p>
            </div>
            {/* Formik Form */}
            <Formik
              onSubmit={onSubmit}
              initialValues={
                isRegister ? registerInitialValues : loginInitialValues
              }
              validationSchema={
                isRegister ? registerValidationSchema : loginValidationSchema
              }
            >
              {({ isSubmitting, errors, touched }) => (
                <Form>
                  <fieldset disabled={isSubmitting}>
                    <div
                      className="w-[449px] h-[229px] relative mx-auto"
                      data-aos="fade-up"
                    >
                      {isRegister && (
                        // UserName field
                        <div className="w-[449px] h-[69px] left-0 top-0 absolute">
                          <div
                            data-svg-wrapper
                            className="left-0 top-[10px] absolute"
                          >
                            <svg
                              width="451"
                              height="61"
                              viewBox="0 0 451 61"
                              fill="none"
                            >
                              <path
                                d="M51 1H38.125H25.75H9C4.58172 1 1 4.58172 1 9V52C1 56.4183 4.58172 60 9 60H442C446.418 60 450 56.4183 450 52V9C450 4.58172 446.418 1 442 1H225.5H135.5"
                                stroke="black"
                                strokeOpacity="0.25"
                              />
                            </svg>
                          </div>
                          <div className="left-[50px] top-0 absolute text-[#243635] text-base font-normal font-['Roboto Serif']">
                            UserName
                          </div>
                          <Field
                            type="text"
                            name="username"
                            placeholder="Enter your UserName"
                            className={`left-[50px] top-[28px] absolute text-[#243635]/50 text-xl font-light font-['Roboto Serif'] bg-transparent outline-none w-[350px] ${
                              errors.username && touched.username
                                ? "border-red-500"
                                : ""
                            }`}
                          />
                          {errors.username && touched.username && (
                            <div className="text-red-500 absolute left-[50px] top-[60px]">
                              {errors.username}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Email field */}
                      <div
                        className={`w-[449px] h-[69px] absolute ${
                          isRegister ? "top-[85px]" : "top-0"
                        }`}
                      >
                        <div
                          data-svg-wrapper
                          className="left-0 top-[10px] absolute"
                        >
                          <svg
                            width="451"
                            height="61"
                            viewBox="0 0 451 61"
                            fill="none"
                          >
                            <path
                              d="M51 1H38.125H25.75H9C4.58172 1 1 4.58172 1 9V52C1 56.4183 4.58172 60 9 60H442C446.418 60 450 56.4183 450 52V9C450 4.58172 446.418 1 442 1H225.5H97"
                              stroke="black"
                              strokeOpacity="0.25"
                            />
                          </svg>
                        </div>
                        <div className="left-[50px] top-0 absolute text-[#243635] text-base font-normal font-['Roboto Serif']">
                          Email
                        </div>
                        <Field
                          type="email"
                          name="email"
                          placeholder="Enter your Email"
                          className={`left-[50px] top-[28px] absolute text-[#243635]/50 text-xl font-light font-['Roboto Serif'] bg-transparent outline-none w-[350px] ${
                            errors.email && touched.email
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        {errors.email && touched.email && (
                          <div className="text-red-500 absolute left-[50px] top-[60px]">
                            {errors.email}
                          </div>
                        )}
                      </div>

                      {/* Password field */}
                      <div
                        className={`w-[449px] h-[69px] absolute ${
                          isRegister ? "top-[160px]" : "top-[85px]"
                        }`}
                      >
                        <div
                          data-svg-wrapper
                          className="left-0 top-[10px] absolute"
                        >
                          <svg
                            width="451"
                            height="61"
                            viewBox="0 0 451 61"
                            fill="none"
                          >
                            <path
                              d="M51 1H38.125H25.75H9C4.58172 1 1 4.58172 1 9V52C1 56.4183 4.58172 60 9 60H442C446.418 60 450 56.4183 450 52V9C450 4.58172 446.418 1 442 1H225.5H128"
                              stroke="black"
                              strokeOpacity="0.25"
                            />
                          </svg>
                        </div>
                        <div className="left-[50px] top-0 absolute text-[#243635] text-base font-normal font-['Roboto Serif']">
                          Password
                        </div>
                        <Field
                          type="password"
                          name="password"
                          placeholder="Enter your Password"
                          className={`left-[50px] top-[28px] absolute text-[#243635]/50 text-xl font-light font-['Roboto Serif'] bg-transparent outline-none w-[350px] ${
                            errors.password && touched.password
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        {errors.password && touched.password && (
                          <div className="text-red-500 absolute left-[50px] top-[60px]">
                            {errors.password}
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Submit Button */}
                    <div className="text-center m-4">
                      <button
                        type="submit"
                        className="bg-[#243635] text-[#FCFBF9] text-xl px-16 py-4 mt-2 mb-1 rounded-full"
                      >
                        Sign {isRegister ? "up" : "in"}
                      </button>
                    </div>
                  </fieldset>
                </Form>
              )}
            </Formik>

            <hr className="mb-3" />
            <div className="text-center mt-4">
              <Link
                to={isRegister ? "/login" : "/register"}
                className="text-[#5e6c6b] hover:text-[#5E6C6B]"
              >
                {isRegister
                  ? `Already have an account? Login`
                  : `Don't have an account? SignUp`}
              </Link>
            </div>
          </div>

          {/* Right Column - SVG Image */}
          <div className="md:pl-8" data-aos="fade-left">
            <div className="flex justify-center items-center mt-10">
              <img
                src={AuthPageImage}
                alt="Authentication Illustration"
                className="w-full max-w-5xl h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
