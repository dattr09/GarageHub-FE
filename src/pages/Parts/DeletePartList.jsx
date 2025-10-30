import React, { useEffect, useState } from "react";
import { Undo2, Trash2, Settings, RotateCcw } from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import {
  getDeletedParts,
  restorePart,
  deletePartPermanently,
} from "../../services/PartsApi";
import { useNavigate } from "react-router-dom";

const fadeInStyle = `
@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(8px) scale(0.98); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-fade-in {
  animation: fadeIn 0.25s ease-in-out;
}
`;

const PartDeletedList = () => {
  const [deletedParts, setDeletedParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Lấy danh sách phụ tùng đã xóa mềm
  useEffect(() => {
    const fetchDeletedParts = async () => {
      try {
        const res = await getDeletedParts();
        setDeletedParts(res.deletedParts || []);
      } catch (error) {
        Swal.fire("Lỗi!", "Không thể tải danh sách phụ tùng đã xóa.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchDeletedParts();
  }, []);

  // ✅ Khôi phục phụ tùng
  const handleRestore = async (id) => {
    Swal.fire({
      title: "Khôi phục phụ tùng?",
      text: "Bạn có chắc muốn khôi phục phụ tùng này?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Khôi phục",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await restorePart(id);
          setDeletedParts(deletedParts.filter((p) => p._id !== id));
          Swal.fire("Thành công!", "Phụ tùng đã được khôi phục.", "success");
        } catch {
          Swal.fire("Lỗi!", "Không thể khôi phục phụ tùng.", "error");
        }
      }
    });
  };

  // ✅ Xóa vĩnh viễn phụ tùng
  const handlePermanentDelete = async (id) => {
    Swal.fire({
      title: "Xóa vĩnh viễn?",
      text: "Thao tác này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa luôn",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deletePartPermanently(id);
          setDeletedParts(deletedParts.filter((p) => p._id !== id));
          Swal.fire("Đã xóa!", "Phụ tùng đã bị xóa vĩnh viễn.", "success");
        } catch {
          Swal.fire("Lỗi!", "Không thể xóa phụ tùng.", "error");
        }
      }
    });
  };

  return (
    <>
      <style>{fadeInStyle}</style>

      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 w-full max-w-6xl animate-fade-in">
          {/* Header */}
          <div className="flex flex-col items-center justify-center px-6 py-4 border-b border-gray-100">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-2">
              <RotateCcw className="text-red-600 w-6 h-6" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 text-center">
              Danh sách phụ tùng đã xóa
            </h3>
          </div>

          {/* Table */}
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            {loading ? (
              <p className="text-center text-gray-500">Đang tải...</p>
            ) : deletedParts.length === 0 ? (
              <p className="text-center text-gray-500">
                Không có phụ tùng nào bị xóa.
              </p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="px-4 py-2 border">Ảnh</th>
                    <th className="px-4 py-2 border">Tên phụ tùng</th>
                    <th className="px-4 py-2 border">Hãng</th>
                    <th className="px-4 py-2 border text-center">Giá bán</th>
                    <th className="px-4 py-2 border">Ngày xóa</th>
                    <th className="px-4 py-2 border text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {deletedParts.map((part) => (
                    <tr key={part._id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-2 border">
                        {part.image ? (
                          <img
                            src={part.image}
                            alt={part.name}
                            className="w-16 h-16 object-contain"
                          />
                        ) : (
                          <Settings className="text-gray-400 w-6 h-6" />
                        )}
                      </td>
                      <td className="px-4 py-2 border font-medium">
                        {part.name}
                      </td>
                      <td className="px-4 py-2 border text-gray-600">
                        {part.brandName || "--"}
                      </td>
                      <td className="px-4 py-2 border text-center text-green-600 font-semibold">
                        {part.price
                          ? part.price.toLocaleString("vi-VN") + " ₫"
                          : "--"}
                      </td>
                      <td className="px-4 py-2 border text-gray-600">
                        {part.deletedAt
                          ? new Date(part.deletedAt).toLocaleString("vi-VN")
                          : "--"}
                      </td>
                      <td className="px-4 py-2 border text-center flex justify-center gap-3">
                        <button
                          onClick={() => handleRestore(part._id)}
                          className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                        >
                          <Undo2 className="w-4 h-4" /> Khôi phục
                        </button>
                        <button
                          onClick={() => handlePermanentDelete(part._id)}
                          className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                        >
                          <Trash2 className="w-4 h-4" /> Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-center items-center py-4 border-t border-gray-100">
            <button
              onClick={() => navigate("/parts")}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-md shadow-sm"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PartDeletedList;
