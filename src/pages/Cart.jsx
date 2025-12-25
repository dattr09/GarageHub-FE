import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, ShoppingCart, ChevronLeft, CheckCircle, XCircle } from "lucide-react";
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
    };

    const updateQuantity = (id, quantity) => {
        const updatedCart = cart.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
        );
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);

            if (existingItem) {
                const updatedCart = prevCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + product.quantity }
                        : item
                );
                localStorage.setItem("cart", JSON.stringify(updatedCart));
                return updatedCart;
            } else {
                const updatedCart = [...prevCart, product];
                localStorage.setItem("cart", JSON.stringify(updatedCart));
                return updatedCart;
            }
        });
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="max-w-5xl mx-auto mt-10 p-6 bg-gradient-to-br from-white via-slate-50 to-slate-100 rounded-3xl shadow-2xl animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-6 text-blue-800">
                <ShoppingCart className="w-8 h-8 drop-shadow-md" />
                <h2 className="text-3xl font-extrabold tracking-tight drop-shadow-sm">Giỏ hàng</h2>
            </div>

            {cart.length === 0 ? (
                <div className="text-center text-gray-400 italic py-10 text-lg">
                    <XCircle className="mx-auto mb-2 w-10 h-10 text-gray-300" />
                    Giỏ hàng trống.
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto rounded-xl shadow-inner mb-6">
                        <table className="w-full table-auto text-sm md:text-base">
                            <thead>
                                <tr className="bg-blue-100 text-blue-800 font-semibold">
                                    <th className="p-3">Ảnh</th>
                                    <th className="p-3 text-left">Tên</th>
                                    <th className="p-3 text-right">Đơn giá</th>
                                    <th className="p-3 text-center">Số lượng</th>
                                    <th className="p-3 text-right">Thành tiền</th>
                                    <th className="p-3 text-center">Xoá</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {cart.map((item, index) => (
                                    <tr key={item.id || index} className="hover:bg-slate-50 transition">
                                        <td className="p-3">
                                            <img
                                                src={getBackendImgURL(item.image)}
                                                alt={item.name}
                                                className="w-14 h-14 object-contain rounded-lg shadow-sm transform hover:scale-105 duration-300"
                                            />
                                        </td>
                                        <td className="p-3 font-medium">{item.name}</td>
                                        <td className="p-3 text-right text-blue-700 font-semibold">
                                            {item.price.toLocaleString()} đ
                                        </td>
                                        <td className="p-3 text-center">
                                            <input
                                                type="number"
                                                min={1}
                                                value={item.quantity}
                                                onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                                                className="w-20 px-3 py-1 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-300"
                                            />
                                        </td>
                                        <td className="p-3 text-right font-semibold text-blue-600">
                                            {(item.price * item.quantity).toLocaleString()} đ
                                        </td>
                                        <td className="p-3 text-center">
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-red-500 hover:text-red-700 transition"
                                                title="Xóa sản phẩm"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-center items-center mb-6">
                        <span className="text-xl font-bold text-blue-800 drop-shadow-sm">
                            Tổng cộng: <span className="text-2xl">{total.toLocaleString()} đ</span>
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-4">
                        <button
                            onClick={() => navigate("/")}
                            className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-xl font-semibold shadow-md transition"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Tiếp tục mua sắm
                        </button>
                        <button
                            onClick={() => {
                                navigate("/checkout");
                            }}
                            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-800 text-white px-6 py-2 rounded-xl font-semibold shadow-lg transition duration-300 transform hover:scale-105"
                        >
                            <CheckCircle className="w-5 h-5" />
                            Thanh toán
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}