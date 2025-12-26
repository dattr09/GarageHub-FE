import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, ChevronDown, LogOut, Search, Bell, Package, Settings, Calendar } from "lucide-react";
import api from "../services/api";
import { AppointmentApi } from "../services/AppointmentApi";

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
    const [open, setOpen] = useState(null); // null, "user", "products", "services", "management"
    const [cartCount, setCartCount] = useState(0);
    const [user, setUser] = useState(null); // Lưu trạng thái người dùng
    const [searchTerm, setSearchTerm] = useState("");
    const [pendingAppointmentsCount, setPendingAppointmentsCount] = useState(0);
    const dropdownRef = useRef(null);
    const productsDropdownRef = useRef(null);
    const servicesDropdownRef = useRef(null);
    const managementDropdownRef = useRef(null);

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
            const refs = [
                dropdownRef.current,
                productsDropdownRef.current,
                servicesDropdownRef.current,
                managementDropdownRef.current,
            ];
            
            const clickedInside = refs.some(ref => ref && ref.contains(e.target));
            if (!clickedInside) {
                setOpen(null);
            }
        }
        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    // Lấy số lượng lịch chờ xác nhận (cho admin/employee)
    useEffect(() => {
        const fetchPendingAppointments = async () => {
            if (!user || (!user.roles?.includes("admin") && !user.roles?.includes("employee"))) {
                return;
            }
            try {
                const res = await AppointmentApi.getAll({ status: "Chờ xác nhận" });
                setPendingAppointmentsCount(res.data.data?.length || 0);
            } catch (error) {
                console.error("Error fetching pending appointments:", error);
            }
        };

        fetchPendingAppointments();
        // Cập nhật mỗi 30 giây
        const interval = setInterval(fetchPendingAppointments, 30000);
        return () => clearInterval(interval);
    }, [user]);

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

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/parts?search=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm("");
        }
    };

    const isAdminOrEmployee = user && (user.roles?.includes("admin") || user.roles?.includes("employee"));

    return (
        <>
            <style>{fadeInUpStyle}</style>
            <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-blue-300 via-blue-200 to-blue-100 shadow-md z-50 px-6 md:px-10 py-3" style={{ overflow: 'visible' }}>
                <div className="flex items-center gap-3" style={{ overflow: 'visible' }}>
                    {/* Logo */}
                    <Link to="/" className="flex items-center shrink-0">
                        <img
                            src="/logo_garagehub.png"
                            alt="Logo"
                            className="h-10 w-10 rounded-full cursor-pointer"
                        />
                    </Link>

                    {/* Thanh tìm kiếm */}
                    <form
                        onSubmit={handleSearch}
                        className="max-w-xs ml-2 flex relative shrink-0"
                        style={{ minWidth: 160 }}
                    >
                        <input
                            type="text"
                            placeholder="Tìm phụ tùng..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    </form>

                    {/* Menu Dropdowns - Căn giữa */}
                    <div className="flex-1 flex items-center justify-center gap-2" style={{ overflow: 'visible' }}>
                        {/* Dropdown Sản phẩm */}
                        <div className="relative" ref={productsDropdownRef}>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpen(open === "products" ? null : "products");
                                }}
                                className="flex items-center gap-2 px-3 py-2 font-medium text-gray-700 hover:text-blue-600 transition rounded-lg hover:bg-white/50"
                            >
                                <Package className="w-5 h-5" />
                                <span>Sản phẩm</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${open === "products" ? "rotate-180" : ""}`} />
                            </button>
                            {open === "products" && (
                                <div className="absolute left-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] animate-fade-in-up">
                                    <Link
                                        to="/"
                                        onClick={() => setOpen(null)}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition rounded-t-lg"
                                    >
                                        Trang chủ
                                    </Link>
                                    <Link
                                        to="/brands"
                                        onClick={() => setOpen(null)}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition"
                                    >
                                        Hãng xe
                                    </Link>
                                    <Link
                                        to="/parts"
                                        onClick={() => setOpen(null)}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition"
                                    >
                                        Phụ tùng
                                    </Link>
                                    <Link
                                        to="/motos"
                                        onClick={() => setOpen(null)}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition rounded-b-lg"
                                    >
                                        Xe máy
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Dropdown Dịch vụ */}
                        <div className="relative" ref={servicesDropdownRef}>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpen(open === "services" ? null : "services");
                                }}
                                className="flex items-center gap-2 px-3 py-2 font-medium text-gray-700 hover:text-blue-600 transition rounded-lg hover:bg-white/50"
                            >
                                <Calendar className="w-5 h-5" />
                                <span>Dịch vụ</span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${open === "services" ? "rotate-180" : ""}`} />
                            </button>
                            {open === "services" && (
                                <div className="absolute left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] animate-fade-in-up">
                                    <Link
                                        to="/appointments/book"
                                        onClick={() => setOpen(null)}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition rounded-t-lg"
                                    >
                                        Đặt lịch sửa xe
                                    </Link>
                                    <Link
                                        to="/appointments/search"
                                        onClick={() => setOpen(null)}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition rounded-b-lg"
                                    >
                                        Tra cứu lịch hẹn
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Dropdown Quản lý (chỉ admin/employee) */}
                        {isAdminOrEmployee && (
                            <div className="relative" ref={managementDropdownRef}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpen(open === "management" ? null : "management");
                                    }}
                                    className="flex items-center gap-2 px-3 py-2 font-medium text-gray-700 hover:text-blue-600 transition rounded-lg hover:bg-white/50"
                                >
                                    <Settings className="w-5 h-5" />
                                    <span>Quản lý</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${open === "management" ? "rotate-180" : ""}`} />
                                </button>
                                {open === "management" && (
                                    <div className="absolute left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] animate-fade-in-up">
                                        <Link
                                            to="/repair-orders"
                                            onClick={() => setOpen(null)}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition rounded-t-lg"
                                        >
                                            Phiếu sửa chữa
                                        </Link>
                                        <Link
                                            to="/appointments"
                                            onClick={() => setOpen(null)}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition"
                                        >
                                            Quản lý lịch hẹn
                                        </Link>
                                        <Link
                                            to="/statistics"
                                            onClick={() => setOpen(null)}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition rounded-b-lg"
                                        >
                                            Thống kê
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Cart + Notification + User */}
                    <div className="flex items-center gap-3 ml-auto shrink-0">
                        {/* Giỏ hàng */}
                        <Link to="/cart" className="relative group">
                            <ShoppingCart className="w-6 h-6 text-blue-700" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1.5 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Chuông thông báo (chỉ admin/employee) */}
                        {isAdminOrEmployee && (
                            <Link to="/appointments?status=Chờ xác nhận" className="relative group">
                                <Bell className="w-6 h-6 text-blue-700" />
                                {pendingAppointmentsCount > 0 && (
                                    <span className="absolute -top-1.5 -right-2 bg-red-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 shadow animate-pulse">
                                        {pendingAppointmentsCount > 99 ? "99+" : pendingAppointmentsCount}
                                    </span>
                                )}
                            </Link>
                        )}

                        {/* User dropdown */}
                        {!user ? (
                            <Link to="/login" className="hover:text-blue-600 font-medium text-gray-700 shrink-0">
                                Đăng nhập
                            </Link>
                        ) : (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpen(open === "user" ? null : "user");
                                    }}
                                    className="flex items-center gap-1.5 text-gray-700 font-semibold hover:text-blue-700 focus:outline-none"
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-200 text-blue-800 font-bold flex items-center justify-center shadow">
                                        {user.username?.[0]?.toUpperCase() || user.name?.[0]?.toUpperCase() || "U"}
                                    </div>
                                    <span className="hidden sm:inline">Chào, {user.username || user.name || "User"}!</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${open === "user" ? "rotate-180" : ""}`} />
                                </button>
                                {open === "user" && (
                                    <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-xl z-[9999] animate-fade-in-up">
                                        <Link
                                            to="/order-history"
                                            onClick={() => setOpen(null)}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition rounded-t-xl"
                                        >
                                            Lịch sử mua hàng
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setOpen(null);
                                                handleLogout();
                                            }}
                                            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-xl font-semibold"
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