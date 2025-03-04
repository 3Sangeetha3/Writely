import React, { useEffect, useRef, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth, useUserQuery } from "../hooks";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import SettingsPageImage from "../assets/settings_page.svg";
import "./settings.css";
import Lottie from "lottie-react";
import updateDetailsImage from "../assets/UpdateDetails.json";
import { Camera, User, FileText, Mail, Lock, LogOut } from "lucide-react";
import Skeleton from "@mui/material/Skeleton";

function Settings() {
  const { logout } = useAuth();
  const { isCurrentUserLoading, currentUser, currentUserError } = useUserQuery();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  // Modal state variables
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [shouldLogout, setShouldLogout] = useState(false);
  // Preview state for the image
  const [preview, setPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Validation schema
  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters"),
    bio: Yup.string().max(160, "Bio must be 160 characters or less"),
  });

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });
    // Set initial preview if user has an image
    if (currentUser?.user?.image) {
      setPreview(currentUser.user.image);
    }
  }, [currentUser]);

  // Handle image click to trigger file input
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  async function onSubmit(values, { setErrors, setSubmitting }) {
    setIsLoading(true);
    const formData = new FormData();
    const userObj = {
      username: values.username,
      bio: values.bio,
      email: values.email,
      password: values.password,
      image: values.image,
    };
    formData.append("user", JSON.stringify(userObj));
    const file = fileInputRef.current?.files[0];
    if (file) {
      formData.append("imageFile", file);
    }
    try {
      const VITE_API_URL = import.meta.env.VITE_BACKEND_URL;
      const { data } = await axios.put(`${VITE_API_URL}/api/user`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const updatedUsername = data?.user?.username;
      // Updating the query caches
      queryClient.invalidateQueries(`/profiles/${updatedUsername}`);
      queryClient.invalidateQueries(`/user`);
      if (values.password && values.password.trim() !== "") {
        setModalTitle("Password Changed!");
        setModalMessage(
          "Your password has been changed successfully. Please log in again."
        );
        setShouldLogout(true);
      } else {
        setModalTitle("Profile Updated!");
        setModalMessage("Your profile has been updated successfully.");
        setShouldLogout(false);
      }
      setIsModalOpen(true);
    } catch (error) {
      const { status, data } = error.response;
      if (status === 422) {
        setErrors(data.errors);
      }
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  }

  // Handler for modal confirmation
  const handleModalConfirm = () => {
    setIsModalOpen(false);
    if (shouldLogout) {
      logout();
      navigate("/login");
    }
  };

  return (
    <div
      className="mt-24 bg-[#F8F9FA] py-3 overflow-y-hidden"
      data-aos="fade-up"
    >
      <div className="container mx-auto px-2 max-w-5xl py-2">
        <h1 className="text-center text-4xl font-bold text-[#243635] mb-8">
          Account Settings
        </h1>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
            {/* Left Column - Settings Form */}
            <div className="md:col-span-3 p-6" data-aos="fade-right">
              <h2 className="text-2xl font-semibold text-[#243635] mb-5">
                Personal Information
              </h2>
              <Formik
                initialValues={{
                  image: currentUser?.user?.image || "",
                  username: currentUser?.user?.username || "",
                  bio: currentUser?.user?.bio || "",
                  email: currentUser?.user?.email || "",
                  password: "",
                }}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
                enableReinitialize
              >
                {({ isSubmitting, errors, touched }) => (
                  <Form>
                    <fieldset disabled={isSubmitting || isLoading}>
                      {/* Profile Image Section */}
                      <div
                        className="flex flex-col items-center mb-6"
                        data-aos="fade-up"
                      >
                        <div
                          onClick={handleImageClick}
                          className="relative cursor-pointer group"
                        >
                          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#53C7C0] shadow-md">
                            {preview ? (
                              <img
                                src={preview}
                                alt="Profile Preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <User size={36} className="text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera size={24} className="text-white" />
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          Click to change photo
                        </p>
                        {/* Hidden file input */}
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const previewUrl = URL.createObjectURL(file);
                              setPreview(previewUrl);
                            }
                          }}
                        />
                        {/* Image URL field - hidden but still functional */}
                        <div className="mt-2 w-full max-w-md">
                          <Field
                            type="text"
                            name="image"
                            placeholder="URL of profile pic (optional)"
                            className="form-control text-sm w-full p-2 border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                      {/* Username field */}
                      <div className="mb-3 relative" data-aos="fade-up">
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
                            placeholder="Your Username"
                            className={`w-full pl-10 p-2 border ${
                              errors.username && touched.username
                                ? "border-red-500"
                                : "border-gray-300"
                            } rounded-md focus:outline-none focus:ring-2 focus:ring-[#53C7C0]`}
                          />
                        </div>
                        <ErrorMessage
                          name="username"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                      {/* Bio field */}
                      <div className="mb-3" data-aos="fade-up">
                        <label className="block text-gray-700 mb-1 font-medium">
                          Bio
                        </label>
                        <div className="relative">
                          <div className="absolute top-2 left-3 pointer-events-none">
                            <FileText size={18} className="text-gray-400" />
                          </div>
                          <Field
                            as="textarea"
                            name="bio"
                            rows={3}
                            placeholder="Share a little about yourself"
                            className={`w-full pl-10 p-2 border ${
                              errors.bio && touched.bio
                                ? "border-red-500"
                                : "border-gray-300"
                            } rounded-md focus:outline-none focus:ring-2 focus:ring-[#53C7C0]`}
                          />
                        </div>
                        <div className="flex justify-between">
                          <ErrorMessage
                            name="bio"
                            component="div"
                            className="text-red-500 text-sm mt-1"
                          />
                          <div className="text-xs text-gray-500 mt-1">
                            Max 160 characters
                          </div>
                        </div>
                      </div>
                      {/* Email field */}
                      <div className="mb-3" data-aos="fade-up">
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
                            placeholder="Your Email"
                            className={`w-full pl-10 p-2 border ${
                              errors.email && touched.email
                                ? "border-red-500"
                                : "border-gray-300"
                            } rounded-md focus:outline-none focus:ring-2 focus:ring-[#53C7C0]`}
                          />
                        </div>
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                      {/* Password field */}
                      <div className="mb-4" data-aos="fade-up">
                        <label className="block text-gray-700 mb-1 font-medium">
                          Change Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock size={18} className="text-gray-400" />
                          </div>
                          <Field
                            type="password"
                            name="password"
                            placeholder="Leave blank to keep current password"
                            className={`w-full pl-10 p-2 border ${
                              errors.password && touched.password
                                ? "border-red-500"
                                : "border-gray-300"
                            } rounded-md focus:outline-none focus:ring-2 focus:ring-[#53C7C0]`}
                          />
                        </div>
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-red-500 text-sm mt-1"
                        />
                      </div>
                      {/* Buttons */}
                      <div className="flex flex-wrap gap-4 justify-between mt-6">
                        <button
                          type="submit"
                          disabled={isSubmitting || isLoading}
                          className="bg-[#53C7C0] hover:bg-[#45b1aa] text-white font-medium px-6 py-2 rounded-lg transition-colors flex items-center"
                        >
                          {isLoading ? (
                            <>
                              <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                              Updating...
                            </>
                          ) : (
                            "Save Changes"
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to log out?"
                              )
                            ) {
                              logout();
                              navigate("/");
                            }
                          }}
                          className="bg-[#FF4C4C] border border-gray-300 text-white hover:bg-red-600 font-medium px-6 py-2 rounded-lg transition-colors flex items-center"
                        >
                          <LogOut size={16} className="mr-2" />
                          Logout
                        </button>
                      </div>
                    </fieldset>
                  </Form>
                )}
              </Formik>
            </div>
            {/* Right Column - Image & Info */}
            <div
              className="bg-gradient-to-br from-[#E7F9F8] to-[#F0FDFC] md:col-span-2 p-6 flex flex-col items-center justify-center"
              data-aos="fade-left"
            >
              <div className="max-w-xs">
                <img
                  src={SettingsPageImage}
                  alt="Settings Illustration"
                  className="w-full mb-6"
                />
                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-[#243635] mb-2">
                    Tips for Your Profile
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <div className="bg-[#53C7C0] rounded-full h-5 w-5 flex items-center justify-center text-white text-xs mt-0.5 mr-2">
                        1
                      </div>
                      <span>
                        Add a profile photo to personalize your account
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-[#53C7C0] rounded-full h-5 w-5 flex items-center justify-center text-white text-xs mt-0.5 mr-2">
                        2
                      </div>
                      <span>
                        Write a brief bio to tell others about yourself
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-[#53C7C0] rounded-full h-5 w-5 flex items-center justify-center text-white text-xs mt-0.5 mr-2">
                        3
                      </div>
                      <span>Use a strong, unique password for security</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={handleModalConfirm}
          ></div>
          <div
            className="bg-white rounded-xl shadow-xl z-50 p-6 max-w-sm mx-auto transform transition-all"
            data-aos="zoom-in"
          >
            <div className="flex justify-center items-center mb-4">
              <Lottie
                animationData={updateDetailsImage}
                loop={true}
                className="w-3/5 mx-auto"
              />
            </div>
            <h2 className="text-[#53C7C0] text-xl text-center font-semibold mb-3">
              {modalTitle}
            </h2>
            <p className="mb-5 text-center text-gray-700">{modalMessage}</p>
            <div className="flex justify-center">
              <button
                onClick={handleModalConfirm}
                className="px-6 py-2 bg-[#53C7C0] text-white rounded-lg hover:bg-[#45b1aa] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#53C7C0]"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;