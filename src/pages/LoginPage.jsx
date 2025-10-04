import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-hot-toast";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [focusField, setFocusField] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/auth/login", { email, password });
            toast.success(response.data.message);
            navigate("/dashboard"); // Chuyển hướng sau khi đăng nhập thành công
        } catch (error) {
            toast.error(error.response?.data?.message || "Đăng nhập thất bại!");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="w-full px-8 py-4 relative"
        >
            <h2 className="text-3xl font-extrabold text-blue-800 text-center mb-8 tracking-wide drop-shadow">
                Đăng nhập
            </h2>
            <form onSubmit={handleLogin} className="space-y-4">
                {/* Email */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <label className="block font-semibold text-gray-700 mb-2 text-lg tracking-wide">
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
                            className={`w-full px-5 py-3 border-2 rounded-lg transition-all duration-300 bg-white text-base shadow-sm
                ${focusField === "email"
                                    ? "border-blue-500 ring-2 ring-blue-200"
                                    : "border-gray-300 focus:border-blue-400"
                                }
                placeholder-gray-400`}
                        />
                        <motion.span
                            initial={false}
                            animate={{
                                opacity: focusField === "email" ? 1 : 0,
                                x: focusField === "email" ? 0 : -10,
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 text-xl pointer-events-none"
                            transition={{ duration: 0.2 }}
                        >
                            <i className="fas fa-envelope"></i>
                        </motion.span>
                    </div>
                </motion.div>
                {/* Mật khẩu */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <label className="block font-semibold text-gray-700 mb-2 text-lg tracking-wide">
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
                            className={`w-full px-5 py-3 border-2 rounded-lg transition-all duration-300 bg-white text-base shadow-sm
                ${focusField === "password"
                                    ? "border-blue-500 ring-2 ring-blue-200"
                                    : "border-gray-300 focus:border-blue-400"
                                }
                placeholder-gray-400`}
                        />
                        <span
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer text-lg"
                            onClick={() => setShowPassword((v) => !v)}
                            tabIndex={0}
                            role="button"
                            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                            style={{ padding: 0 }}
                        >
                            {showPassword ? (
                                <i className="fas fa-eye-slash"></i>
                            ) : (
                                <i className="fas fa-eye"></i>
                            )}
                        </span>
                    </div>
                    {/* Nút quên mật khẩu */}
                    <div className="text-right mt-2">
                        <button
                            type="button"
                            className="text-blue-600 hover:underline font-medium text-sm"
                            onClick={() => navigate("/forgot-password")}
                        >
                            Quên mật khẩu?
                        </button>
                    </div>
                </motion.div>
                {/* Nút đăng nhập */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <button
                        type="submit"
                        className="cursor-pointer w-full py-3 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold rounded-lg shadow-lg transition-all duration-300 text-lg tracking-wide flex items-center justify-center gap-2"
                    >
                        Đăng nhập
                    </button>
                </motion.div>
            </form>

            {/* Phân cách "hoặc" */}
            <div className="flex items-center my-4">
                <div className="flex-grow h-px bg-gray-300"></div>
                <span className="mx-4 text-gray-500 font-semibold">hoặc</span>
                <div className="flex-grow h-px bg-gray-300"></div>
            </div>

            {/* Đăng nhập với Google hoặc Apple */}
            <div className="flex flex-col gap-3">
                <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 py-2 rounded-lg bg-white border border-gray-300 shadow hover:bg-gray-50 transition"
                >
                    <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        alt="Google"
                        className="w-6 h-6"
                    />
                    <span className="font-semibold text-gray-700 text-sm">
                        Đăng nhập với Google
                    </span>
                </button>
                <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 py-2 rounded-lg bg-black border border-gray-800 shadow hover:bg-gray-900 transition"
                >
                    <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M16.365 1.43c0 1.14-.93 2.06-2.07 2.06-.02-1.18.95-2.07 2.07-2.06zm3.82 17.52c-.13.29-.26.57-.41.84-.27.48-.56.94-.91 1.36-.57.7-1.16 1.39-2.02 1.41-.8.02-1.06-.46-2.01-.46-.95 0-1.24.44-2.01.47-.86.03-1.52-.75-2.09-1.45-1.44-1.77-2.54-5.01-1.06-7.2.73-1.13 2.04-1.85 3.31-1.87.82-.02 1.6.53 2.01.53.41 0 1.27-.65 2.14-.56.36.02 1.38.15 2.03 1.14-.05.03-1.22.71-1.2 2.13.02 1.69 1.5 2.25 1.52 2.26-.02.07-.24.83-.8 1.65zm-3.44-13.97c.38-.46.64-1.1.57-1.75-.55.02-1.22.37-1.62.83-.36.41-.67 1.07-.55 1.7.6.05 1.22-.31 1.6-.78z" />
                    </svg>
                    <span className="font-semibold text-white text-sm">
                        Đăng nhập với Apple
                    </span>
                </button>
            </div>

            {/* Đăng ký */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 text-center"
            >
                <span className="text-gray-600 text-base">Chưa có tài khoản?</span>
                <button
                    onClick={() => navigate("/register")}
                    className="ml-2 text-blue-700 hover:underline font-semibold cursor-pointer text-base"
                    type="button"
                >
                    Đăng ký
                </button>
            </motion.div>
        </motion.div>
    );
};

export default LoginPage;