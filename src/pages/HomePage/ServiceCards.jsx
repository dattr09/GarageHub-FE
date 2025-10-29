import React from "react";
import {
  Truck,
  BadgeCheck,
  Headset,
  CreditCard,
} from "lucide-react";

export default function ServiceCards() {
  // Danh sách dịch vụ hiển thị trên trang chủ
  const services = [
    {
      title: "Vận chuyển nhanh chóng",
      desc: "Vận chuyển nhanh chóng trong vòng 48H",
      icon: <Truck className="w-12 h-12 text-blue-500 mb-2" />,
    },
    {
      title: "Sản phẩm chính hãng",
      desc: "Phụ tùng thay thế chính hãng",
      icon: <BadgeCheck className="w-12 h-12 text-green-500 mb-2" />,
    },
    {
      title: "Hỗ trợ tư vấn online",
      desc: "Hỗ trợ tư vấn sản phẩm đa nền tảng",
      icon: <Headset className="w-12 h-12 text-yellow-500 mb-2" />,
    },
    {
      title: "Thanh toán linh hoạt",
      desc: "Thanh toán bằng nhiều hình thức, đa nền tảng",
      icon: <CreditCard className="w-12 h-12 text-purple-500 mb-2" />,
    },
  ];

  // Render danh sách các thẻ dịch vụ
  return (
    <div className="w-full max-w-9xl mx-auto font-poppins">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {services.map((s, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center text-center bg-white rounded-xl shadow p-6 h-full min-h-[220px]"
          >
            {s.icon}
            <div className="font-semibold text-xl text-gray-800 text-center mb-1">{s.title}</div>
            <div className="text-lg text-gray-500 text-center">{s.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}