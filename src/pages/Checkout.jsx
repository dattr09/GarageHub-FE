import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../services/OrderApi";
import { ShoppingBag, Mail, Phone, MapPin, StickyNote, User } from "lucide-react";
import { cities } from "../data/cities";

export default function Checkout() {
    const navigate = useNavigate();
    const [info, setInfo] = useState({
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        note: "",
        email: "",
    });
    const [cart, setCart] = useState([]);

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
                } catch {
                    console.error("Lỗi khi lấy thông tin người dùng từ localStorage");
                }
            }
            setInfo((info) => ({ ...info, name, phone, email }));

            const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
            setCart(storedCart);
        }
    }, [navigate]);

    useEffect(() => {
        const handleCartChange = () => {
            const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
            setCart(storedCart);
        };

        window.addEventListener("cartChanged", handleCartChange);

        return () => {
            window.removeEventListener("cartChanged", handleCartChange);
        };
    }, []);

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

        const userId = localStorage.getItem("userId");
        const order = {
            userId,
            items: cart.map((item) => ({
                id: item.id,
                quantity: item.quantity,
            })),
            shippingAddress: {
                street: info.address,
                city: info.city,
                state: info.state,
                zipCode: info.zipCode,
            },
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
            console.error("Đặt hàng thất bại:", err.response?.data || err.message);
            alert(`Đặt hàng thất bại: ${err.response?.data?.message || "Lỗi không xác định!"}`);
        }
    };

    return (
        <div className="max-w-6xl mx-auto mt-12 px-4 md:px-6 lg:px-8 flex flex-col md:flex-row gap-10 animate-fade-in">
            {/* FORM */}
            <div className="flex-1 bg-white rounded-3xl shadow-lg p-10">
                <h2 className="text-3xl font-extrabold text-blue-700 mb-8 text-center drop-shadow flex items-center justify-center gap-2">
                    <ShoppingBag className="w-8 h-8" />
                    Thông tin giao hàng
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {[{ icon: <User />, name: "name", placeholder: "Họ tên" },
                    { icon: <Phone />, name: "phone", placeholder: "Số điện thoại" },
                    { icon: <MapPin />, name: "address", placeholder: "Địa chỉ giao hàng" },
                    { icon: <MapPin />, name: "city", placeholder: "Thành phố" },
                    { icon: <Mail />, name: "email", placeholder: "Email liên hệ", type: "email" },
                    ].map(({ icon, name, placeholder, type }) => (
                        <div key={name} className="relative">
                            <div className="absolute left-3 top-3 text-blue-600">{icon}</div>
                            <input
                                type={type || "text"}
                                name={name}
                                value={info[name]}
                                onChange={handleChange}
                                placeholder={placeholder}
                                required
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
                            />
                        </div>
                    ))}
                    <div className="relative">
                        <div className="absolute left-3 top-3 text-blue-600">
                            <StickyNote />
                        </div>
                        <textarea
                            name="note"
                            value={info.note}
                            onChange={handleChange}
                            placeholder="Ghi chú đơn hàng (nếu có)"
                            rows={3}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md transition transform hover:scale-105"
                    >
                        Xác nhận đặt hàng
                    </button>
                </form>
            </div>
        </div>
    );
}