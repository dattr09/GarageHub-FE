import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, ShoppingCart, ArrowLeft, CreditCard, Minus, Plus, Package } from "lucide-react";
import { getBackendImgURL } from "../utils/helper";

export default function Cart() {
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCart(storedCart);
    }, []);

    const removeItem = (id) => {
        const updatedCart = cart.filter((item) => item.id !== id);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        window.dispatchEvent(new Event("cartChanged"));
    };

    const updateQuantity = (id, quantity) => {
        const updatedCart = cart.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
        );
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        window.dispatchEvent(new Event("cartChanged"));
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
                            <ShoppingCart className="w-7 h-7" />
                        </div>
                        <h1 className="text-3xl font-bold mb-1">Giỏ Hàng</h1>
                        <p className="text-white/80 text-sm">{cart.length} sản phẩm</p>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 -mt-4 pb-8">
                {cart.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
                        <ShoppingCart className="w-20 h-20 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">Giỏ hàng trống</h3>
                        <p className="text-gray-400 mb-6">Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
                        <button
                            onClick={() => navigate("/parts")}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                        >
                            Tiếp tục mua sắm
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 flex gap-4 hover:shadow-xl transition-all"
                                >
                                    {/* Image */}
                                    <div className="w-24 h-24 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0">
                                        <img
                                            src={getBackendImgURL(item.image)}
                                            alt={item.name}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-800 truncate">{item.name}</h3>
                                        <p className="text-blue-600 font-bold mt-1">{formatPrice(item.price)} ₫</p>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-3 mt-3">
                                            <div className="flex items-center bg-gray-100 rounded-xl">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-2 hover:bg-gray-200 rounded-l-xl transition-colors"
                                                >
                                                    <Minus className="w-4 h-4 text-gray-600" />
                                                </button>
                                                <span className="px-4 py-2 font-medium text-gray-800">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-2 hover:bg-gray-200 rounded-r-xl transition-colors"
                                                >
                                                    <Plus className="w-4 h-4 text-gray-600" />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Subtotal */}
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400">Thành tiền</p>
                                        <p className="text-lg font-bold text-gray-800">{formatPrice(item.price * item.quantity)} ₫</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Package className="w-5 h-5 text-blue-500" />
                                    Tổng đơn hàng
                                </h3>

                                <div className="space-y-3 border-b border-gray-100 pb-4 mb-4">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Số lượng</span>
                                        <span>{cart.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tạm tính</span>
                                        <span>{formatPrice(total)} ₫</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Phí vận chuyển</span>
                                        <span className="text-green-600">Miễn phí</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mb-6">
                                    <span className="font-semibold text-gray-800">Tổng cộng</span>
                                    <span className="text-2xl font-bold text-blue-600">{formatPrice(total)} ₫</span>
                                </div>

                                <button
                                    onClick={() => navigate("/checkout")}
                                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <CreditCard className="w-5 h-5" />
                                    Thanh toán
                                </button>

                                <button
                                    onClick={() => navigate("/parts")}
                                    className="w-full mt-3 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    Tiếp tục mua sắm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}