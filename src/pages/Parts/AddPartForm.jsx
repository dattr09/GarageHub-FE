import React, { useState, useEffect } from "react";
import {
  Save,
  XCircle,
  Package,
  DollarSign,
  Layers,
  Tag,
  Archive,
  Image,
} from "lucide-react";
import { createPart } from "../../services/PartsApi";
import { getAllBrands } from "../../services/BrandApi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const AddPartForm = () => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [empPrice, setEmpPrice] = useState("");
  const [unit, setUnit] = useState("");
  const [limitStock, setLimitStock] = useState(0);
  const [brandId, setBrandId] = useState("");
  const [brands, setBrands] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      alert("Bạn cần đăng nhập để thêm phụ tùng!");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await getAllBrands();
        setBrands(data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };
    fetchBrands();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // ✅ hiển thị ảnh preview
    }
  };

  const validatePrices = () => {
    const buy = Number(buyPrice);
    const emp = Number(empPrice);
    const sell = Number(price);

    if (buy > emp || emp > sell) {
      Swal.fire({
        title: "Lỗi giá trị!",
        text: "Giá nhập ≤ Giá nhân viên ≤ Giá bán.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePrices()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("token"); // 🔑 nếu cần xác thực
      const formData = new FormData();

      formData.append("name", name);
      formData.append("quantity", quantity);
      formData.append("price", price);
      formData.append("buyPrice", buyPrice);
      formData.append("empPrice", empPrice);
      formData.append("unit", unit);
      formData.append("limitStock", limitStock);
      formData.append("brandId", brandId);
      if (imageFile) formData.append("image", imageFile); // ✅ gửi file ảnh

      await createPart(formData, token); // API sẽ là multipart/form-data

      Swal.fire({
        title: "Thành công!",
        text: "Phụ tùng đã được thêm.",
        icon: "success",
        confirmButtonColor: "#3085d6",
      }).then(() => navigate("/parts"));
    } catch (error) {
      console.error("Error adding part:", error);
      Swal.fire({
        title: "Lỗi!",
        text: "Thêm phụ tùng thất bại. Vui lòng thử lại.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 w-full max-w-4xl">
        <div className="flex flex-col items-center justify-center px-6 py-4 border-b border-gray-100">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-2">
            <Package className="text-blue-600 w-6 h-6" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 text-center">
            Thêm phụ tùng
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tên phụ tùng */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-500" /> Tên phụ tùng
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tên phụ tùng"
                required
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            {/* Số lượng */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4 text-gray-500" /> Số lượng
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Số lượng"
                required
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            {/* Giá bán */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-500" /> Giá bán
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Giá bán"
                required
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            {/* Giá nhập */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-500" /> Giá nhập
              </label>
              <input
                type="number"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                placeholder="Giá nhập"
                required
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            {/* Giá bán cho nhân viên */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-500" /> Giá bán cho
                nhân viên
              </label>
              <input
                type="number"
                value={empPrice}
                onChange={(e) => setEmpPrice(e.target.value)}
                placeholder="Giá bán cho nhân viên"
                required
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            {/* Đơn vị */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Archive className="w-4 h-4 text-gray-500" /> Đơn vị
              </label>
              <input
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="Đơn vị (cái, bộ, lít...)"
                required
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            {/* Giới hạn tồn kho */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4 text-gray-500" /> Giới hạn tồn kho
              </label>
              <input
                type="number"
                value={limitStock}
                onChange={(e) => setLimitStock(e.target.value)}
                placeholder="Giới hạn tồn kho tối thiểu"
                required
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>

            {/* Thương hiệu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-500" /> Thương hiệu
              </label>
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                required
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              >
                <option value="">Chọn thương hiệu</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Ảnh */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Image className="w-4 h-4 text-gray-500" /> Chọn ảnh
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
          </div>

          {imagePreview && (
            <div className="mt-6 flex justify-center">
              <img
                src={imagePreview}
                alt="Ảnh đã chọn"
                className="w-32 h-32 object-cover rounded-lg border border-gray-200 shadow-md"
              />
            </div>
          )}

          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/parts")}
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
              <Save className="w-5 h-5" /> {loading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPartForm;
