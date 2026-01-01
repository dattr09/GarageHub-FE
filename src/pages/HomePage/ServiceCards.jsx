import React from "react";
import { Truck, BadgeCheck, Headset, CreditCard } from "lucide-react";

export default function ServiceCards() {
  const services = [
    {
      title: "Vận chuyển nhanh chóng",
      desc: "Vận chuyển nhanh chóng trong vòng 48H",
      icon: <Truck className="w-10 h-10" />,
      color: "from-blue-500 to-cyan-500",
      bgLight: "bg-blue-50",
    },
    {
      title: "Sản phẩm chính hãng",
      desc: "Phụ tùng thay thế chính hãng",
      icon: <BadgeCheck className="w-10 h-10" />,
      color: "from-green-500 to-emerald-500",
      bgLight: "bg-green-50",
    },
    {
      title: "Hỗ trợ tư vấn online",
      desc: "Hỗ trợ tư vấn sản phẩm đa nền tảng",
      icon: <Headset className="w-10 h-10" />,
      color: "from-amber-500 to-orange-500",
      bgLight: "bg-amber-50",
    },
    {
      title: "Thanh toán linh hoạt",
      desc: "Thanh toán bằng nhiều hình thức",
      icon: <CreditCard className="w-10 h-10" />,
      color: "from-purple-500 to-pink-500",
      bgLight: "bg-purple-50",
    },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {services.map((s, i) => (
          <div
            key={i}
            className="flex flex-col items-center text-center bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100"
          >
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white mb-3 shadow-md`}>
              {s.icon}
            </div>
            <h3 className="font-bold text-gray-800 text-base mb-1">{s.title}</h3>
            <p className="text-sm text-gray-500">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}