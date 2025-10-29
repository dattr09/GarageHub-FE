import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, ChevronDown, LogOut } from "lucide-react";
import api from "../services/api";

const fadeInUpStyle = `
@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(10px);}
  100% { opacity: 1; transform: translateY(0);}
}
.animate-fade-in-up {
  animation: fadeInUp 0.4s ease-out both;
}
`;

export default function Header() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [user, setUser] = useState(null); // Lưu trạng thái người dùng
    const dropdownRef = useRef(null);

    // Kiểm tra trạng thái đăng nhập từ Backend
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await api.get("/auth/me"); // Gửi yêu cầu xác thực token
                setUser(response.data.user); // Lưu thông tin người dùng
            } catch (error) {
                setUser(null); // Nếu lỗi, đặt trạng thái người dùng là null
            }
        };

        checkLoginStatus();
    }, []);

    useEffect(() => {
        // Đóng dropdown khi click ra ngoài
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        // Cập nhật số lượng sản phẩm trong giỏ hàng khi có thay đổi
        function updateCartCount() {
            const cart = JSON.parse(localStorage.getItem("cart") || "[]");
            const count = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
            setCartCount(count);
        }
        updateCartCount();
        window.addEventListener("storage", updateCartCount);
        window.addEventListener("cartChanged", updateCartCount);
        return () => {
            window.removeEventListener("storage", updateCartCount);
            window.removeEventListener("cartChanged", updateCartCount);
        };
    }, []);

    // Xử lý đăng xuất
    const handleLogout = async () => {
        try {
            await api.post("/auth/logout"); // Gửi yêu cầu đăng xuất đến Backend
            setUser(null); // Xóa trạng thái người dùng
            navigate("/login"); // Điều hướng về trang đăng nhập
        } catch (error) {
            console.error("Lỗi khi đăng xuất:", error);
        }
    };

    return (
        <>
            <style>{fadeInUpStyle}</style>
            <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-300 via-blue-200 to-blue-100 shadow-md z-50 px-6 md:px-10 py-3">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <img
                            src="/logo_garagehub.png"
                            alt="Logo"
                            className="h-10 w-10 rounded-full cursor-pointer"
                        />
                    </Link>

                    {/* Menu */}
                    <div className="hidden md:flex gap-6 text-gray-700 font-medium">
                        <Link to="/" className="hover:text-blue-600 transition">Trang chủ</Link>
                        <Link to="/brands" className="hover:text-blue-600 transition">Hãng xe</Link>
                        <Link to="/parts" className="hover:text-blue-600 transition">Phụ tùng</Link>
                    </div>

                    {/* Cart + User */}
                    <div className="flex items-center gap-4">
                        <Link to="/cart" className="relative group">
                            <ShoppingCart className="w-6 h-6 text-blue-700" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-1.5 py-0.5 shadow">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {!user ? (
                            <Link to="/login" className="hover:text-blue-600 font-medium text-gray-700">
                                Đăng nhập
                            </Link>
                        ) : (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setOpen(open === "user" ? false : "user")}
                                    className="flex items-center gap-1 text-gray-700 font-semibold hover:text-blue-700 focus:outline-none"
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-200 text-blue-800 font-bold flex items-center justify-center shadow">
                                        {user.username?.[0] || "U"}
                                    </div>
                                    <span>Chào, {user.username || user.name || "User"}!</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${open === "user" ? "rotate-180" : ""}`} />
                                </button>
                                {open === "user" && (
                                    <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-lg z-50 animate-fade-in-up">
                                        <Link
                                            to="/order-history"
                                            className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition"
                                        >
                                            Lịch sử mua hàng
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-b-xl font-semibold"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Đăng xuất
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
}