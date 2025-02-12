import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Formik, Field, Form } from "formik";
import { useAuth, useUserQuery } from "../hooks";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import SettingsPageImage from "../assets/settings_page.svg";
import "./settings.css";

function Settings() {
  const { logout } = useAuth();
  const { isCurrentUserLoading, currentUser, currentUserError } =
    useUserQuery();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000, 
      easing: "ease-in-out",
      once: true, 
    });
  }, []);

  async function onSubmit(values, { setErrors }) {
    try {
      const VITE_API_URL = import.meta.env.VITE_BACKEND_URL ;
      const { data } = await axios.put(
        `${VITE_API_URL}/api/user`,
        { user: values }
      );

      const updatedUsername = data?.user?.username;
      logout(data?.user);
      queryClient.invalidateQueries(`/profiles/${updatedUsername}`);
      queryClient.invalidateQueries(`/user`);
      navigate(`/login`);
    } catch (error) {
      const { status, data } = error.response;
      if (status === 422) {
        setErrors(data.errors);
      }
    }
  }

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
                        <div data-aos="fade-up">
                          <Field
                            type="text"
                            name="image"
                            placeholder="URL of profile pic"
                            className="form-control form-control-lg w-full p-4 border rounded-md"
                          />
                        </div>
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
    </div>
  );
}

export default Settings;
