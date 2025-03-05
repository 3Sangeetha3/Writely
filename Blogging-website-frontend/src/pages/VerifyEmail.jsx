import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks";
import { toast } from "react-hot-toast";

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
        const VITE_API_URL = import.meta.env.VITE_BACKEND_URL ;
        const response = await axios.get(`${VITE_API_URL}/api/verifyemail?token=${token}`);

        const { token: jwtToken } = response.data;
        login({ token: jwtToken });
        toast.success("Email has been verified, redirecting to homepage", {
          position: "top-right",
        });
        setMessage("Email verified successfully! Redirecting to home page...");

        //Redirecting to homepage after short delay
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }catch (error) {
        console.error("Error verifying email:", error.message);
        toast.error("Error in verifying the email", { position: "top-right" });
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
