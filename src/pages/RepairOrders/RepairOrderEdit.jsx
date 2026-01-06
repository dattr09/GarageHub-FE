import { useEffect, useState } from "react";
import api from "../../services/api";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import {
    User, Wrench, ClipboardList, DollarSign, FileText,
    CreditCard, Save, Search, ArrowLeft, Package, Edit2
} from "lucide-react";
import { RepairOrderApi } from "../../services/RepairOrderApi";

export default function RepairOrderEdit() {
    const { id } = useParams();
    const [customers, setCustomers] = useState([]);
    const [parts, setParts] = useState([]);
    const [form, setForm] = useState({
        customerId: "",
        items: [],
        repairCosts: 0,
        paymentMethod: "",
        notes: "",
        status: "Pending",
    });
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [employee, setEmployee] = useState(null);
    const [searchPart, setSearchPart] = useState("");
    const navigate = useNavigate();

    const paymentOptions = [
        { value: "Tiền mặt", label: "Tiền mặt" },
        { value: "Thẻ", label: "Thẻ" },
    ];

    const statusOptions = [
        { value: "Pending", label: "Chờ xử lý" },
        { value: "Processing", label: "Đang sửa" },
        { value: "Completed", label: "Hoàn thành" },
        { value: "Cancelled", label: "Đã hủy" },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const meRes = await api.get("/auth/me");
                setEmployee(meRes.data);
                const customersRes = await api.get("/repair-orders/customers/with-motos");
                setCustomers(customersRes.data);
                const partsRes = await api.get("/parts");
                setParts(partsRes.data);

                const orderRes = await RepairOrderApi.getById(id);
                const order = orderRes.data.data;
                setForm({
                    customerId: order.customerId?._id || "",
                    items: order.items.map(i => ({
                        partId: i.partId?._id || i.partId,
                        quantity: i.quantity
                    })),
                    repairCosts: order.repairCosts,
                    paymentMethod: order.paymentMethod,
                    notes: order.notes,
                    status: order.status,
                });
            } catch (err) {
                Swal.fire("Lỗi", "Không thể tải dữ liệu!", "error");
            } finally {
                setDataLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleCheckboxChange = (part, checked) => {
        if (checked) {
            setForm(f => ({ ...f, items: [...f.items, { partId: part._id, quantity: 1 }] }));
        } else {
            setForm(f => ({ ...f, items: f.items.filter(item => item.partId !== part._id) }));
        }
    };

    const totalParts = form.items.reduce((sum, item) => {
        const part = parts.find(p => p._id === item.partId);
        return sum + ((part?.price || 0) * (item.quantity || 0));
    }, 0);

    const totalPayment = totalParts + Number(form.repairCosts || 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const validItems = form.items.filter(item => item.partId && item.quantity > 0);
            if (!form.customerId || validItems.length === 0) {
                Swal.fire("Lỗi", "Vui lòng chọn khách hàng và ít nhất 1 phụ tùng!", "error");
                setLoading(false);
                return;
            }
            const itemsWithPrice = validItems.map(item => {
                const part = parts.find(p => p._id === item.partId);
                return {
                    partId: item.partId,
                    quantity: Number(item.quantity),
                    price: part?.price || 0,
                    subtotal: (part?.price || 0) * Number(item.quantity),
                };
            });
            await RepairOrderApi.update(id, {
                customerId: form.customerId,
                items: itemsWithPrice,
                repairCosts: Number(form.repairCosts),
                paymentMethod: form.paymentMethod,
                notes: form.notes,
                status: form.status || "Pending",
            });
            Swal.fire({ title: "Cập nhật thành công!", icon: "success", timer: 1500, showConfirmButton: false })
                .then(() => navigate("/repair-orders"));
        } catch (err) {
            Swal.fire("Lỗi", err.response?.data?.message || "Cập nhật thất bại!", "error");
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => new Intl.NumberFormat("vi-VN").format(price || 0);

    if (dataLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-pulse text-gray-400">Đang tải...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-sky-50">
            <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-400 text-white">
                <div className="max-w-5xl mx-auto px-4 py-8">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm mb-3">
                            <Edit2 className="w-7 h-7" />
                        </div>
                        <h1 className="text-3xl font-bold mb-1">Chỉnh Sửa Phiếu Sửa Chữa</h1>
                        <p className="text-white/80 text-sm">
                            Nhân viên: {employee?.user?.fullName || employee?.user?.email || "..."}
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 -mt-4 pb-8">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-6 md:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <User className="w-4 h-4 inline mr-2 text-blue-500" />
                                        Khách hàng
                                    </label>
                                    <select
                                        name="customerId"
                                        value={form.customerId}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    >
                                        <option value="">-- Chọn khách hàng --</option>
                                        {customers.map(c => (
                                            <option key={c._id} value={c._id}>
                                                {c.fullName || c.email} {c.phoneNumber ? `- ${c.phoneNumber}` : ""}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <DollarSign className="w-4 h-4 inline mr-2 text-green-500" />
                                        Chi phí sửa chữa
                                    </label>
                                    <input
                                        type="number"
                                        name="repairCosts"
                                        value={form.repairCosts}
                                        onChange={handleChange}
                                        min={0}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        placeholder="0"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <ClipboardList className="w-4 h-4 inline mr-2 text-blue-500" />
                                        Trạng thái
                                    </label>
                                    <select
                                        name="status"
                                        value={form.status}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    >
                                        {statusOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <CreditCard className="w-4 h-4 inline mr-2 text-purple-500" />
                                        Thanh toán
                                    </label>
                                    <div className="flex gap-4">
                                        {paymentOptions.map(opt => (
                                            <label key={opt.value} className={`flex-1 p-3 border-2 rounded-xl cursor-pointer text-center transition-all ${form.paymentMethod === opt.value ? "border-amber-500 bg-amber-50" : "border-gray-200 hover:border-gray-300"}`}>
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value={opt.value}
                                                    checked={form.paymentMethod === opt.value}
                                                    onChange={handleChange}
                                                    className="sr-only"
                                                    required
                                                />
                                                {opt.label}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FileText className="w-4 h-4 inline mr-2 text-gray-400" />
                                        Ghi chú
                                    </label>
                                    <textarea
                                        name="notes"
                                        value={form.notes}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                                        placeholder="Ghi chú thêm..."
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Package className="w-4 h-4 text-orange-500" />
                                        Phụ tùng ({form.items.length} đã chọn)
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Tìm..."
                                            value={searchPart}
                                            onChange={e => setSearchPart(e.target.value)}
                                            className="pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-40"
                                        />
                                    </div>
                                </div>
                                <div className="border border-gray-200 rounded-xl overflow-hidden">
                                    <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-100">
                                        {parts
                                            .filter(p => p.name.toLowerCase().includes(searchPart.toLowerCase()) || (p.brandId?.name || "").toLowerCase().includes(searchPart.toLowerCase()))
                                            .map((part) => {
                                                const idx = form.items.findIndex(item => item.partId === part._id);
                                                const checked = idx !== -1;
                                                return (
                                                    <div key={part._id} className={`p-3 flex items-center gap-3 ${checked ? "bg-amber-50" : "hover:bg-gray-50"}`}>
                                                        <input
                                                            type="checkbox"
                                                            checked={checked}
                                                            onChange={e => handleCheckboxChange(part, e.target.checked)}
                                                            className="w-5 h-5 accent-amber-600 rounded"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-gray-800 truncate">{part.name}</p>
                                                            <p className="text-xs text-gray-500">{part.brandId?.name} • {formatPrice(part.price)}₫</p>
                                                        </div>
                                                        {checked && (
                                                            <input
                                                                type="number"
                                                                min={1}
                                                                value={form.items[idx]?.quantity || 1}
                                                                onChange={e => {
                                                                    const val = Number(e.target.value);
                                                                    setForm(f => ({
                                                                        ...f,
                                                                        items: f.items.map(item => item.partId === part._id ? { ...item, quantity: val } : item)
                                                                    }));
                                                                }}
                                                                className="w-16 px-2 py-1 border border-gray-200 rounded-lg text-center"
                                                            />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 max-w-md ml-auto">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tiền phụ tùng</span>
                                        <span>{formatPrice(totalParts)}₫</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Chi phí sửa chữa</span>
                                        <span>{formatPrice(form.repairCosts)}₫</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-amber-200">
                                        <span>Tổng cộng</span>
                                        <span className="text-amber-600">{formatPrice(totalPayment)}₫</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-4 mt-8">
                            <button
                                type="button"
                                onClick={() => navigate("/repair-orders")}
                                className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Quay lại
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                            >
                                <Save className="w-5 h-5" />
                                {loading ? "Đang lưu..." : "Cập nhật"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}