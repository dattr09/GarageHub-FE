import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../services/OrderApi";
import { ShoppingBag, Mail, Phone, MapPin, FileText, User, CreditCard, ArrowLeft, Truck } from "lucide-react";
import { cities } from "../data/cities";
import { getBackendImgURL } from "../utils/helper";

export default function Checkout() {
    const navigate = useNavigate();
    const [info, setInfo] = useState({
        name: "", phone: "", address: "", city: "", state: "", zipCode: "", note: "", email: "",
    });
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            alert("Bạn cần đăng nhập để thanh toán!");
            navigate("/login");
        } else {
            const userStr = localStorage.getItem("user");
            let name = "", email = "", phone = "";
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    name = user.name || user.fullName || "";
                    email = user.email || "";
                    phone = user.phone || "";
                } catch { }
            }
            setInfo((info) => ({ ...info, name, phone, email }));
            const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
            setCart(storedCart);
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInfo({ ...info, [name]: value });
        if (name === "city") {
            const selectedCity = cities.find((city) => city.city.toLowerCase() === value.toLowerCase());
            if (selectedCity) {
                setInfo((prevInfo) => ({
                    ...prevInfo,
                    state: selectedCity.state,
                    zipCode: selectedCity.zipCode,
                }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cart.length === 0) {
            alert("Giỏ hàng của bạn đang trống!");
            return;
        }
        setLoading(true);
        const userId = localStorage.getItem("userId");
        const order = {
            userId,
            items: cart.map((item) => ({ id: item.id, quantity: item.quantity })),
            shippingAddress: { street: info.address, city: info.city, state: info.state, zipCode: info.zipCode },
            paymentMethod: "Credit Card",
            notes: info.note,
            email: info.email,
        };
        try {
            const res = await createOrder(order);
            localStorage.removeItem("cart");
            setCart([]);
            window.dispatchEvent(new Event("cartChanged"));
            navigate("/ordersuccess", { state: { orderId: res.orderId } });
        } catch (err) {
            alert(`Đặt hàng thất bại: ${err.response?.data?.message || "Lỗi không xác định!"}`);
        } finally {
            setLoading(false);
        }
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const formatPrice = (val) => new Intl.NumberFormat("vi-VN").format(val);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-sky-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 text-white">
                <div className="max-w-5xl mx-auto px-4 py-8">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm mb-3">
                            <CreditCard className="w-7 h-7" />
                        </div>
                        <h1 className="text-3xl font-bold mb-1">Thanh Toán</h1>
                        <p className="text-white/80 text-sm">Điền thông tin giao hàng</p>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 -mt-4 pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                            <form onSubmit={handleSubmit} className="p-6 md:p-8">
                                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <Truck className="w-5 h-5 text-blue-500" />
                                    Thông tin giao hàng
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Họ tên</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text" name="name" value={info.name} onChange={handleChange}
                                                required placeholder="Nhập họ tên"
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="tel" name="phone" value={info.phone} onChange={handleChange}
                                                required placeholder="0xxx xxx xxx"
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email" name="email" value={info.email} onChange={handleChange}
                                            required placeholder="email@example.com"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text" name="address" value={info.address} onChange={handleChange}
                                            required placeholder="Số nhà, đường, phường..."
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Thành phố</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text" name="city" value={info.city} onChange={handleChange}
                                            required placeholder="Thành phố"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <textarea
                                            name="note" value={info.note} onChange={handleChange}
                                            rows={3} placeholder="Ghi chú cho đơn hàng (không bắt buộc)"
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => navigate("/cart")}
                                        className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                        Quay lại
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                                    >
                                        {loading ? "Đang xử lý..." : "Xác nhận đặt hàng"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-blue-500" />
                                Đơn hàng của bạn
                            </h3>

                            <div className="max-h-64 overflow-y-auto space-y-3 mb-4">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-3 py-2 border-b border-gray-100 last:border-0">
                                        <img
                                            src={getBackendImgURL(item.image)}
                                            alt={item.name}
                                            className="w-12 h-12 rounded-lg object-contain bg-gray-50"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-800 text-sm truncate">{item.name}</p>
                                            <p className="text-xs text-gray-500">x{item.quantity}</p>
                                        </div>
                                        <p className="font-semibold text-blue-600 text-sm">{formatPrice(item.price * item.quantity)} ₫</p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2 border-t border-gray-100 pt-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Tạm tính</span>
                                    <span>{formatPrice(total)} ₫</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Phí vận chuyển</span>
                                    <span className="text-green-600">Miễn phí</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                    <span className="font-semibold text-gray-800">Tổng cộng</span>
                                    <span className="text-xl font-bold text-blue-600">{formatPrice(total)} ₫</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}