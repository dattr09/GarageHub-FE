import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthAPI } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelopeOpenText, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const otpLength = 6;

const VerifyEmailPage = () => {
    const [otp, setOtp] = useState(Array(otpLength).fill(""));
    const [focusIndex, setFocusIndex] = useState(-1);
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
                setTimeout(() => {
                    setSuccessMsg("");
                    localStorage.removeItem("emailForVerification");
                    navigate("/login");
                }, 2500);
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Xác thực thất bại!";
            setErrorMsg(msg);
            setTimeout(() => setErrorMsg(""), 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-sky-50">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100 relative"
            >
                <AnimatePresence>
                    {successMsg && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute -top-16 left-1/2 -translate-x-1/2 z-50 bg-white border border-green-200 text-green-700 px-6 py-3 rounded-xl shadow-xl font-semibold text-sm flex items-center gap-2 whitespace-nowrap"
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
                            className="absolute -top-16 left-1/2 -translate-x-1/2 z-50 bg-white border border-red-200 text-red-700 px-6 py-3 rounded-xl shadow-xl font-semibold text-sm flex items-center gap-2 whitespace-nowrap"
                        >
                            <FaTimesCircle className="text-red-500 text-xl" />
                            <span>{errorMsg}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 shadow-lg">
                        <FaEnvelopeOpenText className="text-white text-2xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-center text-gray-800">
                        Xác thực Email
                    </h2>
                    <p className="text-sm text-center text-gray-500 mt-2">
                        Nhập mã OTP 6 số đã gửi đến email của bạn
                    </p>
                </div>

                <form onSubmit={handleVerify} className="space-y-6">
                    <div className="flex justify-center gap-2" onPaste={handlePaste}>
                        {otp.map((digit, idx) => (
                            <input
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
                                className={`w-12 h-14 text-2xl text-center border-2 rounded-xl outline-none transition-all duration-200 font-bold
                                    ${focusIndex === idx
                                        ? "border-cyan-500 ring-2 ring-cyan-200 bg-white text-cyan-600"
                                        : "border-gray-200 bg-gray-50 text-gray-700"
                                    }`}
                            />
                        ))}
                    </div>
                    <button
                        type="submit"
                        disabled={loading || otp.some(d => d === "")}
                        className={`w-full py-3 text-white rounded-xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2
                            ${loading || otp.some(d => d === "")
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-xl cursor-pointer"
                            }`}
                    >
                        {loading ? "Đang xác thực..." : "Xác thực"}
                    </button>
                </form>
                <p className="mt-6 text-sm text-center text-gray-500">
                    Không nhận được mã?{" "}
                    <button
                        onClick={() => toast.info("Chức năng gửi lại mã OTP chưa được triển khai.")}
                        className="text-cyan-600 hover:text-cyan-700 hover:underline font-semibold transition-colors"
                    >
                        Gửi lại
                    </button>
                </p>
            </motion.div>
        </div>
    );
};

export default VerifyEmailPage;