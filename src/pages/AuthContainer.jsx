import React from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Login from "./LoginPage";
import Register from "./RegisterPage";

export default function AuthContainer() {
  const location = useLocation();
  const isRegister = location.pathname === "/register";

  return (
    <>
      <style>
        {`
          @keyframes gradient-x {
            0%, 100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 6s ease-in-out infinite;
          }
        `}
      </style>

      <div className="flex items-center justify-center w-full min-h-screen animate-gradient-x bg-gradient-to-br from-blue-500 via-indigo-200 via-cyan-100 to-blue-200">
        <div className="relative bg-white/60 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden max-w-4xl min-h-[650px] w-full"> 
          <motion.div
            className="hidden md:flex flex-col items-center justify-center absolute top-0 left-0 h-full w-1/2 z-10
              bg-gradient-to-br from-blue-500 via-indigo-400 via-cyan-300 to-blue-200
              animate-gradient-x text-white px-10 py-12"
            initial={false}
            animate={{
              x: isRegister ? "100%" : "0%",
            }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            <motion.img
              src={
                isRegister
                  ? "/Logo_GarageHub.png"
                  : "/Logo_GarageHub.png"
              }
              alt="GarageMaster Logo"
              style={{ width: "280px", height: "280px", objectFit: "contain" }}
              className="mb-6 rounded-full"
              key={isRegister ? "logo-register" : "logo-login"}
              initial={{ x: isRegister ? -500 : 500, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
            />

            <h3 className="text-3xl font-bold mb-3 text-white drop-shadow text-center tracking-wide">
              Garage Hub
            </h3>
            <div className="w-full flex flex-col items-center justify-center mt-2">
              <span className="block text-base font-semibold text-blue-50 text-center tracking-wide">
                Đam mê tốc độ, chọn Garage Hub đồng hành
              </span>
              <span className="block text-base font-semibold text-blue-50 text-center tracking-wide mt-1">
                Xe ngon – Đường xa cũng hóa gần!
              </span>
            </div>
          </motion.div>

          <div className="absolute top-0 h-full w-1/2 right-0 md:block hidden z-20">
            <AnimatePresence mode="wait">
              {location.pathname === "/login" && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="h-full flex items-center"
                >
                  <Login />
                </motion.div>
              )}
              {location.pathname === "/register" && (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="h-full flex items-center"
                  style={{ position: "absolute", left: "-100%", width: "100%" }}
                >
                  <Register />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="md:hidden w-full p-4">
            <AnimatePresence mode="wait">
              {location.pathname === "/login" && (
                <motion.div
                  key="login-m"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                >
                  <Login />
                </motion.div>
              )}
              {location.pathname === "/register" && (
                <motion.div
                  key="register-m"
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                >
                  <Register />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}