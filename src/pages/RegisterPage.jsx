import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-hot-toast";

const RegisterPage = () => {
    const [fullName, setFullName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [focusField, setFocusField] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/auth/register", {
                fullName,
                dateOfBirth,
                phoneNumber,
                address,
                email,
                password,
            });

            if (response.status === 201) {
                toast.success(response.data.message);

                // Lưu email vào localStorage
                localStorage.setItem("emailForVerification", email);

                // Chuyển hướng đến trang xác thực email
                navigate("/verify-email");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Đăng ký thất bại!");
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
                Đăng ký
            </h2>
            <form onSubmit={handleRegister} className="space-y-4">
                {/* Họ và Tên */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                >
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Nhập họ và tên"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            onFocus={() => setFocusField("fullName")}
                            onBlur={() => setFocusField("")}
                            className={`w-full px-5 py-3 border-2 rounded-lg transition-all duration-300 bg-white text-base shadow-sm
                                ${focusField === "fullName"
                                    ? "border-blue-500 ring-2 ring-blue-200"
                                    : "border-gray-300 focus:border-blue-400"
                                }
                                placeholder-gray-400`}
                        />
                    </div>
                </motion.div>
                {/* Ngày sinh */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="relative">
                        <input
                            type="date"
                            required
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            onFocus={() => setFocusField("dateOfBirth")}
                            onBlur={() => setFocusField("")}
                            className={`w-full px-5 py-3 border-2 rounded-lg transition-all duration-300 bg-white text-base shadow-sm
                                ${focusField === "dateOfBirth"
                                    ? "border-blue-500 ring-2 ring-blue-200"
                                    : "border-gray-300 focus:border-blue-400"
                                }
                                placeholder-gray-400`}
                        />
                    </div>
                </motion.div>
                {/* Số điện thoại */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Nhập số điện thoại"
                            required
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            onFocus={() => setFocusField("phoneNumber")}
                            onBlur={() => setFocusField("")}
                            className={`w-full px-5 py-3 border-2 rounded-lg transition-all duration-300 bg-white text-base shadow-sm
                                ${focusField === "phoneNumber"
                                    ? "border-blue-500 ring-2 ring-blue-200"
                                    : "border-gray-300 focus:border-blue-400"
                                }
                                placeholder-gray-400`}
                        />
                    </div>
                </motion.div>
                {/* Địa chỉ */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Nhập địa chỉ"
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            onFocus={() => setFocusField("address")}
                            onBlur={() => setFocusField("")}
                            className={`w-full px-5 py-3 border-2 rounded-lg transition-all duration-300 bg-white text-base shadow-sm
                                ${focusField === "address"
                                    ? "border-blue-500 ring-2 ring-blue-200"
                                    : "border-gray-300 focus:border-blue-400"
                                }
                                placeholder-gray-400`}
                        />
                    </div>
                </motion.div>
                {/* Email */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                >
                    <div className="relative">
                        <input
                            type="email"
                            placeholder="Nhập email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setFocusField("email")}
                            onBlur={() => setFocusField("")}
                            className={`w-full px-5 py-3 border-2 rounded-lg transition-all duration-300 bg-white text-base shadow-sm
                                ${focusField === "email"
                                    ? "border-blue-500 ring-2 ring-blue-200"
                                    : "border-gray-300 focus:border-blue-400"
                                }
                                placeholder-gray-400`}
                        />
                    </div>
                </motion.div>
                {/* Mật khẩu */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Nhập mật khẩu"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setFocusField("password")}
                            onBlur={() => setFocusField("")}
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
                </motion.div>
                {/* Nút đăng ký */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                >
                    <button
                        type="submit"
                        className="cursor-pointer w-full py-3 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold rounded-lg shadow-lg transition-all duration-300 text-lg tracking-wide flex items-center justify-center gap-2"
                    >
                        Đăng ký
                    </button>
                </motion.div>
            </form>

            {/* Đăng nhập */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 text-center"
            >
                <span className="text-gray-600 text-base">Đã có tài khoản?</span>
                <button
                    onClick={() => navigate("/login")}
                    className="ml-2 text-blue-700 hover:underline font-semibold cursor-pointer text-base"
                    type="button"
                >
                    Đăng nhập
                </button>
            </motion.div>
        </motion.div>
    );
};

export default RegisterPage;