import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthAPI } from "../services/api";
import { toast } from "react-hot-toast";
import { FaUser, FaPhone, FaMapMarkerAlt, FaEnvelope, FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

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

const RegisterPage = () => {
    const [fullName, setFullName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [focusField, setFocusField] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMsg("");
        setErrorMsg("");
        try {
            const response = await AuthAPI.register({
                fullName,
                dateOfBirth,
                phoneNumber,
                address,
                email,
                password,
            });

            if (response.status === 201) {
                setSuccessMsg(response.data.message || "Đăng ký thành công!");
                toast.success(response.data.message, { duration: 3000 });
                localStorage.setItem("emailForVerification", email);
                setTimeout(() => {
                    setSuccessMsg("");
                    navigate("/verify-email");
                }, 3000);
            }
        } catch (error) {
            setErrorMsg("Đăng ký thất bại!");
            toast.error("Đăng ký thất bại!");
            setTimeout(() => setErrorMsg(""), 3000);
        } finally {
            setLoading(false);
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
            <motion.h2
                variants={itemVariants}
                className="text-3xl font-extrabold text-blue-800 text-center mb-8 tracking-wide drop-shadow"
            >
                Đăng ký
            </motion.h2>
            <motion.form
                variants={itemVariants}
                onSubmit={handleRegister}
                className="space-y-4"
            >
                <motion.div variants={itemVariants}>
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
                        <motion.span
                            initial={false}
                            animate={{
                                opacity: focusField === "fullName" ? 1 : 0,
                                x: focusField === "fullName" ? 0 : -10,
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 text-xl pointer-events-none"
                            transition={{ duration: 0.2 }}
                        >
                            <FaUser />
                        </motion.span>
                    </div>
                </motion.div>
                <motion.div variants={itemVariants}>
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
                <motion.div variants={itemVariants}>
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
                        <motion.span
                            initial={false}
                            animate={{
                                opacity: focusField === "phoneNumber" ? 1 : 0,
                                x: focusField === "phoneNumber" ? 0 : -10,
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 text-xl pointer-events-none"
                            transition={{ duration: 0.2 }}
                        >
                            <FaPhone />
                        </motion.span>
                    </div>
                </motion.div>
                <motion.div variants={itemVariants}>
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
                        <motion.span
                            initial={false}
                            animate={{
                                opacity: focusField === "address" ? 1 : 0,
                                x: focusField === "address" ? 0 : -10,
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 text-xl pointer-events-none"
                            transition={{ duration: 0.2 }}
                        >
                            <FaMapMarkerAlt />
                        </motion.span>
                    </div>
                </motion.div>
                <motion.div variants={itemVariants}>
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
                        <motion.span
                            initial={false}
                            animate={{
                                opacity: focusField === "email" ? 1 : 0,
                                x: focusField === "email" ? 0 : -10,
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 text-xl pointer-events-none"
                            transition={{ duration: 0.2 }}
                        >
                            <FaEnvelope />
                        </motion.span>
                    </div>
                </motion.div>
                <motion.div variants={itemVariants}>
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
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer text-lg"
                            onClick={() => setShowPassword((v) => !v)}
                            tabIndex={0}
                            role="button"
                            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                            style={{ padding: 0 }}
                        >
                            {showPassword ? (
                                <FaEyeSlash />
                            ) : (
                                <FaEye />
                            )}
                        </span>
                    </div>
                </motion.div>
                <motion.div variants={itemVariants}>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`cursor-pointer w-full py-3 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold rounded-lg shadow-lg transition-all duration-300 text-lg tracking-wide flex items-center justify-center gap-2
                        ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                        {loading ? "Đang đăng ký..." : "Đăng ký"}
                    </button>
                </motion.div>
            </motion.form>

            <motion.div
                variants={itemVariants}
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