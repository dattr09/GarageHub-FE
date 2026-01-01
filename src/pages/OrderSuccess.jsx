import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, FileText, Home, Mail, ShoppingBag, ArrowRight } from "lucide-react";

export default function OrderSuccess() {
    const location = useLocation();
    const navigate = useNavigate();
    const orderId = location.state?.orderId || "ORD" + Math.floor(100000 + Math.random() * 900000);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            alert("Bạn cần đăng nhập để xem trang này!");
            navigate("/login");
        } else {
            localStorage.removeItem("cart");
            window.dispatchEvent(new Event("cartChanged"));
        }
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-sky-50 flex items-center justify-center p-4">
            <div className="max-w-lg w-full">
                {/* Success Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 p-8 text-white text-center">
                        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 animate-bounce">
                            <CheckCircle className="w-12 h-12" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Đặt Hàng Thành Công!</h1>
                        <p className="text-white/80">Cảm ơn bạn đã mua hàng tại GarageHub</p>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        {/* Order ID */}
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 mb-6 text-center">
                            <div className="flex items-center justify-center gap-2 text-gray-500 mb-2">
                                <FileText className="w-4 h-4" />
                                <span className="text-sm">Mã đơn hàng</span>
                            </div>
                            <p className="text-2xl font-bold text-blue-600 tracking-wider">{orderId}</p>
                        </div>

                        {/* Email Notification */}
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                                <Mail className="w-5 h-5 text-amber-600" />
                            </div>
                            <p className="text-sm text-amber-800">
                                Email xác nhận đã được gửi đến địa chỉ email của bạn
                            </p>
                        </div>

                        {/* Info */}
                        <p className="text-gray-600 text-center mb-8">
                            Đơn hàng của bạn đang được xử lý. Chúng tôi sẽ liên hệ sớm nhất có thể.
                        </p>

                        {/* Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate("/order-history")}
                                className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                Xem đơn hàng
                            </button>
                            <button
                                onClick={() => navigate("/")}
                                className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <Home className="w-5 h-5" />
                                Về trang chủ
                            </button>
                            <button
                                onClick={() => navigate("/parts")}
                                className="w-full py-3 text-blue-600 hover:text-blue-700 font-medium transition-all flex items-center justify-center gap-2"
                            >
                                Tiếp tục mua sắm
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}