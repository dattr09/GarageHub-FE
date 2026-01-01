import { useEffect, useState } from "react";
import { RepairOrderApi } from "../../services/RepairOrderApi";
import { useNavigate } from "react-router-dom";
import { Plus, ClipboardList, Eye, Edit2, Search, Grid, List, Calendar, User, DollarSign } from "lucide-react";

const STATUS_CONFIG = {
    Pending: { label: "Chờ xử lý", color: "bg-amber-100 text-amber-700 border-amber-200", dot: "bg-amber-500" },
    Processing: { label: "Đang sửa", color: "bg-blue-100 text-blue-700 border-blue-200", dot: "bg-blue-500" },
    Completed: { label: "Hoàn thành", color: "bg-green-100 text-green-700 border-green-200", dot: "bg-green-500" },
    Cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-700 border-red-200", dot: "bg-red-500" },
};

export default function RepairOrderList() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchEmail, setSearchEmail] = useState("");
    const [searchDate, setSearchDate] = useState("");
    const [viewMode, setViewMode] = useState("grid");
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        RepairOrderApi.getAll()
            .then(res => {
                const data = Array.isArray(res.data.data) ? res.data.data : [];
                setOrders(data);
            })
            .catch(() => setOrders([]))
            .finally(() => setLoading(false));
    }, []);

    const getStatus = (status) => STATUS_CONFIG[status] || { label: status, color: "bg-gray-100 text-gray-700", dot: "bg-gray-500" };

    const filteredOrders = orders.filter(o => {
        const emailMatch = o.customerId?.email?.toLowerCase().includes(searchEmail.toLowerCase());
        const dateStr = new Date(o.createdAt).toISOString().slice(0, 10);
        const dateMatch = searchDate ? dateStr === searchDate : true;
        return emailMatch && dateMatch;
    });

    const formatDate = (date) => new Date(date).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
    const formatPrice = (price) => new Intl.NumberFormat("vi-VN").format(price || 0);

    // Stats
    const stats = Object.keys(STATUS_CONFIG).map(key => ({
        ...STATUS_CONFIG[key],
        key,
        count: orders.filter(o => o.status === key).length
    }));

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-sky-50">
            {/* Hero Header */}
            <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 text-white">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm mb-3">
                            <ClipboardList className="w-7 h-7" />
                        </div>
                        <h1 className="text-3xl font-bold mb-1">Phiếu Sửa Chữa</h1>
                        <p className="text-white/80 text-sm">{filteredOrders.length} phiếu</p>
                        <button
                            onClick={() => navigate("/repair-orders/add")}
                            className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-white text-blue-600 rounded-xl font-semibold hover:bg-white/90 transition-all shadow-lg hover:shadow-xl"
                        >
                            <Plus className="w-5 h-5" />
                            Tạo phiếu mới
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="max-w-7xl mx-auto px-4 -mt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {stats.map((stat) => (
                        <div key={stat.key} className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                            <div className="flex items-center gap-2 mb-1">
                                <div className={`w-2 h-2 rounded-full ${stat.dot}`}></div>
                                <span className="text-xs text-gray-500">{stat.label}</span>
                            </div>
                            <div className="text-2xl font-bold text-gray-800">{stat.count}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div className="max-w-7xl mx-auto px-4 mt-4">
                <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
                    <div className="flex flex-wrap gap-3 items-center justify-between">
                        <div className="flex gap-3 flex-1">
                            <div className="flex-1 relative min-w-[200px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Tìm theo email khách hàng..."
                                    value={searchEmail}
                                    onChange={e => setSearchEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                />
                            </div>
                            <input
                                type="date"
                                value={searchDate}
                                onChange={e => setSearchDate(e.target.value)}
                                className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex bg-gray-100 rounded-xl p-1">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                <Grid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                {loading ? (
                    <div className="text-center py-16">
                        <div className="animate-pulse text-gray-400">Đang tải...</div>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-16">
                        <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">Không tìm thấy phiếu nào</p>
                    </div>
                ) : viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredOrders.map((order) => {
                            const status = getStatus(order.status);
                            return (
                                <div
                                    key={order._id}
                                    className="group bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all overflow-hidden"
                                >
                                    {/* Header */}
                                    <div className={`px-5 py-3 border-b ${status.color}`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${status.dot}`}></div>
                                                <span className="font-semibold">{status.label}</span>
                                            </div>
                                            <span className="text-sm font-mono opacity-80">#{order.orderId}</span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <User className="w-4 h-4 text-gray-400" />
                                                <div>
                                                    <p className="text-xs text-gray-400">Khách hàng</p>
                                                    <p className="font-medium text-gray-800 truncate">{order.customerId?.email || "—"}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <div>
                                                    <p className="text-xs text-gray-400">Ngày tạo</p>
                                                    <p className="font-medium text-gray-800">{formatDate(order.createdAt)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <DollarSign className="w-4 h-4 text-gray-400" />
                                                <div>
                                                    <p className="text-xs text-gray-400">Tổng tiền</p>
                                                    <p className="font-bold text-blue-600">{formatPrice(order.totalAmount)}₫</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                                            <button
                                                onClick={() => navigate(`/repair-orders/${order._id}`)}
                                                className="flex-1 py-2 bg-blue-50 text-blue-600 font-medium rounded-xl hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Xem
                                            </button>
                                            <button
                                                onClick={() => navigate(`/repair-orders/edit/${order._id}`)}
                                                className="flex-1 py-2 bg-amber-50 text-amber-600 font-medium rounded-xl hover:bg-amber-100 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                Sửa
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    // List View
                    <div className="space-y-3">
                        {filteredOrders.map((order) => {
                            const status = getStatus(order.status);
                            return (
                                <div
                                    key={order._id}
                                    className="bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all p-4 flex flex-wrap gap-4 items-center"
                                >
                                    {/* Status + ID */}
                                    <div className={`px-3 py-1 rounded-full text-sm font-medium border ${status.color}`}>
                                        {status.label}
                                    </div>
                                    <span className="font-mono text-gray-500">#{order.orderId}</span>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0 grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-400">Khách hàng</p>
                                            <p className="font-medium text-gray-800 truncate">{order.customerId?.email || "—"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400">Ngày tạo</p>
                                            <p className="font-medium text-gray-800">{formatDate(order.createdAt)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400">Tổng tiền</p>
                                            <p className="font-bold text-blue-600">{formatPrice(order.totalAmount)}₫</p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate(`/repair-orders/${order._id}`)}
                                            className="px-4 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 transition-all flex items-center gap-2"
                                        >
                                            <Eye className="w-4 h-4" />
                                            Xem
                                        </button>
                                        <button
                                            onClick={() => navigate(`/repair-orders/edit/${order._id}`)}
                                            className="px-3 py-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}