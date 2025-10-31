import { useEffect, useState } from "react";
import { getAllMotos, deleteMoto } from "../../services/MotoApi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { PlusCircle, ClipboardList, Eye, Edit, Trash2 } from "lucide-react";

export default function MotoList() {
  const [motos, setMotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchMotos = async () => {
    setLoading(true);
    try {
      const data = await getAllMotos();
      setMotos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Lỗi khi lấy danh sách xe:", err);
      Swal.fire({
        title: "Lỗi!",
        text: "Không thể tải danh sách xe.",
        icon: "error",
        confirmButtonText: "OK",
      });
      setMotos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMotos();
  }, []);

  const handleDelete = (licensePlate) => {
    Swal.fire({
      title: "Xác nhận xóa",
      text: "Bạn có chắc chắn muốn xóa xe này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteMoto(licensePlate);
          Swal.fire("Đã xóa!", "Xe đã được xóa thành công.", "success");
          fetchMotos();
        } catch (err) {
          Swal.fire("Lỗi!", "Xóa xe thất bại.", "error");
        }
      }
    });
  };

  // Lọc danh sách xe theo biển số
  const filteredMotos = motos.filter((m) =>
    m.licensePlate?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-md max-w-6xl mx-auto mt-6">
      {/* Tiêu đề */}
      <div className="flex flex-col items-center mb-6">
        <div className="flex items-center gap-2 text-blue-600">
          <ClipboardList className="w-8 h-8" />
          <h2 className="text-3xl font-bold text-blue-800">Danh sách xe máy</h2>
        </div>
      </div>

      {/* Nút thêm xe */}
      <div className="flex justify-end mb-4">
        <button
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
          onClick={() => navigate("/motos/add")}
        >
          <PlusCircle className="w-5 h-5" />
          Thêm xe
        </button>
        <button
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
          onClick={() => navigate("/motos/deleted/list")}
        >
          <Trash2 className="w-5 h-5" />
          Danh sách xe đã xóa
        </button>
      </div>

      {/* Thanh tìm kiếm */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm theo biển số xe..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <svg
            className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </div>
      </div>

      {/* Bảng danh sách */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="text-gray-500 text-lg">Đang tải dữ liệu...</div>
        </div>
      ) : (
        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-left">
              <th className="px-4 py-3">Biển số</th>
              <th className="px-4 py-3">Mẫu xe</th>
              <th className="px-4 py-3">Màu</th>
              <th className="px-4 py-3">Hãng</th>
              <th className="px-4 py-3">Người sở hữu</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredMotos.length > 0 ? (
              filteredMotos.map((m) => (
                <tr
                  key={m._id || m.licensePlate}
                  className="hover:bg-gray-100 transition border-b last:border-none"
                >
                  <td className="px-4 py-3">{m.licensePlate}</td>
                  <td className="px-4 py-3">{m.model}</td>
                  <td className="px-4 py-3">{m.color}</td>
                  <td className="px-4 py-3">{m.brandId?.name || "Không rõ"}</td>
                  <td className="px-4 py-3">
                    {m.userId?.fullName || "Không rõ"}
                  </td>
                  <td className="px-4 py-3 flex justify-center gap-4">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => navigate(`/motos/${m.licensePlate}`)}
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      className="text-yellow-500 hover:text-yellow-700"
                      onClick={() => navigate(`/motos/edit/${m.licensePlate}`)}
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(m.licensePlate)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  Không có xe nào được tìm thấy.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
