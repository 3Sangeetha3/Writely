import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState("Verifying email...");
  const { login } = useAuth();


  //Extracting token from URL
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  useEffect(() => {
    if (!token) {
      setMessage("Invalid token.");
      return;
    }

    const verify = async () => {
      try {
        //backend API call to verify email
        const VITE_API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
        const response = await axios.get(`${VITE_API_URL}/api/verify-email?token=${token}`);

        const { token: jwtToken } = response.data;
        login({ token: jwtToken });
        setMessage("Email verified successfully! Redirecting to home page...");

        //Redirecting to homepage after short delay
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }catch (error) {
        console.error("Error verifying email:", error.message);
        setMessage("Email verification failed. Please try again.");
      }
      
    };
    verify();
  }, [token, navigate, login]);
  return (
    <>
      <div>VerifyEmail</div>
      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <h2>{message}</h2>
      </div>
    </>
  );
};

export default VerifyEmail;
