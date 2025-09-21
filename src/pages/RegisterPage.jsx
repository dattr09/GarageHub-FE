import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [dob, setDob] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [focusField, setFocusField] = useState("");
    const [passwordValid, setPasswordValid] = useState(null);
    const [passwordChecks, setPasswordChecks] = useState({
        length: false,
        upper: false,
        lower: false,
        number: false,
        special: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // Kiểm tra điều kiện mật khẩu hợp lệ
    const checkPassword = (pwd) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        return regex.test(pwd);
    };

    // Kiểm tra chi tiết các tiêu chí mật khẩu
    const checkPasswordDetail = (pwd) => ({
        length: pwd.length >= 8,
        upper: /[A-Z]/.test(pwd),
        lower: /[a-z]/.test(pwd),
        number: /\d/.test(pwd),
        special: /[\W_]/.test(pwd),
    });

    // Xử lý thay đổi mật khẩu và cập nhật trạng thái kiểm tra
    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        setPasswordValid(value.length > 0 ? checkPassword(value) : null);
        setPasswordChecks(checkPasswordDetail(value));
    };

    // Xử lý đăng ký tài khoản
    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        const data = {
            email: email,
            password: password,
            username: username,
        };
        try {
            await register(data);
            localStorage.setItem("pendingEmail", email);
            localStorage.setItem("pendingPassword", password);
            setLoading(false);
            navigate("/confirm-email");
        } catch (error) {
            setLoading(false);
            if (error.details?.errors) {
                const messages = Object.values(error.details.errors).flat();
                setMessage(messages.join(" | "));
            } else {
                setMessage(error.message || "Đăng ký thất bại.");
            }
        }
    };

    useEffect(() => {
        // Ẩn thông báo sau 3s
        if (message) {
            const timer = setTimeout(() => setMessage(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.4 }}
            className="w-full px-8 py-4 relative"
        >
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className={`fixed left-1/2 top-8 z-50 -translate-x-1/2 flex items-center gap-3 rounded-xl px-6 py-4 shadow-2xl text-base font-semibold
          ${message.includes("thành công")
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }
        `}
                    role="alert"
                >
                    {message.includes("thành công") ? (
                        <svg
                            className="w-6 h-6 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="#bbf7d0"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4"
                            />
                        </svg>
                    ) : (
                        <svg
                            className="w-6 h-6 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="#fef2f2"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 9l-6 6m0-6l6 6"
                            />
                        </svg>
                    )}
                    <span className="whitespace-pre-line">{message}</span>
                </motion.div>
            )}

            <h2 className="text-3xl font-extrabold text-blue-800 text-center mb-8 tracking-wide drop-shadow">
                Đăng ký
            </h2>
            <form onSubmit={handleRegister} className="space-y-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                >
                    <label className="block font-semibold text-gray-700 mb-2 text-lg tracking-wide">
                        Tên người dùng
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Nhập tên của bạn"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onFocus={() => setFocusField("username")}
                            onBlur={() => setFocusField("")}
                            className={`w-full px-4 py-2 border-2 rounded-lg transition-all duration-300 bg-white text-base shadow-sm
                ${focusField === "username"
                                    ? "border-blue-500 ring-2 ring-blue-200"
                                    : "border-gray-300 focus:border-blue-400"
                                }
                placeholder-gray-400`}
                        />
                        <motion.span
                            initial={false}
                            animate={{
                                opacity: focusField === "username" ? 1 : 0,
                                x: focusField === "username" ? 0 : -10,
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 text-xl pointer-events-none"
                            transition={{ duration: 0.2 }}
                        >
                            <i className="fas fa-user"></i>
                        </motion.span>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 }}
                >
                    <label className="block font-semibold text-gray-700 mb-2 text-lg tracking-wide">
                        Ngày sinh
                    </label>
                    <div className="relative">
                        <input
                            type="date"
                            required
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            onFocus={() => setFocusField("dob")}
                            onBlur={() => setFocusField("")}
                            className={`w-full px-4 py-2 border-2 rounded-lg transition-all duration-300 bg-white text-base shadow-sm
                ${focusField === "dob"
                                    ? "border-blue-500 ring-2 ring-blue-200"
                                    : "border-gray-300 focus:border-blue-400"
                                }
                placeholder-gray-400`}
                        />
                    </div>
                </motion.div>
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
                            placeholder="Nhập email của bạn"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setFocusField("email")}
                            onBlur={() => setFocusField("")}
                            autoComplete="email"
                            className={`w-full px-4 py-2 border-2 rounded-lg transition-all duration-300 bg-white text-base shadow-sm
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
                            placeholder="Nhập mật khẩu"
                            required
                            value={password}
                            onChange={handlePasswordChange}
                            onFocus={() => setFocusField("password")}
                            onBlur={() => setFocusField("")}
                            autoComplete="new-password"
                            className={`w-full px-4 py-2 border-2 rounded-lg transition-all duration-300 bg-white text-base shadow-sm
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
                    {(focusField === "password" || password.length > 0) && (
                        <div className="mt-2">
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-medium">
                                <div className="flex items-center gap-1">
                                    {passwordChecks.length ? (
                                        <span className="text-green-600">✔️</span>
                                    ) : (
                                        <span className="text-red-500">❌</span>
                                    )}
                                    <span>Ít nhất 8 ký tự</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    {passwordChecks.upper && passwordChecks.lower ? (
                                        <span className="text-green-600">✔️</span>
                                    ) : (
                                        <span className="text-red-500">❌</span>
                                    )}
                                    <span>Có chữ hoa & thường</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    {passwordChecks.number ? (
                                        <span className="text-green-600">✔️</span>
                                    ) : (
                                        <span className="text-red-500">❌</span>
                                    )}
                                    <span>Có số</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    {passwordChecks.special ? (
                                        <span className="text-green-600">✔️</span>
                                    ) : (
                                        <span className="text-red-500">❌</span>
                                    )}
                                    <span>Ký tự đặc biệt</span>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <button
                        type="submit"
                        disabled={loading}
                        className="cursor-pointer w-full py-3 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold rounded-lg shadow-lg transition-all duration-300 disabled:opacity-60 text-lg tracking-wide flex items-center justify-center gap-2"
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
                                Đang đăng ký...
                            </>
                        ) : (
                            "Đăng ký"
                        )}
                    </button>
                </motion.div>
            </form>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
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
}