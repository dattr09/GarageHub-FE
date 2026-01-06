import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthAPI } from "../services/api";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaCheckCircle, FaTimesCircle, FaArrowLeft } from "react-icons/fa";

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
            setTimeout(() => {
                setSuccessMsg("");
                navigate("/verify-password", { state: { email } });
            }, 2000);
        } catch (error) {
            setErrorMsg(error.response?.data?.message || "Có lỗi xảy ra!");
            setTimeout(() => setErrorMsg(""), 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-sky-50">
            {/* Thông báo */}
            <AnimatePresence>
                {successMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: -30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -30, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="fixed left-1/2 top-8 z-50 -translate-x-1/2 flex items-center gap-3 rounded-xl px-6 py-4 shadow-xl text-base font-semibold bg-white border border-green-200 text-green-700"
                        role="alert"
                    >
                        <FaCheckCircle className="text-green-500 text-xl" />
                        <span>{successMsg}</span>
                    </motion.div>
                )}
                {errorMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: -30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -30, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="fixed left-1/2 top-8 z-50 -translate-x-1/2 flex items-center gap-3 rounded-xl px-6 py-4 shadow-xl text-base font-semibold bg-white border border-red-200 text-red-700"
                        role="alert"
                    >
                        <FaTimesCircle className="text-red-500 text-xl" />
                        <span>{errorMsg}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md px-8 py-10 bg-white rounded-2xl shadow-xl border border-gray-100"
            >
                {/* Header with icon */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 shadow-lg">
                        <FaEnvelope className="text-white text-2xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 text-center">
                        Quên mật khẩu?
                    </h2>
                    <p className="text-gray-500 text-sm text-center mt-2">
                        Nhập email đăng ký để nhận mã OTP
                    </p>
                </div>

                <form onSubmit={handleForgotPassword} className="space-y-6">
                    <div>
                        <label className="block font-medium text-gray-700 mb-2 text-sm">
                            Email
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@email.com"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl transition-all duration-300 bg-gray-50 text-base focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 focus:bg-white placeholder-gray-400 outline-none"
                            />
                            <FaEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-500 text-lg pointer-events-none" />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-base flex items-center justify-center gap-2 ${loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                            }`}
                    >
                        {loading ? (
                            <>
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
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
                            "Gửi mã OTP"
                        )}
                    </button>
                </form>
                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate("/login")}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-cyan-600 font-medium text-sm transition-colors"
                        type="button"
                    >
                        <FaArrowLeft className="text-xs" />
                        Quay lại đăng nhập
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPasswordPage;