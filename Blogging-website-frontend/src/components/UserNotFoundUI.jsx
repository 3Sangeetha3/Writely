import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserX, ArrowLeft, Home } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const UserNotFoundUI = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  return (
    <div className="min-h-screen grid justify-center items-start p-4 pt-16">
      <div className="w-full max-w-5xl">
        {/* Card with glass effect */}
        <div
          className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-md shadow-xl border border-white/20 p-8"
          data-aos="fade-up"
        >
            {/* Background decorative elements */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#53C7C0]/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[#53C7C0]/10 rounded-full blur-2xl"></div>
            <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-[#53C7C0]/10 rounded-full blur-xl"></div>
            <div className="relative z-10">
            {/* Icon with pulsing effect */}
            <div
              className="mx-auto w-24 h-24 mb-6 relative"
              data-aos="zoom-in"
              data-aos-delay="300"  
            >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#53C7C0]/20 to-[#53C7C0]/20 animate-pulse"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#53C7C0]/20 to-[#53C7C0]/20 animate-ping opacity-75"></div>
                <div className="relative w-full h-full rounded-full bg-white flex items-center justify-center shadow-sm">
                    <UserX size={40} className="text-rose-500" />
                </div>
            </div>
            {/* Main content */}
            <h1
                className="text-4xl font-bold text-center text-[#243635] mb-2"
                data-aos="fade-up"
                data-aos-delay="400"
            >
                User Not Found
            </h1>
            <p
                className="text-slate-500 text-center mb-8 mx-auto"
                data-aos="fade-up"
                data-aos-delay="500"
            >
                We couldn't locate the user you're looking for. They may have
                changed their username or deleted their account.
            </p>
            {/* Divider */}
            <div
                className="w-16 h-1 mx-auto bg-gradient-to-r from-[#53C7C0] to-[#45b1aa] rounded-full mb-8"
                data-aos="fade-up"
                data-aos-delay="550"
            ></div>
            {/* Action buttons */}
            <div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                data-aos="fade-up"
                data-aos-delay="600"
            >
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-[#53C7C0] hover:bg-[#45b1aa] text-white rounded-lg font-medium shadow-lg shadow-[#53C7C0]/20 hover:shadow-xl hover:shadow-[#53C7C0]/30 transition-all hover:-translate-y-0.5 focus:ring-2 focus:ring-[#53C7C0]/50 focus:outline-none"
                >
                    <Home size={18} />
                    Back to Home
                </button>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#243635] rounded-lg font-medium border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all focus:ring-2 focus:ring-slate-200 focus:outline-none"
                >
                    <ArrowLeft size={18} />
                    Go Back
                </button>
            </div>
            {/* Footer message
            <p
              className="text-slate-400 text-sm text-center mt-8"
              data-aos="fade-up"
              data-aos-delay="700"
            >
              Need help?{" "}
              <a
                href="/"
                className="text-[#53C7C0] hover:text-[#45b1aa] underline-offset-2 hover:underline"
              >
                Contact support
              </a>
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserNotFoundUI;
