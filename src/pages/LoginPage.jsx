import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthAPI } from "../services/api";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

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

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [focusField, setFocusField] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setSuccessMsg("");
        setErrorMsg("");
        try {
            const response = await AuthAPI.login({ email, password });
            localStorage.setItem("userId", response.data.user.userId);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            setSuccessMsg(response.data.message || "Đăng nhập thành công!");
            setTimeout(() => {
                setSuccessMsg("");
                navigate("/");
            }, 2000);
        } catch (error) {
            console.error("Đăng nhập thất bại:", error);
            setErrorMsg(error.response?.data?.message || "Đăng nhập thất bại!");
            setTimeout(() => setErrorMsg(""), 3000);
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full px-8 py-4 relative"
        >
            <AnimatePresence>
                {successMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-white border border-green-200 text-green-700 px-6 py-3 rounded-xl shadow-xl font-semibold text-sm flex items-center justify-center gap-2 whitespace-nowrap"
                        style={{ minWidth: 280, maxWidth: "90vw" }}
                    >
                        <FaCheckCircle className="text-green-500 text-xl" />
                        <span className="truncate text-center">{successMsg}</span>
                    </motion.div>
                )}
                {errorMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-white border border-red-200 text-red-700 px-6 py-3 rounded-xl shadow-xl font-semibold text-sm flex items-center justify-center gap-2 whitespace-nowrap"
                        style={{ minWidth: 280, maxWidth: "90vw" }}
                    >
                        <FaTimesCircle className="text-red-500 text-xl" />
                        <span className="truncate text-center">{errorMsg}</span>
                    </motion.div>
                )}
            </AnimatePresence>
            <motion.h2
                variants={itemVariants}
                className="text-3xl font-bold text-gray-800 text-center mb-8 tracking-wide"
            >
                Đăng nhập
            </motion.h2>
            <motion.form
                variants={itemVariants}
                onSubmit={handleLogin}
                className="space-y-5"
            >
                <motion.div variants={itemVariants}>
                    <label className="block font-medium text-gray-700 mb-2 text-sm">
                        Email
                    </label>
                    <div className="relative">
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setFocusField("email")}
                            onBlur={() => setFocusField("")}
                            autoComplete="username"
                            placeholder="Nhập email của bạn"
                            className={`w-full px-4 py-3 border rounded-xl transition-all duration-300 bg-gray-50 text-base
                                ${focusField === "email"
                                    ? "border-cyan-500 ring-2 ring-cyan-200 bg-white"
                                    : "border-gray-200 hover:border-gray-300"
                                }
                                placeholder-gray-400 outline-none`}
                        />
                        <motion.span
                            initial={false}
                            animate={{
                                opacity: focusField === "email" ? 1 : 0.5,
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-500 text-lg pointer-events-none"
                            transition={{ duration: 0.2 }}
                        >
                            <FaEnvelope />
                        </motion.span>
                    </div>
                </motion.div>
                <motion.div variants={itemVariants}>
                    <label className="block font-medium text-gray-700 mb-2 text-sm">
                        Mật khẩu
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setFocusField("password")}
                            onBlur={() => setFocusField("")}
                            autoComplete="current-password"
                            placeholder="Nhập mật khẩu"
                            className={`w-full px-4 py-3 border rounded-xl transition-all duration-300 bg-gray-50 text-base
                                ${focusField === "password"
                                    ? "border-cyan-500 ring-2 ring-cyan-200 bg-white"
                                    : "border-gray-200 hover:border-gray-300"
                                }
                                placeholder-gray-400 outline-none`}
                        />
                        <span
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer text-lg hover:text-gray-600 transition-colors"
                            onClick={() => setShowPassword((v) => !v)}
                            tabIndex={0}
                            role="button"
                            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <div className="text-right mt-2">
                        <button
                            type="button"
                            className="text-cyan-600 hover:text-cyan-700 hover:underline font-medium text-sm transition-colors"
                            onClick={() => navigate("/forgot-password")}
                        >
                            Quên mật khẩu?
                        </button>
                    </div>
                </motion.div>
                <motion.div variants={itemVariants}>
                    <button
                        type="submit"
                        className="cursor-pointer w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-base flex items-center justify-center gap-2"
                    >
                        Đăng nhập
                    </button>
                </motion.div>
            </motion.form>

            <motion.div variants={itemVariants} className="flex items-center my-6">
                <div className="flex-grow h-px bg-gray-200"></div>
                <span className="mx-4 text-gray-400 font-medium text-sm">hoặc</span>
                <div className="flex-grow h-px bg-gray-200"></div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col gap-3">
                <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl bg-white border border-gray-200 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                    <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        alt="Google"
                        className="w-5 h-5"
                    />
                    <span className="font-medium text-gray-700 text-sm">
                        Đăng nhập với Google
                    </span>
                </button>
                <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl bg-gray-900 border border-gray-800 shadow-sm hover:bg-gray-800 transition-all"
                >
                    <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M16.365 1.43c0 1.14-.93 2.06-2.07 2.06-.02-1.18.95-2.07 2.07-2.06zm3.82 17.52c-.13.29-.26.57-.41.84-.27.48-.56.94-.91 1.36-.57.7-1.16 1.39-2.02 1.41-.8.02-1.06-.46-2.01-.46-.95 0-1.24.44-2.01.47-.86.03-1.52-.75-2.09-1.45-1.44-1.77-2.54-5.01-1.06-7.2.73-1.13 2.04-1.85 3.31-1.87.82-.02 1.6.53 2.01.53.41 0 1.27-.65 2.14-.56.36.02 1.38.15 2.03 1.14-.05.03-1.22.71-1.2 2.13.02 1.69 1.5 2.25 1.52 2.26-.02.07-.24.83-.8 1.65zm-3.44-13.97c.38-.46.64-1.1.57-1.75-.55.02-1.22.37-1.62.83-.36.41-.67 1.07-.55 1.7.6.05 1.22-.31 1.6-.78z" />
                    </svg>
                    <span className="font-medium text-white text-sm">
                        Đăng nhập với Apple
                    </span>
                </button>
            </motion.div>

            <motion.div
                variants={itemVariants}
                className="mt-8 text-center"
            >
                <span className="text-gray-500 text-sm">Chưa có tài khoản?</span>
                <button
                    onClick={() => navigate("/register")}
                    className="ml-2 text-cyan-600 hover:text-cyan-700 hover:underline font-semibold cursor-pointer text-sm transition-colors"
                    type="button"
                >
                    Đăng ký
                </button>
            </motion.div>
        </motion.div>
    );
};

export default LoginPage;