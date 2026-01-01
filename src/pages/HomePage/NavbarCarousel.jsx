import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  "/public/image5.jpg",
  "/public/image6.jpg",
  "/public/image7.jpg",
  "/public/image8.jpg",
];

const captions = [
  { title: "GarageHub", subtitle: "Giải pháp phụ tùng xe máy toàn diện" },
  { title: "Đa dạng sản phẩm", subtitle: "Chính hãng - Giá tốt - Dịch vụ tận tâm" },
  { title: "Hỗ trợ kỹ thuật", subtitle: "Bảo hành uy tín, tư vấn chuyên nghiệp" },
  { title: "Giao hàng toàn quốc", subtitle: "Đặt hàng nhanh chóng, giá cả cạnh tranh" },
];

export default function NavbarCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prevImage = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);
  const nextImage = () => setCurrent((prev) => (prev + 1) % images.length);

  return (
    <div className="w-full h-[88vh] relative overflow-hidden rounded-2xl">
      {/* Images */}
      {images.map((img, idx) => (
        <img
          key={img}
          src={img}
          alt={`image-${idx + 1}`}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ${current === idx ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-20" />

      {/* Caption */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-30 px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg mb-2 text-center">
          {captions[current].title}
        </h1>
        <p className="text-lg md:text-2xl text-white/90 text-center max-w-2xl">
          {captions[current].subtitle}
        </p>
      </div>

      {/* Navigation Arrows */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center z-40 hover:bg-white/30 transition"
        onClick={prevImage}
        aria-label="Ảnh trước"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center z-40 hover:bg-white/30 transition"
        onClick={nextImage}
        aria-label="Ảnh sau"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-40">
        {images.map((_, idx) => (
          <button
            key={idx}
            className={`h-2 rounded-full transition-all duration-300 ${current === idx
              ? "bg-white w-6"
              : "bg-white/40 w-2 hover:bg-white/60"
              }`}
            onClick={() => setCurrent(idx)}
            aria-label={`Chọn ảnh ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}