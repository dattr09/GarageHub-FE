import React, { useState } from "react";
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";

const LoginAdmin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Email: ${email}\nPassword: ${password}`);
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen"
            style={{
                background: "linear-gradient(135deg, #b8e0fbff 0%, #e6eaff 100%)",
            }}
        >
            <div className="w-full max-w-md bg-white/50 rounded-3xl shadow-xl p-8 flex flex-col items-center">
                <div className="flex flex-col items-center w-full gap-y-6">
                    {/* Logo */}
                    <div className="flex items-center justify-center mt-[-0.5rem] mb-0">
                        <div className="w-32 h-32 rounded-full border-3 border-blue-200 flex items-center justify-center bg-white shadow">
                            <img
                                src="/logo_garagehub.png"
                                alt="Logo Garage Hub"
                                className="w-32 h-32 object-contain"
                            />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-blue-500 text-center -mt-2 mb-2">Admin Login</h2>
                    {/* Form */}
                    <form className="w-full flex flex-col gap-y-6" onSubmit={handleSubmit}>
                        {/* Email */}
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 text-xl pointer-events-none">
                                <MdEmail />
                            </span>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pl-12 pr-4 py-3 border border-blue-200 rounded-full bg-white bg-opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-300 text-blue-700 placeholder-blue-400"
                                placeholder="Email Address"
                                autoComplete="username"
                            />
                        </div>
                        {/* Password */}
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 text-xl pointer-events-none">
                                <MdLock />
                            </span>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full pl-12 pr-12 py-3 border border-blue-200 rounded-full bg-white bg-opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-300 text-blue-700 placeholder-blue-400"
                                placeholder="Password"
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 text-xl focus:outline-none"
                                onClick={() => setShowPassword((prev) => !prev)}
                                tabIndex={-1}
                            >
                                {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                            </button>
                        </div>
                        {/* Remember me & Forgot password */}
                        <div className="flex items-center justify-between px-1">
                            <label className="flex items-center text-blue-500 text-sm">
                                <input
                                    type="checkbox"
                                    className="mr-2 accent-blue-500"
                                    id="remember"
                                />
                                Remember me
                            </label>
                            <button
                                type="button"
                                className="text-blue-500 text-sm hover:underline focus:outline-none"
                                onClick={() => alert("Chức năng quên mật khẩu!")}
                            >
                                Forgot Password?
                            </button>
                        </div>
                        {/* Login button */}
                        <button
                            type="submit"
                            className="w-full py-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold text-lg shadow hover:from-blue-500 hover:to-blue-700 transition"
                        >
                            Sign In
                        </button>
                    </form>
                    {/* Divider */}
                    <div className="flex items-center w-full">
                        <div className="flex-grow border-t border-blue-100"></div>
                        <div className="mx-2 text-blue-300 text-xl">✧</div>
                        <div className="flex-grow border-t border-blue-100"></div>
                    </div>
                    {/* Register */}
                    <div className="text-center text-blue-500 text-sm">
                        New to <span className="font-semibold text-blue-700">Garage Hub</span>?{" "}
                        <span className="font-semibold text-blue-700 cursor-pointer hover:underline">
                            Start your journey
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginAdmin;