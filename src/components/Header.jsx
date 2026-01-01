import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, ChevronDown, LogOut, Search, Bell, Home, Tag, Wrench, Calendar, Settings, Package, ClipboardList, BarChart2, X } from "lucide-react";
import api from "../services/api";
import { AppointmentApi } from "../services/AppointmentApi";
import { getAllParts } from "../services/PartsApi";

export default function Header() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const [user, setUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [pendingAppointmentsCount, setPendingAppointmentsCount] = useState(0);
    const [allParts, setAllParts] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const dropdownRef = useRef(null);
    const managementDropdownRef = useRef(null);
    const searchRef = useRef(null);

    // Fetch all parts for search suggestions
    useEffect(() => {
        const fetchParts = async () => {
            try {
                const data = await getAllParts();
                setAllParts(data);
            } catch (error) {
                console.error("Error fetching parts:", error);
            }
        };
        fetchParts();
    }, []);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await api.get("/auth/me");
                setUser(response.data.user);
            } catch (error) {
                setUser(null);
            }
        };
        checkLoginStatus();
    }, []);

    useEffect(() => {
        function handleClickOutside(e) {
            const refs = [dropdownRef.current, managementDropdownRef.current];
            const clickedInside = refs.some(ref => ref && ref.contains(e.target));
            if (!clickedInside) setOpen(null);

            // Close suggestions if clicked outside search
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    useEffect(() => {
        const fetchPendingAppointments = async () => {
            if (!user || (!user.roles?.includes("admin") && !user.roles?.includes("employee"))) return;
            try {
                const res = await AppointmentApi.getAll({ status: "Chờ xác nhận" });
                setPendingAppointmentsCount(res.data.data?.length || 0);
            } catch (error) { console.error("Error:", error); }
        };
        fetchPendingAppointments();
        const interval = setInterval(fetchPendingAppointments, 30000);
        return () => clearInterval(interval);
    }, [user]);

    useEffect(() => {
        function updateCartCount() {
            const cart = JSON.parse(localStorage.getItem("cart") || "[]");
            setCartCount(cart.reduce((sum, item) => sum + (item.quantity || 0), 0));
        }
        updateCartCount();
        window.addEventListener("storage", updateCartCount);
        window.addEventListener("cartChanged", updateCartCount);
        return () => {
            window.removeEventListener("storage", updateCartCount);
            window.removeEventListener("cartChanged", updateCartCount);
        };
    }, []);

    // Handle search input and update suggestions
    const handleSearchInput = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.trim().length > 0) {
            const filtered = allParts
                .filter(part => part.name.toLowerCase().includes(value.toLowerCase()))
                .slice(0, 6); // Limit to 6 suggestions
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    // Handle selecting a suggestion
    const handleSelectSuggestion = (part) => {
        setSearchTerm(part.name);
        setShowSuggestions(false);
        navigate(`/parts?search=${encodeURIComponent(part.name)}`);
    };

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout");
            setUser(null);
            navigate("/login");
        } catch (error) { console.error("Lỗi đăng xuất:", error); }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/parts?search=${encodeURIComponent(searchTerm.trim())}`);
            setShowSuggestions(false);
        }
    };

    const isAdminOrEmployee = user && (user.roles?.includes("admin") || user.roles?.includes("employee"));

    return (
        <nav className="fixed top-0 left-0 right-0 w-screen bg-gradient-to-r from-sky-100 via-blue-50 to-cyan-100 z-50 px-4 md:px-8 py-2.5">
            <div className="flex items-center gap-4 flex-nowrap">
                {/* Logo */}
                <Link to="/" className="flex-shrink-0">
                    <img src="/logo_garagehub.png" alt="Logo" className="h-10 w-10 rounded-full" />
                </Link>

                {/* Search with suggestions */}
                <div ref={searchRef} className="relative flex-shrink-0 hidden sm:block" style={{ width: 260 }}>
                    <form onSubmit={handleSearch}>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm phụ tùng..."
                                value={searchTerm}
                                onChange={handleSearchInput}
                                onFocus={() => searchTerm.trim() && suggestions.length > 0 && setShowSuggestions(true)}
                                className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-white border border-blue-200 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder:text-gray-400 shadow-sm"
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => { setSearchTerm(""); setSuggestions([]); setShowSuggestions(false); }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                                >
                                    <X className="w-3 h-3 text-gray-500" />
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Suggestions dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-[100]">
                            {suggestions.map((part) => (
                                <button
                                    key={part._id}
                                    onClick={() => handleSelectSuggestion(part)}
                                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-50 transition text-left"
                                >
                                    <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <p className="text-sm text-gray-800 truncate font-medium flex-1">{part.name}</p>
                                </button>
                            ))}
                            <button
                                onClick={() => { navigate(`/parts?search=${encodeURIComponent(searchTerm)}`); setShowSuggestions(false); }}
                                className="w-full px-4 py-2.5 bg-gray-50 text-sm text-blue-600 font-medium hover:bg-blue-50 transition border-t border-gray-100"
                            >
                                Xem tất cả kết quả cho "{searchTerm}"
                            </button>
                        </div>
                    )}
                </div>

                {/* Navigation Links - Single Row */}
                <div className="flex items-center gap-1 flex-nowrap flex-1 justify-center">
                    {/* Trang chủ */}
                    <Link to="/" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition text-base font-medium whitespace-nowrap">
                        <Home className="w-5 h-5" />
                        <span>Trang chủ</span>
                    </Link>

                    {/* Hãng xe */}
                    <Link to="/brands" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition text-base font-medium whitespace-nowrap">
                        <Tag className="w-5 h-5" />
                        <span>Hãng xe</span>
                    </Link>

                    {/* Phụ tùng */}
                    <Link to="/parts" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition text-base font-medium whitespace-nowrap">
                        <Package className="w-5 h-5" />
                        <span>Phụ tùng</span>
                    </Link>

                    {/* Đặt lịch */}
                    <Link to="/appointments/book" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition text-base font-medium whitespace-nowrap">
                        <Calendar className="w-5 h-5" />
                        <span>Đặt lịch</span>
                    </Link>

                    {/* Tra cứu */}
                    <Link to="/appointments/search" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition text-base font-medium whitespace-nowrap">
                        <Search className="w-5 h-5" />
                        <span>Tra cứu</span>
                    </Link>

                    {/* Admin/Employee Only - Quản lý Dropdown */}
                    {isAdminOrEmployee && (
                        <div className="relative" ref={managementDropdownRef}>
                            <button
                                onClick={(e) => { e.stopPropagation(); setOpen(open === "management" ? null : "management"); }}
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition text-base font-medium whitespace-nowrap"
                            >
                                <Settings className="w-5 h-5" />
                                <span>Quản lý</span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${open === "management" ? "rotate-180" : ""}`} />
                            </button>
                            {open === "management" && (
                                <div className="absolute left-0 mt-1 w-48 bg-white rounded-xl shadow-xl z-[9999] overflow-hidden">
                                    <Link to="/motos" onClick={() => setOpen(null)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                                        <Wrench className="w-4 h-4" /> Xe máy
                                    </Link>
                                    <Link to="/repair-orders" onClick={() => setOpen(null)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                                        <ClipboardList className="w-4 h-4" /> Phiếu sửa chữa
                                    </Link>
                                    <Link to="/appointments" onClick={() => setOpen(null)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                                        <Calendar className="w-4 h-4" /> Quản lý lịch hẹn
                                    </Link>
                                    <Link to="/statistics" onClick={() => setOpen(null)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                                        <BarChart2 className="w-4 h-4" /> Thống kê
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Side - Cart, Bell, User */}
                <div className="flex items-center gap-3 flex-shrink-0">
                    {/* Cart */}
                    <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg transition">
                        <ShoppingCart className="w-5 h-5 text-gray-700" />
                        {cartCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {cartCount > 99 ? "99" : cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Bell for admin/employee */}
                    {isAdminOrEmployee && (
                        <Link to="/appointments?status=Chờ xác nhận" className="relative p-2 hover:bg-gray-100 rounded-lg transition">
                            <Bell className="w-5 h-5 text-gray-700" />
                            {pendingAppointmentsCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 animate-pulse">
                                    {pendingAppointmentsCount > 99 ? "99+" : pendingAppointmentsCount}
                                </span>
                            )}
                        </Link>
                    )}

                    {/* User */}
                    {!user ? (
                        <Link to="/login" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition text-sm">
                            Đăng nhập
                        </Link>
                    ) : (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={(e) => { e.stopPropagation(); setOpen(open === "user" ? null : "user"); }}
                                className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition"
                            >
                                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                                    {user.username?.[0]?.toUpperCase() || user.name?.[0]?.toUpperCase() || "U"}
                                </div>
                                <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${open === "user" ? "rotate-180" : ""}`} />
                            </button>
                            {open === "user" && (
                                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl z-[9999] overflow-hidden">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="font-medium text-gray-800 truncate">{user.username || user.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>
                                    <Link to="/order-history" onClick={() => setOpen(null)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                                        Lịch sử đơn hàng
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <LogOut className="w-4 h-4" /> Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}