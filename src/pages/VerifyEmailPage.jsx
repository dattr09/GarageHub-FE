import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthAPI } from "../services/api";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelopeOpenText, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const otpLength = 6;

const inputVariants = {
    focused: { borderColor: "#2563eb", boxShadow: "0 0 0 2px #93c5fd" },
    unfocused: { borderColor: "#d1d5db", boxShadow: "none" },
};

const VerifyEmailPage = () => {
    const [otp, setOtp] = useState(Array(otpLength).fill(""));
    const [focusIndex, setFocusIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const email = localStorage.getItem("emailForVerification");
    const handleChange = (e, idx) => {
        const val = e.target.value;
        if (/^[0-9]$/.test(val)) {
            const newOtp = [...otp];
            newOtp[idx] = val;
            setOtp(newOtp);
            if (idx < otpLength - 1) {
                inputRefs.current[idx + 1]?.focus();
            }
        } else if (val === "") {
            const newOtp = [...otp];
            newOtp[idx] = "";
            setOtp(newOtp);
        }
    };

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData("text").replace(/\D/g, "");
        if (paste.length === otpLength) {
            setOtp(paste.split(""));
            inputRefs.current[otpLength - 1]?.focus();
        }
    };

    const handleKeyDown = (e, idx) => {
        if (e.key === "Backspace") {
            if (otp[idx] === "" && idx > 0) {
                inputRefs.current[idx - 1]?.focus();
            }
        } else if (e.key === "ArrowLeft" && idx > 0) {
            inputRefs.current[idx - 1]?.focus();
        } else if (e.key === "ArrowRight" && idx < otpLength - 1) {
            inputRefs.current[idx + 1]?.focus();
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMsg("");
        setErrorMsg("");
        try {
            const code = otp.join("");
            const response = await AuthAPI.verifyCode({ email, otp: code });

            if (response.status === 200) {
                setSuccessMsg(response.data.message || "Xác thực thành công!");
                toast.success(response.data.message, { duration: 3000 });
                setTimeout(() => {
                    setSuccessMsg("");
                    localStorage.removeItem("emailForVerification");
                    navigate("/login");
                }, 2500);
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Xác thực thất bại!";
            setErrorMsg(msg);
            toast.error(msg);
            setTimeout(() => setErrorMsg(""), 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl relative">
                <AnimatePresence>
                    {successMsg && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute -top-16 left-1/2 -translate-x-1/2 z-50 bg-white border border-blue-200 text-green-700 px-6 py-3 rounded-lg shadow-xl font-semibold text-sm flex items-center justify-center gap-2 whitespace-nowrap w-max"
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
                            className="absolute -top-16 left-1/2 -translate-x-1/2 z-50 bg-white border border-red-200 text-red-700 px-6 py-3 rounded-lg shadow-xl font-semibold text-sm flex items-center justify-center gap-2 whitespace-nowrap w-max"
                            style={{ minWidth: 280, maxWidth: "90vw" }}
                        >
                            <FaTimesCircle className="text-red-500 text-2xl" />
                            <span className="truncate text-center">{errorMsg}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className="flex flex-col items-center mb-6">
                    <FaEnvelopeOpenText className="text-blue-500 text-5xl mb-2" />
                    <h2 className="text-2xl font-bold text-center text-blue-800 mb-1">Xác Thực Email</h2>
                    <p className="text-sm text-center text-gray-600">
                        Nhập mã OTP gồm 6 số đã được gửi đến email của bạn.
                    </p>
                </div>
                <form onSubmit={handleVerify} className="space-y-6">
                    <div className="flex justify-center gap-3" onPaste={handlePaste}>
                        {otp.map((digit, idx) => (
                            <motion.input
                                key={idx}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                ref={el => (inputRefs.current[idx] = el)}
                                onChange={e => handleChange(e, idx)}
                                onFocus={() => setFocusIndex(idx)}
                                onBlur={() => setFocusIndex(-1)}
                                onKeyDown={e => handleKeyDown(e, idx)}
                                className={`w-12 h-14 text-2xl text-center border-2 rounded-lg outline-none transition-all duration-200 bg-blue-50 font-bold text-blue-700 shadow-sm focus:bg-white`}
                                variants={inputVariants}
                                animate={focusIndex === idx ? "focused" : "unfocused"}
                            />
                        ))}
                    </div>
                    <button
                        type="submit"
                        disabled={loading || otp.some(d => d === "")}
                        className={`w-full py-3 text-white rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2
                            ${loading || otp.some(d => d === "") ? "bg-blue-300 cursor-not-allowed" : "bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"}
                        `}
                    >
                        {loading ? "Đang xác thực..." : "Xác Thực"}
                    </button>
                </form>
                <p className="mt-6 text-sm text-center text-gray-600">
                    Không nhận được mã?{" "}
                    <button
                        onClick={() => toast.info("Chức năng gửi lại mã OTP chưa được triển khai.")}
                        className="text-blue-600 hover:underline font-semibold"
                    >
                        Gửi lại mã
                    </button>
                </p>
            </div>
        </div>
    );
};

export default VerifyEmailPage;