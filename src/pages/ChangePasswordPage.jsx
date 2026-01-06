import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthAPI } from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle, FaCheck, FaTimes } from "react-icons/fa";

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
        { test: (password) => /[!@#$%^&*]/.test(password), message: "Ít nhất một ký tự đặc biệt" },
    ];

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMsg("");
        setErrorMsg("");

        const unmetConditions = passwordConditions.filter((condition) => !condition.test(newPassword));
        if (unmetConditions.length > 0) {
            setErrorMsg("Mật khẩu chưa đáp ứng đủ điều kiện bảo mật!");
            setTimeout(() => setErrorMsg(""), 3000);
            setLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMsg("Mật khẩu xác nhận không khớp!");
            setTimeout(() => setErrorMsg(""), 3000);
            setLoading(false);
            return;
        }

        try {
            const response = await AuthAPI.resetPassword(
                { newPassword },
                { headers: { Authorization: `Bearer ${resetToken}` } }
            );
            setSuccessMsg(response.data.message || "Đổi mật khẩu thành công!");
            setTimeout(() => {
                setSuccessMsg("");
                navigate("/login");
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
            <AnimatePresence>
                {successMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-white border border-green-200 text-green-700 px-6 py-3 rounded-xl shadow-xl font-semibold text-sm flex items-center gap-2"
                    >
                        <FaCheckCircle className="text-green-500 text-xl" />
                        <span>{successMsg}</span>
                    </motion.div>
                )}
                {errorMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-white border border-red-200 text-red-700 px-6 py-3 rounded-xl shadow-xl font-semibold text-sm flex items-center gap-2"
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
                className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
            >
                {/* Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 shadow-lg">
                        <FaLock className="text-white text-2xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 text-center">
                        Đổi mật khẩu
                    </h2>
                    <p className="text-gray-500 text-sm text-center mt-2">
                        Tạo mật khẩu mới cho tài khoản
                    </p>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-5">
                    {/* Mật khẩu mới */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-2 text-sm">
                            Mật khẩu mới
                        </label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Nhập mật khẩu mới"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl transition-all duration-300 bg-gray-50 text-base focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 focus:bg-white placeholder-gray-400 outline-none"
                            />
                            <span
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer text-lg hover:text-gray-600 transition-colors"
                                onClick={() => setShowNewPassword((v) => !v)}
                            >
                                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        {/* Password strength indicators */}
                        <ul className="mt-3 space-y-1">
                            {passwordConditions.map((condition, index) => (
                                <li key={index} className="flex items-center gap-2 text-sm">
                                    {condition.test(newPassword) ? (
                                        <FaCheck className="text-green-500 text-xs" />
                                    ) : (
                                        <FaTimes className="text-gray-300 text-xs" />
                                    )}
                                    <span className={condition.test(newPassword) ? "text-green-600" : "text-gray-400"}>
                                        {condition.message}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Xác nhận mật khẩu */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-2 text-sm">
                            Xác nhận mật khẩu
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Nhập lại mật khẩu mới"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl transition-all duration-300 bg-gray-50 text-base focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 focus:bg-white placeholder-gray-400 outline-none"
                            />
                            <span
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer text-lg hover:text-gray-600 transition-colors"
                                onClick={() => setShowConfirmPassword((v) => !v)}
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        {confirmPassword && (
                            <p className={`mt-2 text-sm flex items-center gap-1 ${newPassword === confirmPassword ? "text-green-600" : "text-red-500"}`}>
                                {newPassword === confirmPassword ? (
                                    <><FaCheck className="text-xs" /> Mật khẩu khớp</>
                                ) : (
                                    <><FaTimes className="text-xs" /> Mật khẩu không khớp</>
                                )}
                            </p>
                        )}
                    </div>

                    {/* Nút đổi mật khẩu */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-base flex items-center justify-center gap-2 ${loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
                            }`}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                </svg>
                                Đang xử lý...
                            </>
                        ) : (
                            "Đổi mật khẩu"
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default ChangePasswordPage;