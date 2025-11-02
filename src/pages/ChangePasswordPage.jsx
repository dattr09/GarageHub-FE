import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthAPI } from "../services/api";
import { toast } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const containerVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1,
        },
    },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const ChangePasswordPage = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const resetToken = location.state?.resetToken;

    const passwordConditions = [
        { test: (password) => password.length >= 8, message: "Ít nhất 8 ký tự" },
        { test: (password) => /[A-Z]/.test(password), message: "Ít nhất một chữ hoa" },
        { test: (password) => /[0-9]/.test(password), message: "Ít nhất một chữ số" },
        { test: (password) => /[!@#$%^&*]/.test(password), message: "Ít nhất một ký tự đặc biệt (!@#$%^&*)" },
    ];

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMsg("");
        setErrorMsg("");

        // Kiểm tra tất cả điều kiện bảo mật
        const unmetConditions = passwordConditions.filter((condition) => !condition.test(newPassword));
        if (unmetConditions.length > 0) {
            toast.error("Mật khẩu chưa đáp ứng đủ điều kiện bảo mật!");
            setLoading(false);
            return;
        }

        // Kiểm tra mật khẩu xác nhận
        if (newPassword !== confirmPassword) {
            toast.error("Mật khẩu xác nhận không khớp!");
            setLoading(false);
            return;
        }

        try {
            const response = await AuthAPI.resetPassword(
                { newPassword },
                { headers: { Authorization: `Bearer ${resetToken}` } }
            );
            setSuccessMsg(response.data.message || "Đổi mật khẩu thành công!");
            toast.success(response.data.message);
            setTimeout(() => {
                setSuccessMsg("");
                navigate("/login");
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
                <AnimatePresence>
                    {successMsg && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-white border border-blue-200 text-green-700 px-6 py-3 rounded-lg shadow-xl font-semibold text-sm flex items-center justify-center gap-2 whitespace-nowrap"
                            style={{ minWidth: 280, maxWidth: "90vw" }}
                        >
                            <FaCheckCircle className="text-green-700 text-2xl" />
                            <span className="truncate text-center">{successMsg}</span>
                        </motion.div>
                    )}
                    {errorMsg && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-white border border-red-200 text-red-700 px-6 py-3 rounded-lg shadow-xl font-semibold text-sm flex items-center justify-center gap-2 whitespace-nowrap"
                            style={{ minWidth: 280, maxWidth: "90vw" }}
                        >
                            <FaTimesCircle className="text-red-500 text-2xl" />
                            <span className="truncate text-center">{errorMsg}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="w-full max-w-md bg-white rounded-lg shadow-lg p-6"
                >
                    <motion.h2
                        variants={itemVariants}
                        className="text-3xl font-extrabold text-blue-800 text-center mb-8 tracking-wide drop-shadow"
                    >
                        Đổi mật khẩu
                    </motion.h2>
                    <motion.form
                        variants={itemVariants}
                        onSubmit={handleChangePassword}
                        className="space-y-4"
                    >
                        {/* Mật khẩu mới */}
                        <motion.div variants={itemVariants}>
                            <label className="block font-semibold text-gray-700 mb-2 text-lg tracking-wide">
                                Mật khẩu mới
                            </label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Nhập mật khẩu mới"
                                    className="w-full px-5 py-3 border-2 rounded-lg transition-all duration-300 bg-white text-base shadow-sm border-gray-300 focus:border-blue-400 placeholder-gray-400 outline-none"
                                />
                                <span
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer text-lg"
                                    onClick={() => setShowNewPassword((v) => !v)}
                                    tabIndex={0}
                                    role="button"
                                    aria-label={showNewPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                >
                                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                            <ul className="mt-2 text-sm">
                                {passwordConditions.map((condition, index) => (
                                    <li key={index} className="flex items-center">
                                        {condition.test(newPassword) ? (
                                            <span className="text-green-500 mr-2">✔</span>
                                        ) : (
                                            <span className="text-red-500 mr-2">✖</span>
                                        )}
                                        <span>{condition.message}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                        {/* Xác nhận mật khẩu */}
                        <motion.div variants={itemVariants}>
                            <label className="block font-semibold text-gray-700 mb-2 text-lg tracking-wide">
                                Xác nhận mật khẩu
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Nhập lại mật khẩu mới"
                                    className="w-full px-5 py-3 border-2 rounded-lg transition-all duration-300 bg-white text-base shadow-sm border-gray-300 focus:border-blue-400 placeholder-gray-400 outline-none"
                                />
                                <span
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer text-lg"
                                    onClick={() => setShowConfirmPassword((v) => !v)}
                                    tabIndex={0}
                                    role="button"
                                    aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </motion.div>
                        {/* Nút đổi mật khẩu */}
                        <motion.div variants={itemVariants}>
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
                                    "Đổi mật khẩu"
                                )}
                            </button>
                        </motion.div>
                    </motion.form>
                </motion.div>
            </div>
        </>
    );
};

export default ChangePasswordPage;