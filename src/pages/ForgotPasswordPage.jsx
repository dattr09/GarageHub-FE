import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthAPI } from "../services/api";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setSuccessMsg("");
        setErrorMsg("");
        setLoading(true);
        try {
            const response = await AuthAPI.forgotPassword({ email });
            setSuccessMsg(response.data.message || "OTP đã được gửi!");
            toast.success(response.data.message);
            setTimeout(() => {
                setSuccessMsg("");
                navigate("/verify-password", { state: { email } });
            }, 2000);
        } catch (error) {
            setErrorMsg(error.response?.data?.message || "Có lỗi xảy ra!");
            toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
            setTimeout(() => setErrorMsg(""), 3000);
        } finally {
            setLoading(false);
        }
    };

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

            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-indigo-200 via-cyan-100 to-blue-200 animate-gradient-x">
                {/* Thông báo */}
                <AnimatePresence>
                    {successMsg && (
                        <motion.div
                            initial={{ opacity: 0, y: -30, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -30, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="fixed left-1/2 top-8 z-50 -translate-x-1/2 flex items-center gap-3 rounded-xl px-6 py-4 shadow-2xl text-base font-semibold bg-green-50 text-green-700 border border-green-200"
                            role="alert"
                        >
                            <FaCheckCircle className="text-green-500 text-2xl" />
                            <span className="whitespace-pre-line">{successMsg}</span>
                        </motion.div>
                    )}
                    {errorMsg && (
                        <motion.div
                            initial={{ opacity: 0, y: -30, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -30, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="fixed left-1/2 top-8 z-50 -translate-x-1/2 flex items-center gap-3 rounded-xl px-6 py-4 shadow-2xl text-base font-semibold bg-red-50 text-red-700 border border-red-200"
                            role="alert"
                        >
                            <FaTimesCircle className="text-red-500 text-2xl" />
                            <span className="whitespace-pre-line">{errorMsg}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-md px-8 py-8 bg-white/80 rounded-2xl shadow-xl backdrop-blur-md"
                >
                    <h2 className="text-3xl font-extrabold text-blue-800 text-center mb-8 tracking-wide drop-shadow">
                        Quên mật khẩu
                    </h2>
                    <form onSubmit={handleForgotPassword} className="space-y-7">
                        <div>
                            <label className="block font-semibold text-gray-700 mb-2 text-lg tracking-wide">
                                Nhập email của bạn
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email đã đăng ký"
                                    className="w-full px-5 py-3 border-2 rounded-lg transition-all duration-300 bg-white text-base shadow-sm border-gray-300 focus:border-blue-400 placeholder-gray-400 outline-none"
                                />
                                <FaEnvelope className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 text-xl pointer-events-none" />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`cursor-pointer w-full py-3 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold rounded-lg shadow-lg transition-all duration-300 text-lg tracking-wide flex items-center justify-center gap-2 ${loading ? "opacity-60 cursor-not-allowed" : ""
                                }`}
                        >
                            {loading ? (
                                <>
                                    <svg
                                        className="animate-spin h-6 w-6 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                        ></path>
                                    </svg>
                                    Đang gửi...
                                </>
                            ) : (
                                "Gửi hướng dẫn"
                            )}
                        </button>
                    </form>
                    <div className="mt-8 text-center">
                        <button
                            onClick={() => navigate("/login")}
                            className="text-blue-700 hover:underline font-semibold cursor-pointer text-base"
                            type="button"
                        >
                            Quay lại đăng nhập
                        </button>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default ForgotPasswordPage;