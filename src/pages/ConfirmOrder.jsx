import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { CheckCircle, XCircle, Loader } from "lucide-react";

export default function ConfirmOrder() {
    const { orderId } = useParams();
    const location = useLocation();
    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const result = query.get("status");

        if (result === "success") {
            setStatus("success");
            setMessage("Đơn hàng của bạn đã được xác nhận thành công!");
        } else if (result === "already") {
            setStatus("success");
            setMessage("Đơn hàng này đã được xác nhận trước đó!");
        } else if (result === "error") {
            setStatus("error");
            setMessage("Có lỗi xảy ra khi xác nhận đơn hàng!");
        } else {
            setStatus("error");
            setMessage("Liên kết xác nhận không hợp lệ!");
        }
    }, [location]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-blue-100">
            {status === "loading" && (
                <div className="flex flex-col items-center">
                    <Loader className="w-16 h-16 text-blue-500 animate-spin" />
                    <h1 className="text-2xl font-bold text-blue-700 mt-4">Đang xác nhận đơn hàng...</h1>
                </div>
            )}

            {status === "success" && (
                <div className="flex flex-col items-center text-center">
                    <CheckCircle className="w-16 h-16 text-green-500" />
                    <h1 className="text-2xl font-bold text-green-700 mt-4">Thành công!</h1>
                    <p className="text-gray-600 mt-2">{message}</p>
                    <button
                        onClick={() => (window.location.href = "/order-history")}
                        className="mt-6 px-6 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
                    >
                        Xem đơn hàng
                    </button>
                </div>
            )}

            {status === "error" && (
                <div className="flex flex-col items-center text-center">
                    <XCircle className="w-16 h-16 text-red-500" />
                    <h1 className="text-2xl font-bold text-red-700 mt-4">Xác nhận thất bại!</h1>
                    <p className="text-gray-600 mt-2">{message}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
                    >
                        Thử lại
                    </button>
                </div>
            )}
        </div>
    );
}
