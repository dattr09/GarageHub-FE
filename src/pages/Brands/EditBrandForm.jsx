import React, { useState, useEffect } from "react";
import { Save, XCircle, Landmark, Image as ImageIcon } from "lucide-react";
import { getBrandById, updateBrand } from "../../services/BrandApi";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const fadeInStyle = `
@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(8px) scale(0.98); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-fade-in {
  animation: fadeIn 0.28s ease-in-out;
}
`;

const EditBrandForm = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [preview, setPreview] = useState(null); // Hiển thị ảnh hiện tại hoặc ảnh mới
  const [file, setFile] = useState(null); // Ảnh mới nếu người dùng chọn lại
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Lấy thông tin thương hiệu hiện tại
  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const brand = await getBrandById(id);
        setName(brand.name);
        setPreview(brand.image); // ảnh hiện tại từ backend
      } catch (error) {
        console.error("Error fetching brand:", error);
        Swal.fire("Lỗi", "Không thể tải thông tin thương hiệu.", "error");
      }
    };
    fetchBrand();
  }, [id]);

  // ✅ Xử lý khi người dùng chọn ảnh mới
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selected);
    }
  };

  // ✅ Gửi cập nhật
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name)
      return Swal.fire("Thiếu tên", "Vui lòng nhập tên thương hiệu", "warning");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (file) formData.append("image", file); // nếu có ảnh mới

      await updateBrand(id, formData); // gửi lên API

      Swal.fire({
        title: "Cập nhật thành công!",
        text: "Thông tin thương hiệu đã được cập nhật.",
        icon: "success",
        confirmButtonColor: "#2563eb",
      }).then(() => navigate("/brands"));
    } catch (error) {
      console.error("Error updating brand:", error);
      Swal.fire({
        title: "Lỗi!",
        text: error.response?.data?.message || "Cập nhật thương hiệu thất bại.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{fadeInStyle}</style>

      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 w-full max-w-2xl animate-fade-in">
          {/* Header */}
          <div className="flex flex-col items-center justify-center px-6 py-4 border-b border-gray-100">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-2">
              <Landmark className="text-blue-600 w-6 h-6" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 text-center">
              Chỉnh sửa thương hiệu
            </h3>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Preview */}
              <div className="flex-none">
                <div className="w-28 h-28 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                  {preview ? (
                    <img
                      src={preview}
                      alt="preview"
                      className="w-full h-full object-contain p-1"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        setPreview(null);
                      }}
                    />
                  ) : (
                    <div className="text-gray-400 text-sm text-center px-2">
                      Preview
                    </div>
                  )}
                </div>
              </div>

              {/* Inputs */}
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-gray-500" /> Tên thương hiệu
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập tên thương hiệu"
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />

                <label className="block text-sm font-medium text-gray-700 mt-4 mb-2 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-gray-500" /> Ảnh thương
                  hiệu (chọn nếu muốn thay)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => navigate("/brands")}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-md shadow-sm flex items-center gap-2"
              >
                <XCircle className="w-5 h-5" /> Hủy
              </button>

              <button
                type="submit"
                disabled={loading}
                className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md flex items-center gap-2 shadow ${
                  loading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                <Save className="w-5 h-5" />
                {loading ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditBrandForm;
