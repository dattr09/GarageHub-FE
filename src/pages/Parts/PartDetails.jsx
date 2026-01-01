import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPartById, getPartReviews, createPartReview } from "../../services/PartsApi";
import { Package, ArrowLeft, Star, Send, User, ShoppingCart, Edit2, Heart, Share2, Check } from "lucide-react";
import { getBackendImgURL } from "../../utils/helper";
import Swal from "sweetalert2";

const PartDetails = () => {
    const { id } = useParams();
    const [part, setPart] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [isAdmin, setIsAdmin] = useState(false);
    const [activeTab, setActiveTab] = useState("info");
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "null");

    useEffect(() => {
        try {
            const userStr = localStorage.getItem("user");
            if (userStr) {
                const u = JSON.parse(userStr);
                const adminCheck =
                    (Array.isArray(u.roles) && (u.roles.includes("admin") || u.roles.includes("ADMIN"))) ||
                    u.role === "admin" ||
                    u.role === "ADMIN" ||
                    u.isAdmin === true;
                setIsAdmin(adminCheck);
            }
        } catch (e) { }
    }, []);

    useEffect(() => {
        const fetchPart = async () => {
            try {
                const data = await getPartById(id);
                setPart(data);
            } catch (error) {
                console.error("Error fetching part details:", error);
            }
        };

        const fetchReviews = async () => {
            try {
                const data = await getPartReviews(id);
                setReviews(data.reviews || []);
                setAverageRating(data.averageRating || 0);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        fetchPart();
        fetchReviews();
    }, [id]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!user) {
            Swal.fire({
                icon: "warning",
                title: "Cần đăng nhập",
                text: "Vui lòng đăng nhập để đánh giá",
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await createPartReview(id, { rating: newRating, comment: newComment });
            Swal.fire({ icon: "success", title: "Đã gửi đánh giá!", timer: 1500, showConfirmButton: false });
            setNewComment("");
            setNewRating(5);
            const data = await getPartReviews(id);
            setReviews(data.reviews || []);
            setAverageRating(data.averageRating || 0);
        } catch (error) {
            Swal.fire({ icon: "error", title: "Lỗi", text: "Không thể gửi đánh giá" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddToCart = () => {
        if (!part || part.quantity <= 0) return;

        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const idx = cart.findIndex((item) => item.id === (part.id || part._id));

        if (idx >= 0) {
            cart[idx].quantity += quantity;
        } else {
            cart.push({ ...part, id: part.id || part._id, quantity });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartChanged"));

        Swal.fire({
            icon: "success",
            title: "Đã thêm vào giỏ!",
            timer: 1200,
            showConfirmButton: false,
            position: "top-end",
            toast: true,
        });
    };

    if (!part) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-pulse text-gray-400">Đang tải...</div>
            </div>
        );
    }

    const formatPrice = (price) => new Intl.NumberFormat("vi-VN").format(price);

    const formatDate = (date) => new Date(date).toLocaleDateString("vi-VN");

    const renderStars = (rating, size = "w-4 h-4") => (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`${size} ${star <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-200"}`}
                />
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-sky-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate("/parts")}
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Quay lại</span>
                    </button>
                    {isAdmin && (
                        <button
                            onClick={() => navigate(`/parts/edit/${id}`)}
                            className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors"
                        >
                            <Edit2 className="w-4 h-4" />
                            Chỉnh sửa
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-0">
                        {/* Image Section */}
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex items-center justify-center">
                            <div className="relative w-full max-w-md aspect-square">
                                <img
                                    src={getBackendImgURL(part.image)}
                                    alt={part.name}
                                    className="w-full h-full object-contain"
                                />
                                {part.quantity <= 0 && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl">
                                        <span className="bg-red-500 text-white px-6 py-2 rounded-full font-bold">Hết hàng</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Info Section */}
                        <div className="p-8">
                            {/* Brand */}
                            <p className="text-blue-600 font-medium text-sm uppercase tracking-wide mb-2">
                                {part.brandId?.name || "GarageHub"}
                            </p>

                            {/* Name */}
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                {part.name}
                            </h1>

                            {/* Rating */}
                            <div className="flex items-center gap-3 mb-6">
                                {renderStars(averageRating, "w-5 h-5")}
                                <span className="text-lg font-semibold text-gray-700">{averageRating.toFixed(1)}</span>
                                <span className="text-gray-400">|</span>
                                <span className="text-gray-500">{reviews.length} đánh giá</span>
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                                    {formatPrice(part.price)}₫
                                </span>
                            </div>

                            {/* Details */}
                            <div className="space-y-3 mb-6 py-6 border-y border-gray-100">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Đơn vị</span>
                                    <span className="font-medium text-gray-800">{part.unit}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Tồn kho</span>
                                    <span className={`font-medium ${part.quantity > 0 ? "text-green-600" : "text-red-500"}`}>
                                        {part.quantity > 0 ? `${part.quantity} sản phẩm` : "Hết hàng"}
                                    </span>
                                </div>
                            </div>

                            {/* Quantity & Add to Cart */}
                            {part.quantity > 0 && (
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="px-4 py-3 text-gray-600 hover:bg-gray-50"
                                        >
                                            −
                                        </button>
                                        <span className="px-4 py-3 font-medium min-w-[50px] text-center">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(Math.min(part.quantity, quantity + 1))}
                                            className="px-4 py-3 text-gray-600 hover:bg-gray-50"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={part.quantity <= 0}
                                    className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-300 disabled:to-gray-300 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    Thêm vào giỏ hàng
                                </button>
                                <button className="w-14 h-14 border-2 border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:border-red-300 hover:text-red-400 transition-colors">
                                    <Heart className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Features */}
                            <div className="mt-6 flex gap-6 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-green-500" />
                                    Bảo hành chính hãng
                                </div>
                                <div className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-green-500" />
                                    Giao hàng nhanh
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-t border-gray-100">
                        <div className="flex gap-8 px-8">
                            {["info", "reviews"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === tab
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    {tab === "info" ? "Thông tin" : `Đánh giá (${reviews.length})`}
                                </button>
                            ))}
                        </div>

                        <div className="p-8">
                            {activeTab === "info" ? (
                                <div className="prose max-w-none text-gray-600">
                                    <p>Phụ tùng chính hãng từ {part.brandId?.name || "GarageHub"}</p>
                                    <p>Đảm bảo chất lượng, phù hợp với nhiều dòng xe máy phổ biến.</p>
                                </div>
                            ) : (
                                <div>
                                    {/* Review Form */}
                                    {user && (
                                        <form onSubmit={handleSubmitReview} className="bg-gray-50 rounded-2xl p-6 mb-6">
                                            <h4 className="font-semibold text-gray-800 mb-4">Viết đánh giá của bạn</h4>
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="text-gray-600 text-sm">Đánh giá:</span>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setNewRating(star)}
                                                    >
                                                        <Star
                                                            className={`w-7 h-7 cursor-pointer transition-colors ${star <= newRating ? "text-amber-400 fill-amber-400" : "text-gray-300 hover:text-amber-300"
                                                                }`}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="flex gap-3">
                                                <input
                                                    type="text"
                                                    value={newComment}
                                                    onChange={(e) => setNewComment(e.target.value)}
                                                    placeholder="Nhập nhận xét..."
                                                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    required
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:bg-gray-300 flex items-center gap-2"
                                                >
                                                    <Send className="w-4 h-4" />
                                                    Gửi
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    {/* Reviews List */}
                                    <div className="space-y-4">
                                        {reviews.length === 0 ? (
                                            <p className="text-center text-gray-400 py-8">Chưa có đánh giá nào</p>
                                        ) : (
                                            reviews.map((review) => (
                                                <div key={review._id} className="bg-white border border-gray-100 rounded-xl p-4">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white">
                                                            <User className="w-5 h-5" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <span className="font-medium text-gray-800">
                                                                    {review.userName || review.userId?.username || review.userId?.name || "Ẩn danh"}
                                                                </span>
                                                                <span className="text-xs text-gray-400">
                                                                    {formatDate(review.createdAt)}
                                                                </span>
                                                            </div>
                                                            {renderStars(review.rating)}
                                                            <p className="text-gray-600 mt-2">{review.comment}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartDetails;