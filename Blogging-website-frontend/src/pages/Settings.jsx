import React, { useEffect, useRef, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Formik, Field, Form } from "formik";
import { useAuth, useUserQuery } from "../hooks";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import SettingsPageImage from "../assets/settings_page.svg";
import "./settings.css";
import Lottie from "lottie-react";
import updateDetailsImage from "../assets/UpdateDetails.json";

function Settings() {
  const { logout } = useAuth();
  const { isCurrentUserLoading, currentUser, currentUserError } =
    useUserQuery();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  // Create a ref for the file input
  const fileInputRef = useRef(null);

  // Modal state variables
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [shouldLogout, setShouldLogout] = useState(false);

  // Preview state for the image preview feature
  const [preview, setPreview] = useState(currentUser?.user?.image || "");

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  async function onSubmit(values, { setErrors }) {
    const formData = new FormData();
    const userObj = {
      username: values.username,
      bio: values.bio,
      email: values.email,
      password: values.password,
      image: values.image,
    };

    formData.append("user", JSON.stringify(userObj));

    // Get the file from the ref
    const file = fileInputRef.current?.files[0];
    if (file) {
      formData.append("imageFile", file);
    }
    // showing how data is being sent to backend
    //   console.log("Data sent to backend: ", formData);

    try {
      const VITE_API_URL = import.meta.env.VITE_BACKEND_URL;
      const { data } = await axios.put(`${VITE_API_URL}/api/user`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedUsername = data?.user?.username;
      // console.log("Image uploaded: ", data?.user?.image);

      // Updating the query caches
      queryClient.invalidateQueries(`/profiles/${updatedUsername}`);
      queryClient.invalidateQueries(`/user`);

      // If the user updates their password, logout and redirecting to login page again
      if (values.password && values.password.trim() !== "") {
        // Modal popUp for successful password update
        setModalTitle("Password Changed!");
        setModalMessage(
          "Your password has been changed successfully. Please log in again."
        );
        setShouldLogout(true);
        // console.log("User updated password successfully: ", data);
        // logout();
        // navigate("/login");
      } else {
        // Modal popup for successful update
        setModalTitle("Profile Updated!");
        setModalMessage("Your profile has been updated successfully.");
        setShouldLogout(false);
        // console.log("User updated details successfully except password: ", data);
      }
      setIsModalOpen(true);
    } catch (error) {
      const { status, data } = error.response;
      if (status === 422) {
        setErrors(data.errors);
      }
    }
  }

  // handler for modal confirmation
  const handleModalConfirm = () => {
    setIsModalOpen(false);
    if (shouldLogout) {
      logout();
      navigate("/login");
    }
  };

  return (
    <div className="settings-page" data-aos="fade-up">
      <div className="container mx-auto">
        <h1 className="text-center text-4xl font-bold text-[#475756] mb-8">
          Settings
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Settings Form */}
          <div className="md:pr-8" data-aos="fade-right">
            <Formik
              initialValues={{
                image: currentUser?.user?.image || "",
                username: currentUser?.user?.username || "",
                bio: currentUser?.user?.bio || "",
                email: currentUser?.user?.email || "",
                password: "",
              }}
              onSubmit={onSubmit}
              enableReinitialize
            >
              {({ isSubmitting }) => (
                <>
                  <Form>
                    <fieldset disabled={isSubmitting}>
                      <div className="space-y-2">
                        {/* Preview image */}
                        {preview && (
                          <div
                            data-aos="fade-up"
                            className="flex justify-center"
                          >
                            <img
                              src={preview}
                              alt="Preview"
                              className="w-32 h-32 object-cover rounded-full"
                            />
                          </div>
                        )}
                        {/* Image URL field */}
                        <div data-aos="fade-up">
                          <Field
                            type="text"
                            name="image"
                            placeholder="URL of profile pic"
                            className="form-control form-control-lg w-full p-4 border rounded-md"
                          />
                        </div>
                        {/* File upload field using useRef */}
                        <div data-aos="fade-up">
                          <input
                            type="file"
                            ref={fileInputRef}
                            placeholder="Upload profile pic"
                            className="form-control form-control-lg w-full p-4 border rounded-md"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const previewUrl = URL.createObjectURL(file);
                                setPreview(previewUrl);
                              }
                            }}
                          />
                        </div>
                        {/* Username, bio, email, password fields */}
                        <div data-aos="fade-up">
                          <Field
                            type="text"
                            name="username"
                            placeholder="Your Name"
                            className="form-control form-control-lg w-full p-4 border rounded-md"
                          />
                        </div>
                        <div data-aos="fade-up">
                          <Field
                            as="textarea"
                            name="bio"
                            rows={8}
                            placeholder="Short bio about you"
                            className="form-control form-control-lg w-full p-4 border rounded-md"
                          />
                        </div>
                        <div data-aos="fade-up">
                          <Field
                            type="text"
                            name="email"
                            placeholder="Email"
                            className="form-control form-control-lg w-full p-4 border rounded-md"
                          />
                        </div>
                        <div data-aos="fade-up">
                          <Field
                            type="password"
                            name="password"
                            placeholder="Password"
                            className="form-control form-control-lg w-full p-4 border rounded-md"
                          />
                        </div>
                      </div>
                      <div className="text-center m-4">
                        <button
                          type="submit"
                          className="bg-[#243635] text-[#FCFBF9] text-xl px-16 py-4 m-2 rounded-full"
                        >
                          Update
                        </button>
                      </div>
                    </fieldset>
                  </Form>
                  <hr />
                  <div className="text-center m-4">
                    <button
                      onClick={() => {
                        logout();
                        navigate("/");
                      }}
                      type="button"
                      className="bg-[#FF4C4C] text-[#FCFBF9] text-xl px-16 py-4 m-2 rounded-full"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </Formik>
          </div>
          {/* Right Column - SVG Image */}
          <div className="md:pl-8" data-aos="fade-left">
            <div className="flex justify-center items-center mt-10">
              <img
                src={SettingsPageImage}
                alt="Settings Illustration"
                className="w-full max-w-md"
              />
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-white opacity-50"
            onClick={handleModalConfirm}
          ></div>
          {/* Modal content */}
          <div className="bg-white rounded-lg shadow-lg z-50 p-6 max-w-sm mx-auto">
            <div className="justify-center items-center">
              <Lottie
                animationData={updateDetailsImage}
                loop={true}
                className="w-3/5 mx-auto"
              />
            </div>
            <h2 className="text-[#53C7C0] text-xl text-center font-semibold mb-4">
              {modalTitle}
            </h2>
            <p className="mb-4 text-center text-gray-700">{modalMessage}</p>
            <div className="flex justify-center">
              <button
                onClick={handleModalConfirm}
                className="px-4 py-2 bg-[#53C7C0] text-white rounded hover:bg-[#4eb5ae] focus:outline-none"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
