import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthAPI } from "../services/api";
import { FaUser, FaPhone, FaMapMarkerAlt, FaEnvelope, FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const containerVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.05,
        },
    },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
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
                localStorage.setItem("emailForVerification", email);
                setTimeout(() => {
                    setSuccessMsg("");
                    navigate("/verify-email");
                }, 3000);
            }
        } catch (error) {
            setErrorMsg("Đăng ký thất bại!");
            setTimeout(() => setErrorMsg(""), 3000);
        } finally {
            setLoading(false);
        }
    };

    const inputClass = (field) => `w-full px-4 py-2.5 border rounded-xl transition-all duration-300 bg-gray-50 text-sm
        ${focusField === field
            ? "border-cyan-500 ring-2 ring-cyan-200 bg-white"
            : "border-gray-200 hover:border-gray-300"
        }
        placeholder-gray-400 outline-none`;

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full px-8 py-3 relative"
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
                className="text-2xl font-bold text-gray-800 text-center mb-5 tracking-wide"
            >
                Đăng ký tài khoản
            </motion.h2>
            <motion.form
                variants={itemVariants}
                onSubmit={handleRegister}
                className="space-y-3"
            >
                {/* Họ tên */}
                <motion.div variants={itemVariants}>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Họ và tên"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            onFocus={() => setFocusField("fullName")}
                            onBlur={() => setFocusField("")}
                            className={inputClass("fullName")}
                        />
                        <FaUser className={`absolute right-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none transition-colors ${focusField === "fullName" ? "text-cyan-500" : "text-gray-300"}`} />
                    </div>
                </motion.div>
                {/* Ngày sinh */}
                <motion.div variants={itemVariants}>
                    <input
                        type="date"
                        required
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        onFocus={() => setFocusField("dateOfBirth")}
                        onBlur={() => setFocusField("")}
                        className={inputClass("dateOfBirth")}
                    />
                </motion.div>
                {/* Số điện thoại */}
                <motion.div variants={itemVariants}>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Số điện thoại"
                            required
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            onFocus={() => setFocusField("phoneNumber")}
                            onBlur={() => setFocusField("")}
                            className={inputClass("phoneNumber")}
                        />
                        <FaPhone className={`absolute right-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none transition-colors ${focusField === "phoneNumber" ? "text-cyan-500" : "text-gray-300"}`} />
                    </div>
                </motion.div>
                {/* Địa chỉ */}
                <motion.div variants={itemVariants}>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Địa chỉ"
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            onFocus={() => setFocusField("address")}
                            onBlur={() => setFocusField("")}
                            className={inputClass("address")}
                        />
                        <FaMapMarkerAlt className={`absolute right-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none transition-colors ${focusField === "address" ? "text-cyan-500" : "text-gray-300"}`} />
                    </div>
                </motion.div>
                {/* Email */}
                <motion.div variants={itemVariants}>
                    <div className="relative">
                        <input
                            type="email"
                            placeholder="Email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setFocusField("email")}
                            onBlur={() => setFocusField("")}
                            className={inputClass("email")}
                        />
                        <FaEnvelope className={`absolute right-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none transition-colors ${focusField === "email" ? "text-cyan-500" : "text-gray-300"}`} />
                    </div>
                </motion.div>
                {/* Mật khẩu */}
                <motion.div variants={itemVariants}>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Mật khẩu"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setFocusField("password")}
                            onBlur={() => setFocusField("")}
                            className={inputClass("password")}
                        />
                        <span
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer text-lg hover:text-gray-600 transition-colors"
                            onClick={() => setShowPassword((v) => !v)}
                            tabIndex={0}
                            role="button"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                </motion.div>
                {/* Nút đăng ký */}
                <motion.div variants={itemVariants} className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`cursor-pointer w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-base flex items-center justify-center gap-2
                        ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                        {loading ? "Đang đăng ký..." : "Đăng ký"}
                    </button>
                </motion.div>
            </motion.form>

            <motion.div
                variants={itemVariants}
                className="mt-6 text-center"
            >
                <span className="text-gray-500 text-sm">Đã có tài khoản?</span>
                <button
                    onClick={() => navigate("/login")}
                    className="ml-2 text-cyan-600 hover:text-cyan-700 hover:underline font-semibold cursor-pointer text-sm transition-colors"
                    type="button"
                >
                    Đăng nhập
                </button>
            </motion.div>
        </motion.div>
    );
};

export default RegisterPage;