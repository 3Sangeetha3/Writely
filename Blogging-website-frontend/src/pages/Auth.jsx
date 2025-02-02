import React, { useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { Link, useMatch, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks";
import AOS from "aos";
import "aos/dist/aos.css";
import AuthPageImage from "../assets/auth_page.svg";
import * as Yup from "yup";

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
  .matches(/[!@#$%^&*(),.?":{}|<>_]/, "Must contain at least one special character")
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
      const VITE_API_URL = import.meta.env.BACKEND_URL || "http://localhost:3000";
      const { data } = await axios.post(
        `${VITE_API_URL}/api/users${isRegister ? "" : "/login"}`,
        { user: values }
      );
      login(data.user);
      navigate("/");
    } catch (error) {
      const { status, data } = error.response;
      if (status === 422 && data.errors) {
        const serverErrors = {};
        data.errors.foeEach((err) => {
          const fieldName = err.param.split("."[1]);
          serverErrors[fieldName] = err.msg;
        })

        actions.setErrors(serverErrors);
      }
    }
  }

  const loginInitialValues = { email: "", password: "" };
  const registerInitialValues = { username: "", email: "", password: "" };

  return (
    <div className="auth-page" data-aos="fade-up">
      <div className="container mx-auto">
        <h1 className="text-center text-4xl font-bold text-[#475756] m-8">
          Sign {isRegister ? "up" : "in"}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="mt-28 md:pr-8" data-aos="fade-right">
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
                    <div className="space-y-4">
                      {isRegister && (
                        <div data-aos="fade-up">
                          <Field
                            type="text"
                            name="username"
                            placeholder="Your Name"
                            className={`form-control form-control-lg w-full p-4 border rounded-md ${
                              errors.username && touched.username
                                ? "border-red-500"
                                : ""
                            }`}
                          />
                          {errors.username && touched.username && (
                            <div className="text-red-500">
                              {errors.username}
                            </div>
                          )}
                        </div>
                      )}
                      <div data-aos="fade-up">
                        <Field
                          type="email"
                          name="email"
                          placeholder="Email"
                          className={`form-control form-control-lg w-full p-4 border rounded-md ${
                            errors.email && touched.email
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        {errors.email && touched.email && (
                          <div className="text-red-500">{errors.email}</div>
                        )}
                      </div>
                      <div data-aos="fade-up">
                        <Field
                          type="password"
                          name="password"
                          placeholder="Password"
                          className={`form-control form-control-lg w-full p-4 border rounded-md ${
                            errors.password && touched.password
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        {errors.password && touched.password && (
                          <div className="text-red-500">{errors.password}</div>
                        )}
                      </div>
                    </div>

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
