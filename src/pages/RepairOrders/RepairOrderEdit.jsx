import { useEffect, useState } from "react";
import api from "../../services/api";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import {
  UserRound,
  Wrench,
  ClipboardList,
  DollarSign,
  FileText,
  CreditCard,
  Save,
  Loader2,
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
    status: "",
  });
  const [loading, setLoading] = useState(false);
  const [paymentOptions] = useState([
    { value: "Tiền mặt", label: "Tiền mặt" },
    { value: "Thẻ", label: "Thẻ" },
  ]);
  const [statusOptions] = useState([
    { value: "Pending", label: "Chờ xử lý" },
    { value: "Processing", label: "Đang sửa" },
    { value: "Completed", label: "Hoàn thành" },
    { value: "Cancelled", label: "Đã hủy" },
  ]);
  const [employee, setEmployee] = useState(null);
  const [searchPart, setSearchPart] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const meRes = await api.get("/users/me");
        setEmployee(meRes.data);

        const usersRes = await api.get("/users");
        setCustomers(
          usersRes.data.filter((u) => u.roles?.includes("customer"))
        );

        const partsRes = await api.get("/parts");
        setParts(partsRes.data);

        // Lấy dữ liệu phiếu sửa chữa
        const orderRes = await RepairOrderApi.getById(id);
        console.log("🧾 Repair order response:", orderRes.data);
        const order = orderRes.data;

        setForm({
          customerId: order.customerId?._id || "",
          items: order.items.map((i) => ({
            partId: i.partId?._id || i.partId,
            quantity: i.quantity,
          })),
          repairCosts: order.repairCosts,
          paymentMethod: order.paymentMethod,
          notes: order.notes,
          status: order.status,
        });
      } catch (err) {
        console.error(
          "❌ Fetch data error:",
          err.response?.data || err.message
        );
        Swal.fire("Lỗi", "Không thể tải dữ liệu!", "error");
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleItemChange = (idx, field, value) => {
    const newItems = [...form.items];
    newItems[idx][field] = value;
    setForm({ ...form, items: newItems });
  };

  // Tính tổng tiền phụ tùng
  const totalParts = form.items.reduce((sum, item) => {
    const part = parts.find((p) => p._id === item.partId);
    return sum + (part?.price || 0) * (item.quantity || 0);
  }, 0);

  // Tổng thanh toán
  const totalPayment = totalParts + Number(form.repairCosts || 0);

  // Xử lý chọn phụ tùng
  const handleCheckboxChange = (part, checked) => {
    if (checked) {
      setForm((f) => ({
        ...f,
        items: [...f.items, { partId: part._id, quantity: 1 }],
      }));
    } else {
      setForm((f) => ({
        ...f,
        items: f.items.filter((item) => item.partId !== part._id),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const validItems = form.items.filter(
        (item) => item.partId && item.quantity > 0
      );
      if (!form.customerId || validItems.length === 0) {
        Swal.fire(
          "Lỗi",
          "Vui lòng chọn khách hàng và ít nhất 1 phụ tùng!",
          "error"
        );
        setLoading(false);
        return;
      }
      const itemsWithPrice = validItems.map((item) => {
        const part = parts.find((p) => p._id === item.partId);
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
      Swal.fire("Thành công", "Đã cập nhật phiếu sửa chữa!", "success").then(
        () => navigate("/repair-orders")
      );
    } catch (err) {
      Swal.fire(
        "Lỗi",
        err.response?.data?.message || "Cập nhật phiếu thất bại!",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-10 border border-gray-100">
      <div className="flex flex-col items-center gap-1 mb-6">
        <div className="flex justify-center items-center gap-3">
          <ClipboardList className="w-8 h-8 text-yellow-600" />
          <h2 className="text-3xl font-bold text-gray-800">
            Chỉnh sửa phiếu sửa chữa
          </h2>
        </div>
        <div className="text-gray-600 text-base">
          Nhân viên:{" "}
          <span className="font-semibold text-blue-700">
            {employee
              ? employee.user?.fullName ||
                employee.user?.name ||
                employee.user?.email ||
                "Chưa xác định"
              : "Đang tải..."}
          </span>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        {/* Hàng 1: 4 trường bên trái & danh sách phụ tùng bên phải */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Cột trái: 4 trường */}
          <div className="space-y-5">
            {/* Khách hàng */}
            <div>
              <label className="flex items-center gap-2 font-medium mb-1 text-gray-700">
                <UserRound className="w-5 h-5 text-blue-500" />
                Khách hàng
              </label>
              <select
                name="customerId"
                value={form.customerId}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-200"
              >
                <option value="">-- Chọn khách hàng --</option>
                {customers.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.fullName || c.name} ({c.email})
                  </option>
                ))}
              </select>
            </div>
            {/* Chi phí sửa chữa */}
            <div>
              <label className="flex items-center gap-2 font-medium mb-1 text-gray-700">
                <DollarSign className="w-5 h-5 text-green-500" />
                Chi phí sửa chữa (ngoài phụ tùng)
              </label>
              <input
                type="number"
                name="repairCosts"
                value={form.repairCosts}
                onChange={handleChange}
                min={0}
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-200"
                placeholder="Nhập chi phí sửa chữa"
              />
            </div>
            {/* Trạng thái phiếu */}
            <div>
              <label className="flex items-center gap-2 font-medium mb-1 text-gray-700">
                <ClipboardList className="w-5 h-5 text-blue-500" />
                Trạng thái phiếu
              </label>
              <select
                name="status"
                value={form.status || "Pending"}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-200"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            {/* Phương thức thanh toán */}
            <div>
              <label className="flex items-center gap-2 font-medium mb-1 text-gray-700">
                <CreditCard className="w-5 h-5 text-purple-500" />
                Phương thức thanh toán
              </label>
              <div className="flex flex-wrap gap-4">
                {paymentOptions.map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={opt.value}
                      checked={form.paymentMethod === opt.value}
                      onChange={handleChange}
                      className="accent-green-600"
                      required
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
          {/* Cột phải: Danh sách phụ tùng */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Wrench className="w-5 h-5 text-orange-500" />
              <span className="font-medium">Danh sách phụ tùng</span>
              <input
                type="text"
                placeholder="Tìm tên hoặc hãng..."
                value={searchPart}
                onChange={(e) => setSearchPart(e.target.value)}
                className="ml-auto border rounded px-2 py-1 w-48 focus:ring-2 focus:ring-orange-200"
              />
            </div>
            <div className="divide-y rounded border bg-gray-50">
              <div className="max-h-[350px] overflow-y-auto">
                {parts
                  .filter(
                    (part) =>
                      part.name
                        .toLowerCase()
                        .includes(searchPart.toLowerCase()) ||
                      (part.brandId?.name || "")
                        .toLowerCase()
                        .includes(searchPart.toLowerCase())
                  )
                  .map((part) => {
                    const idx = form.items.findIndex(
                      (item) => item.partId === part._id
                    );
                    const checked = idx !== -1;
                    return (
                      <div
                        key={part._id}
                        className="flex flex-col md:flex-row md:items-center gap-2 py-3 px-2"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) =>
                              handleCheckboxChange(part, e.target.checked)
                            }
                            className="w-5 h-5 accent-green-600 shrink-0"
                          />
                          <div className="truncate">
                            <span className="font-medium">{part.name}</span>
                            <span className="text-gray-500">
                              {" "}
                              | {part.brandId?.name || "Không rõ"} |{" "}
                            </span>
                            <span className="text-green-700">
                              {part.price?.toLocaleString()}₫
                            </span>
                          </div>
                        </div>
                        {checked && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <input
                              type="number"
                              min={1}
                              value={form.items[idx]?.quantity}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setForm((f) => ({
                                  ...f,
                                  items: f.items.map((item) =>
                                    item.partId === part._id
                                      ? { ...item, quantity: val }
                                      : item
                                  ),
                                }));
                              }}
                              className="border rounded px-2 py-1 w-20"
                              required
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
        {/* Hàng 2: Ghi chú và tổng thanh toán nằm ngang */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 mt-6 items-start">
          {/* Ghi chú bên trái */}
          <div>
            <label className="flex items-center gap-2 font-medium mb-1 text-gray-700">
              <FileText className="w-5 h-5 text-gray-500" />
              Ghi chú
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-gray-200"
              placeholder="Ghi chú thêm (nếu có)"
              rows={3}
            />
          </div>
          {/* Tổng thanh toán bên phải */}
          <div className="flex justify-center md:justify-end mt-6 md:mt-0">
            <div className="bg-gray-50 border rounded p-4 space-y-2 min-w-[300px] max-w-md w-full">
              <div className="flex justify-between font-medium">
                <span>Tổng tiền phụ tùng:</span>
                <span className="text-green-700">
                  {totalParts.toLocaleString()}₫
                </span>
              </div>
              <div className="flex justify-between">
                <span>Chi phí sửa chữa:</span>
                <span>{Number(form.repairCosts || 0).toLocaleString()}₫</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                <span>Tổng thanh toán:</span>
                <span className="text-blue-700">
                  {totalPayment.toLocaleString()}₫
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Nút submit */}
        <div className="flex justify-center mt-8">
          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-lg flex items-center gap-2 font-semibold shadow"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
}
