import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-hot-toast";

const VerifyEmailPage = () => {
    const [otp, setOtp] = useState(""); // State cho OTP
    const navigate = useNavigate();

    // Lấy email từ localStorage
    const email = localStorage.getItem("emailForVerification");

    useEffect(() => {
        if (!email) {
            // Nếu không có email, chuyển hướng về trang đăng ký
            toast.error("Vui lòng đăng ký trước khi xác thực email!");
            navigate("/register");
        }
    }, [email, navigate]);

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            // Gửi email và OTP đến Backend
            const response = await api.post("/auth/verify-code", { email, otp });

            if (response.status === 200) {
                toast.success(response.data.message);

                // Xóa email khỏi localStorage sau khi xác thực thành công
                localStorage.removeItem("emailForVerification");

                // Chuyển hướng đến trang đăng nhập
                navigate("/login");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Xác thực thất bại!");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Xác Thực Email</h2>
                <p className="text-sm text-center text-gray-600 mb-4">
                    Nhập mã OTP đã được gửi đến email của bạn.
                </p>
                <form onSubmit={handleVerify} className="space-y-4">
                    <div>
                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                            Mã OTP
                        </label>
                        <input
                            type="text"
                            id="otp"
                            placeholder="Nhập mã OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Xác Thực
                    </button>
                </form>
                <p className="mt-4 text-sm text-center text-gray-600">
                    Không nhận được mã?{" "}
                    <button
                        onClick={() => toast.info("Chức năng gửi lại mã OTP chưa được triển khai.")}
                        className="text-blue-500 hover:underline"
                    >
                        Gửi lại mã
                    </button>
                </p>
            </div>
        </div>
    );
};

export default VerifyEmailPage;